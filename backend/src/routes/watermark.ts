import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { pdfOps } from '../services/pdf-ops';
import { fileStore } from '../services/file-store';
import { uploadGuard } from '../middleware/upload-guard';

export const watermarkRouter = Router();

watermarkRouter.post('/watermark', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded for watermarking.' });
    }

    const watermarkText = req.body.watermarkText || 'CONFIDENTIAL';
    const inputPath = files[0].path;
    const watermarkedBytes = await pdfOps.watermarkPdf(inputPath, watermarkText);
    fs.unlink(inputPath, () => {});

    const outputFilename = `watermarked_${Date.now()}.pdf`;
    const outputPath = path.join(fileStore.getOutputDir(), outputFilename);
    fs.writeFileSync(outputPath, watermarkedBytes);
    const stats = fs.statSync(outputPath);

    return res.json({
      jobId: `watermark-${Date.now()}`,
      status: 'completed',
      downloadUrl: `/download/${outputFilename}`,
      fileName: 'DocFlow_Watermarked_Document.pdf',
      fileSize: stats.size
    });
  } catch (err: any) {
    return res.status(500).json({ error: `PDF watermark failed: ${err.message}` });
  }
});
