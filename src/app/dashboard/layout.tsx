// src/app/dashboard/layout.tsx (Updated - Welcome section removed)
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userRole, setUserRole] = useState<'super-admin' | 'admin' | 'user'>('super-admin');
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log('=== DASHBOARD LAYOUT INIT ===');
    console.log('Current pathname:', pathname);
    
    // Check authentication
    const checkAuth = () => {
      const userData = localStorage.getItem('admin_user');
      console.log('User data from localStorage:', userData);
      
      if (!userData) {
        console.log('❌ No authentication data found. Redirecting to login...');
        router.push('/auth/super-admin');
        return;
      }
      
      try {
        const user = JSON.parse(userData);
        console.log('✅ User authenticated:', user);
        setUserRole(user.role || 'super-admin');
        setUserEmail(user.email || '');
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        localStorage.removeItem('admin_user');
        router.push('/auth/super-admin');
      } finally {
        setIsLoading(false);
        console.log('✅ Authentication check complete');
      }
    };
    
    checkAuth();
  }, [router]);

  // Extract active section from URL
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      
      if (lastSegment && lastSegment !== 'dashboard') {
        setActiveSection(lastSegment);
      } else {
        setActiveSection('dashboard');
      }
      
      console.log('📌 Active section updated to:', activeSection);
    }
  }, [pathname]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    console.log('Section changed to:', section);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#0f172a',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading FlowSync Dashboard...</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Initializing system...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <Sidebar
        isOpen={isSidebarOpen}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        userRole={userRole}
        alertCount={5}
        onToggle={handleToggleSidebar}
      />
      <main style={{ 
        flex: 1, 
        padding: '2rem',
        marginLeft: isSidebarOpen ? '300px' : '80px',
        transition: 'margin-left 0.3s ease',
        overflowY: 'auto',
        color: 'white',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
      }}>
        {/* User Info Header - REMOVED */}
        
        {children}
      </main>
    </div>
  );
}