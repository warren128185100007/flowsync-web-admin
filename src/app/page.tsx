// src/app/page.tsx
'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole] = useState('admin');

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    },
    mainContent: {
      flex: 1,
      marginLeft: isSidebarOpen ? '280px' : '0',
      transition: 'margin-left 0.3s ease',
      minHeight: '100vh',
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
          <TopBar
            activeSection={activeSection}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            alertCount={activeAlertsCount}
          />

          {renderSection()}
        </div>
      </div>
    </div>
  );
}