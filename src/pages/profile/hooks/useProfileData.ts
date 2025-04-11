
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { CompanionData, UserData } from '@/features/users/types/userTypes';
import { getCompanions } from '@/features/users/services/companionService';
import { syncGuestData } from '@/features/users/services/guestService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { calculateStayDuration } from '../utils/dateUtils';
import { useNotifications } from '@/hooks/useNotifications';

export const useProfileData = () => {
  const { toast } = useToast();
  const { userData: authUserData, user, refreshUserData } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [companions, setCompanions] = useState<CompanionData[]>([]);
  
  // Get real notifications from the notification system
  const { notifications: systemNotifications } = useNotifications();

  useEffect(() => {
    if (authUserData) {
      setUserData(authUserData);
    }
    
    const userId = user?.id || localStorage.getItem('user_id');
    if (userId) {
      fetchCompanions(userId);
    }
  }, [authUserData, user]);

  const fetchCompanions = async (userId: string) => {
    try {
      const companionsList = await getCompanions(userId);
      setCompanions(companionsList);
    } catch (error) {
      console.error('Error fetching companions:', error);
    }
  };

  // Updated to handle string IDs
  const dismissNotification = (id: string) => {
    // We don't need to handle this locally anymore as the real 
    // notifications system will handle this
    toast({
      title: "Notification dismissed",
      description: "The notification has been removed",
    });
  };

  const handleProfileImageChange = async (imageData: string | null) => {
    if (!userData) return;
    
    const updatedUserData = {
      ...userData,
      profile_image: imageData
    };
    
    setUserData(updatedUserData);
    
    const userId = user?.id || localStorage.getItem('user_id');
    if (userId) {
      try {
        await syncGuestData(userId, updatedUserData);
        if (refreshUserData) {
          await refreshUserData();
        }
        toast({
          title: "Profil mis à jour",
          description: "Votre photo de profil a été mise à jour avec succès."
        });
      } catch (error) {
        console.error('Error syncing profile image with Supabase:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour votre photo de profil.",
          variant: "destructive"
        });
      }
    }
  };

  const stayDuration = userData ? 
    calculateStayDuration(userData.check_in_date, userData.check_out_date) : 
    null;
  
  // Convert system notifications to the format expected by NotificationsList
  // Ensure ID is preserved as-is, without forcing number conversion
  const notifications = systemNotifications
    .slice(0, 5)
    .map(notification => ({
      id: notification.id, // Keep the original string ID
      message: notification.title,
      time: typeof notification.time === 'string' 
        ? notification.time 
        : new Intl.DateTimeFormat('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            day: '2-digit', 
            month: '2-digit' 
          }).format(notification.time)
    }));

  return {
    userData,
    companions,
    notifications,
    stayDuration,
    dismissNotification,
    handleProfileImageChange
  };
};
