
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainMenu from './MainMenu';
import UserMenu from './UserMenu';
import BottomNav from './BottomNav';
import { Button } from './ui/button';
import { ChevronLeft, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <header className="bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sticky top-0 left-0 right-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {!isHomePage && (
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}
                  className="animate-in fade-in duration-300">
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}
              <MainMenu />
            </div>
            
            <h1 className="text-xl font-semibold text-secondary absolute left-1/2 transform -translate-x-1/2">
              Stay Genius
            </h1>

            <div className="flex items-center gap-2">
              {!isHomePage && (
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}
                  className="animate-in fade-in duration-300">
                  <Home className="h-5 w-5" />
                </Button>
              )}
              <UserMenu username="John Doe" roomNumber="401" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="animate-in slide-in-from-bottom duration-500">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Layout;
