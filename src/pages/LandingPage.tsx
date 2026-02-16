import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingHero from '@/components/landing/LandingHero';
import HowItWorks from '@/components/landing/HowItWorks';
import HotelDirectory from '@/components/landing/HotelDirectory';
import LandingFooter from '@/components/landing/LandingFooter';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="pt-16">
        <LandingHero />
        <HowItWorks />
        <HotelDirectory />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
