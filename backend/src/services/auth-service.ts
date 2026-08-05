import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../../shared/types';
import { planService } from './plan-service';

const JWT_SECRET = process.env.JWT_SECRET || 'docflow-secret-key-chic-girly-2026';

// Pre-seeded users in memory
const usersStore: (User & { passwordHash: string })[] = [
  {
    id: 'user-admin-1',
    email: 'admin@docflow.com',
    name: 'DocFlow Admin ✨',
    role: 'admin',
    planId: 'plan-staff',
    isSuspended: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    passwordHash: bcrypt.hashSync('admin123', 10)
  },
  {
    id: 'user-sample-1',
    email: 'user@docflow.com',
    name: 'Chic User 💕',
    role: 'user',
    planId: 'plan-registered',
    isSuspended: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    passwordHash: bcrypt.hashSync('user123', 10)
  }
];

export const authService = {
  getUsersStore() {
    return usersStore;
  },

  async signup(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    const existing = usersStore.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const defaultPlan = planService.getDefaultPlan();
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User & { passwordHash: string } = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'user',
      planId: defaultPlan.id,
      isSuspended: false,
      createdAt: new Date().toISOString(),
      passwordHash
    };

    usersStore.push(newUser);

    const { passwordHash: _, ...userWithoutPass } = newUser;
    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    return { user: userWithoutPass, token };
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const userRecord = usersStore.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!userRecord) {
      throw new Error('Invalid email or password.');
    }

    if (userRecord.isSuspended) {
      throw new Error('Your account has been suspended by an administrator. Please contact support.');
    }

    const isMatch = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const { passwordHash: _, ...userWithoutPass } = userRecord;
    const token = jwt.sign({ userId: userRecord.id, role: userRecord.role }, JWT_SECRET, { expiresIn: '7d' });

    return { user: userWithoutPass, token };
  },

  verifyToken(token: string): { userId: string; role: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    } catch {
      return null;
    }
  },

  getUserById(id: string): User | undefined {
    const record = usersStore.find(u => u.id === id);
    if (!record) return undefined;
    const { passwordHash: _, ...userWithoutPass } = record;
    return userWithoutPass;
  }
};
