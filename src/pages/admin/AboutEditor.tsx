
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAboutData } from '@/hooks/useAboutData';
import WelcomeSection from '@/components/admin/about/WelcomeSection';
import MissionSection from '@/components/admin/about/MissionSection';
import FeaturesSection from '@/components/admin/about/FeaturesSection';
import InfoItemSection from '@/components/admin/about/InfoItemSection';
import DirectorySection from '@/components/admin/about/DirectorySection';
import { InfoItem, FeatureItem } from '@/lib/types';

const AboutEditor = () => {
  const { aboutData, isLoadingAbout, aboutError, updateAboutData, createInitialAboutData } = useAboutData();
  const [activeTab, setActiveTab] = useState('welcome');
  
  if (isLoadingAbout) {
    return <div className="p-8 text-center">Loading about page content...</div>;
  }
  
  if (aboutError) {
    return <div className="p-8 text-center text-red-500">Error loading content: {aboutError.message}</div>;
  }
  
  const handleCreateAboutData = async () => {
    // Default about data
    const defaultAboutData = {
      welcome_title: 'Welcome to Hotel Genius',
      welcome_description: 'A luxury hotel experience in the heart of the city.',
      welcome_description_extended: 'Since our establishment, we have been committed to creating a home away from home for our guests.',
      mission: 'To provide exceptional hospitality experiences by creating memorable moments for our guests.',
      features: [
        { icon: 'History', title: 'Our History', description: 'Established with a rich heritage' },
        { icon: 'Building2', title: 'Our Property', description: 'Luxury rooms and premium facilities' },
        { icon: 'Users', title: 'Our Team', description: 'Dedicated staff committed to excellence' },
        { icon: 'Award', title: 'Our Awards', description: 'Recognized for outstanding service' }
      ],
      important_numbers: [
        { label: 'Reception', value: 'Dial 0' },
        { label: 'Room Service', value: 'Dial 1' },
        { label: 'Concierge', value: 'Dial 2' }
      ],
      facilities: [
        { label: 'Swimming Pool', value: 'Level 5' },
        { label: 'Fitness Center', value: 'Level 3' },
        { label: 'Spa & Wellness', value: 'Level 4' }
      ],
      hotel_policies: [
        { label: 'Check-in', value: '3:00 PM' },
        { label: 'Check-out', value: '12:00 PM' },
        { label: 'Breakfast', value: '6:30 AM - 10:30 AM' }
      ],
      additional_info: [
        { label: 'Wi-Fi', value: 'Network "HotelGenius" - Password provided at check-in' },
        { label: 'Parking', value: 'Valet service available' }
      ],
      directory_title: 'Hotel Directory & Information'
    };
    
    try {
      await createInitialAboutData(defaultAboutData);
      window.location.reload();
    } catch (error) {
      console.error('Error creating about data:', error);
    }
  };
  
  if (!aboutData) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">No about page content found. Create default content?</p>
        <button 
          onClick={handleCreateAboutData}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Create Default Content
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">About Page Editor</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
          <TabsTrigger value="mission">Mission</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="directory">Directory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="welcome" className="space-y-6">
          <WelcomeSection 
            welcomeTitle={aboutData.welcome_title || ''}
            welcomeDescription={aboutData.welcome_description || ''}
            welcomeDescriptionExtended={aboutData.welcome_description_extended || ''}
            isEditing={true}
            onSave={(data) => updateAboutData({ ...aboutData, ...data })}
          />
        </TabsContent>
        
        <TabsContent value="mission">
          <MissionSection 
            mission={aboutData.mission || ''} 
            isEditing={true}
            onSave={(mission) => updateAboutData({ ...aboutData, mission })}
          />
        </TabsContent>
        
        <TabsContent value="features">
          <FeaturesSection 
            features={aboutData.features || []} 
            isEditing={true}
            onSave={(features) => updateAboutData({ ...aboutData, features })}
          />
        </TabsContent>
        
        <TabsContent value="directory">
          <h2 className="text-xl font-semibold mb-4">Directory Information</h2>
          <InfoItemSection 
            title="Directory Title"
            items={[{ label: 'Title', value: aboutData.directory_title || 'Hotel Directory' }]}
            isEditing={true}
            onSave={(items) => updateAboutData({ ...aboutData, directory_title: String(items[0].value) })}
            singleItem={true}
          />
          
          <DirectorySection 
            directoryTitle={aboutData.directory_title || 'Hotel Directory'}
            importantNumbers={aboutData.important_numbers || []}
            facilities={aboutData.facilities || []}
            hotelPolicies={aboutData.hotel_policies || []}
            additionalInfo={aboutData.additional_info || []}
            isEditing={true}
            onSaveImportantNumbers={(items) => updateAboutData({ ...aboutData, important_numbers: items })}
            onSaveFacilities={(items) => updateAboutData({ ...aboutData, facilities: items })}
            onSaveHotelPolicies={(items) => updateAboutData({ ...aboutData, hotel_policies: items })}
            onSaveAdditionalInfo={(items) => updateAboutData({ ...aboutData, additional_info: items })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AboutEditor;
