
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { UserData } from '@/features/users/types/userTypes';
import { getCurrentSession, isAuthenticated } from '../services/authService';
import { getGuestData, syncGuestData } from '@/features/users/services/guestService';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userData: null,
  loading: true,
  isAuthenticated: false,
  refreshUserData: async () => {}
});

export const useAuth = () => useContext(AuthContext);

// Default user data for Sofia Ayari
const DEFAULT_USER_DATA: UserData = {
  email: 'sofia.ayari@example.com',
  first_name: 'Sofia',
  last_name: 'Ayari',
  room_number: '401',
  guest_type: 'Premium Guest'
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const fetchUserData = async (userId: string) => {
    try {
      console.log('Récupération des données utilisateur depuis Supabase pour:', userId);
      
      const guestData = await getGuestData(userId);
      
      if (guestData) {
        console.log('Données récupérées depuis Supabase:', guestData);
        // Ensure we never use "Guest" as a name
        if (guestData.first_name === 'Guest' || !guestData.first_name) {
          guestData.first_name = 'Sofia';
          guestData.last_name = 'Ayari';
          guestData.guest_type = 'Premium Guest';
          
          // Save the corrected data
          await syncGuestData(userId, guestData);
        }
        
        setUserData(guestData);
        localStorage.setItem('user_data', JSON.stringify(guestData));
        return guestData;
      }
      
      // Check for data in localStorage
      const userDataString = localStorage.getItem('user_data');
      if (userDataString) {
        try {
          const localUserData = JSON.parse(userDataString) as UserData;
          
          // Prevent "Guest" name even in localStorage
          if (localUserData.first_name === 'Guest' || !localUserData.first_name) {
            localUserData.first_name = 'Sofia';
            localUserData.last_name = 'Ayari';
            localUserData.guest_type = 'Premium Guest';
          }
          
          setUserData(localUserData);
          console.log('Données récupérées depuis localStorage:', localUserData);
          
          await syncGuestData(userId, localUserData);
          
          return localUserData;
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
      
      // If we have an authenticated user but no data, create default Sofia profile
      if (user) {
        const defaultUserData: UserData = {
          id: userId,
          email: user.email || DEFAULT_USER_DATA.email,
          first_name: DEFAULT_USER_DATA.first_name,
          last_name: DEFAULT_USER_DATA.last_name,
          room_number: DEFAULT_USER_DATA.room_number,
          guest_type: DEFAULT_USER_DATA.guest_type
        };
        
        await syncGuestData(userId, defaultUserData);
        setUserData(defaultUserData);
        localStorage.setItem('user_data', JSON.stringify(defaultUserData));
        
        return defaultUserData;
      }
      
      // Absolute fallback - return Sofia profile
      return DEFAULT_USER_DATA;
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Return Sofia profile on error
      return DEFAULT_USER_DATA;
    }
  };

  const refreshUserData = async () => {
    const userId = user?.id || localStorage.getItem('user_id');
    if (userId) {
      await fetchUserData(userId);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
        
        const authStatus = await isAuthenticated();
        setIsUserAuthenticated(authStatus);
        
        // Get a user ID from session or localStorage
        const userId = data.session?.user?.id || localStorage.getItem('user_id');
        
        if (userId) {
          const userData = await fetchUserData(userId);
          // If we still got "Guest" as name, force Sofia data
          if (userData.first_name === 'Guest') {
            const fixedData = { ...userData, ...DEFAULT_USER_DATA };
            setUserData(fixedData);
            localStorage.setItem('user_data', JSON.stringify(fixedData));
            await syncGuestData(userId, fixedData);
          }
        } else {
          // No user ID found, set default Sofia data
          setUserData(DEFAULT_USER_DATA);
          localStorage.setItem('user_data', JSON.stringify(DEFAULT_USER_DATA));
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        // Set default Sofia data on error
        setUserData(DEFAULT_USER_DATA);
        localStorage.setItem('user_data', JSON.stringify(DEFAULT_USER_DATA));
      } finally {
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);
      setSession(newSession);
      setUser(newSession?.user || null);
      
      const authStatus = await isAuthenticated();
      setIsUserAuthenticated(authStatus);
      
      if (newSession?.user?.id) {
        setTimeout(() => {
          fetchUserData(newSession.user!.id);
        }, 0);
      }
    });

    initializeAuth();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        user, 
        userData, 
        loading, 
        isAuthenticated: isUserAuthenticated,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
