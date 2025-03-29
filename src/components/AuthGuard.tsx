
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est inscrit (a des données dans le localStorage)
    const userData = localStorage.getItem('user_data');
    
    // Si pas de données utilisateur et pas sur la page de login, rediriger vers login
    if (!userData && window.location.pathname !== '/auth/login') {
      navigate('/auth/login');
    } else if (userData) {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;
