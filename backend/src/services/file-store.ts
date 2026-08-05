import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
const OUTPUT_DIR = path.resolve(__dirname, '../../outputs');

// Ensure directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

export const fileStore = {
  getUploadDir(): string {
    return UPLOAD_DIR;
  },

  getOutputDir(): string {
    return OUTPUT_DIR;
  },

  generateTempFilePath(extension = '.pdf'): string {
    const filename = `${uuidv4()}${extension}`;
    return path.join(OUTPUT_DIR, filename);
  },

  getDownloadPath(filename: string): string {
    return path.join(OUTPUT_DIR, filename);
  },

  deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`[FileStore] Failed to delete file ${filePath}:`, err);
      });
    }
  },

  purgeExpiredFiles(maxAgeHours = 1): number {
    const now = Date.now();
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
    let deletedCount = 0;

    [UPLOAD_DIR, OUTPUT_DIR].forEach(dir => {
      if (!fs.existsSync(dir)) return;
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        try {
          const stats = fs.statSync(filePath);
          if (now - stats.mtimeMs > maxAgeMs) {
            fs.unlinkSync(filePath);
            deletedCount++;
            console.log(`[FileStore Cleanup] Auto-deleted expired file: ${file}`);
          }
        } catch (e) {
          // Ignore locked files
        }
      });
    });

    return deletedCount;
  }
};
