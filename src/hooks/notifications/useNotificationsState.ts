import { useState, useCallback } from 'react';

const STORAGE_KEY = 'lastSeenNotificationsAt';

/**
 * Hook to manage notification state with timestamp-based tracking
 */
export const useNotificationsState = () => {
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [lastSeenAt, setLastSeenAt] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || new Date(0).toISOString();
  });

  const incrementCount = useCallback(() => {
    setNewNotificationCount(prev => prev + 1);
  }, []);

  const markAsSeen = useCallback(() => {
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, now);
    setLastSeenAt(now);
    setNewNotificationCount(0);
  }, []);

  // FIXED: Memoize with useCallback to prevent subscription churn
  const setHasNewNotifications = useCallback((value: boolean) => {
    if (value) {
      setNewNotificationCount(prev => prev + 1);
    } else {
      const now = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, now);
      setLastSeenAt(now);
      setNewNotificationCount(0);
    }
  }, []);

  return {
    newNotificationCount,
    lastSeenAt,
    incrementCount,
    markAsSeen,
    hasNewNotifications: newNotificationCount > 0,
    setHasNewNotifications
  };
};
