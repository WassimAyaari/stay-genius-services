
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuthContextType {
  user: any | null;
  userData: any | null;
  isLoading: boolean;
  isInitializing: boolean;
  isAuthenticated: boolean; // Added property
  refreshUserData: () => Promise<void>; // Added property
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Added state

  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      // Use 'guests' table instead of 'profiles' which doesn't exist in the schema
      const { data: profile } = await supabase
        .from('guests')
        .select(`
          first_name,
          last_name,
          phone
        `)
        .eq('user_id', user.id)
        .single();
      
      setUserData(profile);
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  useEffect(() => {
    const session = supabase.auth.getSession()
    
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      
      if (currentUser) {
        // Use 'guests' table instead of 'profiles'
        const { data: profile } = await supabase
          .from('guests')
          .select(`
            first_name,
            last_name,
            phone
          `)
          .eq('user_id', currentUser.id)
          .single();
        
        setUserData(profile);
      } else {
        setUserData(null);
      }
      setIsInitializing(false);
    });

    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
      return data;
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, profileData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: profileData.firstName,
            last_name: profileData.lastName,
          },
        },
      });
      if (error) throw error;

      // Create a user profile in the "profiles" table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user?.id,
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            phone: profileData.phone,
          },
        ]);

      if (profileError) {
        console.error("Error creating profile:", profileError.message);
        throw profileError;
      }

      setUser(data.user);
      return data;
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    isLoading,
    isInitializing,
    isAuthenticated: !!user,
    refreshUserData,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
