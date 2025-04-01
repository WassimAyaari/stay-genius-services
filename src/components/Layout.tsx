
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import MainMenu from './MainMenu';
import UserMenu from './UserMenu';
import NotificationMenu from './NotificationMenu';
import BottomNav from './BottomNav';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({
  children
}: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isMessagePage = location.pathname === '/messages' || location.pathname.startsWith('/messages?');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {!isMessagePage && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2 w-[100px]">
                {!isHomePage && (
                  <Link 
                    to={location.state?.from || "/"} 
                    className="hover:bg-gray-100 p-2.5 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-secondary" />
                  </Link>
                )}
                <MainMenu />
              </div>

              <Link to="/" className="flex-1 flex justify-center items-center">
                <span className="text-xl font-bold text-secondary hover:opacity-80 transition-opacity">
                  Hotel Genius
                </span>
              </Link>
              
              <div className="flex items-center gap-3 w-[120px] justify-end">
                <NotificationMenu />
                <UserMenu />
                <Link 
                  to="/messages" 
                  state={{ from: location.pathname }}
                  className="relative hover:bg-gray-100 p-2.5 rounded-full transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-secondary" />
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary rounded-full text-[10px] text-white flex items-center justify-center font-medium border border-white">
                    2
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={cn("container mx-auto px-[9px]", !isMessagePage && "pt-16 pb-24")}>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.div>
      </main>

      {!isMessagePage && <BottomNav />}
    </div>
  );
};

// Make sure to import cn from utils
import { cn } from '@/lib/utils';

export default Layout;
