import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { conversionEngine } from '../services/conversion-engine';
import { uploadGuard } from '../middleware/upload-guard';

export const convertPdfToOfficeRouter = Router();

convertPdfToOfficeRouter.post('/convert-pdf-to-office', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded for conversion.' });
    }

    const inputPath = files[0].path;
    const targetFormat = (req.body.targetFormat || 'docx') as 'docx' | 'pptx' | 'xlsx';
    
    const convertedPath = await conversionEngine.convertPdfToOffice(inputPath, targetFormat);
    fs.unlink(inputPath, () => {});

    const outFilename = path.basename(convertedPath);
    const stats = fs.statSync(convertedPath);

    return res.json({
      jobId: `pdf-office-${Date.now()}`,
      status: 'completed',
      downloadUrl: `/download/${outFilename}`,
      fileName: `DocFlow_Converted_Document.${targetFormat}`,
      fileSize: stats.size
    });
  } catch (err: any) {
    return res.status(500).json({ error: `PDF to Office conversion failed: ${err.message}` });
  }
});
