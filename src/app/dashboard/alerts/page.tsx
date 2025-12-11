// src/app/dashboard/alerts/page.tsx
'use client';

import { useState } from 'react';
import { AlertTriangle, Bell, CheckCircle, XCircle, Clock, Filter, Search, Volume2, BellOff } from 'lucide-react';

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const alerts = [
    { id: 1, title: 'High Water Pressure', severity: 'critical', type: 'Pressure', device: 'Main Sensor', time: '2 minutes ago', status: 'active' },
    { id: 2, title: 'Low Battery - Sensor #4', severity: 'warning', type: 'Battery', device: 'Floor 2 Sensor', time: '15 minutes ago', status: 'active' },
    { id: 3, title: 'Network Connectivity Lost', severity: 'critical', type: 'Network', device: 'Backup Controller', time: '1 hour ago', status: 'acknowledged' },
    { id: 4, title: 'Temperature Threshold Exceeded', severity: 'warning', type: 'Temperature', device: 'Temp Monitor A', time: '3 hours ago', status: 'resolved' },
    { id: 5, title: 'Unauthorized Access Attempt', severity: 'critical', type: 'Security', device: 'System Gateway', time: '5 hours ago', status: 'resolved' },
    { id: 6, title: 'Scheduled Maintenance', severity: 'info', type: 'Maintenance', device: 'System', time: 'Yesterday', status: 'resolved' },
    { id: 7, title: 'Flow Rate Anomaly', severity: 'warning', type: 'Flow', device: 'Flow Meter #2', time: '2 days ago', status: 'resolved' },
    { id: 8, title: 'Backup System Test', severity: 'info', type: 'Test', device: 'Backup Generator', time: '1 week ago', status: 'resolved' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#0ea5e9';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#ef4444';
      case 'acknowledged': return '#f59e0b';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'info': return <Bell size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle size={16} />;
      case 'acknowledged': return <Clock size={16} />;
      case 'resolved': return <CheckCircle size={16} />;
      default: return <XCircle size={16} />;
    }
  };

  const filters = [
    { id: 'all', label: 'All Alerts', count: 8 },
    { id: 'active', label: 'Active', count: 2 },
    { id: 'critical', label: 'Critical', count: 3 },
    { id: 'warning', label: 'Warnings', count: 3 },
    { id: 'resolved', label: 'Resolved', count: 5 },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '2.5rem', 
          fontWeight: '800',
          marginBottom: '0.5rem'
        }}>
          System Alerts
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Monitor and respond to system notifications and alerts
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444'
          }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>2</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Active Alerts</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b'
          }}>
            <Bell size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>6</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>This Week</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>5</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Resolved</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(14, 165, 233, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(14, 165, 233, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0ea5e9'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>42m</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Avg Response</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px'
              }}
            />
          </div>
          
          <button style={{
            padding: '12px 20px',
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '10px',
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Filter size={16} />
            Filter
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{
            padding: '12px 20px',
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '10px',
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <BellOff size={16} />
            Mute All
          </button>
          <button style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Volume2 size={18} />
            Emergency Alert
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '10px' }}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            style={{
              padding: '12px 20px',
              background: activeFilter === filter.id ? 'rgba(30, 41, 59, 0.8)' : 'rgba(30, 41, 59, 0.3)',
              border: activeFilter === filter.id ? '1px solid rgba(14, 165, 233, 0.5)' : '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '10px',
              color: activeFilter === filter.id ? 'white' : '#94a3b8',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {filter.label}
            <span style={{
              padding: '2px 8px',
              background: activeFilter === filter.id ? 'rgba(14, 165, 233, 0.2)' : 'rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              fontSize: '12px',
              color: activeFilter === filter.id ? '#0ea5e9' : '#94a3b8'
            }}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr 1fr',
          gap: '1rem',
          color: '#94a3b8',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <div>Alert</div>
          <div>Severity</div>
          <div>Type</div>
          <div>Device</div>
          <div>Time</div>
          <div>Status</div>
        </div>

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr 1fr',
                gap: '1rem',
                alignItems: 'center',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ color: 'white', fontWeight: '500' }}>{alert.title}</div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: getSeverityColor(alert.severity) }}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <span style={{ 
                    color: getSeverityColor(alert.severity),
                    textTransform: 'capitalize',
                    fontWeight: '500'
                  }}>
                    {alert.severity}
                  </span>
                </div>
              </div>
              
              <div>
                <span style={{
                  padding: '6px 12px',
                  background: alert.type === 'Pressure' ? 'rgba(239, 68, 68, 0.1)' : 
                            alert.type === 'Battery' ? 'rgba(245, 158, 11, 0.1)' :
                            alert.type === 'Network' ? 'rgba(14, 165, 233, 0.1)' :
                            alert.type === 'Temperature' ? 'rgba(251, 191, 36, 0.1)' :
                            alert.type === 'Security' ? 'rgba(139, 92, 246, 0.1)' :
                            alert.type === 'Maintenance' ? 'rgba(16, 185, 129, 0.1)' :
                            alert.type === 'Test' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                  color: alert.type === 'Pressure' ? '#ef4444' : 
                        alert.type === 'Battery' ? '#f59e0b' :
                        alert.type === 'Network' ? '#0ea5e9' :
                        alert.type === 'Temperature' ? '#fbbf24' :
                        alert.type === 'Security' ? '#8b5cf6' :
                        alert.type === 'Maintenance' ? '#10b981' :
                        alert.type === 'Test' ? '#6366f1' : '#94a3b8',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {alert.type}
                </span>
              </div>
              
              <div style={{ color: '#cbd5e1' }}>{alert.device}</div>
              
              <div style={{ color: '#94a3b8' }}>{alert.time}</div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: getStatusColor(alert.status) }}>
                    {getStatusIcon(alert.status)}
                  </div>
                  <span style={{ 
                    color: getStatusColor(alert.status),
                    textTransform: 'capitalize',
                    fontWeight: '500'
                  }}>
                    {alert.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
        <button style={{
          padding: '12px 24px',
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '10px',
          color: '#cbd5e1',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Export Logs
        </button>
        <button style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Acknowledge All
        </button>
      </div>
    </div>
  );
}