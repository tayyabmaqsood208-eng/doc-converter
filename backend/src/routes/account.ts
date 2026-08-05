import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth-guard';
import { quotaService } from '../services/quota-service';

export const accountRouter = Router();

accountRouter.get('/account/usage', requireAuth, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const summary = quotaService.getUserUsageSummary(req.user);
  return res.json(summary);
});
