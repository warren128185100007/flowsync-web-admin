// src/app/dashboard/admin/page.tsx - ENHANCED VERSION
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  UserPlus, 
  Search, 
  Mail, 
  Key, 
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  Copy,
  Users,
  Activity,
  Eye,
  EyeOff,
  ArrowUpRight,
  Filter,
  Download,
  X,
  Bell,
  User,
  Phone,
  History,
  Crown,
  UserCheck,
  Loader2,
  Key as KeyIcon,
  RefreshCw,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { AdminService } from '@/lib/admin-service';
import { getCurrentAdmin, isSuperAdmin } from '@/lib/admin-utils';

export default function AdminManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'activity' | 'security'>('overview');
  const [admins, setAdmins] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState(false);
  const [updatingAdmin, setUpdatingAdmin] = useState(false);
  const [passwordOptions, setPasswordOptions] = useState<'generate' | 'custom'>('generate');
  const [customPassword, setCustomPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [showTempPassword, setShowTempPassword] = useState(false);
  
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'admin' as 'admin',
    phoneNumber: '',
    permissions: ['dashboard:view', 'users:read', 'devices:read'],
  });

  const [actionMessage, setActionMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const generateStrongPassword = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const length = 12;
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Ensure at least one uppercase, one lowercase, one number, and one special character
    password = password.replace(/^.{8,12}$/, (match) => {
      if (!/[A-Z]/.test(match)) match = 'A' + match.slice(1);
      if (!/[a-z]/.test(match)) match = match.slice(0, 1) + 'a' + match.slice(2);
      if (!/[0-9]/.test(match)) match = match.slice(0, 2) + '1' + match.slice(3);
      if (!/[!@#$%^&*]/.test(match)) match = match.slice(0, 3) + '!' + match.slice(4);
      return match;
    });
    setGeneratedPassword(password);
    return password;
  }, []);

  useEffect(() => {
    // Check if user is super admin
    const admin = getCurrentAdmin();
    console.log('🛡️ Current admin check:', admin);
    
    if (!admin) {
      console.log('❌ No admin found, redirecting to login');
      router.push('/auth/super-admin');
      return;
    }
    
    if (!isSuperAdmin()) {
      console.log('❌ Not super admin, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }
    
    setCurrentUser(admin);
    loadAdmins();
    generateStrongPassword();
  }, [router, generateStrongPassword]);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      console.log('📥 Loading admins from Firebase...');
      const allAdmins = await AdminService.getWebAdmins();
      console.log(`✅ Loaded ${allAdmins.length} admins`);
      setAdmins(allAdmins);
    } catch (error) {
      console.error('❌ Failed to load admins:', error);
      showMessage('error', 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', message: string) => {
    setActionMessage({ type, message });
    setTimeout(() => setActionMessage(null), 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'pending': return '#f59e0b';
      case 'suspended': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={14} />;
      case 'inactive': return <Clock size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'suspended': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getColorFromEmail = (email: string) => {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6'];
    const index = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
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

  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdmin.email)) {
      showMessage('error', 'Please enter a valid email address');
      return;
    }

    setCreatingAdmin(true);
    
    try {
      // First check if email already exists
      const emailCheck = await AdminService.checkAdminEmail(newAdmin.email);
      if (emailCheck.exists) {
        showMessage('error', 'This email is already registered as an admin');
        setCreatingAdmin(false);
        return;
      }

      const result = await AdminService.createAdmin(
        {
          email: newAdmin.email,
          name: newAdmin.name,
          role: 'admin',
          permissions: newAdmin.permissions,
          phoneNumber: newAdmin.phoneNumber || ''
        },
        currentUser?.name || 'Super Admin'
      );

      if (result.success && result.data) {
        // Store temp password for display
        if (result.tempPassword) {
          setTempPassword(result.tempPassword);
        }
        
        showMessage('success', `✅ Admin account created for ${newAdmin.email}`);
        
        // Show temp password modal
        setTimeout(() => {
          // Refresh the admin list
          loadAdmins();
          
          // Reset form
          setNewAdmin({
            name: '',
            email: '',
            role: 'admin',
            phoneNumber: '',
            permissions: ['dashboard:view', 'users:read', 'devices:read'],
          });
          
          setShowAddModal(false);
          setTempPassword(result.tempPassword || '');
          // Show success modal with temp password
        }, 1000);
      } else {
        showMessage('error', `❌ Failed to create admin: ${result.error}`);
      }
    } catch (error: any) {
      showMessage('error', `❌ Error creating admin: ${error.message}`);
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (admin: any) => {
    if (admin.role === 'super_admin') {
      showMessage('error', 'Cannot delete super admin accounts');
      return;
    }

    if (!confirm(`⚠️ Are you sure you want to delete admin "${admin.name}" (${admin.email})?\n\nThis will:\n• Remove their admin access\n• Delete their admin profile\n• Cannot be undone`)) {
      return;
    }

    setDeletingAdmin(true);
    try {
      const result = await AdminService.deleteAdmin(admin.uid || admin.id);
      
      if (result.success) {
        showMessage('success', `✅ Admin "${admin.name}" deleted successfully`);
        await loadAdmins();
      } else {
        showMessage('error', `❌ Failed to delete admin: ${result.error}`);
      }
    } catch (error: any) {
      showMessage('error', `❌ Error deleting admin: ${error.message}`);
    } finally {
      setDeletingAdmin(false);
    }
  };

  const handleToggleStatus = async (admin: any) => {
    const newStatus = admin.status === 'active' ? 'inactive' : 'active';
    
    if (!confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} admin "${admin.name}"?`)) {
      return;
    }

    setUpdatingAdmin(true);
    try {
      const result = await AdminService.toggleAdminStatus(
        admin.uid || admin.id, 
        newStatus
      );
      
      if (result.success) {
        showMessage('success', `✅ Admin "${admin.name}" ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        await loadAdmins();
      } else {
        showMessage('error', `❌ Failed to update admin status: ${result.error}`);
      }
    } catch (error: any) {
      showMessage('error', `❌ Error updating admin: ${error.message}`);
    } finally {
      setUpdatingAdmin(false);
    }
  };

  const handleResetPassword = async (admin: any) => {
    if (!confirm(`Send password reset email to ${admin.email}?\n\nThey will receive an email to set a new password.`)) {
      return;
    }

    setUpdatingAdmin(true);
    try {
      const result = await AdminService.resetAdminPassword(admin.email);
      
      if (result.success) {
        showMessage('success', `✅ Password reset email sent to ${admin.email}`);
      } else {
        showMessage('error', `❌ Failed to send reset email: ${result.error}`);
      }
    } catch (error: any) {
      showMessage('error', `❌ Error sending reset email: ${error.message}`);
    } finally {
      setUpdatingAdmin(false);
    }
  };

  const handleCopyCredentials = (admin: any) => {
    const text = `Name: ${admin.name}\nEmail: ${admin.email}\nRole: ${admin.role}\nStatus: ${admin.status}`;
    navigator.clipboard.writeText(text);
    showMessage('success', '✅ Admin details copied to clipboard');
  };

  const handleCopyTempPassword = () => {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword);
      showMessage('success', '✅ Temporary password copied to clipboard');
    }
  };

  const handleViewDetails = (admin: any) => {
    setSelectedAdmin(admin);
    setShowDetailsModal(true);
    setActiveTab('overview');
  };

  const handleGenerateNewPassword = () => {
    const newPass = generateStrongPassword();
    showMessage('success', 'New strong password generated');
    return newPass;
  };

  // Filter admins based on search and filter
  const filteredAdmins = admins.filter(admin => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (admin.name?.toLowerCase().includes(query) || false) ||
        admin.email.toLowerCase().includes(query) ||
        (admin.phoneNumber?.toLowerCase().includes(query) || false)
      );
    }
    
    // Apply status filter
    if (filter !== 'all') {
      switch (filter) {
        case 'active': return admin.status === 'active';
        case 'pending': return admin.status === 'pending';
        case 'suspended': return admin.status === 'suspended';
        case 'super': return admin.role === 'super_admin';
        case 'regular': return admin.role === 'admin';
      }
    }
    
    return true;
  });

  if (!currentUser && loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white'
      }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', marginRight: '12px' }} />
        Loading admin panel...
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  if (!isSuperAdmin()) {
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
        <div>⛔ Super Admin Access Required</div>
        <div style={{ 
          fontSize: '1rem', 
          color: '#94a3b8', 
          marginTop: '1rem',
          maxWidth: '400px'
        }}>
          You need super admin privileges to access this page.
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Admins',
      value: admins.length,
      icon: <Users size={24} />,
      color: '#8b5cf6',
      change: `${admins.filter(a => a.status === 'active').length} active`
    },
    {
      title: 'Super Admins',
      value: admins.filter(a => a.role === 'super_admin').length,
      icon: <Crown size={24} />,
      color: '#f59e0b',
      change: 'Full system access'
    },
    {
      title: 'Regular Admins',
      value: admins.filter(a => a.role === 'admin').length,
      icon: <UserCheck size={24} />,
      color: '#0ea5e9',
      change: `${admins.filter(a => a.role === 'admin' && a.status === 'active').length} active`
    },
  ];

  return (
    <div style={{ padding: '0 1rem 2rem 1rem', minHeight: '100vh' }}>
      {/* Action Messages */}
      {actionMessage && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 2000,
          padding: '1rem 1.5rem',
          background: actionMessage.type === 'success' 
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideInRight 0.3s ease-out',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {actionMessage.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}
          <span style={{ fontWeight: '500' }}>{actionMessage.message}</span>
        </div>
      )}

      {/* Modern Header */}
      <div style={{ 
        marginBottom: '2rem',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%)',
          opacity: 0.1,
          borderRadius: '20px',
          zIndex: 0
        }} />
        
        <div style={{ 
          position: 'relative', 
          zIndex: 1,
          padding: '2rem',
          background: 'rgba(15, 23, 42, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Shield size={32} style={{ color: 'white' }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, transparent 50%, rgba(255, 255, 255, 0.1) 100%)'
              }} />
            </div>
            
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                fontSize: '3rem', 
                fontWeight: '800',
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.5px',
                lineHeight: '1.1'
              }}>
                Admin Management
              </h1>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <p style={{ 
                  color: '#cbd5e1', 
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    background: '#10b981',
                    borderRadius: '50%',
                    display: 'inline-block'
                  }} />
                  Manage system administrators
                </p>
                
                <div style={{
                  padding: '6px 16px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '20px',
                  color: '#c4b5fd',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Crown size={14} />
                  Super Admin Portal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '14px',
        padding: '1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ef4444',
          flexShrink: 0
        }}>
          <ShieldCheck size={20} />
        </div>
        
        <div>
          <div style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
            ⚠️ Super Admin Access Required
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
            Only super administrators can create, modify, or delete other admin accounts.
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Search and Controls */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={20} style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#94a3b8' 
            }} />
            <input
              type="text"
              placeholder="Search administrators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 14px 14px 44px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Filter size={16} style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#94a3b8',
              zIndex: 1
            }} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '14px 14px 14px 44px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                minWidth: '180px',
                appearance: 'none'
              }}
            >
              <option value="all">All Admins</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="super">Super Admins</option>
              <option value="regular">Regular Admins</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.3)';
          }}
        >
          <UserPlus size={18} />
          Add Admin
        </button>
      </div>

      {/* Admins List */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '20px',
        padding: '1.5rem',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ 
            color: 'white', 
            fontSize: '1.25rem', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Users size={20} />
            System Administrators ({filteredAdmins.length})
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={loadAdmins}
              disabled={loading}
              style={{
                padding: '6px 12px',
                background: 'rgba(14, 165, 233, 0.1)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                borderRadius: '20px',
                color: '#0ea5e9',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <div style={{ color: '#64748b' }}>•</div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>
              {admins.filter(a => a.role === 'super_admin').length} super
            </div>
          </div>
        </div>
        
        {loading ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
            <div>Loading admins...</div>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            <Users size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              No admins found
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              {searchQuery ? 'Try a different search term' : 'No admins match the selected filter'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredAdmins.map((admin) => (
              <div 
                key={admin.id || admin.uid}
                onClick={() => handleViewDetails(admin)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '10px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  border: '1px solid rgba(148, 163, 184, 0.1)'
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
                {/* Super Admin Badge */}
                {admin.role === 'super_admin' && (
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    padding: '2px 8px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '2px solid rgba(15, 23, 42, 0.95)',
                    zIndex: 2,
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                  }}>
                    <Crown size={10} />
                    SUPER ADMIN
                  </div>
                )}
                
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: getColorFromEmail(admin.email),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  position: 'relative',
                  flexShrink: 0
                }}>
                  {getInitials(admin.name)}
                  {admin.isEmailVerified && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '12px',
                      height: '12px',
                      background: '#10b981',
                      borderRadius: '50%',
                      border: '2px solid rgba(30, 41, 59, 0.8)'
                    }}>
                      <CheckCircle size={8} style={{ color: 'white' }} />
                    </div>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <div style={{ 
                        color: 'white', 
                        fontSize: '15px', 
                        fontWeight: '500'
                      }}>
                        {admin.name}
                      </div>
                      <div style={{
                        padding: '2px 8px',
                        background: getStatusColor(admin.status) + '20',
                        color: getStatusColor(admin.status),
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexShrink: 0
                      }}>
                        {getStatusIcon(admin.status)}
                        {admin.status}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '500' }}>
                          Last Active
                        </div>
                        <div style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: '600' }}>
                          {getTimeAgo(admin.lastLogin)}
                        </div>
                      </div>
                      <ArrowUpRight size={16} style={{ color: '#94a3b8' }} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={12} style={{ color: '#94a3b8' }} />
                      <span style={{ color: '#cbd5e1', fontSize: '13px' }}>{admin.email}</span>
                    </div>
                    
                    {admin.phoneNumber && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} style={{ color: '#94a3b8' }} />
                        <span style={{ color: '#cbd5e1', fontSize: '13px' }}>{admin.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleResetPassword(admin)}
                    disabled={updatingAdmin}
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
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title="Reset Password"
                  >
                    <KeyIcon size={14} />
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(admin)}
                    disabled={updatingAdmin}
                    style={{
                      padding: '6px',
                      background: admin.status === 'active' 
                        ? 'rgba(245, 158, 11, 0.1)' 
                        : 'rgba(16, 185, 129, 0.1)',
                      border: admin.status === 'active' 
                        ? '1px solid rgba(245, 158, 11, 0.2)' 
                        : '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '6px',
                      color: admin.status === 'active' ? '#f59e0b' : '#10b981',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title={admin.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {admin.status === 'active' ? <Unlock size={14} /> : <Lock size={14} />}
                  </button>
                  
                  {admin.role !== 'super_admin' && (
                    <button
                      onClick={() => handleDeleteAdmin(admin)}
                      disabled={deletingAdmin}
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
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      title="Delete Admin"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Add Admin Modal */}
      {showAddModal && (
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
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '20px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
              animation: 'scaleIn 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '2rem 2rem 1.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)'
              }}>
                <UserPlus size={32} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                  Create Admin Account
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '8px 0 0 0' }}>
                  Add a new administrator to the system
                </p>
              </div>
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={20} style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#94a3b8' 
                    }} />
                    <input
                      type="text"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      placeholder="John Smith"
                      style={{
                        width: '100%',
                        padding: '14px 14px 14px 44px',
                        background: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={20} style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#94a3b8' 
                    }} />
                    <input
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      placeholder="admin@company.com"
                      style={{
                        width: '100%',
                        padding: '14px 14px 14px 44px',
                        background: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                    Phone Number (Optional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={20} style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#94a3b8' 
                    }} />
                    <input
                      type="tel"
                      value={newAdmin.phoneNumber}
                      onChange={(e) => setNewAdmin({ ...newAdmin, phoneNumber: e.target.value })}
                      placeholder="+63 912 345 6789"
                      style={{
                        width: '100%',
                        padding: '14px 14px 14px 44px',
                        background: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                      Permissions *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const allPermissions = ['dashboard:view', 'users:read', 'users:write', 'devices:read', 'devices:write', 'settings:read', 'settings:write', 'logs:view'];
                        if (newAdmin.permissions.length === allPermissions.length) {
                          setNewAdmin({
                            ...newAdmin,
                            permissions: ['dashboard:view', 'users:read', 'devices:read']
                          });
                        } else {
                          setNewAdmin({
                            ...newAdmin,
                            permissions: allPermissions
                          });
                        }
                      }}
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '8px',
                        padding: '4px 12px',
                        color: '#c4b5fd',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {newAdmin.permissions.length === 8 ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div style={{ 
                    background: 'rgba(15, 23, 42, 0.3)', 
                    borderRadius: '10px', 
                    padding: '12px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px'
                  }}>
                    {[
                      { id: 'dashboard:view', label: 'View Dashboard' },
                      { id: 'users:read', label: 'Read Users' },
                      { id: 'users:write', label: 'Write Users' },
                      { id: 'devices:read', label: 'Read Devices' },
                      { id: 'devices:write', label: 'Write Devices' },
                      { id: 'settings:read', label: 'Read Settings' },
                      { id: 'settings:write', label: 'Write Settings' },
                      { id: 'logs:view', label: 'View Logs' }
                    ].map(perm => (
                      <label key={perm.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: '#cbd5e1',
                        fontSize: '13px',
                        cursor: 'pointer',
                        padding: '4px'
                      }}>
                        <input
                          type="checkbox"
                          checked={newAdmin.permissions.includes(perm.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAdmin({...newAdmin, permissions: [...newAdmin.permissions, perm.id]});
                            } else {
                              setNewAdmin({...newAdmin, permissions: newAdmin.permissions.filter(p => p !== perm.id)});
                            }
                          }}
                          style={{ accentColor: '#8b5cf6' }}
                        />
                        <span>{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Password Note */}
                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <KeyRound size={18} style={{ color: '#8b5cf6', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                      Password Information
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                      A strong password will be automatically generated and a password reset email will be sent to the new admin. 
                      They will need to set their own password on first login.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid rgba(148, 163, 184, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '10px',
                  color: '#cbd5e1',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  flex: 1,
                  marginRight: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddAdmin}
                disabled={creatingAdmin || !newAdmin.name || !newAdmin.email}
                style={{
                  padding: '12px 24px',
                  background: creatingAdmin || !newAdmin.name || !newAdmin.email
                    ? 'rgba(139, 92, 246, 0.3)' 
                    : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: creatingAdmin || !newAdmin.name || !newAdmin.email ? 'not-allowed' : 'pointer',
                  flex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!creatingAdmin && newAdmin.name && newAdmin.email) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {creatingAdmin ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Creating Admin...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Admin Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Details Modal */}
      {showDetailsModal && selectedAdmin && (
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
            zIndex: 2000
          }}
          onClick={() => setShowDetailsModal(false)}
        >
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '20px',
              width: '90%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto'
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
                  background: getColorFromEmail(selectedAdmin.email),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '20px'
                }}>
                  {getInitials(selectedAdmin.name)}
                </div>
                <div>
                  <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                    {selectedAdmin.name}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
                    {selectedAdmin.email}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowDetailsModal(false)}
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
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
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
                      <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Role</label>
                      <div style={{ color: 'white', fontSize: '14px' }}>
                        <span style={{
                          padding: '4px 12px',
                          background: selectedAdmin.role === 'super_admin' 
                            ? 'rgba(139, 92, 246, 0.1)' 
                            : 'rgba(14, 165, 233, 0.1)',
                          color: selectedAdmin.role === 'super_admin' 
                            ? '#8b5cf6' 
                            : '#0ea5e9',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {selectedAdmin.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Status</label>
                      <div style={{ 
                        color: getStatusColor(selectedAdmin.status),
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {selectedAdmin.status.toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Phone</label>
                      <div style={{ color: 'white', fontSize: '14px' }}>{selectedAdmin.phoneNumber || 'Not set'}</div>
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Created</label>
                      <div style={{ color: 'white', fontSize: '14px' }}>{formatDateTime(selectedAdmin.createdAt)}</div>
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Email Verified</label>
                      <div style={{ 
                        color: selectedAdmin.isEmailVerified ? '#10b981' : '#ef4444',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {selectedAdmin.isEmailVerified ? 'Yes ✓' : 'No ✗'}
                      </div>
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Last Login</label>
                      <div style={{ color: 'white', fontSize: '14px' }}>{getTimeAgo(selectedAdmin.lastLogin)}</div>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                {activeTab === 'permissions' && (
                  <div style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid rgba(148, 163, 184, 0.2)'
                  }}>
                    <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '1rem' }}>
                      Permissions ({selectedAdmin.permissions?.length || 0})
                    </h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {selectedAdmin.permissions?.map((perm: string, index: number) => (
                        <div key={index} style={{
                          padding: '8px 12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          color: '#cbd5e1',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <CheckCircle size={12} style={{ color: '#10b981' }} />
                          {perm}
                        </div>
                      )) || (
                        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
                          No permissions assigned
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
                Admin ID: {selectedAdmin.uid || selectedAdmin.id}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '10px',
                    color: '#cbd5e1',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Temporary Password Modal (shown after successful creation) */}
      {tempPassword && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setTempPassword('')}
        >
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '20px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
              animation: 'scaleIn 0.3s ease',
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
              }}>
                <CheckCircle size={32} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                  ✅ Admin Created Successfully!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '8px 0 0 0' }}>
                  Account created for {newAdmin.email}
                </p>
              </div>
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                  IMPORTANT: Save this temporary password
                </div>
                
                <div style={{ 
                  position: 'relative',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  border: '1px solid rgba(148, 163, 184, 0.2)'
                }}>
                  <div style={{ color: '#cbd5e1', fontSize: '11px', marginBottom: '8px' }}>
                    Temporary Password
                  </div>
                  <div style={{ 
                    color: '#10b981',
                    fontSize: '16px',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    padding: '0.5rem'
                  }}>
                    {tempPassword}
                  </div>
                  <button
                    onClick={handleCopyTempPassword}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '6px',
                      padding: '6px',
                      color: '#10b981',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Copy password"
                  >
                    <Copy size={14} />
                  </button>
                </div>

                <div style={{ color: '#cbd5e1', fontSize: '13px', textAlign: 'left' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ color: '#10b981', fontWeight: '500' }}>Next Steps:</span>
                    <ol style={{ margin: '8px 0 0 16px', padding: 0 }}>
                      <li>A password reset email has been sent to the admin</li>
                      <li>They must use this temporary password for first login</li>
                      <li>They will be prompted to set a new password</li>
                    </ol>
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '500', marginTop: '12px' }}>
                    ⚠️ This password will only be shown once
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid rgba(148, 163, 184, 0.2)',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setTempPassword('')}
                style={{
                  padding: '12px 40px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Got it, continue
              </button>
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
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}