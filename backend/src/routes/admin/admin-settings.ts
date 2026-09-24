import { Router, Request, Response } from 'express';
import { adminGuard } from '../../middleware/admin-guard';
import { adminService } from '../../services/admin-service';
import { clientError } from '../../utils/safe-error';

export const adminSettingsRouter = Router();

/** Public, minimal status for maintenance banner — no admin secrets. */
adminSettingsRouter.get('/public/status', (_req: Request, res: Response) => {
  const settings = adminService.getGlobalSettings();
  return res.json({
    maintenanceMode: Boolean(settings.maintenanceMode),
    maintenanceMessage: settings.maintenanceMode
      ? settings.maintenanceMessage || 'System maintenance is in progress.'
      : undefined
  });
});

/** Full settings — admin only */
adminSettingsRouter.get('/admin/settings', adminGuard, (_req: Request, res: Response) => {
  const settings = adminService.getGlobalSettings();
  return res.json({ settings });
});

adminSettingsRouter.put('/admin/settings', adminGuard, (req: Request, res: Response) => {
  try {
    const { reason, ...updates } = req.body;
    const allowed: Record<string, unknown> = {};
    if (typeof updates.maintenanceMode === 'boolean') allowed.maintenanceMode = updates.maintenanceMode;
    if (typeof updates.maintenanceMessage === 'string') {
      allowed.maintenanceMessage = String(updates.maintenanceMessage).slice(0, 500);
    }
    if (typeof updates.globalAnonymousLimit === 'number') {
      allowed.globalAnonymousLimit = Math.max(0, Math.min(1000, Number(updates.globalAnonymousLimit)));
    }
    if (Array.isArray(updates.disabledTools)) {
      allowed.disabledTools = updates.disabledTools.filter((t: unknown) => typeof t === 'string').slice(0, 100);
    }

    const settings = adminService.updateGlobalSettings(req.user!, allowed as any, reason);
    return res.json({ settings });
  } catch (err: unknown) {
    return res.status(400).json({ error: clientError(err, 'Could not update settings.') });
  }
});
