import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileStore } from './file-store';
import { buildSignedDownloadUrl } from './download-token';

export function writeOutputFile(bytes: Uint8Array | Buffer, extension = '.pdf'): {
  filename: string;
  filePath: string;
  downloadUrl: string;
  fileSize: number;
} {
  const safeExt = extension.startsWith('.') ? extension : `.${extension}`;
  const filename = `${uuidv4()}${safeExt}`;
  const filePath = path.join(fileStore.getOutputDir(), filename);
  fs.writeFileSync(filePath, bytes);
  const stats = fs.statSync(filePath);
  return {
    filename,
    filePath,
    downloadUrl: buildSignedDownloadUrl(filename),
    fileSize: stats.size
  };
}
