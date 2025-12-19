// src/components/admin/RoleBasedWrapper.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import { getCurrentAdmin, requireAdmin } from '@/lib/admin-utils';

interface RoleBasedWrapperProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function RoleBasedWrapper({ 
  children,
  redirectTo = '/auth/super-admin'
}: RoleBasedWrapperProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminAccess = () => {
      setLoading(true);
      
      try {
        // Check if user is logged in as any type of admin
        if (!requireAdmin()) {
          console.log('🔒 Admin access denied, redirecting');
          router.push(redirectTo);
          return;
        }
        
        console.log('✅ Admin access granted');
        setIsAuthorized(true);
        
      } catch (error) {
        console.error('❌ Error checking admin access:', error);
        router.push(redirectTo);
      } finally {
        setLoading(false);
      }
    };

    // Check immediately
    checkAdminAccess();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_user') {
        checkAdminAccess();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router, redirectTo]);

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
        <div style={{ textAlign: 'center' }}>
          <Loader2 
            size={24} 
            style={{ 
              animation: 'spin 1s linear infinite',
              color: '#8b5cf6',
              marginBottom: '1rem'
            }} 
          />
          <p style={{ color: '#cbd5e1' }}>Checking permissions...</p>
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
          maxWidth: '500px'
        }}>
          <AlertTriangle size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Access Denied
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => router.push(redirectTo)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}