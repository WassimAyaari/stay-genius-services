
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BellRing, UtensilsCrossed, BedDouble, Phone, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import MainMenu from './MainMenu';
import { useNotifications } from '@/hooks/useNotifications';
import { Badge } from './ui/badge';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { unreadCount } = useNotifications();

  // Log pour le débogage
  console.log('Current path in BottomNav:', location.pathname);

  // Optimiser la gestion du scroll pour de meilleures performances
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 20) {
      // Scrolling down - hide the navbar
      setIsVisible(false);
    } else {
      // Scrolling up - show the navbar
      setIsVisible(true);
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Créer le tableau navItems une seule fois et le mettre en cache
  const navItems = useMemo(() => [
    {
      icon: <BellRing className="h-5 w-5" />,
      label: 'Notif',
      path: '/notifications',
      badgeCount: unreadCount
    }, 
    {
      icon: <UtensilsCrossed className="h-5 w-5" />,
      label: 'Dining',
      path: '/dining'
    }, 
    {
      icon: <BedDouble className="h-5 w-5" />,
      label: 'My Room',
      path: '/my-room'
    }, 
    {
      icon: <Phone className="h-5 w-5" />,
      label: 'Request',
      path: '/services'
    }, 
    {
      icon: <Grid3X3 className="h-5 w-5" />,
      label: 'Menu',
      path: '#',
      isMenu: true
    }
  ], [unreadCount]);

  // Optimiser la fonction de navigation
  const handleNavigation = useCallback((path: string) => {
    if (path !== '#') {
      console.log(`Navigating to: ${path}`);
      navigate(path);
    }
  }, [navigate]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t shadow-lg z-50"
        >
          <div className="flex justify-around items-center h-16">
            {navItems.map(item => 
              item.isMenu ? (
                <div 
                  key={`${item.path}-${item.label}`} 
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                    "text-secondary hover:text-primary"
                  )}
                >
                  <MainMenu buttonClassName="flex flex-col items-center justify-center" />
                  <span className="text-xs font-medium">Menu</span>
                </div>
              ) : (
                <button 
                  key={`${item.path}-${item.label}`} 
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full gap-1.5 transition-colors relative",
                    location.pathname === item.path 
                      ? "text-primary" 
                      : "text-secondary hover:text-primary"
                  )}
                >
                  <div className="relative inline-flex items-center justify-center">
                    {item.icon}
                    {item.badgeCount && item.badgeCount > 0 && (
                      <Badge 
                        className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-bold bg-primary text-white"
                      >
                        {item.badgeCount > 9 ? '9+' : item.badgeCount}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              )
            )}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default BottomNav;
