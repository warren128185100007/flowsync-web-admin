// src/components/layout/Sidebar.tsx - WITH CSS MODULE IMPORT
'use client';

import { 
  Home, User, Cpu, BellRing, Zap, Droplets, BarChart3, History, 
  Users, Settings, Waves, Power, Menu, X, ChevronLeft, Shield, 
  AlertTriangle, Key, Database, FileText, Server, Lock, LogOut, Terminal 
} from 'lucide-react';
import { useState, useEffect, useCallback, memo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminAuthService } from '@/lib/admin-auth.service';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: string;
  alertCount: number;
  onToggle?: () => void;
}

type NavigationItem = {
  icon: React.ReactNode;
  label: string;
  section: string;
  color: string;
  badge?: number;
  requiresSuperAdmin?: boolean;
  path?: string;
};

// Memoized navigation item component
const NavItem = memo(({ 
  item, 
  isActive, 
  isCollapsed, 
  isHovered,
  userRole,
  onClick,
  onMouseEnter,
  onMouseLeave 
}: { 
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
  isHovered: boolean;
  userRole: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  return (
    <div className={styles.navItem}>
      <button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`${styles.navButton} ${isActive ? styles.active : ''}`}
        style={{
          '--item-color': item.color,
        } as React.CSSProperties}
      >
        {/* Active indicator */}
        {isActive && (
          <div className={styles.activeIndicator} />
        )}
        
        {/* Icon */}
        <div className={styles.navIconContainer}>
          {item.icon}
          {item.badge && item.badge > 0 && isCollapsed && (
            <div className={styles.superAdminDot} />
          )}
        </div>
        
        {/* Label and badge (expanded only) */}
        {!isCollapsed && (
          <div className={styles.navContent}>
            <div className={styles.navLabel}>
              <span>{item.label}</span>
              {item.requiresSuperAdmin && (
                <Lock size={12} style={{ color: '#ef4444' }} />
              )}
            </div>
            
            {item.badge && item.badge > 0 && (
              <span className={styles.navBadge}>
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (isHovered || isActive) && (
        <div className={styles.navTooltip}>
          {item.label}
          {item.badge && item.badge > 0 && (
            <span style={{
              marginLeft: '6px',
              background: item.color,
              color: 'white',
              fontSize: '10px',
              fontWeight: '700',
              padding: '1px 4px',
              borderRadius: '8px',
            }}>
              {item.badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

NavItem.displayName = 'NavItem';

export default function Sidebar({ 
  isOpen, 
  activeSection, 
  onSectionChange, 
  userRole, 
  alertCount,
  onToggle 
}: SidebarProps) {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [shutdownConfirmed, setShutdownConfirmed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>('admin@flowsync.com');
  const router = useRouter();
  const pathname = usePathname();

  // Get user email from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setAdminEmail(user.email || 'admin@flowsync.com');
      } catch (error) {
        // Silent fail
      }
    }
  }, []);

  // Handle mobile responsiveness
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Optimized active check
  const getIsActive = useCallback((item: NavigationItem): boolean => {
    if (!item.path || !pathname) return false;
    
    if (item.path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    
    return pathname.startsWith(item.path);
  }, [pathname]);

  // Navigation items
  const baseNavigationItems: NavigationItem[] = [
    { 
      icon: <Home size={20} />, 
      label: 'Dashboard', 
      section: 'dashboard', 
      color: '#0ea5e9',
      path: '/dashboard' 
    },
    { 
      icon: <User size={20} />, 
      label: 'My Profile', 
      section: 'profile', 
      color: '#8b5cf6',
      path: '/dashboard/profile' 
    },
    { 
      icon: <Cpu size={20} />, 
      label: 'Devices', 
      section: 'devices', 
      color: '#10b981',
      path: '/dashboard/devices' 
    },
    { 
      icon: <BellRing size={20} />, 
      label: 'Alerts', 
      section: 'alerts', 
      color: '#f59e0b', 
      badge: alertCount,
      path: '/dashboard/alerts' 
    },
    { 
      icon: <Zap size={20} />, 
      label: 'Control Panel', 
      section: 'control', 
      color: '#f97316',
      path: '/dashboard/control' 
    },
    { 
      icon: <Droplets size={20} />, 
      label: 'Water Usage', 
      section: 'usage', 
      color: '#3b82f6',
      path: '/dashboard/usage' 
    },
    { 
      icon: <BarChart3 size={20} />, 
      label: 'Analytics', 
      section: 'analytics', 
      color: '#6366f1',
      path: '/dashboard/analytics' 
    },
    { 
      icon: <History size={20} />, 
      label: 'Logs History', 
      section: 'logs', 
      color: '#8b5cf6',
      path: '/dashboard/logs' 
    },
  ];

  const adminNavigationItems: NavigationItem[] = [
    { 
      icon: <Users size={20} />, 
      label: 'User Management', 
      section: 'users', 
      color: '#ec4899',
      path: '/dashboard/users' 
    },
    { 
      icon: <Settings size={20} />, 
      label: 'System Settings', 
      section: 'settings', 
      color: '#6b7280',
      path: '/dashboard/settings' 
    }
  ];

  const superAdminNavigationItems: NavigationItem[] = [
    { 
      icon: <Shield size={20} />, 
      label: 'Admin Panel', 
      section: 'admin', 
      color: '#8b5cf6', 
      requiresSuperAdmin: true,
      path: '/dashboard/admin' 
    },
    { 
      icon: <Terminal size={20} />, 
      label: 'Super Admin', 
      section: 'super-admin', 
      color: '#ef4444', 
      requiresSuperAdmin: true,
      path: '/auth/super-admin' 
    },
    { 
      icon: <Key size={20} />, 
      label: 'Access Control', 
      section: 'access-control', 
      color: '#f59e0b', 
      requiresSuperAdmin: true,
      path: '/dashboard/access-control' 
    },
    { 
      icon: <Database size={20} />, 
      label: 'Database', 
      section: 'database', 
      color: '#10b981', 
      requiresSuperAdmin: true,
      path: '/dashboard/database' 
    },
    { 
      icon: <FileText size={20} />, 
      label: 'Audit Logs', 
      section: 'audit-logs', 
      color: '#6b7280', 
      requiresSuperAdmin: true,
      path: '/dashboard/audit-logs' 
    },
    { 
      icon: <Server size={20} />, 
      label: 'System Health', 
      section: 'system-health', 
      color: '#ef4444', 
      requiresSuperAdmin: true,
      path: '/dashboard/system-health' 
    },
  ];

  // Combine items
  let navigationItems = [...baseNavigationItems];
  if (userRole === 'admin' || userRole === 'super-admin') {
    navigationItems = [...navigationItems, ...adminNavigationItems];
  }
  if (userRole === 'super-admin') {
    navigationItems = [...navigationItems, ...superAdminNavigationItems];
  }

  const userInfo = {
    'super-admin': { 
      title: 'Super Administrator', 
      color: '#8b5cf6', 
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', 
      short: 'SA',
      icon: <Shield size={14} />
    },
    'admin': { 
      title: 'Administrator', 
      color: '#8b5cf6', 
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', 
      short: 'ADM',
      icon: <Shield size={14} />
    },
    'viewer': { 
      title: 'Viewer', 
      color: '#6b7280', 
      gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', 
      short: 'VW',
      icon: <User size={14} />
    }
  };

  const user = userInfo[userRole as keyof typeof userInfo] || userInfo.viewer;

  // Optimized logout
  const handleLogout = useCallback(async () => {
    localStorage.removeItem('admin_user');
    await AdminAuthService.superAdminLogout();
    router.push('/auth/super-admin');
  }, [router]);

  // Optimized navigation
  const handleItemClick = useCallback((item: NavigationItem) => {
    if (item.requiresSuperAdmin && userRole !== 'super-admin') return;
    
    onSectionChange(item.section);
    if (item.path) {
      router.push(item.path);
    }
  }, [userRole, router, onSectionChange]);

  // Mobile sidebar button
  if (!isOpen && isMobile) {
    return (
      <button 
        onClick={onToggle}
        className={styles.mobileToggleButton}
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>
    );
  }

  if (isMobile && !isOpen) return null;

  return (
    <>
      <div className={`
        ${styles.container} 
        ${isOpen ? styles.open : ''}
        ${isCollapsed ? styles.collapsed : ''}
        ${isMobile ? styles.mobile : ''}
      `}>
        
        <div className={styles.content}>
          {/* Mobile Close Button */}
          {isMobile && (
            <button 
              onClick={onToggle}
              className={styles.closeButton}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}

          {/* Logo Section - UPDATED */}
          <div className={styles.logoSection}>
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>
                {/* Flowsync Logo - Original Colors */}
                <div className={styles.logoImageContainer}>
                  <img
                    src="/Flowsync.png"
                    alt="FlowSync"
                    className={styles.logoImage}
                    onError={(e) => {
                      console.error('Logo failed to load');
                      e.currentTarget.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.innerHTML = `
                        <div style="
                          width: 100%;
                          height: 100%;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          color: white;
                        ">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M2 12h20M2 12l4-4M2 12l4 4M22 12l-4-4M22 12l-4 4M12 2v20M12 2l4 4M12 2l-4 4M12 22l4-4M12 22l-4-4"/>
                          </svg>
                        </div>
                      `;
                      e.currentTarget.parentElement?.appendChild(fallback);
                    }}
                  />
                </div>
              </div>
              
              {!isCollapsed && (
                <div className={styles.logoText}>
                  {/* REMOVED: FlowSync title */}
                  <p className={styles.logoSubtitle}>Admin Portal</p>
                </div>
              )}
            </div>

            {/* Navigation Items */}
            <nav className={styles.navigation}>
              {navigationItems.map((item) => {
                const isActive = getIsActive(item);
                const hasAccess = !item.requiresSuperAdmin || (item.requiresSuperAdmin && userRole === 'super-admin');
                
                if (!hasAccess) return null;

                return (
                  <NavItem
                    key={item.section}
                    item={item}
                    isActive={isActive}
                    isCollapsed={isCollapsed}
                    isHovered={hoveredItem === item.section}
                    userRole={userRole}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredItem(item.section)}
                    onMouseLeave={() => setHoveredItem(null)}
                  />
                );
              })}
            </nav>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button 
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              <LogOut size={16} />
              {!isCollapsed && <span>Logout</span>}
            </button>

            <button 
              onClick={() => setShowEmergencyModal(true)}
              className={styles.emergencyButton}
              style={{
                background: shutdownConfirmed 
                  ? 'rgba(16, 185, 129, 0.08)' 
                  : 'rgba(239, 68, 68, 0.08)',
                borderColor: shutdownConfirmed 
                  ? 'rgba(16, 185, 129, 0.2)' 
                  : 'rgba(239, 68, 68, 0.2)',
                color: shutdownConfirmed ? '#10b981' : '#ef4444',
              }}
            >
              <Power size={16} />
              {!isCollapsed && (
                <span>{shutdownConfirmed ? 'Complete' : 'Emergency'}</span>
              )}
            </button>
          </div>

          {/* User Info */}
          <div className={styles.userSection}>
            <div className={styles.userCard}>
              <div 
                className={styles.userAvatar}
                style={{ background: user.gradient }}
              >
                {isCollapsed ? user.short : userRole.charAt(0).toUpperCase()}
              </div>
              
              {!isCollapsed && (
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{user.title}</div>
                  <div className={styles.userEmail}>{adminEmail}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          onClick={onToggle}
          className={styles.mobileOverlay}
        />
      )}

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>
                <AlertTriangle size={24} color="white" />
              </div>
              <div>
                <h3 className={styles.modalTitle}>Emergency Shutdown</h3>
                <p className={styles.modalSubtitle}>Critical system action</p>
              </div>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.modalWarningBox}>
                <p className={styles.modalText}>
                  ⚠️ This action cannot be undone. System will be stopped immediately.
                </p>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                onClick={() => setShowEmergencyModal(false)}
                className={styles.modalButton}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShutdownConfirmed(true);
                  setShowEmergencyModal(false);
                }}
                className={styles.modalButtonDanger}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}