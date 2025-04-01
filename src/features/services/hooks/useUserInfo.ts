
import { useState, useEffect } from 'react';
import { Room } from '@/hooks/useRoom';

export interface UserInfo {
  name: string;
  roomNumber: string;
  phone?: string;
}

export function useUserInfo(room: Room | null) {
  const [userInfo, setUserInfo] = useState<UserInfo>({ 
    name: '', 
    roomNumber: room?.room_number || '' 
  });

  // Load user profile data when component mounts
  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info);
  }, [room]);

  const getUserInfo = (): UserInfo => {
    // First try to get user data from localStorage
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData) {
          // Format full name from first_name and last_name fields
          const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
          // Get room number from userData or fall back to room prop
          const roomNumber = userData.room_number || room?.room_number || '401';
          // Get phone number if available
          const phone = userData.phone || '';
          
          return {
            name: fullName || 'Guest',
            roomNumber: roomNumber,
            phone: phone
          };
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    
    // If no user data in localStorage, use room data if available
    if (room) {
      return {
        name: 'Guest',
        roomNumber: room.room_number || '401',
      };
    }

    // Default fallback - ensure we always return something valid
    return { 
      name: 'Guest', 
      roomNumber: '401'
    };
  };

  const saveUserInfo = (info: UserInfo) => {
    // Store user info in local storage with proper fields
    const userDataToSave = {
      first_name: info.name.split(' ')[0],
      last_name: info.name.split(' ').slice(1).join(' '),
      room_number: info.roomNumber,
      phone: info.phone || ''
    };
    
    localStorage.setItem('user_data', JSON.stringify(userDataToSave));
    setUserInfo(info);
  };

  // Add method to update local user_data with default values if missing
  const ensureValidUserInfo = () => {
    const currentInfo = getUserInfo();
    
    // If either name or room number is missing, save with defaults
    if (!currentInfo.name || !currentInfo.roomNumber) {
      const updatedInfo = {
        name: currentInfo.name || 'Guest',
        roomNumber: currentInfo.roomNumber || (room?.room_number || '401'),
        phone: currentInfo.phone
      };
      
      saveUserInfo(updatedInfo);
      return updatedInfo;
    }
    
    return currentInfo;
  };

  return {
    userInfo,
    setUserInfo,
    getUserInfo,
    saveUserInfo,
    ensureValidUserInfo
  };
}
