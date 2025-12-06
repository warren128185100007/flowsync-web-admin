// src/components/layout/TopBar.tsx
'use client';

import { Search, Bell, ChevronLeft, ChevronRight } from 'lucide-react';

interface TopBarProps {
  activeSection: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  alertCount: number;
}

export default function TopBar({
  activeSection,
  searchQuery,
  onSearchChange,
  onToggleSidebar,
  isSidebarOpen,
  alertCount
}: TopBarProps) {
  
  const sectionTitles: Record<string, string> = {
    dashboard: 'Water Monitoring Dashboard',
    profile: 'My Profile',
    devices: 'Device Management',
    alerts: 'Alerts & Notifications',
    control: 'Control Panel',
    usage: 'Water Usage Analytics',
    users: 'User Management',
    settings: 'System Settings'
  };

  const sectionDescriptions: Record<string, string> = {
    dashboard: 'Real-time monitoring and control of water systems',
    profile: 'Manage your account and preferences',
    devices: 'View and manage connected IoT devices',
    alerts: 'Monitor and respond to system alerts',
    control: 'Remote valve control and commands',
    usage: 'Track water consumption and patterns',
    users: 'Manage user accounts and permissions',
    settings: 'Configure system preferences'
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
      paddingBottom: '20px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
    }}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#e2e8f0', margin: '0 0 8px 0' }}>
          {sectionTitles[activeSection] || 'FlowSync Admin'}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
          {sectionDescriptions[activeSection] || 'Administration panel'}
        </p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              padding: '12px 12px 12px 40px',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '10px',
              fontSize: '14px',
              width: '250px',
              color: '#e2e8f0'
            }}
          />
        </div>

        {/* Notifications */}
        <button style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative'
        }}>
          <Bell size={20} color="#94a3b8" />
          {alertCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#ef4444',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {alertCount}
            </span>
          )}
        </button>

        {/* Toggle Sidebar */}
        <button style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
          color: 'white',
          border: 'none',
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        onClick={onToggleSidebar}
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}