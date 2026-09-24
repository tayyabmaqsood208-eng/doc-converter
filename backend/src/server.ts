import './load-env';

import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { fileStore } from './services/file-store';
import { jobQueue } from './services/job-queue';
import { rateLimiter } from './middleware/rate-limiter';
import { quotaGuard } from './middleware/quota-guard';
import { startCleanupWorker } from '../workers/cleanup-worker';
import { verifyDownloadToken } from './services/download-token';

import { authRouter } from './routes/auth';
import { accountRouter } from './routes/account';
import { adminUsersRouter } from './routes/admin/admin-users';
import { adminPlansRouter } from './routes/admin/admin-plans';
import { adminAnalyticsRouter } from './routes/admin/admin-analytics';
import { adminAuditRouter } from './routes/admin/admin-audit';
import { adminSettingsRouter } from './routes/admin/admin-settings';

import { mergeRouter } from './routes/merge';
import { splitRouter } from './routes/split';
import { compressRouter } from './routes/compress';
import { convertOfficeToPdfRouter } from './routes/convertOfficeToPdf';
import { convertPdfToOfficeRouter } from './routes/convertPdfToOffice';
import { rotateRouter } from './routes/rotate';
import { watermarkRouter } from './routes/watermark';
import { securityRouter } from './routes/security';
import { editRouter } from './routes/edit';
import { imageResizerRouter } from './routes/image-resizer';

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.TRUST_PROXY === 'true' || process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Same-origin / server-to-server / curl with no Origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) {
        // Single-service deploy: allow any origin only in development
        if (process.env.NODE_ENV !== 'production') return callback(null, true);
        return callback(null, true); // same-origin SPA served by this server
      }
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-XSS-Protection', '0');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(rateLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'DocFlow' });
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, fileStore.getUploadDir());
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).slice(0, 20);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

app.use('/api', upload.array('files', 20));

app.use('/api', authRouter);
app.use('/api', accountRouter);

app.use('/api', adminUsersRouter);
app.use('/api', adminPlansRouter);
app.use('/api', adminAnalyticsRouter);
app.use('/api', adminAuditRouter);
app.use('/api', adminSettingsRouter);

app.use('/api', quotaGuard, mergeRouter);
app.use('/api', quotaGuard, splitRouter);
app.use('/api', quotaGuard, compressRouter);
app.use('/api', quotaGuard, convertOfficeToPdfRouter);
app.use('/api', quotaGuard, convertPdfToOfficeRouter);
app.use('/api', quotaGuard, rotateRouter);
app.use('/api', quotaGuard, watermarkRouter);
app.use('/api', quotaGuard, securityRouter);
app.use('/api', quotaGuard, editRouter);
app.use('/api', quotaGuard, imageResizerRouter);

app.get('/api/jobs/:id', (req, res) => {
  // Job IDs are UUIDs — treat as capability URLs; do not leak internal task details
  const job = jobQueue.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  return res.json({
    jobId: job.jobId,
    status: job.status,
    progress: job.progress,
    downloadUrl: job.downloadUrl,
    fileName: job.fileName,
    fileSize: job.fileSize,
    error: job.status === 'failed' ? 'Processing failed. Please try again.' : undefined
  });
});

app.get('/api/download/:filename', (req, res) => {
  const rawName = path.basename(String(req.params.filename || ''));
  const token = typeof req.query.token === 'string' ? req.query.token : undefined;

  if (!verifyDownloadToken(token, rawName)) {
    return res.status(403).json({ error: 'Invalid or expired download link.' });
  }

  const filePath = fileStore.getDownloadPath(rawName);
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Requested file has expired or was deleted.' });
  }
  return res.download(filePath);
});

function findFrontendDist(): string | null {
  if (process.env.FRONTEND_DIST) return process.env.FRONTEND_DIST;
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, 'frontend', 'dist', 'index.html');
    if (fs.existsSync(candidate)) return path.dirname(candidate);
    dir = path.dirname(dir);
  }
  return null;
}

const frontendDist = findFrontendDist();
if (frontendDist) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'DocFlow Backend API',
      hint: 'Frontend dist not found. Run npm run build from repo root.'
    });
  });
}

startCleanupWorker();

app.listen(PORT, () => {
  console.log(`[DocFlow] Listening on http://localhost:${PORT}`);
});
