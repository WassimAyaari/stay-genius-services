import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { UserData } from '@/features/users/types/userTypes';
import { getCurrentSession, isAuthenticated } from '../services/authService';
import { getGuestData } from '@/features/users/services/guestService';

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
        setUserData(guestData);
        
        localStorage.setItem('user_data', JSON.stringify(guestData));
        return guestData;
      }
      
      const userDataString = localStorage.getItem('user_data');
      if (userDataString) {
        try {
          const localUserData = JSON.parse(userDataString) as UserData;
          setUserData(localUserData);
          console.log('Données récupérées depuis localStorage:', localUserData);
          
          await syncGuestData(userId, localUserData);
          
          return localUserData;
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
      
      if (user) {
        const basicUserData: UserData = {
          id: userId,
          email: user.email || '',
          first_name: user.user_metadata?.first_name || user.email?.split('@')[0] || '',
          last_name: user.user_metadata?.last_name || '',
          room_number: ''
        };
        
        await syncGuestData(userId, basicUserData);
        setUserData(basicUserData);
        localStorage.setItem('user_data', JSON.stringify(basicUserData));
        
        return basicUserData;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
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
        
        if (data.session?.user?.id) {
          await fetchUserData(data.session.user.id);
        } else {
          const userId = localStorage.getItem('user_id');
          if (userId) {
            await fetchUserData(userId);
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
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
