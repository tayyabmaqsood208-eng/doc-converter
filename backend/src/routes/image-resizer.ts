import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileStore } from '../services/file-store';
import { uploadGuard } from '../middleware/upload-guard';

export const imageResizerRouter = Router();

imageResizerRouter.post('/image-resizer', uploadGuard, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No image file uploaded for resizing/compression.' });
    }

    const inputPath = files[0].path;
    const originalStats = fs.statSync(inputPath);

    // Options from request body
    const targetKB = req.body.targetKB ? parseInt(req.body.targetKB, 10) : 30; // default 30KB
    const targetWidth = req.body.targetWidth ? parseInt(req.body.targetWidth, 10) : undefined;
    const targetHeight = req.body.targetHeight ? parseInt(req.body.targetHeight, 10) : undefined;
    const outputFormat = req.body.format === 'png' ? 'png' : req.body.format === 'webp' ? 'webp' : 'jpeg';

    const targetBytes = targetKB * 1024;
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    let origW = metadata.width || 1200;
    let origH = metadata.height || 800;

    let finalBuffer: Buffer | null = null;
    let currentQuality = 85;
    let scaleFactor = 1.0;

    // Iterative compression to match requested target size (e.g. 30KB)
    for (let attempt = 0; attempt < 12; attempt++) {
      let w = targetWidth || Math.max(80, Math.round(origW * scaleFactor));
      let h = targetHeight || Math.max(80, Math.round(origH * scaleFactor));

      let instance = sharp(inputPath).resize(w, h, { fit: 'inside' });

      if (outputFormat === 'jpeg') {
        finalBuffer = await instance.jpeg({ quality: currentQuality, mozjpeg: true }).toBuffer();
      } else if (outputFormat === 'webp') {
        finalBuffer = await instance.webp({ quality: currentQuality }).toBuffer();
      } else {
        finalBuffer = await instance.png({ compressionLevel: 9, quality: currentQuality }).toBuffer();
      }

      // Check if file size goal achieved or if quality/scale hit bottom
      if (finalBuffer.length <= targetBytes || (currentQuality <= 15 && scaleFactor <= 0.25)) {
        break;
      }

      // Adjust parameters for next attempt
      if (currentQuality > 25) {
        currentQuality -= 15;
      } else {
        scaleFactor *= 0.75;
      }
    }

    if (!finalBuffer) {
      finalBuffer = fs.readFileSync(inputPath);
    }

    // Cleanup upload input file
    fs.unlink(inputPath, () => {});

    const ext = outputFormat === 'png' ? 'png' : outputFormat === 'webp' ? 'webp' : 'jpg';
    const outputFilename = `resized_${Date.now()}.${ext}`;
    const outputPath = path.join(fileStore.getOutputDir(), outputFilename);

    fs.writeFileSync(outputPath, finalBuffer);

    return res.json({
      jobId: `image-resizer-${Date.now()}`,
      status: 'completed',
      downloadUrl: `/download/${outputFilename}`,
      fileName: `DocFlow_Resized_${targetKB}KB.${ext}`,
      fileSize: finalBuffer.length,
      originalSize: originalStats.size
    });
  } catch (err: any) {
    return res.status(500).json({ error: `Image resizing failed: ${err.message}` });
  }
});
