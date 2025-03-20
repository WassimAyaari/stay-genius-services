
import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useHotel } from '@/context/HotelContext';
import { cn } from '@/lib/utils';
import { Loader2, Hotel, Users, BedDouble, Utensils, Calendar, Settings, Activity } from 'lucide-react';

interface HotelAdminLayoutProps {
  children: React.ReactNode;
}

const HotelAdminLayout: React.FC<HotelAdminLayoutProps> = ({ children }) => {
  const { hotel, loading } = useHotel();
  const { hotelId } = useParams<{ hotelId: string }>();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Hôtel non trouvé</h1>
        <p className="text-gray-500 mb-4">Impossible de trouver les informations de cet hôtel.</p>
        <Link to="/admin/hotels" className="text-blue-500 hover:underline">
          Retour à la liste des hôtels
        </Link>
      </div>
    );
  }

  const navItems = [
    { 
      name: 'Dashboard', 
      path: `/admin/hotels/${hotelId}/interface`,
      icon: <Activity size={20} /> 
    },
    { 
      name: 'Chambres',
      path: `/admin/hotels/${hotelId}/rooms`,
      icon: <BedDouble size={20} />,
      feature: 'rooms'
    },
    { 
      name: 'Services',
      path: `/admin/hotels/${hotelId}/services`, 
      icon: <Hotel size={20} />,
    },
    { 
      name: 'Restauration',
      path: `/admin/hotels/${hotelId}/dining`, 
      icon: <Utensils size={20} />,
      feature: 'dining'
    },
    { 
      name: 'Événements',
      path: `/admin/hotels/${hotelId}/events`, 
      icon: <Calendar size={20} />,
      feature: 'events'
    },
    { 
      name: 'Personnel',
      path: `/admin/hotels/${hotelId}/staff`, 
      icon: <Users size={20} /> 
    },
    { 
      name: 'Paramètres',
      path: `/admin/hotels/${hotelId}/settings`, 
      icon: <Settings size={20} /> 
    },
  ];

  // Style dynamique basé sur la configuration de l'hôtel
  const themeStyles = {
    '--primary-color': hotel.config?.theme?.primary || '#1e40af',
    '--secondary-color': hotel.config?.theme?.secondary || '#4f46e5',
  } as React.CSSProperties;

  return (
    <div className="flex h-screen" style={themeStyles}>
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center">
          <div className="bg-white rounded-md p-1 mr-3">
            {hotel.logo_url ? (
              <img src={hotel.logo_url} alt={hotel.name} className="h-8 w-8" />
            ) : (
              <Hotel className="h-8 w-8 text-[var(--primary-color)]" />
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold truncate">{hotel.name}</h2>
            <p className="text-xs text-gray-400">Administration</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              // Vérifier si la fonctionnalité est activée
              if (item.feature && hotel.config?.enabled_features) {
                if (!hotel.config.enabled_features.includes(item.feature)) {
                  return null;
                }
              }
              
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-md transition-colors",
                      isActive 
                        ? "bg-[var(--primary-color)] text-white" 
                        : "text-gray-300 hover:bg-gray-800"
                    )}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <Link
            to="/admin/hotels"
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <span className="text-sm">← Retour à la liste des hôtels</span>
          </Link>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default HotelAdminLayout;
