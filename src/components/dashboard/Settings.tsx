// src/components/dashboard/Settings.tsx
'use client';

import { Bell, Shield, Globe, Database, Key, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    autoReports: true,
    twoFactorAuth: false,
    dataRetention: '30',
    language: 'en',
    theme: 'dark'
  });

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingGroups = [
    {
      title: 'Notifications',
      icon: <Bell size={20} />,
      settings: [
        {
          label: 'Email Notifications',
          description: 'Receive alerts and reports via email',
          value: settings.notifications,
          onChange: (val: boolean) => handleSettingChange('notifications', val)
        },
        {
          label: 'Auto-generated Reports',
          description: 'Weekly and monthly usage reports',
          value: settings.autoReports,
          onChange: (val: boolean) => handleSettingChange('autoReports', val)
        }
      ]
    },
    {
      title: 'Security',
      icon: <Shield size={20} />,
      settings: [
        {
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          value: settings.twoFactorAuth,
          onChange: (val: boolean) => handleSettingChange('twoFactorAuth', val)
        }
      ]
    },
    {
      title: 'Data & Privacy',
      icon: <Database size={20} />,
      settings: [
        {
          label: 'Data Retention Period',
          description: 'How long to keep historical data',
          value: settings.dataRetention,
          options: ['7', '30', '90', '365'],
          onChange: (val: string) => handleSettingChange('dataRetention', val)
        }
      ]
    },
    {
      title: 'General',
      icon: <Globe size={20} />,
      settings: [
        {
          label: 'Language',
          description: 'Interface language',
          value: settings.language,
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' }
          ],
          onChange: (val: string) => handleSettingChange('language', val)
        },
        {
          label: 'Theme',
          description: 'Interface appearance',
          value: settings.theme,
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto' }
          ],
          onChange: (val: string) => handleSettingChange('theme', val)
        }
      ]
    }
  ];

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
        marginBottom: '32px' 
      }}>
        <div>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#e2e8f0', 
            margin: '0 0 4px 0' 
          }}>
            System Settings
          </h2>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            Configure your dashboard preferences and security
          </div>
        </div>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: 'rgba(14, 165, 233, 0.1)',
          color: '#0ea5e9',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          <RefreshCw size={18} />
          Reset to Default
        </button>
      </div>

      {/* Settings Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {settingGroups.map((group, groupIndex) => (
          <div key={groupIndex} style={{
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ color: '#0ea5e9' }}>
                {group.icon}
              </div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                color: '#e2e8f0', 
                margin: 0 
              }}>
                {group.title}
              </h3>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {group.settings.map((setting, settingIndex) => (
                <div key={settingIndex} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#e2e8f0',
                      marginBottom: '4px'
                    }}>
                      {setting.label}
                    </div>
                    <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                      {setting.description}
                    </div>
                  </div>
                  
                  {setting.options ? (
                    <select
                      value={setting.value}
                      onChange={(e) => setting.onChange(e.target.value)}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid rgba(71, 85, 105, 0.5)',
                        borderRadius: '8px',
                        color: '#e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                        minWidth: '120px'
                      }}
                    >
                      {setting.options.map((option: any) => (
                        <option 
                          key={typeof option === 'object' ? option.value : option} 
                          value={typeof option === 'object' ? option.value : option}
                        >
                          {typeof option === 'object' ? option.label : option} days
                        </option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => setting.onChange(!setting.value)}
                      style={{
                        width: '48px',
                        height: '24px',
                        borderRadius: '12px',
                        background: setting.value ? '#10b981' : '#64748b',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        padding: '2px'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'white',
                        transform: setting.value ? 'translateX(24px)' : 'translateX(0)',
                        transition: 'transform 0.2s'
                      }} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div style={{ 
        marginTop: '32px',
        background: 'rgba(239, 68, 68, 0.05)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '16px'
        }}>
          <Key size={20} color="#ef4444" />
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#ef4444', 
            margin: 0 
          }}>
            Danger Zone
          </h3>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#e2e8f0' }}>
              Delete All Data
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>
              Permanently remove all usage data and settings
            </div>
          </div>
          <button style={{
            padding: '10px 24px',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            Delete All Data
          </button>
        </div>
      </div>
    </div>
  );
}