// components/dashboard/sync-monitor.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PlayIcon,
  StopIcon,
  PauseIcon,
} from '@heroicons/react/24/outline'

interface SyncJob {
  id: string
  name: string
  status: 'running' | 'success' | 'failed' | 'paused'
  progress: number
  source: string
  destination: string
  lastSync: string
  records: number
}

export default function SyncMonitor() {
  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([
    {
      id: '1',
      name: 'Users Database Sync',
      status: 'running',
      progress: 75,
      source: 'MySQL',
      destination: 'MongoDB',
      lastSync: '2 min ago',
      records: 12500,
    },
    {
      id: '2',
      name: 'Product Catalog',
      status: 'success',
      progress: 100,
      source: 'Shopify',
      destination: 'BigCommerce',
      lastSync: '1 hour ago',
      records: 5400,
    },
    {
      id: '3',
      name: 'Analytics Data',
      status: 'failed',
      progress: 45,
      source: 'Google Analytics',
      destination: 'Snowflake',
      lastSync: '30 min ago',
      records: 8900,
    },
    {
      id: '4',
      name: 'Customer Data',
      status: 'paused',
      progress: 30,
      source: 'Salesforce',
      destination: 'HubSpot',
      lastSync: '15 min ago',
      records: 3200,
    },
  ])

  const getStatusIcon = (status: SyncJob['status']) => {
    switch (status) {
      case 'running':
        return <ArrowPathIcon className="w-5 h-5 text-blue-500 animate-spin" />
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      case 'paused':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: SyncJob['status']) => {
    switch (status) {
      case 'running': return 'bg-blue-500'
      case 'success': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      case 'paused': return 'bg-yellow-500'
    }
  }

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <PlayIcon className="w-4 h-4 mr-2" />
            Start All
          </button>
          <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <PauseIcon className="w-4 h-4 mr-2" />
            Pause All
          </button>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Last updated: Just now
        </div>
      </div>

      {/* Sync Jobs List */}
      <div className="space-y-3">
        {syncJobs.map((job) => (
          <div
            key={job.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(job.status)}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {job.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {job.source} → {job.destination}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)} text-white`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
                <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                  <PlayIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Progress: {job.progress}%</span>
                <span>{job.records.toLocaleString()} records</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getStatusColor(job.status)}`}
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Last sync: {job.lastSync}</span>
              <span>ID: {job.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {syncJobs.length} active sync jobs
        </div>
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
          View all syncs →
        </button>
      </div>
    </div>
  )
}