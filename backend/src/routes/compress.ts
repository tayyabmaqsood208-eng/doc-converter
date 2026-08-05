import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { pdfOps } from '../services/pdf-ops';
import { fileStore } from '../services/file-store';
import { uploadGuard } from '../middleware/upload-guard';

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

    const outputFilename = `compressed_${Date.now()}.pdf`;
    const outputPath = path.join(fileStore.getOutputDir(), outputFilename);
    fs.writeFileSync(outputPath, compressedBytes);
    const stats = fs.statSync(outputPath);

    return res.json({
      jobId: `compress-${Date.now()}`,
      status: 'completed',
      downloadUrl: `/download/${outputFilename}`,
      fileName: 'DocFlow_Compressed_Document.pdf',
      fileSize: stats.size
    });
  } catch (err: any) {
    return res.status(500).json({ error: `PDF compress failed: ${err.message}` });
  }
});
