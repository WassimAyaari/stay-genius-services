
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface HeroSectionProps {
  heroImage: string;
}

const HeroSection = ({ heroImage }: HeroSectionProps) => {
  const { t, i18n } = useTranslation();
  
  // Debug logging for language and translations
  useEffect(() => {
    console.log("HeroSection - Current language:", i18n.language);
    console.log("HeroSection - Title translation:", t('feedback.hero.title'));
    console.log("HeroSection - Subtitle translation:", t('feedback.hero.subtitle'));
    console.log("HeroSection rendered with image:", heroImage);
  }, [heroImage, i18n.language, t]);

  return (
    <div className="relative mb-8 rounded-3xl overflow-hidden">
      <img 
        src={heroImage} 
        alt="Feedback" 
        className="w-full h-64 object-cover" 
        onError={(e) => {
          console.error("Error loading image:", e);
          // Fallback à une image par défaut si celle-ci ne charge pas
          e.currentTarget.src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
        <h1 className="text-3xl font-bold mb-2">{t('feedback.hero.title')}</h1>
        <p className="text-xl mb-6">{t('feedback.hero.subtitle')}</p>
      </div>
    </div>
  );
};

export default HeroSection;
