
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAboutData } from '@/hooks/useAboutData';
import WelcomeSection from '@/components/admin/about/WelcomeSection';
import MissionSection from '@/components/admin/about/MissionSection';
import FeaturesSection from '@/components/admin/about/FeaturesSection';
import InfoItemSection from '@/components/admin/about/InfoItemSection';
import DirectorySection from '@/components/admin/about/DirectorySection';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

const AboutEditor = () => {
  const { aboutData, isLoadingAbout, aboutError, updateAboutData, createInitialAboutData } = useAboutData();
  const [activeTab, setActiveTab] = useState('welcome');
  const [isCreating, setIsCreating] = useState(false);
  
  if (isLoadingAbout) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des informations...</span>
      </div>
    );
  }
  
  if (aboutError) {
    return (
      <Card className="p-8 m-4 text-center text-red-500">
        <h2 className="text-xl font-bold mb-4">Erreur de chargement</h2>
        <p>{aboutError.message}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </Card>
    );
  }
  
  const handleCreateAboutData = async () => {
    setIsCreating(true);
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
    } finally {
      setIsCreating(false);
    }
  };
  
  if (!aboutData) {
    return (
      <div className="p-8 text-center">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Aucune information trouvée</h2>
          <p className="mb-6">Les informations de la page "À propos" n'ont pas encore été configurées. Voulez-vous créer un contenu par défaut ?</p>
          <Button 
            onClick={handleCreateAboutData}
            disabled={isCreating}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              'Créer un contenu par défaut'
            )}
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Éditeur de la page À propos</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="welcome">Accueil</TabsTrigger>
          <TabsTrigger value="mission">Mission</TabsTrigger>
          <TabsTrigger value="features">Caractéristiques</TabsTrigger>
          <TabsTrigger value="directory">Annuaire</TabsTrigger>
        </TabsList>
        
        <TabsContent value="welcome" className="space-y-6">
          <WelcomeSection 
            welcomeTitle={aboutData.welcome_title}
            welcomeDescription={aboutData.welcome_description}
            welcomeDescriptionExtended={aboutData.welcome_description_extended}
            isEditing={true}
            onSave={(data) => updateAboutData({ ...aboutData, ...data })}
          />
        </TabsContent>
        
        <TabsContent value="mission">
          <MissionSection 
            mission={aboutData.mission} 
            isEditing={true}
            onSave={(mission) => updateAboutData({ ...aboutData, mission })}
          />
        </TabsContent>
        
        <TabsContent value="features">
          <FeaturesSection 
            features={aboutData.features} 
            isEditing={true}
            onSave={(features) => updateAboutData({ ...aboutData, features })}
          />
        </TabsContent>
        
        <TabsContent value="directory">
          <h2 className="text-xl font-semibold mb-4">Annuaire et informations</h2>
          <InfoItemSection 
            title="Titre de l'annuaire"
            items={[{ label: 'Titre', value: aboutData.directory_title }]}
            isEditing={true}
            onSave={(items) => updateAboutData({ ...aboutData, directory_title: String(items[0].value) })}
            singleItem={true}
          />
          
          <DirectorySection 
            directoryTitle={aboutData.directory_title}
            importantNumbers={aboutData.important_numbers}
            facilities={aboutData.facilities}
            hotelPolicies={aboutData.hotel_policies}
            additionalInfo={aboutData.additional_info}
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
