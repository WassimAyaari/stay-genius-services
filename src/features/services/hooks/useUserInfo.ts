
import { useState, useEffect } from 'react';
import { Room } from '@/hooks/useRoom';
import { supabase } from '@/integrations/supabase/client';

export interface UserInfo {
  name: string;
  roomNumber: string;
  phone?: string;
  email?: string;
}

export function useUserInfo(room: Room | null) {
  const [userInfo, setUserInfo] = useState<UserInfo>({ 
    name: '', 
    roomNumber: room?.room_number || '' 
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
        } else {
          // No guest record yet, create basic info from auth data and sync it
          const authInfo = {
            name: session.user.user_metadata?.first_name 
              ? `${session.user.user_metadata.first_name || ''} ${session.user.user_metadata.last_name || ''}`.trim()
              : session.user.email?.split('@')[0] || 'Guest',
            roomNumber: room?.room_number || '415',
            email: session.user.email
          };
          setUserInfo(authInfo);
          
          // Create a basic guest record from auth info
          await syncAuthUserToGuest(session.user.id, authInfo);
        }
      } else {
        // Not authenticated, try to get from local info
        const localInfo = getLocalUserInfo();
        setUserInfo(localInfo);
      }
    };
    
    loadUserData();
  }, [room]);

  // Sync authenticated user to guest table
  const syncAuthUserToGuest = async (userId: string, userInfo: UserInfo) => {
    try {
      const userData = {
        user_id: userId,
        first_name: userInfo.name.split(' ')[0] || '',
        last_name: userInfo.name.split(' ').slice(1).join(' ') || '',
        email: userInfo.email || '',
        room_number: userInfo.roomNumber || '',
        phone: userInfo.phone || ''
      };
      
      const { error } = await supabase
        .from('guests')
        .upsert([userData], { onConflict: 'user_id' });
        
      if (error) {
        console.error("Error syncing auth user to guest:", error);
      }
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
      return {
        name: fullName || 'Guest',
        roomNumber: data.room_number || (room?.room_number || '415'),
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
          // Get room number from userData or fall back to room prop
          const roomNumber = userData.room_number || room?.room_number || '415';
          // Get phone number if available
          const phone = userData.phone || '';
          const email = userData.email || '';
          
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
    
    // If no user data in localStorage, use room data if available
    if (room) {
      return {
        name: 'Guest',
        roomNumber: room.room_number || '415',
      };
    }

    // Default fallback - ensure we always return something valid
    return { 
      name: 'Guest', 
      roomNumber: '415' 
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
    setUserInfo(info);
    
    // If authenticated, also sync to guests table
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await syncAuthUserToGuest(session.user.id, info);
      }
    } catch (error) {
      console.error("Error syncing user info with guest table:", error);
    }
  };

  // Add method to update local user_data with default values if missing
  const ensureValidUserInfo = async () => {
    const currentInfo = getLocalUserInfo();
    
    // If either name or room number is missing, save with defaults
    if (!currentInfo.name || !currentInfo.roomNumber) {
      const updatedInfo = {
        name: currentInfo.name || 'Guest',
        roomNumber: currentInfo.roomNumber || (room?.room_number || '415'),
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
