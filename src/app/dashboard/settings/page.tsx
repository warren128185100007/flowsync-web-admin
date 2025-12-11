// src/app/dashboard/settings/page.tsx
'use client';

import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw,
  Bell,
  Shield,
  Database,
  Network,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  Trash
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // General
    siteName: 'FlowSync Admin',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    
    // Security
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    ipWhitelist: ['192.168.1.0/24'],
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    alertThreshold: 'medium',
    digestFrequency: 'daily',
    
    // System
    backupFrequency: 'daily',
    autoUpdate: true,
    maintenanceMode: false,
    debugMode: false,
    
    // API
    apiRateLimit: 100,
    apiKeys: ['••••••••••••'],
    webhookUrl: 'https://api.example.com/webhook'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSaveSettings = () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
      
      // Reset success status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }, 1500);
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        siteName: 'FlowSync Admin',
        timezone: 'UTC',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        twoFactorAuth: true,
        sessionTimeout: 30,
        passwordPolicy: 'strong',
        ipWhitelist: ['192.168.1.0/24'],
        emailNotifications: true,
        pushNotifications: true,
        alertThreshold: 'medium',
        digestFrequency: 'daily',
        backupFrequency: 'daily',
        autoUpdate: true,
        maintenanceMode: false,
        debugMode: false,
        apiRateLimit: 100,
        apiKeys: ['••••••••••••'],
        webhookUrl: 'https://api.example.com/webhook'
      });
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <SettingsIcon size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'system', label: 'System', icon: <Database size={18} /> },
    { id: 'api', label: 'API', icon: <Network size={18} /> }
  ];

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
          System Settings
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Configure and customize your system preferences
        </p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        paddingBottom: '1rem'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              background: activeTab === tab.id ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #0ea5e9' : '2px solid transparent',
              color: activeTab === tab.id ? '#0ea5e9' : '#94a3b8',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Form */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        {/* General Settings */}
        {activeTab === 'general' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              General Settings
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500' }}>
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
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

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500' }}>
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
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
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="EST">EST (Eastern Standard Time)</option>
                  <option value="PST">PST (Pacific Standard Time)</option>
                  <option value="CET">CET (Central European Time)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500' }}>
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
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
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500' }}>
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
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
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              Security Settings
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                    Two-Factor Authentication
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                    Add an extra layer of security to your account
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                  style={{
                    padding: '8px 24px',
                    background: settings.twoFactorAuth ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                    border: `1px solid ${settings.twoFactorAuth ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`,
                    borderRadius: '8px',
                    color: settings.twoFactorAuth ? '#10b981' : '#94a3b8',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div>
                <div style={{ color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
                  Session Timeout (minutes)
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>5 min</span>
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{settings.sessionTimeout} min</span>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>120 min</span>
                </div>
              </div>

              <div>
                <div style={{ color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
                  IP Whitelist
                </div>
                <div style={{ 
                  padding: '12px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  fontSize: '14px',
                  minHeight: '100px'
                }}>
                  {settings.ipWhitelist.map((ip, index) => (
                    <div key={index} style={{ marginBottom: '4px' }}>{ip}</div>
                  ))}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>
                  Enter IP addresses or ranges (CIDR notation) separated by commas
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              Notification Settings
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                    Email Notifications
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                    Receive system alerts via email
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                  style={{
                    padding: '8px 24px',
                    background: settings.emailNotifications ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                    border: `1px solid ${settings.emailNotifications ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`,
                    borderRadius: '8px',
                    color: settings.emailNotifications ? '#10b981' : '#94a3b8',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                    Push Notifications
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                    Receive real-time push notifications
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
                  style={{
                    padding: '8px 24px',
                    background: settings.pushNotifications ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                    border: `1px solid ${settings.pushNotifications ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`,
                    borderRadius: '8px',
                    color: settings.pushNotifications ? '#10b981' : '#94a3b8',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {settings.pushNotifications ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div>
                <div style={{ color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
                  Alert Threshold
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['low', 'medium', 'high'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSettings({ ...settings, alertThreshold: level })}
                      style={{
                        padding: '10px 20px',
                        background: settings.alertThreshold === level ? 
                                 (level === 'low' ? 'rgba(16, 185, 129, 0.2)' : 
                                  level === 'medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)') : 
                                 'rgba(30, 41, 59, 0.8)',
                        border: `1px solid ${settings.alertThreshold === level ? 
                                (level === 'low' ? 'rgba(16, 185, 129, 0.5)' : 
                                 level === 'medium' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(239, 68, 68, 0.5)') : 
                                'rgba(148, 163, 184, 0.3)'}`,
                        borderRadius: '8px',
                        color: settings.alertThreshold === level ? 
                               (level === 'low' ? '#10b981' : 
                                level === 'medium' ? '#f59e0b' : '#ef4444') : '#94a3b8',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              System Settings
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                    Automatic Updates
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                    Automatically install security updates
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, autoUpdate: !settings.autoUpdate })}
                  style={{
                    padding: '8px 24px',
                    background: settings.autoUpdate ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                    border: `1px solid ${settings.autoUpdate ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`,
                    borderRadius: '8px',
                    color: settings.autoUpdate ? '#10b981' : '#94a3b8',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {settings.autoUpdate ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                    Maintenance Mode
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                    Temporarily disable public access
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                  style={{
                    padding: '8px 24px',
                    background: settings.maintenanceMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                    border: `1px solid ${settings.maintenanceMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`,
                    borderRadius: '8px',
                    color: settings.maintenanceMode ? '#ef4444' : '#94a3b8',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {settings.maintenanceMode ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div>
                <div style={{ color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
                  Backup Frequency
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['hourly', 'daily', 'weekly', 'monthly'].map((frequency) => (
                    <button
                      key={frequency}
                      onClick={() => setSettings({ ...settings, backupFrequency: frequency })}
                      style={{
                        padding: '10px 20px',
                        background: settings.backupFrequency === frequency ? 'rgba(14, 165, 233, 0.2)' : 'rgba(30, 41, 59, 0.8)',
                        border: `1px solid ${settings.backupFrequency === frequency ? 'rgba(14, 165, 233, 0.5)' : 'rgba(148, 163, 184, 0.3)'}`,
                        borderRadius: '8px',
                        color: settings.backupFrequency === frequency ? '#0ea5e9' : '#94a3b8',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {frequency}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Settings */}
        {activeTab === 'api' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              API Settings
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500' }}>
                  API Rate Limit (requests/minute)
                </label>
                <input
                  type="number"
                  value={settings.apiRateLimit}
                  onChange={(e) => setSettings({ ...settings, apiRateLimit: parseInt(e.target.value) })}
                  min="10"
                  max="1000"
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

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500' }}>
                  Webhook URL
                </label>
                <input
                  type="text"
                  value={settings.webhookUrl}
                  onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
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

              <div>
                <div style={{ color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
                  API Keys
                </div>
                <div style={{ 
                  padding: '12px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}>
                  {settings.apiKeys.map((key, index) => (
                    <div key={index} style={{ marginBottom: '4px' }}>{key}</div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '12px' }}>
                  <button style={{
                    padding: '10px 20px',
                    background: 'rgba(14, 165, 233, 0.1)',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                    borderRadius: '8px',
                    color: '#0ea5e9',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Globe size={16} />
                    Generate New Key
                  </button>
                  <button style={{
                    padding: '10px 20px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Trash size={16} />
                    Revoke All Keys
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {saveStatus === 'success' && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '10px 16px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              color: '#10b981',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <CheckCircle size={16} />
              Settings saved successfully!
            </div>
          )}
          
          {saveStatus === 'error' && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '10px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <AlertTriangle size={16} />
              Failed to save settings
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleResetSettings}
            style={{
              padding: '12px 24px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '10px',
              color: '#cbd5e1',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={16} />
            Reset to Default
          </button>
          
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            style={{
              padding: '12px 32px',
              background: isSaving ? 'rgba(14, 165, 233, 0.3)' : 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            {isSaving ? (
              <>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid rgba(255, 255, 255, 0.3)', 
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
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

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}