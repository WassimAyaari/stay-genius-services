
import React from 'react';
import Layout from '@/components/Layout';
import { useAboutData } from '@/hooks/useAboutData';
import WelcomeSection from '@/components/admin/about/WelcomeSection';
import MissionSection from '@/components/admin/about/MissionSection';
import DirectorySection from '@/components/admin/about/DirectorySection';
import FeaturesSection from '@/components/admin/about/FeaturesSection';
import { Skeleton } from '@/components/ui/skeleton';

const About = () => {
  const { aboutData, isLoadingAbout } = useAboutData();

  if (isLoadingAbout) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="space-y-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!aboutData) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Hotel information not available.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <WelcomeSection 
          welcomeTitle={aboutData.welcome_title} 
          welcomeDescription={aboutData.welcome_description} 
          welcomeDescriptionExtended={aboutData.welcome_description_extended}
          heroImage={aboutData.hero_image}
        />
        
        {aboutData.mission && (
          <MissionSection mission={aboutData.mission} />
        )}
        
        <FeaturesSection features={aboutData.features} />
        
        <DirectorySection 
          directoryTitle={aboutData.directory_title}
          importantNumbers={aboutData.important_numbers}
          facilities={aboutData.facilities}
          hotelPolicies={aboutData.hotel_policies}
          additionalInfo={aboutData.additional_info}
        />
      </div>
    </Layout>
  );
};

export default About;
