import { AdminAuditEntry, GlobalSettings, User } from '../../../shared/types';
import { authService } from './auth-service';
import { fileStore } from './file-store';
import { planService } from './plan-service';

let globalSettings: GlobalSettings = {
  maintenanceMode: false,
  maintenanceMessage: 'DocFlow is currently undergoing scheduled maintenance. New conversions are temporarily paused. Please check back shortly.',
  globalAnonymousLimit: 5,
  disabledTools: []
};

const auditLogStore: AdminAuditEntry[] = [
  {
    id: 'audit-1',
    adminUserId: 'user-admin-1',
    adminEmail: 'admin@docflow.com',
    targetUserId: 'user-sample-1',
    action: 'CREATE_USER',
    details: 'Initial system seed user',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const adminService = {
  getGlobalSettings(): GlobalSettings {
    return globalSettings;
  },

  updateGlobalSettings(adminUser: User, updates: Partial<GlobalSettings>, reason?: string): GlobalSettings {
    globalSettings = { ...globalSettings, ...updates };
    this.logAuditEntry({
      adminUserId: adminUser.id,
      adminEmail: adminUser.email,
      action: 'UPDATE_GLOBAL_SETTINGS',
      details: JSON.stringify(updates),
      reason: reason || 'Updated site settings'
    });
    return globalSettings;
  },

  getAuditLog(): AdminAuditEntry[] {
    return [...auditLogStore].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  logAuditEntry(entry: Omit<AdminAuditEntry, 'id' | 'timestamp'>): AdminAuditEntry {
    const newEntry: AdminAuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    auditLogStore.push(newEntry);
    return newEntry;
  },

  changeUserPlan(adminUser: User, targetUserId: string, newPlanId: string, reason?: string): User {
    const users = authService.getUsersStore();
    const user = users.find(u => u.id === targetUserId);
    if (!user) throw new Error('Target user not found.');

    const oldPlanId = user.planId;
    user.planId = newPlanId;

    this.logAuditEntry({
      adminUserId: adminUser.id,
      adminEmail: adminUser.email,
      targetUserId: user.id,
      action: 'CHANGE_USER_PLAN',
      details: `Plan changed from ${oldPlanId} to ${newPlanId}`,
      reason: reason || 'Admin manual plan update'
    });

    const { passwordHash: _, ...userClean } = user;
    return userClean;
  },

  grantQuotaBump(adminUser: User, targetUserId: string, bumpAmount = 50, reason?: string): User {
    const users = authService.getUsersStore();
    const user = users.find(u => u.id === targetUserId);
    if (!user) throw new Error('Target user not found.');

    user.tempQuotaBump = (user.tempQuotaBump || 0) + bumpAmount;

    this.logAuditEntry({
      adminUserId: adminUser.id,
      adminEmail: adminUser.email,
      targetUserId: user.id,
      action: 'GRANT_QUOTA_BUMP',
      details: `Granted +${bumpAmount} temporary conversions quota bump (Total bump: ${user.tempQuotaBump})`,
      reason: reason || 'Temporary customer support quota bump'
    });

    const { passwordHash: _, ...userClean } = user;
    return userClean;
  },

  toggleUserSuspension(adminUser: User, targetUserId: string, suspend: boolean, reason?: string): User {
    const users = authService.getUsersStore();
    const user = users.find(u => u.id === targetUserId);
    if (!user) throw new Error('Target user not found.');

    user.isSuspended = suspend;

    this.logAuditEntry({
      adminUserId: adminUser.id,
      adminEmail: adminUser.email,
      targetUserId: user.id,
      action: suspend ? 'SUSPEND_USER' : 'REACTIVATE_USER',
      details: suspend ? 'User account suspended' : 'User account reactivated',
      reason: reason || (suspend ? 'Account suspension by admin' : 'Account reactivation by admin')
    });

    const { passwordHash: _, ...userClean } = user;
    return userClean;
  },

  forcePurgeStoredFiles(adminUser: User, reason?: string): number {
    const count = fileStore.purgeExpiredFiles(0); // 0 hours = purge immediately
    this.logAuditEntry({
      adminUserId: adminUser.id,
      adminEmail: adminUser.email,
      action: 'FORCE_PURGE_FILES',
      details: `Immediately purged ${count} temp files from disk store`,
      reason: reason || 'Manual admin emergency file purge'
    });
    return count;
  }
};
