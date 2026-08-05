export type ToolCategory = 
  | 'all'
  | 'organize'
  | 'optimize'
  | 'convert-to-pdf'
  | 'convert-from-pdf'
  | 'security';

export interface ToolDefinition {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ToolCategory;
  accentColorToken: string;
  route: string;
  acceptedTypes: string[];
  acceptedMimeTypes: string[];
  maxSizeMB: number;
  badgeIcons: {
    primary: string;
    secondary: string;
  };
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface ProcessingJobResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  downloadUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export interface PrivacyPolicyInfo {
  retentionWindowHours: number;
  autoDeleteNotice: string;
  securityNotice: string;
}

/* Module 7, 8, 9 Data Models */
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  planId: string;
  isSuspended: boolean;
  createdAt: string;
  tempQuotaBump?: number;
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number | null; // Reserved for future use
  conversionsPerMonth: number | null; // null = unlimited
  maxFileSizeMB: number;
  maxConcurrentJobs: number;
  toolsAllowed: string[] | 'all';
  retentionHours: number;
  isDefault: boolean;
}

export interface UsageEvent {
  id: string;
  userId: string | null; // Null for anonymous guests
  ipAddress?: string;
  toolId: string;
  fileSizeBytes: number;
  status: 'success' | 'failed' | 'rejected_quota';
  timestamp: string;
  processingTimeMs: number;
}

export interface AdminAuditEntry {
  id: string;
  adminUserId: string;
  adminEmail: string;
  targetUserId?: string;
  action: string;
  details: string;
  reason?: string;
  timestamp: string;
}

export interface GlobalSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  globalAnonymousLimit: number;
  disabledTools: string[];
}

export interface UserUsageSummary {
  user: User;
  plan: Plan;
  conversionsUsedThisPeriod: number;
  conversionsRemaining: number | null;
  quotaLimit: number | null;
  recentConversions: UsageEvent[];
}

export interface KpiData {
  totalUsers: number;
  activeUsers30d: number;
  totalConversionsToday: number;
  totalConversionsThisMonth: number;
  topTools: { toolId: string; count: number }[];
  currentJobQueueDepth: number;
  failureRatePercent: number;
}
