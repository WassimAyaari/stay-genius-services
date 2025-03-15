
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import MainServicesSection from '@/components/home/MainServicesSection';
import FeaturedExperienceSection from '@/components/home/FeaturedExperienceSection';
import EventsStories from '@/components/EventsStories';
import TodayHighlightsSection from '@/components/home/TodayHighlightsSection';
import AdditionalServicesSection from '@/components/home/AdditionalServicesSection';
import AssistanceSection from '@/components/home/AssistanceSection';

const Index = () => {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Services Section */}
      <MainServicesSection />

      {/* Featured Experience */}
      <FeaturedExperienceSection />

      {/* Instagram-style Stories Section */}
      <section className="px-6 mb-10">
        <EventsStories />
      </section>

      {/* Today's Highlights Section */}
      <TodayHighlightsSection />

      {/* Additional Services */}
      <AdditionalServicesSection />

      {/* Need Assistance */}
      <AssistanceSection />
    </div>
  );
};

export default Index;
