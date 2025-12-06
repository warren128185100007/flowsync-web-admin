// components/dashboard/recent-activity.tsx
'use client';

import { FiCheck, FiAlertCircle, FiUserPlus, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';

const activities = [
  {
    id: 1,
    type: 'user',
    title: 'New User Registered',
    description: 'John Doe signed up for FlowSync',
    time: '2 minutes ago',
    icon: <FiUserPlus className="w-4 h-4" />,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    type: 'sync',
    title: 'Sync Completed',
    description: 'Device #123 synced successfully',
    time: '5 minutes ago',
    icon: <FiCheck className="w-4 h-4" />,
    color: 'bg-green-500'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Low Water Pressure',
    description: 'Alert detected in Zone B',
    time: '12 minutes ago',
    icon: <FiAlertCircle className="w-4 h-4" />,
    color: 'bg-amber-500'
  },
  {
    id: 4,
    type: 'sync',
    title: 'Manual Sync Initiated',
    description: 'Admin triggered manual sync',
    time: '25 minutes ago',
    icon: <FiRefreshCw className="w-4 h-4" />,
    color: 'bg-purple-500'
  },
  {
    id: 5,
    type: 'data',
    title: 'Data Export',
    description: 'Monthly report exported',
    time: '1 hour ago',
    icon: <FiDownload className="w-4 h-4" />,
    color: 'bg-cyan-500'
  }
];

export default function RecentActivity() {
  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <p className="text-gray-400 text-sm mt-1">Latest system activities</p>
        </div>
        <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ x: 5 }}
            className="flex items-start space-x-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-cyan-500/30 transition-colors"
          >
            <div className={`p-2 rounded-lg ${activity.color} bg-opacity-20`}>
              <div className={`text-white ${activity.color.replace('bg-', 'text-')}`}>
                {activity.icon}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{activity.title}</p>
              <p className="text-sm text-gray-400 truncate">{activity.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}