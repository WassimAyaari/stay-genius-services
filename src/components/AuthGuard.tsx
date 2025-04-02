
import React from 'react';
import { useAuthGuard } from '@/features/auth/hooks/useAuthGuard';
import LoadingSpinner from './auth/LoadingSpinner';

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

  if (loading) {
    return <LoadingSpinner />;
  }

  // Si nous sommes sur une page auth, ou si l'utilisateur est autorisé, afficher les enfants
  return (isAuthPage() || authorized) ? <>{children}</> : null;
};

export default AuthGuard;
