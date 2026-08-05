import { Router, Request, Response } from 'express';
import { adminGuard } from '../../middleware/admin-guard';
import { adminService } from '../../services/admin-service';

export const adminAuditRouter = Router();

adminAuditRouter.get('/admin/audit-log', adminGuard, (_req: Request, res: Response) => {
  const auditLog = adminService.getAuditLog();
  return res.json({ auditLog });
});
