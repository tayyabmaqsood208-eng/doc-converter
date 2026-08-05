import { Router, Request, Response } from 'express';
import { adminGuard } from '../../middleware/admin-guard';
import { planService } from '../../services/plan-service';

export const adminPlansRouter = Router();

adminPlansRouter.get('/admin/plans', adminGuard, (_req: Request, res: Response) => {
  const plans = planService.getAllPlans();
  return res.json({ plans });
});

adminPlansRouter.post('/admin/plans', adminGuard, (req: Request, res: Response) => {
  try {
    const plan = planService.createPlan(req.body);
    return res.json({ plan });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

adminPlansRouter.put('/admin/plans/:id', adminGuard, (req: Request, res: Response) => {
  try {
    const updated = planService.updatePlan(req.params.id, req.body);
    return res.json({ plan: updated });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

adminPlansRouter.delete('/admin/plans/:id', adminGuard, (req: Request, res: Response) => {
  try {
    const success = planService.deletePlan(req.params.id);
    return res.json({ success });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});
