
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
  refreshUserData: () => Promise<void>; // Nouvelle fonction pour rafraîchir les données
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

  // Fonction pour récupérer les données utilisateur depuis Supabase
  const fetchUserData = async (userId: string) => {
    try {
      console.log('Récupération des données utilisateur depuis Supabase pour:', userId);
      
      // Toujours essayer d'abord de récupérer depuis Supabase
      const guestData = await getGuestData(userId);
      
      if (guestData) {
        console.log('Données récupérées depuis Supabase:', guestData);
        setUserData(guestData);
        
        // Mettre à jour localStorage en tant que cache local
        localStorage.setItem('user_data', JSON.stringify(guestData));
        return guestData;
      }
      
      // Fallback sur localStorage si pas de données dans Supabase
      const userDataString = localStorage.getItem('user_data');
      if (userDataString) {
        try {
          const localUserData = JSON.parse(userDataString) as UserData;
          setUserData(localUserData);
          console.log('Données récupérées depuis localStorage:', localUserData);
          return localUserData;
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Fonction exposée pour rafraîchir les données utilisateur
  const refreshUserData = async () => {
    const userId = user?.id || localStorage.getItem('user_id');
    if (userId) {
      await fetchUserData(userId);
    }
  };

  useEffect(() => {
    // Initialiser la session et l'utilisateur
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        // Obtenir la session Supabase
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
        
        // Vérifier l'authentification (Supabase ou localStorage)
        const authStatus = await isAuthenticated();
        setIsUserAuthenticated(authStatus);
        
        // Récupérer les données utilisateur
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

    // Configurer l'écouteur de changement d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);
      setSession(newSession);
      setUser(newSession?.user || null);
      
      // Mettre à jour l'état d'authentification
      const authStatus = await isAuthenticated();
      setIsUserAuthenticated(authStatus);
      
      // Mettre à jour les données utilisateur
      if (newSession?.user?.id) {
        // Utiliser setTimeout pour éviter les deadlocks avec Supabase
        setTimeout(() => {
          fetchUserData(newSession.user!.id);
        }, 0);
      }
    });

    // Initialiser l'auth au chargement du composant
    initializeAuth();

    // Nettoyer l'écouteur à la déconnexion
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
