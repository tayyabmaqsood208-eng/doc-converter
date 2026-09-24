import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { conversionEngine } from '../services/conversion-engine';
import { uploadGuard } from '../middleware/upload-guard';
import { buildSignedDownloadUrl } from '../services/download-token';
import { clientError } from '../utils/safe-error';
import { v4 as uuidv4 } from 'uuid';

export const convertPdfToOfficeRouter = Router();

convertPdfToOfficeRouter.post('/convert-pdf-to-office', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded for conversion.' });
    }

    const inputPath = files[0].path;
    const requested = String(req.body.targetFormat || 'docx').toLowerCase();
    const targetFormat = (['docx', 'pptx', 'xlsx'].includes(requested) ? requested : 'docx') as
      | 'docx'
      | 'pptx'
      | 'xlsx';

    const convertedPath = await conversionEngine.convertPdfToOffice(inputPath, targetFormat);
    fs.unlink(inputPath, () => {});

    const outFilename = path.basename(convertedPath);
    const stats = fs.statSync(convertedPath);

    return res.json({
      jobId: uuidv4(),
      status: 'completed',
      downloadUrl: buildSignedDownloadUrl(outFilename),
      fileName: `DocFlow_Converted_Document.${targetFormat}`,
      fileSize: stats.size
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: clientError(err, 'Conversion failed. Please try again.') });
  }
});
