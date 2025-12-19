// src/app/auth/super-admin/page.tsx - CLEAN VERSION
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminAuthService } from '@/lib/admin-auth.service';
import Image from 'next/image';
import styles from './super-admin.module.css';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await AdminAuthService.superAdminLogin({ email, password });
      
      if (result.success && result.admin) {
        // The service handles localStorage storage
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Large Floating Logo Above */}
      <div className={styles.logoWrapper}>
        <div className={styles.logoContainer}>
          <div className={styles.logoInner}>
            <Image
              src="/Flowsync.png"
              alt="FlowSync"
              fill
              className={styles.logo}
              priority
            />
          </div>
          <div className={styles.logoGlow}></div>
        </div>
      </div>

      {/* Login Box */}
      <div className={styles.loginBox}>
        <div className={styles.boxHeader}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            Admin Portal
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Sign in with your admin credentials
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '20px',
            color: '#ef4444',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ fontSize: '18px' }}>⚠️</div>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label style={{ 
              display: 'block', 
              color: '#94a3b8', 
              fontSize: '14px',
              marginBottom: '6px',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@flowsync.com"
              required
              disabled={loading}
              className={styles.input}
              style={{ 
                padding: '14px 16px',
                fontSize: '15px'
              }}
            />
          </div>

          <div className={styles.inputGroup} style={{ marginTop: '20px' }}>
            <label style={{ 
              display: 'block', 
              color: '#94a3b8', 
              fontSize: '14px',
              marginBottom: '6px',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className={styles.input}
              style={{ 
                padding: '14px 16px',
                fontSize: '15px'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={styles.submitButton}
            style={{ 
              marginTop: '24px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {loading ? (
              <>
                <div className={styles.spinner} style={{ marginRight: '8px' }}></div>
                Authenticating...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={{ 
          marginTop: '24px', 
          paddingTop: '20px', 
          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '12px', 
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <span>🔒</span>
            <span>Secure admin authentication</span>
          </div>
          <div style={{ 
            fontSize: '11px', 
            color: '#475569',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            <span>⚙️</span>
            <span>Super admin & regular admin access</span>
          </div>
        </div>
      </div>

      {/* Background Effect */}
      <div className={styles.backgroundEffect}></div>
    </div>
  );
}