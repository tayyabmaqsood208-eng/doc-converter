import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin-service';
import { quotaService } from '../services/quota-service';
import { authGuard } from './auth-guard';

export function quotaGuard(req: Request, res: Response, next: NextFunction) {
  authGuard(req, res, () => {
    // 1. Check Global Maintenance Mode
    const settings = adminService.getGlobalSettings();
    if (settings.maintenanceMode) {
      // Admins bypass maintenance mode
      if (!req.user || req.user.role !== 'admin') {
        return res.status(503).json({
          error: settings.maintenanceMessage || 'Maintenance Mode active. New conversions are temporarily paused.'
        });
      }
    }

    // 2. Check disabled tool feature flags
    const toolId = req.params.toolId || req.body.toolId || '';
    if (toolId && settings.disabledTools.includes(toolId)) {
      return res.status(403).json({
        error: `The ${toolId} tool is temporarily disabled by system administrators.`
      });
    }

    // 3. Check Conversion Quotas
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const quotaCheck = quotaService.checkQuotaOrThrow(req.user || null, ip);

    if (!quotaCheck.allowed) {
      return res.status(429).json({ error: quotaCheck.reason });
    }

    next();
  });
}
