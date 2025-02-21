
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BedDouble, UtensilsCrossed, Heart, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home className="w-6 h-6" />, label: 'Home', path: '/' },
    { icon: <BedDouble className="w-6 h-6" />, label: 'Room', path: '/my-room' },
    { icon: <UtensilsCrossed className="w-6 h-6" />, label: 'Dining', path: '/dining' },
    { icon: <Heart className="w-6 h-6" />, label: 'Spa', path: '/spa' },
    { icon: <Phone className="w-6 h-6" />, label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              location.pathname === item.path
                ? "text-primary"
                : "text-gray-500 hover:text-primary"
            )}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
