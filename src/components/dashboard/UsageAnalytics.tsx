// src/components/dashboard/UsageAnalytics.tsx
'use client';

import { TrendingUp, Calendar, Download } from 'lucide-react';

export default function UsageAnalytics() {
  const weeklyData = [
    { day: 'Mon', usage: 1240, target: 1200 },
    { day: 'Tue', usage: 1560, target: 1200 },
    { day: 'Wed', usage: 980, target: 1200 },
    { day: 'Thu', usage: 1340, target: 1200 },
    { day: 'Fri', usage: 1670, target: 1200 },
    { day: 'Sat', usage: 2100, target: 2000 },
    { day: 'Sun', usage: 1800, target: 2000 },
  ];

  const monthlyStats = [
    { label: 'This Month', value: '12,540L', change: '+6%' },
    { label: 'Avg Daily', value: '418L', change: '-2%' },
    { label: 'Peak Usage', value: '2,100L', change: '+12%' },
    { label: 'Water Saved', value: '840L', change: '+8%' },
  ];

  return (
    <div style={{ 
      background: 'rgba(30, 41, 59, 0.7)', 
      borderRadius: '16px', 
      padding: '24px' 
    }}>
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
            Usage Analytics
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={14} color="#94a3b8" />
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>
              Last 7 days
            </span>
          </div>
        </div>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(14, 165, 233, 0.1)',
          color: '#0ea5e9',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Weekly Chart */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '16px' 
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
              Weekly Water Consumption
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <span style={{ 
                fontSize: '24px', 
                fontWeight: '800', 
                color: '#e2e8f0' 
              }}>
                10,590L
              </span>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2px',
                color: '#10b981',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                <TrendingUp size={16} />
                +8%
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          gap: '12px', 
          height: '200px',
          padding: '20px 0'
        }}>
          {weeklyData.map((item, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: '100%', 
                maxWidth: '40px',
                height: `${(item.usage / 2500) * 150}px`,
                background: item.usage > item.target ? 
                  'linear-gradient(to top, #ef4444, #f87171)' : 
                  'linear-gradient(to top, #0ea5e9, #38bdf8)',
                borderRadius: '8px 8px 0 0',
                marginBottom: '8px',
                position: 'relative'
              }}>
                {/* Target line */}
                <div style={{
                  position: 'absolute',
                  bottom: `${(item.target / 2500) * 150}px`,
                  left: '-4px',
                  right: '-4px',
                  height: '2px',
                  background: item.usage > item.target ? '#ef4444' : '#0ea5e9'
                }} />
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{item.day}</div>
              <div style={{ 
                fontSize: '11px', 
                color: '#e2e8f0',
                fontWeight: '600',
                marginTop: '4px'
              }}>
                {item.usage.toLocaleString()}L
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '16px' 
      }}>
        {monthlyStats.map((stat, index) => (
          <div key={index} style={{
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
              {stat.label}
            </div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: '800', 
              color: '#e2e8f0',
              marginBottom: '4px'
            }}>
              {stat.value}
            </div>
            <div style={{ 
              fontSize: '12px',
              color: stat.change.startsWith('+') ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              {stat.change.startsWith('+') ? '↑' : '↓'} {stat.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}