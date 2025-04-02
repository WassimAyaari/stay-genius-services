
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { useEffect } from 'react';

/**
 * Hook to get user authentication data for notifications
 */
export const useUserAuthentication = () => {
  const { user, userData } = useAuth();
  
  const userId = user?.id || localStorage.getItem('user_id');
  const userEmail = user?.email || localStorage.getItem('user_email');
  const userRoomNumber = userData?.room_number || localStorage.getItem('user_room_number');

  // Store email in localStorage for future reference
  useEffect(() => {
    if (user?.email && !localStorage.getItem('user_email')) {
      localStorage.setItem('user_email', user.email);
    }
    if (userData?.email && !localStorage.getItem('user_email')) {
      localStorage.setItem('user_email', userData.email);
    }
  }, [user?.email, userData?.email]);

  const isAuthenticated = Boolean(user || userId || userRoomNumber || localStorage.getItem('user_id'));

  return {
    userId,
    userEmail,
    userRoomNumber,
    isAuthenticated
  };
};
