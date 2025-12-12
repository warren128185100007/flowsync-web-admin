// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Cpu, 
  AlertTriangle, 
  Zap, 
  BarChart3, 
  Users, 
  Settings,
  Shield,
  Clock,
  Battery,
  Wifi,
  // New icons for user data
  Search,
  Download,
  Mail,
  Phone,
  Calendar,
  User,
  CheckCircle,
  Bell,
  ChevronRight,
  Activity,
  Droplets,
  DollarSign,
  CalendarDays,
  History,
  Waves,
  Gauge,
  RefreshCw,
  Smartphone,
  Key,
  CreditCard,
  Database,
  AlertCircle,
  BatteryCharging,
  Signal,
  Home,
  Filter,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Thermometer,
  X,
  ArrowUpRight
} from 'lucide-react';

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({
    devices: 24,
    activeAlerts: 3,
    systemHealth: 98,
    users: 156,
    uptime: '99.8%',
    responseTime: '42ms'
  });

  // User management states from users page
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [mobileUsers, setMobileUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'alerts' | 'devices' | 'security'>('overview');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('admin_user');
    if (data) {
      setUserData(JSON.parse(data));
    }

    // Load mobile users data
    loadMobileUsers();
  }, []);

  // Helper functions
  const getColorFromEmail = (email: string) => {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    const index = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDateTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDateTime(dateString);
  };

  const formatLiters = (liters: number) => {
    if (liters >= 1000) {
      return `${(liters / 1000).toFixed(1)}k L`;
    }
    return `${liters.toFixed(1)} L`;
  };

  const getFlowColor = (flowRate: number) => {
    if (flowRate > 60) return '#ef4444';
    if (flowRate > 40) return '#f59e0b';
    if (flowRate > 20) return '#0ea5e9';
    return '#10b981';
  };

  // Alert severity helpers
  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      case 'info': return '#0ea5e9';
      default: return '#6b7280';
    }
  };

  const getAlertSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'rgba(239, 68, 68, 0.1)';
      case 'high': return 'rgba(249, 115, 22, 0.1)';
      case 'medium': return 'rgba(245, 158, 11, 0.1)';
      case 'low': return 'rgba(59, 130, 246, 0.1)';
      case 'info': return 'rgba(14, 165, 233, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'high_usage': return <TrendingUp size={16} />;
      case 'leak_detected': return <AlertTriangle size={16} />;
      case 'pressure_drop': return <Gauge size={16} />;
      case 'device_offline': return <Smartphone size={16} />;
      case 'unusual_pattern': return <AlertCircle size={16} />;
      case 'bill_estimate': return <DollarSign size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  // Load mobile users function
  const loadMobileUsers = async () => {
    try {
      const mockUsers = [
        {
          id: "user1",
          address: "123 Main St, City, Country",
          createdAt: "2025-12-05T15:38:11Z",
          email: "ariaswarren01@gmail.com",
          fullName: "Warren Arias",
          hasLinkedDevices: true,
          isEmailVerified: true,
          isGmailAccount: true,
          lastLogin: "2025-12-06T04:31:54Z",
          otpVerified: true,
          phoneNumber: "+639741235689",
          photoURL: "",
          profileImageUrl: "",
          uid: "O79ST8nbOyQOBVl6CFPTkLPk50Z2",
          updatedAt: "2025-12-07T10:15:22Z",
          username: "ward123",
          
          waterFlowData: {
            currentFlowRate: 45.2,
            todayUsage: 1256.8,
            todayBill: 18.45,
            pressure: 3.2,
            temperature: 28.5,
            peakFlow: 78.3
          },
          
          waterUsage: {
            today: {
              liters: 1256.8,
              bill: 18.45,
              flowRate: 45.2,
              peakFlow: 78.3,
              duration: 8.5
            },
            monthly: {
              liters: 32560.5,
              bill: 489.75,
              avgDaily: 1085.35,
              trend: 12.5
            }
          },
          
          alerts: [
            {
              id: "alert1",
              type: "high_usage",
              severity: "high",
              title: "High Water Usage Alert",
              message: "Water consumption exceeded 1000L in 6 hours. Current usage: 1256L",
              timestamp: "2025-12-06T14:30:45Z",
              status: "active",
              source: "Main Flow Meter",
              threshold: 1000,
              currentValue: 1256.8,
              unit: "liters",
              actions: ["Acknowledge", "Adjust Threshold", "View Details"],
              read: false
            },
            {
              id: "alert2",
              type: "leak_detected",
              severity: "critical",
              title: "Possible Leak Detected",
              message: "Continuous water flow detected for 2 hours with no usage activity",
              timestamp: "2025-12-05T22:15:30Z",
              status: "resolved",
              source: "Kitchen Sensor",
              duration: "2 hours",
              flowRate: "8.5 L/min",
              actions: ["Mark as Resolved", "Schedule Inspection", "Contact Support"],
              read: true
            }
          ],
          
          activityLog: [
            {
              id: "activity1",
              action: "Received High Water Usage Alert",
              timestamp: "2025-12-07T14:30:45Z",
              details: "Water consumption exceeded 1000L in 6 hours",
              type: "alert_triggered",
              alertId: "alert1"
            }
          ],
          
          connectedDevices: [
            {
              id: "device1",
              name: "Smart Flow Meter 01",
              type: "flow_meter",
              model: "FlowSync Pro",
              location: "Main Inlet",
              status: "online",
              currentFlow: "45.2 L/min",
              totalToday: "856.4 L",
              pressure: "3.2 Bar",
              temperature: "28.5°C",
              battery: 85,
              signal: "excellent",
              connectedSince: "2025-11-20T09:15:00Z",
              firmware: "v2.1.5"
            }
          ]
        },
        {
          id: "user2",
          email: "john.doe@example.com",
          fullName: "John Doe",
          phoneNumber: "+639123456789",
          createdAt: "2025-11-15T10:30:00Z",
          lastLogin: "2025-12-06T08:45:22Z",
          isEmailVerified: true,
          status: "active",
          hasLinkedDevices: true,
          waterFlowData: {
            currentFlowRate: 32.7,
            todayUsage: 890.3,
            todayBill: 13.25,
            pressure: 2.8,
            temperature: 26.5,
            peakFlow: 56.8
          },
          waterUsage: {
            today: {
              liters: 890.3,
              bill: 13.25,
              flowRate: 32.7,
              peakFlow: 56.8,
              duration: 6.2
            },
            monthly: {
              liters: 24580.2,
              bill: 368.75,
              avgDaily: 819.34,
              trend: 5.3
            }
          }
        }
      ];

      setMobileUsers(mockUsers);
      
      // Update stats based on loaded users
      const activeAlerts = mockUsers.reduce((sum, user) => sum + (user.alerts?.filter((a: any) => a.status === 'active').length || 0), 0);
      const onlineDevices = mockUsers.reduce((sum, user) => sum + (user.connectedDevices?.filter((d: any) => d.status === 'online').length || 0), 0);
      const activeUsers = mockUsers.filter(u => u.status === 'active' || !u.status).length;
      const verifiedUsers = mockUsers.filter(u => u.isEmailVerified).length;

      setStats(prev => ({
        ...prev,
        activeAlerts,
        devices: onlineDevices,
        users: activeUsers
      }));

    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user click
  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    setActiveTab('overview');
  };

  // Close user details
  const closeUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };

  const handleAlertClick = (alert: any) => {
    setSelectedAlert(alert);
    setShowAlertModal(true);
  };

  const closeAlertModal = () => {
    setShowAlertModal(false);
    setSelectedAlert(null);
  };

  // Real-time water flow updates
  useEffect(() => {
    if (!selectedUser || !showUserDetails) return;

    const interval = setInterval(() => {
      if (selectedUser && selectedUser.waterFlowData) {
        const updatedUser = {
          ...selectedUser,
          waterFlowData: {
            ...selectedUser.waterFlowData,
            currentFlowRate: Math.max(5, selectedUser.waterFlowData.currentFlowRate + (Math.random() - 0.5) * 10),
            pressure: 2.5 + Math.random() * 1.5,
            temperature: 25 + Math.random() * 5,
            todayUsage: selectedUser.waterFlowData.todayUsage + (Math.random() * 3)
          }
        };
        setSelectedUser(updatedUser);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedUser, showUserDetails]);

  // UPDATED: Removed System Health and System Uptime cards
  const statCards = [
    {
      title: 'Active Devices',
      value: stats.devices,
      icon: <Cpu size={24} />,
      color: '#0ea5e9',
      change: `${mobileUsers.reduce((sum, user) => sum + (user.connectedDevices?.length || 0), 0)} total`
    },
    {
      title: 'System Alerts',
      value: stats.activeAlerts,
      icon: <AlertTriangle size={24} />,
      color: '#f59e0b',
      change: `${mobileUsers.reduce((sum, user) => sum + (user.alerts?.length || 0), 0)} total`
    },
    {
      title: 'Active Users',
      value: stats.users,
      icon: <Users size={24} />,
      color: '#8b5cf6',
      change: `${mobileUsers.length} registered`
    },

  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white'
      }}>
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div style={{ padding: '0 1rem 2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '2.5rem', 
          fontWeight: '800',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
        }}>
          Dashboard Overview
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Monitor and manage your FlowSync system in real-time
        </p>
      </div>

      {/* Search and Controls */}
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
            <Search size={20} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#94a3b8' 
            }} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <option value="all">All Users</option>
            <option value="verified">Verified</option>
            <option value="withDevices">With Devices</option>
            <option value="highUsage">High Water Usage</option>
            <option value="withAlerts">With Active Alerts</option>
          </select>
        </div>
        
        
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {statCards.map((stat, index) => (
          <div 
            key={index}
            style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: `1px solid ${stat.color}20`,
              borderRadius: '16px',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = `0 20px 40px ${stat.color}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: stat.color }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', color: stat.color, marginTop: '8px' }}>
                  {stat.change}
                </div>
              </div>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px',
                background: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column */}
        <div>
          {/* Users List */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '20px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>
                System Users
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={14} style={{ color: '#10b981' }} />
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                    {mobileUsers.filter(u => u.isEmailVerified).length} verified
                  </span>
                </div>
                <div style={{ color: '#64748b' }}>•</div>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                  {mobileUsers.length} total
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mobileUsers.map((user) => (
                <div 
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {/* Alert Indicator Badge */}
                  {user.alerts?.filter((a: any) => !a.read).length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '20px',
                      height: '20px',
                      background: '#ef4444',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: '600',
                      border: '2px solid rgba(15, 23, 42, 0.95)'
                    }}>
                      {user.alerts.filter((a: any) => !a.read).length}
                    </div>
                  )}
                  
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: getColorFromEmail(user.email),
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '14px',
                    position: 'relative'
                  }}>
                    {getInitials(user.fullName)}
                    {user.isEmailVerified && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '12px',
                        height: '12px',
                        background: '#10b981',
                        borderRadius: '50%',
                        border: '2px solid rgba(30, 41, 59, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckCircle size={8} style={{ color: 'white' }} />
                      </div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
                          {user.fullName}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                          {user.email}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '500' }}>
                            Last Login
                          </div>
                          <div style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: '600' }}>
                            {getTimeAgo(user.lastLogin)}
                          </div>
                        </div>
                        <ArrowUpRight size={16} style={{ color: '#94a3b8' }} />
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} style={{ color: '#94a3b8' }} />
                        <span style={{ color: '#cbd5e1', fontSize: '12px' }}>{user.phoneNumber}</span>
                      </div>
                      {user.waterFlowData && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Droplets size={12} style={{ color: '#94a3b8' }} />
                          <span style={{ color: '#cbd5e1', fontSize: '12px' }}>
                            {user.waterFlowData.currentFlowRate.toFixed(1)} L/min
                          </span>
                        </div>
                      )}
                      {user.alerts && user.alerts.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Bell size={12} style={{ color: '#ef4444' }} />
                          <span style={{ color: '#cbd5e1', fontSize: '12px' }}>
                            {user.alerts.filter((a: any) => !a.read).length} active
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '20px',
            padding: '1.5rem',
            backdropFilter: 'blur(12px)'
          }}>
            <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              Quick Actions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <button style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                borderRadius: '12px',
                color: '#0ea5e9',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}>
                <Zap size={18} />
                System Scan
              </button>
              <button style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                color: '#10b981',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}>
                <BarChart3 size={18} />
                Generate Report
              </button>
              <button style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                color: '#8b5cf6',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}>
                <Settings size={18} />
                Settings
              </button>
              <button style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}>
                <Shield size={18} />
                Security Audit
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Account Info & System Status */}
        <div>
          {/* Account Information */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '20px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(12px)'
          }}>
            <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              Account Information
            </h2>
            
            {userData ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '20px',
                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    {userData.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <div style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
                      {userData.name || 'Super Administrator'}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                      {userData.email}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>Role</span>
                    <span style={{ 
                      color: '#8b5cf6', 
                      fontSize: '14px',
                      fontWeight: '600',
                      background: 'rgba(139, 92, 246, 0.1)',
                      padding: '4px 12px',
                      borderRadius: '20px'
                    }}>
                      {userData.role?.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>Last Login</span>
                    <span style={{ color: 'white', fontSize: '14px' }}>
                      {new Date(userData.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>Session Duration</span>
                    <span style={{ color: 'white', fontSize: '14px' }}>Active</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>
                No user data found
              </div>
            )}
          </div>

          {/* System Status */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '20px',
            padding: '1.5rem',
            backdropFilter: 'blur(12px)'
          }}>
            <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              System Status
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wifi size={14} />
                  Network
                </span>
                <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>Stable</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Database</span>
                <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>Healthy</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>API Services</span>
                <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>Operational</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Water Flow API</span>
                <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>Active</span>
              </div>
            </div>

            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>
                ✓ All Systems Operational
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={closeUserDetails}
        >
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '20px',
              width: '90%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              animation: 'scaleIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: getColorFromEmail(selectedUser.email),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '20px'
                }}>
                  {getInitials(selectedUser.fullName)}
                </div>
                <div>
                  <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                    {selectedUser.fullName}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
                    {selectedUser.email}
                  </p>
                </div>
              </div>
              
              {/* Alert Badge in Header */}
              {selectedUser.alerts && selectedUser.alerts.filter((a: any) => !a.read).length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '5rem',
                  padding: '4px 12px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Bell size={12} />
                  {selectedUser.alerts.filter((a: any) => !a.read).length} Unread
                </div>
              )}
              
              <button
                onClick={closeUserDetails}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
              padding: '0 1.5rem'
            }}>
              {['overview', 'activity', 'alerts', 'devices', 'security'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  style={{
                    padding: '1rem 1.5rem',
                    background: activeTab === tab ? 'rgba(30, 41, 59, 0.5)' : 'transparent',
                    border: 'none',
                    color: activeTab === tab ? 'white' : '#94a3b8',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    borderBottom: activeTab === tab ? '2px solid #0ea5e9' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textTransform: 'capitalize',
                    position: 'relative'
                  }}
                >
                  {tab === 'overview' && <User size={16} />}
                  {tab === 'activity' && <History size={16} />}
                  {tab === 'alerts' && <Bell size={16} />}
                  {tab === 'devices' && <Smartphone size={16} />}
                  {tab === 'security' && <Shield size={16} />}
                  {tab.replace('-', ' ')}
                  
                  {/* Alert Count Badge on Alerts Tab */}
                  {tab === 'alerts' && selectedUser.alerts && selectedUser.alerts.filter((a: any) => !a.read).length > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '18px',
                      height: '18px',
                      background: '#ef4444',
                      borderRadius: '50%',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {selectedUser.alerts.filter((a: any) => !a.read).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem' }}>
              {activeTab === 'overview' && selectedUser.waterFlowData && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {/* Real-time Water Flow Monitoring Tiles */}
                  <div>
                    <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '1rem' }}>
                      Real-time Water Flow Monitoring
                    </h4>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                      gap: '1.5rem',
                      marginBottom: '1.5rem'
                    }}>
                      {/* Current Water Flow */}
                      <div style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: `1px solid ${getFlowColor(selectedUser.waterFlowData.currentFlowRate)}40`,
                        borderRadius: '16px',
                        padding: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '80px',
                          height: '80px',
                          background: 'rgba(14, 165, 233, 0.1)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.3
                        }}>
                          <Waves size={40} style={{ color: '#0ea5e9' }} />
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(14, 165, 233, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0ea5e9'
                          }}>
                            <Waves size={20} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Current Flow Rate</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: getFlowColor(selectedUser.waterFlowData.currentFlowRate) }}>
                              {selectedUser.waterFlowData.currentFlowRate.toFixed(1)} <span style={{ fontSize: '1rem' }}>L/min</span>
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ 
                          height: '4px', 
                          background: 'rgba(148, 163, 184, 0.2)', 
                          borderRadius: '2px',
                          margin: '0.5rem 0'
                        }}>
                          <div style={{
                            width: `${Math.min(100, (selectedUser.waterFlowData.currentFlowRate / 100) * 100)}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${getFlowColor(selectedUser.waterFlowData.currentFlowRate)} 0%, #0ea5e9 100%)`,
                            borderRadius: '2px'
                          }} />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                          <span>Peak: {selectedUser.waterFlowData.peakFlow.toFixed(1)} L/min</span>
                          <span style={{ color: '#0ea5e9' }}>Live</span>
                        </div>
                      </div>

                      {/* Today's Water Usage */}
                      <div style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '80px',
                          height: '80px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.3
                        }}>
                          <BarChart3 size={40} style={{ color: '#10b981' }} />
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#10b981'
                          }}>
                            <BarChart3 size={20} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Today's Water Usage</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
                              {formatLiters(selectedUser.waterFlowData.todayUsage)}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            <span style={{ color: '#10b981', fontWeight: '500' }}>+12.5%</span> from yesterday
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Avg: {formatLiters(selectedUser.waterFlowData.todayUsage / 24)}
                          </div>
                        </div>
                      </div>

                      {/* Today's Water Bill */}
                      <div style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '80px',
                          height: '80px',
                          background: 'rgba(245, 158, 11, 0.1)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.3
                        }}>
                          <DollarSign size={40} style={{ color: '#f59e0b' }} />
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(245, 158, 11, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#f59e0b'
                          }}>
                            <DollarSign size={20} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Today's Water Bill</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
                              ₱{selectedUser.waterFlowData.todayBill.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            <span style={{ color: '#10b981', fontWeight: '500' }}>Projected:</span> ₱{(selectedUser.waterFlowData.todayBill * 30).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Rate: ₱0.015/L
                          </div>
                        </div>
                      </div>

                      {/* System Pressure & Temperature */}
                      <div style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '80px',
                          height: '80px',
                          background: 'rgba(139, 92, 246, 0.1)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.3
                        }}>
                          <Gauge size={40} style={{ color: '#8b5cf6' }} />
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(139, 92, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#8b5cf6'
                          }}>
                            <Gauge size={20} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>System Pressure</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
                              {selectedUser.waterFlowData.pressure.toFixed(1)} <span style={{ fontSize: '1rem' }}>Bar</span>
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#3b82f6'
                          }}>
                            <Thermometer size={20} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Water Temperature</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>
                              {selectedUser.waterFlowData.temperature.toFixed(1)}°C
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid rgba(148, 163, 184, 0.2)'
                  }}>
                    <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '1rem' }}>
                      Account Information
                    </h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Email</label>
                        <div style={{ color: 'white', fontSize: '14px' }}>{selectedUser.email}</div>
                      </div>
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Phone</label>
                        <div style={{ color: 'white', fontSize: '14px' }}>{selectedUser.phoneNumber}</div>
                      </div>
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Account Created</label>
                        <div style={{ color: 'white', fontSize: '14px' }}>{formatDateTime(selectedUser.createdAt)}</div>
                      </div>
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Last Updated</label>
                        <div style={{ color: 'white', fontSize: '14px' }}>{formatDateTime(selectedUser.updatedAt)}</div>
                      </div>
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Email Verified</label>
                        <div style={{ 
                          color: selectedUser.isEmailVerified ? '#10b981' : '#ef4444',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          {selectedUser.isEmailVerified ? 'Yes ✓' : 'No ✗'}
                        </div>
                      </div>
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Account Type</label>
                        <div style={{ color: 'white', fontSize: '14px' }}>
                          {selectedUser.isGmailAccount ? 'Gmail Account' : 'Email Account'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(148, 163, 184, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
                      Activity Log
                    </h4>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                      Showing {selectedUser.activityLog?.length || 0} activities
                    </div>
                  </div>
                  
                  {selectedUser.activityLog && selectedUser.activityLog.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {selectedUser.activityLog.map((activity: any) => (
                        <div 
                          key={activity.id}
                          onClick={() => activity.alertId && handleAlertClick(
                            selectedUser.alerts?.find((a: any) => a.id === activity.alertId)
                          )}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '8px',
                            borderLeft: `3px solid ${activity.color || '#0ea5e9'}`,
                            cursor: activity.alertId ? 'pointer' : 'default',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (activity.alertId) {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                              e.currentTarget.style.transform = 'translateX(4px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (activity.alertId) {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                              e.currentTarget.style.transform = 'translateX(0)';
                            }
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: activity.type?.includes('alert') ? 
                                       activity.type === 'alert_triggered' ? 'rgba(239, 68, 68, 0.1)' :
                                       activity.type === 'alert_acknowledged' ? 'rgba(245, 158, 11, 0.1)' :
                                       activity.type === 'alert_resolved' ? 'rgba(16, 185, 129, 0.1)' :
                                       'rgba(14, 165, 233, 0.1)' :
                                       activity.type === 'water_settings' ? 'rgba(14, 165, 233, 0.1)' : 
                                       activity.type === 'device_link' ? 'rgba(16, 185, 129, 0.1)' : 
                                       activity.type === 'billing' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: activity.color || '#0ea5e9'
                          }}>
                            {activity.type?.includes('alert_triggered') && <AlertTriangle size={16} />}
                            {activity.type?.includes('alert_acknowledged') && <AlertCircle size={16} />}
                            {activity.type?.includes('alert_resolved') && <CheckCircle size={16} />}
                            {activity.type === 'water_settings' && <Settings size={16} />}
                            {activity.type === 'device_link' && <Smartphone size={16} />}
                            {activity.type === 'billing' && <DollarSign size={16} />}
                            {activity.type === 'report_view' && <BarChart3 size={16} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'flex-start',
                              marginBottom: '4px'
                            }}>
                              <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
                                {activity.action}
                                {activity.alertId && (
                                  <span style={{ 
                                    color: '#0ea5e9', 
                                    fontSize: '11px', 
                                    marginLeft: '8px',
                                    fontWeight: '400'
                                  }}>
                                    (Click to view alert)
                                  </span>
                                )}
                              </div>
                              <div style={{ color: '#64748b', fontSize: '11px' }}>
                                {getTimeAgo(activity.timestamp)}
                              </div>
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                              {activity.details}
                            </div>
                            <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>
                              {formatDateTime(activity.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
                      No activity recorded yet
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'alerts' && (
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(148, 163, 184, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
                      Alert Notifications
                    </h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ 
                        padding: '4px 12px', 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        color: '#ef4444',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {selectedUser.alerts?.filter((a: any) => a.status === 'active').length || 0} Active
                      </div>
                      <div style={{ 
                        padding: '4px 12px', 
                        background: 'rgba(107, 114, 128, 0.1)', 
                        color: '#94a3b8',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {selectedUser.alerts?.length || 0} Total
                      </div>
                    </div>
                  </div>
                  
                  {selectedUser.alerts && selectedUser.alerts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {selectedUser.alerts.map((alert: any) => (
                        <div 
                          key={alert.id}
                          onClick={() => handleAlertClick(alert)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '16px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '12px',
                            border: `1px solid ${getAlertSeverityColor(alert.severity)}40`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            position: 'relative',
                            opacity: alert.read ? 0.8 : 1
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                            e.currentTarget.style.border = `1px solid ${getAlertSeverityColor(alert.severity)}80`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.border = `1px solid ${getAlertSeverityColor(alert.severity)}40`;
                          }}
                        >
                          {/* Unread Indicator */}
                          {!alert.read && (
                            <div style={{
                              position: 'absolute',
                              top: '16px',
                              left: '-8px',
                              width: '16px',
                              height: '16px',
                              background: '#ef4444',
                              borderRadius: '50%',
                              border: '2px solid rgba(15, 23, 42, 0.95)'
                            }} />
                          )}
                          
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: getAlertSeverityBg(alert.severity),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: getAlertSeverityColor(alert.severity)
                          }}>
                            {getAlertIcon(alert.type)}
                          </div>
                          
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <div>
                                <div style={{ color: 'white', fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                                  {alert.title}
                                </div>
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '8px',
                                  fontSize: '12px'
                                }}>
                                  <span style={{ 
                                    padding: '2px 8px', 
                                    background: getAlertSeverityBg(alert.severity),
                                    color: getAlertSeverityColor(alert.severity),
                                    borderRadius: '20px',
                                    fontWeight: '500'
                                  }}>
                                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                                  </span>
                                  <span style={{ color: '#94a3b8' }}>
                                    {alert.source}
                                  </span>
                                </div>
                              </div>
                              <div style={{ color: '#64748b', fontSize: '11px' }}>
                                {getTimeAgo(alert.timestamp)}
                              </div>
                            </div>
                            
                            <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px' }}>
                              {alert.message}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ 
                      color: '#94a3b8', 
                      textAlign: 'center', 
                      padding: '3rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <Bell size={48} style={{ color: '#4b5563', opacity: 0.5 }} />
                      <div>No alerts for this user</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Alerts will appear here when triggered by water usage patterns
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'devices' && (
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(148, 163, 184, 0.2)'
                }}>
                  <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '1rem' }}>
                    Connected Devices ({selectedUser.connectedDevices?.length || 0})
                  </h4>
                  
                  {selectedUser.connectedDevices && selectedUser.connectedDevices.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                      {selectedUser.connectedDevices.map((device: any) => (
                        <div key={device.id} style={{
                          padding: '1rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '10px',
                          border: `1px solid ${device.status === 'online' ? '#10b98140' : '#6b728040'}`
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              background: device.status === 'online' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: device.status === 'online' ? '#10b981' : '#6b7280'
                            }}>
                              <Smartphone size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{device.name}</div>
                              <div style={{ color: '#94a3b8', fontSize: '12px' }}>{device.model}</div>
                            </div>
                            <div style={{
                              padding: '4px 8px',
                              background: device.status === 'online' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                              color: device.status === 'online' ? '#10b981' : '#6b7280',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: '500'
                            }}>
                              {device.status}
                            </div>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                            <div>
                              <label style={{ color: '#94a3b8', fontSize: '11px' }}>Current Flow</label>
                              <div style={{ color: 'white', fontSize: '13px' }}>{device.currentFlow}</div>
                            </div>
                            <div>
                              <label style={{ color: '#94a3b8', fontSize: '11px' }}>Today's Total</label>
                              <div style={{ color: '#0ea5e9', fontSize: '13px' }}>{device.totalToday}</div>
                            </div>
                            <div>
                              <label style={{ color: '#94a3b8', fontSize: '11px' }}>Battery</label>
                              <div style={{ color: device.battery > 20 ? '#10b981' : '#ef4444', fontSize: '13px' }}>
                                {device.battery}%
                              </div>
                            </div>
                            <div>
                              <label style={{ color: '#94a3b8', fontSize: '11px' }}>Connected Since</label>
                              <div style={{ color: 'white', fontSize: '13px' }}>
                                {new Date(device.connectedSince).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
                      No devices connected
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'security' && (
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(148, 163, 184, 0.2)'
                }}>
                  <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '1rem' }}>
                    Security & Verification
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '10px',
                      border: `1px solid ${selectedUser.isEmailVerified ? '#10b98140' : '#ef444440'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Mail size={16} style={{ color: selectedUser.isEmailVerified ? '#10b981' : '#ef4444' }} />
                        <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>Email Verification</span>
                      </div>
                      <div style={{ color: selectedUser.isEmailVerified ? '#10b981' : '#ef4444', fontSize: '13px' }}>
                        {selectedUser.isEmailVerified ? 'Verified' : 'Not Verified'}
                      </div>
                    </div>
                    
                    <div style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '10px',
                      border: `1px solid ${selectedUser.otpVerified ? '#10b98140' : '#f59e0b40'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Key size={16} style={{ color: selectedUser.otpVerified ? '#10b981' : '#f59e0b' }} />
                        <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>OTP Verification</span>
                      </div>
                      <div style={{ color: selectedUser.otpVerified ? '#10b981' : '#f59e0b', fontSize: '13px' }}>
                        {selectedUser.otpVerified ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid rgba(148, 163, 184, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                User ID: {selectedUser.uid}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={closeUserDetails}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '10px',
                    color: '#cbd5e1',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Close
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
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Download size={16} />
                  Export User Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Detail Modal */}
      {showAlertModal && selectedAlert && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={closeAlertModal}
        >
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${getAlertSeverityColor(selectedAlert.severity)}40`,
              borderRadius: '20px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
              animation: 'scaleIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Alert Modal Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: getAlertSeverityBg(selectedAlert.severity)
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getAlertSeverityColor(selectedAlert.severity)
                }}>
                  {getAlertIcon(selectedAlert.type)}
                </div>
                <div>
                  <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                    {selectedAlert.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ 
                      padding: '2px 8px', 
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: getAlertSeverityColor(selectedAlert.severity),
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {selectedAlert.severity.charAt(0).toUpperCase() + selectedAlert.severity.slice(1)}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                      {selectedAlert.source}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={closeAlertModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Alert Modal Content */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                  Alert Details
                </div>
                <div style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
                  {selectedAlert.message}
                </div>
              </div>

              {/* Alert Metadata */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Status</div>
                    <div style={{ 
                      color: getAlertSeverityColor(selectedAlert.severity),
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {selectedAlert.status}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Triggered</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>
                      {formatDateTime(selectedAlert.timestamp)}
                    </div>
                  </div>
                  {selectedAlert.threshold && (
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Threshold</div>
                      <div style={{ color: 'white', fontSize: '14px' }}>
                        {selectedAlert.threshold} {selectedAlert.unit}
                      </div>
                    </div>
                  )}
                  {selectedAlert.currentValue && (
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Current Value</div>
                      <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '500' }}>
                        {selectedAlert.currentValue} {selectedAlert.unit}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}