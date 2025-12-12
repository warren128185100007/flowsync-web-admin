// src/app/dashboard/users/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  ArrowUpRight,
  X,
  Download,
  User,
  Droplets,
  BarChart3,
  Gauge,
  Bell,
  Info as InfoIcon,
  LineChart,
  BarChart,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Smartphone,
  History,
  Shield as ShieldIcon,
  WifiOff,
  Wifi,
  Clock,
  Home,
  Activity
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import RealtimeUserService, { ProcessedUser, WaterFlowData } from '@/lib/realtime-users-service';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Custom Peso Sign component
const PesoSign = ({ size = 16, color = "currentColor" }) => (
  <span style={{
    fontFamily: 'Arial, sans-serif',
    fontSize: `${size}px`,
    color: color,
    fontWeight: 'bold'
  }}>
    ₱
  </span>
);

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<ProcessedUser | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [mobileUsers, setMobileUsers] = useState<ProcessedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'activity' | 'alerts' | 'devices' | 'water-usage' | 'security'>('overview');
  const [showPressureGuide, setShowPressureGuide] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  
  // Real-time subscription reference
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Chart options for better design
  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#cbd5e1',
        bodyColor: '#cbd5e1',
        borderColor: '#0ea5e9',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          },
          callback: function(value) {
            return value + ' L';
          }
        }
      }
    }
  };

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          },
          callback: function(value) {
            return value + ' L';
          }
        }
      }
    }
  };

  // Philippine Water Pressure Standards
  const PHILIPPINE_WATER_PRESSURE_STANDARDS = {
    normalRange: {
      psi: { min: 20, max: 50 },
      kpa: { min: 138, max: 345 },
      bar: { min: 1.38, max: 3.45 }
    },
    pressureRanges: [
      {
        range: '< 10 psi (< 0.69 Bar)',
        level: 'Very Low',
        description: '"Mahina ang tubig" - Often cannot reach second floor',
        color: '#ef4444',
        icon: '⚠️'
      },
      {
        range: '10-20 psi (0.69-1.38 Bar)',
        level: 'Low',
        description: 'Usable for ground floor only',
        color: '#f59e0b',
        icon: '📉'
      },
      {
        range: '20-30 psi (1.38-2.07 Bar)',
        level: 'Normal',
        description: 'Standard for many Philippine households',
        color: '#10b981',
        icon: '✅'
      },
      {
        range: '30-50 psi (2.07-3.45 Bar)',
        level: 'Good',
        description: 'Strong flow, optimal pressure',
        color: '#0ea5e9',
        icon: '👍'
      },
      {
        range: '> 50 psi (> 3.45 Bar)',
        level: 'High',
        description: 'Considered high; may require pressure reducing valve',
        color: '#8b5cf6',
        icon: '⚡'
      },
      {
        range: '> 60 psi (> 4.14 Bar)',
        level: 'Very High',
        description: 'Rare in PH; potential pipe stress',
        color: '#ec4899',
        icon: '🚨'
      }
    ],
    reference: 'Accurate Normal Water Pressure After the Water Meter (Philippines)',
    note: 'Standard expected pressure delivered to residential homes after the meter'
  };

  // Helper function to get pressure assessment
  const getPressureAssessment = (pressureInBar: number) => {
    const pressureInPsi = pressureInBar * 14.5038;
    
    if (pressureInPsi < 10) return PHILIPPINE_WATER_PRESSURE_STANDARDS.pressureRanges[0];
    if (pressureInPsi >= 10 && pressureInPsi <= 20) return PHILIPPINE_WATER_PRESSURE_STANDARDS.pressureRanges[1];
    if (pressureInPsi > 20 && pressureInPsi <= 30) return PHILIPPINE_WATER_PRESSURE_STANDARDS.pressureRanges[2];
    if (pressureInPsi > 30 && pressureInPsi <= 50) return PHILIPPINE_WATER_PRESSURE_STANDARDS.pressureRanges[3];
    if (pressureInPsi > 50 && pressureInPsi <= 60) return PHILIPPINE_WATER_PRESSURE_STANDARDS.pressureRanges[4];
    return PHILIPPINE_WATER_PRESSURE_STANDARDS.pressureRanges[5];
  };

  // Get pressure color based on assessment
  const getPressureColor = (pressureInBar: number) => {
    if (pressureInBar === 0) return '#64748b'; // Gray for no data
    
    const pressureInPsi = pressureInBar * 14.5038;
    
    if (pressureInPsi < 10) return '#ef4444';
    if (pressureInPsi >= 10 && pressureInPsi <= 20) return '#f59e0b';
    if (pressureInPsi > 20 && pressureInPsi <= 30) return '#10b981';
    if (pressureInPsi > 30 && pressureInPsi <= 50) return '#0ea5e9';
    if (pressureInPsi > 50 && pressureInPsi <= 60) return '#8b5cf6';
    return '#ec4899';
  };

  // Initialize real-time subscription
  useEffect(() => {
    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    setLoading(true);
    
    // Subscribe to real-time user data
    unsubscribeRef.current = RealtimeUserService.subscribeToAllUsers((users: ProcessedUser[]) => {
      setMobileUsers(users);
      setRealtimeConnected(true);
      setLoading(false);
      
      // Update selected user if it's in the list
      if (selectedUser) {
        const updatedSelectedUser = users.find(u => u.id === selectedUser.id);
        if (updatedSelectedUser) {
          setSelectedUser(updatedSelectedUser);
        }
      }
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []); // Only run once on mount

  // Sample chart data (you can replace with real data later)
  const weeklyUsageData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Water Usage (Liters)',
        data: [1024, 1567, 1234, 1890, 1456, 2103, 876],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const monthlyTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Usage (kL)',
        data: [28.5, 32.1, 29.8, 35.2, 38.9, 42.3, 45.6, 48.2, 41.8, 37.4, 33.9, 30.2],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        borderWidth: 2
      }
    ]
  };

  const dailyPatternData = {
    labels: ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
    datasets: [
      {
        label: 'Flow Rate (L/min)',
        data: [8.4, 5.2, 45.2, 32.1, 28.7, 38.9, 52.3, 18.6],
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: '#8b5cf6',
        borderWidth: 2
      }
    ]
  };

  const handleUserClick = (user: ProcessedUser) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    setActiveTab('overview');
  };

  const closeUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };

  const getTimeAgo = (timestamp: any) => {
    let date: Date;
    
    if (timestamp && typeof timestamp.toDate === 'function') {
      // It's a Firebase Timestamp
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      // It's already a Date
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      // It's a string
      date = new Date(timestamp);
    } else {
      return 'Never';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  const getColorFromEmail = (email: string) => {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    const index = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
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

  const filteredUsers = mobileUsers.filter(user => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (user.fullName?.toLowerCase().includes(searchLower) || false) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phoneNumber?.includes(searchTerm) || false)
      );
    }
    
    if (filter === 'verified') return user.isEmailVerified;
    if (filter === 'withDevices') return user.hasLinkedDevices;
    if (filter === 'normalPressure') {
      const assessment = getPressureAssessment(user.waterFlowData?.pressure || 0);
      return assessment?.level === 'Normal' || assessment?.level === 'Good';
    }
    if (filter === 'lowPressure') {
      const assessment = getPressureAssessment(user.waterFlowData?.pressure || 0);
      return assessment?.level === 'Very Low' || assessment?.level === 'Low';
    }
    if (filter === 'highPressure') {
      const assessment = getPressureAssessment(user.waterFlowData?.pressure || 0);
      return assessment?.level === 'High' || assessment?.level === 'Very High';
    }
    if (filter === 'withAlerts') {
      // You can add alerts to user data later
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'white',
        gap: '1rem'
      }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <div>Loading users from your mobile app...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
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

      {/* Header with Stats */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ 
              color: 'white', 
              fontSize: '2rem', 
              fontWeight: '800',
              marginBottom: '0.5rem'
            }}>
              Mobile App Users
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Real-time monitoring of {mobileUsers.length} users from your Flutter mobile app
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setShowPressureGuide(!showPressureGuide)}
              style={{
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
              }}
            >
              <InfoIcon size={18} />
              PH Pressure Guide
            </button>
            <button style={{
              padding: '10px 20px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Download size={18} />
              Export Data
            </button>
          </div>
        </div>

        {/* Philippine Pressure Standards Guide */}
        {showPressureGuide && (
          <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  🇵🇭 Philippine Water Pressure Standards
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Normal pressure range after water meter: <strong>20-50 psi (1.38-3.45 Bar)</strong>
                </p>
              </div>
              <button
                onClick={() => setShowPressureGuide(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              {PHILIPPINE_WATER_PRESSURE_STANDARDS.pressureRanges.map((range, index) => (
                <div key={index} style={{
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  borderLeft: `3px solid ${range.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: `${range.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    {range.icon}
                  </div>
                  <div>
                    <div style={{ color: 'white', fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>
                      {range.level}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>{range.range}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              padding: '0.75rem',
              background: 'rgba(14, 165, 233, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(14, 165, 233, 0.2)'
            }}>
              <div style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: '500' }}>
                ℹ️ Reference: {PHILIPPINE_WATER_PRESSURE_STANDARDS.reference}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
                {PHILIPPINE_WATER_PRESSURE_STANDARDS.note}
              </div>
            </div>
          </div>
        )}

        {/* User Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(139, 92, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b5cf6'
            }}>
              <Users size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
                {mobileUsers.length}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '13px' }}>Total Users</div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <Droplets size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
                {mobileUsers.filter(u => u.hasLinkedDevices).length}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '13px' }}>With Devices</div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(14, 165, 233, 0.2)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(14, 165, 233, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0ea5e9'
            }}>
              <Gauge size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
                {mobileUsers.filter(u => {
                  const assessment = getPressureAssessment(u.waterFlowData?.pressure || 0);
                  return assessment?.level === 'Normal' || assessment?.level === 'Good';
                }).length}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '13px' }}>Normal Pressure</div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b'
            }}>
              <PesoSign size={22} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
                ₱{(mobileUsers.reduce((acc, u) => acc + (u.waterFlowData?.todayBill || 0), 0) * 30).toFixed(0)}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '13px' }}>Estimated Monthly</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <option value="verified">Verified</option>
            <option value="withDevices">With Devices</option>
            <option value="normalPressure">Normal Pressure</option>
            <option value="lowPressure">Low Pressure</option>
            <option value="highPressure">High Pressure</option>
            <option value="withAlerts">With Alerts</option>
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
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      {/* Users List */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '20px',
        padding: '1.5rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>
            Mobile App Users ({filteredUsers.length})
          </h2>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>
            {realtimeConnected ? 'Real-time data from your Flutter app' : 'Connecting to mobile app...'}
          </div>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem',
            color: '#94a3b8',
            textAlign: 'center'
          }}>
            <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              No users found
            </h3>
            <p>
              {searchTerm ? 'Try a different search term' : 'Your mobile app users will appear here'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredUsers.map((user) => {
              const pressureAssessment = getPressureAssessment(user.waterFlowData?.pressure || 0);
              const pressureColor = getPressureColor(user.waterFlowData?.pressure || 0);
              
              // Get profile image URL with real-time support
              const profileImage = user.displayPhotoUrl || user.photoURL || user.profileImageUrl;
              const hasProfileImage = profileImage && profileImage.startsWith('http');
              const initials = getInitials(user.fullName);
              const avatarColor = getColorFromEmail(user.email);
              
              return (
                <div 
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    border: '1px solid transparent',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.border = '1px solid rgba(14, 165, 233, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.border = '1px solid transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* User Avatar with real-time profile image */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    background: avatarColor
                  }}>
                    {hasProfileImage ? (
                      <>
                        <img 
                          src={profileImage} 
                          alt={user.fullName || user.email}
                          onLoad={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.opacity = '1';
                          }}
                          onError={(e) => {
                            // If image fails to load, show initials
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLDivElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                          }}
                        />
                        {/* Loading skeleton */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.2) 25%, rgba(30, 41, 59, 0.4) 50%, rgba(30, 41, 59, 0.2) 75%)',
                          animation: 'loading 1.5s infinite',
                          display: 'block'
                        }} />
                        {/* Fallback initials */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: avatarColor,
                          color: 'white',
                          display: 'none',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600',
                          fontSize: '16px'
                        }}>
                          {initials}
                        </div>
                      </>
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: avatarColor,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '16px'
                      }}>
                        {initials}
                      </div>
                    )}
                    
                    {/* Verification badge */}
                    {user.isEmailVerified && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '16px',
                        height: '16px',
                        background: '#10b981',
                        borderRadius: '50%',
                        border: '2px solid rgba(30, 41, 59, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2
                      }}>
                        <CheckCircle size={10} style={{ color: 'white' }} />
                      </div>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ 
                          color: 'white', 
                          fontSize: '16px', 
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {user.fullName || 'Unknown User'}
                        </div>
                        <div style={{ 
                          color: '#94a3b8', 
                          fontSize: '13px', 
                          marginTop: '2px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {user.email}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '500' }}>
                            Last Active
                          </div>
                          <div style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: '600' }}>
                            {getTimeAgo(user.lastActivity)}
                          </div>
                        </div>
                        <ArrowUpRight size={16} style={{ color: '#94a3b8' }} />
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px', 
                      marginTop: '8px',
                      flexWrap: 'wrap',
                      rowGap: '8px'
                    }}>
                      {user.phoneNumber && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={12} style={{ color: '#94a3b8' }} />
                          <span style={{ color: '#cbd5e1', fontSize: '13px' }}>{user.phoneNumber}</span>
                        </div>
                      )}
                      {user.waterFlowData && user.waterFlowData.pressure > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Gauge size={12} style={{ color: pressureColor }} />
                          <span style={{ 
                            color: pressureColor, 
                            fontSize: '13px',
                            fontWeight: '500',
                            background: `${pressureColor}20`,
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            {user.waterFlowData.pressure.toFixed(1)} Bar
                          </span>
                        </div>
                      )}
                      {user.waterFlowData && user.waterFlowData.todayBill > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <PesoSign size={12} color="#f59e0b" />
                          <span style={{ 
                            color: '#f59e0b', 
                            fontSize: '13px',
                            fontWeight: '500',
                            background: 'rgba(245, 158, 11, 0.1)',
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            ₱{user.waterFlowData.todayBill.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {user.hasLinkedDevices && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Smartphone size={12} style={{ color: '#0ea5e9' }} />
                          <span style={{ 
                            color: '#0ea5e9', 
                            fontSize: '13px',
                            fontWeight: '500',
                            background: 'rgba(14, 165, 233, 0.1)',
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            Connected
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
        <UserDetailsModal 
          user={selectedUser}
          onClose={closeUserDetails}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          getPressureColor={getPressureColor}
          getPressureAssessment={getPressureAssessment}
          formatLiters={formatLiters}
          getFlowColor={getFlowColor}
          weeklyUsageData={weeklyUsageData}
          monthlyTrendData={monthlyTrendData}
          dailyPatternData={dailyPatternData}
          lineChartOptions={lineChartOptions}
          barChartOptions={barChartOptions}
          getColorFromEmail={getColorFromEmail}
          getInitials={getInitials}
          getTimeAgo={getTimeAgo}
        />
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
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes loading {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

// Separate Modal Component for better organization
interface UserDetailsModalProps {
  user: ProcessedUser;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  getPressureColor: (pressure: number) => string;
  getPressureAssessment: (pressure: number) => any;
  formatLiters: (liters: number) => string;
  getFlowColor: (flowRate: number) => string;
  weeklyUsageData: any;
  monthlyTrendData: any;
  dailyPatternData: any;
  lineChartOptions: any;
  barChartOptions: any;
  getColorFromEmail: (email: string) => string;
  getInitials: (name?: string) => string;
  getTimeAgo: (timestamp: any) => string;
}

function UserDetailsModal({
  user,
  onClose,
  activeTab,
  setActiveTab,
  getPressureColor,
  getPressureAssessment,
  formatLiters,
  getFlowColor,
  weeklyUsageData,
  monthlyTrendData,
  dailyPatternData,
  lineChartOptions,
  barChartOptions,
  getColorFromEmail,
  getInitials,
  getTimeAgo
}: UserDetailsModalProps) {
  
  // Get profile image for modal
  const profileImage = user.displayPhotoUrl || user.photoURL || user.profileImageUrl;
  const hasProfileImage = profileImage && profileImage.startsWith('http');
  const initials = getInitials(user.fullName);
  const avatarColor = getColorFromEmail(user.email);

  return (
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
        padding: '1rem',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '1200px',
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
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: 'rgba(15, 23, 42, 0.95)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              background: avatarColor
            }}>
              {hasProfileImage ? (
                <>
                  <img 
                    src={profileImage} 
                    alt={user.fullName || user.email}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLDivElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: avatarColor,
                    color: 'white',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '20px'
                  }}>
                    {initials}
                  </div>
                </>
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: avatarColor,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '20px'
                }}>
                  {initials}
                </div>
              )}
            </div>
            <div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                {user.fullName || 'Unknown User'}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
                {user.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          padding: '0 1.5rem',
          overflowX: 'auto',
          position: 'sticky',
          top: '92px',
          background: 'rgba(15, 23, 42, 0.95)',
          zIndex: 9
        }}>
          {['overview', 'charts', 'activity', 'alerts', 'devices', 'water-usage', 'security'].map((tab) => (
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
                position: 'relative',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {tab === 'overview' && <User size={16} />}
              {tab === 'charts' && <LineChart size={16} />}
              {tab === 'activity' && <History size={16} />}
              {tab === 'alerts' && <Bell size={16} />}
              {tab === 'devices' && <Smartphone size={16} />}
              {tab === 'water-usage' && <Droplets size={16} />}
              {tab === 'security' && <ShieldIcon size={16} />}
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div style={{ padding: '1.5rem' }}>
          {activeTab === 'overview' && user.waterFlowData && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Key Metrics */}
              <div>
                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '1rem' }}>
                  Current Water Metrics
                </h4>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                  gap: '1rem'
                }}>
                  <div style={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1px solid rgba(14, 165, 233, 0.2)',
                    borderRadius: '12px',
                    padding: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
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
                        <Droplets size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Current Flow</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: getFlowColor(user.waterFlowData.currentFlowRate) }}>
                          {user.waterFlowData.currentFlowRate.toFixed(1)} L/min
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: `1px solid ${getPressureColor(user.waterFlowData.pressure)}40`,
                    borderRadius: '12px',
                    padding: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${getPressureColor(user.waterFlowData.pressure)}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: getPressureColor(user.waterFlowData.pressure)
                      }}>
                        <Gauge size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Water Pressure</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: getPressureColor(user.waterFlowData.pressure) }}>
                          {user.waterFlowData.pressure.toFixed(1)} Bar
                        </div>
                      </div>
                    </div>
                    {user.waterFlowData.pressure > 0 && (
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: getPressureColor(user.waterFlowData.pressure),
                        background: `${getPressureColor(user.waterFlowData.pressure)}15`,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        marginTop: '8px'
                      }}>
                        {getPressureAssessment(user.waterFlowData.pressure)?.level || 'No data'}
                      </div>
                    )}
                  </div>

                  <div style={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                    padding: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
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
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Today's Usage</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>
                          {formatLiters(user.waterFlowData.todayUsage)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '12px',
                    padding: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
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
                        <PesoSign size={20} color="#f59e0b" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Today's Bill</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>
                          ₱{user.waterFlowData.todayBill.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <h5 style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>
                  User Information
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>Username</div>
                    <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{user.username || 'Not set'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>Phone</div>
                    <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{user.phoneNumber || 'Not set'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>Address</div>
                    <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{user.address || 'Not set'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>Account Created</div>
                    <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
                      {getTimeAgo(user.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs content remains similar... */}
          {activeTab === 'charts' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Weekly Usage Chart */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                      Weekly Water Usage Analysis
                    </h4>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                      Daily consumption patterns and trends
                    </p>
                  </div>
                </div>
                <div style={{ height: '300px' }}>
                  <Line data={weeklyUsageData} options={lineChartOptions} />
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
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>
            User ID: {user.id}
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={onClose}
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
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}