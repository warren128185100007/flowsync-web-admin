// src/types/user.types.ts
export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  username: string;
  phoneNumber: string;
  address?: string;
  photoURL?: string;
  profileImageUrl?: string;
  isEmailVerified: boolean;
  isGmailAccount: boolean;
  otpVerified: boolean;
  hasLinkedDevices: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  
  // Water usage data (from mobile app)
  waterFlowData?: {
    currentFlowRate: number;
    todayUsage: number;
    todayBill: number;
    pressure: number;
    temperature: number;
    peakFlow: number;
  };
  
  waterUsage?: {
    today: {
      liters: number;
      bill: number;
      flowRate: number;
      peakFlow: number;
      duration: number;
    };
    monthly: {
      liters: number;
      bill: number;
      avgDaily: number;
      trend: number;
    };
  };
  
  alerts?: any[];
  activityLog?: any[];
  connectedDevices?: any[];
}