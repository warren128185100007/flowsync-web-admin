// components/dashboard/water-flow-chart.tsx - FIXED
'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiFilter, FiDownload } from 'react-icons/fi';

export default function WaterFlowChart() {
  const [timeRange, setTimeRange] = useState('day');
  const [heights, setHeights] = useState<number[]>([]);
  const [data, setData] = useState<number[]>([]);

  // Initialize with consistent data on both server and client
  useEffect(() => {
    // Generate consistent heights (not random on each render)
    const newHeights = Array.from({ length: 24 }, (_, i) => {
      // Use a deterministic formula instead of Math.random()
      const base = 30;
      const variation = Math.sin(i * 0.5) * 30 + 20;
      return base + variation;
    });
    setHeights(newHeights);
    
    // Generate consistent data values
    const newData = newHeights.map(h => Math.round(50 + h * 2));
    setData(newData);
  }, []);

  const timeRanges = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Water Flow Analysis</h2>
          <p className="text-gray-400 text-sm mt-1">Real-time water consumption patterns</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  timeRange === range.value
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          
          <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
            <FiFilter className="w-5 h-5 text-gray-300" />
          </button>
          
          <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
            <FiDownload className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80 relative">
        {/* Chart bars - only render after heights are set */}
        {heights.length > 0 && (
          <div className="absolute inset-0 flex items-end space-x-1 px-4 pb-8">
            {heights.map((height, i) => {
              const isCurrent = i === 12;
              return (
                <div
                  key={i}
                  className="flex-1 relative group"
                >
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-t from-cyan-500 to-blue-500'
                        : 'bg-gradient-to-t from-gray-700 to-gray-600'
                    }`}
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {data[i]} L
                    </div>
                  </div>
                  <div className="text-center text-xs text-gray-500 mt-2">
                    {i % 2 === 0 ? `${i}:00` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Y-axis */}
        <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-gray-700 flex flex-col justify-between py-8">
          {[100, 75, 50, 25, 0].map((value) => (
            <div key={value} className="text-xs text-gray-500 pr-2 text-right">
              {value}L
            </div>
          ))}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-6 pt-6 border-t border-gray-700/50">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-gray-800/30">
            <p className="text-2xl font-bold text-white">245L</p>
            <p className="text-xs text-gray-400">Current Flow</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-800/30">
            <p className="text-2xl font-bold text-white flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-green-400 mr-1" />
              12.5%
            </p>
            <p className="text-xs text-gray-400">Today's Increase</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-800/30">
            <p className="text-2xl font-bold text-white">1,240L</p>
            <p className="text-xs text-gray-400">Daily Average</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-800/30">
            <p className="text-2xl font-bold text-white flex items-center justify-center">
              <FiTrendingDown className="w-5 h-5 text-red-400 mr-1" />
              3.2%
            </p>
            <p className="text-xs text-gray-400">vs Yesterday</p>
          </div>
        </div>
      </div>
    </div>
  );
}