// src/components/dashboard/Dashboard.tsx
'use client';

import { Droplets, AlertTriangle, Cpu, Gauge } from 'lucide-react';
import { devices, alerts, zones, waterUsage } from '@/lib/mock-data';
import StatsCard from '@/components/layout/StatsCard';
import AlertPreview from './AlertPreview';   
import DeviceStatus from './DeviceStatus';   
import Zones from './Zones';   

export default function Dashboard() {
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const onlineDevices = devices.filter(d => d.status === 'online');

  return (
    <div>
      {/* Quick Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <StatsCard 
          title="Today's Usage" 
          value={waterUsage.today}
          subtitle="+90L"
          icon={<Droplets size={24} />}
          iconColor="#0ea5e9"
          iconBgColor="rgba(14, 165, 233, 0.1)"
          trend="negative"
        />
        
        <StatsCard 
          title="Active Alerts" 
          value={activeAlerts.length.toString()}
          subtitle="+2 today"
          icon={<AlertTriangle size={24} />}
          iconColor="#ef4444"
          iconBgColor="rgba(239, 68, 68, 0.1)"
          trend="negative"
        />
        
        <StatsCard 
          title="Online Devices" 
          value={onlineDevices.length.toString()}
          subtitle="All good"
          icon={<Cpu size={24} />}
          iconColor="#10b981"
          iconBgColor="rgba(16, 185, 129, 0.1)"
          trend="positive"
        />
        
        <StatsCard 
          title="Avg Pressure" 
          value="42 PSI"
          subtitle="-8 PSI"
          icon={<Gauge size={24} />}
          iconColor="#f59e0b"
          iconBgColor="rgba(245, 158, 11, 0.1)"
          trend="negative"
        />
      </div>

      {/* Alerts Preview */}
      <AlertPreview alerts={alerts.slice(0, 3)} />
      
      {/* Devices & Zones */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '30px',
        marginTop: '30px'
      }}>
        <DeviceStatus devices={devices.slice(0, 4)} />
        <Zones zones={zones} />  {/* FIXED: Changed from ZoneMonitoring to Zones */}
      </div>
    </div>
  );
}