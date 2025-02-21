
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BedDouble, UtensilsCrossed, Heart, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [startY, setStartY] = useState(0);

  const navItems = [
    { icon: <Home className="w-6 h-6" />, label: 'Home', path: '/' },
    { icon: <BedDouble className="w-6 h-6" />, label: 'Room', path: '/my-room' },
    { icon: <UtensilsCrossed className="w-6 h-6" />, label: 'Dining', path: '/dining' },
    { icon: <Heart className="w-6 h-6" />, label: 'Spa', path: '/spa' },
    { icon: <Phone className="w-6 h-6" />, label: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const diff = startY - currentY;

      if (diff > 50) { // Swipe up
        setIsVisible(false);
      } else if (diff < -50) { // Swipe down
        setIsVisible(true);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [startY]);

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: "100%" }}
        animate={{ y: isVisible ? 0 : "100%" }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 border-t shadow-lg pb-safe z-50"
      >
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
      </motion.nav>
    </AnimatePresence>
  );
};

export default BottomNav;
