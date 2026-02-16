import React from 'react';
import { Link } from 'react-router-dom';

const LandingHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-center">
        <Link to="/">
          <img
            src="/lovable-uploads/aab13959-5215-4313-87f8-c3012cdb27f0.png"
            alt="Hotel Genius"
            className="h-9 w-auto"
          />
        </Link>
      </div>
    </header>
  );
};

export default LandingHeader;
