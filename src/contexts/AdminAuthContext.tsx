'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { adminAuth } from '@/lib/firebase';
import { AdminAuthService } from '@/lib/admin-auth.service';
import { useRouter } from 'next/navigation';

// Define UserRole types
export type UserRole = 'super_admin' | 'admin';

// Permission Types
export type Permission = 
  | 'users.create'
  | 'users.read'
  | 'users.update'
  | 'users.delete'
  | 'users.bulk_actions'
  | 'users.edit_role'
  | 'settings.access'
  | 'analytics.view'
  | 'devices.manage'
  | 'alerts.manage'
  | 'reports.generate'
  | 'dashboard.access'
  | 'audit.view';

// Role-Permission Mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    // User Management
    'users.create',
    'users.read',
    'users.update',
    'users.delete',
    'users.bulk_actions',
    'users.edit_role',
    
    // System Access
    'settings.access',
    'analytics.view',
    'devices.manage',
    'alerts.manage',
    'reports.generate',
    'dashboard.access',
    'audit.view'
  ],
  admin: [
    // Limited User Management
    'users.read',
    'users.update',  // Can update but not create/delete
    'users.bulk_actions',
    
    // Limited System Access
    'analytics.view',
    'alerts.manage',
    'dashboard.access'
  ]
};

// Create a complete AdminUser interface with all required properties
interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  status?: 'active' | 'inactive' | 'pending';
  phoneNumber?: string;
  address?: string;
  profileImageUrl?: string;
  isActive?: boolean;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  hasPermission: (permission: Permission) => boolean;
  checkAdminStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  loading: true,
  isAuthenticated: false,
  isSuperAdmin: false,
  isAdmin: false,
  hasPermission: () => false,
  checkAdminStatus: async () => false,
  logout: async () => {},
  refreshAdmin: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getPermissionsForRole = (role: UserRole): Permission[] => {
    return ROLE_PERMISSIONS[role] || [];
  };

  const checkAdminStatus = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔐 AdminAuthContext: Checking admin status...');
      
      // FIRST: Check localStorage (where AdminAuthService stores data)
      const localStorageUser = localStorage.getItem('admin_user');
      console.log('📦 AdminAuthContext: localStorage check:', localStorageUser);
      
      if (localStorageUser) {
        try {
          const userData = JSON.parse(localStorageUser);
          console.log('✅ AdminAuthContext: Found user in localStorage:', {
            email: userData.email,
            role: userData.role,
            userType: userData.userType
          });
          
          // Validate the user data
          if (userData && userData.email && (userData.role || userData.userType)) {
            // Normalize role
            let role: UserRole = 'admin';
            if (userData.role === 'super_admin' || userData.userType === 'super_admin') {
              role = 'super_admin';
            } else if (userData.role === 'admin' || userData.userType === 'admin') {
              role = 'admin';
            }
            
            const permissions = getPermissionsForRole(role);
            
            const adminUser: AdminUser = {
              uid: userData.uid || 'local-user',
              email: userData.email,
              name: userData.name || 'Administrator',
              role: role,
              permissions: permissions,
              createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
              updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
              status: userData.status || 'active',
              isActive: userData.isActive !== false,
              phoneNumber: userData.phoneNumber || '',
              address: userData.address || '',
              lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : new Date(),
              profileImageUrl: userData.profileImageUrl || ''
            };
            
            console.log('✅ AdminAuthContext: Setting admin from localStorage:', adminUser);
            setAdmin(adminUser);
            return true;
          }
        } catch (parseError) {
          console.error('❌ AdminAuthContext: Error parsing localStorage user:', parseError);
        }
      }
      
      // SECOND: Check Firebase Auth (alternative source)
      const user = adminAuth.currentUser;
      console.log('🔥 AdminAuthContext: Firebase Auth check:', user ? '✅ User exists' : '❌ No user');
      
      if (!user) {
        console.log('❌ AdminAuthContext: No Firebase user found');
        setAdmin(null);
        return false;
      }

      // Use AdminAuthService methods
      const isSuperAdmin = AdminAuthService.isSuperAdmin();
      const isAdminUser = AdminAuthService.isAdminUser();
      
      console.log('🛠️ AdminAuthContext: Service checks - isSuperAdmin:', isSuperAdmin, 'isAdminUser:', isAdminUser);
      
      if (!isSuperAdmin && !isAdminUser) {
        console.log('❌ AdminAuthContext: User is not an admin according to service');
        setAdmin(null);
        return false;
      }

      // Get current admin data from service
      const currentAdmin = AdminAuthService.getCurrentAdmin();
      
      if (!currentAdmin) {
        console.log('❌ AdminAuthContext: No admin data from service');
        setAdmin(null);
        return false;
      }

      // Determine role based on service data
      const role: UserRole = isSuperAdmin ? 'super_admin' : 'admin';
      const permissions = getPermissionsForRole(role);
      
      // Create admin object
      const adminUser: AdminUser = {
        uid: currentAdmin.uid || user.uid,
        email: currentAdmin.email || user.email || '',
        name: currentAdmin.name || 'Administrator',
        role: role,
        permissions: permissions,
        createdAt: currentAdmin.createdAt ? new Date(currentAdmin.createdAt) : new Date(),
        updatedAt: currentAdmin.updatedAt ? new Date(currentAdmin.updatedAt) : new Date(),
        status: currentAdmin.status || 'active',
        isActive: currentAdmin.isActive !== false,
        phoneNumber: currentAdmin.phoneNumber || '',
        address: currentAdmin.address || '',
        lastLogin: currentAdmin.lastLogin ? new Date(currentAdmin.lastLogin) : new Date(),
        profileImageUrl: currentAdmin.profileImageUrl || ''
      };
      
      console.log('✅ AdminAuthContext: Setting admin from service:', adminUser);
      setAdmin(adminUser);
      return true;
      
    } catch (error) {
      console.error('❌ AdminAuthContext: Error checking admin status:', error);
      setAdmin(null);
      return false;
    }
  }, []);

  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!admin) return false;
    
    // Debug logging
    console.log('🔐 Checking permission:', {
      permission,
      adminRole: admin.role,
      hasPermission: admin.permissions.includes(permission)
    });
    
    return admin.permissions.includes(permission);
  }, [admin]);

  const refreshAdmin = useCallback(async () => {
    console.log('🔄 AdminAuthContext: Refreshing admin data...');
    await checkAdminStatus();
  }, [checkAdminStatus]);

  const logout = useCallback(async () => {
    try {
      console.log('🚪 AdminAuthContext: Logging out...');
      
      // Call service logout
      await AdminAuthService.superAdminLogout();
      
      // Clear local state
      setAdmin(null);
      
      console.log('✅ AdminAuthContext: Logout successful, redirecting...');
      router.push('/auth/super-admin');
    } catch (error) {
      console.error('❌ AdminAuthContext: Logout error:', error);
      // Still redirect on error
      router.push('/auth/super-admin');
    }
  }, [router]);

  useEffect(() => {
    console.log('🔄 AdminAuthProvider mounting...');
    
    // Initial check
    checkAdminStatus().finally(() => {
      setLoading(false);
    });

    // Listen to Firebase auth changes
    const unsubscribe = adminAuth.onAuthStateChanged(async (user) => {
      console.log('🔥 AdminAuthContext: Firebase auth state changed:', user ? '✅ User logged in' : '❌ User logged out');
      if (user) {
        await checkAdminStatus();
      } else {
        // Only clear if there's no localStorage user
        const localStorageUser = localStorage.getItem('admin_user');
        if (!localStorageUser) {
          setAdmin(null);
        }
      }
      setLoading(false);
    });

    // Listen for storage changes (when other tabs update localStorage)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_user') {
        console.log('📦 AdminAuthContext: Storage changed, refreshing admin...');
        checkAdminStatus();
      }
    };

    // Listen for custom admin-updated events
    const handleAdminUpdate = () => {
      console.log('📢 AdminAuthContext: Received admin-updated event');
      checkAdminStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('admin-updated', handleAdminUpdate);

    return () => {
      console.log('🔄 AdminAuthProvider unmounting...');
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('admin-updated', handleAdminUpdate);
    };
  }, [checkAdminStatus]);

  const value = {
    admin,
    loading,
    isAuthenticated: !!admin,
    isSuperAdmin: admin?.role === 'super_admin',
    isAdmin: admin?.role === 'admin',
    hasPermission,
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

// Helper functions for role-based checks
export function useHasPermission(permission: Permission): boolean {
  const { hasPermission } = useAdminAuth();
  return hasPermission(permission);
}

export function useIsSuperAdmin(): boolean {
  const { isSuperAdmin } = useAdminAuth();
  return isSuperAdmin;
}

export function useIsAdmin(): boolean {
  const { isAdmin } = useAdminAuth();
  return isAdmin;
}

export function useCanCreateUsers(): boolean {
  const { hasPermission } = useAdminAuth();
  return hasPermission('users.create');
}

export function useCanDeleteUsers(): boolean {
  const { hasPermission } = useAdminAuth();
  return hasPermission('users.delete');
}

export function useCanEditRoles(): boolean {
  const { hasPermission } = useAdminAuth();
  return hasPermission('users.edit_role');
}

export function useCanUseBulkActions(): boolean {
  const { hasPermission } = useAdminAuth();
  return hasPermission('users.bulk_actions');
}

export function useCanAccessSettings(): boolean {
  const { hasPermission } = useAdminAuth();
  return hasPermission('settings.access');
}