import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth-service';
import { User } from '../../../shared/types';

// Extend Express Request interface to include optional user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export function authGuard(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    if (decoded) {
      const user = authService.getUserById(decoded.userId);
      if (user && !user.isSuspended) {
        req.user = user;
      }
    }
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  authGuard(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required. Please log in to continue.' });
    }
    next();
  });
}
