
import { useAuth } from '@/features/auth/hooks/useAuthContext';

export const useUserAuthentication = () => {
  const { user } = useAuth();
  
  // Get user data from context or localStorage
  const userId = user?.id || localStorage.getItem('user_id');
  const userEmail = user?.email || localStorage.getItem('user_email');
  const userRoomNumber = user?.room_number || localStorage.getItem('room_number') || '000';
  
  // Store email in localStorage for future reference
  if (user?.email && !localStorage.getItem('user_email')) {
    localStorage.setItem('user_email', user.email);
  }
  
  // Store room number in localStorage if available and not already stored
  if (user?.room_number && !localStorage.getItem('room_number')) {
    localStorage.setItem('room_number', user.room_number);
  }
  
  const isAuthenticated = !!userId || !!userEmail;
  
  return {
    userId,
    userEmail,
    userRoomNumber,
    isAuthenticated
  };
};
