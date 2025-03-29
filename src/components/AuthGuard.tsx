
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si l'utilisateur est inscrit (a des données dans le localStorage)
    const userData = localStorage.getItem('user_data');
    
    if (!userData && window.location.pathname !== '/auth/login') {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Veuillez vous connecter pour accéder à cette page",
      });
      navigate('/auth/login');
    } else if (userData) {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
