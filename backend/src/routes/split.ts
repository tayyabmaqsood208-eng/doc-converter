import { Router, Request, Response } from 'express';
import fs from 'fs';
import { pdfOps } from '../services/pdf-ops';
import { uploadGuard } from '../middleware/upload-guard';
import { writeOutputFile } from '../services/output-helper';
import { clientError } from '../utils/safe-error';
import { v4 as uuidv4 } from 'uuid';

export const splitRouter = Router();

splitRouter.post('/split', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file provided for split.' });
    }

    const inputPath = files[0].path;
    const pageRanges = String(req.body.pageRanges || 'all').slice(0, 200);

    const splitResults = await pdfOps.splitPdf(inputPath, pageRanges);
    fs.unlink(inputPath, () => {});

    if (splitResults.length === 0) {
      return res.status(400).json({ error: 'No valid pages were extracted from the PDF.' });
    }

    const primary = splitResults[0];
    const output = writeOutputFile(primary.bytes, '.pdf');

    return res.json({
      jobId: uuidv4(),
      status: 'completed',
      downloadUrl: output.downloadUrl,
      fileName: 'DocFlow_Split_Document.pdf',
      fileSize: output.fileSize
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: clientError(err, 'PDF split failed. Please try again.') });
  }
});
