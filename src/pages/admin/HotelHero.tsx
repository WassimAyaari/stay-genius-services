
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { HotelHero, defaultHotelHero } from '@/lib/types';
import HeroForm from '@/components/admin/HeroForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Preview } from '@/components/admin/Preview';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

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
      const isNewHero = !data.id || data.id === '';
      console.log("Est un nouveau héro:", isNewHero);
      
      if (isNewHero) {
        // For creation, completely remove the id field from the data
        const heroData = {
          hotel_id: hotelId,
          background_image: data.background_image,
          title: data.title,
          subtitle: data.subtitle,
          search_placeholder: data.search_placeholder,
          status: data.status
        };
        
        console.log("Création d'une nouvelle section héro avec données:", heroData);
        
        const { data: newData, error } = await supabase
          .from('hotel_hero')
          .insert(heroData)
          .select();

        if (error) {
          console.error("Erreur lors de la création:", error);
          throw error;
        }
        
        if (newData && newData.length > 0) {
          console.log("Nouvelle section héro créée:", newData[0]);
          setHero(newData[0]);
          
          toast({
            title: "Succès",
            description: "Section héro créée",
          });
        } else {
          throw new Error("Aucune donnée retournée après la création");
        }
      } else {
        // For update
        console.log("Mise à jour d'une section héro existante, ID:", data.id);
        
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
          .select();

        if (error) {
          console.error("Erreur lors de la mise à jour:", error);
          throw error;
        }
        
        if (updatedData && updatedData.length > 0) {
          console.log("Section héro mise à jour:", updatedData[0]);
          setHero(updatedData[0]);
          
          toast({
            title: "Succès",
            description: "Section héro mise à jour",
          });
        } else {
          throw new Error("Aucune donnée retournée après la mise à jour");
        }
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

  const viewFullPreview = () => {
    window.open(`/hotels/${hotelId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Section Héro</CardTitle>
            <CardDescription>
              Configurez l'en-tête principal de votre page d'accueil
            </CardDescription>
          </div>
          <Button variant="outline" onClick={viewFullPreview} className="gap-2">
            <Eye size={16} />
            Voir le site complet
          </Button>
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
