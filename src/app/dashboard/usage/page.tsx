// src/app/dashboard/users/page.tsx
'use client';

import { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Shield, 
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash2,
  Lock,
  Unlock
} from 'lucide-react';

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const users = [
    { id: '1', name: 'John Smith', email: 'john@company.com', role: 'admin', status: 'active', lastActive: '2 hours ago', phone: '+1 (555) 123-4567' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'operator', status: 'active', lastActive: '15 minutes ago', phone: '+1 (555) 987-6543' },
    { id: '3', name: 'Mike Wilson', email: 'mike@company.com', role: 'viewer', status: 'inactive', lastActive: '3 days ago', phone: '+1 (555) 456-7890' },
    { id: '4', name: 'Emma Davis', email: 'emma@company.com', role: 'admin', status: 'pending', lastActive: 'Never', phone: '+1 (555) 234-5678' },
    { id: '5', name: 'Robert Brown', email: 'robert@company.com', role: 'operator', status: 'active', lastActive: '1 hour ago', phone: '+1 (555) 345-6789' },
    { id: '6', name: 'Lisa Miller', email: 'lisa@company.com', role: 'viewer', status: 'suspended', lastActive: '1 week ago', phone: '+1 (555) 567-8901' },
    { id: '7', name: 'David Wilson', email: 'david@company.com', role: 'admin', status: 'active', lastActive: '30 minutes ago', phone: '+1 (555) 678-9012' },
    { id: '8', name: 'Maria Garcia', email: 'maria@company.com', role: 'operator', status: 'active', lastActive: '5 minutes ago', phone: '+1 (555) 789-0123' },
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#8b5cf6';
      case 'operator': return '#0ea5e9';
      case 'viewer': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
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
          User Management
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Manage system users, roles, and permissions
        </p>
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
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8b5cf6'
          }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>8</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Total Users</div>
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
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>5</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Active</div>
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
            <Shield size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>3</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Admins</div>
          </div>
        </div>

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
            <UserPlus size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>1</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Pending</div>
          </div>
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
              placeholder="Search users..."
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
              minWidth: '150px'
            }}
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="admin">Admins</option>
            <option value="operator">Operators</option>
            <option value="viewer">Viewers</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {selectedUsers.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{
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
              }}>
                <Lock size={16} />
                Suspend
              </button>
              <button style={{
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
              }}>
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
          
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
            gap: '8px'
          }}>
            <UserPlus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
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
          gridTemplateColumns: '0.5fr 2fr 2fr 1fr 1fr 1fr 1fr 0.5fr',
          gap: '1rem',
          color: '#94a3b8',
          fontSize: '14px',
          fontWeight: '600',
          alignItems: 'center'
        }}>
          <div>
            <input
              type="checkbox"
              checked={selectedUsers.length === users.length}
              onChange={handleSelectAll}
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer'
              }}
            />
          </div>
          <div>Name</div>
          <div>Contact</div>
          <div>Role</div>
          <div>Status</div>
          <div>Last Active</div>
          <div>Actions</div>
          <div></div>
        </div>

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {users.map((user) => (
            <div 
              key={user.id}
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                display: 'grid',
                gridTemplateColumns: '0.5fr 2fr 2fr 1fr 1fr 1fr 1fr 0.5fr',
                gap: '1rem',
                alignItems: 'center',
                transition: 'background 0.2s ease',
                background: selectedUsers.includes(user.id) ? 'rgba(14, 165, 233, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!selectedUsers.includes(user.id)) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedUsers.includes(user.id)) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer'
                  }}
                />
              </div>
              
              <div>
                <div style={{ color: 'white', fontWeight: '500' }}>{user.name}</div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                  ID: USER-{user.id.padStart(3, '0')}
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Mail size={14} style={{ color: '#94a3b8' }} />
                  <span style={{ color: '#cbd5e1', fontSize: '14px' }}>{user.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} style={{ color: '#94a3b8' }} />
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>{user.phone}</span>
                </div>
              </div>
              
              <div>
                <span style={{
                  padding: '6px 12px',
                  background: `${getRoleColor(user.role)}15`,
                  color: getRoleColor(user.role),
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {user.role}
                </span>
              </div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: getStatusColor(user.status) }}>
                    {getStatusIcon(user.status)}
                  </div>
                  <span style={{ 
                    color: getStatusColor(user.status),
                    textTransform: 'capitalize',
                    fontWeight: '500'
                  }}>
                    {user.status}
                  </span>
                </div>
              </div>
              
              <div style={{ color: '#94a3b8' }}>{user.lastActive}</div>
              
              <div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    padding: '6px',
                    background: 'rgba(14, 165, 233, 0.1)',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                    borderRadius: '6px',
                    color: '#0ea5e9',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Edit size={14} />
                  </button>
                  <button style={{
                    padding: '6px',
                    background: user.status === 'active' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    border: user.status === 'active' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '6px',
                    color: user.status === 'active' ? '#ef4444' : '#10b981',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {user.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                  </button>
                </div>
              </div>
              
              <div>
                <button style={{
                  padding: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}>
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}