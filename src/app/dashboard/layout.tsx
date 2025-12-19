'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [alertCount, setAlertCount] = useState(0);
  const pathname = usePathname();

  // Handle section change from sidebar
  const handleSectionChange = (section: string) => {
    console.log(`🔀 DashboardLayout: Section changed to ${section}`);
  };

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    console.log(`📍 DashboardLayout: Pathname changed to ${pathname}`);
    const mockAlertCount = Math.floor(Math.random() * 10);
    setAlertCount(mockAlertCount);
    
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AdminAuthProvider>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#0f172a',
        position: 'relative'
      }}>
        <Sidebar
          isOpen={sidebarOpen}
          onSectionChange={handleSectionChange}
          alertCount={alertCount}
          onToggle={toggleSidebar}
        />

        <main style={{
          flex: 1,
          minHeight: '100vh',
          marginLeft: sidebarOpen ? '280px' : '0',
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          position: 'relative',
          overflowX: 'hidden'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            position: 'sticky',
            top: 0,
            zIndex: 50
          }}>
            <button 
              onClick={toggleSidebar}
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '10px',
                color: '#cbd5e1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              aria-label="Toggle sidebar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#cbd5e1',
              fontSize: '14px'
            }}>
              <span style={{
                fontWeight: 600,
                color: 'white',
                fontSize: '16px'
              }}>
                Dashboard
              </span>
            </div>
          </div>

          <div style={{
            flex: 1,
            padding: '1.5rem',
            position: 'relative',
            overflowY: 'auto'
          }}>
            {children}
          </div>

          <footer style={{
            padding: '1rem 1.5rem',
            background: 'rgba(15, 23, 42, 0.5)',
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              color: '#94a3b8',
              fontSize: '14px'
            }}>
              <span>FlowSync Admin Portal v1.0</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} FlowSync Systems</span>
            </div>
          </footer>
        </main>
      </div>
    </AdminAuthProvider>
  );
}