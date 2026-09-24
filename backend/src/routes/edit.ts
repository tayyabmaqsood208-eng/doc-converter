import { Router, Request, Response } from 'express';
import fs from 'fs';
import { pdfOps } from '../services/pdf-ops';
import { uploadGuard } from '../middleware/upload-guard';
import { writeOutputFile } from '../services/output-helper';
import { clientError } from '../utils/safe-error';
import { v4 as uuidv4 } from 'uuid';

export const editRouter = Router();

editRouter.post('/edit', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded for editing.' });
    }

    let annotations: Array<{ pageNum: number; text?: string; x: number; y: number }> = [];
    if (req.body.annotations) {
      try {
        const parsed =
          typeof req.body.annotations === 'string' ? JSON.parse(req.body.annotations) : req.body.annotations;
        if (Array.isArray(parsed)) {
          annotations = parsed.slice(0, 50).map((ann: any) => ({
            pageNum: Math.max(1, Number(ann.pageNum) || 1),
            text: typeof ann.text === 'string' ? ann.text.slice(0, 200) : undefined,
            x: Number(ann.x) || 50,
            y: Number(ann.y) || 700
          }));
        }
      } catch {
        annotations = [{ pageNum: 1, text: String(req.body.annotations).slice(0, 200), x: 50, y: 700 }];
      }
    }

    const inputPath = files[0].path;
    const editedBytes = await pdfOps.editPdf(inputPath, annotations);
    fs.unlink(inputPath, () => {});

    const output = writeOutputFile(editedBytes, '.pdf');

    return res.json({
      jobId: uuidv4(),
      status: 'completed',
      downloadUrl: output.downloadUrl,
      fileName: 'DocFlow_Edited_Document.pdf',
      fileSize: output.fileSize
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: clientError(err, 'PDF edit failed. Please try again.') });
  }
});
