import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { User, Mail, Lock, Heart } from 'lucide-react';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signup(name, email, password);
      navigate('/auth/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
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
            <Heart size={28} />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Create Your Account ✨</h2>
          <p style={{ color: 'var(--color-ink-500)', fontSize: '15px', marginTop: '6px' }}>
            Get 50 free document conversions every month!
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--color-ink-500)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
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
              Create Password
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
            Create Account 💕
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--color-ink-500)' }}>
          Already have an account?{' '}
          <Link to="/auth/login" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
            Log In ✨
          </Link>
        </div>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
    </div>
  );
};
