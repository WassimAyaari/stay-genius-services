
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { CompanionData, UserData } from '@/features/users/types/userTypes';
import { getCompanions } from '@/features/users/services/companionService';
import { syncGuestData } from '@/features/users/services/guestService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { calculateStayDuration } from '../utils/dateUtils';

export interface Notification {
  id: number;
  message: string;
  time: string;
}

export const useProfileData = () => {
  const { toast } = useToast();
  const { userData: authUserData, user, refreshUserData } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [companions, setCompanions] = useState<CompanionData[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Your room has been cleaned",
      time: "2 minutes ago"
    },
    {
      id: 2,
      message: "Spa appointment confirmed",
      time: "1 hour ago"
    }
  ]);

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

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
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
        await refreshUserData();
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

  return {
    userData,
    companions,
    notifications,
    stayDuration,
    dismissNotification,
    handleProfileImageChange
  };
};
