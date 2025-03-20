
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

      let result;
      if (data.id) {
        // Update existing hero
        const { data: updatedData, error } = await supabase
          .from('hotel_hero')
          .update(heroData)
          .eq('id', data.id)
          .select()
          .single();

        if (error) throw error;
        result = updatedData;
        toast({
          title: "Succès",
          description: "Section héro mise à jour",
        });
      } else {
        // Create new hero
        const { data: newData, error } = await supabase
          .from('hotel_hero')
          .insert({ ...heroData })
          .select()
          .single();

        if (error) throw error;
        result = newData;
        toast({
          title: "Succès",
          description: "Section héro créée",
        });
      }

      setHero(result);
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
      <HeroForm initialData={hero} onSubmit={handleSaveHero} />
    </div>
  );
};

export default HotelHeroSection;
