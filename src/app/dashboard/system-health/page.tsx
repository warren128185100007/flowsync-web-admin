// src/app/dashboard/system-health/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Server, 
  Cpu, 
  Activity, 
  HardDrive, 
  Database, 
  Network, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  BarChart3,
  Zap,
  Wifi,
  Cloud,
  Lock
} from 'lucide-react';

export default function SystemHealthPage() {
  const [systemHealth, setSystemHealth] = useState({
    overall: 98,
    cpu: { usage: 45, temperature: 65, status: 'healthy' },
    memory: { used: 2.4, total: 8, usage: 30, status: 'healthy' },
    storage: { used: 120, total: 256, usage: 47, status: 'healthy' },
    network: { latency: 28, uptime: 99.8, status: 'healthy' },
    database: { connections: 24, response: 12, status: 'healthy' },
    security: { threats: 0, lastScan: '2 hours ago', status: 'healthy' }
  });

  const [systemMetrics, setSystemMetrics] = useState({
    uptime: '15 days 7 hours',
    lastBackup: '2024-01-15 14:30',
    activeServices: 24,
    failedServices: 0,
    responseTime: '42ms',
    loadAverage: [1.2, 1.5, 1.8]
  });

  const [logs, setLogs] = useState([
    { id: 1, time: '14:30:22', component: 'API Gateway', message: 'Health check passed', status: 'success' },
    { id: 2, time: '14:28:15', component: 'Database', message: 'Connection pool optimized', status: 'info' },
    { id: 3, time: '14:25:43', component: 'Cache Server', message: 'Memory usage normalized', status: 'success' },
    { id: 4, time: '14:20:18', component: 'Network', message: 'Latency spike detected', status: 'warning' },
    { id: 5, time: '14:15:32', component: 'Security', message: 'Firewall rules updated', status: 'success' },
    { id: 6, time: '14:10:55', component: 'Backup Service', message: 'Scheduled backup completed', status: 'success' },
    { id: 7, time: '14:05:41', component: 'Load Balancer', message: 'Traffic distribution optimized', status: 'info' },
    { id: 8, time: '14:00:12', component: 'Monitoring', message: 'System scan completed', status: 'success' },
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'info': return '#0ea5e9';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'critical': return <XCircle size={16} />;
      case 'info': return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const refreshSystemHealth = () => {
    // Simulate fetching fresh data
    setLastUpdate(new Date());
    
    // Simulate small random changes in metrics
    setSystemHealth(prev => ({
      ...prev,
      cpu: { 
        ...prev.cpu, 
        usage: Math.max(10, Math.min(90, prev.cpu.usage + (Math.random() * 10 - 5))),
        temperature: Math.max(50, Math.min(80, prev.cpu.temperature + (Math.random() * 4 - 2)))
      },
      memory: {
        ...prev.memory,
        usage: Math.max(20, Math.min(80, prev.memory.usage + (Math.random() * 5 - 2.5)))
      }
    }));

    // Add a new log entry
    const newLog = {
      id: logs.length + 1,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      component: ['API Gateway', 'Database', 'Cache', 'Network', 'Security'][Math.floor(Math.random() * 5)],
      message: 'System health check performed',
      status: 'success'
    };
    
    setLogs(prev => [newLog, ...prev.slice(0, 7)]);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(refreshSystemHealth, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const healthComponents = [
    {
      title: 'CPU Performance',
      value: `${systemHealth.cpu.usage}%`,
      subtitle: `${systemHealth.cpu.temperature}°C`,
      icon: <Cpu size={24} />,
      color: '#0ea5e9',
      status: systemHealth.cpu.status,
      metrics: [
        { label: 'Usage', value: `${systemHealth.cpu.usage}%` },
        { label: 'Temperature', value: `${systemHealth.cpu.temperature}°C` },
        { label: 'Cores', value: '8' },
        { label: 'Frequency', value: '3.2 GHz' }
      ]
    },
    {
      title: 'Memory',
      value: `${systemHealth.memory.usage}%`,
      subtitle: `${systemHealth.memory.used} / ${systemHealth.memory.total} GB`,
      icon: <Activity size={24} />,
      color: '#8b5cf6',
      status: systemHealth.memory.status,
      metrics: [
        { label: 'Used', value: `${systemHealth.memory.used} GB` },
        { label: 'Available', value: `${systemHealth.memory.total - systemHealth.memory.used} GB` },
        { label: 'Total', value: `${systemHealth.memory.total} GB` },
        { label: 'Cache', value: '1.2 GB' }
      ]
    },
    {
      title: 'Storage',
      value: `${systemHealth.storage.usage}%`,
      subtitle: `${systemHealth.storage.used} / ${systemHealth.storage.total} GB`,
      icon: <HardDrive size={24} />,
      color: '#10b981',
      status: systemHealth.storage.status,
      metrics: [
        { label: 'Used', value: `${systemHealth.storage.used} GB` },
        { label: 'Free', value: `${systemHealth.storage.total - systemHealth.storage.used} GB` },
        { label: 'Total', value: `${systemHealth.storage.total} GB` },
        { label: 'IOPS', value: '2.4k' }
      ]
    },
    {
      title: 'Network',
      value: `${systemHealth.network.latency}ms`,
      subtitle: `${systemHealth.network.uptime}% uptime`,
      icon: <Network size={24} />,
      color: '#f59e0b',
      status: systemHealth.network.status,
      metrics: [
        { label: 'Latency', value: `${systemHealth.network.latency} ms` },
        { label: 'Uptime', value: `${systemHealth.network.uptime}%` },
        { label: 'Bandwidth', value: '1.2 Gbps' },
        { label: 'Packets', value: '12.4k/s' }
      ]
    },
    {
      title: 'Database',
      value: `${systemHealth.database.connections}`,
      subtitle: `${systemHealth.database.response}ms response`,
      icon: <Database size={24} />,
      color: '#ec4899',
      status: systemHealth.database.status,
      metrics: [
        { label: 'Connections', value: systemHealth.database.connections },
        { label: 'Response', value: `${systemHealth.database.response} ms` },
        { label: 'Queries', value: '245/s' },
        { label: 'Cache Hit', value: '98%' }
      ]
    },
    {
      title: 'Security',
      value: `${systemHealth.security.threats}`,
      subtitle: `Scan: ${systemHealth.security.lastScan}`,
      icon: <Shield size={24} />,
      color: '#6366f1',
      status: systemHealth.security.status,
      metrics: [
        { label: 'Threats', value: systemHealth.security.threats },
        { label: 'Last Scan', value: systemHealth.security.lastScan },
        { label: 'Firewall', value: 'Active' },
        { label: 'Encryption', value: 'TLS 1.3' }
      ]
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div>
            <h1 style={{ 
              color: 'white', 
              fontSize: '2.5rem', 
              fontWeight: '800',
              marginBottom: '0.5rem'
            }}>
              System Health
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
              Comprehensive monitoring and diagnostics dashboard
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '10px',
              fontSize: '14px',
              color: '#94a3b8'
            }}>
              <Clock size={16} />
              Last update: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            
            <button
              onClick={refreshSystemHealth}
              style={{
                padding: '10px 20px',
                background: 'rgba(14, 165, 233, 0.1)',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                borderRadius: '10px',
                color: '#0ea5e9',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Overall Health Status */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: `conic-gradient(#10b981 ${systemHealth.overall * 3.6}deg, rgba(16, 185, 129, 0.1) 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '700',
              color: '#10b981'
            }}>
              {systemHealth.overall}%
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
              Overall System Health
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
              Excellent
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>
                All systems operational
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#94a3b8', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            Auto-refresh (30s)
          </label>
          
          <button style={{
            padding: '10px 20px',
            background: 'rgba(30, 41, 59, 0.8)',
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
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* System Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Clock size={24} style={{ color: '#8b5cf6' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
            {systemMetrics.uptime.split(' ')[0]}d
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>System Uptime</div>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Server size={24} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
            {systemMetrics.activeServices}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Active Services</div>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(14, 165, 233, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Zap size={24} style={{ color: '#0ea5e9' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
            {systemMetrics.responseTime}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Avg Response Time</div>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <BarChart3 size={24} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
            {systemMetrics.loadAverage[0].toFixed(1)}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Load Average (1m)</div>
        </div>
      </div>

      {/* Health Components Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {healthComponents.map((component, index) => (
          <div 
            key={index}
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: `1px solid ${getStatusColor(component.status)}30`,
              borderRadius: '16px',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = `0 20px 40px ${component.color}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${component.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: component.color
                  }}>
                    {component.icon}
                  </div>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                      {component.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ color: getStatusColor(component.status) }}>
                        {getStatusIcon(component.status)}
                      </div>
                      <span style={{ 
                        color: getStatusColor(component.status),
                        textTransform: 'capitalize',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {component.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: component.color }}>
                  {component.value}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                  {component.subtitle}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ 
                height: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: component.title === 'CPU Performance' ? `${systemHealth.cpu.usage}%` :
                         component.title === 'Memory' ? `${systemHealth.memory.usage}%` :
                         component.title === 'Storage' ? `${systemHealth.storage.usage}%` : '100%',
                  height: '100%',
                  background: component.color,
                  borderRadius: '3px'
                }} />
              </div>
            </div>
            
            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {component.metrics.map((metric, idx) => (
                <div key={idx}>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>
                    {metric.label}
                  </div>
                  <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* System Logs */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '16px',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>
            System Logs
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{
              padding: '8px 16px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '8px',
              color: '#94a3b8',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Filter Logs
            </button>
            <button style={{
              padding: '8px 16px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '8px',
              color: '#94a3b8',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Clear Logs
            </button>
          </div>
        </div>
        
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {logs.map((log) => (
            <div 
              key={log.id}
              style={{
                padding: '1rem',
                borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 3fr 1fr',
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
              <div style={{ color: '#94a3b8', fontSize: '14px', fontFamily: 'monospace' }}>
                {log.time}
              </div>
              
              <div>
                <span style={{
                  padding: '4px 8px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '6px',
                  color: '#cbd5e1',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {log.component}
                </span>
              </div>
              
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                {log.message}
              </div>
              
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  justifyContent: 'flex-end'
                }}>
                  <div style={{ color: getStatusColor(log.status) }}>
                    {getStatusIcon(log.status)}
                  </div>
                  <span style={{ 
                    color: getStatusColor(log.status),
                    textTransform: 'capitalize',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {log.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>
            ✅ System is operating within normal parameters
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