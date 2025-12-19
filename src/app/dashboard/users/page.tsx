'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
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
  Activity,
  MapPin,
  Globe,
  ShieldCheck,
  RefreshCw,
  FileText,
  AlertCircle,
  TrendingDown,
  Thermometer,
  Waves,
  Settings,
  Smartphone as SmartphoneIcon,
  DollarSign,
  Key,
  CreditCard,
  Database,
  BatteryCharging,
  Signal,
  UserCheck,
  Edit,
  Trash2,
  Save,
  XCircle,
  MoreVertical,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Mail as MailIcon,
  UserX,
  UserCheck as UserCheckIcon,
  Ban,
  Check,
  AlertOctagon,
  Loader2,
  Upload,
  Image as ImageIcon,
  Plus,
  Copy,
  CheckSquare,
  Square,
  Crown
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
import RealtimeUserService, { 
  ProcessedUser, 
  CreateUserData, 
  UpdateUserData,
  UserStats 
} from '@/lib/realtime-users-service';

// Import RBAC components and hooks
import { useAdminAuth } from '@/contexts/AdminAuthContext';

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

// Types for modals
interface NewUserData {
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
}

interface EditUserData extends NewUserData {
  id: string;
}

export default function UsersManagementPage() {
  const router = useRouter();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<ProcessedUser | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [mobileUsers, setMobileUsers] = useState<ProcessedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ProcessedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'alerts' | 'devices' | 'profile'>('overview');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  
  // CRUD States
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState(false);
  
  // Form States
  const [editUserData, setEditUserData] = useState<EditUserData | null>(null);
  
  // Loading States
  const [updatingUser, setUpdatingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  
  // Message States
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  
  // Real-time subscription reference
  const unsubscribeRef = useRef<(() => void) | null>(null);

    // RBAC Hooks - Use the context directly
  const { 
    admin, 
    isSuperAdmin, 
    isAdmin, 
    hasPermission,
    loading: authLoading 
  } = useAdminAuth();

  // Create helper permission checks
    // Create helper permission checks
    // Create helper permission checks
  const canCreateUsers = isSuperAdmin || hasPermission('users.create');
  const canDeleteUsers = isSuperAdmin || hasPermission('users.delete');
  const canEditRoles = isSuperAdmin || hasPermission('users.edit_role');
  const canUseBulkActions = isSuperAdmin || hasPermission('users.bulk_actions');
  const canEditUsers = isSuperAdmin || hasPermission('users.update');
  const canViewUsers = isSuperAdmin || isAdmin || hasPermission('users.read');
  // Helper functions
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

  const formatPhoneNumber = (phoneNumber: string = '') => {
    if (!phoneNumber || phoneNumber.trim() === '') return 'Not set';
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.startsWith('63') && cleaned.length === 11) {
      return `+63 ${cleaned.substring(2, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
    }
    return phoneNumber;
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

  // Get pressure assessment
  const getPressureAssessment = (pressureInBar: number) => {
    const pressureInPsi = pressureInBar * 14.5038;
    
    if (pressureInPsi < 10) return PHILIPPINE_WATER_PRESSURE_STANDARDS.pressureRanges[0];
    if (pressureInPsi >= 10 && pressureInPsi <= 20) return PHILIPPINE_WATER_PRESSURE_STANDARDS.pressureRanges[1];
    if (pressureInPsi > 20 && pressureInPsi <= 30) return PHILIPPINE_WATER_PRESSURE_STANDARDS.pressureRanges[2];
    if (pressureInPsi > 30 && pressureInPsi <= 50) return PHILIPPINE_WATER_PRESSURE_STANDARDS.pressureRanges[3];
    if (pressureInPsi > 50 && pressureInPsi <= 60) return PHILIPPINE_WATER_PRESSURE_STANDARDS.pressureRanges[4];
    return PHILIPPINE_WATER_PRESSURE_STANDARDS.pressureRanges[5];
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

    // Add loading state for auth
  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    // Redirect if not authenticated or no view permission
    if (!admin || !canViewUsers) {
      console.log('❌ User not authorized for this page. Redirecting...');
      router.push('/dashboard');
      return;
    }
  }, [admin, authLoading, canViewUsers, router]);

  // Initialize real-time subscription
  useEffect(() => {
    if (!admin || authLoading) return;

    // Load user stats
    loadUserStats();
    
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
  }, [admin, authLoading]);

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
        case 'admins':
          filtered = filtered.filter(user => user.role === 'admin');
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

  const loadUserStats = async () => {
    try {
      const stats = await RealtimeUserService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleUpdateUser = async () => {
    if (!editUserData) return;

    setUpdatingUser(true);
    setErrorMessage(null);

    try {
      // Check if trying to edit roles without permission
      if (!canEditRoles && editUserData.role !== 'user') {
        setErrorMessage('You do not have permission to change user roles');
        setUpdatingUser(false);
        return;
      }

      const result = await RealtimeUserService.updateUser(editUserData.id, {
        email: editUserData.email,
        fullName: editUserData.fullName,
        phoneNumber: editUserData.phoneNumber,
        address: editUserData.address,
        role: editUserData.role,
        status: editUserData.status
      });

      if (result.success) {
        setSuccessMessage(`User ${editUserData.email} updated successfully!`);
        setShowEditUserModal(false);
        setEditUserData(null);
      } else {
        setErrorMessage(result.error || 'Failed to update user');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update user');
    } finally {
      setUpdatingUser(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setDeletingUser(true);
    setErrorMessage(null);

    try {
      if (!canDeleteUsers) {
        setErrorMessage('You do not have permission to delete users');
        setDeletingUser(false);
        return;
      }

      const result = await RealtimeUserService.deleteUser(selectedUser.id);
      
      if (result.success) {
        setSuccessMessage(`User ${selectedUser.email} deleted successfully!`);
        setShowDeleteModal(false);
        closeUserDetails();
        
        // Refresh stats
        await loadUserStats();
      } else {
        setErrorMessage(result.error || 'Failed to delete user');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to delete user');
    } finally {
      setDeletingUser(false);
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedUsers.size === 0) return;

    setBulkActionLoading(true);
    setErrorMessage(null);

    try {
      const userIds = Array.from(selectedUsers);
      
      if (action === 'delete') {
        if (!canDeleteUsers) {
          setErrorMessage('You do not have permission to delete users');
          setBulkActionLoading(false);
          return;
        }

        const result = await RealtimeUserService.deleteMultipleUsers(userIds);
        
        if (result.success) {
          setSuccessMessage(`Successfully deleted ${result.deletedCount} users`);
          setSelectedUsers(new Set());
          setShowBulkActions(false);
          
          // Refresh stats
          await loadUserStats();
        } else {
          setErrorMessage(`Failed to delete some users: ${result.errors.join(', ')}`);
        }
      } else {
        const status = action === 'activate' ? 'active' as const : 'inactive' as const;
        const updates = { status };
        
        const result = await RealtimeUserService.bulkUpdateUsers({
          userIds,
          updates
        });
        
        if (result.success) {
          setSuccessMessage(`Successfully ${action}d ${result.updatedCount} users`);
          setSelectedUsers(new Set());
          setShowBulkActions(false);
        } else {
          setErrorMessage(`Failed to ${action} some users: ${result.errors.join(', ')}`);
        }
      }
    } catch (error: any) {
      setErrorMessage(error.message || `Failed to perform bulk ${action}`);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Selection handlers
  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedUsers(new Set());
    } else {
      const allIds = new Set(filteredUsers.map(user => user.id));
      setSelectedUsers(allIds);
    }
    setIsSelectAll(!isSelectAll);
  };

  // User actions
  const handleUserClick = (user: ProcessedUser) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    setActiveTab('overview');
  };

    const handleEditUser = (user: ProcessedUser) => {
    if (!canEditUsers) {  // CHANGE THIS from canUpdateUsers
      setErrorMessage('You do not have permission to edit users');
      return;
    }
    
    setEditUserData({
      id: user.id,
      email: user.email,
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      role: user.role === 'admin' ? 'admin' : 'user',
      status: user.status === 'active' ? 'active' : 'inactive'
    });
    setShowEditUserModal(true);
  };

  const handleDeleteClick = (user: ProcessedUser) => {
    if (!canDeleteUsers) {
      setErrorMessage('You do not have permission to delete users');
      return;
    }
    
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

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

  // Clear messages after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white'
      }}>
        <Loader2 size={24} className="animate-spin mr-2" />
        Loading authorization...
      </div>
    );
  }

  // Show unauthorized message
  if (!admin || !canViewUsers) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#ef4444',
        fontSize: '1.5rem',
        fontWeight: 600,
        textAlign: 'center',
        padding: '2rem'
      }}>
        <Shield size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <div>⛔ Admin Access Required</div>
        <div style={{ 
          fontSize: '1rem', 
          color: '#94a3b8', 
          marginTop: '1rem',
          maxWidth: '400px'
        }}>
          You need admin privileges to access this page.
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            marginTop: '1.5rem',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

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
        Loading users from your mobile app...
      </div>
    );
  }

  return (
    <div style={{ padding: '0 1rem 2rem 1rem' }}>
      {/* Success/Error Messages */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 2000,
          padding: '1rem 1.5rem',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <CheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 2000,
          padding: '1rem 1.5rem',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <AlertTriangle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

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

      {/* Header with RBAC Indicators */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ 
              color: 'white', 
              fontSize: '2.5rem', 
              fontWeight: '800',
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
            }}>
              User Management
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
              Monitor and manage {mobileUsers.length} users from your FlowSync mobile app
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {isSuperAdmin && (
              <div style={{
                padding: '6px 12px',
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '20px',
                color: '#8b5cf6',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Crown size={14} />
                Super Admin
              </div>
            )}
            
            {isAdmin && !isSuperAdmin && (
              <div style={{
                padding: '6px 12px',
                background: 'rgba(14, 165, 233, 0.15)',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                borderRadius: '20px',
                color: '#0ea5e9',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Shield size={14} />
                Admin
              </div>
            )}
            
            <div style={{
              padding: '6px 12px',
              background: 'rgba(148, 163, 184, 0.1)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '20px',
              color: '#94a3b8',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {admin?.name || 'Admin'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                Total Users
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6' }}>
                {userStats?.totalUsers || mobileUsers.length}
              </div>
              <div style={{ fontSize: '13px', color: '#8b5cf6', marginTop: '8px' }}>
                {userStats?.activeUsers || mobileUsers.filter(u => u.status === 'active').length} active
              </div>
            </div>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b5cf6'
            }}>
              <Users size={24} />
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                Active Devices
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981' }}>
                {userStats?.usersWithDevices || mobileUsers.filter(u => u.hasLinkedDevices).length}
              </div>
              <div style={{ fontSize: '13px', color: '#10b981', marginTop: '8px' }}>
                Connected to FlowSync
              </div>
            </div>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <Smartphone size={24} />
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(14, 165, 233, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                Verified Users
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0ea5e9' }}>
                {userStats?.verifiedUsers || mobileUsers.filter(u => u.isEmailVerified).length}
              </div>
              <div style={{ fontSize: '13px', color: '#0ea5e9', marginTop: '8px' }}>
                Email confirmed
              </div>
            </div>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '12px',
              background: 'rgba(14, 165, 233, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0ea5e9'
            }}>
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar with RBAC */}
      {canUseBulkActions && selectedUsers.size > 0 && (
        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '16px',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b5cf6'
            }}>
              <CheckSquare size={16} />
            </div>
            <span style={{ color: 'white', fontWeight: '500' }}>
              {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleBulkAction('activate')}
              disabled={bulkActionLoading}
              style={{
                padding: '8px 16px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                color: '#10b981',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Check size={14} />
              Activate
            </button>
            
            <button
              onClick={() => handleBulkAction('deactivate')}
              disabled={bulkActionLoading}
              style={{
                padding: '8px 16px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                color: '#f59e0b',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Ban size={14} />
              Deactivate
            </button>
            
            {canDeleteUsers && (
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={bulkActionLoading}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                {bulkActionLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Delete
              </button>
            )}
            
            <button
              onClick={() => setSelectedUsers(new Set())}
              style={{
                padding: '8px 16px',
                background: 'rgba(148, 163, 184, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px',
                color: '#94a3b8',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Search and Controls with RBAC */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
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
            <option value="admins">Admins</option>
            <option value="withAlerts">With Alerts</option>
            <option value="highPressure">High Pressure</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {canUseBulkActions && (
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              style={{
                padding: '12px 24px',
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
              }}
            >
              <CheckSquare size={18} />
              Bulk Actions
            </button>
          )}
        </div>
      </div>

      {/* Users List - With RBAC Actions */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '20px',
        padding: '1.5rem',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>
            Mobile App Users ({filteredUsers.length})
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {canUseBulkActions && (
              <button
                onClick={toggleSelectAll}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(148, 163, 184, 0.1)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isSelectAll ? (
                  <>
                    <CheckSquare size={14} />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Square size={14} />
                    Select All
                  </>
                )}
              </button>
            )}
            
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: selectedUsers.has(user.id) 
                      ? 'rgba(139, 92, 246, 0.1)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    border: selectedUsers.has(user.id) 
                      ? '1px solid rgba(139, 92, 246, 0.3)' 
                      : '1px solid transparent',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = selectedUsers.has(user.id) 
                      ? 'rgba(139, 92, 246, 0.1)' 
                      : 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  onClick={() => handleUserClick(user)}
                >
                  {/* Selection Checkbox - Only visible for users with bulk_actions permission */}
                  {canUseBulkActions && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#8b5cf6'
                        }}
                      />
                    </div>
                  )}

                  {/* Alert Indicator Badge */}
                  {user.alerts && user.alerts.filter((a: any) => !a.read).length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '-6px',
                      left: canUseBulkActions ? '32px' : '12px',
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
                  
                  {/* User Avatar */}
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
                  
                  {/* User Info */}
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
                  
                  {/* Action Buttons with RBAC */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                    {/* Edit Button - Always visible for users.update permission */}
                    {canEditUsers && (
                      <button
                        onClick={() => handleEditUser(user)}
                        style={{
                          padding: '6px',
                          background: 'rgba(14, 165, 233, 0.1)',
                          border: '1px solid rgba(14, 165, 233, 0.2)',
                          borderRadius: '6px',
                          color: '#0ea5e9',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        title="Edit User"
                      >
                        <Edit size={14} />
                      </button>
                    )}
                    
                    {/* Delete Button - Only for users.delete permission */}
                    {canDeleteUsers && (
                      <button
                        onClick={() => handleDeleteClick(user)}
                        style={{
                          padding: '6px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: '6px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        title="Delete User"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT USER MODAL with RBAC */}
      {showEditUserModal && editUserData && (
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
            zIndex: 2000,
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={() => setShowEditUserModal(false)}
        >
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '20px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
              animation: 'scaleIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                <Edit size={20} style={{ marginRight: '8px', display: 'inline-block' }} />
                Edit User
              </h3>
              <button
                onClick={() => setShowEditUserModal(false)}
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

            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>Email</div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{editUserData.email}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    color: '#cbd5e1', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editUserData.fullName}
                    onChange={(e) => setEditUserData({...editUserData, fullName: e.target.value})}
                    placeholder="John Doe"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    color: '#cbd5e1', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editUserData.phoneNumber}
                    onChange={(e) => setEditUserData({...editUserData, phoneNumber: e.target.value})}
                    placeholder="+63 912 345 6789"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    color: '#cbd5e1', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    Address
                  </label>
                  <textarea
                    value={editUserData.address}
                    onChange={(e) => setEditUserData({...editUserData, address: e.target.value})}
                    placeholder="Enter user address"
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ 
                      color: '#cbd5e1', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Role
                    </label>
                    <select
                      value={editUserData.role}
                      onChange={(e) => setEditUserData({...editUserData, role: e.target.value as 'user' | 'admin'})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                      disabled={!canEditRoles}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    {!canEditRoles && (
                      <div style={{ color: '#f59e0b', fontSize: '11px', marginTop: '4px' }}>
                        You don't have permission to change roles
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ 
                      color: '#cbd5e1', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Status
                    </label>
                    <select
                      value={editUserData.status}
                      onChange={(e) => setEditUserData({...editUserData, status: e.target.value as 'active' | 'inactive'})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid rgba(148, 163, 184, 0.2)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }}>
              <button
                onClick={() => setShowEditUserModal(false)}
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
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={updatingUser || !editUserData.fullName}
                style={{
                  padding: '10px 20px',
                  background: updatingUser 
                    ? 'rgba(14, 165, 233, 0.5)' 
                    : 'linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: updatingUser ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {updatingUser ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE USER MODAL with RBAC */}
      {showDeleteModal && selectedUser && canDeleteUsers && (
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
            zIndex: 2000,
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '20px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
              animation: 'scaleIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                <AlertTriangle size={20} style={{ marginRight: '8px', display: 'inline-block', color: '#ef4444' }} />
                Delete User
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
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

            <div style={{ padding: '1.5rem' }}>
              <div style={{ 
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                  margin: '0 auto 1rem'
                }}>
                  <AlertTriangle size={32} />
                </div>
                
                <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Are you sure you want to delete this user?
                </h4>
                
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                  This action will permanently delete <strong>{selectedUser.fullName}</strong> ({selectedUser.email})
                  and all associated data including water usage history, devices, and alerts.
                </div>
                
                <div style={{
                  marginTop: '1rem',
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  fontSize: '13px'
                }}>
                  ⚠️ This action cannot be undone!
                </div>
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid rgba(148, 163, 184, 0.2)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }}>
              <button
                onClick={() => setShowDeleteModal(false)}
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
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deletingUser}
                style={{
                  padding: '10px 20px',
                  background: deletingUser 
                    ? 'rgba(239, 68, 68, 0.5)' 
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: deletingUser ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {deletingUser ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal - Protected with RBAC */}
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
                        boxShadow: selectedUser.waterFlowData?.currentFlowRate > 10 ? 
                                  '0 10px 25px rgba(239, 68, 68, 0.4)' :
                                  selectedUser.waterFlowData?.currentFlowRate > 5 ? 
                                  '0 10px 25px rgba(245, 158, 11, 0.4)' :
                                  '0 10px 25px rgba(14, 165, 233, 0.4)',
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
                    padding: '1.5rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
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
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
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
                    padding: '1.5rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
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
                  <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '1rem' }}>
                    Connected Devices ({(selectedUser as any)?.connectedDevices?.length || 0})
                  </h4>
                  
                  {(selectedUser as any)?.connectedDevices && (selectedUser as any).connectedDevices.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                      {(selectedUser as any).connectedDevices.map((device: any) => (
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
                      fontSize: '28px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
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
        
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.3) rgba(15, 23, 42, 0.5);
        }
        
        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        *::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        
        *::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 4px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
}