// src/app/dashboard/access-control/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccessControlPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || '');
        
        if (user.role !== 'super-admin') {
          router.push('/dashboard');
        }
      } catch {
        router.push('/dashboard');
      }
    } else {
      router.push('/auth/super-admin');
    }
  }, [router]);

  if (userRole !== 'super-admin') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#ef4444',
        fontSize: '1.5rem',
        fontWeight: 600
      }}>
        ⛔ Super Admin Access Required
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>
        Access Control
      </h1>
      <p style={{ color: '#94a3b8' }}>
        Manage permissions and role-based access control.
      </p>
    </div>
  );
}