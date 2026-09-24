import { Router, Request, Response } from 'express';
import fs from 'fs';
import { pdfOps } from '../services/pdf-ops';
import { uploadGuard } from '../middleware/upload-guard';
import { writeOutputFile } from '../services/output-helper';
import { clientError } from '../utils/safe-error';
import { v4 as uuidv4 } from 'uuid';

export const securityRouter = Router();

securityRouter.post('/protect', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded for password protection.' });
    }

    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!password || password.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter a valid password to encrypt this document.' });
    }
    if (password.length > 128) {
      return res.status(400).json({ error: 'Password is too long.' });
    }

    const inputPath = files[0].path;
    const protectedBytes = await pdfOps.protectPdf(inputPath, password);
    fs.unlink(inputPath, () => {});

    const output = writeOutputFile(protectedBytes, '.pdf');

    return res.json({
      jobId: uuidv4(),
      status: 'completed',
      downloadUrl: output.downloadUrl,
      fileName: 'DocFlow_Protected_Document.pdf',
      fileSize: output.fileSize
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: clientError(err, 'PDF encryption failed. Please try again.') });
  }
});

securityRouter.post('/unlock', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded for decryption.' });
    }

    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const inputPath = files[0].path;

    try {
      const unlockedBytes = await pdfOps.unlockPdf(inputPath, password);
      fs.unlink(inputPath, () => {});

      const output = writeOutputFile(unlockedBytes, '.pdf');

      return res.json({
        jobId: uuidv4(),
        status: 'completed',
        downloadUrl: output.downloadUrl,
        fileName: 'DocFlow_Unlocked_Document.pdf',
        fileSize: output.fileSize
      });
    } catch {
      fs.unlink(inputPath, () => {});
      return res.status(400).json({
        error: 'Unable to unlock this PDF. Check the password or try a different file.'
      });
    }
  } catch (err: unknown) {
    return res.status(500).json({ error: clientError(err, 'PDF decryption failed. Please try again.') });
  }
});
