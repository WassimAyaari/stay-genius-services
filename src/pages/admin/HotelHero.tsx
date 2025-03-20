
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { HotelHero, defaultHotelHero } from '@/lib/types';
import HeroForm from '@/components/admin/HeroForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Preview } from '@/components/admin/Preview';

interface HotelHeroSectionProps {
  hotelId: string;
  initialData?: HotelHero | null;
  onSave?: () => void;
}

const HotelHeroSection = ({ hotelId, initialData, onSave }: HotelHeroSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hero, setHero] = useState<HotelHero>(initialData || { ...defaultHotelHero, hotel_id: hotelId });
  const [activeTab, setActiveTab] = useState("edit");

  const handleSaveHero = async (data: HotelHero) => {
    setIsSubmitting(true);
    try {
      if (!hotelId) {
        throw new Error("ID de l'hôtel manquant");
      }

      console.log("Données à envoyer:", data);
      console.log("Hotel ID:", hotelId);
      console.log("Type de Hotel ID:", typeof hotelId);
      
      // Determine if this is a create or update operation
      const isNewHero = !data.id || data.id.trim() === '';
      
      if (isNewHero) {
        // For creation, prepare data WITHOUT the ID field at all
        const heroData = {
          hotel_id: hotelId,
          background_image: data.background_image,
          title: data.title,
          subtitle: data.subtitle,
          search_placeholder: data.search_placeholder,
          status: data.status
        };
        
        console.log("Création d'une nouvelle section héro avec les données:", heroData);
        
        const { data: newData, error } = await supabase
          .from('hotel_hero')
          .insert(heroData)
          .select()
          .single();

        if (error) {
          console.error("Erreur lors de la création:", error);
          throw error;
        }
        
        console.log("Nouvelle section héro créée:", newData);
        setHero(newData);
        
        toast({
          title: "Succès",
          description: "Section héro créée",
        });
      } else {
        // For update, we can include the ID
        const { data: updatedData, error } = await supabase
          .from('hotel_hero')
          .update({
            hotel_id: hotelId,
            background_image: data.background_image,
            title: data.title,
            subtitle: data.subtitle,
            search_placeholder: data.search_placeholder,
            status: data.status
          })
          .eq('id', data.id)
          .select()
          .single();

        if (error) {
          console.error("Erreur lors de la mise à jour:", error);
          throw error;
        }
        
        console.log("Section héro mise à jour:", updatedData);
        setHero(updatedData);
        
        toast({
          title: "Succès",
          description: "Section héro mise à jour",
        });
      }

      if (onSave) onSave();
      
      // Passer à l'onglet de prévisualisation après l'enregistrement
      setActiveTab("preview");
    } catch (error) {
      console.error("Error saving hero section:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la section héro",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Section Héro</CardTitle>
          <CardDescription>
            Configurez l'en-tête principal de votre page d'accueil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="edit">Modifier</TabsTrigger>
              <TabsTrigger value="preview">Prévisualiser</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit">
              <HeroForm initialData={hero} onSubmit={handleSaveHero} isSubmitting={isSubmitting} />
            </TabsContent>
            
            <TabsContent value="preview">
              <Preview data={hero} type="hero" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelHeroSection;
