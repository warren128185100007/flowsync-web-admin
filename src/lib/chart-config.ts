// src/lib/chart-config.ts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Leak Detection Timeline
export const leakDetectionData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
  datasets: [
    {
      label: 'Flow Rate (L/min)',
      data: [32, 35, 28, 85, 45, 38, 42],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
};

export const leakDetectionOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#94a3b8'
      }
    },
    x: {
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#94a3b8'
      }
    }
  }
};

// Zone Pressure Monitoring
export const pressureData = {
  labels: ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'],
  datasets: [
    {
      label: 'Pressure (PSI)',
      data: [45, 28, 38, 52, 48],
      backgroundColor: [
        'rgba(14, 165, 233, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(14, 165, 233, 0.8)'
      ],
      borderColor: [
        '#0ea5e9',
        '#ef4444',
        '#f59e0b',
        '#0ea5e9',
        '#0ea5e9'
      ],
      borderWidth: 1
    }
  ]
};

export const pressureOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#94a3b8'
      }
    },
    x: {
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#94a3b8'
      }
    }
  }
};

// Leak Severity Distribution
export const leakSeverityData = {
  labels: ['Critical', 'High', 'Medium', 'Low'],
  datasets: [
    {
      data: [11, 24, 35, 30],
      backgroundColor: [
        '#ef4444',
        '#f97316',
        '#eab308',
        '#0ea5e9'
      ],
      borderColor: [
        '#dc2626',
        '#ea580c',
        '#ca8a04',
        '#0284c7'
      ],
      borderWidth: 2
    }
  ]
};

export const leakSeverityOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#94a3b8',
        padding: 20,
        font: {
          size: 12
        }
      }
    }
  }
};

// Consumption Comparison
export const consumptionData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Expected',
      data: [1200, 1250, 1300, 1280, 1350, 1400],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true
    },
    {
      label: 'Actual',
      data: [1250, 1320, 1480, 1600, 1750, 1900],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true
    }
  ]
};

export const consumptionOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8'
      }
    }
  },
  scales: {
    y: {
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#94a3b8'
      }
    },
    x: {
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#94a3b8'
      }
    }
  }
};