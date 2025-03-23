
import React, { useState, useEffect } from 'react';
import { useHotelConfig } from '@/hooks/useHotelConfig';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, AlertTriangle } from 'lucide-react';
import Layout from '@/components/Layout';
import WelcomeSection from '@/components/admin/about/WelcomeSection';
import DirectorySection from '@/components/admin/about/DirectorySection';
import FeaturesSection from '@/components/admin/about/FeaturesSection';
import MissionSection from '@/components/admin/about/MissionSection';
import { toast } from 'sonner';

const AboutEditor = () => {
  const { aboutData, isLoadingAbout, aboutError, updateAboutData, createInitialAboutData } = useHotelConfig();
  const [formData, setFormData] = useState(null);
  const [activeTab, setActiveTab] = useState('welcome');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (aboutData) {
      // Parse JSON strings if necessary
      const parsedData = {
        ...aboutData,
        important_numbers: Array.isArray(aboutData.important_numbers) 
          ? aboutData.important_numbers 
          : JSON.parse(typeof aboutData.important_numbers === 'string' ? aboutData.important_numbers || '[]' : '[]'),
        hotel_policies: Array.isArray(aboutData.hotel_policies) 
          ? aboutData.hotel_policies 
          : JSON.parse(typeof aboutData.hotel_policies === 'string' ? aboutData.hotel_policies || '[]' : '[]'),
        facilities: Array.isArray(aboutData.facilities) 
          ? aboutData.facilities 
          : JSON.parse(typeof aboutData.facilities === 'string' ? aboutData.facilities || '[]' : '[]'),
        additional_info: Array.isArray(aboutData.additional_info) 
          ? aboutData.additional_info 
          : JSON.parse(typeof aboutData.additional_info === 'string' ? aboutData.additional_info || '[]' : '[]'),
        features: Array.isArray(aboutData.features) 
          ? aboutData.features 
          : JSON.parse(typeof aboutData.features === 'string' ? aboutData.features || '[]' : '[]'),
      };
      setFormData(parsedData);
    }
  }, [aboutData]);

  const handleCreateInitialData = async () => {
    setIsCreating(true);
    try {
      await createInitialAboutData();
      toast.success("Données initiales créées avec succès!");
    } catch (error) {
      console.error("Erreur lors de la création des données initiales:", error);
      toast.error("Erreur lors de la création des données initiales");
    } finally {
      setIsCreating(false);
    }
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInfoItemChange = (type, index, field, value) => {
    setFormData(prev => {
      const updatedItems = [...prev[type]];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      return {
        ...prev,
        [type]: updatedItems
      };
    });
  };

  const handleFeatureChange = (index, field, value) => {
    setFormData(prev => {
      const updatedFeatures = [...prev.features];
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        [field]: value
      };
      return {
        ...prev,
        features: updatedFeatures
      };
    });
  };

  const addInfoItem = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], { label: '', value: '' }]
    }));
  };

  const removeInfoItem = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { title: '', description: '', icon: 'History' }]
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;

    updateAboutData(formData);
  };

  // Loading state
  if (isLoadingAbout) {
    return (
      <Layout>
        <div className="container py-8">
          <h1 className="text-2xl font-bold mb-4">Chargement de l'éditeur...</h1>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state or no data
  if (aboutError || (!isLoadingAbout && !aboutData)) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-yellow-800">Aucune donnée trouvée</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Les données de la section "À Propos" n'existent pas encore dans la base de données.
                </p>
                <Button 
                  onClick={handleCreateInitialData} 
                  className="mt-3"
                  disabled={isCreating}
                >
                  {isCreating ? 'Création en cours...' : 'Créer les données initiales'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!formData) {
    return (
      <Layout>
        <div className="container py-8">
          <h1 className="text-2xl font-bold mb-4">Préparation des données...</h1>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Modifier la section À Propos</h1>
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <Save className="h-4 w-4" /> Sauvegarder
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="welcome">Accueil</TabsTrigger>
            <TabsTrigger value="directory">Répertoire</TabsTrigger>
            <TabsTrigger value="features">Caractéristiques</TabsTrigger>
            <TabsTrigger value="mission">Mission</TabsTrigger>
          </TabsList>

          <TabsContent value="welcome" className="space-y-4">
            <WelcomeSection
              welcomeTitle={formData.welcome_title}
              welcomeDescription={formData.welcome_description}
              welcomeDescriptionExtended={formData.welcome_description_extended}
              handleTextChange={handleTextChange}
            />
          </TabsContent>

          <TabsContent value="directory" className="space-y-4">
            <DirectorySection
              directoryTitle={formData.directory_title}
              importantNumbers={formData.important_numbers}
              hotelPolicies={formData.hotel_policies}
              facilities={formData.facilities}
              additionalInfo={formData.additional_info}
              handleTextChange={handleTextChange}
              addInfoItem={addInfoItem}
              removeInfoItem={removeInfoItem}
              handleInfoItemChange={handleInfoItemChange}
            />
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <FeaturesSection
              features={formData.features}
              addFeature={addFeature}
              removeFeature={removeFeature}
              handleFeatureChange={handleFeatureChange}
            />
          </TabsContent>

          <TabsContent value="mission" className="space-y-4">
            <MissionSection
              mission={formData.mission}
              handleTextChange={handleTextChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AboutEditor;
