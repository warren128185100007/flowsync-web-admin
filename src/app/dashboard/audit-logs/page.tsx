// src/app/dashboard/audit-logs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Search, Eye } from 'lucide-react';

export default function AuditLogsPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState('');
  
  useEffect(() => {
    const userData = localStorage.getItem('admin_user');
    if (!userData || JSON.parse(userData).role !== 'super-admin') {
      router.push('/dashboard');
    } else {
      setUserRole('super-admin');
    }
  }, [router]);

  const logs = [
    { user: 'superadmin@system', action: 'Login', timestamp: '14:30', status: '✅' },
    { user: 'admin@example.com', action: 'User Created', timestamp: '14:25', status: '✅' },
    { user: 'unknown', action: 'Failed Login', timestamp: '14:15', status: '❌' },
  ];

  if (userRole !== 'super-admin') {
    return <div>⛔ Super Admin Access Required</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: 'white' }}><FileText /> Audit Logs</h1>
      <div style={{ color: '#94a3b8', margin: '1rem 0' }}>
        View all system activity and security logs.
      </div>
      
      <div style={{ background: 'rgba(30,41,59,0.5)', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Search size={20} />
          <input placeholder="Search logs..." style={{ background: 'transparent', border: 'none', color: 'white', flex: 1 }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <div>
                <strong style={{ color: 'white' }}>{log.user}</strong>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{log.action}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#94a3b8' }}>{log.timestamp}</div>
                <div>{log.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}