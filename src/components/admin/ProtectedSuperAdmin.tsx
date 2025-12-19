// src/components/admin/ProtectedSuperAdmin.tsx - ENHANCED VERSION
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { getCurrentAdmin, isSuperAdmin, requireSuperAdmin } from '@/lib/admin-utils';

interface ProtectedSuperAdminProps {
  children: React.ReactNode;
}

export default function ProtectedSuperAdmin({ children }: ProtectedSuperAdminProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkSuperAdminAccess = () => {
      setLoading(true);
      
      try {
        // Get current admin from localStorage
        const admin = getCurrentAdmin();
        
        if (!admin) {
          console.log('🔒 No admin found, redirecting to super admin login');
          router.push('/auth/super-admin');
          return;
        }
        
        // Check if user is super admin
        if (!isSuperAdmin()) {
          console.log('🔒 Not a super admin, redirecting to dashboard');
          router.push('/dashboard');
          return;
        }
        
        // Double check with requireSuperAdmin
        if (!requireSuperAdmin()) {
          console.log('🔒 Super admin access denied');
          router.push('/dashboard');
          return;
        }
        
        console.log('✅ Super admin access granted');
        setIsAuthorized(true);
        
      } catch (error) {
        console.error('❌ Error checking super admin access:', error);
        router.push('/auth/super-admin');
      } finally {
        setLoading(false);
      }
    };

    // Check immediately
    checkSuperAdminAccess();
    
    // Also listen for storage changes (in case user logs out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_user') {
        checkSuperAdminAccess();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)'
          }}>
            <Shield size={28} style={{ color: 'white' }} />
          </div>
          
          <Loader2 
            size={24} 
            style={{ 
              animation: 'spin 1s linear infinite',
              color: '#8b5cf6',
              marginBottom: '1rem'
            }} 
          />
          
          <p style={{ 
            marginTop: '1rem',
            color: '#cbd5e1',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            Verifying Super Admin Access...
          </p>
          
          <p style={{ 
            marginTop: '0.5rem',
            color: '#94a3b8',
            fontSize: '0.875rem'
          }}>
            Checking super administrator privileges
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          maxWidth: '500px',
          margin: '2rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <AlertTriangle size={36} style={{ color: '#ef4444' }} />
          </div>
          
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#ef4444'
          }}>
            ⛔ Super Admin Access Required
          </h2>
          
          <p style={{ 
            color: '#cbd5e1',
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            This area is restricted to super administrators only.
            You need elevated privileges to access this page.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '12px 24px',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '10px',
                color: '#cbd5e1',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)'}
            >
              Go to Dashboard
            </button>
            
            <button
              onClick={() => router.push('/auth/super-admin')}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Super Admin Login
            </button>
          </div>
          
          <p style={{ 
            marginTop: '2rem',
            color: '#94a3b8',
            fontSize: '0.875rem',
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px'
          }}>
            <strong>Note:</strong> Only users with <code style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>role: "super_admin"</code> can access this area.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Add CSS for spinner animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);