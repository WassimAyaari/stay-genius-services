
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { UserData } from '@/features/users/types/userTypes';
import { getCurrentSession, isAuthenticated } from '../services/authService';
import { getGuestData, syncGuestData } from '@/features/users/services/guestService';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
      
      // Check for data in localStorage
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
      
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const refreshUserData = async () => {
    if (!user) {
      console.log('Aucun utilisateur, impossible de rafraîchir les données');
      return;
    }
    
    const userId = user.id;
    if (userId) {
      await fetchUserData(userId);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        // Configurer d'abord l'écouteur d'état d'authentification
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('Auth state changed:', event);
            setSession(newSession);
            setUser(newSession?.user || null);
            
            // Ne pas faire d'autres appels Supabase ici directement
            // pour éviter un blocage potentiel
            if (newSession?.user) {
              setIsUserAuthenticated(true);
              
              // Utiliser setTimeout pour éviter les blocages
              setTimeout(async () => {
                await fetchUserData(newSession.user!.id);
              }, 0);
            } else {
              setIsUserAuthenticated(false);
              setUserData(null);
              localStorage.removeItem('user_data');
              localStorage.removeItem('user_id');
            }
          }
        );
        
        // Ensuite, vérifier la session existante
        const { data } = await supabase.auth.getSession();
        console.log('Session initiale:', data.session);
        
        setSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session?.user) {
          setIsUserAuthenticated(true);
          const userId = data.session.user.id;
          localStorage.setItem('user_id', userId);
          await fetchUserData(userId);
        } else {
          const authStatus = await isAuthenticated();
          setIsUserAuthenticated(authStatus);
          
          // Essayer de récupérer l'ID utilisateur du localStorage si pas de session
          const userId = localStorage.getItem('user_id');
          if (userId && authStatus) {
            await fetchUserData(userId);
          } else {
            setUserData(null);
            localStorage.removeItem('user_data');
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        setUserData(null);
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: "Un problème est survenu lors de l'initialisation de l'authentification"
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Nettoyer l'abonnement à la déconnexion
    return () => {
      supabase.auth.onAuthStateChange(() => {});
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
