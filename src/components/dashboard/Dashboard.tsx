// src/components/dashboard/Dashboard.tsx - FIXED WITH PROPER ALIGNMENT & ICONS
'use client';

import { 
  AlertTriangle, 
  Cpu, 
  Users, 
  Download,
  Mail,
  Phone,
  Calendar,
  User,
  Clock,
  MapPin,
  CheckCircle,
  Bell,
  Search,
  ChevronRight,
  Activity,
  Wifi,
  Battery,
  Thermometer,
  DollarSign,
  Droplet,
  CalendarDays,
  FileText,
  History,
  Settings,
  Waves,
  Gauge,
  RefreshCw,
  Shield,
  Smartphone,
  Key,
  Globe,
  CreditCard,
  BarChart,
  Home,
  Database,
  AlertCircle,
  Zap,
  BatteryCharging,
  Signal
} from 'lucide-react';
import { useState } from 'react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'billing' | 'devices' | 'security'>('overview');
  
  // User data - Updated with your exact login data structure
  const userActivities = [
    {
      id: "user1",
      // Your exact login data
      address: "asddfk",
      createdAt: "December 5, 2025 at 11:38:11 PM UTC+8",
      email: "ariaswarren01@gmail.com",
      fullName: "qww wee",
      hasLinkedDevices: false,
      isEmailVerified: true,
      isGmailAccount: true,
      lastLogin: "December 6, 2025 at 12:31:54 PM UTC+8",
      otpVerified: true,
      phoneNumber: "09741235689",
      photoURL: "",
      profileImageUrl: "",
      uid: "O79ST8nbOyQOBVl6CFPTkLPk50Z2",
      updatedAt: "December 5, 2025 at 11:38:11 PM UTC+8",
      username: "ward123",
      
      // Additional dashboard data
      name: "qww wee",
      activity: "Monitoring water flow",
      time: "Just now",
      status: "active",
      role: "Admin",
      alerts: 2,
      color: "#3b82f6",
      initials: "QW",
      
      // Water Flow Data
      waterFlow: {
        currentFlow: 45,
        averageDaily: 1200,
        pressure: 3.2,
        temperature: 25.5,
        quality: "Good",
        consumption: {
          today: 1250,
          yesterday: 1100,
          week: 8500,
          month: 38000,
          trend: "+12%"
        }
      },
      billing: {
        currentBill: 2450.75,
        dueDate: "Dec 20, 2025",
        paymentStatus: "pending",
        previousBill: 2100.50,
        consumptionCharge: 1800.25,
        serviceCharge: 500.00,
        tax: 150.50,
        paymentHistory: [
          { month: "Nov 2025", amount: 2100.50, paid: true },
          { month: "Oct 2025", amount: 1950.75, paid: true },
          { month: "Sep 2025", amount: 2200.00, paid: true },
          { month: "Aug 2025", amount: 1850.25, paid: true }
        ]
      },
      calendar: [
        {
          id: "event1",
          title: "System Maintenance",
          date: "Dec 15, 2025",
          time: "10:00 AM",
          type: "maintenance"
        },
        {
          id: "event2",
          title: "Monthly Report Review",
          date: "Dec 18, 2025",
          time: "2:00 PM",
          type: "update"
        }
      ],
      recentActivities: [
        {
          id: "activity1",
          action: "Logged into dashboard",
          timestamp: "10 minutes ago",
          icon: "login"
        },
        {
          id: "activity2",
          action: "Viewed flow meter data",
          timestamp: "25 minutes ago",
          icon: "eye"
        },
        {
          id: "activity3",
          action: "Updated device settings",
          timestamp: "1 hour ago",
          icon: "settings"
        }
      ],
      connectedDevices: [
        {
          id: "device1",
          name: "Smart Flow Meter 01",
          type: "flow_meter",
          location: "Main Inlet",
          status: "online",
          lastReading: "45 L/min",
          battery: 85,
          signal: "excellent"
        },
        {
          id: "device2",
          name: "Pressure Sensor 01",
          type: "pressure_sensor",
          location: "Main Line",
          status: "online",
          lastReading: "3.2 Bar",
          battery: 92,
          signal: "good"
        }
      ]
    },
    {
      id: "user2",
      // Additional user with similar structure
      address: "Makati City",
      createdAt: "December 4, 2025 at 09:15:22 AM UTC+8",
      email: "john.r@flowsync.com",
      fullName: "John Rivera",
      hasLinkedDevices: true,
      isEmailVerified: true,
      isGmailAccount: false,
      lastLogin: "December 6, 2025 at 10:45:33 AM UTC+8",
      otpVerified: true,
      phoneNumber: "+639123456789",
      photoURL: "https://example.com/photo.jpg",
      profileImageUrl: "https://example.com/profile.jpg",
      uid: "ABC123DEF456",
      updatedAt: "December 5, 2025 at 02:30:45 PM UTC+8",
      username: "john_r",
      
      name: "John Rivera",
      activity: "Viewing pressure data",
      time: "15 min ago",
      status: "online",
      role: "Engineer",
      alerts: 0,
      color: "#10b981",
      initials: "JR",
      waterFlow: {
        currentFlow: 38,
        averageDaily: 950,
        pressure: 2.8,
        temperature: 24.0,
        quality: "Excellent",
        consumption: {
          today: 980,
          yesterday: 920,
          week: 6800,
          month: 29000,
          trend: "+6%"
        }
      },
      billing: {
        currentBill: 1850.25,
        dueDate: "Dec 18, 2025",
        paymentStatus: "paid",
        previousBill: 1750.00,
        consumptionCharge: 1350.25,
        serviceCharge: 400.00,
        tax: 100.00,
        paymentHistory: [
          { month: "Nov 2025", amount: 1750.00, paid: true },
          { month: "Oct 2025", amount: 1650.75, paid: true },
          { month: "Sep 2025", amount: 1800.00, paid: true }
        ]
      },
      calendar: [
        {
          id: "event1",
          title: "Device Calibration",
          date: "Dec 16, 2025",
          time: "9:00 AM",
          type: "maintenance"
        }
      ],
      recentActivities: [
        {
          id: "activity1",
          action: "Checked water quality",
          timestamp: "30 minutes ago",
          icon: "droplet"
        },
        {
          id: "activity2",
          action: "Generated report",
          timestamp: "2 hours ago",
          icon: "file"
        }
      ],
      connectedDevices: [
        {
          id: "device1",
          name: "Smart Meter 02",
          type: "flow_meter",
          location: "Main Line",
          status: "online",
          lastReading: "38 L/min",
          battery: 90,
          signal: "good"
        }
      ]
    },
    {
      id: "user3",
      address: "Quezon City",
      createdAt: "December 3, 2025 at 03:20:15 PM UTC+8",
      email: "maria@flowsync.com",
      fullName: "Maria Santos",
      hasLinkedDevices: true,
      isEmailVerified: false,
      isGmailAccount: true,
      lastLogin: "December 5, 2025 at 08:20:10 PM UTC+8",
      otpVerified: false,
      phoneNumber: "+639987654321",
      photoURL: "",
      profileImageUrl: "",
      uid: "DEF789GHI012",
      updatedAt: "December 5, 2025 at 08:20:10 PM UTC+8",
      username: "maria_s",
      
      name: "Maria Santos",
      activity: "Checking water quality",
      time: "30 min ago",
      status: "active",
      role: "Operator",
      alerts: 1,
      color: "#8b5cf6",
      initials: "MS",
      waterFlow: {
        currentFlow: 52,
        averageDaily: 1400,
        pressure: 3.5,
        temperature: 26.0,
        quality: "Good",
        consumption: {
          today: 1420,
          yesterday: 1300,
          week: 9800,
          month: 42000,
          trend: "+9%"
        }
      },
      billing: {
        currentBill: 2850.50,
        dueDate: "Dec 19, 2025",
        paymentStatus: "pending",
        previousBill: 2600.00,
        consumptionCharge: 2200.50,
        serviceCharge: 500.00,
        tax: 150.00,
        paymentHistory: [
          { month: "Nov 2025", amount: 2600.00, paid: true },
          { month: "Oct 2025", amount: 2400.75, paid: true }
        ]
      },
      calendar: [
        {
          id: "event1",
          title: "System Update",
          date: "Dec 17, 2025",
          time: "11:00 AM",
          type: "update"
        }
      ],
      recentActivities: [
        {
          id: "activity1",
          action: "Reset flow meter",
          timestamp: "1 hour ago",
          icon: "refresh"
        }
      ],
      connectedDevices: [
        {
          id: "device1",
          name: "Flow Meter 03",
          type: "flow_meter",
          location: "Basement",
          status: "online",
          lastReading: "52 L/min",
          battery: 75,
          signal: "excellent"
        }
      ]
    }
  ];

  // Calculate stats from user data including login stats
  const activeAlerts = userActivities.reduce((sum, user) => sum + user.alerts, 0);
  const onlineDevices = userActivities.reduce((sum, user) => sum + user.connectedDevices.filter(d => d.status === 'online').length, 0);
  const activeUsers = userActivities.filter(u => u.status === 'active' || u.status === 'online').length;
  const verifiedUsers = userActivities.filter(u => u.isEmailVerified).length;
  const gmailUsers = userActivities.filter(u => u.isGmailAccount).length;

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

  // Format date for better display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render water flow data
  const renderWaterFlowData = () => (
    <div className={styles.flowGrid}>
      <div className={styles.flowMetric}>
        <div className={styles.flowIcon}>
          <Waves size={20} />
        </div>
        <div>
          <div className={styles.flowLabel}>Current Flow</div>
          <div className={styles.flowValue}>
            {selectedUser?.waterFlow?.currentFlow} L/min
          </div>
        </div>
      </div>
      <div className={styles.flowMetric}>
        <div className={styles.flowIcon}>
          <Gauge size={20} />
        </div>
        <div>
          <div className={styles.flowLabel}>Pressure</div>
          <div className={styles.flowValue}>{selectedUser?.waterFlow?.pressure} Bar</div>
        </div>
      </div>
      <div className={styles.flowMetric}>
        <div className={styles.flowIcon}>
          <Thermometer size={20} />
        </div>
        <div>
          <div className={styles.flowLabel}>Temperature</div>
          <div className={styles.flowValue}>{selectedUser?.waterFlow?.temperature}°C</div>
        </div>
      </div>
      <div className={styles.flowMetric}>
        <div className={styles.flowIcon}>
          <Droplet size={20} />
        </div>
        <div>
          <div className={styles.flowLabel}>Water Quality</div>
          <div className={`${styles.flowValue} ${selectedUser?.waterFlow?.quality === 'Good' || selectedUser?.waterFlow?.quality === 'Excellent' ? styles.good : ''}`}>
            {selectedUser?.waterFlow?.quality}
          </div>
        </div>
      </div>
    </div>
  );

  // Render billing information with proper icons
  const renderBillingInfo = () => (
    <div className={styles.modalSection}>
      <div className={styles.sectionHeader}>
        <CreditCard size={18} />
        <h4>Billing Details</h4>
      </div>
      
      <div className={styles.billingSummary}>
        <div className={styles.billingTotal}>
          <div className={styles.billingLabel}>Current Bill</div>
          <div className={styles.billingAmount}>
            ₱{selectedUser?.billing?.currentBill?.toFixed(2)}
          </div>
          <div className={`${styles.paymentStatus} ${styles[selectedUser?.billing?.paymentStatus]}`}>
            {selectedUser?.billing?.paymentStatus}
          </div>
        </div>
        
        <div className={styles.billingBreakdown}>
          <div className={styles.breakdownItem}>
            <Droplet size={14} />
            <span>Consumption Charge</span>
            <span className={styles.breakdownValue}>₱{selectedUser?.billing?.consumptionCharge?.toFixed(2)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <Settings size={14} />
            <span>Service Charge</span>
            <span className={styles.breakdownValue}>₱{selectedUser?.billing?.serviceCharge?.toFixed(2)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <FileText size={14} />
            <span>Tax</span>
            <span className={styles.breakdownValue}>₱{selectedUser?.billing?.tax?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={styles.modalSection}>
        <div className={styles.sectionHeader}>
          <History size={18} />
          <h4>Payment History</h4>
        </div>
        <div className={styles.paymentHistory}>
          {selectedUser?.billing?.paymentHistory?.map((payment: any, index: number) => (
            <div key={index} className={styles.paymentItem}>
              <div className={styles.paymentMonth}>
                <CalendarDays size={14} />
                <span>{payment.month}</span>
              </div>
              <div className={styles.paymentAmount}>₱{payment.amount.toFixed(2)}</div>
              <div className={`${styles.paymentStatusBadge} ${payment.paid ? styles.paid : styles.pending}`}>
                {payment.paid ? (
                  <>
                    <CheckCircle size={12} />
                    <span>Paid</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={12} />
                    <span>Pending</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render security information
  const renderSecurityInfo = () => (
    <div className={styles.modalSection}>
      <div className={styles.sectionHeader}>
        <Shield size={18} />
        <h4>Security & Verification</h4>
      </div>
      
      <div className={styles.securityGrid}>
        <div className={styles.securityCard}>
          <div className={`${styles.securityIcon} ${selectedUser?.isEmailVerified ? styles.verified : styles.unverified}`}>
            {selectedUser?.isEmailVerified ? 
              <CheckCircle size={24} /> : 
              <AlertCircle size={24} />
            }
          </div>
          <div className={styles.securityContent}>
            <div className={styles.securityTitle}>Email Verification</div>
            <div className={`${styles.securityStatus} ${selectedUser?.isEmailVerified ? styles.statusVerified : styles.statusUnverified}`}>
              {selectedUser?.isEmailVerified ? 'Verified' : 'Not Verified'}
            </div>
          </div>
        </div>
        
        <div className={styles.securityCard}>
          <div className={`${styles.securityIcon} ${selectedUser?.otpVerified ? styles.verified : styles.unverified}`}>
            {selectedUser?.otpVerified ? 
              <Key size={24} /> : 
              <Key size={24} />
            }
          </div>
          <div className={styles.securityContent}>
            <div className={styles.securityTitle}>OTP Verification</div>
            <div className={`${styles.securityStatus} ${selectedUser?.otpVerified ? styles.statusVerified : styles.statusUnverified}`}>
              {selectedUser?.otpVerified ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>
        
        <div className={styles.securityCard}>
          <div className={`${styles.securityIcon} ${selectedUser?.hasLinkedDevices ? styles.verified : styles.unverified}`}>
            {selectedUser?.hasLinkedDevices ? 
              <Smartphone size={24} /> : 
              <Smartphone size={24} />
            }
          </div>
          <div className={styles.securityContent}>
            <div className={styles.securityTitle}>Linked Devices</div>
            <div className={styles.securityStatus}>
              {selectedUser?.hasLinkedDevices ? 'Linked' : 'No Devices'}
            </div>
          </div>
        </div>
        
        <div className={styles.securityCard}>
          <div className={`${styles.securityIcon} ${selectedUser?.isGmailAccount ? styles.gmail : styles.email}`}>
            {selectedUser?.isGmailAccount ? 
              <Mail size={24} /> : 
              <Mail size={24} />
            }
          </div>
          <div className={styles.securityContent}>
            <div className={styles.securityTitle}>Account Type</div>
            <div className={styles.securityStatus}>
              {selectedUser?.isGmailAccount ? 'Gmail Account' : 'Email Account'}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Security Info */}
      <div className={styles.modalSection}>
        <div className={styles.sectionHeader}>
          <Shield size={18} />
          <h4>Account Security</h4>
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <Clock size={16} className={styles.infoIcon} />
            <div>
              <div className={styles.infoLabel}>Last Password Change</div>
              <div className={styles.infoValue}>December 1, 2025</div>
            </div>
          </div>
          <div className={styles.infoItem}>
            <Bell size={16} className={styles.infoIcon} />
            <div>
              <div className={styles.infoLabel}>Security Notifications</div>
              <div className={styles.infoValue}>Enabled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render calendar events
  const renderCalendarEvents = () => (
    <div className={styles.modalSection}>
      <div className={styles.sectionHeader}>
        <CalendarDays size={18} />
        <h4>Upcoming Events</h4>
      </div>
      <div className={styles.calendarContainer}>
        {selectedUser?.calendar?.map((event: any) => (
          <div key={event.id} className={styles.calendarEvent}>
            <div className={`${styles.eventType} ${styles[event.type]}`}>
              {event.type === 'maintenance' ? <Settings size={16} /> : <RefreshCw size={16} />}
            </div>
            <div className={styles.eventDetails}>
              <div className={styles.eventTitle}>{event.title}</div>
              <div className={styles.eventTime}>
                <CalendarDays size={14} />
                <span>{event.date} at {event.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render activity list with icons
  const renderActivityList = () => (
    <div className={styles.modalSection}>
      <div className={styles.sectionHeader}>
        <History size={18} />
        <h4>Recent Activities</h4>
      </div>
      <div className={styles.activityContainer}>
        {selectedUser?.recentActivities?.map((activity: any) => (
          <div key={activity.id} className={styles.activityItem}>
            <div className={styles.activityIcon}>
              {activity.icon === 'login' && <User size={16} />}
              {activity.icon === 'eye' && <Activity size={16} />}
              {activity.icon === 'settings' && <Settings size={16} />}
              {activity.icon === 'droplet' && <Droplet size={16} />}
              {activity.icon === 'file' && <FileText size={16} />}
              {activity.icon === 'refresh' && <RefreshCw size={16} />}
            </div>
            <div className={styles.activityContent}>
              <div className={styles.activityText}>{activity.action}</div>
              <div className={styles.activityTime}>
                <Clock size={14} />
                <span>{activity.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render connected devices
  const renderConnectedDevices = () => (
    <div className={styles.modalSection}>
      <div className={styles.sectionHeader}>
        <Cpu size={18} />
        <h4>Connected Devices</h4>
      </div>
      
      <div className={styles.devicesGrid}>
        {selectedUser?.connectedDevices?.map((device: any) => (
          <div key={device.id} className={styles.deviceCard}>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceInfo}>
                <div className={styles.deviceName}>
                  {device.type === 'flow_meter' && <Waves size={14} />}
                  {device.type === 'pressure_sensor' && <Gauge size={14} />}
                  <span>{device.name}</span>
                </div>
                <div className={styles.deviceLocation}>
                  <MapPin size={12} />
                  <span>{device.location}</span>
                </div>
              </div>
              <div className={`${styles.deviceStatus} ${styles[device.status]}`}>
                {device.status === 'online' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                <span>{device.status}</span>
              </div>
            </div>
            <div className={styles.deviceMetrics}>
              <div className={styles.deviceMetric}>
                <Database size={12} />
                <span>Last Reading</span>
                <span className={styles.metricValue}>{device.lastReading}</span>
              </div>
              <div className={styles.deviceMetric}>
                <BatteryCharging size={12} />
                <span>Battery</span>
                <span className={`${styles.metricValue} ${device.battery > 80 ? styles.good : device.battery > 50 ? styles.warning : styles.danger}`}>
                  {device.battery}%
                </span>
              </div>
              <div className={styles.deviceMetric}>
                <Signal size={12} />
                <span>Signal</span>
                <span className={`${styles.metricValue} ${styles[device.signal]}`}>
                  {device.signal}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Device Statistics */}
      <div className={styles.modalSection}>
        <div className={styles.sectionHeader}>
          <BarChart size={18} />
          <h4>Device Statistics</h4>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Online Devices</div>
            <div className={styles.statValue}>
              {selectedUser?.connectedDevices?.filter((d: any) => d.status === 'online').length || 0}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Avg Battery</div>
            <div className={styles.statValue}>
              {selectedUser?.connectedDevices?.length ? 
                Math.round(selectedUser.connectedDevices.reduce((sum: number, d: any) => sum + d.battery, 0) / selectedUser.connectedDevices.length) : 
                0
              }%
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Profile Information - This will only be called from the Overview tab
  const renderProfileInformation = () => (
    <div className={styles.modalSection}>
      <div className={styles.sectionHeader}>
        <User size={18} />
        <h4>Profile Information</h4>
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <Mail size={16} className={styles.infoIcon} />
          <div>
            <div className={styles.infoLabel}>Email</div>
            <div className={styles.infoValue}>
              {selectedUser?.email}
              {selectedUser?.isEmailVerified && (
                <span className={styles.verifiedLabel}>
                  <CheckCircle size={10} />
                  <span>Verified</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={styles.infoItem}>
          <Phone size={16} className={styles.infoIcon} />
          <div>
            <div className={styles.infoLabel}>Phone</div>
            <div className={styles.infoValue}>{selectedUser?.phoneNumber}</div>
          </div>
        </div>
        <div className={styles.infoItem}>
          <Home size={16} className={styles.infoIcon} />
          <div>
            <div className={styles.infoLabel}>Address</div>
            <div className={styles.infoValue}>{selectedUser?.address || 'Not provided'}</div>
          </div>
        </div>
        <div className={styles.infoItem}>
          <Calendar size={16} className={styles.infoIcon} />
          <div>
            <div className={styles.infoLabel}>Account Created</div>
            <div className={styles.infoValue}>{formatDateTime(selectedUser?.createdAt)}</div>
          </div>
        </div>
        <div className={styles.infoItem}>
          <Clock size={16} className={styles.infoIcon} />
          <div>
            <div className={styles.infoLabel}>Last Login</div>
            <div className={styles.infoValue}>{formatDateTime(selectedUser?.lastLogin)}</div>
          </div>
        </div>
        <div className={styles.infoItem}>
          <Key size={16} className={styles.infoIcon} />
          <div>
            <div className={styles.infoLabel}>User ID</div>
            <div className={styles.infoValueSmall}>{selectedUser?.uid}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>FlowSync Dashboard</h1>
            <p className={styles.subtitle}>User monitoring with login data</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button className={styles.exportButton}>
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid - Now showing all stats including login data */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statIconWrapper}>
            <Users size={24} className={styles.statIcon} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Active Users</div>
            <div className={styles.statValue}>
              {activeUsers}
            </div>
            <div className={styles.statTrend}>
              <Activity size={14} />
              <span className={styles.trendText}>{userActivities.length} total</span>
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.danger}`}>
          <div className={styles.statIconWrapper}>
            <AlertTriangle size={24} className={styles.statIcon} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Active Alerts</div>
            <div className={styles.statValue}>
              {activeAlerts}
            </div>
            <div className={styles.statTrend}>
              <span className={styles.trendText}>Total user alerts</span>
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statIconWrapper}>
            <Shield size={24} className={styles.statIcon} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Verified Users</div>
            <div className={styles.statValue}>
              {verifiedUsers}
            </div>
            <div className={styles.statTrend}>
              <CheckCircle size={14} />
              <span className={styles.trendText}>{gmailUsers} Gmail accounts</span>
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statIconWrapper}>
            <Cpu size={24} className={styles.statIcon} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Online Devices</div>
            <div className={styles.statValue}>
              {onlineDevices}
            </div>
            <div className={styles.statTrend}>
              <Globe size={14} />
              <span className={styles.trendText}>Connected to users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content - Updated user list */}
      <div className={styles.dashboardMain}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Users & Login Data</h2>
              <p className={styles.cardSubtitle}>System users with login information</p>
            </div>
            <div className={styles.userCount}>
              <div className={styles.verifiedCount}>
                <Shield size={14} />
                <span>{verifiedUsers} verified</span>
              </div>
              <div className={styles.totalCount}>
                {userActivities.length} users total
              </div>
            </div>
          </div>
          
          <div className={styles.userList}>
            {userActivities.map((user) => (
              <div 
                key={user.id} 
                className={styles.userItem}
                onClick={() => handleUserClick(user)}
              >
                <div className={styles.userAvatar} style={{ background: user.color }}>
                  {user.initials}
                  {user.isEmailVerified && (
                    <div className={styles.verifiedBadge}>
                      <CheckCircle size={10} />
                    </div>
                  )}
                </div>
                <div className={styles.userContent}>
                  <div className={styles.userHeader}>
                    <div className={styles.userInfoLeft}>
                      <span className={styles.userName}>{user.fullName}</span>
                      <div className={styles.userTags}>
                        <span className={styles.userRole}>{user.role}</span>
                        {user.isGmailAccount && (
                          <span className={styles.userTagGmail}>Gmail</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.userStats}>
                      <div className={styles.userStat}>
                        <Droplet size={12} />
                        <span>{user.waterFlow?.currentFlow || 0} L/min</span>
                      </div>
                      <div className={styles.userStat}>
                        <Clock size={12} />
                        <span>{user.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.userFooter}>
                    <div className={styles.userActivity}>
                      <Mail size={12} />
                      <span>{user.email}</span>
                      <Phone size={12} />
                      <span>{user.phoneNumber}</span>
                    </div>
                    <div className={styles.userStatus}>
                      <div className={`${styles.statusBadge} ${styles[user.status]}`}>
                        {user.status}
                      </div>
                      {!user.isEmailVerified && (
                        <div className={styles.userWarning}>
                          <AlertTriangle size={12} />
                          <span>Not Verified</span>
                        </div>
                      )}
                      {user.alerts > 0 && (
                        <div className={styles.userAlerts}>
                          <Bell size={12} />
                          <span>{user.alerts}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} className={styles.userArrow} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Details Modal - Updated with security tab */}
      {showUserDetails && selectedUser && (
        <div className={styles.modalOverlay} onClick={closeUserDetails}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modal}>
              {/* Modal Header */}
              <div className={styles.modalHeader}>
                <div className={styles.modalUser}>
                  <div className={styles.modalAvatar} style={{ background: selectedUser.color }}>
                    {selectedUser.initials}
                    {selectedUser.isEmailVerified && (
                      <div className={styles.modalVerifiedBadge}>
                        <CheckCircle size={12} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className={styles.modalName}>{selectedUser.fullName}</h3>
                    <div className={styles.modalUserInfo}>
                      <span className={styles.modalRole}>{selectedUser.role}</span>
                      <span className={styles.modalUsername}>@{selectedUser.username}</span>
                      {selectedUser.isGmailAccount && (
                        <span className={styles.modalGmailTag}>Gmail Account</span>
                      )}
                    </div>
                  </div>
                </div>
                <button className={styles.modalClose} onClick={closeUserDetails}>
                  &times;
                </button>
              </div>

              {/* Tab Navigation */}
              <div className={styles.modalTabs}>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <User size={16} />
                  Overview
                </button>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'activity' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('activity')}
                >
                  <Activity size={16} />
                  Activity
                </button>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'billing' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('billing')}
                >
                  <CreditCard size={16} />
                  Billing
                </button>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'devices' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('devices')}
                >
                  <Cpu size={16} />
                  Devices
                </button>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'security' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <Shield size={16} />
                  Security
                </button>
              </div>

              {/* Modal Content based on active tab */}
              <div className={styles.modalContent}>
                {activeTab === 'overview' && (
                  <>
                    {/* Current Activity */}
                    <div className={styles.modalSection}>
                      <div className={styles.sectionHeader}>
                        <Activity size={18} />
                        <h4>Current Activity</h4>
                      </div>
                      <div className={styles.activityDetail}>
                        <div className={styles.activityText}>{selectedUser.activity}</div>
                        <div className={styles.activityTimeDetail}>
                          <Clock size={14} />
                          {selectedUser.time}
                        </div>
                      </div>
                    </div>

                    {/* Water Flow Data */}
                    <div className={styles.modalSection}>
                      <div className={styles.sectionHeader}>
                        <Waves size={18} />
                        <h4>Water Flow Data</h4>
                      </div>
                      {renderWaterFlowData()}
                    </div>

                    {/* Billing Summary */}
                    <div className={styles.modalSection}>
                      <div className={styles.sectionHeader}>
                        <DollarSign size={18} />
                        <h4>Billing Summary</h4>
                      </div>
                      <div className={styles.billingPreview}>
                        <div className={styles.billingAmountPreview}>
                          <span>Current Bill:</span>
                          <span className={styles.billAmount}>₱{selectedUser.billing?.currentBill?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className={styles.billingDue}>
                          <CalendarDays size={14} />
                          <span>Due: {selectedUser.billing?.dueDate || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Profile Information - ONLY in Overview tab */}
                    {renderProfileInformation()}
                  </>
                )}

                {activeTab === 'activity' && (
                  <>
                    {/* Activity List */}
                    {renderActivityList()}
                    
                    {/* Calendar Events */}
                    {renderCalendarEvents()}
                  </>
                )}

                {activeTab === 'billing' && (
                  <>
                    {/* Detailed Billing Information */}
                    {renderBillingInfo()}
                  </>
                )}

                {activeTab === 'devices' && (
                  <>
                    {/* Connected Devices */}
                    {renderConnectedDevices()}
                  </>
                )}

                {activeTab === 'security' && (
                  <>
                    {/* Security Information */}
                    {renderSecurityInfo()}
                  </>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.modalButtonSecondary} onClick={closeUserDetails}>
                  Close
                </button>
                <button className={styles.modalButtonPrimary}>
                  <FileText size={18} />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}