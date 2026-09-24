import { Request, Response, NextFunction } from 'express';

type Counter = { count: number; resetTime: number };

function createLimiter(windowMs: number, maxRequests: number, message: string) {
  const counts = new Map<string, Counter>();

  return function limiter(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    const record = counts.get(ip);
    if (!record || now > record.resetTime) {
      counts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({ error: message });
    }

    record.count += 1;
    next();
  };
}

/** Global soft limit for all API traffic */
export const rateLimiter = createLimiter(
  15 * 60 * 1000,
  200,
  'Too many requests. Please try again in a few minutes.'
);

/** Stricter limit for login / signup (credential stuffing defense) */
export const authRateLimiter = createLimiter(
  15 * 60 * 1000,
  20,
  'Too many login attempts. Please wait a few minutes and try again.'
);
