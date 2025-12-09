// src/app/page.tsx - Without TopBar
'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Dashboard from '@/components/dashboard/Dashboard';
import Profile from '@/components/dashboard/Profile';
import Devices from '@/components/dashboard/Devices';
import Alerts from '@/components/dashboard/Alerts';
import ControlPanel from '@/components/dashboard/ControlPanel';
import UsageAnalytics from '@/components/dashboard/UsageAnalytics';
import UsersManagement from '@/components/dashboard/UsersManagement';
import Settings from '@/components/dashboard/Settings';
import { alerts } from '@/lib/mock-data';

export default function MainDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userRole] = useState('admin');

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    mainContent: {
      flex: 1,
      marginLeft: isSidebarOpen ? '280px' : '0',
      transition: 'margin-left 0.3s ease',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
    }
  };

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  const renderSection = () => {
    switch(activeSection) {
      case 'profile':
        return <Profile />;
      case 'devices':
        return <Devices />;
      case 'alerts':
        return <Alerts />;
      case 'control':
        return <ControlPanel />;
      case 'usage':
        return <UsageAnalytics />;
      case 'users':
        return userRole === 'admin' ? <UsersManagement /> : <div>Access Denied</div>;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar
        isOpen={isSidebarOpen}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        userRole={userRole}
        alertCount={activeAlertsCount}
      />

      <div style={styles.mainContent}>
        <div style={{ padding: '30px', minHeight: '100vh' }}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}