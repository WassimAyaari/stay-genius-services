
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Settings, 
  LayoutDashboard, 
  Hotel, 
  UtensilsCrossed, 
  Dumbbell, 
  Calendar, 
  MessageSquare, 
  Phone,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHotelConfig } from '@/hooks/useHotelConfig';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminLayout = () => {
  const location = useLocation();
  const { hotelConfig } = useHotelConfig();
  
  const menuItems = [
    {
      title: 'Tableau de bord',
      icon: <LayoutDashboard className="w-5 h-5" />,
      route: '/admin'
    },
    {
      title: 'Configuration',
      icon: <Settings className="w-5 h-5" />,
      route: '/admin/config'
    },
    {
      title: 'Chambres',
      icon: <Hotel className="w-5 h-5" />,
      route: '/admin/rooms'
    },
    {
      title: 'Restauration',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      route: '/admin/dining'
    },
    {
      title: 'Activités',
      icon: <Dumbbell className="w-5 h-5" />,
      route: '/admin/activities'
    },
    {
      title: 'Événements',
      icon: <Calendar className="w-5 h-5" />,
      route: '/admin/events'
    },
    {
      title: 'Services',
      icon: <MessageSquare className="w-5 h-5" />,
      route: '/admin/services'
    },
    {
      title: 'Contact',
      icon: <Phone className="w-5 h-5" />,
      route: '/admin/contact'
    }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Déconnexion réussie');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-secondary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/admin" className="text-xl font-bold flex items-center gap-2">
            {hotelConfig?.logo_url && (
              <img src={hotelConfig.logo_url} alt="Logo" className="h-8" />
            )}
            <span>Administration {hotelConfig?.name}</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" className="text-white">
                Voir le site
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row flex-1">
        <aside className="w-full md:w-64 bg-gray-50 border-r">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.route}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      location.pathname === item.route
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
