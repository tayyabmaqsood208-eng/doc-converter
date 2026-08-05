import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { Lock, Mail, Sparkles, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/auth/account');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@docflow.com');
    setPassword('admin123');
  };

  const fillDemoUser = () => {
    setEmail('user@docflow.com');
    setPassword('user123');
  };

  return (
    <div className="container" style={{ padding: '64px 0 96px', maxWidth: '480px' }}>
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1.5px solid var(--color-border)',
          padding: '40px 32px',
          boxShadow: 'var(--shadow-card-default)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'var(--gradient-primary)',
              borderRadius: '16px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 6px 18px rgba(255, 74, 128, 0.3)'
            }}
          >
            <Sparkles size={28} />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Welcome Back ✨</h2>
          <p style={{ color: 'var(--color-ink-500)', fontSize: '15px', marginTop: '6px' }}>
            Log in to manage your document conversions & quota
          </p>
        </div>

        {/* Demo Login Quick Fill Buttons */}
        <div
          style={{
            backgroundColor: 'var(--color-primary-light)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '24px',
            border: '1px solid var(--color-border)'
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
            ✨ Quick Logins:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={fillDemoAdmin}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid var(--color-primary)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={fillDemoUser}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-ink-900)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              💖 User
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--color-ink-500)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-ink-900)',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--color-ink-500)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-ink-900)',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>

          <Button variant="primary" size="lg" type="submit" isLoading={isLoading} style={{ marginTop: '8px', width: '100%' }}>
            Log In 💕
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--color-ink-500)' }}>
          Don't have an account yet?{' '}
          <Link to="/auth/signup" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
            Sign Up Free ✨
          </Link>
        </div>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
    </div>
  );
};
