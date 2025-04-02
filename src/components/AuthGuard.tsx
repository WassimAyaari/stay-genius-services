
import React, { useEffect } from 'react';
import { useAuthGuard } from '@/features/auth/hooks/useAuthGuard';
import LoadingSpinner from './auth/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
  adminRequired?: boolean;
}

/**
 * Composant de garde d'authentification pour sécuriser les routes
 * Vérifie si l'utilisateur est authentifié avant d'afficher le contenu
 */
const AuthGuard = ({ children, adminRequired = false }: AuthGuardProps) => {
  const { loading, authorized, isAuthPage } = useAuthGuard(adminRequired);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Si on n'est pas sur une page d'auth et qu'on n'est pas autorisé
    if (!isAuthPage() && !authorized && !loading) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour accéder à cette page",
        variant: "destructive"
      });
      navigate('/auth/login');
    }
  }, [authorized, isAuthPage, loading, navigate, toast]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Si nous sommes sur une page auth, ou si l'utilisateur est autorisé, afficher les enfants
  return (isAuthPage() || authorized) ? <>{children}</> : null;
};

export default AuthGuard;
