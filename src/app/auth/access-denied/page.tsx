// src/app/auth/access-denied/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Lock, Home, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AccessDeniedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reason, setReason] = useState<string>('');
  const [attemptedPath, setAttemptedPath] = useState<string>('');

  useEffect(() => {
    const reasonParam = searchParams.get('reason');
    const attemptedParam = searchParams.get('attempted');
    
    setReason(reasonParam || 'insufficient_permissions');
    setAttemptedPath(attemptedParam || 'unknown');
    
    console.log(`Access denied: ${reasonParam} for ${attemptedParam}`);
  }, [searchParams]);

  const getReasonMessage = () => {
    switch (reason) {
      case 'super_admin_only':
        return 'This area is restricted to Super Administrators only.';
      case 'insufficient_permissions':
        return 'You do not have the required permissions to access this area.';
      case 'not_authenticated':
        return 'You need to be logged in to access this area.';
      default:
        return 'Access to this area is restricted.';
    }
  };

  const getReasonDetails = () => {
    switch (reason) {
      case 'super_admin_only':
        return 'Super Admin features include: Admin Management, Access Control, Audit Logs, Database Access, and System Configuration.';
      default:
        return 'Please contact your system administrator if you believe you should have access.';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '20px',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Icon */}
        <div style={{
          width: '100px',
          height: '100px',
          margin: '0 auto 2rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Lock size={48} style={{ color: '#ef4444' }} />
        </div>

        {/* Title */}
        <h1 style={{
          color: '#ef4444',
          fontSize: '2.5rem',
          fontWeight: '800',
          marginBottom: '1rem',
          letterSpacing: '-0.5px'
        }}>
          ⛔ Access Denied
        </h1>

        {/* Message */}
        <p style={{
          color: '#cbd5e1',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          marginBottom: '1.5rem'
        }}>
          {getReasonMessage()}
        </p>

        {/* Details */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem'
          }}>
            <Shield size={18} style={{ color: '#ef4444' }} />
            <span style={{ color: '#ef4444', fontWeight: '600' }}>Access Control</span>
          </div>
          
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            {getReasonDetails()}
          </p>
          
          {attemptedPath && (
            <p style={{ color: '#64748b', fontSize: '0.85rem', fontFamily: 'monospace' }}>
              Attempted: <code>{attemptedPath}</code>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => router.back()}
            style={{
              padding: '12px 24px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '10px',
              color: '#cbd5e1',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)'}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Home size={16} />
            Go to Dashboard
          </button>
        </div>

        {/* Contact Info */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            If you believe this is an error, contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}