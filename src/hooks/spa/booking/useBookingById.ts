
import { supabase } from '@/integrations/supabase/client';
import { SpaBooking } from '@/features/spa/types';
import { ExtendedSpaBooking } from './types';

/**
 * Fonction pour récupérer une réservation par son ID avec plusieurs stratégies de repli
 */
export const getBookingById = async (id: string): Promise<ExtendedSpaBooking | null> => {
  if (!id) {
    console.error('No booking ID provided to getBookingById');
    return null;
  }
  
  console.log('Fetching booking by ID:', id);
  try {
    // Stratégie 1: Récupérer la réservation avec les détails du service
    const { data, error } = await supabase
      .from('spa_bookings')
      .select(`
        *,
        spa_services:service_id (
          id,
          name,
          price,
          duration,
          description,
          category,
          image,
          status,
          facility_id
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching booking by ID with join:', error);
      // On continue pour essayer la stratégie 2
    } else if (data) {
      console.log('Found booking with service details:', data);
      // Ensure correct typing for status
      const typedData = {
        ...data,
        status: data.status as SpaBooking['status']
      };
      return typedData as ExtendedSpaBooking;
    }

    // Stratégie 2: Récupérer la réservation sans le join
    console.log('Trying to fetch booking without join...');
    const { data: simpleData, error: simpleError } = await supabase
      .from('spa_bookings')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (simpleError) {
      console.error('Error fetching simple booking by ID:', simpleError);
      return null;
    }
    
    if (!simpleData) {
      console.log('No booking exists with ID:', id);
      return null;
    }
    
    console.log('Found booking without service details:', simpleData);
    
    // Ensure correct typing for status
    const typedSimpleData = {
      ...simpleData,
      status: simpleData.status as SpaBooking['status']
    };
    
    // Stratégie 3: Récupérer le service séparément
    if (typedSimpleData.service_id) {
      try {
        const { data: serviceData, error: serviceError } = await supabase
          .from('spa_services')
          .select('*')
          .eq('id', typedSimpleData.service_id)
          .maybeSingle();
          
        if (!serviceError && serviceData) {
          console.log('Found service separately:', serviceData);
          return {
            ...typedSimpleData,
            spa_services: serviceData
          } as ExtendedSpaBooking;
        }
      } catch (error) {
        console.error('Error fetching service separately:', error);
      }
    }
    
    return typedSimpleData as ExtendedSpaBooking;
  } catch (error) {
    console.error('Exception in getBookingById:', error);
    return null;
  }
};
