// src/app/dashboard/devices/page.tsx
'use client';

import { useState } from 'react';
import { Cpu, Wifi, Battery, AlertCircle, CheckCircle, XCircle, MoreVertical, Search, Filter, Plus } from 'lucide-react';

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const devices = [
    { id: 1, name: 'Main Water Sensor', type: 'Sensor', location: 'Floor 1', status: 'online', battery: 85, signal: 'excellent', lastSeen: '2 mins ago' },
    { id: 2, name: 'Backup Pump Controller', type: 'Controller', location: 'Basement', status: 'online', battery: 92, signal: 'good', lastSeen: '5 mins ago' },
    { id: 3, name: 'Temperature Monitor', type: 'Sensor', location: 'Floor 2', status: 'warning', battery: 45, signal: 'fair', lastSeen: '15 mins ago' },
    { id: 4, name: 'Pressure Regulator', type: 'Controller', location: 'Floor 3', status: 'offline', battery: 0, signal: 'poor', lastSeen: '2 hours ago' },
    { id: 5, name: 'Flow Meter #1', type: 'Sensor', location: 'Main Line', status: 'online', battery: 78, signal: 'excellent', lastSeen: '1 min ago' },
    { id: 6, name: 'Valve Controller A', type: 'Controller', location: 'Section A', status: 'online', battery: 95, signal: 'good', lastSeen: '3 mins ago' },
    { id: 7, name: 'Leak Detector', type: 'Sensor', location: 'Floor 4', status: 'error', battery: 22, signal: 'poor', lastSeen: '1 hour ago' },
    { id: 8, name: 'Backup Generator', type: 'Generator', location: 'External', status: 'online', battery: 100, signal: 'excellent', lastSeen: '10 mins ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle size={16} />;
      case 'warning': return <AlertCircle size={16} />;
      case 'error': return <XCircle size={16} />;
      case 'offline': return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'excellent': return '#10b981';
      case 'good': return '#0ea5e9';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

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
          Device Management
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Monitor and manage all connected devices in your network
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
            <Cpu size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>8</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Total Devices</div>
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
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Online</div>
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
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>2</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>With Issues</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
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
            background: 'rgba(139, 92, 246, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8b5cf6'
          }}>
            <Wifi size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>87%</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Signal Health</div>
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
              placeholder="Search devices..."
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
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '12px',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option value="all">All Devices</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
        
        <button style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease'
        }}>
          <Plus size={18} />
          Add Device
        </button>
      </div>

      {/* Devices Table */}
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
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 0.5fr',
          gap: '1rem',
          color: '#94a3b8',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <div>Device Name</div>
          <div>Type</div>
          <div>Location</div>
          <div>Status</div>
          <div>Battery</div>
          <div>Signal</div>
          <div></div>
        </div>

        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {devices.map((device) => (
            <div 
              key={device.id}
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 0.5fr',
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
              <div>
                <div style={{ color: 'white', fontWeight: '500' }}>{device.name}</div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                  ID: DEV-{device.id.toString().padStart(3, '0')}
                </div>
              </div>
              
              <div>
                <span style={{
                  padding: '6px 12px',
                  background: device.type === 'Sensor' ? 'rgba(14, 165, 233, 0.1)' : 
                            device.type === 'Controller' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                  color: device.type === 'Sensor' ? '#0ea5e9' : 
                        device.type === 'Controller' ? '#10b981' : '#8b5cf6',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {device.type}
                </span>
              </div>
              
              <div style={{ color: '#cbd5e1' }}>{device.location}</div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: getStatusColor(device.status) }}>
                    {getStatusIcon(device.status)}
                  </div>
                  <span style={{ 
                    color: getStatusColor(device.status),
                    textTransform: 'capitalize',
                    fontWeight: '500'
                  }}>
                    {device.status}
                  </span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                  {device.lastSeen}
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Battery size={16} style={{ 
                    color: device.battery > 50 ? '#10b981' : 
                          device.battery > 20 ? '#f59e0b' : '#ef4444'
                  }} />
                  <div style={{ color: 'white', fontWeight: '500' }}>{device.battery}%</div>
                </div>
                <div style={{ 
                  marginTop: '6px',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${device.battery}%`,
                    height: '100%',
                    background: device.battery > 50 ? '#10b981' : 
                              device.battery > 20 ? '#f59e0b' : '#ef4444',
                    borderRadius: '2px'
                  }} />
                </div>
              </div>
              
              <div>
                <div style={{ color: getSignalColor(device.signal), fontWeight: '500', textTransform: 'capitalize' }}>
                  {device.signal}
                </div>
                <div style={{ display: 'flex', gap: '2px', marginTop: '6px' }}>
                  {[1, 2, 3, 4].map((bar) => (
                    <div 
                      key={bar}
                      style={{
                        width: '4px',
                        height: `${device.signal === 'excellent' ? 16 : 
                                device.signal === 'good' ? 12 : 
                                device.signal === 'fair' ? 8 : 4}px`,
                        background: bar <= (device.signal === 'excellent' ? 4 : 
                                         device.signal === 'good' ? 3 : 
                                         device.signal === 'fair' ? 2 : 1) ? 
                                         getSignalColor(device.signal) : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '2px'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <button style={{
                  padding: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease'
                }}>
                  <MoreVertical size={20} />
                </button>
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
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          Refresh All
        </button>
        <button style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          Deploy Update
        </button>
      </div>
    </div>
  );
}