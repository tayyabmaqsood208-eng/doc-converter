import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { pdfOps } from '../services/pdf-ops';
import { fileStore } from '../services/file-store';
import { uploadGuard } from '../middleware/upload-guard';

export const rotateRouter = Router();

rotateRouter.post('/rotate', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded for rotation.' });
    }

    const angle = parseInt(req.body.rotationAngle || '90', 10);
    const inputPath = files[0].path;
    const rotatedBytes = await pdfOps.rotatePdf(inputPath, angle);
    fs.unlink(inputPath, () => {});

    const outputFilename = `rotated_${Date.now()}.pdf`;
    const outputPath = path.join(fileStore.getOutputDir(), outputFilename);
    fs.writeFileSync(outputPath, rotatedBytes);
    const stats = fs.statSync(outputPath);

    return res.json({
      jobId: `rotate-${Date.now()}`,
      status: 'completed',
      downloadUrl: `/download/${outputFilename}`,
      fileName: 'DocFlow_Rotated_Document.pdf',
      fileSize: stats.size
    });
  } catch (err: any) {
    return res.status(500).json({ error: `PDF rotate failed: ${err.message}` });
  }
});
