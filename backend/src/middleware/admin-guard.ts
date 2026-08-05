import { Request, Response, NextFunction } from 'express';
import { requireAuth } from './auth-guard';

export function adminGuard(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }
    next();
  });
}
