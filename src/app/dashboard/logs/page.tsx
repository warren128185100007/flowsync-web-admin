// src/app/dashboard/logs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');
  const [expandedLogs, setExpandedLogs] = useState<number[]>([]);
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: '2024-01-15 14:30:22',
      user: 'admin@flowsync.com',
      action: 'System Login',
      category: 'Authentication',
      severity: 'info',
      ip: '192.168.1.100',
      details: 'User logged in successfully from IP 192.168.1.100. Session established with secure token.',
      status: 'success'
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:25:10',
      user: 'system',
      action: 'Database Backup',
      category: 'System',
      severity: 'info',
      ip: '127.0.0.1',
      details: 'Automated database backup completed successfully. Backup size: 2.4GB. Duration: 3m 42s.',
      status: 'success'
    },
    {
      id: 3,
      timestamp: '2024-01-15 14:20:45',
      user: 'operator@company.com',
      action: 'Device Configuration Update',
      category: 'Configuration',
      severity: 'warning',
      ip: '192.168.1.50',
      details: 'Device parameters updated for Sensor #24. Temperature threshold changed from 25°C to 30°C. Requires supervisor approval.',
      status: 'warning'
    },
    {
      id: 4,
      timestamp: '2024-01-15 14:15:33',
      user: 'unknown',
      action: 'Failed Login Attempt',
      category: 'Security',
      severity: 'critical',
      ip: '203.0.113.25',
      details: 'Multiple failed login attempts detected from IP 203.0.113.25. Account locked for 15 minutes. Possible brute force attack.',
      status: 'failed'
    },
    {
      id: 5,
      timestamp: '2024-01-15 14:10:18',
      user: 'system',
      action: 'System Health Check',
      category: 'Monitoring',
      severity: 'info',
      ip: '127.0.0.1',
      details: 'Routine system health check completed. All services operational. CPU: 24%, Memory: 2.4/8GB, Disk: 45% used.',
      status: 'success'
    },
    {
      id: 6,
      timestamp: '2024-01-15 14:05:59',
      user: 'viewer@company.com',
      action: 'Access Denied',
      category: 'Security',
      severity: 'critical',
      ip: '192.168.1.75',
      details: 'Unauthorized access attempt to admin panel. User lacks required permissions for this resource.',
      status: 'failed'
    },
    {
      id: 7,
      timestamp: '2024-01-15 14:00:42',
      user: 'admin@flowsync.com',
      action: 'Settings Updated',
      category: 'Configuration',
      severity: 'info',
      ip: '192.168.1.100',
      details: 'System settings updated: Notification preferences changed, email alerts enabled, audit log retention extended to 90 days.',
      status: 'success'
    },
    {
      id: 8,
      timestamp: '2024-01-15 13:55:30',
      user: 'system',
      action: 'Security Policy Applied',
      category: 'Security',
      severity: 'info',
      ip: '127.0.0.1',
      details: 'Updated security policies applied across all systems. Enhanced encryption protocols enabled. All devices compliant.',
      status: 'success'
    },
    {
      id: 9,
      timestamp: '2024-01-15 13:50:15',
      user: 'sensor-device-24',
      action: 'Anomaly Detected',
      category: 'Monitoring',
      severity: 'warning',
      ip: '192.168.1.24',
      details: 'Unusual reading pattern detected on water flow sensor #24. Possible calibration needed. Value: 245 L/min (expected: 180-220 L/min).',
      status: 'warning'
    },
    {
      id: 10,
      timestamp: '2024-01-15 13:45:00',
      user: 'system',
      action: 'Performance Optimization',
      category: 'System',
      severity: 'info',
      ip: '127.0.0.1',
      details: 'Automatic performance optimization completed. Database indexes rebuilt, cache cleared. System response time improved by 18%.',
      status: 'success'
    }
  ]);

  const [filteredLogs, setFilteredLogs] = useState(logs);

  useEffect(() => {
    let filtered = logs;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply severity filter
    if (filter !== 'all') {
      filtered = filtered.filter(log => log.severity === filter);
    }
    
    // Apply time range filter (simplified)
    if (timeRange === '24h') {
      // Keep all logs for demo
      filtered = filtered;
    }
    
    setFilteredLogs(filtered);
  }, [searchTerm, filter, timeRange, logs]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#0ea5e9';
      default: return '#6b7280';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle size={16} />;
      case 'warning': return <AlertCircle size={16} />;
      case 'info': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle size={16} />;
      case 'warning': return <AlertCircle size={16} />;
      case 'failed': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const toggleExpand = (id: number) => {
    if (expandedLogs.includes(id)) {
      setExpandedLogs(expandedLogs.filter(logId => logId !== id));
    } else {
      setExpandedLogs([...expandedLogs, id]);
    }
  };

  const clearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      setLogs([]);
    }
  };

  const refreshLogs = () => {
    // In a real app, this would fetch fresh logs from API
    setLogs([...logs]); // Simulate refresh
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
          System Logs
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Monitor system activities, security events, and audit trails
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
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>
              {logs.length}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Total Logs</div>
          </div>
        </div>

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
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>
              {logs.filter(log => log.severity === 'critical').length}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Critical</div>
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
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>
              2
            </div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Today</div>
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
            <User size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>
              6
            </div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Unique Users</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search logs by user, action, or details..."
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
                minWidth: '120px'
              }}
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                minWidth: '100px'
              }}
            >
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'Authentication', 'Security', 'System', 'Configuration', 'Monitoring'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category === 'all' ? 'all' : category.toLowerCase())}
                style={{
                  padding: '8px 16px',
                  background: filter === (category === 'all' ? 'all' : category.toLowerCase()) ? 'rgba(14, 165, 233, 0.2)' : 'rgba(30, 41, 59, 0.8)',
                  border: `1px solid ${filter === (category === 'all' ? 'all' : category.toLowerCase()) ? 'rgba(14, 165, 233, 0.5)' : 'rgba(148, 163, 184, 0.3)'}`,
                  borderRadius: '20px',
                  color: filter === (category === 'all' ? 'all' : category.toLowerCase()) ? '#0ea5e9' : '#94a3b8',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={refreshLogs}
              style={{
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
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={clearLogs}
              style={{
                padding: '10px 20px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Trash2 size={16} />
              Clear All
            </button>
            <button style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
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
              <Download size={16} />
              Export Logs
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
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
          gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr',
          gap: '1rem',
          color: '#94a3b8',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <div>Timestamp</div>
          <div>User / Source</div>
          <div>Action</div>
          <div>Category</div>
          <div>Severity</div>
          <div>Status</div>
          <div></div>
        </div>

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id}>
                <div 
                  style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr',
                    gap: '1rem',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    background: expandedLogs.includes(log.id) ? 'rgba(30, 41, 59, 0.8)' : 'transparent'
                  }}
                  onClick={() => toggleExpand(log.id)}
                  onMouseEnter={(e) => {
                    if (!expandedLogs.includes(log.id)) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!expandedLogs.includes(log.id)) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ color: '#94a3b8', fontSize: '13px' }}>{log.timestamp}</div>
                  
                  <div>
                    <div style={{ color: 'white', fontWeight: '500', marginBottom: '4px' }}>
                      {log.user}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                      IP: {log.ip}
                    </div>
                  </div>
                  
                  <div style={{ color: '#cbd5e1', fontSize: '14px' }}>{log.action}</div>
                  
                  <div>
                    <span style={{
                      padding: '6px 12px',
                      background: 'rgba(148, 163, 184, 0.1)',
                      color: '#94a3b8',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {log.category}
                    </span>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ color: getSeverityColor(log.severity) }}>
                        {getSeverityIcon(log.severity)}
                      </div>
                      <span style={{ 
                        color: getSeverityColor(log.severity),
                        textTransform: 'capitalize',
                        fontWeight: '500'
                      }}>
                        {log.severity}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ color: getStatusColor(log.status) }}>
                        {getStatusIcon(log.status)}
                      </div>
                      <span style={{ 
                        color: getStatusColor(log.status),
                        textTransform: 'capitalize',
                        fontWeight: '500'
                      }}>
                        {log.status}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    {expandedLogs.includes(log.id) ? (
                      <ChevronUp size={20} style={{ color: '#94a3b8' }} />
                    ) : (
                      <ChevronDown size={20} style={{ color: '#94a3b8' }} />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedLogs.includes(log.id) && (
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
                  }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr',
                      gap: '2rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
                          DETAILS
                        </div>
                        <div style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                          {log.details}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px' }}>
                          ADDITIONAL INFORMATION
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <div style={{ color: '#94a3b8', fontSize: '12px' }}>Log ID</div>
                            <div style={{ color: 'white', fontSize: '14px' }}>LOG-{log.id.toString().padStart(6, '0')}</div>
                          </div>
                          <div>
                            <div style={{ color: '#94a3b8', fontSize: '12px' }}>Source IP</div>
                            <div style={{ color: 'white', fontSize: '14px' }}>{log.ip}</div>
                          </div>
                          <div>
                            <div style={{ color: '#94a3b8', fontSize: '12px' }}>Category</div>
                            <div style={{ color: 'white', fontSize: '14px' }}>{log.category}</div>
                          </div>
                          <div>
                            <div style={{ color: '#94a3b8', fontSize: '12px' }}>Status</div>
                            <div style={{ 
                              color: getStatusColor(log.status),
                              fontSize: '14px',
                              fontWeight: '500'
                            }}>
                              {log.status.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                      <button style={{
                        padding: '8px 16px',
                        background: 'rgba(30, 41, 59, 0.8)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#94a3b8',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Eye size={14} />
                        View Raw Data
                      </button>
                      <button style={{
                        padding: '8px 16px',
                        background: 'rgba(14, 165, 233, 0.1)',
                        border: '1px solid rgba(14, 165, 233, 0.3)',
                        borderRadius: '8px',
                        color: '#0ea5e9',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <ExternalLink size={14} />
                        Investigate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <FileText size={48} style={{ color: '#6b7280', marginBottom: '1rem' }} />
              <div style={{ color: '#94a3b8', fontSize: '16px' }}>
                No logs found matching your criteria
              </div>
              <div style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
                Try adjusting your search or filters
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <div style={{ color: '#94a3b8', fontSize: '14px' }}>
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
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
            Previous
          </button>
          <button style={{
            padding: '8px 16px',
            background: 'rgba(14, 165, 233, 0.2)',
            border: '1px solid rgba(14, 165, 233, 0.5)',
            borderRadius: '8px',
            color: '#0ea5e9',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            1
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
            2
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
            3
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
            Next
          </button>
        </div>
      </div>
    </div>
  );
}