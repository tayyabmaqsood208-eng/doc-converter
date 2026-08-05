import { Request, Response, NextFunction } from 'express';
import FileType from 'file-type';
import fs from 'fs';
import { TOOLS_REGISTRY } from '../../../frontend/src/data/tools-registry';

const ALLOWED_MIMES_BY_EXT: Record<string, string[]> = {
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword', 'application/x-ole-storage'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'],
  '.ppt': ['application/vnd.ms-powerpoint', 'application/x-ole-storage'],
  '.pptx': ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/zip'],
  '.xls': ['application/vnd.ms-excel', 'application/x-ole-storage'],
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip'],
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png'],
  '.webp': ['image/webp']
};

export async function uploadGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const toolId = req.params.toolId || req.body.toolId || 'merge-pdf';
    const tool = TOOLS_REGISTRY.find(t => t.id === toolId);

    const maxSizeBytes = (tool ? tool.maxSizeMB : 50) * 1024 * 1024;

    for (const file of files) {
      if (file.size > maxSizeBytes) {
        fs.unlink(file.path, () => {});
        return res.status(400).json({
          error: `File "${file.originalname}" exceeds the maximum allowed size limit of ${tool ? tool.maxSizeMB : 50}MB.`
        });
      }

      const detected = await FileType.fromFile(file.path);
      const ext = '.' + file.originalname.split('.').pop()?.toLowerCase();
      const validMimes = ALLOWED_MIMES_BY_EXT[ext] || [];

      if (detected) {
        const detectedMimeStr = String(detected.mime);
        const isPdfMagic = ext === '.pdf' && detectedMimeStr === 'application/pdf';
        const isZipOfficeMagic = (ext.endsWith('x')) && (detectedMimeStr === 'application/zip' || detectedMimeStr.includes('officedocument'));
        const isMsOleMagic = (ext.endsWith('.doc') || ext.endsWith('.ppt') || ext.endsWith('.xls')) && (detectedMimeStr.includes('ms-') || detectedMimeStr.includes('storage') || detectedMimeStr.includes('cfb'));
        const isImageMagic = (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp') && detectedMimeStr.startsWith('image/');

        if (!isPdfMagic && !isZipOfficeMagic && !isMsOleMagic && !isImageMagic && !validMimes.includes(detectedMimeStr)) {
          fs.unlink(file.path, () => {});
          return res.status(400).json({
            error: `File content validation failed for "${file.originalname}". Real file signature (${detectedMimeStr}) does not match allowed format.`
          });
        }
      } else if (ext === '.pdf') {
        const buffer = Buffer.alloc(5);
        const fd = fs.openSync(file.path, 'r');
        fs.readSync(fd, buffer, 0, 5, 0);
        fs.closeSync(fd);

        if (buffer.toString('utf-8') !== '%PDF-') {
          fs.unlink(file.path, () => {});
          return res.status(400).json({
            error: `Invalid file content in "${file.originalname}". File is missing valid PDF header signature.`
          });
        }
      }
    }

    next();
  } catch (err: any) {
    return res.status(500).json({ error: `File validation middleware error: ${err.message}` });
  }
}
