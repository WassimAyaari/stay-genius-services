
import { useState } from 'react';
import { Room } from '@/hooks/useRoom';

export interface UserInfo {
  name: string;
  roomNumber: string;
  roomId?: string;
  guestId?: string;
}

export interface RoomInfo {
  roomId: string;
  roomNumber: string;
  guestId: string;
  guestName: string;
}

export function useUserInfo(room: Room | null) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'Guest',
    roomNumber: ''
  });

  const getLocalUserInfo = (): UserInfo => {
    try {
      const storedData = localStorage.getItem('user_data');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const fullName = `${parsedData.first_name || ''} ${parsedData.last_name || ''}`.trim();
        const roomNumber = parsedData.room_number || '';
        
        return {
          name: fullName || 'Guest',
          roomNumber: roomNumber,
          guestId: parsedData.id || localStorage.getItem('user_id') || undefined,
        };
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    
    return {
      name: 'Guest',
      roomNumber: '',
      guestId: localStorage.getItem('user_id') || undefined,
    };
  };

  const getRoomInfo = (): RoomInfo => {
    const localUserInfo = getLocalUserInfo();
    
    return {
      roomId: room?.id || '',
      roomNumber: room?.room_number || localUserInfo.roomNumber || '',
      guestId: room?.guest_id || localUserInfo.guestId || localStorage.getItem('user_id') || '',
      guestName: localUserInfo.name || 'Guest'
    };
  };

  const saveUserInfo = async (info: UserInfo): Promise<void> => {
    setUserInfo(info);
    try {
      localStorage.setItem('user_room_number', info.roomNumber);
      if (info.guestId) {
        localStorage.setItem('user_id', info.guestId);
      }
    } catch (error) {
      console.error("Error saving user info:", error);
    }
  };

  const ensureValidUserInfo = async (): Promise<boolean> => {
    const info = getLocalUserInfo();
    if (!info.roomNumber) {
      return false;
    }
    setUserInfo(info);
    return true;
  };

  return {
    userInfo,
    setUserInfo,
    getLocalUserInfo,
    saveUserInfo,
    ensureValidUserInfo,
    getRoomInfo
  };
}
