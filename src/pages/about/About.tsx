
import React from 'react';
import Layout from '@/components/Layout';
import { useAboutData } from '@/hooks/useAboutData';
import WelcomeSection from '@/components/admin/about/WelcomeSection';
import MissionSection from '@/components/admin/about/MissionSection';
import DirectorySection from '@/components/admin/about/DirectorySection';
import FeaturesSection from '@/components/admin/about/FeaturesSection';

const About = () => {
  const { aboutData, isLoadingAbout } = useAboutData();

  if (isLoadingAbout) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading hotel information...</p>
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
          title={aboutData.welcome_title || "Welcome to Our Hotel"} 
          description={aboutData.welcome_description || "Hotel Genius is a luxury hotel located in the heart of the city."} 
          extendedDescription={aboutData.welcome_description_extended}
        />
        
        {aboutData.mission && (
          <MissionSection mission={aboutData.mission} />
        )}
        
        <FeaturesSection features={aboutData.features || []} />
        
        <DirectorySection 
          title={aboutData.directory_title || "Hotel Directory & Information"}
          importantNumbers={aboutData.important_numbers || []}
          facilities={aboutData.facilities || []}
          hotelPolicies={aboutData.hotel_policies || []}
          additionalInfo={aboutData.additional_info || []}
        />
      </div>
    </Layout>
  );
};

export default About;
