//src/lib/rbac.ts - CORRECTED VERSION
export type UserRole = 'super_admin' | 'admin';

// Expanded Permission Types
export type Permission = 
  // User Management Permissions
  | 'users.create'
  | 'users.read'
  | 'users.update'
  | 'users.delete'
  | 'users.export'
  | 'users.bulk_actions'
  | 'users.edit_role'
  
  // Admin Management Permissions (Super Admin Only)
  | 'admin.create'
  | 'admin.read'
  | 'admin.update'
  | 'admin.delete'
  | 'admin.suspend'
  | 'admin.reset_password'
  | 'admin.view_logs'
  | 'admin.manage_permissions'
  
  // Device Management Permissions
  | 'devices.read'
  | 'devices.create'
  | 'devices.update'
  | 'devices.delete'
  | 'devices.control'
  | 'devices.monitor'
  
  // System & Settings Permissions
  | 'settings.read'
  | 'settings.update'
  | 'settings.advanced'
  | 'system.health'
  | 'system.backup'
  | 'system.restore'
  | 'system.config'
  
  // Analytics & Dashboard
  | 'dashboard.view'
  | 'analytics.view'
  | 'analytics.export'
  | 'reports.generate'
  | 'reports.download'
  
  // Alerts & Monitoring
  | 'alerts.read'
  | 'alerts.create'
  | 'alerts.update'
  | 'alerts.delete'
  | 'alerts.notify'
  
  // Audit & Logs
  | 'logs.read'
  | 'logs.export'
  | 'logs.purge'
  
  // Database Management
  | 'database.read'
  | 'database.write'
  | 'database.export'
  | 'database.backup'
  
  // Access Control
  | 'access_control.view'
  | 'access_control.manage'
  
  // Profile Management
  | 'profile.view'
  | 'profile.update'
  | 'profile.change_password'
  | 'profile.mfa_manage';

// Feature Groups for easy management (using array, not readonly tuple)
export const FEATURE_GROUPS = {
  USER_MANAGEMENT: ['users.create', 'users.read', 'users.update', 'users.delete', 'users.export', 'users.bulk_actions', 'users.edit_role'] as Permission[],
  ADMIN_MANAGEMENT: ['admin.create', 'admin.read', 'admin.update', 'admin.delete', 'admin.suspend', 'admin.reset_password', 'admin.view_logs', 'admin.manage_permissions'] as Permission[],
  DEVICE_MANAGEMENT: ['devices.read', 'devices.create', 'devices.update', 'devices.delete', 'devices.control', 'devices.monitor'] as Permission[],
  SYSTEM_SETTINGS: ['settings.read', 'settings.update', 'settings.advanced', 'system.health', 'system.backup', 'system.restore', 'system.config'] as Permission[],
  ANALYTICS: ['dashboard.view', 'analytics.view', 'analytics.export', 'reports.generate', 'reports.download'] as Permission[],
  ALERTS: ['alerts.read', 'alerts.create', 'alerts.update', 'alerts.delete', 'alerts.notify'] as Permission[],
  AUDIT_LOGS: ['logs.read', 'logs.export', 'logs.purge'] as Permission[],
  DATABASE: ['database.read', 'database.write', 'database.export', 'database.backup'] as Permission[],
  ACCESS_CONTROL: ['access_control.view', 'access_control.manage'] as Permission[],
  PROFILE: ['profile.view', 'profile.update', 'profile.change_password', 'profile.mfa_manage'] as Permission[]
};

// Role-Permission Mapping with Clear Separation
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    // User Management - Full Access
    'users.create',
    'users.read',
    'users.update',
    'users.delete',
    'users.export',
    'users.bulk_actions',
    'users.edit_role',
    
    // Admin Management - Full Access (SUPER ADMIN ONLY)
    'admin.create',
    'admin.read',
    'admin.update',
    'admin.delete',
    'admin.suspend',
    'admin.reset_password',
    'admin.view_logs',
    'admin.manage_permissions',
    
    // Device Management - Full Access
    'devices.read',
    'devices.create',
    'devices.update',
    'devices.delete',
    'devices.control',
    'devices.monitor',
    
    // System & Settings - Full Access
    'settings.read',
    'settings.update',
    'settings.advanced',
    'system.health',
    'system.backup',
    'system.restore',
    'system.config',
    
    // Analytics & Dashboard - Full Access
    'dashboard.view',
    'analytics.view',
    'analytics.export',
    'reports.generate',
    'reports.download',
    
    // Alerts & Monitoring - Full Access
    'alerts.read',
    'alerts.create',
    'alerts.update',
    'alerts.delete',
    'alerts.notify',
    
    // Audit & Logs - Full Access
    'logs.read',
    'logs.export',
    'logs.purge',
    
    // Database Management - Full Access
    'database.read',
    'database.write',
    'database.export',
    'database.backup',
    
    // Access Control - Full Access
    'access_control.view',
    'access_control.manage',
    
    // Profile Management - Full Access
    'profile.view',
    'profile.update',
    'profile.change_password',
    'profile.mfa_manage'
  ],
  admin: [
    // User Management - Limited Access (Read & Update only)
    'users.read',
    'users.update',
    'users.export',
    
    // Admin Management - NO ACCESS
    // Regular admins cannot manage other admins
    
    // Device Management - Limited Access (Monitor only)
    'devices.read',
    'devices.monitor',
    
    // System & Settings - Limited Access (Read only)
    'settings.read',
    'system.health',
    
    // Analytics & Dashboard - Full Access
    'dashboard.view',
    'analytics.view',
    'analytics.export',
    'reports.generate',
    'reports.download',
    
    // Alerts & Monitoring - Limited Access
    'alerts.read',
    'alerts.create',
    'alerts.update',
    'alerts.notify',
    
    // Audit & Logs - Limited Access (Read only)
    'logs.read',
    
    // Database Management - NO ACCESS
    // Regular admins cannot access database directly
    
    // Access Control - NO ACCESS
    
    // Profile Management - Full Access
    'profile.view',
    'profile.update',
    'profile.change_password',
    'profile.mfa_manage'
  ]
};

// Check if user has specific permission
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

// Check if user has any of the permissions
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

// Check if user has all permissions
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

// Get all permissions for a role
export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Get missing permissions for a role
export function getMissingPermissions(userRole: UserRole, requiredPermissions: Permission[]): Permission[] {
  return requiredPermissions.filter(permission => !hasPermission(userRole, permission));
}

// Check if user can manage another user based on roles
export function canManageUser(currentUserRole: UserRole, targetUserRole: UserRole): boolean {
  const roleHierarchy = {
    'super_admin': 100,
    'admin': 50
  };
  
  return roleHierarchy[currentUserRole] > roleHierarchy[targetUserRole];
}

// Check if user can edit/administer another user
export function canAdministerUser(currentUserRole: UserRole, targetUserRole: UserRole): boolean {
  // Only super admin can administer other admins
  if (targetUserRole === 'admin') {
    return currentUserRole === 'super_admin';
  }
  
  return canManageUser(currentUserRole, targetUserRole);
}

// Check if user can perform admin management actions
export function canManageAdmins(userRole: UserRole): boolean {
  return hasAnyPermission(userRole, FEATURE_GROUPS.ADMIN_MANAGEMENT);
}

// Check if user can access system settings
export function canAccessSystemSettings(userRole: UserRole): boolean {
  return hasPermission(userRole, 'settings.advanced') || 
         hasPermission(userRole, 'system.config');
}

// Get accessible features for UI components
export function getAccessibleFeatures(role: UserRole) {
  return {
    // User Management
    canViewUsers: hasPermission(role, 'users.read'),
    canCreateUsers: hasPermission(role, 'users.create'),
    canEditUsers: hasPermission(role, 'users.update'),
    canDeleteUsers: hasPermission(role, 'users.delete'),
    canExportUsers: hasPermission(role, 'users.export'),
    canUseBulkActions: hasPermission(role, 'users.bulk_actions'),
    canEditUserRoles: hasPermission(role, 'users.edit_role'),
    
    // Admin Management (Super Admin Only)
    canViewAdmins: hasPermission(role, 'admin.read'),
    canCreateAdmins: hasPermission(role, 'admin.create'),
    canEditAdmins: hasPermission(role, 'admin.update'),
    canDeleteAdmins: hasPermission(role, 'admin.delete'),
    canSuspendAdmins: hasPermission(role, 'admin.suspend'),
    canResetAdminPassword: hasPermission(role, 'admin.reset_password'),
    canViewAdminLogs: hasPermission(role, 'admin.view_logs'),
    canManageAdminPermissions: hasPermission(role, 'admin.manage_permissions'),
    
    // Device Management
    canViewDevices: hasPermission(role, 'devices.read'),
    canCreateDevices: hasPermission(role, 'devices.create'),
    canEditDevices: hasPermission(role, 'devices.update'),
    canDeleteDevices: hasPermission(role, 'devices.delete'),
    canControlDevices: hasPermission(role, 'devices.control'),
    canMonitorDevices: hasPermission(role, 'devices.monitor'),
    
    // System & Settings
    canViewSettings: hasPermission(role, 'settings.read'),
    canEditSettings: hasPermission(role, 'settings.update'),
    canAccessAdvancedSettings: hasPermission(role, 'settings.advanced'),
    canViewSystemHealth: hasPermission(role, 'system.health'),
    canBackupSystem: hasPermission(role, 'system.backup'),
    canRestoreSystem: hasPermission(role, 'system.restore'),
    canConfigureSystem: hasPermission(role, 'system.config'),
    
    // Analytics & Dashboard
    canViewDashboard: hasPermission(role, 'dashboard.view'),
    canViewAnalytics: hasPermission(role, 'analytics.view'),
    canExportAnalytics: hasPermission(role, 'analytics.export'),
    canGenerateReports: hasPermission(role, 'reports.generate'),
    canDownloadReports: hasPermission(role, 'reports.download'),
    
    // Alerts & Monitoring
    canViewAlerts: hasPermission(role, 'alerts.read'),
    canCreateAlerts: hasPermission(role, 'alerts.create'),
    canEditAlerts: hasPermission(role, 'alerts.update'),
    canDeleteAlerts: hasPermission(role, 'alerts.delete'),
    canSendNotifications: hasPermission(role, 'alerts.notify'),
    
    // Audit & Logs
    canViewLogs: hasPermission(role, 'logs.read'),
    canExportLogs: hasPermission(role, 'logs.export'),
    canPurgeLogs: hasPermission(role, 'logs.purge'),
    
    // Database Management
    canReadDatabase: hasPermission(role, 'database.read'),
    canWriteDatabase: hasPermission(role, 'database.write'),
    canExportDatabase: hasPermission(role, 'database.export'),
    canBackupDatabase: hasPermission(role, 'database.backup'),
    
    // Access Control
    canViewAccessControl: hasPermission(role, 'access_control.view'),
    canManageAccessControl: hasPermission(role, 'access_control.manage'),
    
    // Profile Management
    canViewProfile: hasPermission(role, 'profile.view'),
    canEditProfile: hasPermission(role, 'profile.update'),
    canChangePassword: hasPermission(role, 'profile.change_password'),
    canManageMFA: hasPermission(role, 'profile.mfa_manage')
  };
}

// Get menu items based on role
export function getMenuItems(role: UserRole) {
  const features = getAccessibleFeatures(role);
  
  return {
    // Core Navigation (Available to all)
    dashboard: features.canViewDashboard,
    profile: features.canViewProfile,
    
    // User Management
    users: features.canViewUsers,
    
    // Admin Management (Super Admin Only)
    adminManagement: features.canViewAdmins,
    
    // Device Management
    devices: features.canViewDevices,
    
    // System
    settings: features.canViewSettings,
    systemHealth: features.canViewSystemHealth,
    
    // Analytics
    analytics: features.canViewAnalytics,
    reports: features.canGenerateReports,
    
    // Alerts
    alerts: features.canViewAlerts,
    
    // Logs
    logs: features.canViewLogs,
    auditLogs: features.canViewLogs && role === 'super_admin', // Only super admin
    
    // Database (Super Admin Only)
    database: features.canReadDatabase && role === 'super_admin',
    
    // Access Control (Super Admin Only)
    accessControl: features.canViewAccessControl && role === 'super_admin',
    
    // Usage
    usage: true, // Always available
  };
}

// Validate if user can access a specific route
export function canAccessRoute(role: UserRole, route: string): boolean {
  const menuItems = getMenuItems(role);
  
  const routeMap: Record<string, boolean> = {
    '/dashboard': menuItems.dashboard,
    '/dashboard/users': menuItems.users,
    '/dashboard/admin': menuItems.adminManagement,
    '/dashboard/devices': menuItems.devices,
    '/dashboard/settings': menuItems.settings,
    '/dashboard/system-health': menuItems.systemHealth,
    '/dashboard/analytics': menuItems.analytics,
    '/dashboard/reports': menuItems.reports,
    '/dashboard/alerts': menuItems.alerts,
    '/dashboard/logs': menuItems.logs,
    '/dashboard/audit-logs': menuItems.auditLogs,
    '/dashboard/database': menuItems.database,
    '/dashboard/access-control': menuItems.accessControl,
    '/dashboard/usage': menuItems.usage,
    '/dashboard/profile': menuItems.profile,
  };
  
  return routeMap[route] || false;
}

// Type-safe permission checker for components
export function createPermissionChecker(userRole: UserRole) {
  return {
    can: (permission: Permission) => hasPermission(userRole, permission),
    canAny: (permissions: Permission[]) => hasAnyPermission(userRole, permissions),
    canAll: (permissions: Permission[]) => hasAllPermissions(userRole, permissions),
    getMissing: (requiredPermissions: Permission[]) => getMissingPermissions(userRole, requiredPermissions),
    features: getAccessibleFeatures(userRole),
    menu: getMenuItems(userRole),
    canAccessRoute: (route: string) => canAccessRoute(userRole, route)
  };
}

// Simple permission check function (alternative to decorator)
export function checkPermission(userRole: UserRole | undefined, permission: Permission): boolean {
  if (!userRole) return false;
  return hasPermission(userRole, permission);
}

// Permission middleware function for API routes
export function withPermission(
  permission: Permission,
  handler: (userRole: UserRole, ...args: any[]) => Promise<any> | any
) {
  return async (userRole: UserRole, ...args: any[]) => {
    if (!userRole || !hasPermission(userRole, permission)) {
      throw new Error(`Permission denied: ${permission} required`);
    }
    
    return handler(userRole, ...args);
  };
}

// Example usage:
/*
// In an API route handler
export async function createAdminHandler(userRole: UserRole, data: any) {
  return withPermission('admin.create', async (role) => {
    // Your admin creation logic here
    return { success: true };
  })(userRole);
}

// In a component
const userRole = getCurrentAdmin()?.role;
if (checkPermission(userRole, 'admin.create')) {
  // Show admin creation button
}
*/

// Helper function to get current user role from context
export function getCurrentUserRole(): UserRole | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('admin_user');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    return user.role || null;
  } catch {
    return null;
  }
}

// Guard function for page components
export function requireSuperAdmin() {
  const userRole = getCurrentUserRole();
  if (userRole !== 'super_admin') {
    throw new Error('Super admin access required');
  }
}

// Guard function for specific permissions
export function requirePermission(permission: Permission) {
  const userRole = getCurrentUserRole();
  if (!userRole || !hasPermission(userRole, permission)) {
    throw new Error(`Permission denied: ${permission} required`);
  }
}