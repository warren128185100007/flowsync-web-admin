// src/lib/admin-utils.ts - COMPLETE (Only super_admin and admin roles)
export interface CurrentAdmin {
  uid: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin'; // Only two roles
  permissions: string[];
  isActive: boolean;
  createdAt?: Date;
  lastLogin?: Date;
}

export const getCurrentAdmin = (): CurrentAdmin | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try to get admin data from localStorage
    const adminDataString = localStorage.getItem('admin_user');
    
    if (!adminDataString) {
      console.log('❌ No admin_user found in localStorage');
      return null;
    }
    
    const storedData = JSON.parse(adminDataString);
    
    // Extract and normalize role
    let role = storedData.role;
    
    // Normalize role format
    if (role === 'super-admin') {
      role = 'super_admin';
    }
    
    // Ensure role is valid (only super_admin or admin)
    if (role !== 'super_admin' && role !== 'admin') {
      console.log(`⚠️ Invalid role "${role}", defaulting to "admin"`);
      role = 'admin';
    }
    
    // Build admin object
    const admin: CurrentAdmin = {
      uid: storedData.uid || 'default-admin-id',
      email: storedData.email || 'unknown@example.com',
      name: storedData.name || 'Administrator',
      role: role as 'super_admin' | 'admin',
      permissions: storedData.permissions || (role === 'super_admin' ? ['all'] : ['dashboard:view']),
      isActive: storedData.isActive !== false,
      createdAt: storedData.createdAt ? new Date(storedData.createdAt) : undefined,
      lastLogin: storedData.lastLogin ? new Date(storedData.lastLogin) : undefined
    };
    
    return admin;
    
  } catch (error) {
    console.error('❌ Error getting current admin:', error);
    return null;
  }
};

export const isSuperAdmin = (): boolean => {
  const admin = getCurrentAdmin();
  return admin?.role === 'super_admin';
};

export const isAdmin = (): boolean => {
  const admin = getCurrentAdmin();
  return admin?.role === 'admin';
};

export const hasPermission = (permission: string): boolean => {
  const admin = getCurrentAdmin();
  if (!admin) return false;
  
  // Super admin has all permissions
  if (admin.role === 'super_admin') return true;
  
  // Check specific permission for regular admin
  return admin.permissions.includes(permission) || admin.permissions.includes('all');
};

// Helper function to set admin (for login)
export const setCurrentAdmin = (adminData: Partial<CurrentAdmin>): void => {
  if (typeof window === 'undefined') return;
  
  const currentAdmin = getCurrentAdmin() || {} as CurrentAdmin;
  const updatedAdmin = {
    ...currentAdmin,
    ...adminData,
    // Ensure role is valid
    role: (adminData.role === 'super_admin' || adminData.role === 'admin') 
      ? adminData.role 
      : 'admin'
  } as CurrentAdmin;
  
  localStorage.setItem('admin_user', JSON.stringify(updatedAdmin));
};

// Helper function to clear admin (for logout)
export const clearCurrentAdmin = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_user');
};

// Helper function to check if user is logged in
export const isLoggedIn = (): boolean => {
  return getCurrentAdmin() !== null;
};

// Helper function to require super admin (for protected routes)
export const requireSuperAdmin = (): boolean => {
  if (!isLoggedIn()) {
    console.log('🔒 Access denied: Not logged in');
    return false;
  }
  
  if (!isSuperAdmin()) {
    console.log('🔒 Access denied: Not super admin');
    return false;
  }
  
  return true;
};

// Helper function to require admin (for protected routes)
export const requireAdmin = (): boolean => {
  if (!isLoggedIn()) {
    console.log('🔒 Access denied: Not logged in');
    return false;
  }
  
  const admin = getCurrentAdmin();
  if (!admin || (admin.role !== 'super_admin' && admin.role !== 'admin')) {
    console.log('🔒 Access denied: Not an admin');
    return false;
  }
  
  return true;
};

// Helper to get admin permissions
export const getAdminPermissions = (): string[] => {
  const admin = getCurrentAdmin();
  return admin?.permissions || [];
};

// Helper to check if admin can perform action
export const canPerformAction = (requiredPermission: string): boolean => {
  const admin = getCurrentAdmin();
  if (!admin) return false;
  
  // Super admin can do anything
  if (admin.role === 'super_admin') return true;
  
  // Check if admin has the required permission
  return admin.permissions.includes(requiredPermission) || 
         admin.permissions.includes('all') ||
         admin.permissions.includes('*');
};

// Helper to validate admin data
export const validateAdminData = (data: any): CurrentAdmin | null => {
  try {
    if (!data || !data.email || !data.role) {
      return null;
    }
    
    // Validate role
    if (data.role !== 'super_admin' && data.role !== 'admin') {
      return null;
    }
    
    const admin: CurrentAdmin = {
      uid: data.uid || `admin-${Date.now()}`,
      email: data.email,
      name: data.name || data.email.split('@')[0],
      role: data.role,
      permissions: Array.isArray(data.permissions) ? data.permissions : 
                  data.role === 'super_admin' ? ['all'] : ['dashboard:view'],
      isActive: data.isActive !== false,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      lastLogin: data.lastLogin ? new Date(data.lastLogin) : undefined
    };
    
    return admin;
  } catch (error) {
    console.error('❌ Error validating admin data:', error);
    return null;
  }
};

// Helper to create new admin object
export const createAdminObject = (
  email: string, 
  name: string, 
  role: 'super_admin' | 'admin' = 'admin',
  permissions: string[] = []
): CurrentAdmin => {
  return {
    uid: `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email,
    name,
    role,
    permissions: role === 'super_admin' 
      ? ['all'] 
      : permissions.length > 0 
        ? permissions 
        : ['dashboard:view', 'users:read', 'devices:read'],
    isActive: true,
    createdAt: new Date()
  };
};