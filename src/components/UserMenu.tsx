
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, User, HotelIcon, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const UserMenu = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;
      
      // Vérifier si l'utilisateur est un super admin
      const { data: superAdminData, error: superAdminError } = await supabase.rpc(
        'is_super_admin', 
        { user_id: session.user.id }
      );
      
      if (!superAdminError && superAdminData) {
        setIsSuperAdmin(true);
      }
      
      // Vérifier si l'utilisateur est admin d'au moins un hôtel
      const { data: hotelAdmins, error: hotelAdminError } = await supabase
        .from('hotel_admins')
        .select('*')
        .eq('user_id', session.user.id)
        .limit(1);
        
      if (!hotelAdminError && hotelAdmins && hotelAdmins.length > 0) {
        setIsAdmin(true);
      }
    };
    
    checkAdminStatus();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback className="bg-primary text-white">
            <User size={18} />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </Link>
        </DropdownMenuItem>
        
        {(isAdmin || isSuperAdmin) && <DropdownMenuSeparator />}
        
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin/dashboard" className="cursor-pointer flex items-center">
              <HotelIcon className="mr-2 h-4 w-4" />
              <span>Administration Hôtel</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        {isSuperAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin/hotels" className="cursor-pointer flex items-center">
              <ShieldCheck className="mr-2 h-4 w-4" />
              <span>Super Administration</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
