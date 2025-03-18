import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BedDouble, UtensilsCrossed, Info, Phone, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import MainMenu from './MainMenu';
const BottomNav = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll to hide/show navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 20) {
        // Scrolling down - hide the navbar
        setIsVisible(false);
      } else {
        // Scrolling up - show the navbar
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  const navItems = [{
    icon: <Info className="w-6 h-6" />,
    label: 'About Us',
    path: '/about'
  }, {
    icon: <UtensilsCrossed className="w-6 h-6" />,
    label: 'Dining',
    path: '/dining'
  }, {
    icon: <BedDouble className="w-6 h-6" />,
    label: 'My Room',
    path: '/my-room'
  }, {
    icon: <Phone className="w-6 h-6" />,
    label: 'Request',
    path: '/services'
  }, {
    icon: <Building className="w-6 h-6" />,
    label: 'Directory',
    path: '/hotel-directory',
    isMenu: true
  }];
  return <AnimatePresence>
      {isVisible && <motion.nav initial={{
      y: "100%"
    }} animate={{
      y: 0
    }} exit={{
      y: "100%"
    }} transition={{
      type: "spring",
      stiffness: 300,
      damping: 30
    }} className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t shadow-lg z-50">
          <div className="flex justify-around items-center h-16">
            {navItems.map(item => item.isMenu ? <div key={`${item.path}-${item.label}`} className={cn("flex flex-col items-center justify-center w-full h-full gap-1 transition-colors", "text-gray-500 hover:text-primary")}>
                  <MainMenu buttonClassName="flex flex-col items-center justify-center" />
                  
                </div> : <Link key={`${item.path}-${item.label}`} to={item.path} className={cn("flex flex-col items-center justify-center w-full h-full gap-1 transition-colors", location.pathname === item.path ? "text-primary" : "text-gray-500 hover:text-primary")}>
                  {item.icon}
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>)}
          </div>
        </motion.nav>}
    </AnimatePresence>;
};
export default BottomNav;