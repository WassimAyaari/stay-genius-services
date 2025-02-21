
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainMenu from './MainMenu';
import UserMenu from './UserMenu';
import BottomNav from './BottomNav';
import { Button } from './ui/button';
import { ChevronLeft, MessageCircle } from 'lucide-react';

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
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 w-40">
              {!isHomePage && (
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}
                  className="animate-in fade-in duration-300">
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}
              <MainMenu />
            </div>

            <div className="flex-1 flex justify-center">
              <button 
                onClick={() => navigate('/')}
                className="text-xl font-semibold text-primary hover:opacity-80 transition-opacity"
              >
                Hotel Genius
              </button>
            </div>
            
            <div className="flex items-center gap-4 w-40 justify-end">
              <button 
                onClick={() => navigate('/messages')}
                className="relative hover:opacity-60 transition-opacity"
              >
                <MessageCircle className="h-[26px] w-[26px] stroke-[1.5px]" />
                <span className="absolute -top-1 -right-1 h-[18px] w-[18px] bg-red-500 rounded-full text-[11px] text-white flex items-center justify-center font-medium border-2 border-white">
                  2
                </span>
              </button>
              <UserMenu username="Emma Watson" roomNumber="401" />
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
