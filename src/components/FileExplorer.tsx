// components/FileExplorer.tsx
import { useState } from 'react';
import { 
  FiFolder, 
  FiFile, 
  FiChevronRight, 
  FiChevronDown,
  FiSearch,
  FiList,
  FiClock
} from 'react-icons/fi';

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
    
    const colors: Record<string, string> = {
      'M': 'text-yellow-400 bg-yellow-400/10',
      'U': 'text-green-400 bg-green-400/10',
      '4,U': 'text-orange-400 bg-orange-400/10'
    };

    return (
      <span className={`text-xs px-1.5 py-0.5 rounded ${colors[status] || 'text-gray-400'}`}>
        {status}
      </span>
    );
  };

  return (
    <div style={{
      width: '300px',
      height: '100vh',
      backgroundColor: '#1e1e1e',
      color: '#cccccc',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #333'
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 12px',
        fontWeight: 'bold',
        fontSize: '11px',
        textTransform: 'uppercase',
        borderBottom: '1px solid #333',
        color: '#888'
      }}>
        EXPLORER
      </div>

      {/* File Tree */}
      <div style={{
        flex: 1,
        padding: '8px 0',
        overflowY: 'auto'
      }}>
        {files.map((item, index) => (
          <div key={index}>
            <div
              onClick={() => item.type === 'folder' && toggleFolder(item.name)}
              style={{
                padding: '2px 12px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2d2e'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {item.type === 'folder' && (
                  item.isOpen 
                    ? <FiChevronDown size={12} /> 
                    : <FiChevronRight size={12} />
                )}
                <FileIcon type={item.type} />
                <span>{item.name}</span>
              </div>
              <StatusBadge status={item.status} />
            </div>

            {/* Children (if folder is open) */}
            {item.type === 'folder' && item.isOpen && item.children && (
              <div style={{ marginLeft: '20px' }}>
                {item.children.map((child, childIndex) => (
                  <div
                    key={childIndex}
                    style={{
                      padding: '2px 12px 2px 24px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2d2e'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileIcon type={child.type} />
                      <span>{child.name}</span>
                    </div>
                    <StatusBadge status={child.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderTop: '1px solid #333'
      }}>
        {(['SEARCH', 'OUTLINE', 'TIMELINE'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '11px',
              cursor: 'pointer',
              backgroundColor: activeTab === tab ? '#2a2d2e' : 'transparent',
              color: activeTab === tab ? '#fff' : '#888',
              border: 'none',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab) e.currentTarget.style.backgroundColor = '#252525';
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}