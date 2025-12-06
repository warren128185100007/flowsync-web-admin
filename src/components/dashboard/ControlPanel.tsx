// src/components/dashboard/ControlPanel.tsx
'use client';

import { Power, Volume2, Zap, Shield, Wifi, Battery } from 'lucide-react';
import { useState } from 'react';

export default function ControlPanel() {
  const [powerOn, setPowerOn] = useState(true);
  const [autoMode, setAutoMode] = useState(true);
  const [waterPressure, setWaterPressure] = useState(75);
  const [flowRate, setFlowRate] = useState(45);

  return (
    <div style={{ 
      background: 'rgba(30, 41, 59, 0.7)', 
      borderRadius: '16px', 
      padding: '24px',
      marginBottom: '30px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#e2e8f0', 
          margin: 0 
        }}>
          System Control Panel
        </h2>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px' 
        }}>
          <Wifi size={16} color="#10b981" />
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Connected</span>
        </div>
      </div>

      {/* Power Control */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Power size={20} color="#0ea5e9" />
            <span style={{ color: '#e2e8f0', fontWeight: '600' }}>Main Power</span>
          </div>
          <button
            onClick={() => setPowerOn(!powerOn)}
            style={{
              width: '48px',
              height: '24px',
              borderRadius: '12px',
              background: powerOn ? '#10b981' : '#64748b',
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
              transform: powerOn ? 'translateX(24px)' : 'translateX(0)',
              transition: 'transform 0.2s'
            }} />
          </button>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="#f59e0b" />
            <span style={{ color: '#e2e8f0', fontWeight: '600' }}>Auto Mode</span>
          </div>
          <button
            onClick={() => setAutoMode(!autoMode)}
            style={{
              width: '48px',
              height: '24px',
              borderRadius: '12px',
              background: autoMode ? '#10b981' : '#64748b',
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
              transform: autoMode ? 'translateX(24px)' : 'translateX(0)',
              transition: 'transform 0.2s'
            }} />
          </button>
        </div>
      </div>

      {/* Water Pressure Control */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Volume2 size={20} color="#0ea5e9" />
            <span style={{ color: '#e2e8f0', fontWeight: '600' }}>Water Pressure</span>
          </div>
          <span style={{ color: '#e2e8f0', fontWeight: '700' }}>{waterPressure}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={waterPressure}
          onChange={(e) => setWaterPressure(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'linear-gradient(90deg, #0ea5e9 0%, #0ea5e9 75%, #334155 75%)',
            WebkitAppearance: 'none',
            outline: 'none'
          }}
        />
      </div>

      {/* Flow Rate Control */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} color="#f59e0b" />
            <span style={{ color: '#e2e8f0', fontWeight: '600' }}>Flow Rate</span>
          </div>
          <span style={{ color: '#e2e8f0', fontWeight: '700' }}>{flowRate} L/min</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={flowRate}
          onChange={(e) => setFlowRate(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'linear-gradient(90deg, #f59e0b 0%, #f59e0b 45%, #334155 45%)',
            WebkitAppearance: 'none',
            outline: 'none'
          }}
        />
      </div>

      {/* System Status */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.5)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Battery size={24} color="#10b981" />
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>System Battery</div>
            <div style={{ color: '#e2e8f0', fontWeight: '700' }}>87%</div>
          </div>
        </div>
        <div style={{ 
          padding: '8px 16px', 
          background: 'rgba(16, 185, 129, 0.1)', 
          color: '#10b981',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          Optimal
        </div>
      </div>
    </div>
  );
}