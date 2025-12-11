// src/app/dashboard/control/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Power, 
  Zap, 
  Droplets, 
  Shield, 
  Lock, 
  Unlock, 
  Play, 
  Pause, 
  RefreshCw,
  AlertTriangle,
  Settings,
  BarChart3,
  Cpu,
  Battery,
  Wifi,
  Cloud,
  Database
} from 'lucide-react';

export default function ControlPanelPage() {
  const [systemStatus, setSystemStatus] = useState({
    mainPower: true,
    waterFlow: 'normal',
    pressure: 'optimal',
    security: 'armed',
    automation: 'active',
    backup: 'standby'
  });

  const [systemMetrics, setSystemMetrics] = useState({
    powerUsage: 2450,
    waterFlowRate: 42,
    pressureLevel: 65,
    temperature: 22,
    humidity: 45,
    uptime: '15d 7h 32m'
  });

  const [activeControls, setActiveControls] = useState({
    emergencyStop: false,
    maintenanceMode: false,
    overrideMode: false,
    testMode: false
  });

  const handleToggle = (control: string) => {
    setSystemStatus(prev => ({
      ...prev,
      [control]: !prev[control as keyof typeof prev]
    }));
  };

  const handleControlToggle = (control: string) => {
    setActiveControls(prev => ({
      ...prev,
      [control]: !prev[control as keyof typeof prev]
    }));
  };

  const handleEmergencyStop = () => {
    setActiveControls(prev => ({ ...prev, emergencyStop: true }));
    setSystemStatus(prev => ({ 
      ...prev, 
      mainPower: false,
      waterFlow: 'stopped',
      automation: 'disabled'
    }));
    
    // Simulate emergency stop
    setTimeout(() => {
      alert('🛑 EMERGENCY STOP ACTIVATED\nAll systems have been safely shut down.');
    }, 100);
  };

  const handleResetSystem = () => {
    setActiveControls(prev => ({ 
      ...prev, 
      emergencyStop: false,
      maintenanceMode: false,
      overrideMode: false
    }));
    setSystemStatus({
      mainPower: true,
      waterFlow: 'normal',
      pressure: 'optimal',
      security: 'armed',
      automation: 'active',
      backup: 'standby'
    });
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
          Control Panel
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Real-time system control and monitoring dashboard
        </p>
      </div>

      {/* Emergency Banner */}
      {activeControls.emergencyStop && (
        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AlertTriangle size={32} color="white" />
            <div>
              <div style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>
                EMERGENCY STOP ACTIVATED
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                All systems are shut down. Manual reset required.
              </div>
            </div>
          </div>
          <button 
            onClick={handleResetSystem}
            style={{
              padding: '10px 24px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={16} />
            Reset System
          </button>
        </div>
      )}

      {/* System Status Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Power Control */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: `1px solid ${systemStatus.mainPower ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: systemStatus.mainPower ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: systemStatus.mainPower ? '#10b981' : '#ef4444'
              }}>
                <Power size={24} />
              </div>
              <div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                  Main Power
                </h3>
                <div style={{ 
                  color: systemStatus.mainPower ? '#10b981' : '#ef4444',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: systemStatus.mainPower ? '#10b981' : '#ef4444',
                    animation: systemStatus.mainPower ? 'pulse 2s infinite' : 'none'
                  }} />
                  {systemStatus.mainPower ? 'ONLINE' : 'OFFLINE'}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('mainPower')}
              style={{
                padding: '10px 20px',
                background: systemStatus.mainPower ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: `1px solid ${systemStatus.mainPower ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                borderRadius: '10px',
                color: systemStatus.mainPower ? '#ef4444' : '#10b981',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {systemStatus.mainPower ? 'Turn Off' : 'Turn On'}
            </button>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>
            Controls the main power supply to all connected systems
          </div>
        </div>

        {/* Water Flow Control */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(14, 165, 233, 0.3)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(14, 165, 233, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0ea5e9'
              }}>
                <Droplets size={24} />
              </div>
              <div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                  Water Flow
                </h3>
                <div style={{ 
                  color: '#0ea5e9',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {systemStatus.waterFlow.toUpperCase()}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSystemStatus(prev => ({ ...prev, waterFlow: 'low' }))}
                style={{
                  padding: '8px 16px',
                  background: systemStatus.waterFlow === 'low' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(30, 41, 59, 0.8)',
                  border: `1px solid ${systemStatus.waterFlow === 'low' ? 'rgba(14, 165, 233, 0.5)' : 'rgba(148, 163, 184, 0.3)'}`,
                  borderRadius: '8px',
                  color: systemStatus.waterFlow === 'low' ? '#0ea5e9' : '#94a3b8',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Low
              </button>
              <button
                onClick={() => setSystemStatus(prev => ({ ...prev, waterFlow: 'normal' }))}
                style={{
                  padding: '8px 16px',
                  background: systemStatus.waterFlow === 'normal' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(30, 41, 59, 0.8)',
                  border: `1px solid ${systemStatus.waterFlow === 'normal' ? 'rgba(14, 165, 233, 0.5)' : 'rgba(148, 163, 184, 0.3)'}`,
                  borderRadius: '8px',
                  color: systemStatus.waterFlow === 'normal' ? '#0ea5e9' : '#94a3b8',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Normal
              </button>
              <button
                onClick={() => setSystemStatus(prev => ({ ...prev, waterFlow: 'high' }))}
                style={{
                  padding: '8px 16px',
                  background: systemStatus.waterFlow === 'high' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(30, 41, 59, 0.8)',
                  border: `1px solid ${systemStatus.waterFlow === 'high' ? 'rgba(14, 165, 233, 0.5)' : 'rgba(148, 163, 184, 0.3)'}`,
                  borderRadius: '8px',
                  color: systemStatus.waterFlow === 'high' ? '#0ea5e9' : '#94a3b8',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                High
              </button>
            </div>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>
            Current flow rate: {systemMetrics.waterFlowRate} L/min
          </div>
        </div>

        {/* Security Control */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: `1px solid ${systemStatus.security === 'armed' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: systemStatus.security === 'armed' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: systemStatus.security === 'armed' ? '#8b5cf6' : '#f59e0b'
              }}>
                <Shield size={24} />
              </div>
              <div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                  System Security
                </h3>
                <div style={{ 
                  color: systemStatus.security === 'armed' ? '#8b5cf6' : '#f59e0b',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {systemStatus.security.toUpperCase()}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSystemStatus(prev => ({ 
                ...prev, 
                security: prev.security === 'armed' ? 'disarmed' : 'armed' 
              }))}
              style={{
                padding: '10px 20px',
                background: systemStatus.security === 'armed' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                border: `1px solid ${systemStatus.security === 'armed' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
                borderRadius: '10px',
                color: systemStatus.security === 'armed' ? '#f59e0b' : '#8b5cf6',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {systemStatus.security === 'armed' ? <Unlock size={16} /> : <Lock size={16} />}
              {systemStatus.security === 'armed' ? 'Disarm' : 'Arm'}
            </button>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>
            {systemStatus.security === 'armed' ? 'System is secured and monitored' : 'System is accessible'}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Zap size={24} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
            {systemMetrics.powerUsage.toLocaleString()}W
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Power Usage</div>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(14, 165, 233, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Droplets size={24} style={{ color: '#0ea5e9' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
            {systemMetrics.waterFlowRate} L/min
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Flow Rate</div>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Cpu size={24} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
            {systemMetrics.pressureLevel} PSI
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Pressure</div>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <BarChart3 size={24} style={{ color: '#8b5cf6' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
            {systemMetrics.uptime}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>System Uptime</div>
        </div>
      </div>

      {/* System Controls */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          System Controls
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <button
            onClick={() => handleControlToggle('maintenanceMode')}
            style={{
              padding: '1.5rem',
              background: activeControls.maintenanceMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(30, 41, 59, 0.8)',
              border: `1px solid ${activeControls.maintenanceMode ? 'rgba(245, 158, 11, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`,
              borderRadius: '12px',
              color: activeControls.maintenanceMode ? '#f59e0b' : '#cbd5e1',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            <Settings size={24} />
            {activeControls.maintenanceMode ? 'Exit Maintenance' : 'Enter Maintenance Mode'}
          </button>

          <button
            onClick={() => handleControlToggle('overrideMode')}
            style={{
              padding: '1.5rem',
              background: activeControls.overrideMode ? 'rgba(14, 165, 233, 0.1)' : 'rgba(30, 41, 59, 0.8)',
              border: `1px solid ${activeControls.overrideMode ? 'rgba(14, 165, 233, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`,
              borderRadius: '12px',
              color: activeControls.overrideMode ? '#0ea5e9' : '#cbd5e1',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            {activeControls.overrideMode ? <Pause size={24} /> : <Play size={24} />}
            {activeControls.overrideMode ? 'Disable Override' : 'Manual Override'}
          </button>

          <button
            onClick={() => handleControlToggle('testMode')}
            style={{
              padding: '1.5rem',
              background: activeControls.testMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 41, 59, 0.8)',
              border: `1px solid ${activeControls.testMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`,
              borderRadius: '12px',
              color: activeControls.testMode ? '#10b981' : '#cbd5e1',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw size={24} />
            {activeControls.testMode ? 'End System Test' : 'Run System Test'}
          </button>

          <button
            onClick={handleEmergencyStop}
            style={{
              padding: '1.5rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              color: '#ef4444',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            <Power size={24} />
            EMERGENCY STOP
          </button>
        </div>
      </div>

      {/* Status Indicators */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '16px',
        padding: '2rem'
      }}>
        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          System Status Indicators
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10b981',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ color: '#cbd5e1', fontSize: '14px' }}>Network</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10b981',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ color: '#cbd5e1', fontSize: '14px' }}>Database</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10b981',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ color: '#cbd5e1', fontSize: '14px' }}>API Services</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: systemStatus.security === 'armed' ? '#8b5cf6' : '#f59e0b',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ color: '#cbd5e1', fontSize: '14px' }}>Security</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: systemStatus.backup === 'standby' ? '#0ea5e9' : '#10b981',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ color: '#cbd5e1', fontSize: '14px' }}>Backup</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: systemStatus.automation === 'active' ? '#10b981' : '#6b7280'
            }} />
            <span style={{ color: '#cbd5e1', fontSize: '14px' }}>Automation</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}