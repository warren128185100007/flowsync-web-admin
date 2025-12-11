// src/app/dashboard/database/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Download, Trash2, Shield } from 'lucide-react';

export default function DatabasePage() {
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

  if (userRole !== 'super-admin') {
    return <div>⛔ Super Admin Access Required</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: 'white' }}><Database /> Database Management</h1>
      <div style={{ color: '#94a3b8', margin: '1rem 0' }}>
        Manage system database, backups, and maintenance operations.
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button style={buttonStyle}>
          <Download /> Create Backup
        </button>
        <button style={buttonStyle}>
          <Trash2 /> Optimize DB
        </button>
        <button style={{...buttonStyle, background: 'rgba(239,68,68,0.1)', color: '#ef4444'}}>
          <Shield /> Purge Data
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '1rem 1.5rem',
  background: 'rgba(30,41,59,0.8)',
  border: '1px solid rgba(148,163,184,0.2)',
  borderRadius: '10px',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};