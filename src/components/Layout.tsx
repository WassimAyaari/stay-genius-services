
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import MainMenu from './MainMenu';
import UserMenu from './UserMenu';
import NotificationMenu from './NotificationMenu';
import BottomNav from './BottomNav';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from './ui/scroll-area';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({
  children
}: LayoutProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isMessagePage = location.pathname === '/messages' || location.pathname.startsWith('/messages?');
  const isSpaManagerPage = location.pathname === '/admin/spa';
  const isMobile = useIsMobile();

  // For debugging, show current path
  console.log('Current path in Layout:', location.pathname);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header appears on all pages except messages page */}
      {!isMessagePage && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-xl">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <MainMenu />
              </div>

              <Link to="/" className="flex-1 flex justify-center items-center">
                <img 
                  src="/lovable-uploads/5d7793ad-e099-426f-84d1-18a8e00719e1.png" 
                  alt="Hotel Genius" 
                  className={cn("hover:opacity-80 transition-opacity filter brightness-110", isMobile ? "h-3" : "h-4")}
                />
              </Link>
              
              <div className={cn("flex items-center gap-2 justify-end", isMobile ? "w-[100px]" : "w-[110px]")}>
                <NotificationMenu />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={cn("container mx-auto px-[9px]", !isMessagePage && "pt-16 pb-24", isSpaManagerPage && "h-screen flex flex-col")}>
        {isSpaManagerPage ? (
          <ScrollArea className="flex-1 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="py-4"
            >
              {children}
            </motion.div>
          </ScrollArea>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        )}
      </main>

      {!isMessagePage && <BottomNav />}
    </div>
  );
};

export default Layout;
