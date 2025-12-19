// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
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
  ArrowUpRight,
  Globe,
  MapPin,
  UserCheck,
  Smartphone as SmartphoneIcon,
  ShieldCheck,
  FileText,
  Loader2,
  WifiOff,
  CheckSquare,
  Square,
  Crown
} from 'lucide-react';
import RealtimeUserService, { ProcessedUser, UserStats } from '@/lib/realtime-users-service';

// Extend the ProcessedUser type to include connectedDevices
interface ExtendedUser extends ProcessedUser {
  connectedDevices?: Array<{
    id: string;
    name: string;
    model: string;
    status: 'online' | 'offline' | 'unknown';
    currentFlow?: string;
    totalToday?: string;
    battery?: number;
    connectedSince?: string | Date;
  }>;
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({
    devices: 0,
    activeAlerts: 0,
    systemHealth: 98,
    users: 0,
    uptime: '99.8%',
    responseTime: '42ms'
  });

  // User management states
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [mobileUsers, setMobileUsers] = useState<ExtendedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'alerts' | 'devices' | 'profile'>('overview');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Helper functions
  const getColorFromEmail = (email: string) => {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    const index = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const getInitials = (name?: string) => {
    if (!name || name.trim() === '') return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDateTime = (dateString: any) => {
    if (!dateString) return 'N/A';
    let date: Date;
    
    if (dateString && typeof dateString.toDate === 'function') {
      date = dateString.toDate();
    } else if (dateString instanceof Date) {
      date = dateString;
    } else if (typeof dateString === 'string') {
      date = new Date(dateString);
    } else {
      return 'Invalid Date';
    }
    
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Never';
    
    let date: Date;
    if (timestamp && typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      return 'Never';
    }
    
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDateTime(date);
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

  // Format phone number
  const formatPhoneNumber = (phoneNumber: string = '') => {
    if (!phoneNumber || phoneNumber.trim() === '') return 'Not set';
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.startsWith('63') && cleaned.length === 11) {
      return `+63 ${cleaned.substring(2, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
    }
    return phoneNumber;
  };

  // Philippine Water Pressure Standards helpers
  const getPressureAssessment = (pressureInBar: number) => {
    const pressureInPsi = pressureInBar * 14.5038;
    
    if (pressureInPsi < 10) return { level: 'Very Low', color: '#ef4444' };
    if (pressureInPsi >= 10 && pressureInPsi <= 20) return { level: 'Low', color: '#f59e0b' };
    if (pressureInPsi > 20 && pressureInPsi <= 30) return { level: 'Normal', color: '#10b981' };
    if (pressureInPsi > 30 && pressureInPsi <= 50) return { level: 'Good', color: '#0ea5e9' };
    if (pressureInPsi > 50 && pressureInPsi <= 60) return { level: 'High', color: '#8b5cf6' };
    return { level: 'Very High', color: '#ec4899' };
  };

  const getPressureColor = (pressureInBar: number) => {
    if (pressureInBar === 0) return '#64748b';
    const pressureInPsi = pressureInBar * 14.5038;
    
    if (pressureInPsi < 10) return '#ef4444';
    if (pressureInPsi >= 10 && pressureInPsi <= 20) return '#f59e0b';
    if (pressureInPsi > 20 && pressureInPsi <= 30) return '#10b981';
    if (pressureInPsi > 30 && pressureInPsi <= 50) return '#0ea5e9';
    if (pressureInPsi > 50 && pressureInPsi <= 60) return '#8b5cf6';
    return '#ec4899';
  };

  // Load user stats
  const loadUserStats = async () => {
    try {
      const stats = await RealtimeUserService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  // Load admin data
  useEffect(() => {
    const data = localStorage.getItem('admin_user');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  // Initialize real-time subscription
  useEffect(() => {
    setLoading(true);
    
    // Load user stats
    loadUserStats();
    
    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Subscribe to real-time user data
    unsubscribeRef.current = RealtimeUserService.subscribeToAllUsers((users: ProcessedUser[]) => {
      // Cast users to ExtendedUser type
      const extendedUsers = users as ExtendedUser[];
      setMobileUsers(extendedUsers);
      setRealtimeConnected(true);
      setLoading(false);
      
      // Update selected user if it's in the list
      if (selectedUser) {
        const updatedSelectedUser = extendedUsers.find(u => u.id === selectedUser.id);
        if (updatedSelectedUser) {
          setSelectedUser(updatedSelectedUser);
        }
      }

      // Update stats - safely access connectedDevices
      const activeAlerts = extendedUsers.reduce((sum, user) => sum + (user.alerts?.filter((a: any) => !a.read).length || 0), 0);
      const onlineDevices = extendedUsers.reduce((sum, user) => {
        const devices = user.connectedDevices || [];
        return sum + devices.filter((d: any) => d.status === 'online').length;
      }, 0);
      const activeUsers = extendedUsers.filter(u => u.status === 'active' || !u.status).length;
      
      setStats(prev => ({
        ...prev,
        activeAlerts,
        devices: onlineDevices,
        users: activeUsers
      }));
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Filter users whenever search or filter changes
  useEffect(() => {
    let filtered = mobileUsers;
    
    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(user => {
        return (
          (user.fullName?.toLowerCase().includes(searchLower) || false) ||
          user.email.toLowerCase().includes(searchLower) ||
          (user.username?.toLowerCase().includes(searchLower) || false) ||
          (user.phoneNumber?.toLowerCase().includes(searchLower) || false)
        );
      });
    }
    
    // Apply status filter
    if (filter !== 'all') {
      switch (filter) {
        case 'verified':
          filtered = filtered.filter(user => user.isEmailVerified);
          break;
        case 'withDevices':
          filtered = filtered.filter(user => user.hasLinkedDevices);
          break;
        case 'active':
          filtered = filtered.filter(user => user.status === 'active');
          break;
        case 'inactive':
          filtered = filtered.filter(user => user.status === 'inactive');
          break;
        case 'withAlerts':
          filtered = filtered.filter(user => (user.alerts?.filter((a: any) => !a.read).length || 0) > 0);
          break;
        case 'highPressure':
          filtered = filtered.filter(user => {
            if (!user.waterFlowData?.pressure) return false;
            const assessment = getPressureAssessment(user.waterFlowData.pressure);
            return assessment?.level === 'High' || assessment?.level === 'Very High';
          });
          break;
      }
    }
    
    setFilteredUsers(filtered);
  }, [searchQuery, filter, mobileUsers]);

  // Handle user click
  const handleUserClick = (user: ExtendedUser) => {
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

  const statCards = [
    {
      title: 'Active Devices',
      value: stats.devices,
      icon: <Cpu size={24} />,
      color: '#0ea5e9',
      change: `${mobileUsers.reduce((sum, user) => sum + ((user.connectedDevices || []).length || 0), 0)} total`
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
        <Loader2 size={24} className="animate-spin mr-2" />
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div style={{ padding: '0 1rem 2rem 1rem' }}>
      {/* Real-time connection indicator */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: realtimeConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
        border: `1px solid ${realtimeConnected ? '#10b981' : '#f59e0b'}`,
        borderRadius: '20px',
        padding: '6px 12px',
        backdropFilter: 'blur(10px)'
      }}>
        {realtimeConnected ? (
          <>
            <Wifi size={14} color="#10b981" />
            <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '500' }}>
              Live from Mobile App
            </span>
          </>
        ) : (
          <>
            <WifiOff size={14} color="#f59e0b" />
            <span style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '500' }}>
              Connecting...
            </span>
          </>
        )}
      </div>

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
              placeholder="Search users by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
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
              minWidth: '150px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="withDevices">With Devices</option>
            <option value="withAlerts">With Active Alerts</option>
            <option value="highPressure">High Pressure</option>
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
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
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
            Mobile App Users ({filteredUsers.length})
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
        
        {filteredUsers.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            <Users size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              No users found
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              {searchQuery ? 'Try a different search term' : 'No users match the selected filter'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredUsers.map((user) => {
              const pressureColor = getPressureColor(user.waterFlowData?.pressure || 0);
              const profileImage = user.displayPhotoUrl || user.photoURL || user.profileImageUrl;
              const hasProfileImage = profileImage && profileImage.startsWith('http');
              
              return (
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
                  {user.alerts && user.alerts.filter((a: any) => !a.read).length > 0 && (
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
                      {user.alerts?.filter((a: any) => !a.read).length || 0}
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
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {hasProfileImage ? (
                      <img 
                        src={profileImage}
                        alt={user.fullName || user.email}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      getInitials(user.fullName)
                    )}
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
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '2px'
                        }}>
                          <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
                            {user.fullName || 'Unknown User'}
                          </div>
                          {user.role === 'admin' && (
                            <span style={{
                              padding: '2px 6px',
                              background: 'rgba(245, 158, 11, 0.15)',
                              color: '#f59e0b',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '600'
                            }}>
                              Admin
                            </span>
                          )}
                          {user.role === 'super_admin' && (
                            <span style={{
                              padding: '2px 6px',
                              background: 'rgba(139, 92, 246, 0.15)',
                              color: '#8b5cf6',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '600'
                            }}>
                              Super Admin
                            </span>
                          )}
                          <span style={{
                            padding: '2px 6px',
                            background: user.status === 'active' 
                              ? 'rgba(16, 185, 129, 0.15)' 
                              : user.status === 'inactive'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                            color: user.status === 'active' 
                              ? '#10b981' 
                              : user.status === 'inactive'
                              ? '#f59e0b'
                              : '#ef4444',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600'
                          }}>
                            {user.status}
                          </span>
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                          {user.email}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '500' }}>
                            Last Active
                          </div>
                          <div style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: '600' }}>
                            {getTimeAgo(user.lastActivity || user.lastLogin || user.createdAt)}
                          </div>
                        </div>
                        <ArrowUpRight size={16} style={{ color: '#94a3b8' }} />
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} style={{ color: '#94a3b8' }} />
                        <span style={{ color: '#cbd5e1', fontSize: '12px' }}>
                          {formatPhoneNumber(user.phoneNumber)}
                        </span>
                      </div>
                      {user.waterFlowData && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Droplets size={12} style={{ color: '#94a3b8' }} />
                          <span style={{ color: '#cbd5e1', fontSize: '12px' }}>
                            {user.waterFlowData.currentFlowRate?.toFixed(1) || '0.0'} L/min
                          </span>
                        </div>
                      )}
                      {user.waterFlowData?.pressure && user.waterFlowData.pressure > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Gauge size={12} style={{ color: pressureColor }} />
                          <span style={{ color: pressureColor, fontSize: '12px' }}>
                            {user.waterFlowData.pressure.toFixed(1)} Bar
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
                    {selectedUser.fullName || 'Unknown User'}
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
              {['overview', 'activity', 'alerts', 'devices', 'profile'].map((tab) => (
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
                  {tab === 'profile' && <UserCheck size={16} />}
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
              {activeTab === 'overview' && selectedUser && selectedUser.waterFlowData && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {/* CURRENT FLOW RATE CARD */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#94a3b8',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}>
                        CURRENT FLOW RATE
                      </div>
                      <div style={{
                        padding: '6px 12px',
                        background: selectedUser.waterFlowData?.currentFlowRate > 10 ? 
                                  'rgba(239, 68, 68, 0.2)' : 
                                  selectedUser.waterFlowData?.currentFlowRate > 5 ? 
                                  'rgba(245, 158, 11, 0.2)' : 
                                  'rgba(16, 185, 129, 0.2)',
                        border: `1px solid ${selectedUser.waterFlowData?.currentFlowRate > 10 ? 
                                'rgba(239, 68, 68, 0.5)' : 
                                selectedUser.waterFlowData?.currentFlowRate > 5 ? 
                                'rgba(245, 158, 11, 0.5)' : 
                                'rgba(16, 185, 129, 0.5)'}`,
                        borderRadius: '12px'
                      }}>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: selectedUser.waterFlowData?.currentFlowRate > 10 ? 
                                '#ef4444' : 
                                selectedUser.waterFlowData?.currentFlowRate > 5 ? 
                                '#f59e0b' : 
                                '#10b981'
                        }}>
                          {selectedUser.waterFlowData?.currentFlowRate > 10 ? 
                          'HIGH' : 
                          selectedUser.waterFlowData?.currentFlowRate > 5 ? 
                          'MEDIUM' : 'LOW'}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ 
                          fontSize: '3rem', 
                          fontWeight: 'bold', 
                          color: 'white',
                          lineHeight: '1'
                        }}>
                          {selectedUser.waterFlowData?.currentFlowRate.toFixed(1) || '0.0'}
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#94a3b8',
                          marginTop: '4px'
                        }}>
                          Liters per minute
                        </div>
                      </div>
                      
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: selectedUser.waterFlowData?.currentFlowRate > 10 ? 
                                  'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                                  selectedUser.waterFlowData?.currentFlowRate > 5 ? 
                                  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                                  'linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {selectedUser.waterFlowData?.currentFlowRate > 10 ? (
                          <AlertTriangle size={32} style={{ color: 'white' }} />
                        ) : selectedUser.waterFlowData?.currentFlowRate > 5 ? (
                          <TrendingUp size={32} style={{ color: 'white' }} />
                        ) : (
                          <Waves size={32} style={{ color: 'white' }} />
                        )}
                      </div>
                    </div>
                    
                    <div style={{ 
                      height: '1px', 
                      background: 'rgba(148, 163, 184, 0.1)', 
                      margin: '1rem 0' 
                    }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        Last update
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        color: '#0ea5e9' 
                      }}>
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                      </div>
                    </div>
                  </div>

                  {/* MONTHLY BILLING CARD */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '20px',
                    padding: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                      <div style={{
                        padding: '8px',
                        background: 'rgba(14, 165, 233, 0.2)',
                        borderRadius: '10px'
                      }}>
                        <DollarSign size={20} style={{ color: '#0ea5e9' }} />
                      </div>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: 'white' 
                      }}>
                        Monthly Billing
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#94a3b8',
                          marginBottom: '4px'
                        }}>
                          Current Bill
                        </div>
                        <div style={{ 
                          fontSize: '2rem', 
                          fontWeight: 'bold', 
                          color: 'white',
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '4px'
                        }}>
                          <span style={{ fontSize: '1rem', color: '#94a3b8' }}>₱</span>
                          {selectedUser.waterFlowData?.todayBill ? (selectedUser.waterFlowData.todayBill * 30).toFixed(2) : '0.00'}
                        </div>
                      </div>
                      
                      <button style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}>
                        View Details
                      </button>
                    </div>
                    
                    <div style={{ 
                      height: '1px', 
                      background: 'rgba(148, 163, 184, 0.1)', 
                      margin: '1rem 0' 
                    }}></div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '1rem',
                      textAlign: 'center'
                    }}>
                      <div>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: 'white',
                          marginBottom: '4px'
                        }}>
                          ₱{selectedUser.waterFlowData?.todayBill?.toFixed(2) || '0.00'}
                        </div>
                        <div style={{ 
                          fontSize: '10px', 
                          color: '#94a3b8',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Today's Bill
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: 'white',
                          marginBottom: '4px'
                        }}>
                          {selectedUser.waterFlowData?.todayUsage ? (selectedUser.waterFlowData.todayUsage / 1000).toFixed(1) : '0.0'} m³
                        </div>
                        <div style={{ 
                          fontSize: '10px', 
                          color: '#94a3b8',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Water Used
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: 'white',
                          marginBottom: '4px'
                        }}>
                          ₱{selectedUser.waterFlowData?.todayBill ? (selectedUser.waterFlowData.todayBill * 30).toFixed(2) : '0.00'}
                        </div>
                        <div style={{ 
                          fontSize: '10px', 
                          color: '#94a3b8',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Monthly Total
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACCOUNT INFORMATION SECTION */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '20px',
                    padding: '1.5rem'
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
                        <div style={{ color: 'white', fontSize: '14px' }}>{formatPhoneNumber(selectedUser.phoneNumber)}</div>
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
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {selectedUser.isEmailVerified ? '✓ Verified' : '✗ Not Verified'}
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
                      Showing {(selectedUser as any)?.activityLog?.length || 0} activities
                    </div>
                  </div>
                  
                  {(selectedUser as any)?.activityLog && (selectedUser as any).activityLog.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(selectedUser as any).activityLog.map((activity: any) => (
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
                      Connected Devices ({(selectedUser.connectedDevices || []).length})
                    </h4>
                    <div style={{ 
                      padding: '4px 12px', 
                      background: selectedUser.hasLinkedDevices ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)', 
                      color: selectedUser.hasLinkedDevices ? '#10b981' : '#94a3b8',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {selectedUser.hasLinkedDevices ? 'Connected' : 'No Devices'}
                    </div>
                  </div>
                  
                  {/* Check if user has linked devices */}
                  {selectedUser.hasLinkedDevices ? (
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                      gap: '1rem' 
                    }}>
                      {/* Check if there are actual devices data */}
                      {selectedUser.connectedDevices && selectedUser.connectedDevices.length > 0 ? (
                        selectedUser.connectedDevices.map((device) => (
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
                                <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{device.name || 'Unknown Device'}</div>
                                <div style={{ color: '#94a3b8', fontSize: '12px' }}>{device.model || 'No model info'}</div>
                              </div>
                              <div style={{
                                padding: '4px 8px',
                                background: device.status === 'online' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                color: device.status === 'online' ? '#10b981' : '#6b7280',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: '500'
                              }}>
                                {device.status || 'unknown'}
                              </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                              <div>
                                <label style={{ color: '#94a3b8', fontSize: '11px' }}>Current Flow</label>
                                <div style={{ color: 'white', fontSize: '13px' }}>{device.currentFlow || 'N/A'}</div>
                              </div>
                              <div>
                                <label style={{ color: '#94a3b8', fontSize: '11px' }}>Today's Total</label>
                                <div style={{ color: '#0ea5e9', fontSize: '13px' }}>{device.totalToday || 'N/A'}</div>
                              </div>
                              <div>
                                <label style={{ color: '#94a3b8', fontSize: '11px' }}>Battery</label>
                                <div style={{ color: device.battery && device.battery > 20 ? '#10b981' : '#ef4444', fontSize: '13px' }}>
                                  {device.battery ? `${device.battery}%` : 'N/A'}
                                </div>
                              </div>
                              <div>
                                <label style={{ color: '#94a3b8', fontSize: '11px' }}>Connected Since</label>
                                <div style={{ color: 'white', fontSize: '13px' }}>
                                  {device.connectedSince ? new Date(device.connectedSince).toLocaleDateString() : 'Unknown'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        /* User has linked devices property but no device data yet */
                        <div style={{ 
                          color: '#94a3b8', 
                          textAlign: 'center', 
                          padding: '2rem', 
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '1rem'
                        }}>
                          <Smartphone size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                          <div>Devices are connected but device details are not available yet.</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            Device information will appear here once synced with the mobile app.
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* User has no linked devices */
                    <div style={{ 
                      color: '#94a3b8', 
                      textAlign: 'center', 
                      padding: '3rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <Smartphone size={64} style={{ opacity: 0.3 }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                        No Devices Connected
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8, maxWidth: '400px' }}>
                        This user hasn't connected any FlowSync devices yet. 
                        Devices will appear here once linked to the mobile app.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && selectedUser && (
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid rgba(148, 163, 184, 0.15)'
                }}>
                  {/* Profile Header */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    marginBottom: '1.5rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
                  }}>
                    <div style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '14px',
                      background: `linear-gradient(135deg, ${getColorFromEmail(selectedUser.email)} 0%, ${getColorFromEmail(selectedUser.email)}80 100%)`,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '28px'
                    }}>
                      {getInitials(selectedUser.fullName)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        color: 'white', 
                        fontSize: '1.5rem', 
                        fontWeight: '600', 
                        margin: '0 0 4px 0',
                        letterSpacing: '-0.5px'
                      }}>
                        {selectedUser.fullName}
                      </h3>
                      <p style={{ 
                        color: '#94a3b8', 
                        fontSize: '14px', 
                        margin: '0 0 12px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Mail size={14} style={{ color: '#94a3b8' }} />
                        {selectedUser.email}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{
                          padding: '4px 10px',
                          background: 'rgba(148, 163, 184, 0.1)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '500',
                          color: '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: '1px solid rgba(148, 163, 184, 0.2)'
                        }}>
                          <Shield size={10} style={{ color: '#94a3b8' }} />
                          {selectedUser.isEmailVerified ? 'Verified' : 'Unverified'}
                        </div>
                        
                        <div style={{
                          padding: '4px 10px',
                          background: 'rgba(148, 163, 184, 0.1)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '500',
                          color: '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: '1px solid rgba(148, 163, 184, 0.2)'
                        }}>
                          <Wifi size={10} style={{ color: '#94a3b8' }} />
                          {selectedUser.hasLinkedDevices ? 'Connected' : 'Offline'}
                        </div>
                        
                        <div style={{
                          padding: '4px 10px',
                          background: 'rgba(148, 163, 184, 0.1)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '500',
                          color: '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: '1px solid rgba(148, 163, 184, 0.2)'
                        }}>
                          <Clock size={10} style={{ color: '#94a3b8' }} />
                          {selectedUser.status === 'active' ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Profile Sections */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                    
                    {/* Left Column - Contact & Account */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      
                      {/* Contact Info Card */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        border: '1px solid rgba(148, 163, 184, 0.1)'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          marginBottom: '1rem'
                        }}>
                          <User size={16} style={{ color: '#94a3b8' }} />
                          <h4 style={{ 
                            color: 'white', 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            margin: 0
                          }}>
                            Contact Information
                          </h4>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'rgba(148, 163, 184, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <Phone size={14} style={{ color: '#94a3b8' }} />
                            </div>
                            <div>
                              <div style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.5px' }}>Phone</div>
                              <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
                                {formatPhoneNumber(selectedUser.phoneNumber)}
                              </div>
                            </div>
                          </div>
                          
                          {selectedUser.username && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'rgba(148, 163, 184, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <User size={14} style={{ color: '#94a3b8' }} />
                              </div>
                              <div>
                                <div style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.5px' }}>Username</div>
                                <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
                                  {selectedUser.username}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {selectedUser.address && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'rgba(148, 163, 184, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <MapPin size={14} style={{ color: '#94a3b8' }} />
                              </div>
                              <div>
                                <div style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.5px' }}>Address</div>
                                <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
                                  {selectedUser.address}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Account Details Card */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        border: '1px solid rgba(148, 163, 184, 0.1)'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          marginBottom: '1rem'
                        }}>
                          <Shield size={16} style={{ color: '#94a3b8' }} />
                          <h4 style={{ 
                            color: 'white', 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            margin: 0
                          }}>
                            Account Details
                          </h4>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingBottom: '10px',
                            borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
                          }}>
                            <div style={{ color: '#94a3b8', fontSize: '12px' }}>Account Type</div>
                            <div style={{ 
                              color: '#cbd5e1', 
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {selectedUser.isGmailAccount ? 'Google' : 'Email'}
                            </div>
                          </div>
                          
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingBottom: '10px',
                            borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
                          }}>
                            <div style={{ color: '#94a3b8', fontSize: '12px' }}>Email Status</div>
                            <div style={{ 
                              color: '#cbd5e1', 
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {selectedUser.isEmailVerified ? 'Verified' : 'Unverified'}
                            </div>
                          </div>
                          
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingBottom: '10px',
                            borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
                          }}>
                            <div style={{ color: '#94a3b8', fontSize: '12px' }}>OTP Verification</div>
                            <div style={{ 
                              color: '#cbd5e1', 
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {selectedUser.otpVerified ? 'Enabled' : 'Disabled'}
                            </div>
                          </div>
                          
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div style={{ color: '#94a3b8', fontSize: '12px' }}>User ID</div>
                            <div style={{ 
                              color: '#94a3b8', 
                              fontSize: '11px',
                              fontFamily: 'monospace'
                            }}>
                              {selectedUser.uid?.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Timeline & Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      
                      {/* Timeline Card */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        border: '1px solid rgba(148, 163, 184, 0.1)'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          marginBottom: '1rem'
                        }}>
                          <Clock size={16} style={{ color: '#94a3b8' }} />
                          <h4 style={{ 
                            color: 'white', 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            margin: 0
                          }}>
                            Account Timeline
                          </h4>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'rgba(148, 163, 184, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <Calendar size={14} style={{ color: '#94a3b8' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.5px' }}>Account Created</div>
                              <div style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>
                                {formatDateTime(selectedUser.createdAt)}
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'rgba(148, 163, 184, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <History size={14} style={{ color: '#94a3b8' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.5px' }}>Last Login</div>
                              <div style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>
                                {selectedUser.lastLogin ? getTimeAgo(selectedUser.lastLogin) : 'Never'}
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'rgba(148, 163, 184, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <RefreshCw size={14} style={{ color: '#94a3b8' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.5px' }}>Last Updated</div>
                              <div style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>
                                {formatDateTime(selectedUser.updatedAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats Card */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        border: '1px solid rgba(148, 163, 184, 0.1)'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          marginBottom: '1rem'
                        }}>
                          <Activity size={16} style={{ color: '#94a3b8' }} />
                          <h4 style={{ 
                            color: 'white', 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            margin: 0
                          }}>
                            Quick Stats
                          </h4>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          <div style={{
                            background: 'rgba(148, 163, 184, 0.08)',
                            borderRadius: '10px',
                            padding: '12px',
                            textAlign: 'center',
                            border: '1px solid rgba(148, 163, 184, 0.15)'
                          }}>
                            <div style={{ 
                              color: 'white', 
                              fontSize: '16px', 
                              fontWeight: '600',
                              marginBottom: '4px'
                            }}>
                              {selectedUser.waterFlowData?.todayUsage 
                                ? (selectedUser.waterFlowData.todayUsage / 1000).toFixed(1) 
                                : '0.0'}
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '10px', letterSpacing: '0.5px' }}>
                              Water Usage
                            </div>
                          </div>
                          
                          <div style={{
                            background: 'rgba(148, 163, 184, 0.08)',
                            borderRadius: '10px',
                            padding: '12px',
                            textAlign: 'center',
                            border: '1px solid rgba(148, 163, 184, 0.15)'
                          }}>
                            <div style={{ 
                              color: 'white', 
                              fontSize: '16px', 
                              fontWeight: '600',
                              marginBottom: '4px'
                            }}>
                              {selectedUser.waterFlowData?.currentFlowRate?.toFixed(1) || '0.0'}
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '10px', letterSpacing: '0.5px' }}>
                              Flow Rate
                            </div>
                          </div>
                          
                          <div style={{
                            background: 'rgba(148, 163, 184, 0.08)',
                            borderRadius: '10px',
                            padding: '12px',
                            textAlign: 'center',
                            border: '1px solid rgba(148, 163, 184, 0.15)'
                          }}>
                            <div style={{ 
                              color: 'white', 
                              fontSize: '16px', 
                              fontWeight: '600',
                              marginBottom: '4px'
                            }}>
                              {selectedUser.alerts?.filter((a: any) => !a.read).length || 0}
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '10px', letterSpacing: '0.5px' }}>
                              Active Alerts
                            </div>
                          </div>
                          
                          <div style={{
                            background: 'rgba(148, 163, 184, 0.08)',
                            borderRadius: '10px',
                            padding: '12px',
                            textAlign: 'center',
                            border: '1px solid rgba(148, 163, 184, 0.15)'
                          }}>
                            <div style={{ 
                              color: 'white', 
                              fontSize: '16px', 
                              fontWeight: '600',
                              marginBottom: '4px'
                            }}>
                              {selectedUser.hasLinkedDevices ? 'Yes' : 'No'}
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '10px', letterSpacing: '0.5px' }}>
                              Devices Linked
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User ID Footer */}
                  <div style={{ 
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px' }}>
                      User ID
                    </div>
                    <div style={{ 
                      color: '#cbd5e1', 
                      fontSize: '12px', 
                      fontFamily: 'monospace',
                      wordBreak: 'break-all'
                    }}>
                      {selectedUser.uid}
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
                User ID: {selectedUser.id || selectedUser.uid}
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