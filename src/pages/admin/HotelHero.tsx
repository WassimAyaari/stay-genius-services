
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { HotelHero, defaultHotelHero } from '@/lib/types';
import HeroForm from '@/components/admin/HeroForm';

interface HotelHeroSectionProps {
  hotelId: string;
  initialData?: HotelHero | null;
  onSave?: () => void;
}

const HotelHeroSection = ({ hotelId, initialData, onSave }: HotelHeroSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hero, setHero] = useState<HotelHero>(initialData || { ...defaultHotelHero, hotel_id: hotelId });

  const handleSaveHero = async (data: HotelHero) => {
    setIsSubmitting(true);
    try {
      if (!hotelId) {
        throw new Error("ID de l'hôtel manquant");
      }

      const heroData = {
        ...data,
        hotel_id: hotelId,
      };

      // Supprimer complètement la propriété id si elle est vide
      if (!heroData.id || heroData.id === '') {
        delete heroData.id;
        
        // Création d'un nouveau hero
        console.log("Création d'une nouvelle section hero avec les données:", heroData);
        const { data: newData, error } = await supabase
          .from('hotel_hero')
          .insert(heroData)
          .select()
          .single();

        if (error) {
          console.error("Erreur lors de la création:", error);
          throw error;
        }
        
        console.log("Nouvelle section hero créée:", newData);
        setHero(newData);
        toast({
          title: "Succès",
          description: "Section héro créée",
        });
      } else {
        // Mise à jour d'un hero existant
        console.log("Mise à jour de la section hero avec ID:", heroData.id);
        const { data: updatedData, error } = await supabase
          .from('hotel_hero')
          .update(heroData)
          .eq('id', heroData.id)
          .select()
          .single();

        if (error) {
          console.error("Erreur lors de la mise à jour:", error);
          throw error;
        }
        
        console.log("Section hero mise à jour:", updatedData);
        setHero(updatedData);
        toast({
          title: "Succès",
          description: "Section héro mise à jour",
        });
      }

      if (onSave) onSave();
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

  return (
    <div>
      <HeroForm initialData={hero} onSubmit={handleSaveHero} isSubmitting={isSubmitting} />
    </div>
  );
};

export default HotelHeroSection;
