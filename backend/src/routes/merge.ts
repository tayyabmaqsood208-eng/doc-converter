import { Router, Request, Response } from 'express';
import fs from 'fs';
import { pdfOps } from '../services/pdf-ops';
import { uploadGuard } from '../middleware/upload-guard';
import { usageTracker } from '../services/usage-tracker';
import { writeOutputFile } from '../services/output-helper';
import { clientError } from '../utils/safe-error';
import { v4 as uuidv4 } from 'uuid';

export const mergeRouter = Router();

mergeRouter.post('/merge', uploadGuard, async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length < 2) {
      return res.status(400).json({ error: 'Please upload at least 2 PDF files to merge.' });
    }

    const filePaths = files.map((f) => f.path);
    const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

    const mergedBytes = await pdfOps.mergePdfs(filePaths);
    const output = writeOutputFile(mergedBytes, '.pdf');
    filePaths.forEach((p) => fs.unlink(p, () => {}));

    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    usageTracker.logEvent({
      userId: req.user ? req.user.id : null,
      ipAddress: ip,
      toolId: 'merge-pdf',
      fileSizeBytes: totalBytes,
      status: 'success',
      processingTimeMs: Date.now() - startTime
    });

    return res.json({
      jobId: uuidv4(),
      status: 'completed',
      downloadUrl: output.downloadUrl,
      fileName: 'DocFlow_Merged_Document.pdf',
      fileSize: output.fileSize
    });
  } catch (err: unknown) {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    usageTracker.logEvent({
      userId: req.user ? req.user.id : null,
      ipAddress: ip,
      toolId: 'merge-pdf',
      fileSizeBytes: 0,
      status: 'failed',
      processingTimeMs: Date.now() - startTime
    });
    return res.status(500).json({ error: clientError(err, 'PDF merge failed. Please try again.') });
  }
});
