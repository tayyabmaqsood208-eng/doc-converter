import { Router, Request, Response } from 'express';
import fs from 'fs';
import sharp from 'sharp';
import { uploadGuard } from '../middleware/upload-guard';
import { writeOutputFile } from '../services/output-helper';
import { clientError } from '../utils/safe-error';
import { v4 as uuidv4 } from 'uuid';

export const imageResizerRouter = Router();

imageResizerRouter.post('/image-resizer', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No image file uploaded for resizing/compression.' });
    }

    const inputPath = files[0].path;
    const originalStats = fs.statSync(inputPath);

    const targetKB = Math.min(5000, Math.max(5, parseInt(req.body.targetKB, 10) || 30));
    const targetWidth = req.body.targetWidth ? Math.min(8000, Math.max(16, parseInt(req.body.targetWidth, 10))) : undefined;
    const targetHeight = req.body.targetHeight
      ? Math.min(8000, Math.max(16, parseInt(req.body.targetHeight, 10)))
      : undefined;
    const outputFormat = req.body.format === 'png' ? 'png' : req.body.format === 'webp' ? 'webp' : 'jpeg';

    const targetBytes = targetKB * 1024;
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const origW = metadata.width || 1200;
    const origH = metadata.height || 800;

    let finalBuffer: Buffer | null = null;
    let currentQuality = 85;
    let scaleFactor = 1.0;

    for (let attempt = 0; attempt < 12; attempt++) {
      const w = targetWidth || Math.max(80, Math.round(origW * scaleFactor));
      const h = targetHeight || Math.max(80, Math.round(origH * scaleFactor));

      const instance = sharp(inputPath).resize(w, h, { fit: 'inside' });

      if (outputFormat === 'jpeg') {
        finalBuffer = await instance.jpeg({ quality: currentQuality, mozjpeg: true }).toBuffer();
      } else if (outputFormat === 'webp') {
        finalBuffer = await instance.webp({ quality: currentQuality }).toBuffer();
      } else {
        finalBuffer = await instance.png({ compressionLevel: 9, quality: currentQuality }).toBuffer();
      }

      if (finalBuffer.length <= targetBytes || (currentQuality <= 15 && scaleFactor <= 0.25)) {
        break;
      }

      if (currentQuality > 25) {
        currentQuality -= 15;
      } else {
        scaleFactor *= 0.75;
      }
    }

    if (!finalBuffer) {
      finalBuffer = fs.readFileSync(inputPath);
    }

    fs.unlink(inputPath, () => {});

    const ext = outputFormat === 'png' ? '.png' : outputFormat === 'webp' ? '.webp' : '.jpg';
    const output = writeOutputFile(finalBuffer, ext);

    return res.json({
      jobId: uuidv4(),
      status: 'completed',
      downloadUrl: output.downloadUrl,
      fileName: `DocFlow_Resized_${targetKB}KB${ext}`,
      fileSize: finalBuffer.length,
      originalSize: originalStats.size
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: clientError(err, 'Image resizing failed. Please try again.') });
  }
});
