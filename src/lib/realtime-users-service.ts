// src/lib/realtime-users-service.ts
import { adminDb, adminStorage } from './firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  getDocs,
  Timestamp,
  DocumentData,
  QuerySnapshot,
  updateDoc,
  getDoc,
  limit,
  where
} from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from 'firebase/storage';

export interface FirebaseUser {
  id: string;
  address?: string;
  createdAt?: Timestamp | Date;
  email: string;
  fullName?: string;
  username?: string;
  hasLinkedDevices?: boolean;
  isEmailVerified?: boolean;
  isGmailAccount?: boolean;
  lastLogin?: Timestamp | Date;
  otpVerified?: boolean;
  phoneNumber?: string;
  photoURL?: string;
  profileImageUrl?: string;
  uid: string;
  updatedAt?: Timestamp | Date;
  status?: 'active' | 'inactive';
}

export interface WaterFlowData {
  currentFlowRate: number;
  todayUsage: number;
  todayBill: number;
  pressure: number;
  temperature: number;
  timestamp: Timestamp;
  peakFlow?: number;
}

// Interface for water data history items
export interface WaterDataHistoryItem {
  id: string;
  currentFlowRate?: number;
  todayUsage?: number;
  todayBill?: number;
  pressure?: number;
  temperature?: number;
  timestamp?: Timestamp | Date;
  date?: Date;
  flowRate?: number;
  dailyUsage?: number;
  dailyCost?: number;
}

// Interface for user data with additional fields
export interface ProcessedUser extends FirebaseUser {
  waterFlowData: WaterFlowData;
  lastActivity: Timestamp | Date;
  valveStatus: 'open' | 'closed';
  alerts?: any[];
  displayPhotoUrl: string;
}

// Interface for user with createdAt
interface UserWithCreatedAt {
  id: string;
  createdAt?: Timestamp | Date;
  [key: string]: any;
}

// Cache for user profile images to reduce Firebase calls
const profileImageCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Storage helper functions with enhanced real-time support
const getUserProfileImageUrl = async (userId: string, firestoreUrl?: string): Promise<string> => {
  try {
    // Check cache first
    const cached = profileImageCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`📦 Using cached image for user ${userId}`);
      return cached.url;
    }

    // If we have a valid Firestore URL, use it
    if (firestoreUrl && firestoreUrl.startsWith('http')) {
      console.log(`✅ Using Firestore URL for user ${userId}`);
      profileImageCache.set(userId, { url: firestoreUrl, timestamp: Date.now() });
      return firestoreUrl;
    }

    // Try multiple possible storage locations (Flutter app paths)
    const possiblePaths = [
      `users/${userId}/profile/profile.jpg`,
      `users/${userId}/profile_images/profile.jpg`,
      `users/${userId}/profile_images/profile_${userId}.jpg`,
      `profile_images/${userId}.jpg`,
      `users/${userId}/profile.jpg`,
      `users/${userId}/avatar.jpg`,
      // Add paths for timestamped files from Flutter upload
      `users/${userId}/profile_pictures/profile_*.jpg`,
      `users/${userId}/profile_pictures/profile.jpg`,
    ];

    console.log(`🔍 Searching for profile image for user ${userId}`);

    for (const path of possiblePaths) {
      try {
        // Handle wildcard paths
        if (path.includes('*')) {
          const folderPath = path.substring(0, path.lastIndexOf('/'));
          try {
            const folderRef = ref(adminStorage, folderPath);
            const files = await listAll(folderRef);
            
            if (files.items.length > 0) {
              // Get the most recent file (assuming timestamp in name)
              const sortedFiles = files.items.sort((a, b) => 
                b.name.localeCompare(a.name)
              );
              const url = await getDownloadURL(sortedFiles[0]);
              console.log(`✅ Found profile image in folder: ${sortedFiles[0].fullPath}`);
              profileImageCache.set(userId, { url, timestamp: Date.now() });
              return url;
            }
          } catch (folderError) {
            continue;
          }
        } else {
          const storageRef = ref(adminStorage, path);
          const url = await getDownloadURL(storageRef);
          console.log(`✅ Found profile image at: ${path}`);
          profileImageCache.set(userId, { url, timestamp: Date.now() });
          return url;
        }
      } catch (error) {
        // Try next path
        continue;
      }
    }

    // Try to list files in user's profile_images directory
    try {
      const folderRef = ref(adminStorage, `users/${userId}/`);
      const files = await listAll(folderRef);
      
      if (files.items.length > 0) {
        // Filter for image files
        const imageFiles = files.items.filter(item => 
          item.name.includes('profile') || 
          item.name.includes('avatar') ||
          item.name.includes('photo') ||
          item.name.endsWith('.jpg') ||
          item.name.endsWith('.jpeg') ||
          item.name.endsWith('.png')
        );
        
        if (imageFiles.length > 0) {
          // Get the most recent file
          const sortedFiles = imageFiles.sort((a, b) => 
            b.name.localeCompare(a.name)
          );
          const url = await getDownloadURL(sortedFiles[0]);
          console.log(`✅ Found profile image in user folder: ${sortedFiles[0].fullPath}`);
          profileImageCache.set(userId, { url, timestamp: Date.now() });
          return url;
        }
      }
    } catch (folderError) {
      console.log(`📁 No folder found for user ${userId}`);
    }

    // If no image found, generate a default avatar
    console.log(`⚠️ No profile image found for user ${userId}, using default avatar`);
    const defaultAvatar = getDefaultAvatar();
    profileImageCache.set(userId, { url: defaultAvatar, timestamp: Date.now() });
    return defaultAvatar;
  } catch (error) {
    console.error('❌ Error fetching profile image:', error);
    const defaultAvatar = getDefaultAvatar();
    profileImageCache.set(userId, { url: defaultAvatar, timestamp: Date.now() });
    return defaultAvatar;
  }
};

const getDefaultAvatar = (name?: string, email?: string): string => {
  const displayName = name || email || 'User';
  const encodedName = encodeURIComponent(displayName);
  // Use DiceBear for better avatars
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedName}&backgroundColor=0ea5e9&radius=20`;
};

export class RealtimeUserService {
  private db = adminDb;

  // Clear cache for specific user (call this when user updates their profile)
  clearUserImageCache(userId: string) {
    profileImageCache.delete(userId);
    console.log(`🧹 Cleared image cache for user ${userId}`);
  }

  // Subscribe to real-time updates for a specific user's profile
  subscribeToUserProfile(userId: string, onProfileUpdate: (user: ProcessedUser) => void) {
    const userRef = doc(this.db, 'users', userId);
    
    return onSnapshot(userRef, async (userDoc) => {
      try {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const processedUser = await this.processUserWithImage(userId, userData);
          onProfileUpdate(processedUser);
        }
      } catch (error) {
        console.error('Error in user profile subscription:', error);
      }
    });
  }

  // Process a single user with image fetching
  private async processUserWithImage(userId: string, userData: any): Promise<ProcessedUser> {
    // Default values
    let waterFlowData: WaterFlowData = {
      currentFlowRate: 0,
      todayUsage: 0,
      todayBill: 0,
      pressure: 0,
      temperature: 0,
      timestamp: Timestamp.now()
    };
    
    let hasLinkedDevices = userData.hasLinkedDevices || false;
    let lastActivity = userData.lastLogin || Timestamp.now();

    try {
      // Get real-time water data (if exists)
      const waterDataRef = collection(this.db, 'users', userId, 'waterData');
      const waterQuery = query(waterDataRef, orderBy('timestamp', 'desc'), limit(1));
      const waterSnapshot = await getDocs(waterQuery);
      
      if (!waterSnapshot.empty) {
        const latestWater = waterSnapshot.docs[0].data();
        waterFlowData = {
          currentFlowRate: latestWater.flowRate || latestWater.currentFlowRate || 0,
          todayUsage: latestWater.todayUsage || latestWater.dailyUsage || 0,
          todayBill: latestWater.todayBill || latestWater.dailyCost || 0,
          pressure: latestWater.pressure || 0,
          temperature: latestWater.temperature || 0,
          timestamp: latestWater.timestamp || Timestamp.now(),
          peakFlow: latestWater.peakFlow || 0
        };
      }
    } catch (waterError) {
      console.log(`No water data for user ${userId}:`, waterError);
    }

    try {
      // Check if user has devices
      const devicesRef = collection(this.db, 'users', userId, 'devices');
      const devicesSnapshot = await getDocs(devicesRef);
      hasLinkedDevices = !devicesSnapshot.empty;
    } catch (deviceError) {
      console.log(`No devices for user ${userId}:`, deviceError);
    }

    try {
      // Get last activity
      const activitiesRef = collection(this.db, 'users', userId, 'activities');
      const activitiesQuery = query(activitiesRef, orderBy('timestamp', 'desc'), limit(1));
      const activitiesSnapshot = await getDocs(activitiesQuery);
      
      if (!activitiesSnapshot.empty) {
        const latestActivity = activitiesSnapshot.docs[0].data();
        lastActivity = latestActivity.timestamp || userData.lastLogin || Timestamp.now();
      }
    } catch (activityError) {
      console.log(`No activities for user ${userId}:`, activityError);
    }

    // Fetch profile image - check both Firestore fields
    const firestoreImageUrl = userData.photoURL || userData.profileImageUrl;
    const displayPhotoUrl = await getUserProfileImageUrl(userId, firestoreImageUrl);

    const valveStatus: 'open' | 'closed' = waterFlowData.currentFlowRate > 0 ? 'open' : 'closed';

    return {
      id: userId,
      ...userData,
      waterFlowData,
      hasLinkedDevices,
      lastActivity,
      valveStatus,
      displayPhotoUrl,
      address: userData.address || '',
      fullName: userData.fullName || 'Unknown User',
      username: userData.username || '',
      phoneNumber: userData.phoneNumber || '',
      photoURL: displayPhotoUrl, // Update with fetched URL
      profileImageUrl: displayPhotoUrl, // Update with fetched URL
      isEmailVerified: userData.isEmailVerified || false,
      isGmailAccount: userData.isGmailAccount || false,
      otpVerified: userData.otpVerified || false,
      status: userData.status || 'active'
    } as ProcessedUser;
  }

  // Get all users in real-time
  subscribeToAllUsers(onUpdate: (users: ProcessedUser[]) => void) {
    const usersRef = collection(this.db, 'users');
    
    return onSnapshot(usersRef, async (snapshot: QuerySnapshot<DocumentData>) => {
      try {
        console.log(`🔄 Real-time update: ${snapshot.docs.length} users`);
        
        const users = await Promise.all(
          snapshot.docs.map(async (userDoc) => {
            const userData = userDoc.data();
            const userId = userDoc.id;
            return await this.processUserWithImage(userId, userData);
          })
        );

        // Sort users by last activity (most recent first)
        users.sort((a, b) => {
          const timeA = a.lastActivity instanceof Timestamp ? a.lastActivity.toMillis() : new Date(a.lastActivity).getTime();
          const timeB = b.lastActivity instanceof Timestamp ? b.lastActivity.toMillis() : new Date(b.lastActivity).getTime();
          return timeB - timeA;
        });

        onUpdate(users);
      } catch (error) {
        console.error('Error processing users:', error);
        onUpdate([]);
      }
    });
  }

  // Get single user by ID
  async getUserById(userId: string): Promise<ProcessedUser | null> {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data();
      return await this.processUserWithImage(userId, userData);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Get users by status
  async getUsersByStatus(status: 'active' | 'inactive'): Promise<ProcessedUser[]> {
    try {
      const usersRef = collection(this.db, 'users');
      const statusQuery = query(usersRef, where('status', '==', status));
      const snapshot = await getDocs(statusQuery);
      
      const users = await Promise.all(
        snapshot.docs.map(async (userDoc) => {
          const userData = userDoc.data();
          const userId = userDoc.id;
          return await this.processUserWithImage(userId, userData);
        })
      );

      return users;
    } catch (error) {
      console.error('Error getting users by status:', error);
      return [];
    }
  }

  // Get recent users (last 7 days)
  async getRecentUsers(limitCount: number = 50): Promise<ProcessedUser[]> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const usersRef = collection(this.db, 'users');
      const recentQuery = query(
        usersRef, 
        where('createdAt', '>=', Timestamp.fromDate(sevenDaysAgo)),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(recentQuery);
      
      const users = await Promise.all(
        snapshot.docs.map(async (userDoc) => {
          const userData = userDoc.data();
          const userId = userDoc.id;
          return await this.processUserWithImage(userId, userData);
        })
      );

      return users;
    } catch (error) {
      console.error('Error getting recent users:', error);
      return [];
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, data: Partial<FirebaseUser>): Promise<boolean> {
    try {
      const userRef = doc(this.db, 'users', userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      // Clear cache when profile is updated
      this.clearUserImageCache(userId);
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  // Update user status
  async updateUserStatus(userId: string, status: 'active' | 'inactive'): Promise<boolean> {
    try {
      const userRef = doc(this.db, 'users', userId);
      await updateDoc(userRef, {
        status,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating user status:', error);
      return false;
    }
  }

  // Get user activities
  async getUserActivities(userId: string, limitCount: number = 50) {
    try {
      const activitiesRef = collection(this.db, 'users', userId, 'activities');
      const activitiesQuery = query(activitiesRef, orderBy('timestamp', 'desc'), limit(limitCount));
      const snapshot = await getDocs(activitiesQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting activities:', error);
      return [];
    }
  }

  // Get user water data history
  async getWaterDataHistory(userId: string, days: number = 7): Promise<WaterDataHistoryItem[]> {
    try {
      const waterDataRef = collection(this.db, 'users', userId, 'waterData');
      const waterQuery = query(waterDataRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(waterQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().timestamp?.toDate?.() || new Date()
      })) as WaterDataHistoryItem[];
    } catch (error) {
      console.error('Error getting water data history:', error);
      return [];
    }
  }

  // Get user statistics
  async getUserStatistics(userId: string) {
    try {
      const waterHistory: WaterDataHistoryItem[] = await this.getWaterDataHistory(userId, 30);
      
      if (waterHistory.length === 0) {
        return {
          totalUsage: 0,
          averageDailyUsage: 0,
          peakFlow: 0,
          daysTracked: 0,
          estimatedMonthlyBill: 0
        };
      }

      const totalUsage = waterHistory.reduce((sum, data) => sum + (data.todayUsage || data.dailyUsage || 0), 0);
      const averageDailyUsage = totalUsage / waterHistory.length;
      const peakFlow = Math.max(...waterHistory.map(data => data.currentFlowRate || data.flowRate || 0));
      const estimatedMonthlyBill = waterHistory.reduce((sum, data) => sum + (data.todayBill || data.dailyCost || 0), 0) * 30;

      return {
        totalUsage,
        averageDailyUsage,
        peakFlow,
        daysTracked: waterHistory.length,
        estimatedMonthlyBill
      };
    } catch (error) {
      console.error('Error getting user statistics:', error);
      return {
        totalUsage: 0,
        averageDailyUsage: 0,
        peakFlow: 0,
        daysTracked: 0,
        estimatedMonthlyBill: 0
      };
    }
  }

  // Subscribe to single user's water data
  subscribeToUserWaterData(userId: string, onUpdate: (data: WaterFlowData) => void) {
    const waterDataRef = collection(this.db, 'users', userId, 'waterData');
    const q = query(waterDataRef, orderBy('timestamp', 'desc'), limit(1));
    
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const latestData = snapshot.docs[0].data();
        onUpdate({
          currentFlowRate: latestData.flowRate || latestData.currentFlowRate || 0,
          todayUsage: latestData.todayUsage || latestData.dailyUsage || 0,
          todayBill: latestData.todayBill || latestData.dailyCost || 0,
          pressure: latestData.pressure || 0,
          temperature: latestData.temperature || 0,
          timestamp: latestData.timestamp || Timestamp.now(),
          peakFlow: latestData.peakFlow || 0
        });
      } else {
        // Send default data if no water data exists
        onUpdate({
          currentFlowRate: 0,
          todayUsage: 0,
          todayBill: 0,
          pressure: 0,
          temperature: 0,
          timestamp: Timestamp.now(),
          peakFlow: 0
        });
      }
    });
  }

  // Get users with devices
  async getUsersWithDevices(): Promise<ProcessedUser[]> {
    try {
      const usersRef = collection(this.db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const usersWithDevices = await Promise.all(
        usersSnapshot.docs.map(async (userDoc) => {
          const userId = userDoc.id;
          const userData = userDoc.data();
          
          // Check for devices
          const devicesRef = collection(this.db, 'users', userId, 'devices');
          const devicesSnapshot = await getDocs(devicesRef);
          
          if (!devicesSnapshot.empty) {
            return await this.processUserWithImage(userId, userData);
          }
          return null;
        })
      );

      return usersWithDevices.filter(user => user !== null) as ProcessedUser[];
    } catch (error) {
      console.error('Error getting users with devices:', error);
      return [];
    }
  }

  // Search users
  async searchUsers(searchTerm: string, field: 'email' | 'fullName' | 'username' | 'phoneNumber' = 'email'): Promise<ProcessedUser[]> {
    try {
      if (!searchTerm.trim()) {
        return [];
      }

      const usersRef = collection(this.db, 'users');
      const searchQuery = query(
        usersRef,
        where(field, '>=', searchTerm),
        where(field, '<=', searchTerm + '\uf8ff'),
        limit(20)
      );

      const snapshot = await getDocs(searchQuery);
      
      const users = await Promise.all(
        snapshot.docs.map(async (userDoc) => {
          const userData = userDoc.data();
          const userId = userDoc.id;
          return await this.processUserWithImage(userId, userData);
        })
      );

      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const usersRef = collection(this.db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserWithCreatedAt[];
      
      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        verifiedUsers: users.filter(u => u.isEmailVerified).length,
        usersWithDevices: users.filter(u => u.hasLinkedDevices).length,
        gmailUsers: users.filter(u => u.isGmailAccount).length,
        recentSignups: users.filter(u => {
          if (!u.createdAt) return false;
          const createdAt = u.createdAt instanceof Timestamp ? u.createdAt.toDate() : new Date(u.createdAt);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return createdAt >= sevenDaysAgo;
        }).length,
      };

      return stats;
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        verifiedUsers: 0,
        usersWithDevices: 0,
        gmailUsers: 0,
        recentSignups: 0,
      };
    }
  }

  // Get user growth data (for charts)
  async getUserGrowthData(days: number = 30) {
    try {
      const usersRef = collection(this.db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserWithCreatedAt[];

      // Group by date
      const growthData: { [key: string]: number } = {};
      const today = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        growthData[dateKey] = 0;
      }

      users.forEach(user => {
        if (user.createdAt) {
          const createdAt = user.createdAt instanceof Timestamp ? user.createdAt.toDate() : new Date(user.createdAt);
          const dateKey = createdAt.toISOString().split('T')[0];
          
          if (growthData.hasOwnProperty(dateKey)) {
            growthData[dateKey]++;
          }
        }
      });

      // Convert to cumulative
      let cumulative = 0;
      const result = Object.keys(growthData).map(date => {
        cumulative += growthData[date];
        return {
          date,
          daily: growthData[date],
          cumulative
        };
      });

      return result;
    } catch (error) {
      console.error('Error getting user growth data:', error);
      return [];
    }
  }
}

// Create and export a singleton instance
const realtimeUserService = new RealtimeUserService();
export default realtimeUserService;