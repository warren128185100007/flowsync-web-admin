// src/components/dashboard/AlertPreview.tsx
'use client';

import { AlertTriangle } from 'lucide-react';
import { Alert } from '@/lib/mock-data';

interface AlertPreviewProps {
  alerts: Alert[];
  showViewAll?: boolean;
}

export default function AlertPreview({ alerts, showViewAll = true }: AlertPreviewProps) {
  return (
    <div style={{ 
      background: 'rgba(30, 41, 59, 0.7)', 
      borderRadius: '16px', 
      padding: '24px', 
      marginBottom: '30px' 
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#e2e8f0', 
          margin: 0 
        }}>
          Recent Alerts
        </h2>
        {showViewAll && (
          <button style={{ 
            color: '#0ea5e9', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '14px',
            fontWeight: '600'
          }}>
            View All →
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.map((alert) => (
          <div key={alert.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            borderLeft: `4px solid ${
              alert.severity === 'critical' ? '#ef4444' : 
              alert.severity === 'high' ? '#f59e0b' : 
              '#0ea5e9'
            }`
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '4px' 
              }}>
                <AlertTriangle size={16} color={
                  alert.severity === 'critical' ? '#ef4444' : 
                  alert.severity === 'high' ? '#f59e0b' : 
                  '#0ea5e9'
                } />
                <span style={{ fontWeight: '600', color: '#e2e8f0' }}>
                  {alert.message}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                {alert.location} • {alert.time}
              </div>
            </div>
            <div style={{
              padding: '6px 12px',
              background: alert.status === 'active' ? 
                'rgba(239, 68, 68, 0.1)' : 
                'rgba(16, 185, 129, 0.1)',
              color: alert.status === 'active' ? '#ef4444' : '#10b981',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {alert.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}