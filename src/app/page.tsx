// app/page.tsx - UPDATED IMPORTS
'use client';

import { useState } from 'react';
import { 
  AlertTriangle, 
  Droplets, 
  Gauge, 
  Waves,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  LogOut,
  User,
  BarChart3,
  Zap,
  Shield,
  MapPin,
  TrendingUp,
  TrendingDown,
  Eye,
  Bell,
  RefreshCw,
  AlertOctagon,
  Thermometer,
  // Changed from Water/Pipe to:
  CloudRain,  // Water icon replacement
  GitBranch,  // Pipe icon replacement
  ShieldAlert,
  FileWarning,
  XCircle
} from 'lucide-react';
import { 
  Line, 
  Bar, 
  Doughnut 
} from 'react-chartjs-2';
import {
  leakDetectionData,
  leakDetectionOptions,
  pressureData,
  pressureOptions,
  leakSeverityData,
  leakSeverityOptions,
  consumptionData,
  consumptionOptions
} from '@/lib/chart-config';

export default function LeakDetectionDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock leak detection data
  const activeLeaks = [
    { 
      id: 1, 
      location: 'Main Pipeline - Zone B', 
      severity: 'critical', 
      detected: '2 hours ago', 
      flowRate: '85 L/min', 
      estimatedLoss: '1,020L',
      status: 'active'
    },
    { 
      id: 2, 
      location: 'Residential Area - Block 4', 
      severity: 'high', 
      detected: '5 hours ago', 
      flowRate: '45 L/min', 
      estimatedLoss: '540L',
      status: 'active'
    },
    { 
      id: 3, 
      location: 'Industrial Zone - Valve 12', 
      severity: 'medium', 
      detected: '12 hours ago', 
      flowRate: '28 L/min', 
      estimatedLoss: '336L',
      status: 'monitoring'
    },
  ];

  const recentAlerts = [
    { id: 1, time: '10:30 AM', location: 'Zone C', type: 'Pressure Drop', severity: 'high' },
    { id: 2, time: '09:15 AM', location: 'Main Tank', type: 'Flow Anomaly', severity: 'medium' },
    { id: 3, time: '08:45 AM', location: 'Zone A', type: 'Minor Leak', severity: 'low' },
    { id: 4, time: 'Yesterday', location: 'Zone D', type: 'Valve Malfunction', severity: 'critical' },
  ];

  const monitoringZones = [
    { name: 'Zone A', status: 'normal', pressure: '45 PSI', flow: '28 L/min', leaks: 0 },
    { name: 'Zone B', status: 'critical', pressure: '28 PSI', flow: '85 L/min', leaks: 1 },
    { name: 'Zone C', status: 'warning', pressure: '38 PSI', flow: '42 L/min', leaks: 0 },
    { name: 'Zone D', status: 'normal', pressure: '52 PSI', flow: '35 L/min', leaks: 0 },
    { name: 'Zone E', status: 'normal', pressure: '48 PSI', flow: '30 L/min', leaks: 0 },
  ];

  const filteredLeaks = activeLeaks.filter(leak =>
    leak.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leak.severity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
    },
    mainContent: {
      flex: 1,
      marginLeft: isSidebarOpen ? '280px' : '0',
      transition: 'margin-left 0.3s ease',
      minHeight: '100vh',
    },
    card: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    },
    waterGradient: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
    criticalGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    warningGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    safeGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: isSidebarOpen ? '280px' : '0',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '5px 0 30px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        borderRight: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        {isSidebarOpen && (
          <div style={{ padding: '30px 20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: styles.waterGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <Waves size={24} color="white" />
                  {/* Water ripple effect */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '12px',
                    border: '2px solid rgba(14, 165, 233, 0.3)',
                    animation: 'waterRipple 2s infinite'
                  }} />
                </div>
                <div>
                  <h1 style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    background: styles.waterGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0
                  }}>
                    FlowSync
                  </h1>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0', letterSpacing: '1px' }}>
                    LEAK DETECTION SYSTEM
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { icon: <Home size={20} />, label: 'Dashboard', active: true },
                  { icon: <AlertTriangle size={20} />, label: 'Active Leaks' },
                  { icon: <MapPin size={20} />, label: 'Zone Monitoring' },
                  { icon: <Activity size={20} />, label: 'Real-time Data' },
                  { icon: <BarChart3 size={20} />, label: 'Analytics' },
                  { icon: <FileWarning size={20} />, label: 'Alerts History' },
                  { icon: <Settings size={20} />, label: 'System Settings' },
                ].map((item, index) => (
                  <button
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      background: item.active 
                        ? 'rgba(14, 165, 233, 0.15)'
                        : 'transparent',
                      border: 'none',
                      borderRadius: '12px',
                      color: item.active ? '#0ea5e9' : '#cbd5e1',
                      fontSize: '15px',
                      fontWeight: item.active ? '600' : '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.3s',
                      borderLeft: item.active ? '3px solid #0ea5e9' : '3px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!item.active) {
                        e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)';
                        e.currentTarget.style.color = '#0ea5e9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!item.active) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#cbd5e1';
                      }
                    }}
                  >
                    <div style={{ 
                      color: item.active ? '#0ea5e9' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {item.icon}
                    </div>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* System Status */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.7)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid rgba(14, 165, 233, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: styles.criticalGradient,
                  animation: 'leakPulse 2s infinite'
                }} />
                <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>
                  ACTIVE LEAKS: 3
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Last detection: 2 hours ago
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 'auto' }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                color: '#ef4444',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              }}
              >
                <LogOut size={20} />
                Emergency Shutdown
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={{
          padding: '30px',
          minHeight: '100vh',
          background: 'rgba(15, 23, 42, 0.95)'
        }}>
          {/* Top Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
          }}>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '800',
                background: styles.waterGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 8px 0'
              }}>
                Leak Detection Dashboard
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
                Real-time monitoring of water leakage and pressure anomalies
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Emergency Alert */}
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: styles.criticalGradient,
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                animation: 'leakPulse 2s infinite'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <AlertOctagon size={18} />
                Emergency Alert
              </button>

              <button style={{
                background: styles.waterGradient,
                color: 'white',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s'
              }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>

              {/* User Profile */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                background: 'rgba(30, 41, 59, 0.7)',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.1)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: styles.waterGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0', margin: 0 }}>
                    Control Room
                  </p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    Main Monitoring Station
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <StatCard 
              icon={<AlertTriangle size={24} />}
              title="Active Leaks"
              value="3"
              change="+2 today"
              gradient={styles.criticalGradient}
              pulse={true}
            />
            <StatCard 
              icon={<Droplets size={24} />}
              title="Water Loss"
              value="1,896L"
              change="+540L/hr"
              gradient={styles.warningGradient}
            />
            <StatCard 
              icon={<Gauge size={24} />}
              title="Avg. Pressure"
              value="42 PSI"
              change="-8 PSI"
              gradient="#0ea5e9"
            />
            <StatCard 
              icon={<Clock size={24} />}
              title="Response Time"
              value="18 min"
              change="-5 min"
              gradient={styles.safeGradient}
            />
          </div>

          {/* Charts Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '24px',
            marginBottom: '30px'
          }}>
            {/* Leak Detection Timeline */}
            <div style={styles.card}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#e2e8f0', margin: '0 0 4px 0' }}>
                    <AlertTriangle size={20} style={{ marginRight: '8px', color: '#ef4444' }} />
                    Leak Detection Timeline
                  </h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                    Abnormal flow patterns detection
                  </p>
                </div>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'rgba(14, 165, 233, 0.1)',
                  border: '1px solid rgba(14, 165, 233, 0.2)',
                  borderRadius: '8px',
                  color: '#0ea5e9',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  <RefreshCw size={14} />
                  Live Update
                </button>
              </div>
              <div style={{ height: '300px' }}>
                <Line data={leakDetectionData} options={leakDetectionOptions} />
              </div>
            </div>

            {/* Zone Pressure Monitoring */}
            <div style={styles.card}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#e2e8f0', margin: '0 0 4px 0' }}>
                    <Thermometer size={20} style={{ marginRight: '8px', color: '#0ea5e9' }} />
                    Zone Pressure Monitoring
                  </h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                    Pressure anomalies across zones
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#ef4444',
                  fontWeight: '600'
                }}>
                  <AlertCircle size={16} />
                  Zone B Critical
                </div>
              </div>
              <div style={{ height: '300px' }}>
                <Bar data={pressureData} options={pressureOptions} />
              </div>
            </div>

            {/* Leak Severity Distribution */}
            <div style={styles.card}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#e2e8f0', margin: '0 0 4px 0' }}>
                    <Activity size={20} style={{ marginRight: '8px', color: '#f59e0b' }} />
                    Leak Severity Distribution
                  </h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                    Current leak severity levels
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  color: '#94a3b8'
                }}>
                  <Eye size={16} />
                  Overview
                </div>
              </div>
              <div style={{ height: '300px', position: 'relative' }}>
                <Doughnut data={leakSeverityData} options={leakSeverityOptions} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#e2e8f0' }}>
                    11%
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Critical Leaks
                  </div>
                </div>
              </div>
            </div>

            {/* Consumption Comparison */}
            <div style={styles.card}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#e2e8f0', margin: '0 0 4px 0' }}>
                    {/* Changed from Water to CloudRain */}
                    <CloudRain size={20} style={{ marginRight: '8px', color: '#10b981' }} />
                    Consumption Comparison
                  </h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                    Impact of leaks on water consumption
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  color: '#ef4444'
                }}>
                  <TrendingUp size={16} />
                  +12% due to leaks
                </div>
              </div>
              <div style={{ height: '300px' }}>
                <Line data={consumptionData} options={consumptionOptions} />
              </div>
            </div>
          </div>

          {/* Active Leaks Section */}
          <div style={styles.card}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e2e8f0', margin: 0 }}>
                  <AlertOctagon size={20} style={{ marginRight: '8px', color: '#ef4444' }} />
                  Active Leak Alerts
                </h2>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: '8px 0 0 0' }}>
                  Real-time leak detection and monitoring
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#94a3b8'
                  }} />
                  <input
                    type="text"
                    placeholder="Search leaks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      padding: '12px 12px 12px 40px',
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '10px',
                      fontSize: '14px',
                      width: '250px',
                      color: '#e2e8f0'
                    }}
                  />
                </div>
                
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: styles.waterGradient,
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Download size={16} />
                  Export Report
                </button>
              </div>
            </div>

            {/* Active Leaks Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {filteredLeaks.map((leak) => (
                <div key={leak.id} style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: `2px solid ${
                    leak.severity === 'critical' ? 'rgba(239, 68, 68, 0.3)' :
                    leak.severity === 'high' ? 'rgba(249, 115, 22, 0.3)' :
                    'rgba(234, 179, 8, 0.3)'
                  }`,
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  {/* Leak indicator pulse */}
                  {leak.status === 'active' && (
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: leak.severity === 'critical' ? '#ef4444' : 
                                 leak.severity === 'high' ? '#f97316' : '#eab308',
                      animation: 'leakPulse 2s infinite'
                    }} />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <MapPin size={16} color="#94a3b8" />
                        <span style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '16px' }}>
                          {leak.location}
                        </span>
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: leak.severity === 'critical' ? 'rgba(239, 68, 68, 0.2)' :
                                   leak.severity === 'high' ? 'rgba(249, 115, 22, 0.2)' :
                                   'rgba(234, 179, 8, 0.2)',
                        color: leak.severity === 'critical' ? '#ef4444' :
                               leak.severity === 'high' ? '#f97316' : '#eab308',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {leak.severity === 'critical' ? <AlertOctagon size={12} /> :
                         leak.severity === 'high' ? <AlertTriangle size={12} /> :
                         <AlertCircle size={12} />}
                        {leak.severity} LEAK
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                        <Droplets size={12} style={{ marginRight: '4px' }} />
                        Flow Rate
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#e2e8f0' }}>
                        {leak.flowRate}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                        <Clock size={12} style={{ marginRight: '4px' }} />
                        Water Loss
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>
                        {leak.estimatedLoss}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    height: '4px',
                    background: 'rgba(148, 163, 184, 0.1)',
                    borderRadius: '2px',
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${leak.severity === 'critical' ? '100%' : leak.severity === 'high' ? '75%' : '50%'}`,
                      height: '100%',
                      background: leak.severity === 'critical' ? styles.criticalGradient :
                                 leak.severity === 'high' ? styles.warningGradient :
                                 '#eab308',
                      borderRadius: '2px'
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      Detected: {leak.detected}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        padding: '8px 16px',
                        background: 'rgba(14, 165, 233, 0.1)',
                        border: '1px solid rgba(14, 165, 233, 0.2)',
                        borderRadius: '8px',
                        color: '#0ea5e9',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(14, 165, 233, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)';
                      }}
                      >
                        <Eye size={14} style={{ marginRight: '4px' }} />
                        Details
                      </button>
                      
                      <button style={{
                        padding: '8px 16px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      }}
                      >
                        <XCircle size={14} style={{ marginRight: '4px' }} />
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone Monitoring */}
          <div style={{ ...styles.card, marginTop: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#e2e8f0', marginBottom: '20px' }}>
              <MapPin size={20} style={{ marginRight: '8px', color: '#0ea5e9' }} />
              Zone Monitoring Status
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {monitoringZones.map((zone) => (
                <div key={zone.name} style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: `1px solid ${
                    zone.status === 'critical' ? 'rgba(239, 68, 68, 0.3)' :
                    zone.status === 'warning' ? 'rgba(249, 115, 22, 0.3)' :
                    'rgba(14, 165, 233, 0.3)'
                  }`,
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontWeight: '600', color: '#e2e8f0' }}>
                      {zone.name}
                    </span>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: zone.status === 'critical' ? '#ef4444' :
                                 zone.status === 'warning' ? '#f59e0b' : '#10b981'
                    }} />
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                    Pressure: <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{zone.pressure}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                    Flow: <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{zone.flow}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: zone.leaks > 0 ? '#ef4444' : '#10b981' }}>
                    Leaks: <span style={{ fontWeight: '600' }}>{zone.leaks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes waterRipple {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        @keyframes leakPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
        }
      `}</style>
    </div>
  );
}

// StatCard Component with pulse animation
function StatCard({ icon, title, value, change, gradient, pulse = false }: any) {
  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      position: 'relative',
      overflow: 'hidden',
      animation: pulse ? 'leakPulse 2s infinite' : 'none'
    }}>
      {/* Water wave effect */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: gradient,
        opacity: '0.3'
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative'
        }}>
          {icon}
          {/* Ripple effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '14px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            animation: 'waterRipple 2s infinite'
          }} />
        </div>
        <div>
          <h3 style={{
            fontSize: '14px',
            color: '#94a3b8',
            margin: '0 0 4px 0',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </h3>
          <p style={{
            fontSize: '28px',
            fontWeight: '800',
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            {value}
          </p>
        </div>
      </div>
      
      <div style={{
        fontSize: '12px',
        color: change.includes('+') || change.includes('-') ? 
               (change.includes('+') ? '#ef4444' : '#10b981') : '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {change.includes('+') ? <TrendingUp size={12} /> : 
         change.includes('-') ? <TrendingDown size={12} /> : null}
        {change}
      </div>
    </div>
  );
}