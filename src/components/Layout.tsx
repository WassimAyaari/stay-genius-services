
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import MainMenu from './MainMenu';
import UserMenu from './UserMenu';
import NotificationMenu from './NotificationMenu';
import BottomNav from './BottomNav';
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
  const isSpaManagerPage = location.pathname === '/admin/spa';
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-lg">
          <div className="container mx-auto px-4">
            <div className="relative flex items-center h-16">
              {/* Left section - Menu */}
              <div className="absolute left-0 flex items-center">
                <MainMenu />
              </div>

              {/* Center section - Logo - absolutely centered */}
              <div className="w-full flex justify-center items-center">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                  <img 
                    src="/lovable-uploads/aab13959-5215-4313-87f8-c3012cdb27f0.png" 
                    alt="Hotel Genius" 
                    className={cn("filter brightness-110", isMobile ? "h-5" : "h-7")}
                  />
                </Link>
              </div>
              
              {/* Right section - Notifications and User Menu */}
              <div className="absolute right-0 flex items-center gap-2">
                <NotificationMenu />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

      <main className={cn("container mx-auto px-[9px] pt-16 pb-24", isSpaManagerPage && "h-screen flex flex-col")}>
        {isSpaManagerPage ? (
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="py-4">
              {children}
            </div>
          </ScrollArea>
        ) : (
          <div>
            {children}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Layout;
