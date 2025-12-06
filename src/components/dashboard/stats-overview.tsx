// components/dashboard/sync-monitor.tsx
'use client';

import { FiRefreshCw, FiCheck, FiAlertCircle, FiClock, FiPlay, FiPause } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useState } from 'react';

const syncSessions = [
  { id: 1, device: 'Main Pump Station', status: 'success', time: '2 mins ago', duration: '45s' },
  { id: 2, device: 'Water Tank #1', status: 'success', time: '5 mins ago', duration: '32s' },
  { id: 3, device: 'Filter System', status: 'warning', time: '12 mins ago', duration: '1m 20s' },
  { id: 4, device: 'Pressure Sensor', status: 'error', time: '25 mins ago', duration: '15s' },
  { id: 5, device: 'Backup Pump', status: 'success', time: '1 hour ago', duration: '28s' },
];

export default function SyncMonitor() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const startSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-emerald-400 bg-emerald-400/10';
      case 'warning': return 'text-amber-400 bg-amber-400/10';
      case 'error': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <FiCheck className="w-4 h-4" />;
      case 'warning': return <FiAlertCircle className="w-4 h-4" />;
      case 'error': return <FiAlertCircle className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center">
            <FiRefreshCw className="w-5 h-5 mr-2 text-cyan-400" />
            Sync Monitor
          </h2>
          <p className="text-gray-400 text-sm mt-1">Real-time device synchronization status</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startSync}
          disabled={isSyncing}
          className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all ${
            isSyncing 
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
          }`}
        >
          {isSyncing ? (
            <>
              <FiPause className="w-4 h-4" />
              <span>Syncing... {syncProgress}%</span>
            </>
          ) : (
            <>
              <FiPlay className="w-4 h-4" />
              <span>Start Sync</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Progress Bar */}
      {isSyncing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6"
        >
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Sync Progress</span>
            <span>{syncProgress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${syncProgress}%` }}
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            />
          </div>
        </motion.div>
      )}

      {/* Sync Sessions */}
      <div className="space-y-3">
        {syncSessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ x: 5 }}
            className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${getStatusColor(session.status)}`}>
                {getStatusIcon(session.status)}
              </div>
              <div>
                <p className="font-medium text-white">{session.device}</p>
                <p className="text-sm text-gray-400 flex items-center">
                  <FiClock className="w-3 h-3 mr-1" />
                  {session.time}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-sm px-3 py-1 rounded-full ${getStatusColor(session.status)}`}>
                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
              </div>
              <p className="text-xs text-gray-400 mt-1">Duration: {session.duration}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="mt-6 pt-6 border-t border-gray-700/50">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">98.7%</p>
            <p className="text-xs text-gray-400">Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">24/7</p>
            <p className="text-xs text-gray-400">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">2.4s</p>
            <p className="text-xs text-gray-400">Avg. Response</p>
          </div>
        </div>
      </div>
    </div>
  );
}