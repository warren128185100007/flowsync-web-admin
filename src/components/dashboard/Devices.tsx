// src/components/dashboard/Devices.tsx
'use client';

import DeviceStatus from './DeviceStatus';
import { devices } from '@/lib/mock-data';

export default function Devices() {
  return (
    <div>
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: '800', 
        color: '#e2e8f0', 
        marginBottom: '24px' 
      }}>
        Device Management
      </h1>
      
      {/* Device Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
            Total Devices
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0ea5e9' }}>
            {devices.length}
          </div>
        </div>
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
            Online Devices
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#10b981' }}>
            {devices.filter(d => d.status === 'online').length}
          </div>
        </div>
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
            Avg Battery
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#f59e0b' }}>
            {Math.round(devices.reduce((acc, d) => acc + d.battery, 0) / devices.length)}%
          </div>
        </div>
      </div>

      {/* Full Device List */}
      <DeviceStatus devices={devices} />
    </div>
  );
}