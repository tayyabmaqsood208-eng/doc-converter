import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Sun, Moon, User as UserIcon, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('docflow-theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('docflow-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(41, 21, 39, 0.92)' : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1.5px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'background-color 300ms ease'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'var(--color-ink-900)'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'var(--gradient-primary)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(255, 74, 128, 0.3)'
            }}
          >
            <FileText size={24} strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              fontWeight: 800,
              letterSpacing: '-0.03em'
            }}
          >
            Doc<span style={{ color: 'var(--color-primary)' }}>Flow</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/"
            style={{
              color: 'var(--color-ink-900)',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '15px'
            }}
          >
            All Tools
          </Link>

          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ffffff',
                background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
                padding: '6px 14px',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
              }}
            >
              <LayoutDashboard size={15} />
              <span>Admin Panel</span>
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'Night' : 'Day'} Mode`}
          >
            {theme === 'light' ? (
              <>
                <Moon size={16} color="var(--color-primary)" />
                <span>Night 🌙</span>
              </>
            ) : (
              <>
                <Sun size={16} color="#FBBF24" />
                <span>Day ☀️</span>
              </>
            )}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to="/auth/account"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--color-ink-900)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '14px',
                  backgroundColor: 'var(--color-primary-light)',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid var(--color-border)'
                }}
              >
                <UserIcon size={16} color="var(--color-primary)" />
                <span>{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-ink-500)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px'
                }}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to="/auth/login"
                style={{
                  color: 'var(--color-ink-900)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '8px 16px'
                }}
              >
                Log In
              </Link>
              <Link
                to="/auth/signup"
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '14px' }}
              >
                Sign Up ✨
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'none',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '8px',
            color: 'var(--color-ink-900)',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-menu"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            padding: '20px 24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--color-ink-900)',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '16px',
              padding: '8px 0',
              borderBottom: '1px solid var(--color-border)'
            }}
          >
            All Tools 🛠️
          </Link>

          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#ffffff',
                background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
                padding: '10px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '14px'
              }}
            >
              <LayoutDashboard size={18} />
              <span>Admin Panel</span>
            </Link>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Theme Mode</span>
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              style={{ padding: '8px 16px' }}
            >
              {theme === 'light' ? (
                <>
                  <Moon size={16} color="var(--color-primary)" />
                  <span>Night 🌙</span>
                </>
              ) : (
                <>
                  <Sun size={16} color="#FBBF24" />
                  <span>Day ☀️</span>
                </>
              )}
            </button>
          </div>

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
              <Link
                to="/auth/account"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--color-ink-900)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '15px',
                  backgroundColor: 'var(--color-primary-light)',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)'
                }}
              >
                <UserIcon size={18} color="var(--color-primary)" />
                <span>Account ({user.name})</span>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  border: '1.5px solid var(--color-error)',
                  color: 'var(--color-error)',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
              <Link
                to="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: 'var(--color-ink-900)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '15px',
                  padding: '10px 16px',
                  textAlign: 'center',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '12px'
                }}
              >
                Log In
              </Link>
              <Link
                to="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
                style={{ padding: '12px 18px', fontSize: '15px', textAlign: 'center', width: '100%' }}
              >
                Sign Up ✨
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
