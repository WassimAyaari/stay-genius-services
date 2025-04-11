
import { useState, useEffect } from 'react';
import { Room } from '@/hooks/useRoom';
import { supabase } from '@/integrations/supabase/client';
import { syncGuestData } from '@/features/users/services/guestService';
import { formatDateToString } from '@/features/users/utils/validationUtils';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

export interface UserInfo {
  name: string;
  roomNumber: string;
  phone?: string;
  email?: string;
}

export function useUserInfo(room: Room | null) {
  const { userData } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo>({ 
    name: '', 
    roomNumber: userData?.room_number || room?.room_number || '' 
  });

  // Load user profile data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      // First try to get authenticated user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // User is authenticated, check if they have a guest record
        const info = await getUserInfoFromDatabase(session.user.id);
        if (info) {
          setUserInfo(info);
          // Ensure the room number is stored in localStorage
          if (info.roomNumber) {
            localStorage.setItem('user_room_number', info.roomNumber);
          }
        } else {
          // No guest record yet, create basic info from auth data and sync it
          const roomNumber = userData?.room_number || room?.room_number || localStorage.getItem('user_room_number') || '000';
          const authInfo = {
            name: session.user.user_metadata?.first_name 
              ? `${session.user.user_metadata.first_name || ''} ${session.user.user_metadata.last_name || ''}`.trim()
              : session.user.email?.split('@')[0] || 'Guest',
            roomNumber: roomNumber,
            email: session.user.email
          };
          setUserInfo(authInfo);
          localStorage.setItem('user_room_number', roomNumber);
          
          // Create a basic guest record from auth info
          await syncAuthUserToGuest(session.user.id, authInfo);
        }
      } else {
        // Not authenticated, try to get from local info
        const localInfo = getLocalUserInfo();
        setUserInfo(localInfo);
        if (localInfo.roomNumber) {
          localStorage.setItem('user_room_number', localInfo.roomNumber);
        }
      }
    };
    
    loadUserData();
  }, [room, userData]);

  // Sync authenticated user to guest table using our improved syncGuestData function
  const syncAuthUserToGuest = async (userId: string, userInfo: UserInfo) => {
    try {
      // Convertir UserInfo en UserData
      const userData = {
        id: userId,
        first_name: userInfo.name.split(' ')[0] || '',
        last_name: userInfo.name.split(' ').slice(1).join(' ') || '',
        email: userInfo.email || '',
        room_number: userInfo.roomNumber || '',
        phone: userInfo.phone || ''
      };
      
      // Utiliser notre fonction améliorée qui gère les doublons
      await syncGuestData(userId, userData);
    } catch (error) {
      console.error("Failed to sync auth user to guest:", error);
    }
  };

  // Try to get user info directly from the database
  const getUserInfoFromDatabase = async (userId: string): Promise<UserInfo | null> => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('first_name, last_name, room_number, phone, email')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error || !data) {
        console.error("Error fetching guest data:", error);
        return null;
      }
      
      const fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim();
      const roomNumber = data.room_number || userData?.room_number || room?.room_number || localStorage.getItem('user_room_number') || '000';
      
      return {
        name: fullName || 'Guest',
        roomNumber: roomNumber,
        phone: data.phone || '',
        email: data.email || ''
      };
    } catch (error) {
      console.error("Error in getUserInfoFromDatabase:", error);
      return null;
    }
  };

  const getLocalUserInfo = (): UserInfo => {
    // First try to get user data from localStorage
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData) {
          // Format full name from first_name and last_name fields
          const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
          // Get room number from userData or fall back to room prop or Auth context
          const storedRoomNumber = localStorage.getItem('user_room_number');
          const roomNumber = userData.room_number || storedRoomNumber || room?.room_number || '000';
          // Get phone number if available
          const phone = userData.phone || '';
          const email = userData.email || '';
          
          // Ensure room number is stored in localStorage
          if (roomNumber && roomNumber !== storedRoomNumber) {
            localStorage.setItem('user_room_number', roomNumber);
          }
          
          return {
            name: fullName || 'Guest',
            roomNumber: roomNumber,
            phone: phone,
            email: email
          };
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    
    // If no user data in localStorage, use room data or Auth context if available
    const defaultRoomNumber = userData?.room_number || room?.room_number || localStorage.getItem('user_room_number') || '000';
    
    // Ensure room number is stored in localStorage
    if (defaultRoomNumber) {
      localStorage.setItem('user_room_number', defaultRoomNumber);
    }
    
    return { 
      name: 'Guest', 
      roomNumber: defaultRoomNumber
    };
  };

  const saveUserInfo = async (info: UserInfo) => {
    // Store user info in local storage with proper fields
    const userDataToSave = {
      first_name: info.name.split(' ')[0],
      last_name: info.name.split(' ').slice(1).join(' '),
      room_number: info.roomNumber,
      phone: info.phone || '',
      email: info.email || ''
    };
    
    localStorage.setItem('user_data', JSON.stringify(userDataToSave));
    localStorage.setItem('user_room_number', info.roomNumber);
    setUserInfo(info);
    
    // If authenticated, also sync to guests table using our improved function
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await syncAuthUserToGuest(session.user.id, info);
      }
    } catch (error) {
      console.error("Error syncing user info with guest table:", error);
    }
  };

  // Ensure that this method returns a Promise
  const ensureValidUserInfo = async (): Promise<UserInfo> => {
    const currentInfo = getLocalUserInfo();
    
    // If either name or room number is missing, save with defaults
    if (!currentInfo.name || !currentInfo.roomNumber) {
      const roomNumber = userData?.room_number || room?.room_number || localStorage.getItem('user_room_number') || '000';
      const updatedInfo = {
        name: currentInfo.name || 'Guest',
        roomNumber: currentInfo.roomNumber || roomNumber,
        phone: currentInfo.phone,
        email: currentInfo.email
      };
      
      await saveUserInfo(updatedInfo);
      return updatedInfo;
    }
    
    return currentInfo;
  };

  return {
    userInfo,
    setUserInfo,
    getLocalUserInfo,
    saveUserInfo,
    ensureValidUserInfo
  };
}
