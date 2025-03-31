
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
      console.log("Démarrage du processus de déconnexion");
      
      // 1. D'abord, déconnexion via Supabase Auth
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erreur lors de la déconnexion Supabase:", error);
        throw error;
      }
      
      console.log("Déconnexion Supabase réussie");
      
      // 2. Nettoyer localStorage manuellement
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_id');
      console.log("Données localStorage supprimées");
      
      // 3. Notification à l'utilisateur
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès"
      });
      
      // 4. Redirection forcée
      console.log("Redirection vers la page de connexion");
      
      // Utiliser window.location pour forcer un rechargement complet
      // Cela garantit que tous les états React sont réinitialisés
      window.location.href = '/auth/login';
    } catch (error) {
      console.error("Erreur complète de déconnexion:", error);
      
      // Notification d'erreur
      toast({
        variant: "destructive",
        title: "Erreur lors de la déconnexion",
        description: "Une erreur inattendue est survenue, tentative de nettoyage..."
      });
      
      // Tentative de nettoyage d'urgence
      try {
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_id');
        console.log("Nettoyage d'urgence effectué");
        
        // Forcer le rechargement même en cas d'erreur
        window.location.href = '/auth/login';
      } catch (e) {
        console.error("Échec du nettoyage d'urgence:", e);
        
        // Dernier recours: redirection simple
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
