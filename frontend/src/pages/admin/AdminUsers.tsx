import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '@shared/types';
import { authClient } from '../../lib/auth-client';
import { Search, UserCheck, UserX, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface EnrichedUser extends User {
  conversionsThisMonth: number;
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<EnrichedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (statusFilter) params.append('status', statusFilter);

    fetch(`http://localhost:5000/api/admin/users?${params.toString()}`, {
      headers: authClient.getAuthHeader()
    })
      .then(res => res.json())
      .then(data => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, statusFilter]);

  return (
    <div className="container" style={{ padding: '40px 0 80px' }}>
      <Link
        to="/admin"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--color-ink-500)',
          textDecoration: 'none',
          marginBottom: '20px',
          fontWeight: 600,
          fontSize: '14px'
        }}
      >
        <ArrowLeft size={16} /> Admin Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '4px' }}>
            User Management 👑
          </h1>
          <p style={{ color: 'var(--color-ink-500)', fontSize: '15px' }}>
            Manage registered accounts, grant quota bumps, update tiers, or suspend users
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1.5px solid var(--color-border)',
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          boxShadow: 'var(--shadow-card-default)'
        }}
      >
        <div style={{ position: 'relative', flexGrow: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--color-ink-500)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-ink-900)',
              fontSize: '14px'
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-ink-900)',
            fontWeight: 600,
            fontSize: '14px'
          }}
        >
          <option value="">All Account Statuses</option>
          <option value="active">Active Only</option>
          <option value="suspended">Suspended Only</option>
        </select>
      </div>

      {/* Users Data Table */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1.5px solid var(--color-border)',
          padding: '24px',
          boxShadow: 'var(--shadow-card-default)'
        }}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>Loading user directory...</div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-ink-500)' }}>
            No matching users found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--color-border)', color: 'var(--color-ink-500)' }}>
                  <th style={{ padding: '12px' }}>User</th>
                  <th style={{ padding: '12px' }}>Role</th>
                  <th style={{ padding: '12px' }}>Tier / Plan</th>
                  <th style={{ padding: '12px' }}>Monthly Conversions</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-ink-900)' }}>{u.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-ink-500)' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: u.role === 'admin' ? 'var(--color-primary-light)' : 'var(--color-bg)',
                        color: u.role === 'admin' ? 'var(--color-primary)' : 'var(--color-ink-700)'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', fontWeight: 600 }}>{u.planId}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {u.conversionsThisMonth} conversions
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      {u.isSuspended ? (
                        <span style={{ color: 'var(--color-error)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <UserX size={16} /> Suspended
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <UserCheck size={16} /> Active
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <Link to={`/admin/users/${u.id}`}>
                        <Button variant="secondary" size="sm">
                          Manage User <ArrowUpRight size={14} />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
