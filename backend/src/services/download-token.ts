import jwt from 'jsonwebtoken';
import { getJwtSecret } from './auth-service';

const DOWNLOAD_TTL = '1h';

export function createDownloadToken(filename: string): string {
  return jwt.sign({ f: filename, t: 'download' }, getJwtSecret(), { expiresIn: DOWNLOAD_TTL });
}

export function verifyDownloadToken(token: string | undefined, filename: string): boolean {
  if (!token || typeof token !== 'string') return false;
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { f?: string; t?: string };
    return decoded.t === 'download' && decoded.f === filename;
  } catch {
    return false;
  }
}

export function buildSignedDownloadUrl(filename: string): string {
  const token = createDownloadToken(filename);
  return `/download/${encodeURIComponent(filename)}?token=${encodeURIComponent(token)}`;
}
