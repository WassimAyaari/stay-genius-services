
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import GuestStatusBadge from './GuestStatusBadge';
import { logoutUser } from '@/features/auth/services/authService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  room_number?: string;
}

const UserMenu = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUserData = localStorage.getItem('user_data');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      console.log("=== DÉBUT PROCESSUS DE DÉCONNEXION ===");
      
      // 1. Appeler notre fonction de service pour la déconnexion
      const logoutResult = await logoutUser();
      if (!logoutResult.success) {
        throw new Error(logoutResult.error || "Erreur pendant la déconnexion");
      }
      
      console.log("Service de déconnexion terminé avec succès");
      
      // 2. Double vérification: Appeler directement l'API Supabase
      const { error: supabaseError } = await supabase.auth.signOut();
      if (supabaseError) {
        console.warn("Avertissement: Erreur secondaire de Supabase:", supabaseError);
        // Continuer malgré l'erreur - on a déjà nettoyé via logoutUser()
      }
      
      // 3. Nettoyage manuel du localStorage pour être certain
      try {
        console.log("Nettoyage manuel du localStorage");
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_id');
        sessionStorage.clear(); // Aussi nettoyer sessionStorage
      } catch (storageError) {
        console.error("Erreur lors du nettoyage du stockage:", storageError);
        // Continuer malgré l'erreur
      }
      
      // 4. Notification à l'utilisateur
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès"
      });
      
      // 5. Forcer une redirection complète (pas seulement via React Router)
      console.log("Redirection vers la page de connexion avec refresh complet");
      setTimeout(() => {
        // Le délai permet à la toast de s'afficher avant le rechargement
        window.location.href = '/auth/login';
      }, 300);
      
    } catch (error) {
      console.error("=== ERREUR CRITIQUE DE DÉCONNEXION ===", error);
      
      // Notification d'erreur
      toast({
        variant: "destructive",
        title: "Erreur lors de la déconnexion",
        description: "Une erreur inattendue est survenue, tentative de nettoyage forcé..."
      });
      
      // Tentative de nettoyage d'urgence et redirection forcée
      console.log("Démarrage procédure de nettoyage d'urgence");
      try {
        // Tout nettoyer manuellement
        localStorage.clear();
        sessionStorage.clear();
        
        // Dernier recours - redirection forcée avec reload
        console.log("Redirection d'urgence");
        setTimeout(() => {
          window.location.href = '/auth/login?emergency=true';
        }, 300);
      } catch (e) {
        console.error("Échec critique du nettoyage d'urgence:", e);
        alert("Problème de déconnexion. Veuillez fermer votre navigateur et réessayer.");
        navigate('/auth/login');
      }
    }
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!userData) return 'G';
    return `${userData.first_name?.charAt(0) || ''}${userData.last_name?.charAt(0) || ''}`;
  };

  // Get user full name
  const getFullName = () => {
    if (!userData) return 'Guest';
    return `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span>{getFullName()}</span>
          <GuestStatusBadge />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/my-room">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>My Room</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/profile">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
