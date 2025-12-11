// src/app/dashboard/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
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
  Copy
} from 'lucide-react';

export default function AdminManagementPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'admin',
    permissions: ['read']
  });

  useEffect(() => {
    const userData = localStorage.getItem('admin_user');
    if (!userData || JSON.parse(userData).role !== 'super-admin') {
      router.push('/dashboard');
    } else {
      setUserRole('super-admin');
    }
  }, [router]);

  const admins = [
    { id: '1', name: 'John Smith', email: 'john@company.com', role: 'super-admin', status: 'active', created: '2024-01-01', lastActive: '2 hours ago' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'admin', status: 'active', created: '2024-01-05', lastActive: '15 minutes ago' },
    { id: '3', name: 'Mike Wilson', email: 'mike@company.com', role: 'admin', status: 'inactive', created: '2024-01-10', lastActive: '3 days ago' },
    { id: '4', name: 'Emma Davis', email: 'emma@company.com', role: 'admin', status: 'pending', created: '2024-01-12', lastActive: 'Never' },
    { id: '5', name: 'Robert Brown', email: 'robert@company.com', role: 'admin', status: 'suspended', created: '2024-01-15', lastActive: '1 week ago' },
  ];

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
      case 'active': return <CheckCircle size={16} />;
      case 'inactive': return <Clock size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'suspended': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const handleAddAdmin = () => {
    // Simulate API call
    console.log('Adding new admin:', newAdmin);
    alert(`Admin invitation sent to ${newAdmin.email}`);
    setShowAddModal(false);
    setNewAdmin({ name: '', email: '', role: 'admin', permissions: ['read'] });
  };

  const handleCopyCredentials = (admin: any) => {
    const text = `Name: ${admin.name}\nEmail: ${admin.email}\nRole: ${admin.role}`;
    navigator.clipboard.writeText(text);
    alert('Admin details copied to clipboard');
  };

  if (userRole !== 'super-admin') {
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
          This page is restricted to super administrators only. 
          Please contact your system administrator for access.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
          }}>
            <Shield size={32} style={{ color: 'white' }} />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800',
              marginBottom: '0.25rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              Admin Management
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
              Manage system administrators and permissions
            </p>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem'
      }}>
        <AlertTriangle size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
        <div>
          <div style={{ color: '#ef4444', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
            Super Admin Access Required
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
            This section contains sensitive operations. Changes made here affect system security and access controls.
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6', marginBottom: '4px' }}>5</div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Total Admins</div>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>2</div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Active</div>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>1</div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Pending</div>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>1</div>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Suspended</div>
        </div>
      </div>

      {/* Controls */}
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
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search administrators..."
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
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
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
          <UserPlus size={18} />
          Add Admin
        </button>
      </div>

      {/* Admins Table */}
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
          gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 2fr',
          gap: '1rem',
          color: '#94a3b8',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
          <div>Created</div>
          <div>Actions</div>
        </div>

        <div>
          {admins.map((admin) => (
            <div 
              key={admin.id}
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 2fr',
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
              <div>
                <div style={{ color: 'white', fontWeight: '500' }}>{admin.name}</div>
                {admin.role === 'super-admin' && (
                  <div style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '4px',
                    padding: '2px 8px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: '#8b5cf6',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    <Shield size={10} />
                    SUPER ADMIN
                  </div>
                )}
              </div>
              
              <div style={{ color: '#cbd5e1' }}>{admin.email}</div>
              
              <div>
                <span style={{
                  padding: '6px 12px',
                  background: admin.role === 'super-admin' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                  color: admin.role === 'super-admin' ? '#8b5cf6' : '#0ea5e9',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {admin.role}
                </span>
              </div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: getStatusColor(admin.status) }}>
                    {getStatusIcon(admin.status)}
                  </div>
                  <span style={{ 
                    color: getStatusColor(admin.status),
                    textTransform: 'capitalize',
                    fontWeight: '500'
                  }}>
                    {admin.status}
                  </span>
                </div>
              </div>
              
              <div style={{ color: '#94a3b8' }}>{admin.created}</div>
              
              <div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleCopyCredentials(admin)}
                    style={{
                      padding: '8px',
                      background: 'rgba(14, 165, 233, 0.1)',
                      border: '1px solid rgba(14, 165, 233, 0.3)',
                      borderRadius: '6px',
                      color: '#0ea5e9',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Copy size={14} />
                  </button>
                  <button style={{
                    padding: '8px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '6px',
                    color: '#f59e0b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Edit size={14} />
                  </button>
                  <button style={{
                    padding: '8px',
                    background: admin.status === 'active' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    border: admin.status === 'active' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '6px',
                    color: admin.status === 'active' ? '#ef4444' : '#10b981',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {admin.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 24px 80px rgba(139, 92, 246, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserPlus size={24} style={{ color: 'white' }} />
              </div>
              <div>
                <h3 style={{ color: 'white', fontSize: '22px', fontWeight: '700', margin: 0 }}>
                  Add New Administrator
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
                  Invite a new administrator to the system
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '14px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="John Smith"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '14px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="admin@company.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '14px' }}>
                  Role
                </label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                >
                  <option value="admin">Administrator</option>
                  <option value="operator">Operator</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              justifyContent: 'flex-end',
              paddingTop: '24px',
              borderTop: '1px solid rgba(148, 163, 184, 0.1)'
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
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddAdmin}
                disabled={!newAdmin.name || !newAdmin.email}
                style={{
                  padding: '12px 32px',
                  background: !newAdmin.name || !newAdmin.email 
                    ? 'rgba(139, 92, 246, 0.3)' 
                    : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: !newAdmin.name || !newAdmin.email ? 'not-allowed' : 'pointer'
                }}
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}