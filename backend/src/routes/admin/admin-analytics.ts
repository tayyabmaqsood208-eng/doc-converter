import { Router, Request, Response } from 'express';
import { adminGuard } from '../../middleware/admin-guard';
import { usageTracker } from '../../services/usage-tracker';

export const adminAnalyticsRouter = Router();

adminAnalyticsRouter.get('/admin/analytics/kpis', adminGuard, (_req: Request, res: Response) => {
  const kpis = usageTracker.getKpiSummary();
  return res.json(kpis);
});

adminAnalyticsRouter.get('/admin/analytics/usage-events', adminGuard, (_req: Request, res: Response) => {
  const events = usageTracker.getAllEvents();
  return res.json({ events });
});

adminAnalyticsRouter.get('/admin/analytics/export-csv', adminGuard, (_req: Request, res: Response) => {
  const events = usageTracker.getAllEvents();

  let csvContent = 'ID,User ID,IP Address,Tool ID,File Size (Bytes),Status,Timestamp,Processing Time (ms)\n';
  events.forEach(e => {
    csvContent += `"${e.id}","${e.userId || 'Anonymous'}","${e.ipAddress || ''}","${e.toolId}",${e.fileSizeBytes},"${e.status}","${e.timestamp}",${e.processingTimeMs}\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="docflow_usage_report.csv"');
  return res.send(csvContent);
});
