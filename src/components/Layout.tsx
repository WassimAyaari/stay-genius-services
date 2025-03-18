
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import MainMenu from './MainMenu';
import UserMenu from './UserMenu';
import BottomNav from './BottomNav';
import { ChevronLeft, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({
  children
}: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 w-[100px]">
              {!isHomePage && (
                <Link to="/" className="hover:bg-gray-100/50 p-2 rounded-lg transition-colors">
                  <ChevronLeft className="h-5 w-5 text-secondary" />
                </Link>
              )}
              {/* Only show MainMenu on the home page */}
              {isHomePage && <MainMenu />}
            </div>

            <Link to="/" className="flex-1 flex justify-center items-center">
              <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent hover:opacity-90 transition-opacity">
                Hotel Genius
              </span>
            </Link>
            
            <div className="flex items-center gap-3 w-[100px] justify-end">
              <UserMenu username="Emma Watson" roomNumber="401" />
              <Link 
                to="/messages" 
                className="relative hover:bg-gray-100/50 p-2 rounded-lg transition-colors"
              >
                <MessageSquare className="h-5 w-5 text-secondary" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-[10px] text-white flex items-center justify-center font-medium border-2 border-white">
                  2
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto pt-16 pb-24 px-[9px]">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Layout;
