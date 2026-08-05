import { Router, Request, Response } from 'express';
import { adminGuard } from '../../middleware/admin-guard';
import { authService } from '../../services/auth-service';
import { adminService } from '../../services/admin-service';
import { quotaService } from '../../services/quota-service';

export const adminUsersRouter = Router();

// GET all users with optional search/filter
adminUsersRouter.get('/admin/users', adminGuard, (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase();
  const planId = req.query.planId as string;
  const status = req.query.status as string;

  let users = authService.getUsersStore().map(({ passwordHash: _, ...u }) => u);

  if (query) {
    users = users.filter(u => u.email.toLowerCase().includes(query) || u.name.toLowerCase().includes(query));
  }

  if (planId) {
    users = users.filter(u => u.planId === planId);
  }

  if (status) {
    users = users.filter(u => status === 'suspended' ? u.isSuspended : !u.isSuspended);
  }

  const enrichedUsers = users.map(u => ({
    ...u,
    conversionsThisMonth: quotaService.getMonthlyUsageCountForUser(u.id)
  }));

  return res.json({ users: enrichedUsers });
});

// GET single user detail + usage history
adminUsersRouter.get('/admin/users/:id', adminGuard, (req: Request, res: Response) => {
  const user = authService.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const summary = quotaService.getUserUsageSummary(user);
  return res.json(summary);
});

// POST change user plan
adminUsersRouter.post('/admin/users/:id/plan', adminGuard, (req: Request, res: Response) => {
  try {
    const { planId, reason } = req.body;
    if (!planId) return res.status(400).json({ error: 'planId is required' });

    const updatedUser = adminService.changeUserPlan(req.user!, req.params.id, planId, reason);
    return res.json({ user: updatedUser });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// POST temporary quota bump
adminUsersRouter.post('/admin/users/:id/quota-bump', adminGuard, (req: Request, res: Response) => {
  try {
    const bumpAmount = parseInt(req.body.bumpAmount || '50', 10);
    const reason = req.body.reason;

    const updatedUser = adminService.grantQuotaBump(req.user!, req.params.id, bumpAmount, reason);
    return res.json({ user: updatedUser });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// POST toggle suspension
adminUsersRouter.post('/admin/users/:id/suspend', adminGuard, (req: Request, res: Response) => {
  try {
    const suspend = Boolean(req.body.suspend);
    const reason = req.body.reason;

    const updatedUser = adminService.toggleUserSuspension(req.user!, req.params.id, suspend, reason);
    return res.json({ user: updatedUser });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// POST force-expire stored files
adminUsersRouter.post('/admin/users/:id/purge-files', adminGuard, (req: Request, res: Response) => {
  try {
    const reason = req.body.reason;
    const purgedCount = adminService.forcePurgeStoredFiles(req.user!, reason);
    return res.json({ message: `Purged ${purgedCount} stored files.`, purgedCount });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});
