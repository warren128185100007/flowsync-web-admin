// src/app/dashboard/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Key, Bell, Lock, Smartphone, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem('admin_user');
    if (data) {
      setUserData(JSON.parse(data));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'white', fontSize: '1rem' }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '2.25rem', 
          fontWeight: '700',
          marginBottom: '0.5rem',
          letterSpacing: '-0.025em'
        }}>
          Profile Settings
        </h1>
        <p style={{ 
          color: '#94a3b8', 
          fontSize: '1rem',
          fontWeight: '400'
        }}>
          Manage your personal information, security, and preferences
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '2rem',
        flexWrap: 'wrap' 
      }}>
        {/* Left Column - Profile Card */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.08)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem', 
              marginBottom: '2.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
            }}>
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2.25rem',
                fontWeight: '700',
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)'
              }}>
                {userData?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <div style={{ 
                  color: 'white', 
                  fontSize: '1.75rem', 
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>
                  {userData?.name || 'Super Administrator'}
                </div>
                <div style={{ 
                  color: '#94a3b8', 
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Mail size={14} />
                  {userData?.email || 'No email provided'}
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(30, 41, 59, 0.3)',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.05)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0ea5e9'
                }}>
                  <User size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '500' }}>Full Name</div>
                  <div style={{ color: 'white', fontSize: '1rem', fontWeight: '500' }}>
                    {userData?.name || 'Super Administrator'}
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(30, 41, 59, 0.3)',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.05)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981'
                }}>
                  <Mail size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '500' }}>Email Address</div>
                  <div style={{ color: 'white', fontSize: '1rem', fontWeight: '500' }}>
                    {userData?.email || 'No email provided'}
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(30, 41, 59, 0.3)',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.05)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8b5cf6'
                }}>
                  <Shield size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '500' }}>Account Role</div>
                  <div style={{ 
                    color: '#8b5cf6', 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    background: 'rgba(139, 92, 246, 0.1)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    display: 'inline-block'
                  }}>
                    {userData?.role?.toUpperCase() || 'SUPER ADMIN'}
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(30, 41, 59, 0.3)',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.05)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f59e0b'
                }}>
                  <Calendar size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '500' }}>Last Login</div>
                  <div style={{ color: 'white', fontSize: '1rem', fontWeight: '500' }}>
                    {userData?.timestamp ? new Date(userData.timestamp).toLocaleString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Security */}
        <div style={{ width: '340px', minWidth: '300px' }}>
          {/* Quick Actions */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.08)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(12px)'
          }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Key size={20} />
              Quick Actions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button style={{
                padding: '1rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                borderRadius: '12px',
                color: '#0ea5e9',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease',
                justifyContent: 'flex-start'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.2)';
              }}>
                <Lock size={18} />
                Change Password
              </button>
              
              <button style={{
                padding: '1rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                color: '#10b981',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease',
                justifyContent: 'flex-start'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
              }}>
                <Bell size={18} />
                Notification Settings
              </button>
            </div>
          </div>

          {/* Security Status */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.08)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(12px)'
          }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Shield size={20} />
              Security Status
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: 'rgba(30, 41, 59, 0.3)',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444'
                  }}>
                    <Smartphone size={18} />
                  </div>
                  <span style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '500' }}>2FA Status</span>
                </div>
                <span style={{ 
                  color: '#ef4444', 
                  fontSize: '0.85rem', 
                  fontWeight: '600',
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px'
                }}>
                  Disabled
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: 'rgba(30, 41, 59, 0.3)',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b'
                  }}>
                    <Calendar size={18} />
                  </div>
                  <span style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '500' }}>Password Age</span>
                </div>
                <span style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: '500' }}>30 days</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: 'rgba(30, 41, 59, 0.3)',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981'
                  }}>
                    <CheckCircle size={18} />
                  </div>
                  <span style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '500' }}>Active Sessions</span>
                </div>
                <span style={{ 
                  color: '#10b981', 
                  fontSize: '0.85rem', 
                  fontWeight: '600',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px'
                }}>
                  1 Device
                </span>
              </div>
            </div>

            <div style={{ 
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                flexShrink: 0
              }}>
                ⚠️
              </div>
              <div>
                <div style={{ 
                  color: '#fca5a5', 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>
                  Security Recommendation
                </div>
                <div style={{ 
                  color: '#fca5a5', 
                  fontSize: '0.85rem',
                  opacity: 0.9
                }}>
                  Enable Two-Factor Authentication for enhanced security
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}