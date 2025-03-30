
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { syncUserData } from '@/features/users/services/userService';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has data in localStorage
    const userDataString = localStorage.getItem('user_data');
    
    // Ensure user_id is a valid UUID
    let userId = localStorage.getItem('user_id');
    if (!userId || userId.startsWith('user_')) {
      // Generate a proper UUID and store it
      userId = uuidv4();
      localStorage.setItem('user_id', userId);
    }
    
    // If user data exists, synchronize it with Supabase
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        // Synchroniser les données utilisateur avec Supabase
        syncUserData(userData).then(success => {
          if (success) {
            console.log("User data successfully synchronized with Supabase");
          } else {
            console.warn("Failed to synchronize user data with Supabase");
          }
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate('/auth/login');
      }
    } else if (window.location.pathname !== '/auth/login') {
      // If no user data and not on login page, redirect to login
      navigate('/auth/login');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;
