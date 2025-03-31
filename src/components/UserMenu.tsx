
import React, { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, Camera, Pencil } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import GuestStatusBadge from './GuestStatusBadge';
import { logoutUser } from '@/features/auth/services/authService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { compressAndConvertToWebP } from '@/lib/imageUtils';

interface UserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  room_number?: string;
  profile_image?: string;
}

const UserMenu = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image')) {
      toast({
        variant: "destructive",
        title: "Type de fichier non supporté",
        description: "Veuillez sélectionner une image (JPG, PNG, etc.)"
      });
      return;
    }

    try {
      setUploading(true);
      
      // Compresser l'image avant de la stocker
      const compressedImage = await compressAndConvertToWebP(file);
      
      // Mettre à jour les données utilisateur avec l'image
      if (userData) {
        const updatedUserData = {
          ...userData,
          profile_image: compressedImage
        };
        
        // Sauvegarder dans localStorage
        localStorage.setItem('user_data', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        
        toast({
          title: "Photo de profil mise à jour",
          description: "Votre photo de profil a été mise à jour avec succès"
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Erreur lors de l'upload",
        description: "Impossible de mettre à jour votre photo de profil"
      });
    } finally {
      setUploading(false);
      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-muted/30">
              <Avatar className="border border-muted">
                {userData?.profile_image ? (
                  <AvatarImage src={userData.profile_image} alt={getFullName()} />
                ) : (
                  <AvatarImage src="/placeholder.svg" />
                )}
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-2">
            <div className="flex flex-col items-center gap-2 p-2">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  {userData?.profile_image ? (
                    <AvatarImage src={userData.profile_image} alt={getFullName()} />
                  ) : (
                    <AvatarImage src="/placeholder.svg" />
                  )}
                  <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full shadow"
                  onClick={handleImageClick}
                  disabled={uploading}
                >
                  <Camera className="h-3.5 w-3.5" />
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="text-center">
                <p className="font-semibold">{getFullName()}</p>
                <GuestStatusBadge className="mt-1" />
              </div>
              <div className="grid w-full grid-cols-2 gap-2 pt-2">
                <Link to="/profile">
                  <Button variant="outline" className="w-full" size="sm">
                    <Pencil className="mr-2 h-3.5 w-3.5" />
                    Profil
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
