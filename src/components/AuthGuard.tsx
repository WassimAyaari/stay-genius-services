
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { syncUserData } from '@/features/users/services/userService';
import { isAuthenticated } from '@/features/auth/services/authService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    // Ne pas vérifier l'authentification sur les pages d'authentification
    if (location.pathname.includes('/auth/')) {
      console.log("Page d'authentification, pas de vérification nécessaire");
      setLoading(false);
      setAuthorized(false);
      return;
    }
    
    const checkAuth = async () => {
      setLoading(true);
      console.log("Vérification de l'authentification pour la route:", location.pathname);
      
      try {
        // 1. Vérifier si l'utilisateur est authentifié via Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erreur lors de la récupération de la session:", sessionError);
          throw new Error("Erreur de session");
        }
        
        console.log("État de la session Supabase:", session ? "Active" : "Inactive");
        
        // 2. Vérifier aussi avec notre fonction isAuthenticated (double contrôle)
        const auth = await isAuthenticated();
        console.log("État d'authentification global:", auth);
        
        if (!session && !auth) {
          console.log('Utilisateur non authentifié, redirection vers login');
          navigate('/auth/login', { replace: true });
          setAuthorized(false);
          setLoading(false);
          return;
        }
        
        // 3. Validation des données utilisateur dans localStorage
        const userDataString = localStorage.getItem('user_data');
        const userId = localStorage.getItem('user_id');
        
        if (!userDataString || !userId) {
          console.log('Données utilisateur manquantes, redirection vers login');
          toast({
            variant: "destructive",
            title: "Données de session incomplètes",
            description: "Veuillez vous reconnecter"
          });
          navigate('/auth/login', { replace: true });
          setAuthorized(false);
          setLoading(false);
          return;
        }
        
        try {
          // 4. Traiter et synchroniser les données utilisateur
          const userData = JSON.parse(userDataString);
          
          if (!userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            // Format UUID incorrect, générer un nouveau
            const newUserId = uuidv4();
            localStorage.setItem('user_id', newUserId);
            console.log("ID utilisateur invalide, nouveau généré:", newUserId);
          }
          
          // Synchroniser les données utilisateur avec Supabase
          syncUserData(userData).then(success => {
            if (success) {
              console.log("Données utilisateur synchronisées avec succès");
            } else {
              console.warn("Échec de synchronisation des données utilisateur");
            }
          });
          
          setAuthorized(true);
        } catch (parseError) {
          console.error("Erreur d'analyse des données utilisateur:", parseError);
          toast({
            variant: "destructive", 
            title: "Erreur de données",
            description: "Format de données incorrect, reconnexion nécessaire"
          });
          navigate('/auth/login', { replace: true });
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Erreur critique de vérification d'authentification:", error);
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: "Veuillez vous reconnecter"
        });
        
        // Nettoyage d'urgence et redirection
        try {
          localStorage.removeItem('user_data');
          localStorage.removeItem('user_id');
        } catch (e) {
          console.error("Erreur de nettoyage:", e);
        }
        
        navigate('/auth/login', { replace: true });
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };
    
    // Configurer un écouteur pour les changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Changement d'état d'authentification:", event);
      
      if (event === 'SIGNED_OUT') {
        console.log("Événement de déconnexion détecté");
        setAuthorized(false);
        
        // Rediriger vers la page de connexion si on n'y est pas déjà
        if (!location.pathname.includes('/auth/')) {
          navigate('/auth/login', { replace: true });
        }
      } else if (event === 'SIGNED_IN' && session) {
        console.log("Événement de connexion détecté");
        setAuthorized(true);
      }
    });
    
    checkAuth();
    
    // Nettoyer l'écouteur
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></span>
      </div>
    );
  }

  // Si nous sommes sur une page auth, ou si l'utilisateur est autorisé, afficher les enfants
  return (location.pathname.includes('/auth/') || authorized) ? <>{children}</> : null;
};

export default AuthGuard;
