
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
}

export const useBookingDetails = ({ id }: UseBookingDetailsProps) => {
  const [state, setState] = useState<UseBookingDetailsState>({
    booking: null,
    service: null,
    facility: null,
    isLoading: true,
    userId: null
  });
  
  const { getBookingById, cancelBooking } = useSpaBookings();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
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
      if (!id) return;
      
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        console.log('Fetching booking details for ID:', id);
        const bookingData = await getBookingById(id);
        console.log('Booking data received:', bookingData);
        
        if (!bookingData) {
          console.error('No booking data found for ID:', id);
          toast.error("Réservation introuvable");
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
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
          }
        } else {
          // Fetch service separately if not included in booking data
          const { data: serviceData, error: serviceError } = await supabase
            .from('spa_services')
            .select('*')
            .eq('id', bookingData.service_id)
            .maybeSingle();
          
          if (serviceError) {
            console.error('Error fetching service:', serviceError);
          } else if (serviceData) {
            console.log('Service data received:', serviceData);
            const typedServiceData: SpaService = {
              ...serviceData,
              category: serviceData.category as 'massage' | 'facial' | 'body' | 'wellness' | string,
              image: serviceData.image || '',
              status: serviceData.status || 'available',
            };
            setState(prev => ({ ...prev, service: typedServiceData }));
            
            if (typedServiceData.facility_id) {
              const { data: facilityData, error: facilityError } = await supabase
                .from('spa_facilities')
                .select('*')
                .eq('id', typedServiceData.facility_id)
                .maybeSingle();
              
              if (facilityError) {
                console.error('Error fetching facility:', facilityError);
              } else if (facilityData) {
                console.log('Facility data received:', facilityData);
                setState(prev => ({ ...prev, facility: facilityData as SpaFacility }));
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading booking details:', error);
        toast.error("Erreur lors du chargement des détails de la réservation");
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    loadBooking();
  }, [id, getBookingById]);
  
  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };
  
  const handleCancelBooking = async () => {
    if (!state.booking || !id) return;
    
    try {
      await cancelBooking(id);
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
    handleCancelBooking
  };
};
