import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
const OUTPUT_DIR = path.resolve(__dirname, '../../outputs');

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
    const safeExt = extension.startsWith('.') ? extension.replace(/[^\w.]/g, '') : `.${extension.replace(/[^\w]/g, '')}`;
    const filename = `${uuidv4()}${safeExt || '.bin'}`;
    return path.join(OUTPUT_DIR, filename);
  },

  /**
   * Resolve a download filename safely inside OUTPUT_DIR.
   * Rejects path traversal and unexpected characters.
   */
  getDownloadPath(filename: string): string | null {
    if (!filename || typeof filename !== 'string') return null;

    const base = path.basename(filename);
    // Only allow UUID-style names produced by this app (uuid + optional suffix + extension)
    if (!/^[A-Za-z0-9._-]+$/.test(base) || base.includes('..')) return null;

    const resolved = path.resolve(OUTPUT_DIR, base);
    const rootWithSep = OUTPUT_DIR.endsWith(path.sep) ? OUTPUT_DIR : OUTPUT_DIR + path.sep;
    if (resolved !== OUTPUT_DIR && !resolved.startsWith(rootWithSep)) {
      return null;
    }
    return resolved;
  },

  deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`[FileStore] Failed to delete file:`, err.message);
      });
    }
  },

  purgeExpiredFiles(maxAgeHours = 1): number {
    const now = Date.now();
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
    let deletedCount = 0;

    [UPLOAD_DIR, OUTPUT_DIR].forEach((dir) => {
      if (!fs.existsSync(dir)) return;
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const filePath = path.join(dir, file);
        try {
          const stats = fs.statSync(filePath);
          if (now - stats.mtimeMs > maxAgeMs) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        } catch {
          // Ignore locked files
        }
      });
    });

    return deletedCount;
  }
};
