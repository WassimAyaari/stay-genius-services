
import React from 'react';

interface HeroSectionProps {
  heroImage: string;
}

const HeroSection = ({ heroImage }: HeroSectionProps) => {
  return (
    <div className="relative mb-8 rounded-3xl overflow-hidden">
      <img 
        src={heroImage} 
        alt="Feedback" 
        className="w-full h-64 object-cover" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Your Feedback Matters</h1>
        <p className="text-xl mb-6">Help us improve your experience</p>
      </div>
    </div>
  );
};

export default HeroSection;
