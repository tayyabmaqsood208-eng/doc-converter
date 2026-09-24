import { Router, Request, Response } from 'express';
import fs from 'fs';
import { pdfOps } from '../services/pdf-ops';
import { uploadGuard } from '../middleware/upload-guard';
import { writeOutputFile } from '../services/output-helper';
import { clientError } from '../utils/safe-error';
import { v4 as uuidv4 } from 'uuid';

export const compressRouter = Router();

compressRouter.post('/compress', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded for compression.' });
    }

    const inputPath = files[0].path;
    const compressedBytes = await pdfOps.compressPdf(inputPath);
    fs.unlink(inputPath, () => {});

    const output = writeOutputFile(compressedBytes, '.pdf');

    return res.json({
      jobId: uuidv4(),
      status: 'completed',
      downloadUrl: output.downloadUrl,
      fileName: 'DocFlow_Compressed_Document.pdf',
      fileSize: output.fileSize
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: clientError(err, 'PDF compress failed. Please try again.') });
  }
});
