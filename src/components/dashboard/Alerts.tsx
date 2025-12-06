// src/components/dashboard/Alerts.tsx
'use client';

import AlertPreview from './AlertPreview';
import { alerts } from '@/lib/mock-data';

export default function Alerts() {
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  
  return (
    <div>
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: '800', 
        color: '#e2e8f0', 
        marginBottom: '24px' 
      }}>
        Alert Management
      </h1>
      
      {/* Alert Stats */}
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
            Total Alerts
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0ea5e9' }}>
            {alerts.length}
          </div>
        </div>
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
            Active Alerts
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#ef4444' }}>
            {activeAlerts.length}
          </div>
        </div>
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
            Critical Alerts
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#ef4444' }}>
            {criticalAlerts.length}
          </div>
        </div>
      </div>

      {/* Full Alert List */}
      <AlertPreview alerts={alerts} showViewAll={false} />
    </div>
  );
}