import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { fileStore } from './services/file-store';
import { jobQueue } from './services/job-queue';
import { rateLimiter } from './middleware/rate-limiter';
import { quotaGuard } from './middleware/quota-guard';
import { startCleanupWorker } from '../workers/cleanup-worker';

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

// Enable CORS & JSON parsing
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'DocFlow Backend API', frontendUrl: 'http://localhost:3000' });
});

// Multer storage setup with UUID filenames
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, fileStore.getUploadDir());
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

// Middleware for uploading files
app.use('/api', upload.array('files', 20));

// Auth & Account Routes
app.use('/api', authRouter);
app.use('/api', accountRouter);

// Admin Routes (gated server-side by admin-guard)
app.use('/api', adminUsersRouter);
app.use('/api', adminPlansRouter);
app.use('/api', adminAnalyticsRouter);
app.use('/api', adminAuditRouter);
app.use('/api', adminSettingsRouter);

// Tool Conversion Routes (gated by quotaGuard)
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

// Job Status Polling Endpoint
app.get('/api/jobs/:id', (req, res) => {
  const job = jobQueue.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  return res.json(job);
});

// File Download Endpoint
app.get('/api/download/:filename', (req, res) => {
  const filePath = fileStore.getDownloadPath(req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Requested file has expired or was deleted.' });
  }
  return res.download(filePath);
});

// Start retention cleanup worker
startCleanupWorker();

app.listen(PORT, () => {
  console.log(`[DocFlow Backend Server] Listening on http://localhost:${PORT}`);
});
