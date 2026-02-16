import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const LandingHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/lovable-uploads/aab13959-5215-4313-87f8-c3012cdb27f0.png"
            alt="Hotel Genius"
            className="h-9 w-auto"
          />
          <span className="text-xl font-bold text-foreground tracking-tight">Hotel Genius</span>
        </Link>
        <Link to="/auth/login">
          <Button variant="ghost" size="sm" className="gap-2">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default LandingHeader;
