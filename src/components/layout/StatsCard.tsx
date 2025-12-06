// src/components/layout/StatsCard.tsx - Enhanced version
'use client';

import { ReactNode } from 'react';

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
  iconColor = '#0ea5e9',
  iconBgColor = 'rgba(14, 165, 233, 0.1)',
  trend = 'neutral'
}: StatsCardProps) {
  const trendColors = {
    positive: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', icon: '↑' },
    negative: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', icon: '↓' },
    neutral: { bg: 'rgba(148, 163, 184, 0.1)', text: '#94a3b8', icon: '' }
  };

  const trendConfig = trendColors[trend];

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.7)',
      borderRadius: '16px',
      padding: '24px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      height: '100%'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        marginBottom: '12px' 
      }}>
        {icon && (
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
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
            color: '#94a3b8', 
            margin: '0 0 4px 0',
            fontWeight: '500'
          }}>
            {title}
          </h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: '800', 
            color: iconColor, 
            margin: 0 
          }}>
            {value}
          </p>
        </div>
      </div>
      {subtitle && (
        <div style={{
          fontSize: '12px',
          color: trendConfig.text,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: '600'
        }}>
          {trendConfig.icon} {subtitle}
        </div>
      )}
    </div>
  );
}