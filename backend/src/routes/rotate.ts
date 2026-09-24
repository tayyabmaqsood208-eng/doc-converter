import { Router, Request, Response } from 'express';
import fs from 'fs';
import { pdfOps } from '../services/pdf-ops';
import { uploadGuard } from '../middleware/upload-guard';
import { writeOutputFile } from '../services/output-helper';
import { clientError } from '../utils/safe-error';
import { v4 as uuidv4 } from 'uuid';

export const rotateRouter = Router();

rotateRouter.post('/rotate', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded for rotation.' });
    }

    const angle = parseInt(req.body.rotationAngle || '90', 10);
    const safeAngle = [90, 180, 270, -90, -180, -270].includes(angle) ? angle : 90;
    const inputPath = files[0].path;
    const rotatedBytes = await pdfOps.rotatePdf(inputPath, safeAngle);
    fs.unlink(inputPath, () => {});

    const output = writeOutputFile(rotatedBytes, '.pdf');

    return res.json({
      jobId: uuidv4(),
      status: 'completed',
      downloadUrl: output.downloadUrl,
      fileName: 'DocFlow_Rotated_Document.pdf',
      fileSize: output.fileSize
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: clientError(err, 'PDF rotate failed. Please try again.') });
  }
});
