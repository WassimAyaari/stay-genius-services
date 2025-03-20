
import React from 'react';
import { HotelHero } from '@/lib/types';

interface HotelHeroSectionProps {
  heroData: HotelHero | null;
}

const HotelHeroSection = ({ heroData }: HotelHeroSectionProps) => {
  if (!heroData) return null;

  return (
    <div className="w-full bg-cover bg-center h-96" style={{ backgroundImage: `url(${heroData.background_image})` }}>
      <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-40">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{heroData.title}</h1>
          <p className="text-xl md:text-2xl mb-6">{heroData.subtitle}</p>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder={heroData.search_placeholder}
              className="w-full px-4 py-2 rounded-lg text-gray-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelHeroSection;
