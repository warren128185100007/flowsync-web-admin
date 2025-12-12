// src/lib/firebase-storage.ts
import { adminStorage } from './firebase';
import { ref, getDownloadURL, listAll } from 'firebase/storage';

export const getUserProfileImageUrl = async (userId: string): Promise<string | null> => {
  try {
    // Try multiple possible storage locations
    const possiblePaths = [
      `users/${userId}/profile/profile.jpg`,
      `users/${userId}/profile_images/profile.jpg`,
      `profile_images/${userId}.jpg`,
      `users/${userId}/profile.jpg`,
    ];

    for (const path of possiblePaths) {
      try {
        const storageRef = ref(adminStorage, path);
        const url = await getDownloadURL(storageRef);
        console.log(`✅ Found profile image at: ${path}`);
        return url;
      } catch (error) {
        // Try next path
        continue;
      }
    }

    // Try to list files in user's profile_images directory
    try {
      const folderRef = ref(adminStorage, `users/${userId}/profile_images/`);
      const files = await listAll(folderRef);
      
      if (files.items.length > 0) {
        // Get the most recent file (assuming timestamp in name)
        const sortedFiles = files.items.sort((a, b) => 
          b.name.localeCompare(a.name) // Simple string comparison for timestamps
        );
        const url = await getDownloadURL(sortedFiles[0]);
        console.log(`✅ Found profile image in folder: ${sortedFiles[0].fullPath}`);
        return url;
      }
    } catch (folderError) {
      console.log(`No profile_images folder for user ${userId}`);
    }

    return null;
  } catch (error) {
    console.log('Error fetching profile image:', error);
    return null;
  }
};

export const getDefaultAvatar = (name?: string, email?: string): string => {
  const displayName = name || email || 'User';
  const encodedName = encodeURIComponent(displayName);
  // Use a better avatar service
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedName}&backgroundColor=0ea5e9&radius=20`;
};