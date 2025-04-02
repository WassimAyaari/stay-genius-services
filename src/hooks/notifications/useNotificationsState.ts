
import { useState } from 'react';

/**
 * Hook to manage notification state
 */
export const useNotificationsState = () => {
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  
  return {
    hasNewNotifications,
    setHasNewNotifications
  };
};
