// src/components/dashboard/Profile.tsx
'use client';

import { Mail, Phone, Map, ShieldCheck, Cpu, BellRing, Droplets, MapPin } from 'lucide-react';
import { userProfile } from '@/lib/mock-data';

export default function Profile() {
  return (
    <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold'
        }}>
          {userProfile.name.charAt(0)}
        </div>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#e2e8f0', margin: '0 0 8px 0' }}>{userProfile.name}</h2>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#94a3b8' }}>
            <span>{userProfile.role}</span>
            <span>•</span>
            <span>Joined {userProfile.joinedDate}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Profile Info */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#e2e8f0', marginBottom: '20px' }}>Profile Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <InfoRow icon={<Mail size={16} />} label="Email" value={userProfile.email} />
            <InfoRow icon={<Phone size={16} />} label="Phone" value={userProfile.phone} />
            <InfoRow icon={<Map size={16} />} label="Address" value={userProfile.address} />
            <InfoRow icon={<ShieldCheck size={16} />} label="Account Type" value={userProfile.role} />
          </div>
        </div>

        {/* Account Stats */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#e2e8f0', marginBottom: '20px' }}>Account Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <StatBox label="Total Devices" value={userProfile.totalDevices} icon={<Cpu />} color="#0ea5e9" />
            <StatBox label="Active Alerts" value={userProfile.activeAlerts} icon={<BellRing />} color="#ef4444" />
            <StatBox label="Monthly Usage" value={userProfile.monthlyUsage} icon={<Droplets />} color="#10b981" />
            <StatBox label="Zones" value="4" icon={<MapPin />} color="#8b5cf6" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
        <button style={{
          padding: '12px 24px',
          background: 'rgba(14, 165, 233, 0.1)',
          border: '1px solid rgba(14, 165, 233, 0.2)',
          borderRadius: '10px',
          color: '#0ea5e9',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Edit Profile
        </button>
        <button style={{
          padding: '12px 24px',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '10px',
          color: '#8b5cf6',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Change Password
        </button>
        <button style={{
          padding: '12px 24px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '10px',
          color: '#ef4444',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ color: '#94a3b8' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{label}</div>
        <div style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: '500' }}>{value}</div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon, color }: any) {
  return (
    <div style={{ 
      background: 'rgba(15, 23, 42, 0.5)', 
      borderRadius: '12px', 
      padding: '16px',
      border: `1px solid ${color}20`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ color }}>{icon}</div>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{label}</div>
      </div>
      <div style={{ fontSize: '20px', fontWeight: '700', color }}>{value}</div>
    </div>
  );
}