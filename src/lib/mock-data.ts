// src/lib/mock-data.ts - Add these type definitions at the top
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  avatarColor: string;
  joinedDate: string;
  totalDevices: number;
  activeAlerts: number;
  monthlyUsage: string;
}

export interface Device {
  id: number;
  name: string;
  type: 'valve' | 'sensor';
  status: 'online' | 'offline';
  location: string;
  lastActivity: string;
  valveStatus: 'open' | 'closed';
  battery: number;
  flowRate: string;
  pressure: string;
}

export interface Alert {
  id: number;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  time: string;
  location: string;
  status: 'active' | 'resolved';
}

export interface Zone {
  name: string;
  status: 'normal' | 'warning' | 'critical';
  pressure: string;
  flow: string;
  leaks: number;
  devices: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  devices: number;
  status: 'active' | 'inactive';
}

export interface WaterUsage {
  today: string;
  week: string;
  month: string;
  yesterday: string;
  lastWeek: string;
  lastMonth: string;
}

// Your existing exports
export const userProfile: UserProfile = {
  name: "John Doe",
  email: "john@flowsync.com",
  phone: "+1 (555) 123-4567",
  address: "123 Water St, San Francisco, CA",
  role: "Administrator",
  avatarColor: "#0ea5e9",
  joinedDate: "2024-01-15",
  totalDevices: 8,
  activeAlerts: 3,
  monthlyUsage: "12,540L"
};

export const devices: Device[] = [
  { id: 1, name: "Main Valve - Living Room", type: "valve", status: "online", location: "Zone A", lastActivity: "2 mins ago", valveStatus: "open", battery: 85, flowRate: "45 L/min", pressure: "42 PSI" },
  { id: 2, name: "Kitchen Flow Sensor", type: "sensor", status: "online", location: "Zone B", lastActivity: "5 mins ago", valveStatus: "closed", battery: 92, flowRate: "28 L/min", pressure: "38 PSI" },
  { id: 3, name: "Garden Irrigation", type: "valve", status: "offline", location: "Zone C", lastActivity: "2 hours ago", valveStatus: "open", battery: 45, flowRate: "0 L/min", pressure: "0 PSI" },
];

export const alerts: Alert[] = [
  { id: 1, type: "leak", severity: "critical", message: "Major leak detected in Zone B", time: "10:30 AM", location: "Main Pipeline", status: "active" },
  { id: 2, type: "pressure", severity: "high", message: "Pressure drop detected", time: "09:15 AM", location: "Zone C", status: "resolved" },
];

export const zones: Zone[] = [
  { name: "Zone A", status: "normal", pressure: "45 PSI", flow: "28 L/min", leaks: 0, devices: 3 },
  { name: "Zone B", status: "critical", pressure: "28 PSI", flow: "85 L/min", leaks: 1, devices: 2 },
];

export const users: User[] = [
  { id: 1, name: "Sarah Johnson", email: "sarah@email.com", role: "User", devices: 2, status: "active" },
  { id: 2, name: "Mike Wilson", email: "mike@email.com", role: "Operator", devices: 5, status: "active" },
];

export const waterUsage: WaterUsage = {
  today: "1,240L",
  week: "8,750L", 
  month: "12,540L",
  yesterday: "1,150L",
  lastWeek: "8,200L",
  lastMonth: "11,800L"
};