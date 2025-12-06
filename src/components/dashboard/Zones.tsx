// src/components/dashboard/Zones.tsx
'use client';

import { MapPin } from 'lucide-react';
import { Zone } from '@/lib/mock-data';

interface ZoneMonitoringProps {
  zones: Zone[];
}

export default function Zones({ zones }: ZoneMonitoringProps) {
  return (
    <div style={{ 
      background: 'rgba(30, 41, 59, 0.7)', 
      borderRadius: '16px', 
      padding: '24px' 
    }}>
      <h2 style={{ 
        fontSize: '20px', 
        fontWeight: '700', 
        color: '#e2e8f0', 
        marginBottom: '20px' 
      }}>
        Zone Monitoring
      </h2>
      <div style={{ display: 'grid', gap: '12px' }}>
        {zones.map((zone) => (
          <div key={zone.name} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            border: `1px solid ${
              zone.status === 'critical' ? 'rgba(239, 68, 68, 0.3)' : 
              zone.status === 'warning' ? 'rgba(245, 158, 11, 0.3)' : 
              'rgba(14, 165, 233, 0.3)'
            }`
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '4px' 
              }}>
                <MapPin size={16} color="#94a3b8" />
                <span style={{ fontWeight: '600', color: '#e2e8f0' }}>
                  {zone.name}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Pressure: {zone.pressure} • Flow: {zone.flow} • Devices: {zone.devices}
              </div>
            </div>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: zone.status === 'critical' ? '#ef4444' : 
                        zone.status === 'warning' ? '#f59e0b' : 
                        '#10b981'
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}