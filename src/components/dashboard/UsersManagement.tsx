// src/components/dashboard/UsersManagement.tsx
'use client';

import { UserPlus, Search, MoreVertical, Mail, Phone, Shield } from 'lucide-react';
import { users } from '@/lib/mock-data';
import { useState } from 'react';

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUsers, setCurrentUsers] = useState(users);

  const filteredUsers = currentUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    const newUser = {
      id: currentUsers.length + 1,
      name: `New User ${currentUsers.length + 1}`,
      email: `user${currentUsers.length + 1}@email.com`,
      role: 'User',
      devices: 1,
      status: 'active' as const
    };
    setCurrentUsers([...currentUsers, newUser]);
  };

  const toggleUserStatus = (id: number) => {
    setCurrentUsers(currentUsers.map(user =>
      user.id === id ? {
        ...user,
        status: user.status === 'active' ? 'inactive' : 'active'
      } : user
    ));
  };

  return (
    <div style={{ 
      background: 'rgba(30, 41, 59, 0.7)', 
      borderRadius: '16px', 
      padding: '24px' 
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <div>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#e2e8f0', 
            margin: '0 0 4px 0' 
          }}>
            Users Management
          </h2>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            Manage system users and permissions
          </div>
        </div>
        <button
          onClick={handleAddUser}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ 
        position: 'relative', 
        marginBottom: '24px' 
      }}>
        <Search size={18} style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#64748b'
        }} />
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 12px 12px 44px',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            borderRadius: '12px',
            color: '#e2e8f0',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {/* Users Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ 
                textAlign: 'left', 
                padding: '12px 16px', 
                color: '#94a3b8', 
                fontSize: '12px',
                fontWeight: '600',
                borderBottom: '1px solid rgba(71, 85, 105, 0.3)'
              }}>
                USER
              </th>
              <th style={{ 
                textAlign: 'left', 
                padding: '12px 16px', 
                color: '#94a3b8', 
                fontSize: '12px',
                fontWeight: '600',
                borderBottom: '1px solid rgba(71, 85, 105, 0.3)'
              }}>
                ROLE
              </th>
              <th style={{ 
                textAlign: 'left', 
                padding: '12px 16px', 
                color: '#94a3b8', 
                fontSize: '12px',
                fontWeight: '600',
                borderBottom: '1px solid rgba(71, 85, 105, 0.3)'
              }}>
                DEVICES
              </th>
              <th style={{ 
                textAlign: 'left', 
                padding: '12px 16px', 
                color: '#94a3b8', 
                fontSize: '12px',
                fontWeight: '600',
                borderBottom: '1px solid rgba(71, 85, 105, 0.3)'
              }}>
                STATUS
              </th>
              <th style={{ 
                textAlign: 'left', 
                padding: '12px 16px', 
                color: '#94a3b8', 
                fontSize: '12px',
                fontWeight: '600',
                borderBottom: '1px solid rgba(71, 85, 105, 0.3)'
              }}>
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid rgba(71, 85, 105, 0.1)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '16px'
                    }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '2px' }}>
                        {user.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                        <Mail size={12} color="#94a3b8" />
                        <span style={{ color: '#94a3b8' }}>{user.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={14} color={
                      user.role === 'Administrator' ? '#ef4444' :
                      user.role === 'Operator' ? '#f59e0b' :
                      '#0ea5e9'
                    } />
                    <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{user.role}</span>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px' 
                  }}>
                    <span style={{ color: '#e2e8f0', fontWeight: '700' }}>{user.devices}</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>devices</span>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    style={{
                      padding: '6px 16px',
                      background: user.status === 'active' ? 
                        'rgba(16, 185, 129, 0.1)' : 
                        'rgba(148, 163, 184, 0.1)',
                      color: user.status === 'active' ? '#10b981' : '#94a3b8',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}
                  >
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td style={{ padding: '16px' }}>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '8px'
                  }}>
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}