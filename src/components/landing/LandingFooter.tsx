import React from 'react';

const LandingFooter = () => {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <img
          src="/lovable-uploads/aab13959-5215-4313-87f8-c3012cdb27f0.png"
          alt="Hotel Genius"
          className="h-7 w-auto"
        />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Hotel Genius. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
