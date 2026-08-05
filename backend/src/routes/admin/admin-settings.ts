import { Router, Request, Response } from 'express';
import { adminGuard } from '../../middleware/admin-guard';
import { adminService } from '../../services/admin-service';

export const adminSettingsRouter = Router();

adminSettingsRouter.get('/admin/settings', (_req: Request, res: Response) => {
  const settings = adminService.getGlobalSettings();
  return res.json({ settings });
});

adminSettingsRouter.put('/admin/settings', adminGuard, (req: Request, res: Response) => {
  try {
    const { reason, ...updates } = req.body;
    const settings = adminService.updateGlobalSettings(req.user!, updates, reason);
    return res.json({ settings });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});
