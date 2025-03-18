
import React, { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import MainServicesSection from '@/components/home/MainServicesSection';
import FeaturedExperienceSection from '@/components/home/FeaturedExperienceSection';
import EventsStories from '@/components/EventsStories';
import TodayHighlightsSection from '@/components/home/TodayHighlightsSection';
import AdditionalServicesSection from '@/components/home/AdditionalServicesSection';
import AssistanceSection from '@/components/home/AssistanceSection';

const SectionWrapper = ({ children, id }: { children: React.ReactNode; id: string }) => {
  return (
    <div id={id} className="section-container">
      {children}
    </div>
  );
};

const Index = () => {
  console.log("Index page rendering started");
  
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <SectionWrapper id="hero-section">
        <Suspense fallback={<div className="p-6 text-center">Loading hero section...</div>}>
          <HeroSection />
        </Suspense>
      </SectionWrapper>

      {/* Main Services Section */}
      <SectionWrapper id="main-services">
        <Suspense fallback={<div className="p-6 text-center">Loading services...</div>}>
          <MainServicesSection />
        </Suspense>
      </SectionWrapper>

      {/* Featured Experience */}
      <SectionWrapper id="featured-experience">
        <Suspense fallback={<div className="p-6 text-center">Loading experiences...</div>}>
          <FeaturedExperienceSection />
        </Suspense>
      </SectionWrapper>

      {/* Instagram-style Stories Section */}
      <SectionWrapper id="events-stories">
        <Suspense fallback={<div className="p-6 text-center">Loading events...</div>}>
          <section className="px-6 mb-10">
            <EventsStories />
          </section>
        </Suspense>
      </SectionWrapper>

      {/* Today's Highlights Section */}
      <SectionWrapper id="highlights">
        <Suspense fallback={<div className="p-6 text-center">Loading highlights...</div>}>
          <TodayHighlightsSection />
        </Suspense>
      </SectionWrapper>

      {/* Additional Services */}
      <SectionWrapper id="additional-services">
        <Suspense fallback={<div className="p-6 text-center">Loading additional services...</div>}>
          <AdditionalServicesSection />
        </Suspense>
      </SectionWrapper>

      {/* Need Assistance */}
      <SectionWrapper id="assistance">
        <Suspense fallback={<div className="p-6 text-center">Loading assistance section...</div>}>
          <AssistanceSection />
        </Suspense>
      </SectionWrapper>
    </div>
  );
};

export default Index;
