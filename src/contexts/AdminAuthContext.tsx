// src/contexts/AdminAuthContext.tsx - FIXED VERSION
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { adminAuth } from '@/lib/firebase';
import { AdminAuthService } from '@/lib/admin-auth.service';
import { SuperAdmin } from '@/types/admin.types';
import { useRouter } from 'next/navigation';

interface AdminAuthContextType {
  admin: SuperAdmin | null;
  loading: boolean;
  isAuthenticated: boolean;
  checkAdminStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  loading: true,
  isAuthenticated: false,
  checkAdminStatus: async () => false,
  logout: async () => {},
  refreshAdmin: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<SuperAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAdminStatus = useCallback(async (): Promise<boolean> => {
    try {
      const user = adminAuth.currentUser;
      if (!user) {
        setAdmin(null);
        return false;
      }

      const isSuperAdmin = await AdminAuthService.isSuperAdmin(user.uid);
      if (!isSuperAdmin) {
        setAdmin(null);
        return false;
      }

      const adminData = await AdminAuthService.getAdmin(user.uid);
      if (adminData) {
        setAdmin(adminData);
        return true;
      }

      setAdmin(null);
      return false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      setAdmin(null);
      return false;
    }
  }, []);

  const refreshAdmin = useCallback(async () => {
    await checkAdminStatus();
  }, [checkAdminStatus]);

  const logout = useCallback(async () => {
    try {
      // Remove the parameter from superAdminLogout
      await AdminAuthService.superAdminLogout();
      setAdmin(null);
      router.push('/auth/super-admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  useEffect(() => {
    const unsubscribe = adminAuth.onAuthStateChanged(async (user) => {
      if (user) {
        await checkAdminStatus();
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [checkAdminStatus]);

  const value = {
    admin,
    loading,
    isAuthenticated: !!admin,
    checkAdminStatus,
    logout,
    refreshAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}