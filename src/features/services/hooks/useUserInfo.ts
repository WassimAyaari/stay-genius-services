
import { useState, useEffect } from 'react';
import { Room } from '@/hooks/useRoom';

export interface UserInfo {
  name: string;
  roomNumber: string;
}

export function useUserInfo(room: Room | null) {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', roomNumber: '' });
  const [isUserInfoDialogOpen, setIsUserInfoDialogOpen] = useState(false);

  // Load user profile data when dialog opens
  useEffect(() => {
    loadUserProfileData();
  }, [room]);

  const loadUserProfileData = () => {
    // First try to get user data from localStorage
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData) {
          // Format full name from first_name and last_name fields
          const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
          // Get room number from userData or fall back to room prop
          const roomNumber = userData.room_number || room?.room_number || '';
          
          setUserInfo({
            name: fullName,
            roomNumber: roomNumber
          });
          return;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    
    // If no user data in localStorage, check for values that might have been set in previous sessions
    const savedUserInfo = getUserInfo();
    setUserInfo(savedUserInfo);
  };

  const getUserInfo = () => {
    const userInfoStr = localStorage.getItem('user_data');
    if (userInfoStr) {
      try {
        const userData = JSON.parse(userInfoStr);
        return {
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          roomNumber: userData.room_number || (room?.room_number || '')
        };
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
    return {
      name: '',
      roomNumber: room?.room_number || ''
    };
  };

  const saveUserInfo = (info: UserInfo) => {
    // Store user info in local storage with proper fields
    const userDataToSave = {
      first_name: info.name.split(' ')[0],
      last_name: info.name.split(' ').slice(1).join(' '),
      room_number: info.roomNumber
    };
    
    localStorage.setItem('user_data', JSON.stringify(userDataToSave));
    setUserInfo(info);
    setIsUserInfoDialogOpen(false);
  };

  return {
    userInfo,
    setUserInfo,
    isUserInfoDialogOpen,
    setIsUserInfoDialogOpen,
    saveUserInfo
  };
}
