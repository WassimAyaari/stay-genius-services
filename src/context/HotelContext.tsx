
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Hotel, HotelConfig } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface HotelContextType {
  hotel: Hotel | null;
  loading: boolean;
  error: boolean;
  updateConfig: (newConfig: Partial<HotelConfig>) => Promise<void>;
}

const defaultContext: HotelContextType = {
  hotel: null,
  loading: true,
  error: false,
  updateConfig: async () => {}
};

const HotelContext = createContext<HotelContextType>(defaultContext);

export const useHotel = () => useContext(HotelContext);

interface HotelProviderProps {
  children: ReactNode;
  hotelId?: string;
}

// Function to safely convert Json to HotelConfig
const parseHotelConfig = (config: any): HotelConfig => {
  if (!config) {
    // Return default config if config is null or undefined
    return {
      theme: { primary: '#1e40af', secondary: '#4f46e5' },
      enabled_features: []
    };
  }
  
  return {
    theme: {
      primary: config.theme?.primary || '#1e40af',
      secondary: config.theme?.secondary || '#4f46e5'
    },
    enabled_features: Array.isArray(config.enabled_features) ? config.enabled_features : []
  };
};

export const HotelProvider: React.FC<HotelProviderProps> = ({ children, hotelId }) => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const params = useParams<{ hotelSlug?: string }>();
  const hotelSlug = params.hotelSlug;

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        let query = supabase.from('hotels').select('*');
        
        if (hotelId) {
          query = query.eq('id', hotelId);
        } else if (hotelSlug) {
          query = query.eq('subdomain', hotelSlug);
        } else {
          // Si aucun identifiant n'est fourni, ne rien faire
          setLoading(false);
          return;
        }

        const { data, error } = await query.single();

        if (error) {
          console.error('Error fetching hotel:', error);
          setError(true);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les données de l'hôtel",
          });
        } else {
          // Convertir le JSON brut en un objet HotelConfig typé avec sécurité
          const typedHotel: Hotel = {
            ...data,
            config: parseHotelConfig(data.config)
          };
          setHotel(typedHotel);
        }
      } catch (err) {
        console.error('Error in fetchHotel:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (hotelId || hotelSlug) {
      fetchHotel();
    }
  }, [hotelId, hotelSlug]);

  const updateConfig = async (newConfig: Partial<HotelConfig>) => {
    if (!hotel) return;

    try {
      // Préparer la configuration mise à jour en fusionnant l'existante avec les nouvelles valeurs
      const updatedConfig: HotelConfig = {
        ...hotel.config,
        ...newConfig
      };

      console.log('Updating config with:', updatedConfig);

      // Assurez-vous que updatedConfig est un objet JSON valide pour Supabase
      const { error } = await supabase
        .from('hotels')
        .update({ 
          config: updatedConfig
        })
        .eq('id', hotel.id);

      if (error) {
        console.error('Error updating hotel config:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour la configuration",
        });
        return;
      }

      // Mettre à jour l'état local
      setHotel({
        ...hotel,
        config: updatedConfig
      });

      toast({
        title: "Succès",
        description: "Configuration mise à jour avec succès",
      });
    } catch (err) {
      console.error('Error in updateConfig:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
      });
    }
  };

  return (
    <HotelContext.Provider value={{ hotel, loading, error, updateConfig }}>
      {children}
    </HotelContext.Provider>
  );
};
