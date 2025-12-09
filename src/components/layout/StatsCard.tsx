// src/components/layout/StatsCard.tsx - FIXED
'use client';

import { ReactNode, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  iconColor?: string;
  iconBgColor?: string;
  trend?: 'positive' | 'negative' | 'neutral';
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = '#3b82f6',
  iconBgColor = '#eff6ff',
  trend = 'neutral'
}: StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const trendColors = {
    positive: { bg: '#dcfce7', text: '#16a34a', icon: '↑' },
    negative: { bg: '#fee2e2', text: '#dc2626', icon: '↓' },
    neutral: { bg: '#f3f4f6', text: '#6b7280', icon: '' }
  };

  const trendConfig = trendColors[trend];

  return (
    <div 
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        height: '100%',
        border: '1px solid #e5e7eb',
        boxShadow: isHovered 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          : '0 1px 3px rgba(0, 0, 0, 0.05)',
        transform: isHovered ? 'translateY(-2px)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        marginBottom: '12px' 
      }}>
        {icon && (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor
          }}>
            {icon}
          </div>
        )}
        <div>
          <h3 style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            margin: '0 0 8px 0',
            fontWeight: '500'
          }}>
            {title}
          </h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#111827', 
            margin: 0 
          }}>
            {value}
          </p>
        </div>
      </div>
      {subtitle && (
        <div style={{
          fontSize: '13px',
          color: trendConfig.text,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: '600',
          background: trendConfig.bg,
          padding: '4px 8px',
          borderRadius: '6px',
          width: 'fit-content'
        }}>
          {trendConfig.icon} {subtitle}
        </div>
      )}
    </div>
  );
}