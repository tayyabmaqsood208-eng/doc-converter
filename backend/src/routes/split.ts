import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { pdfOps } from '../services/pdf-ops';
import { fileStore } from '../services/file-store';
import { uploadGuard } from '../middleware/upload-guard';

export const splitRouter = Router();

splitRouter.post('/split', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file provided for split.' });
    }

    const inputPath = files[0].path;
    const pageRanges = req.body.pageRanges || 'all';

    const splitResults = await pdfOps.splitPdf(inputPath, pageRanges);
    fs.unlink(inputPath, () => {});

    if (splitResults.length === 0) {
      return res.status(400).json({ error: 'No valid pages were extracted from the PDF.' });
    }

    // Save primary split file
    const primary = splitResults[0];
    const outputFilename = `split_${Date.now()}_${primary.filename}`;
    const outputPath = path.join(fileStore.getOutputDir(), outputFilename);
    fs.writeFileSync(outputPath, primary.bytes);
    const stats = fs.statSync(outputPath);

    return res.json({
      jobId: `split-${Date.now()}`,
      status: 'completed',
      downloadUrl: `/download/${outputFilename}`,
      fileName: `DocFlow_${primary.filename}`,
      fileSize: stats.size
    });
  } catch (err: any) {
    return res.status(500).json({ error: `PDF split failed: ${err.message}` });
  }
});
