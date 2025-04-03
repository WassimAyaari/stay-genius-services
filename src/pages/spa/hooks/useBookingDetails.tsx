
import { useState, useEffect } from 'react';
import { useSpaBookings, ExtendedSpaBooking } from '@/hooks/useSpaBookings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SpaService, SpaFacility, SpaBooking } from '@/features/spa/types';

interface UseBookingDetailsProps {
  id: string | undefined;
}

interface UseBookingDetailsState {
  booking: SpaBooking | null;
  service: SpaService | null;
  facility: SpaFacility | null;
  isLoading: boolean;
  userId: string | null;
  error: Error | null;
}

export const useBookingDetails = ({ id }: UseBookingDetailsProps) => {
  const [state, setState] = useState<UseBookingDetailsState>({
    booking: null,
    service: null,
    facility: null,
    isLoading: true,
    userId: null,
    error: null
  });
  
  const { getBookingById, cancelBooking } = useSpaBookings();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setState(prev => ({ ...prev, userId: user.id }));
      }
    };
    
    checkAuth();
  }, []);
  
  useEffect(() => {
    const loadBooking = async () => {
      if (!id) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: new Error('Identifiant de réservation manquant') 
        }));
        return;
      }
      
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        console.log('Fetching booking details for ID:', id);
        const bookingData = await getBookingById(id);
        
        if (!bookingData) {
          console.error('No booking data found for ID:', id);
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: new Error('Réservation introuvable') 
          }));
          return;
        }
        
        console.log('Booking data received:', bookingData);
        setState(prev => ({ ...prev, booking: bookingData }));
        
        if (bookingData.spa_services) {
          console.log('Service data found in booking:', bookingData.spa_services);
          const serviceData: SpaService = {
            ...bookingData.spa_services,
            category: bookingData.spa_services.category as 'massage' | 'facial' | 'body' | 'wellness' | string,
            image: bookingData.spa_services.image || '',
            status: bookingData.spa_services.status || 'available',
            facility_id: bookingData.spa_services.facility_id || '',
          };
          setState(prev => ({ ...prev, service: serviceData }));
          
          if (serviceData.facility_id) {
            try {
              const { data: facilityData, error: facilityError } = await supabase
                .from('spa_facilities')
                .select('*')
                .eq('id', serviceData.facility_id)
                .maybeSingle();
              
              if (facilityError) {
                console.error('Error fetching facility:', facilityError);
              } else if (facilityData) {
                console.log('Facility data received:', facilityData);
                setState(prev => ({ ...prev, facility: facilityData as SpaFacility }));
              }
            } catch (error) {
              console.error('Error fetching facility data:', error);
              // Continue sans facility data
            }
          }
        } else {
          console.error('No service data found in booking');
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: new Error('Données de service manquantes') 
          }));
        }
      } catch (error) {
        console.error('Error loading booking details:', error);
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error : new Error('Erreur de chargement'),
          isLoading: false 
        }));
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    loadBooking();
  }, [id, getBookingById, retryCount]);
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info("Tentative de rechargement des données...");
  };
  
  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };
  
  const handleCancelBooking = async () => {
    if (!state.booking || !id) return;
    
    try {
      await cancelBooking(id);
      // Rafraîchir les données après annulation
      const updatedBooking = await getBookingById(id);
      setState(prev => ({ ...prev, booking: updatedBooking }));
      toast.success("Réservation annulée avec succès");
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error("Erreur lors de l'annulation de la réservation");
    }
  };
  
  // Determine if booking can be edited or cancelled
  const canCancel = state.booking?.status === 'pending' || state.booking?.status === 'confirmed';
  const canEdit = state.booking?.status === 'pending';
  
  return {
    ...state,
    isEditDialogOpen,
    setIsEditDialogOpen,
    canCancel,
    canEdit,
    handleEdit,
    handleCancelBooking,
    handleRetry
  };
};
