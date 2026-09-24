import { Router, Request, Response } from 'express';
import { authService } from '../services/auth-service';
import { authGuard } from '../middleware/auth-guard';
import { authRateLimiter } from '../middleware/rate-limiter';
import { clientError } from '../utils/safe-error';

export const authRouter = Router();

authRouter.post('/auth/signup', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const result = await authService.signup(email, password, name);
    return res.json(result);
  } catch (err: unknown) {
    return res.status(400).json({ error: clientError(err, 'Registration failed.') });
  }
});

authRouter.post('/auth/login', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const result = await authService.login(email, password);
    return res.json(result);
  } catch (err: unknown) {
    // Use 401 for failed auth
    return res.status(401).json({ error: clientError(err, 'Invalid email or password.') });
  }
});

authRouter.get('/auth/me', authGuard, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.json({ user: req.user });
});

authRouter.post('/auth/logout', (_req: Request, res: Response) => {
  // JWT is client-held; client must discard the token. Endpoint exists for explicit logout UX.
  return res.json({ ok: true });
});
