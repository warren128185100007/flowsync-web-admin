// components/dashboard/Dashboard.tsx
'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    mainContent: {
      flex: 1,
      marginLeft: isSidebarOpen ? '280px' : '0',
      transition: 'margin-left 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div style={styles.mainContent}>
        <div style={{
          padding: '30px',
          minHeight: '100vh',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px'
          }}>
            <div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px'
              }}>
                FlowSync Dashboard
              </h1>
              <p style={{ color: '#666', fontSize: '16px' }}>
                Real-time water management system monitoring
              </p>
            </div>
            
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isSidebarOpen ? '◀ Hide Menu' : '▶ Show Menu'}
            </button>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px',
            marginBottom: '40px'
          }}>
            <StatCard 
              title="Current Flow Rate"
              value="18.5 L/min"
              icon="📈"
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            />
            <StatCard 
              title="Detected Leaks Today"
              value="3"
              icon="⚠️"
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
            <StatCard 
              title="Valve Status"
              value="Open"
              icon="🔄"
              gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            />
            <StatCard 
              title="System Health"
              value="Connected"
              icon="✅"
              gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            />
          </div>

          {/* Charts Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '30px',
            marginBottom: '40px'
          }}>
            {/* Flow Rate Chart */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#333'
                }}>
                  Flow Rate
                </h2>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Last 24 Hours
                </div>
              </div>
              
              {/* Chart */}
              <div style={{
                height: '250px',
                position: 'relative',
                padding: '20px 0'
              }}>
                {/* Y-axis labels */}
                <div style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  bottom: '0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: '#666',
                  fontSize: '12px',
                  width: '30px'
                }}>
                  <span>50 L/min</span>
                  <span>40 L/min</span>
                  <span>30 L/min</span>
                  <span>20 L/min</span>
                  <span>10 L/min</span>
                  <span>0 L/min</span>
                </div>
                
                {/* Chart bars */}
                <div style={{
                  position: 'absolute',
                  left: '40px',
                  right: '0',
                  bottom: '0',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px'
                }}>
                  {[
                    { time: '03:00', value: 18 },
                    { time: '06:00', value: 22 },
                    { time: '09:00', value: 35 },
                    { time: '12:00', value: 45 },
                    { time: '15:00', value: 32 },
                    { time: '18:00', value: 25 },
                    { time: '21:00', value: 19 }
                  ].map((point, index) => (
                    <div key={index} style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{
                        width: '100%',
                        height: `${point.value * 4}px`,
                        background: 'linear-gradient(to top, #4facfe, #00f2fe)',
                        borderRadius: '8px 8px 0 0',
                        position: 'relative',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-25px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#333',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          display: 'none'
                        }}>
                          {point.value} L/min
                        </div>
                      </div>
                      <span style={{ fontSize: '12px', color: '#666' }}>{point.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Latest Alerts */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#333'
                }}>
                  Latest Alerts
                </h2>
                <div style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  3
                </div>
              </div>
              
              {/* Alerts Table */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '15px',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.1)'
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 2fr 1fr',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 20%)',
                  color: 'white',
                  padding: '15px 20px',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  <div>Timestamp</div>
                  <div>Severity</div>
                  <div>Message</div>
                  <div>Status</div>
                </div>
                
                {/* Table Rows */}
                <div style={{ padding: '10px' }}>
                  {[
                    { time: '10:23', severity: 'High', message: 'Abnormal flow detected', status: 'Resolved' },
                    { time: '09:45', severity: 'Medium', message: 'Pressure fluctuation', status: 'Active' },
                    { time: '08:12', severity: 'Low', message: 'Minor leak detected', status: 'Resolved' }
                  ].map((alert, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 2fr 1fr',
                        padding: '15px 20px',
                        borderBottom: index < 2 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                        fontSize: '14px',
                        color: '#333'
                      }}
                    >
                      <div>{alert.time}</div>
                      <div>
                        <span style={{
                          background: alert.severity === 'High' 
                            ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                            : alert.severity === 'Medium'
                            ? 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)'
                            : 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
                          color: alert.severity === 'High' ? 'white' : '#333',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {alert.severity}
                        </span>
                      </div>
                      <div>{alert.message}</div>
                      <div>
                        <span style={{
                          background: alert.status === 'Resolved' 
                            ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                            : 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#333',
              marginBottom: '25px'
            }}>
              System Status
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              {[
                { label: 'Uptime', value: '99.8%', icon: '🕒' },
                { label: 'Response Time', value: '2.1ms', icon: '⚡' },
                { label: 'Active Devices', value: '8/10', icon: '📱' },
                { label: 'Data Accuracy', value: '98.5%', icon: '🎯' }
              ].map((item, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '15px',
                  padding: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    fontSize: '32px',
                    marginBottom: '10px'
                  }}>
                    {item.icon}
                  </div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '5px'
                  }}>
                    {item.value}
                  </div>
                  <div style={{
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ title, value, icon, gradient }: any) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
      borderRadius: '20px',
      padding: '25px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background gradient accent */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '80px',
        height: '80px',
        background: gradient,
        borderRadius: '0 20px 0 80px',
        opacity: '0.1'
      }} />
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '15px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '15px',
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px'
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '5px',
            fontWeight: '600'
          }}>
            {title}
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '800',
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {value}
          </p>
        </div>
      </div>
      
      <div style={{
        fontSize: '12px',
        color: '#888',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: gradient
        }} />
        Real-time monitoring • Updated just now
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({ isOpen, toggleSidebar }: any) {
  if (!isOpen) return null;

  const menuItems = [
    { icon: '📊', label: 'Dashboard' },
    { icon: '💧', label: 'Water Readings' },
    { icon: '⚠️', label: 'Leak Alerts' },
    { icon: '🔄', label: 'Valve Control' },
    { icon: '📱', label: 'Devices' },
    { icon: '👥', label: 'Users' },
    { icon: '⚙️', label: 'Settings' },
    { icon: '🚪', label: 'Logout' }
  ];

  return (
    <div style={{
      position: 'fixed',
      left: '0',
      top: '0',
      height: '100vh',
      width: '280px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
      backdropFilter: 'blur(10px)',
      boxShadow: '5px 0 30px rgba(0,0,0,0.1)',
      zIndex: 1000,
      padding: '30px 0'
    }}>
      {/* Logo */}
      <div style={{
        padding: '0 30px 30px',
        borderBottom: '2px solid rgba(102, 126, 234, 0.2)',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '15px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white'
          }}>
            💧
          </div>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '5px'
            }}>
              FlowSync
            </h1>
            <p style={{
              fontSize: '12px',
              color: '#888',
              letterSpacing: '1px'
            }}>
              WATER MANAGEMENT
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav style={{ padding: '0 20px' }}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '18px 20px',
              marginBottom: '8px',
              background: index === 0 
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                : 'transparent',
              border: 'none',
              borderRadius: '15px',
              color: index === 0 ? '#667eea' : '#666',
              fontSize: '16px',
              fontWeight: index === 0 ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (index !== 0) {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)';
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.transform = 'translateX(5px)';
              }
            }}
            onMouseLeave={(e) => {
              if (index !== 0) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#666';
                e.currentTarget.style.transform = 'translateX(0)';
              }
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span>{item.label}</span>
            {index === 0 && (
              <div style={{
                marginLeft: 'auto',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                animation: 'pulse 2s infinite'
              }} />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        right: '30px',
        paddingTop: '20px',
        borderTop: '2px solid rgba(102, 126, 234, 0.1)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#667eea',
            fontWeight: '600',
            marginBottom: '5px'
          }}>
            SYSTEM ACTIVE
          </div>
          <div style={{
            fontSize: '10px',
            color: '#888'
          }}>
            Last updated: Just now
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}