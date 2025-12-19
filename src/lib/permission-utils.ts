import { AdminUser } from './admin-service';

// Define all available permissions
export const ALL_PERMISSIONS = {
  // Special permission for super admin
  ALL: 'all',
  
  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',
  
  // User Management
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_EXPORT: 'users:export',
  
  // Device Management
  DEVICES_READ: 'devices:read',
  DEVICES_CREATE: 'devices:create',
  DEVICES_UPDATE: 'devices:update',
  DEVICES_DELETE: 'devices:delete',
  DEVICES_CONTROL: 'devices:control',
  DEVICES_MONITOR: 'devices:monitor',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  REPORTS_GENERATE: 'reports:generate',
  REPORTS_DOWNLOAD: 'reports:download',
  
  // Alerts
  ALERTS_READ: 'alerts:read',
  ALERTS_CREATE: 'alerts:create',
  ALERTS_UPDATE: 'alerts:update',
  ALERTS_DELETE: 'alerts:delete',
  ALERTS_NOTIFY: 'alerts:notify',
  
  // Logs
  LOGS_READ: 'logs:read',
  LOGS_EXPORT: 'logs:export',
  
  // Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
  
  // Profile
  PROFILE_VIEW: 'profile:view',
  PROFILE_UPDATE: 'profile:update',
  PROFILE_CHANGE_PASSWORD: 'profile:change_password',
  
  // Usage
  USAGE_VIEW: 'usage:view',
  
  // System (Super Admin Only)
  SYSTEM_HEALTH: 'system:health',
  SYSTEM_BACKUP: 'system:backup',
  
  // Admin Management (Super Admin Only)
  ADMIN_READ: 'admin:read',
  ADMIN_CREATE: 'admin:create',
  ADMIN_UPDATE: 'admin:update',
  ADMIN_DELETE: 'admin:delete',
  ADMIN_RESET_PASSWORD: 'admin:reset_password',
  
  // Database (Super Admin Only)
  DATABASE_READ: 'database:read',
  DATABASE_WRITE: 'database:write',
  
  // Access Control (Super Admin Only)
  ACCESS_CONTROL_VIEW: 'access:view',
  ACCESS_CONTROL_MANAGE: 'access:manage',
  
  // Audit Logs (Super Admin Only)
  AUDIT_LOGS_VIEW: 'audit:view',
  AUDIT_LOGS_EXPORT: 'audit:export',
} as const;

// Create a union type of all permission strings
export type Permission = 
  | 'all' // Special permission for super admin
  | 'dashboard:view'
  | 'users:read' | 'users:create' | 'users:update' | 'users:delete' | 'users:export'
  | 'devices:read' | 'devices:create' | 'devices:update' | 'devices:delete' | 'devices:control' | 'devices:monitor'
  | 'analytics:view' | 'analytics:export' | 'reports:generate' | 'reports:download'
  | 'alerts:read' | 'alerts:create' | 'alerts:update' | 'alerts:delete' | 'alerts:notify'
  | 'logs:read' | 'logs:export'
  | 'settings:read' | 'settings:update'
  | 'profile:view' | 'profile:update' | 'profile:change_password'
  | 'usage:view'
  | 'system:health' | 'system:backup'
  | 'admin:read' | 'admin:create' | 'admin:update' | 'admin:delete' | 'admin:reset_password'
  | 'database:read' | 'database:write'
  | 'access:view' | 'access:manage'
  | 'audit:view' | 'audit:export';

// Or use the type-safe approach:
// export type Permission = typeof ALL_PERMISSIONS[keyof typeof ALL_PERMISSIONS];

// Permission presets for different admin levels
export const PERMISSION_PRESETS = {
  // Basic Admin - Read-only access
  BASIC: [
    ALL_PERMISSIONS.DASHBOARD_VIEW,
    ALL_PERMISSIONS.USERS_READ,
    ALL_PERMISSIONS.DEVICES_READ,
    ALL_PERMISSIONS.DEVICES_MONITOR,
    ALL_PERMISSIONS.ANALYTICS_VIEW,
    ALL_PERMISSIONS.ALERTS_READ,
    ALL_PERMISSIONS.USAGE_VIEW,
    ALL_PERMISSIONS.PROFILE_VIEW,
    ALL_PERMISSIONS.PROFILE_UPDATE,
    ALL_PERMISSIONS.PROFILE_CHANGE_PASSWORD,
  ] as Permission[],
  
  // Standard Admin - Read/Write access (most common)
  STANDARD: [
    ALL_PERMISSIONS.DASHBOARD_VIEW,
    ALL_PERMISSIONS.USERS_READ,
    ALL_PERMISSIONS.USERS_CREATE,
    ALL_PERMISSIONS.USERS_UPDATE,
    ALL_PERMISSIONS.USERS_EXPORT,
    ALL_PERMISSIONS.DEVICES_READ,
    ALL_PERMISSIONS.DEVICES_CREATE,
    ALL_PERMISSIONS.DEVICES_UPDATE,
    ALL_PERMISSIONS.DEVICES_CONTROL,
    ALL_PERMISSIONS.DEVICES_MONITOR,
    ALL_PERMISSIONS.ANALYTICS_VIEW,
    ALL_PERMISSIONS.ANALYTICS_EXPORT,
    ALL_PERMISSIONS.REPORTS_GENERATE,
    ALL_PERMISSIONS.ALERTS_READ,
    ALL_PERMISSIONS.ALERTS_CREATE,
    ALL_PERMISSIONS.ALERTS_UPDATE,
    ALL_PERMISSIONS.ALERTS_NOTIFY,
    ALL_PERMISSIONS.LOGS_READ,
    ALL_PERMISSIONS.SETTINGS_READ,
    ALL_PERMISSIONS.USAGE_VIEW,
    ALL_PERMISSIONS.PROFILE_VIEW,
    ALL_PERMISSIONS.PROFILE_UPDATE,
    ALL_PERMISSIONS.PROFILE_CHANGE_PASSWORD,
  ] as Permission[],
  
  // Advanced Admin - Almost full access (except super admin only)
  ADVANCED: [
    ALL_PERMISSIONS.DASHBOARD_VIEW,
    ALL_PERMISSIONS.USERS_READ,
    ALL_PERMISSIONS.USERS_CREATE,
    ALL_PERMISSIONS.USERS_UPDATE,
    ALL_PERMISSIONS.USERS_DELETE,
    ALL_PERMISSIONS.USERS_EXPORT,
    ALL_PERMISSIONS.DEVICES_READ,
    ALL_PERMISSIONS.DEVICES_CREATE,
    ALL_PERMISSIONS.DEVICES_UPDATE,
    ALL_PERMISSIONS.DEVICES_DELETE,
    ALL_PERMISSIONS.DEVICES_CONTROL,
    ALL_PERMISSIONS.DEVICES_MONITOR,
    ALL_PERMISSIONS.ANALYTICS_VIEW,
    ALL_PERMISSIONS.ANALYTICS_EXPORT,
    ALL_PERMISSIONS.REPORTS_GENERATE,
    ALL_PERMISSIONS.REPORTS_DOWNLOAD,
    ALL_PERMISSIONS.ALERTS_READ,
    ALL_PERMISSIONS.ALERTS_CREATE,
    ALL_PERMISSIONS.ALERTS_UPDATE,
    ALL_PERMISSIONS.ALERTS_DELETE,
    ALL_PERMISSIONS.ALERTS_NOTIFY,
    ALL_PERMISSIONS.LOGS_READ,
    ALL_PERMISSIONS.LOGS_EXPORT,
    ALL_PERMISSIONS.SETTINGS_READ,
    ALL_PERMISSIONS.SETTINGS_UPDATE,
    ALL_PERMISSIONS.USAGE_VIEW,
    ALL_PERMISSIONS.PROFILE_VIEW,
    ALL_PERMISSIONS.PROFILE_UPDATE,
    ALL_PERMISSIONS.PROFILE_CHANGE_PASSWORD,
  ] as Permission[],
  
  // Super Admin - ALL permissions (including special ones)
  SUPER_ADMIN: [ALL_PERMISSIONS.ALL] as Permission[],
};

// Check if admin has specific permission
export function hasPermission(admin: AdminUser, permission: Permission): boolean {
  if (!admin || !admin.permissions) return false;
  
  // Super admin has 'all' permission
  if (admin.role === 'super_admin') return true;
  
  // Check if admin has 'all' permission
  if (admin.permissions.includes('all' as Permission)) return true;
  
  // Check specific permission
  return admin.permissions.includes(permission);
}

// Check if admin has any of the given permissions
export function hasAnyPermission(admin: AdminUser, permissions: Permission[]): boolean {
  if (!admin || !admin.permissions) return false;
  
  // Super admin has all permissions
  if (admin.role === 'super_admin') return true;
  
  // Check if admin has 'all' permission
  if (admin.permissions.includes('all' as Permission)) return true;
  
  // Check any of the permissions
  return permissions.some(permission => admin.permissions.includes(permission));
}

// Get accessible features for an admin
export function getAccessibleFeatures(admin: AdminUser) {
  return {
    // Dashboard
    canViewDashboard: hasPermission(admin, ALL_PERMISSIONS.DASHBOARD_VIEW),
    
    // User Management
    canViewUsers: hasPermission(admin, ALL_PERMISSIONS.USERS_READ),
    canCreateUsers: hasPermission(admin, ALL_PERMISSIONS.USERS_CREATE),
    canEditUsers: hasPermission(admin, ALL_PERMISSIONS.USERS_UPDATE),
    canDeleteUsers: hasPermission(admin, ALL_PERMISSIONS.USERS_DELETE),
    canExportUsers: hasPermission(admin, ALL_PERMISSIONS.USERS_EXPORT),
    
    // Device Management
    canViewDevices: hasPermission(admin, ALL_PERMISSIONS.DEVICES_READ),
    canCreateDevices: hasPermission(admin, ALL_PERMISSIONS.DEVICES_CREATE),
    canEditDevices: hasPermission(admin, ALL_PERMISSIONS.DEVICES_UPDATE),
    canDeleteDevices: hasPermission(admin, ALL_PERMISSIONS.DEVICES_DELETE),
    canControlDevices: hasPermission(admin, ALL_PERMISSIONS.DEVICES_CONTROL),
    canMonitorDevices: hasPermission(admin, ALL_PERMISSIONS.DEVICES_MONITOR),
    
    // Analytics
    canViewAnalytics: hasPermission(admin, ALL_PERMISSIONS.ANALYTICS_VIEW),
    canExportAnalytics: hasPermission(admin, ALL_PERMISSIONS.ANALYTICS_EXPORT),
    canGenerateReports: hasPermission(admin, ALL_PERMISSIONS.REPORTS_GENERATE),
    canDownloadReports: hasPermission(admin, ALL_PERMISSIONS.REPORTS_DOWNLOAD),
    
    // Alerts
    canViewAlerts: hasPermission(admin, ALL_PERMISSIONS.ALERTS_READ),
    canCreateAlerts: hasPermission(admin, ALL_PERMISSIONS.ALERTS_CREATE),
    canEditAlerts: hasPermission(admin, ALL_PERMISSIONS.ALERTS_UPDATE),
    canDeleteAlerts: hasPermission(admin, ALL_PERMISSIONS.ALERTS_DELETE),
    canSendNotifications: hasPermission(admin, ALL_PERMISSIONS.ALERTS_NOTIFY),
    
    // Logs
    canViewLogs: hasPermission(admin, ALL_PERMISSIONS.LOGS_READ),
    canExportLogs: hasPermission(admin, ALL_PERMISSIONS.LOGS_EXPORT),
    
    // Settings
    canViewSettings: hasPermission(admin, ALL_PERMISSIONS.SETTINGS_READ),
    canEditSettings: hasPermission(admin, ALL_PERMISSIONS.SETTINGS_UPDATE),
    
    // Profile
    canViewProfile: hasPermission(admin, ALL_PERMISSIONS.PROFILE_VIEW),
    canEditProfile: hasPermission(admin, ALL_PERMISSIONS.PROFILE_UPDATE),
    canChangePassword: hasPermission(admin, ALL_PERMISSIONS.PROFILE_CHANGE_PASSWORD),
    
    // Usage
    canViewUsage: hasPermission(admin, ALL_PERMISSIONS.USAGE_VIEW),
    
    // =========== SUPER ADMIN ONLY FEATURES ===========
    canViewSystemHealth: admin.role === 'super_admin' || hasPermission(admin, ALL_PERMISSIONS.SYSTEM_HEALTH),
    canManageAdmins: admin.role === 'super_admin',
    canViewAccessControl: admin.role === 'super_admin' || hasPermission(admin, ALL_PERMISSIONS.ACCESS_CONTROL_VIEW),
    canViewAuditLogs: admin.role === 'super_admin' || hasPermission(admin, ALL_PERMISSIONS.AUDIT_LOGS_VIEW),
    canViewDatabase: admin.role === 'super_admin' || hasPermission(admin, ALL_PERMISSIONS.DATABASE_READ),
  };
}

// Get sidebar items based on admin permissions
export function getAdminSidebarItems(admin: AdminUser) {
  const features = getAccessibleFeatures(admin);
  
  const items = [];
  
  // Always show dashboard if accessible
  if (features.canViewDashboard) {
    items.push({
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'Home',
      color: '#0ea5e9'
    });
  }
  
  // User Management
  if (features.canViewUsers) {
    items.push({
      id: 'users',
      label: 'User Management',
      path: '/dashboard/users',
      icon: 'Users',
      color: '#ec4899'
    });
  }
  
  // Profile (always accessible)
  items.push({
    id: 'profile',
    label: 'My Profile',
    path: '/dashboard/profile',
    icon: 'User',
    color: '#8b5cf6'
  });
  
  // Alerts
  if (features.canViewAlerts) {
    items.push({
      id: 'alerts',
      label: 'Alerts',
      path: '/dashboard/alerts',
      icon: 'BellRing',
      color: '#f59e0b'
    });
  }
  
  // Devices
  if (features.canViewDevices) {
    items.push({
      id: 'devices',
      label: 'Devices',
      path: '/dashboard/devices',
      icon: 'Cpu',
      color: '#10b981'
    });
  }
  
  // Analytics
  if (features.canViewAnalytics) {
    items.push({
      id: 'analytics',
      label: 'Analytics',
      path: '/dashboard/analytics',
      icon: 'BarChart3',
      color: '#8b5cf6'
    });
  }
  
  // Logs
  if (features.canViewLogs) {
    items.push({
      id: 'logs',
      label: 'Activity Logs',
      path: '/dashboard/logs',
      icon: 'History',
      color: '#6b7280'
    });
  }
  
  // Settings
  if (features.canViewSettings) {
    items.push({
      id: 'settings',
      label: 'System Settings',
      path: '/dashboard/settings',
      icon: 'Settings',
      color: '#6b7280'
    });
  }
  
  // Water Usage (always accessible)
  items.push({
    id: 'usage',
    label: 'Water Usage',
    path: '/dashboard/usage',
    icon: 'Droplets',
    color: '#3b82f6'
  });
  
  // =========== SUPER ADMIN ONLY ITEMS ===========
  if (admin.role === 'super_admin') {
    items.push({
      id: 'admin',
      label: 'Admin Management',
      path: '/dashboard/admin',
      icon: 'UserCog',
      color: '#8b5cf6',
      requiresSuperAdmin: true
    });
    
    items.push({
      id: 'access-control',
      label: 'Access Control',
      path: '/dashboard/access-control',
      icon: 'Key',
      color: '#f59e0b',
      requiresSuperAdmin: true
    });
    
    items.push({
      id: 'audit-logs',
      label: 'Audit Logs',
      path: '/dashboard/audit-logs',
      icon: 'FileText',
      color: '#6b7280',
      requiresSuperAdmin: true
    });
    
    items.push({
      id: 'database',
      label: 'Database',
      path: '/dashboard/database',
      icon: 'Database',
      color: '#9333ea',
      requiresSuperAdmin: true
    });
    
    items.push({
      id: 'system-health',
      label: 'System Health',
      path: '/dashboard/system-health',
      icon: 'Activity',
      color: '#ef4444',
      requiresSuperAdmin: true
    });
  }
  
  return items;
}

// Check if admin can access a specific route
export function canAccessRoute(admin: AdminUser, route: string): boolean {
  const menuItems = getAdminSidebarItems(admin);
  const routeMap: Record<string, boolean> = {};
  
  // Build route map from menu items
  menuItems.forEach(item => {
    routeMap[item.path] = true;
  });
  
  return routeMap[route] || false;
}

// Get permission preset by name
export function getPermissionPreset(presetName: keyof typeof PERMISSION_PRESETS): Permission[] {
  return PERMISSION_PRESETS[presetName] || PERMISSION_PRESETS.BASIC;
}

// Convert string array to Permission array
export function toPermissionArray(permissions: string[]): Permission[] {
  return permissions.filter(perm => 
    Object.values(ALL_PERMISSIONS).includes(perm as any) || perm === 'all'
  ) as Permission[];
}