
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSpaBookings } from '@/hooks/useSpaBookings';
import { supabase } from '@/integrations/supabase/client';
import { NotificationItem } from '@/types/notification';
import { useNavigate } from 'react-router-dom';

export interface BookingDetailState {
  booking: any | null;
  service: any | null;
  facility: any | null;
  isLoading: boolean;
}

export const useSpaBookingDetail = (notification: NotificationItem) => {
  const navigate = useNavigate();
  const [state, setState] = useState<BookingDetailState>({
    booking: null,
    service: null,
    facility: null,
    isLoading: true
  });
  
  const { getBookingById, cancelBooking } = useSpaBookings();
  
  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!notification || !notification.id) {
        console.error('No notification or notification ID provided');
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        console.log('Loading booking details for notification ID:', notification.id);
        const bookingData = await getBookingById(notification.id);
        console.log('Booking data received:', bookingData);
        
        if (!bookingData) {
          console.error('No booking data found for ID:', notification.id);
          toast.error("Réservation introuvable");
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        setState(prev => ({ ...prev, booking: bookingData }));
        
        // Get service details
        try {
          const { data: serviceData, error: serviceError } = await supabase
            .from('spa_services')
            .select('*')
            .eq('id', bookingData.service_id)
            .maybeSingle();
          
          if (serviceError) {
            console.error('Error fetching service:', serviceError);
            toast.error("Erreur lors du chargement des détails du service");
          } else if (serviceData) {
            console.log('Service data received:', serviceData);
            setState(prev => ({ ...prev, service: serviceData }));
            
            // Get facility details if service has a facility_id
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
                  setState(prev => ({ ...prev, facility: facilityData }));
                }
              } catch (error) {
                console.error('Exception when fetching facility:', error);
              }
            }
          }
        } catch (error) {
          console.error('Exception when fetching service:', error);
          toast.error("Erreur lors du chargement des détails du service");
        }
        
      } catch (error) {
        console.error('Error loading booking details:', error);
        toast.error("Erreur lors du chargement des détails de la réservation");
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    loadBookingDetails();
  }, [notification, getBookingById]);

  const handleCancelBooking = async (id: string) => {
    if (!id) return;
    
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

  const handleViewDetails = () => {
    if (notification && notification.id) {
      navigate(`/spa/booking/${notification.id}`);
    }
  };

  return {
    ...state,
    handleCancelBooking,
    handleViewDetails
  };
};
