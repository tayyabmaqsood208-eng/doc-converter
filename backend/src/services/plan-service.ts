import { Plan } from '../../../shared/types';

const defaultPlans: Plan[] = [
  {
    id: 'plan-anonymous',
    name: 'Anonymous / Guest',
    priceMonthly: null,
    conversionsPerMonth: 5,
    maxFileSizeMB: 50,
    maxConcurrentJobs: 1,
    toolsAllowed: 'all',
    retentionHours: 1,
    isDefault: false
  },
  {
    id: 'plan-registered',
    name: 'Registered User',
    priceMonthly: null,
    conversionsPerMonth: 50,
    maxFileSizeMB: 100,
    maxConcurrentJobs: 3,
    toolsAllowed: 'all',
    retentionHours: 1,
    isDefault: true
  },
  {
    id: 'plan-staff',
    name: 'Internal / Staff',
    priceMonthly: null,
    conversionsPerMonth: null, // Unlimited
    maxFileSizeMB: 250,
    maxConcurrentJobs: 10,
    toolsAllowed: 'all',
    retentionHours: 24,
    isDefault: false
  }
];

let plansStore: Plan[] = [...defaultPlans];

export const planService = {
  getAllPlans(): Plan[] {
    return plansStore;
  },

  getPlanById(id: string): Plan | undefined {
    return plansStore.find(p => p.id === id);
  },

  getDefaultPlan(): Plan {
    return plansStore.find(p => p.isDefault) || plansStore[1];
  },

  getAnonymousPlan(): Plan {
    return plansStore.find(p => p.id === 'plan-anonymous') || plansStore[0];
  },

  createPlan(planData: Omit<Plan, 'id'>): Plan {
    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      ...planData
    };
    if (newPlan.isDefault) {
      plansStore.forEach(p => p.isDefault = false);
    }
    plansStore.push(newPlan);
    return newPlan;
  },

  updatePlan(id: string, updates: Partial<Plan>): Plan {
    const idx = plansStore.findIndex(p => p.id === id);
    if (idx === -1) {
      throw new Error(`Plan with ID ${id} not found.`);
    }
    if (updates.isDefault) {
      plansStore.forEach(p => p.isDefault = false);
    }
    plansStore[idx] = { ...plansStore[idx], ...updates };
    return plansStore[idx];
  },

  deletePlan(id: string): boolean {
    const initialLen = plansStore.length;
    plansStore = plansStore.filter(p => p.id !== id);
    return plansStore.length < initialLen;
  }
};
