
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, User, Hotel, ShieldCheck, Palette } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const UserMenu = () => {
  // Simulating user roles for demo without authentication
  const isAdmin = true;
  const isSuperAdmin = true;
  const userId = 'demo-user-id'; // Simuler un ID utilisateur

  // Récupérer les hôtels administrés par l'utilisateur
  const { data: userHotels } = useQuery({
    queryKey: ['userHotels', userId],
    queryFn: async () => {
      if (isSuperAdmin) {
        // Les super-admins peuvent voir tous les hôtels
        const { data, error } = await supabase
          .from('hotels')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        return data || [];
      } else if (isAdmin) {
        // Les admins d'hôtel ne voient que leurs hôtels
        const { data, error } = await supabase
          .from('hotel_admins')
          .select('hotel_id, hotels:hotel_id(id, name)')
          .eq('user_id', userId);
        
        if (error) throw error;
        return data?.map(item => item.hotels) || [];
      }
      
      return [];
    },
    enabled: isAdmin || isSuperAdmin,
  });

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
      <DropdownMenuContent align="end" className="w-64">
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
        
        {isAdmin && userHotels && userHotels.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Mes Hôtels</DropdownMenuLabel>
            {userHotels.map((hotel) => (
              <DropdownMenuItem key={hotel.id} asChild>
                <Link 
                  to={`/admin/hotels/${hotel.id}/interface`} 
                  className="cursor-pointer flex items-center"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  <span className="truncate">{hotel.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem asChild>
              <Link to="/admin/dashboard" className="cursor-pointer flex items-center">
                <Hotel className="mr-2 h-4 w-4" />
                <span>Administration Hôtel</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        {isSuperAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Super Administration</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/admin/hotels" className="cursor-pointer flex items-center">
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Gestion des Hôtels</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
