
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HotelConfig, HotelAbout } from '@/lib/types';
import { toast } from 'sonner';

export const useHotelConfig = () => {
  const queryClient = useQueryClient();

  const fetchHotelConfig = async (): Promise<HotelConfig> => {
    const { data, error } = await supabase
      .from('hotel_config')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching hotel config:', error);
      throw error;
    }

    return data as HotelConfig;
  };

  const updateHotelConfig = async (config: Partial<HotelConfig>): Promise<HotelConfig> => {
    const { data, error } = await supabase
      .from('hotel_config')
      .update(config)
      .eq('id', config.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating hotel config:', error);
      throw error;
    }

    return data as HotelConfig;
  };

  const fetchHotelAbout = async () => {
    const { data, error } = await supabase
      .from('hotel_about')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching hotel about:', error);
      throw error;
    }

    return data;
  };

  const updateHotelAbout = async (aboutData: any) => {
    const { data, error } = await supabase
      .from('hotel_about')
      .update(aboutData)
      .eq('id', aboutData.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating hotel about:', error);
      throw error;
    }

    return data;
  };

  const createInitialAboutData = async () => {
    // Données par défaut pour la section "À Propos"
    const defaultAboutData = {
      // Champs obligatoires qui manquaient
      title: "À Propos de l'Hôtel",
      description: "Découvrez notre histoire et nos services",
      icon: "Info",
      action_text: "En savoir plus",
      action_link: "/about",
      
      // Champs existants
      welcome_title: "Bienvenue à notre hôtel",
      welcome_description: "Hotel Genius est un hôtel de luxe situé au cœur de la ville. Nous sommes fiers de fournir un service exceptionnel et une expérience inoubliable à tous nos clients.",
      welcome_description_extended: "Depuis notre création en 2010, nous nous sommes engagés à créer un chez-soi loin de chez soi pour nos clients, en combinant des équipements modernes avec une hospitalité classique.",
      directory_title: "Répertoire & Informations de l'Hôtel",
      mission: "Offrir des expériences d'hospitalité exceptionnelles en créant des moments mémorables pour nos clients grâce à un service personnalisé, des hébergements luxueux et des offres innovantes.",
      important_numbers: [
        { label: "Réception", value: "Composez le 0" },
        { label: "Service d'étage", value: "Composez le 1" },
        { label: "Concierge", value: "Composez le 2" },
        { label: "Entretien ménager", value: "Composez le 3" },
        { label: "Urgence", value: "Composez le 9" }
      ],
      hotel_policies: [
        { label: "Enregistrement", value: "15h00" },
        { label: "Départ", value: "12h00" },
        { label: "Petit-déjeuner", value: "6h30 - 10h30" },
        { label: "Heures de piscine", value: "7h00 - 22h00" },
        { label: "Politique pour animaux", value: "Chambres acceptant les animaux disponibles" }
      ],
      facilities: [
        { label: "Piscine", value: "Niveau 5" },
        { label: "Centre de fitness", value: "Niveau 3" },
        { label: "Spa & Bien-être", value: "Niveau 4" },
        { label: "Centre d'affaires", value: "Niveau 2" },
        { label: "Restaurants", value: "Hall & Niveau 20" }
      ],
      additional_info: [
        { label: "Wi-Fi", value: "Réseau \"HotelGenius\" - Mot de passe fourni à l'enregistrement" },
        { label: "Stationnement", value: "Service voiturier disponible" },
        { label: "Transfert aéroport", value: "Contactez le concierge" },
        { label: "Change de devises", value: "Disponible à la réception" },
        { label: "Services médicaux", value: "Contactez la réception pour assistance" }
      ],
      features: [
        { 
          title: "Notre Histoire", 
          description: "Établi en 2010 avec un riche patrimoine", 
          icon: "History" 
        },
        { 
          title: "Notre Propriété", 
          description: "250 chambres de luxe et installations premium", 
          icon: "Building2" 
        },
        { 
          title: "Notre Équipe", 
          description: "Personnel dévoué engagé à l'excellence", 
          icon: "Users" 
        },
        { 
          title: "Nos Récompenses", 
          description: "Reconnu pour un service exceptionnel", 
          icon: "Award" 
        }
      ],
      status: "active"
    };

    console.log("Tentative de création des données initiales");
    
    // Insérer les données
    const { data, error } = await supabase
      .from('hotel_about')
      .insert(defaultAboutData)
      .select()
      .single();

    if (error) {
      console.error('Error creating initial hotel about data:', error);
      throw error;
    }

    // Rafraîchir les données dans le cache
    queryClient.invalidateQueries({ queryKey: ['hotel-about'] });
    
    return data;
  };

  const { data: hotelConfig, isLoading, error } = useQuery({
    queryKey: ['hotel-config'],
    queryFn: fetchHotelConfig,
  });

  const { data: aboutData, isLoading: isLoadingAbout, error: aboutError } = useQuery({
    queryKey: ['hotel-about'],
    queryFn: fetchHotelAbout,
  });

  const mutation = useMutation({
    mutationFn: updateHotelConfig,
    onSuccess: (data) => {
      queryClient.setQueryData(['hotel-config'], data);
      toast.success('Configuration de l\'hôtel mise à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating hotel config:', error);
      toast.error('Échec de la mise à jour de la configuration de l\'hôtel');
    },
  });

  const aboutMutation = useMutation({
    mutationFn: updateHotelAbout,
    onSuccess: (data) => {
      queryClient.setQueryData(['hotel-about'], data);
      toast.success('Section À Propos mise à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating about section:', error);
      toast.error('Échec de la mise à jour de la section À Propos');
    },
  });

  const createAboutMutation = useMutation({
    mutationFn: createInitialAboutData,
    onSuccess: (data) => {
      queryClient.setQueryData(['hotel-about'], data);
      toast.success('Données initiales créées avec succès');
    },
    onError: (error) => {
      console.error('Error creating initial about data:', error);
      toast.error('Échec de la création des données initiales');
    },
  });

  return {
    hotelConfig,
    isLoading,
    error,
    updateHotelConfig: mutation.mutate,
    isUpdating: mutation.isPending,
    
    // About section data and functions
    aboutData,
    isLoadingAbout,
    aboutError,
    updateAboutData: aboutMutation.mutate,
    isUpdatingAbout: aboutMutation.isPending,
    createInitialAboutData: createAboutMutation.mutate,
    isCreatingAboutData: createAboutMutation.isPending
  };
};
