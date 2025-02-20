
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainMenu from './MainMenu';
import UserMenu from './UserMenu';
import { Button } from './ui/button';
import { ChevronLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const Layout = ({ children, showBackButton }: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {showBackButton ? (
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
            ) : (
              <MainMenu />
            )}
            <h1 className="text-2xl font-semibold text-secondary">Stay Genius</h1>
            <UserMenu username="John Doe" roomNumber="401" />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {children}
      </main>
    </div>
  );
};

export default Layout;
