// src/components/layout/Sidebar.tsx - WITH SHRINKING SIDEBAR
'use client';

import { 
  Home, 
  User, 
  Cpu, 
  BellRing, 
  Zap, 
  Droplets, 
  BarChart3, 
  History, 
  Users, 
  Settings, 
  Waves, 
  Power,
  Menu,
  X,
  ChevronRight,
  Shield,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: string;
  alertCount: number;
  onToggle?: () => void;
}

type SidebarState = 'expanded' | 'collapsed' | 'mobile';

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
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [sidebarState, setSidebarState] = useState<SidebarState>('expanded');
  const [isShrinking, setIsShrinking] = useState(false);

  // Auto-detect mobile state
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setSidebarState('mobile');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle sidebar state changes
  useEffect(() => {
    if (!isOpen) {
      setSidebarState('mobile');
    }
  }, [isOpen]);

  const toggleSidebarSize = () => {
    setIsShrinking(true);
    setTimeout(() => {
      setSidebarState(prev => prev === 'expanded' ? 'collapsed' : 'expanded');
      setIsShrinking(false);
    }, 150);
  };

  const navigationItems = [
    { icon: <Home size={20} />, label: 'Dashboard', section: 'dashboard', color: '#0ea5e9' },
    { icon: <User size={20} />, label: 'My Profile', section: 'profile', color: '#8b5cf6' },
    { icon: <Cpu size={20} />, label: 'Devices', section: 'devices', color: '#10b981' },
    { icon: <BellRing size={20} />, label: 'Alerts', section: 'alerts', color: '#f59e0b', badge: alertCount },
    { icon: <Zap size={20} />, label: 'Control Panel', section: 'control', color: '#f97316' },
    { icon: <Droplets size={20} />, label: 'Water Usage', section: 'usage', color: '#3b82f6' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', section: 'analytics', color: '#6366f1' },
    { icon: <History size={20} />, label: 'Logs History', section: 'logs', color: '#8b5cf6' },
  ];

  // Add admin-only items
  if (userRole === 'admin') {
    navigationItems.push(
      { icon: <Users size={20} />, label: 'User Management', section: 'users', color: '#ec4899' },
      { icon: <Settings size={20} />, label: 'System Settings', section: 'settings', color: '#6b7280' }
    );
  }

  const userInfo = {
    admin: { title: 'Administrator', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', short: 'ADM' },
    engineer: { title: 'System Engineer', color: '#0ea5e9', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)', short: 'ENG' },
    operator: { title: 'Operator', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', short: 'OP' },
    viewer: { title: 'Viewer', color: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', short: 'VW' }
  };

  const user = userInfo[userRole as keyof typeof userInfo] || userInfo.viewer;

  const sidebarWidth = sidebarState === 'expanded' ? 300 : sidebarState === 'collapsed' ? 80 : 0;
  const isCollapsed = sidebarState === 'collapsed';
  const isMobile = sidebarState === 'mobile';

  // If sidebar is closed on mobile, show toggle button
  if (!isOpen && isMobile) {
    return (
      <button 
        onClick={onToggle}
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          width: '48px',
          height: '48px',
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '12px',
          color: '#cbd5e1',
          cursor: 'pointer',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
        aria-label="Open sidebar"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3)';
          e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.9)';
        }}
      >
        <Menu size={24} />
      </button>
    );
  }

  // Don't render if mobile and not open
  if (isMobile && !isOpen) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: sidebarWidth,
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.97) 0%, rgba(15, 23, 42, 0.92) 100%)',
        backdropFilter: 'blur(12px)',
        boxShadow: '16px 0 40px rgba(0, 0, 0, 0.4)',
        zIndex: 1000,
        borderRight: '1px solid rgba(148, 163, 184, 0.15)',
        overflow: 'hidden',
        transition: isShrinking ? 'none' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
          zIndex: -1,
          opacity: isCollapsed ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }} />
        
        <div style={{ 
          padding: isCollapsed ? '32px 16px' : '32px 24px', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          overflowX: 'hidden',
        }}>
          {/* Close Button for Mobile */}
          {isMobile && (
            <button 
              onClick={onToggle}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                width: '36px',
                height: '36px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '10px',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 1,
              }}
              aria-label="Close sidebar"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                e.currentTarget.style.color = '#e2e8f0';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
            >
              <X size={20} />
            </button>
          )}

          {/* Logo */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              marginBottom: isCollapsed ? '32px' : '32px',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
            }}>
              <div style={{
                width: isCollapsed ? '48px' : '56px',
                height: isCollapsed ? '48px' : '56px',
                borderRadius: isCollapsed ? '12px' : '16px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(14, 165, 233, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                  animation: 'shimmer 3s infinite linear',
                }} />
                <Waves size={isCollapsed ? 22 : 28} color="white" />
              </div>
              
              {!isCollapsed && (
                <div style={{
                  overflow: 'hidden',
                  animation: isShrinking ? 'none' : 'slideIn 0.3s ease-out',
                }}>
                  <h1 style={{ 
                    fontSize: '28px', 
                    fontWeight: '800', 
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    margin: 0,
                    letterSpacing: '-0.5px',
                    whiteSpace: 'nowrap',
                  }}>
                    FlowSync
                  </h1>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#94a3b8', 
                    margin: '6px 0 0 0',
                    fontWeight: '500',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}>
                    Intelligent Water Management
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '4px', 
              flex: 1,
              alignItems: isCollapsed ? 'center' : 'stretch',
            }}>
              {navigationItems.map((item) => {
                const isActive = activeSection === item.section;
                return (
                  <div key={item.section} style={{ position: 'relative' }}>
                    <button
                      onClick={() => onSectionChange(item.section)}
                      onMouseEnter={() => setIsHovered(item.section)}
                      onMouseLeave={() => setIsHovered(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isCollapsed ? '0' : '14px',
                        padding: isCollapsed ? '16px' : '16px 20px',
                        background: isActive 
                          ? `linear-gradient(90deg, ${item.color}20 0%, ${item.color}10 100%)` 
                          : 'transparent',
                        border: `1px solid ${isActive ? `${item.color}40` : 'transparent'}`,
                        borderRadius: isCollapsed ? '12px' : '14px',
                        color: isActive ? item.color : '#cbd5e1',
                        fontSize: '15px',
                        fontWeight: isActive ? '600' : '500',
                        cursor: 'pointer',
                        textAlign: 'left',
                        position: 'relative',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isHovered === item.section ? 'translateX(4px)' : 'translateX(0)',
                        overflow: 'hidden',
                        width: isCollapsed ? '48px' : '100%',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                      }}
                    >
                      {/* Active indicator */}
                      {isActive && !isCollapsed && (
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '4px',
                          height: '24px',
                          background: item.color,
                          borderRadius: '0 4px 4px 0',
                          boxShadow: `0 0 12px ${item.color}`,
                        }} />
                      )}

                      {/* Active indicator for collapsed */}
                      {isActive && isCollapsed && (
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '3px',
                          background: item.color,
                          borderRadius: '0 4px 4px 0',
                          boxShadow: `0 0 12px ${item.color}`,
                        }} />
                      )}
                      
                      <div style={{ 
                        color: isActive ? item.color : isHovered === item.section ? item.color : '#94a3b8',
                        transition: 'color 0.3s ease',
                        position: 'relative',
                      }}>
                        {item.icon}
                        {item.badge && item.badge > 0 && isCollapsed && (
                          <div style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            width: '8px',
                            height: '8px',
                            background: item.color,
                            borderRadius: '50%',
                            boxShadow: `0 0 8px ${item.color}`,
                          }} />
                        )}
                      </div>
                      
                      {!isCollapsed && (
                        <>
                          <div style={{ flex: 1 }}>{item.label}</div>
                          
                          {/* Chevron for hover state */}
                          {isHovered === item.section && !isActive && (
                            <ChevronRight size={16} style={{ color: item.color }} />
                          )}
                          
                          {/* Alert badge */}
                          {item.badge && item.badge > 0 && (
                            <span style={{
                              background: item.color,
                              color: 'white',
                              fontSize: '11px',
                              fontWeight: '700',
                              padding: '4px 8px',
                              borderRadius: '20px',
                              minWidth: '24px',
                              textAlign: 'center',
                              boxShadow: `0 4px 12px ${item.color}40`,
                              animation: item.section === 'alerts' ? 'pulse 2s infinite' : 'none',
                            }}>
                              {item.badge > 99 ? '99+' : item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (isHovered === item.section || isActive) && (
                      <div style={{
                        position: 'absolute',
                        left: 'calc(100% + 12px)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(8px)',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        color: '#e2e8f0',
                        fontSize: '14px',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        zIndex: 1001,
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        animation: 'fadeIn 0.2s ease-out',
                        pointerEvents: 'none',
                      }}>
                        {item.label}
                        {item.badge && item.badge > 0 && (
                          <span style={{
                            marginLeft: '8px',
                            background: item.color,
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '10px',
                          }}>
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Expand/Collapse Button */}
          {!isMobile && (
            <div style={{ 
              position: 'absolute', 
              top: '24px', 
              right: isCollapsed ? '16px' : '24px',
              transition: 'right 0.3s ease',
            }}>
              <button
                onClick={toggleSidebarSize}
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                  e.currentTarget.style.color = '#e2e8f0';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <ChevronLeft size={16} style={{
                  transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }} />
              </button>
            </div>
          )}

          {/* Emergency Button */}
          <div style={{ 
            marginTop: 'auto', 
            padding: '8px',
            display: 'flex',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
          }}>
            <button 
              onClick={() => setShowEmergencyModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: isCollapsed ? '0' : '12px',
                padding: isCollapsed ? '16px' : '16px 20px',
                background: shutdownConfirmed 
                  ? 'rgba(16, 185, 129, 0.1)' 
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                border: shutdownConfirmed 
                  ? '1px solid rgba(16, 185, 129, 0.3)' 
                  : '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: isCollapsed ? '12px' : '14px',
                color: shutdownConfirmed ? '#10b981' : '#ef4444',
                fontSize: isCollapsed ? '0' : '15px',
                fontWeight: '600',
                cursor: 'pointer',
                width: isCollapsed ? '48px' : '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!shutdownConfirmed && !isCollapsed) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(239, 68, 68, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!shutdownConfirmed && !isCollapsed) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Animated background */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: shutdownConfirmed 
                  ? 'linear-gradient(45deg, transparent 30%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)' 
                  : 'linear-gradient(45deg, transparent 30%, rgba(239, 68, 68, 0.1) 50%, transparent 70%)',
                animation: shutdownConfirmed ? 'shimmer 2s infinite linear' : 'none',
              }} />
              
              <Power size={20} />
              {!isCollapsed && (
                <span style={{ 
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  animation: isShrinking ? 'none' : 'slideIn 0.3s ease-out',
                }}>
                  {shutdownConfirmed ? 'Shutdown Complete' : 'Emergency Shutdown'}
                </span>
              )}
            </button>
          </div>

          {/* User Info */}
          <div style={{ 
            marginTop: '24px', 
            paddingTop: '24px', 
            borderTop: '1px solid rgba(148, 163, 184, 0.1)',
            position: 'relative',
            display: isCollapsed ? 'flex' : 'block',
            justifyContent: 'center',
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isCollapsed ? '0' : '14px',
              padding: isCollapsed ? '12px' : '12px 16px',
              background: 'rgba(30, 41, 59, 0.3)',
              borderRadius: isCollapsed ? '10px' : '12px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              transition: 'all 0.3s ease',
              width: isCollapsed ? '48px' : '100%',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
            }}>
              <div style={{
                width: isCollapsed ? '36px' : '40px',
                height: isCollapsed ? '36px' : '40px',
                borderRadius: isCollapsed ? '8px' : '10px',
                background: user.gradient,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: isCollapsed ? '14px' : '16px',
                boxShadow: `0 8px 24px ${user.color}40`,
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                  animation: 'shimmer 3s infinite linear',
                }} />
                {isCollapsed ? user.short : userRole.charAt(0).toUpperCase()}
              </div>
              
              {!isCollapsed && (
                <div style={{ 
                  flex: 1,
                  overflow: 'hidden',
                  animation: isShrinking ? 'none' : 'slideIn 0.3s ease-out',
                }}>
                  <div style={{ 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    color: '#e2e8f0',
                    marginBottom: '2px',
                    whiteSpace: 'nowrap',
                  }}>
                    {user.title}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  }}>
                    <Shield size={10} />
                    <span>Role: {userRole.toUpperCase()}</span>
                  </div>
                </div>
              )}
              
              {!isCollapsed && (
                <div style={{
                  padding: '6px 12px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: user.color,
                  border: `1px solid ${user.color}40`,
                  whiteSpace: 'nowrap',
                }}>
                  ACTIVE
                </div>
              )}
            </div>

            {/* Quick actions for collapsed state */}
            {isCollapsed && (
              <div style={{ 
                marginTop: '16px',
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
              }}>
                <button 
                  onClick={() => setShowEmergencyModal(true)}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  aria-label="Emergency shutdown"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Power size={16} />
                </button>
                <button 
                  onClick={() => console.log('Help clicked')}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  aria-label="Help"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)';
                    e.currentTarget.style.color = '#0ea5e9';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <HelpCircle size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          onClick={onToggle}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(2px)',
            zIndex: 999,
            animation: 'fadeIn 0.3s ease-out',
          }}
        />
      )}

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          animation: 'fadeIn 0.3s ease-out',
        }}>
          <div style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '440px',
            width: '90%',
            boxShadow: '0 24px 80px rgba(239, 68, 68, 0.2)',
            transform: 'scale(0.95)',
            animation: 'scaleIn 0.3s ease-out forwards',
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              marginBottom: '24px',
              paddingBottom: '20px',
              borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 32px rgba(239, 68, 68, 0.4)',
              }}>
                <AlertTriangle size={28} color="white" />
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '22px', 
                  fontWeight: '700', 
                  color: '#ef4444', 
                  margin: 0,
                  marginBottom: '4px',
                }}>
                  Emergency Shutdown
                </h3>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#94a3b8', 
                  margin: 0,
                }}>
                  Critical system action required
                </p>
              </div>
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                marginBottom: '20px',
              }}>
                <p style={{ 
                  color: '#cbd5e1', 
                  fontSize: '15px', 
                  lineHeight: '1.6',
                  margin: 0,
                  fontWeight: '500',
                }}>
                  ⚠️ <strong>This action cannot be undone.</strong> 
                  Emergency shutdown will immediately:
                </p>
                <ul style={{ 
                  color: '#cbd5e1', 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  margin: '12px 0 0 0',
                  paddingLeft: '20px',
                }}>
                  <li>Stop all water flow across the system</li>
                  <li>Disable all connected devices and sensors</li>
                  <li>Trigger audible alarms at all stations</li>
                  <li>Send emergency notifications to all personnel</li>
                  <li>Require manual restart of each subsystem</li>
                </ul>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
              }}>
                <Shield size={20} style={{ color: '#0ea5e9' }} />
                <p style={{ 
                  color: '#94a3b8', 
                  fontSize: '13px',
                  margin: 0,
                  flex: 1,
                }}>
                  <strong>Authorization:</strong> {user.title} • {userRole.toUpperCase()}
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              justifyContent: 'flex-end',
              paddingTop: '20px',
              borderTop: '1px solid rgba(148, 163, 184, 0.1)',
            }}>
              <button 
                onClick={() => setShowEmergencyModal(false)}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '10px',
                  color: '#cbd5e1',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '120px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  console.log('Emergency shutdown initiated');
                  setShutdownConfirmed(true);
                  setShowEmergencyModal(false);
                  // In real app, you would call your shutdown API here
                }}
                style={{
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  minWidth: '160px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(239, 68, 68, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.4)';
                }}
              >
                <Power size={18} />
                Confirm Shutdown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateX(-10px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @media (max-width: 768px) {
          .sidebar-content {
            width: 280px !important;
          }
        }
      `}</style>
    </>
  );
}