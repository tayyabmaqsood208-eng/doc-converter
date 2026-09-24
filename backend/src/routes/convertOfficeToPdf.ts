import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { conversionEngine } from '../services/conversion-engine';
import { uploadGuard } from '../middleware/upload-guard';
import { buildSignedDownloadUrl } from '../services/download-token';
import { clientError } from '../utils/safe-error';
import { v4 as uuidv4 } from 'uuid';

export const convertOfficeToPdfRouter = Router();

convertOfficeToPdfRouter.post('/convert-office-to-pdf', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No document uploaded for PDF conversion.' });
    }

    const inputPath = files[0].path;
    const pdfPath = await conversionEngine.convertOfficeToPdf(inputPath);
    fs.unlink(inputPath, () => {});

    const pdfFilename = path.basename(pdfPath);
    const stats = fs.statSync(pdfPath);

    return res.json({
      jobId: uuidv4(),
      status: 'completed',
      downloadUrl: buildSignedDownloadUrl(pdfFilename),
      fileName: 'DocFlow_Converted_Document.pdf',
      fileSize: stats.size
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: clientError(err, 'Conversion failed. Please try again.') });
  }
});
