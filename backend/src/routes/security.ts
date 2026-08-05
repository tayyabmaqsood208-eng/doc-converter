import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { pdfOps } from '../services/pdf-ops';
import { fileStore } from '../services/file-store';
import { uploadGuard } from '../middleware/upload-guard';

export const securityRouter = Router();

securityRouter.post('/protect', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded for password protection.' });
    }

    const password = req.body.password;
    if (!password || password.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter a valid password to encrypt this document.' });
    }

    const inputPath = files[0].path;
    const protectedBytes = await pdfOps.protectPdf(inputPath, password);
    fs.unlink(inputPath, () => {});

    const outputFilename = `protected_${Date.now()}.pdf`;
    const outputPath = path.join(fileStore.getOutputDir(), outputFilename);
    fs.writeFileSync(outputPath, protectedBytes);
    const stats = fs.statSync(outputPath);

    return res.json({
      jobId: `protect-${Date.now()}`,
      status: 'completed',
      downloadUrl: `/download/${outputFilename}`,
      fileName: 'DocFlow_Protected_Document.pdf',
      fileSize: stats.size
    });
  } catch (err: any) {
    return res.status(500).json({ error: `PDF encryption failed: ${err.message}` });
  }
});

securityRouter.post('/unlock', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded for decryption.' });
    }

    const password = req.body.password;
    const inputPath = files[0].path;

    try {
      const unlockedBytes = await pdfOps.unlockPdf(inputPath, password);
      fs.unlink(inputPath, () => {});

      const outputFilename = `unlocked_${Date.now()}.pdf`;
      const outputPath = path.join(fileStore.getOutputDir(), outputFilename);
      fs.writeFileSync(outputPath, unlockedBytes);
      const stats = fs.statSync(outputPath);

      return res.json({
        jobId: `unlock-${Date.now()}`,
        status: 'completed',
        downloadUrl: `/download/${outputFilename}`,
        fileName: 'DocFlow_Unlocked_Document.pdf',
        fileSize: stats.size
      });
    } catch (passErr) {
      fs.unlink(inputPath, () => {});
      return res.status(400).json({
        error: 'This file is password-protected — enter the correct password to unlock and continue.'
      });
    }
  } catch (err: any) {
    return res.status(500).json({ error: `PDF decryption failed: ${err.message}` });
  }
});
