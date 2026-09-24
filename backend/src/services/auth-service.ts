import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { User } from '../../../shared/types';
import { planService } from './plan-service';

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret && secret.length >= 32) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'JWT_SECRET must be set to a strong random value (at least 32 characters) in production.'
    );
  }

  // Dev-only ephemeral secret — not stable across restarts, never use in production.
  console.warn(
    '[Auth] JWT_SECRET missing or too short. Using a temporary development secret. Set JWT_SECRET in .env.'
  );
  return `dev-only-${randomUUID()}-${randomUUID()}`;
}

const JWT_SECRET = resolveJwtSecret();

const usersStore: (User & { passwordHash: string })[] = [];

function seedUsers() {
  const allowDemo = process.env.ALLOW_DEMO_USERS === 'true' && process.env.NODE_ENV !== 'production';

  if (allowDemo) {
    usersStore.push(
      {
        id: 'user-admin-1',
        email: 'admin@docflow.com',
        name: 'DocFlow Admin',
        role: 'admin',
        planId: 'plan-staff',
        isSuspended: false,
        createdAt: new Date().toISOString(),
        passwordHash: bcrypt.hashSync('admin123', 10)
      },
      {
        id: 'user-sample-1',
        email: 'user@docflow.com',
        name: 'Demo User',
        role: 'user',
        planId: 'plan-registered',
        isSuspended: false,
        createdAt: new Date().toISOString(),
        passwordHash: bcrypt.hashSync('user123', 10)
      }
    );
    console.warn('[Auth] Demo users enabled (ALLOW_DEMO_USERS=true). Do not use in production.');
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    if (adminPassword.length < 10) {
      throw new Error('ADMIN_PASSWORD must be at least 10 characters.');
    }
    usersStore.push({
      id: 'user-admin-bootstrap',
      email: adminEmail,
      name: process.env.ADMIN_NAME?.trim() || 'Administrator',
      role: 'admin',
      planId: 'plan-staff',
      isSuspended: false,
      createdAt: new Date().toISOString(),
      passwordHash: bcrypt.hashSync(adminPassword, 12)
    });
    console.log(`[Auth] Bootstrap admin loaded for ${adminEmail}`);
  } else if (process.env.NODE_ENV === 'production' && usersStore.every((u) => u.role !== 'admin')) {
    console.warn(
      '[Auth] No admin user configured. Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.'
    );
  }
}

seedUsers();

export function validatePasswordStrength(password: string): string | null {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  if (password.length > 128) {
    return 'Password must be at most 128 characters.';
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include at least one letter and one number.';
  }
  return null;
}

export function getJwtSecret(): string {
  return JWT_SECRET;
}

export const authService = {
  getUsersStore() {
    return usersStore;
  },

  async signup(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(name).trim().slice(0, 80);

    if (!normalizedEmail || !normalizedName) {
      throw new Error('Name and email are required.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    const passwordError = validatePasswordStrength(password);
    if (passwordError) throw new Error(passwordError);

    const existing = usersStore.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const defaultPlan = planService.getDefaultPlan();
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser: User & { passwordHash: string } = {
      id: `user-${randomUUID()}`,
      email: normalizedEmail,
      name: normalizedName,
      role: 'user',
      planId: defaultPlan.id,
      isSuspended: false,
      createdAt: new Date().toISOString(),
      passwordHash
    };

    usersStore.push(newUser);

    const { passwordHash: _, ...userWithoutPass } = newUser;
    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '12h' });

    return { user: userWithoutPass, token };
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const normalizedEmail = String(email).trim().toLowerCase();
    const userRecord = usersStore.find((u) => u.email.toLowerCase() === normalizedEmail);
    // Constant-ish failure message — do not reveal whether email exists.
    if (!userRecord) {
      throw new Error('Invalid email or password.');
    }

    if (userRecord.isSuspended) {
      throw new Error('Your account has been suspended. Please contact support.');
    }

    const isMatch = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const { passwordHash: _, ...userWithoutPass } = userRecord;
    const token = jwt.sign({ userId: userRecord.id, role: userRecord.role }, JWT_SECRET, { expiresIn: '12h' });

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
    const record = usersStore.find((u) => u.id === id);
    if (!record) return undefined;
    const { passwordHash: _, ...userWithoutPass } = record;
    return userWithoutPass;
  }
};
