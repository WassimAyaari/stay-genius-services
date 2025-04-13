
import React, { useEffect } from 'react';
import { useAuthGuard } from '@/features/auth/hooks/useAuthGuard';
import LoadingSpinner from './auth/LoadingSpinner';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
  adminRequired?: boolean;
  publicAccess?: boolean; // New prop to allow public access
}

const AuthGuard = ({ 
  children, 
  adminRequired = false, 
  publicAccess = false // Default to false, but can be overridden
}: AuthGuardProps) => {
  const { loading, authorized, isAuthPage } = useAuthGuard(adminRequired);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Public routes that should always be accessible
  const publicRoutes = [
    '/', 
    '/about', 
    '/contact', 
    '/destination', 
    '/rooms', 
    '/dining', 
    '/spa', 
    '/activities', 
    '/events', 
    '/map'
  ];

  useEffect(() => {
    // Check if the current route is a public route
    const isPublicRoute = publicRoutes.some(route => 
      location.pathname === route || location.pathname.startsWith(route + '/')
    );

    // If it's a public route or explicitly marked for public access, allow access
    if (isPublicRoute || publicAccess || isAuthPage()) {
      return;
    }

    // If not authorized and not on an auth page
    if (!isAuthPage() && !authorized && !loading) {
      console.log('Redirection vers la page de connexion depuis:', location.pathname);
      
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour accéder à cette page",
        variant: "destructive"
      });
      
      // Rediriger vers la page de connexion
      navigate('/auth/login', { state: { from: location.pathname } });
    }
  }, [authorized, isAuthPage, loading, navigate, toast, location, publicRoutes]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Allow access if:
  // 1. It's an auth page
  // 2. User is authorized
  // 3. Route is public
  // 4. Explicitly marked for public access
  return (isAuthPage() || authorized || publicRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')) || 
    publicAccess) ? <>{children}</> : null;
};

export default AuthGuard;
