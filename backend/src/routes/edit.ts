import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { pdfOps } from '../services/pdf-ops';
import { fileStore } from '../services/file-store';
import { uploadGuard } from '../middleware/upload-guard';

export const editRouter = Router();

editRouter.post('/edit', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded for editing.' });
    }

    let annotations = [];
    if (req.body.annotations) {
      try {
        annotations = typeof req.body.annotations === 'string'
          ? JSON.parse(req.body.annotations)
          : req.body.annotations;
      } catch (e) {
        annotations = [{ pageNum: 1, text: String(req.body.annotations), x: 50, y: 700 }];
      }
    }

    const inputPath = files[0].path;
    const editedBytes = await pdfOps.editPdf(inputPath, annotations);
    fs.unlink(inputPath, () => {});

    const outputFilename = `edited_${Date.now()}.pdf`;
    const outputPath = path.join(fileStore.getOutputDir(), outputFilename);
    fs.writeFileSync(outputPath, editedBytes);
    const stats = fs.statSync(outputPath);

    return res.json({
      jobId: `edit-${Date.now()}`,
      status: 'completed',
      downloadUrl: `/download/${outputFilename}`,
      fileName: 'DocFlow_Edited_Document.pdf',
      fileSize: stats.size
    });
  } catch (err: any) {
    return res.status(500).json({ error: `PDF edit failed: ${err.message}` });
  }
});
