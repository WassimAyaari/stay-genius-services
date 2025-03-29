
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has data in localStorage
    const userData = localStorage.getItem('user_data');
    
    // Ensure user_id is a valid UUID
    let userId = localStorage.getItem('user_id');
    if (!userId || userId.startsWith('user_')) {
      // Generate a proper UUID and store it
      userId = uuidv4();
      localStorage.setItem('user_id', userId);
    }
    
    // If no user data and not on login page, redirect to login
    if (!userData && window.location.pathname !== '/auth/login') {
      navigate('/auth/login');
    } else if (userData) {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;
