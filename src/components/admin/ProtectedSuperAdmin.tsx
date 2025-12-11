// src/components/admin/ProtectedSuperAdmin.tsx - FIXED VERSION
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/firebase';
import { AdminAuthService } from '@/lib/admin-auth.service';

interface ProtectedSuperAdminProps {
  children: React.ReactNode;
}

export default function ProtectedSuperAdmin({ children }: ProtectedSuperAdminProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // REMOVED: checkAuth(); - This function doesn't exist
    
    // Listen for auth state changes
    const unsubscribe = adminAuth.onAuthStateChanged(async (user) => {
      if (user) {
        const isAdmin = await AdminAuthService.isSuperAdmin(user.uid);
        setIsAuthenticated(isAdmin);
        if (!isAdmin) {
          router.push('/auth/super-admin');
        }
      } else {
        router.push('/auth/super-admin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}