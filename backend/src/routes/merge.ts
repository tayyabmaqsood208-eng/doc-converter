import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { pdfOps } from '../services/pdf-ops';
import { fileStore } from '../services/file-store';
import { uploadGuard } from '../middleware/upload-guard';
import { usageTracker } from '../services/usage-tracker';

export const mergeRouter = Router();

mergeRouter.post('/merge', uploadGuard, async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length < 2) {
      return res.status(400).json({ error: 'Please upload at least 2 PDF files to merge.' });
    }

    const filePaths = files.map(f => f.path);
    const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

    const mergedBytes = await pdfOps.mergePdfs(filePaths);

    const outputFilename = `merged_${Date.now()}.pdf`;
    const outputPath = path.join(fileStore.getOutputDir(), outputFilename);
    fs.writeFileSync(outputPath, mergedBytes);

    filePaths.forEach(p => fs.unlink(p, () => {}));

    const stats = fs.statSync(outputPath);
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

    // Log Usage Event
    usageTracker.logEvent({
      userId: req.user ? req.user.id : null,
      ipAddress: ip,
      toolId: 'merge-pdf',
      fileSizeBytes: totalBytes,
      status: 'success',
      processingTimeMs: Date.now() - startTime
    });

    return res.json({
      jobId: `merge-${Date.now()}`,
      status: 'completed',
      downloadUrl: `/download/${outputFilename}`,
      fileName: 'DocFlow_Merged_Document.pdf',
      fileSize: stats.size
    });
  } catch (err: any) {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    usageTracker.logEvent({
      userId: req.user ? req.user.id : null,
      ipAddress: ip,
      toolId: 'merge-pdf',
      fileSizeBytes: 0,
      status: 'failed',
      processingTimeMs: Date.now() - startTime
    });
    return res.status(500).json({ error: `PDF merge failed: ${err.message}` });
  }
});
