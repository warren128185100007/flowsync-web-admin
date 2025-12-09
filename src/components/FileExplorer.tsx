// app/components/layout/FileExplorer.tsx - Updated to match your theme
'use client';

import { useState } from 'react';
import { FiFolder, FiFile, FiChevronRight, FiChevronDown } from 'react-icons/fi';

interface FileItem {
  name: string;
  type: 'folder' | 'file';
  status?: 'M' | 'U' | '4,U';
  children?: FileItem[];
  isOpen?: boolean;
}

export default function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      name: 'FLOWSYNC_WEB_ADMIN',
      type: 'folder',
      isOpen: true,
      children: [
        { name: '.next', type: 'folder' },
        { name: 'components', type: 'folder' },
        { name: 'node_modules', type: 'folder' },
        { name: 'public', type: 'folder' },
        { name: 'src', type: 'folder' },
        { name: 'app', type: 'folder' },
        { name: 'favicon.ico', type: 'file' },
      ]
    },
    { name: 'globals.css', type: 'file', status: 'M' },
    { name: 'layout.tax', type: 'file', status: 'M' },
    { name: 'page.tax', type: 'file', status: 'M' },
    { name: 'page.tax.backup', type: 'file', status: 'U' },
    {
      name: 'components\\dashboard',
      type: 'folder',
      status: '4,U',
      children: [
        { name: 'sidebar.tax', type: 'file' },
        { name: 'stats-overview.tax', type: 'file', status: 'U' },
        { name: 'sync-monitor.tax', type: 'file', status: 'U' },
        { name: 'top-bar.tax', type: 'file', status: 'U' },
      ]
    },
    { name: 'lib', type: 'folder' },
    { name: '.gitignore', type: 'file' },
    { name: 'next-env.d.ts', type: 'file' },
    { name: 'next.config.ts', type: 'file' },
    { name: 'package-lock.json', type: 'file', status: 'M' },
    { name: 'package.json', type: 'file', status: 'M' },
    { name: 'postcss.config.mjs.backup', type: 'file', status: 'U' },
    { name: 'README.md', type: 'file' },
    { name: 'tsconfig.json', type: 'file' },
  ]);

  const [activeTab, setActiveTab] = useState<'SEARCH' | 'OUTLINE' | 'TIMELINE'>('SEARCH');

  const toggleFolder = (name: string) => {
    setFiles(prev => 
      prev.map(item => 
        item.name === name 
          ? { ...item, isOpen: !item.isOpen }
          : item
      )
    );
  };

  const FileIcon = ({ type }: { type: 'folder' | 'file' }) => {
    return type === 'folder' ? <FiFolder className="text-blue-400" /> : <FiFile className="text-gray-400" />;
  };

  const StatusBadge = ({ status }: { status?: string }) => {
    if (!status) return null;
    
    const colors: Record<string, { text: string; bg: string }> = {
      'M': { text: '#f59e0b', bg: '#fef3c7' },
      'U': { text: '#10b981', bg: '#dcfce7' },
      '4,U': { text: '#f97316', bg: '#ffedd5' }
    };

    const color = colors[status] || { text: '#9ca3af', bg: '#f3f4f6' };

    return (
      <span style={{
        fontSize: '11px',
        padding: '2px 6px',
        borderRadius: '4px',
        color: color.text,
        backgroundColor: color.bg,
        fontWeight: '500'
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{
      width: '280px',
      height: '100vh',
      backgroundColor: '#1e293b', // Matching your sidebar color
      color: '#e2e8f0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #334155',
      position: 'fixed',
      right: 0,
      top: 0,
      zIndex: 900
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        fontWeight: '600',
        fontSize: '13px',
        textTransform: 'uppercase',
        borderBottom: '1px solid #334155',
        color: '#94a3b8',
        backgroundColor: '#0f172a'
      }}>
        EXPLORER
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #334155',
        backgroundColor: '#0f172a'
      }}>
        {(['SEARCH', 'OUTLINE', 'TIMELINE'] as const).map((tab) => {
          const isActive = activeTab === tab;
          const [isHovered, setIsHovered] = useState(false);
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '12px',
                cursor: 'pointer',
                backgroundColor: isActive ? '#334155' : isHovered ? '#1e293b' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                border: 'none',
                outline: 'none',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s ease'
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div style={{
        flex: 1,
        padding: '8px 0',
        overflowY: 'auto'
      }}>
        {activeTab === 'SEARCH' && (
          <div style={{ padding: '12px 16px' }}>
            <div style={{
              marginBottom: '12px',
              fontSize: '11px',
              color: '#94a3b8',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              Open Editors
            </div>
            {files
              .filter(item => item.type === 'file')
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    marginBottom: '2px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiFile size={14} color="#94a3b8" />
                  <span>{item.name}</span>
                  {item.status && <StatusBadge status={item.status} />}
                </div>
              ))}
          </div>
        )}

        {activeTab === 'OUTLINE' && (
          <div style={{ padding: '12px 16px' }}>
            <div style={{
              marginBottom: '12px',
              fontSize: '11px',
              color: '#94a3b8',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              Project Structure
            </div>
            
            {/* File Tree */}
            {files.map((item, index) => (
              <div key={index}>
                <div
                  onClick={() => item.type === 'folder' && toggleFolder(item.name)}
                  style={{
                    padding: '4px 12px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: item.type === 'folder' ? 'pointer' : 'default',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {item.type === 'folder' && (
                    item.isOpen 
                      ? <FiChevronDown size={12} color="#94a3b8" /> 
                      : <FiChevronRight size={12} color="#94a3b8" />
                  )}
                  {item.type === 'folder' ? 
                    <FiFolder size={14} color="#60a5fa" /> : 
                    <FiFile size={14} color="#94a3b8" />
                  }
                  <span>{item.name}</span>
                  {item.status && <div style={{ marginLeft: 'auto' }}><StatusBadge status={item.status} /></div>}
                </div>

                {/* Children (if folder is open) */}
                {item.type === 'folder' && item.isOpen && item.children && (
                  <div style={{ marginLeft: '20px' }}>
                    {item.children.map((child, childIndex) => (
                      <div
                        key={childIndex}
                        style={{
                          padding: '4px 12px 4px 24px',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {child.type === 'folder' ? 
                          <FiFolder size={14} color="#60a5fa" /> : 
                          <FiFile size={14} color="#94a3b8" />
                        }
                        <span>{child.name}</span>
                        {child.status && <div style={{ marginLeft: 'auto' }}><StatusBadge status={child.status} /></div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'TIMELINE' && (
          <div style={{ padding: '12px 16px' }}>
            <div style={{
              marginBottom: '12px',
              fontSize: '11px',
              color: '#94a3b8',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              Recent Changes
            </div>
            <div style={{
              fontSize: '13px',
              color: '#cbd5e1',
              lineHeight: '1.5'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ color: '#60a5fa', fontWeight: '500' }}>Today</div>
                <div style={{ paddingLeft: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusBadge status="M" />
                    <span>Modified layout.tsx</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <StatusBadge status="U" />
                    <span>Added FileExplorer component</span>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ color: '#60a5fa', fontWeight: '500' }}>Yesterday</div>
                <div style={{ paddingLeft: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusBadge status="4,U" />
                    <span>Updated dashboard components</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}