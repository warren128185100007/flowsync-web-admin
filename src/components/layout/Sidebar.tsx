'use client';

import { 
  Home, User, Cpu, BellRing, Droplets, History, 
  Users, Settings, LogOut, Menu, X, Crown, 
  UserCog, Activity, BarChart3, Key, 
  FileText, Shield
} from 'lucide-react';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onSectionChange: (section: string) => void;
  alertCount: number;
  onToggle?: () => void;
}

type NavigationItem = {
  icon: React.ReactNode;
  label: string;
  section: string;
  path?: string;
  badge?: number;
  requiresSuperAdmin?: boolean;
  isSuperAdminOnly?: boolean;
};

type UserRole = 'super_admin' | 'admin';
type UserInfo = {
  title: string;
  gradient: string;
  short: string;
  icon: React.ReactNode;
  badge: string;
};

const USER_INFO: Record<UserRole, UserInfo> = {
  'super_admin': { 
    title: 'Super Administrator', 
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', 
    short: 'SA',
    icon: <Crown size={12} />,
    badge: 'SUPER ADMIN'
  },
  'admin': { 
    title: 'Administrator', 
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', 
    short: 'ADM',
    icon: <Shield size={12} />,
    badge: 'ADMIN'
  }
};

const NavItem = memo(({ 
  item, 
  isActive, 
  isHovered,
  userRole,
  onClick,
  onMouseEnter,
  onMouseLeave 
}: { 
  item: NavigationItem;
  isActive: boolean;
  isHovered: boolean;
  userRole: UserRole;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const hasAccess = !item.requiresSuperAdmin || userRole === 'super_admin';
  
  if (!hasAccess) return null;

  return (
    <div className={styles.navItem}>
      <button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`${styles.navButton} ${isActive ? styles.active : ''}`}
        disabled={item.requiresSuperAdmin && userRole !== 'super_admin'}
        title={item.label}
      >
        {isActive && <div className={styles.activeIndicator} />}
        
        <div className={styles.navIconContainer}>
          {item.icon}
          {item.isSuperAdminOnly && userRole === 'super_admin' && (
            <div className={styles.superAdminIconBadge}>
              <Crown size={10} />
            </div>
          )}
          {item.badge && item.badge > 0 && (
            <div className={styles.badgeDot} />
          )}
        </div>
        
        <div className={styles.navContent}>
          <span className={styles.navLabel}>{item.label}</span>
          {item.badge && item.badge > 0 && (
            <span className={styles.navBadge}>
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </div>
      </button>

      {isHovered && (
        <div className={styles.navTooltip}>
          {item.label}
          {item.isSuperAdminOnly && userRole === 'super_admin' && (
            <div className={styles.tooltipSuperAdmin}>
              <Crown size={10} />
              <span>Super Admin</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

NavItem.displayName = 'NavItem';

export default function Sidebar({ 
  isOpen, 
  onSectionChange, 
  alertCount,
  onToggle 
}: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [adminEmail, setAdminEmail] = useState('admin@flowsync.com');
  const router = useRouter();
  const pathname = usePathname();

  // Load user data
  useEffect(() => {
    const loadUserData = () => {
      try {
        const localStorageUser = localStorage.getItem('admin_user');
        if (localStorageUser) {
          const user = JSON.parse(localStorageUser);
          setAdminEmail(user.email || 'admin@flowsync.com');
          
          let role: string = user.role || user.userType || 'admin';
          if (role === 'super-admin') role = 'super_admin';
          
          setUserRole((role === 'super_admin' ? 'super_admin' : 'admin'));
          return;
        }

        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
        };

        const userCookie = getCookie('admin_user');
        if (userCookie) {
          const user = JSON.parse(decodeURIComponent(userCookie));
          setAdminEmail(user.email || 'admin@flowsync.com');
          
          let role: string = user.role;
          if (role === 'super-admin') role = 'super_admin';
          
          setUserRole((role === 'super_admin' ? 'super_admin' : 'admin'));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_user') loadUserData();
    };
    
    const handleAdminUpdate = () => loadUserData();
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('admin-updated', handleAdminUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('admin-updated', handleAdminUpdate);
    };
  }, []);

  // Handle responsiveness
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navigation items based on role
  const navigationItems = useMemo(() => {
    const items: NavigationItem[] = [
      { 
        icon: <Home size={20} />, 
        label: 'Dashboard', 
        section: 'dashboard', 
        path: '/dashboard' 
      },
      {
        icon: <Users size={20} />,
        label: 'User Management',
        section: 'users', 
        path: '/dashboard/users'
      },
      {
        icon: <User size={20} />, 
        label: 'My Profile', 
        section: 'profile', 
        path: '/dashboard/profile' 
      },
      {
        icon: <BellRing size={20} />, 
        label: 'Alerts', 
        section: 'alerts', 
        badge: alertCount,
        path: '/dashboard/alerts' 
      },
      {
        icon: <Droplets size={20} />, 
        label: 'Water Usage', 
        section: 'usage', 
        path: '/dashboard/usage' 
      },
      {
        icon: <BarChart3 size={20} />, 
        label: 'Analytics', 
        section: 'analytics', 
        path: '/dashboard/analytics' 
      },
      {
        icon: <History size={20} />, 
        label: 'Activity Logs', 
        section: 'logs', 
        path: '/dashboard/logs' 
      },
      {
        icon: <Cpu size={20} />,
        label: 'Devices',
        section: 'devices', 
        path: '/dashboard/devices' 
      },
      {
        icon: <Settings size={20} />, 
        label: 'System Settings', 
        section: 'settings', 
        path: '/dashboard/settings' 
      },
    ];

    // Super admin only items
    if (userRole === 'super_admin') {
      items.push(
        {
          icon: <UserCog size={20} />,
          label: 'Admin Management',
          section: 'admin', 
          requiresSuperAdmin: true,
          isSuperAdminOnly: true,
          path: '/dashboard/admin' 
        },
        {
          icon: <Key size={20} />, 
          label: 'Access Control', 
          section: 'access-control', 
          requiresSuperAdmin: true,
          isSuperAdminOnly: true,
          path: '/dashboard/access-control' 
        },
        {
          icon: <FileText size={20} />, 
          label: 'Audit Logs', 
          section: 'audit-logs', 
          requiresSuperAdmin: true,
          isSuperAdminOnly: true,
          path: '/dashboard/audit-logs' 
        }
        // Database and System Health items have been removed
      );
    }

    return items;
  }, [userRole, alertCount]);

  const handleItemClick = useCallback((item: NavigationItem) => {
    if (item.requiresSuperAdmin && userRole !== 'super_admin') return;
    
    onSectionChange(item.section);
    if (item.path) router.push(item.path);
  }, [userRole, router, onSectionChange]);

  const handleLogout = useCallback(() => {
    document.cookie = 'admin_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('admin_user');
    router.push('/auth/super-admin');
  }, [router]);

  const getIsActive = useCallback((item: NavigationItem) => {
    if (!item.path || !pathname) return false;
    if (item.path === '/dashboard') return pathname === '/dashboard' || pathname === '/';
    return pathname.startsWith(item.path);
  }, [pathname]);

  if (isMobile && !isOpen) {
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

  const user = USER_INFO[userRole];

  return (
    <>
      <div className={`
        ${styles.container} 
        ${isOpen ? styles.open : ''}
        ${isMobile ? styles.mobile : ''}
      `}>
        
        <div className={styles.content}>
          {isMobile && (
            <button 
              onClick={onToggle}
              className={styles.closeButton}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}

          {/* Centered Logo Section */}
          <div className={styles.logoSection}>
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>
                <div className={styles.logoImageContainer}>
                  <img
                    src="/Flowsync.png"
                    alt="FlowSync"
                    className={styles.logoImage}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.parentElement;
                      if (fallback) {
                        fallback.innerHTML = `
                          <div style="
                            width: 40px;
                            height: 40px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-weight: bold;
                            font-size: 14px;
                          ">
                            FS
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Role badge centered below logo */}
            <div className={styles.roleBadgeContainer}>
              <div className={styles.roleBadge} style={{ background: user.gradient }}>
                {user.icon}
                <span>{user.badge}</span>
              </div>
            </div>

            <nav className={styles.navigation}>
              {navigationItems.map((item) => {
                const isActive = getIsActive(item);
                
                return (
                  <NavItem
                    key={item.section}
                    item={item}
                    isActive={isActive}
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

          <div className={styles.actionButtons}>
            <button 
              onClick={handleLogout}
              className={styles.logoutButton}
              title="Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          <div className={styles.userSection}>
            <div className={styles.userCard}>
              <div 
                className={styles.userAvatar}
                style={{ background: user.gradient }}
              >
                {user.short}
                {userRole === 'super_admin' && (
                  <div className={styles.superAdminCrown}>👑</div>
                )}
              </div>
              
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  {user.title}
                </div>
                <div className={styles.userEmail}>{adminEmail}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMobile && isOpen && (
        <div 
          onClick={onToggle}
          className={styles.mobileOverlay}
        />
      )}
    </>
  );
}