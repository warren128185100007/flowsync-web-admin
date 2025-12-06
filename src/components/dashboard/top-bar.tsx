// components/dashboard/top-bar.tsx
'use client';

interface TopBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function TopBar({ toggleSidebar, isSidebarOpen }: TopBarProps) {
  return (
    <header style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={toggleSidebar}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '8px',
            borderRadius: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {isSidebarOpen ? '◀' : '▶'}
        </button>
        
        <div style={{
          width: '1px',
          height: '24px',
          backgroundColor: '#e5e7eb'
        }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#6b7280' }}>Dashboard</span>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ fontWeight: '500', color: '#1f2937' }}>Overview</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Notifications */}
        <button style={{
          position: 'relative',
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#6b7280',
          padding: '8px'
        }}>
          🔔
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            backgroundColor: '#ef4444',
            borderRadius: '50%'
          }} />
        </button>

        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            AU
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              Admin User
            </p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}