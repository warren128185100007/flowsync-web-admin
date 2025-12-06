// src/components/layout/Sidebar.tsx
'use client';

import { Home, User, Cpu, BellRing, Zap, Droplets, BarChart3, History, Users, Settings, Database, Waves, Power } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: string;
  alertCount: number;
}

export default function Sidebar({ isOpen, activeSection, onSectionChange, userRole, alertCount }: SidebarProps) {
  const styles = {
    container: {
      position: 'fixed' as const,
      left: 0,
      top: 0,
      height: '100vh',
      width: isOpen ? '280px' : '0',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '5px 0 30px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
      transition: 'width 0.3s ease',
      overflow: 'hidden' as const,
      borderRight: '1px solid rgba(148, 163, 184, 0.1)'
    }
  };

  return (
    <div style={styles.container}>
      {isOpen && (
        <div style={{ padding: '30px 20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Logo */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Waves size={24} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0ea5e9', margin: 0 }}>
                  FlowSync
                </h1>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  WATER MONITORING
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: <Home size={20} />, label: 'Dashboard', section: 'dashboard' },
                { icon: <User size={20} />, label: 'My Profile', section: 'profile' },
                { icon: <Cpu size={20} />, label: 'Devices', section: 'devices' },
                { icon: <BellRing size={20} />, label: 'Alerts', section: 'alerts', badge: alertCount },
                { icon: <Zap size={20} />, label: 'Control Panel', section: 'control' },
                { icon: <Droplets size={20} />, label: 'Water Usage', section: 'usage' },
                { icon: <BarChart3 size={20} />, label: 'Analytics', section: 'analytics' },
                { icon: <History size={20} />, label: 'Logs History', section: 'logs' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => onSectionChange(item.section)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    background: activeSection === item.section ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                    border: 'none',
                    borderRadius: '12px',
                    color: activeSection === item.section ? '#0ea5e9' : '#cbd5e1',
                    fontSize: '15px',
                    fontWeight: activeSection === item.section ? '600' : '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    position: 'relative'
                  }}
                >
                  <div style={{ color: activeSection === item.section ? '#0ea5e9' : '#94a3b8' }}>
                    {item.icon}
                  </div>
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <span style={{
                      position: 'absolute',
                      right: '16px',
                      background: '#ef4444',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Emergency Button */}
          <div style={{ marginTop: 'auto' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              color: '#ef4444',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}>
              <Power size={20} />
              Emergency Shutdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
}