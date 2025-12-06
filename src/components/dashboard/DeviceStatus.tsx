// src/components/dashboard/DeviceStatus.tsx
'use client';

import { GitBranch, Wifi, WifiOff, Battery, Activity } from 'lucide-react';
import { Device } from '@/lib/mock-data';

interface DeviceStatusProps {
  devices: Device[];
}

export default function DeviceStatus({ devices }: DeviceStatusProps) {
  return (
    <div style={{ 
      background: 'rgba(30, 41, 59, 0.7)', 
      borderRadius: '16px', 
      padding: '24px' 
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#e2e8f0', 
          margin: 0 
        }}>
          All Devices
        </h2>
        <button style={{ 
          padding: '8px 16px',
          background: 'rgba(14, 165, 233, 0.1)',
          color: '#0ea5e9',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          Add Device
        </button>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {devices.map((device) => (
          <div key={device.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '20px',
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            border: `1px solid ${device.status === 'online' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px', 
              background: device.status === 'online' ? 
                'rgba(16, 185, 129, 0.1)' : 
                'rgba(148, 163, 184, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              {device.status === 'online' ? 
                <Wifi size={28} color="#10b981" /> : 
                <WifiOff size={28} color="#94a3b8" />
              }
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', color: '#e2e8f0', fontSize: '18px' }}>
                  {device.name}
                </span>
                <span style={{
                  padding: '4px 12px',
                  background: device.type === 'valve' ? 
                    'rgba(14, 165, 233, 0.1)' : 
                    'rgba(245, 158, 11, 0.1)',
                  color: device.type === 'valve' ? '#0ea5e9' : '#f59e0b',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {device.type === 'valve' ? 'Valve' : 'Sensor'}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GitBranch size={14} color="#94a3b8" />
                  <span style={{ fontSize: '14px', color: '#94a3b8' }}>{device.location}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Battery size={14} color="#94a3b8" />
                  <span style={{ fontSize: '14px', color: '#94a3b8' }}>{device.battery}%</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={14} color="#94a3b8" />
                  <span style={{ fontSize: '14px', color: '#94a3b8' }}>{device.flowRate}</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{
                padding: '6px 16px',
                background: device.status === 'online' ? 
                  'rgba(16, 185, 129, 0.1)' : 
                  'rgba(148, 163, 184, 0.1)',
                color: device.status === 'online' ? '#10b981' : '#94a3b8',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {device.status}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Last active: {device.lastActivity}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}