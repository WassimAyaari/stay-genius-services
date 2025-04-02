
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { NotificationItem } from '@/types/notification';
import { useNotificationsState } from './notifications/useNotificationsState';
import { useNotificationsRealtime } from './notifications/useNotificationsRealtime';
import { combineAndSortNotifications } from './notifications/notificationUtils';

export const useNotifications = () => {
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem('user_id');
  const userEmail = user?.email || localStorage.getItem('user_email');
  
  // Get service requests and table reservations
  const { data: serviceRequests = [], refetch: refetchServices } = useServiceRequests();
  const { reservations = [], refetch: refetchReservations } = useTableReservations();
  
  // Get notification state management
  const { hasNewNotifications, setHasNewNotifications } = useNotificationsState();
  
  // Store email in localStorage for future reference
  if (user?.email && !localStorage.getItem('user_email')) {
    localStorage.setItem('user_email', user.email);
  }
  
  // Force a reload on component mount
  refetchServices();
  refetchReservations();
  
  // Set up real-time notification listeners
  useNotificationsRealtime(
    userId,
    userEmail,
    refetchReservations,
    refetchServices,
    setHasNewNotifications
  );

  // Combine and sort notifications
  const notifications: NotificationItem[] = combineAndSortNotifications(
    serviceRequests,
    reservations
  );

  // Count unread notifications
  const unreadCount = notifications.filter(n => 
    n.status === 'pending' || n.status === 'in_progress' || n.status === 'confirmed'
  ).length;

  const isAuthenticated = Boolean(userId);

  return {
    notifications,
    unreadCount,
    isAuthenticated,
    hasNewNotifications,
    setHasNewNotifications
  };
};
