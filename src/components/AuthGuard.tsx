
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { syncUserData } from '@/features/users/services/userService';
import { isAuthenticated } from '@/features/auth/services/authService';
import { useToast } from '@/hooks/use-toast';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      try {
        // Vérifier si l'utilisateur est authentifié via Supabase ou localStorage
        const auth = await isAuthenticated();
        
        if (!auth) {
          // Rediriger vers la page de connexion si non authentifié
          navigate('/auth/login');
          return;
        }
        
        // Si authentifié, vérifier les données utilisateur dans le localStorage
        const userDataString = localStorage.getItem('user_data');
        
        // Assurer que user_id est un UUID valide
        let userId = localStorage.getItem('user_id');
        if (!userId || userId.startsWith('user_')) {
          // Générer un UUID approprié
          userId = uuidv4();
          localStorage.setItem('user_id', userId);
        }
        
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
            setAuthorized(true);
          } catch (error) {
            console.error("Error parsing user data:", error);
            navigate('/auth/login');
          }
        } else if (window.location.pathname !== '/auth/login') {
          // Si aucune donnée utilisateur et pas sur la page de connexion, rediriger
          navigate('/auth/login');
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: "Veuillez vous reconnecter",
        });
        navigate('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></span>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};

export default AuthGuard;
