import { User, Plan, UserUsageSummary } from '../../../shared/types';
import { planService } from './plan-service';
import { usageTracker } from './usage-tracker';
import { authService } from './auth-service';

export const quotaService = {
  getMonthlyUsageCountForUser(userId: string): number {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
    const events = usageTracker.getEventsForUser(userId);
    return events.filter(e => e.status === 'success' && new Date(e.timestamp).getTime() >= startOfMonth).length;
  },

  getMonthlyUsageCountForIp(ipAddress: string): number {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
    const events = usageTracker.getEventsForIp(ipAddress);
    return events.filter(e => e.status === 'success' && new Date(e.timestamp).getTime() >= startOfMonth).length;
  },

  getUserUsageSummary(user: User): UserUsageSummary {
    const plan = planService.getPlanById(user.planId) || planService.getDefaultPlan();
    const used = this.getMonthlyUsageCountForUser(user.id);
    
    let baseLimit = plan.conversionsPerMonth;
    let effectiveLimit = baseLimit !== null ? baseLimit + (user.tempQuotaBump || 0) : null;
    let remaining = effectiveLimit !== null ? Math.max(0, effectiveLimit - used) : null;

    const recentConversions = usageTracker.getEventsForUser(user.id).slice(0, 20);

    return {
      user,
      plan,
      conversionsUsedThisPeriod: used,
      conversionsRemaining: remaining,
      quotaLimit: effectiveLimit,
      recentConversions
    };
  },

  checkQuotaOrThrow(user: User | null, ipAddress: string): { allowed: boolean; reason?: string } {
    if (user) {
      const summary = this.getUserUsageSummary(user);
      if (summary.quotaLimit !== null && summary.conversionsRemaining !== null && summary.conversionsRemaining <= 0) {
        return {
          allowed: false,
          reason: `You've used ${summary.conversionsUsedThisPeriod}/${summary.quotaLimit} conversions this month. Please try again next month.`
        };
      }
    } else {
      // Anonymous Guest
      const guestPlan = planService.getAnonymousPlan();
      const used = this.getMonthlyUsageCountForIp(ipAddress);
      const limit = guestPlan.conversionsPerMonth || 5;

      if (used >= limit) {
        return {
          allowed: false,
          reason: `Guest limit reached (${used}/${limit} conversions this month). Please sign up for a free account to continue converting documents.`
        };
      }
    }

    return { allowed: true };
  }
};
