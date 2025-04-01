
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useRequestDemo() {
  const [isCreating, setIsCreating] = useState(false);

  const createRealisticRequest = async () => {
    setIsCreating(true);
    try {
      // Définir différents types de requêtes réalistes
      const requestTypes = [
        {
          guest_id: 'guest-101',
          room_id: 'room-101',
          guest_name: 'Jean Dupont',
          room_number: '101',
          type: 'housekeeping',
          description: 'Demande de nettoyage quotidien',
          status: 'pending'
        },
        {
          guest_id: 'guest-102',
          room_id: 'room-102',
          guest_name: 'Marie Laforêt',
          room_number: '102',
          type: 'maintenance',
          description: 'Fuite d\'eau dans la salle de bain',
          status: 'in_progress'
        },
        {
          guest_id: 'guest-103',
          room_id: 'room-103',
          guest_name: 'Paul Martin',
          room_number: '103',
          type: 'concierge',
          description: 'Réservation de taxi pour 18h00',
          status: 'pending'
        }
      ];
      
      // Choisir aléatoirement une requête
      const randomRequest = requestTypes[Math.floor(Math.random() * requestTypes.length)];
      
      const { data, error } = await supabase
        .from('service_requests')
        .insert(randomRequest)
        .select();
        
      if (error) {
        console.error('Error creating realistic request:', error);
        toast.error('Erreur lors de la création de la requête de démonstration');
      } else {
        console.log('Created realistic request:', data);
        toast.success('Requête de démonstration créée avec succès');
      }
      
      return { success: !error, data };
    } catch (e) {
      console.error('Exception creating realistic request:', e);
      return { success: false, error: e };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createRealisticRequest,
    isCreating
  };
}
