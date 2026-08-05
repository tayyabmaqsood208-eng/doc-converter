import { UsageEvent, KpiData } from '../../../shared/types';
import { authService } from './auth-service';
import { TOOLS_REGISTRY } from '../../../frontend/src/data/tools-registry';

// Sample usage events store
const usageEventsStore: UsageEvent[] = [
  {
    id: 'evt-1',
    userId: 'user-sample-1',
    ipAddress: '127.0.0.1',
    toolId: 'merge-pdf',
    fileSizeBytes: 1048576,
    status: 'success',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    processingTimeMs: 450
  },
  {
    id: 'evt-2',
    userId: 'user-sample-1',
    ipAddress: '127.0.0.1',
    toolId: 'compress-pdf',
    fileSizeBytes: 3145728,
    status: 'success',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    processingTimeMs: 820
  },
  {
    id: 'evt-3',
    userId: null,
    ipAddress: '192.168.1.10',
    toolId: 'pdf-to-word',
    fileSizeBytes: 2097152,
    status: 'success',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    processingTimeMs: 1250
  }
];

export const usageTracker = {
  logEvent(eventData: Omit<UsageEvent, 'id' | 'timestamp'>): UsageEvent {
    const event: UsageEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...eventData
    };
    usageEventsStore.push(event);
    return event;
  },

  getEventsForUser(userId: string): UsageEvent[] {
    return usageEventsStore
      .filter(e => e.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getEventsForIp(ipAddress: string): UsageEvent[] {
    return usageEventsStore
      .filter(e => e.ipAddress === ipAddress)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getAllEvents(): UsageEvent[] {
    return [...usageEventsStore].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getKpiSummary(): KpiData {
    const allUsers = authService.getUsersStore();
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const startOfToday = new Date().setHours(0,0,0,0);
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();

    const activeUsers30d = allUsers.filter(u => new Date(u.createdAt).getTime() >= thirtyDaysAgo || true).length;
    const todayEvents = usageEventsStore.filter(e => new Date(e.timestamp).getTime() >= startOfToday);
    const monthEvents = usageEventsStore.filter(e => new Date(e.timestamp).getTime() >= startOfMonth);

    // Count by tool
    const toolCounts: Record<string, number> = {};
    usageEventsStore.forEach(e => {
      toolCounts[e.toolId] = (toolCounts[e.toolId] || 0) + 1;
    });

    const topTools = Object.keys(toolCounts)
      .map(toolId => ({ toolId, count: toolCounts[toolId] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const failedCount = usageEventsStore.filter(e => e.status === 'failed').length;
    const failureRatePercent = usageEventsStore.length > 0 
      ? Math.round((failedCount / usageEventsStore.length) * 100)
      : 0;

    return {
      totalUsers: allUsers.length,
      activeUsers30d,
      totalConversionsToday: todayEvents.length,
      totalConversionsThisMonth: monthEvents.length,
      topTools,
      currentJobQueueDepth: 0,
      failureRatePercent
    };
  }
};
