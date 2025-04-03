
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
  error: Error | null;
}

export const useSpaBookingDetail = (notification: NotificationItem) => {
  const navigate = useNavigate();
  const [state, setState] = useState<BookingDetailState>({
    booking: null,
    service: null,
    facility: null,
    isLoading: true,
    error: null
  });
  
  const { getBookingById, cancelBooking } = useSpaBookings();
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!notification || !notification.id) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: new Error('Identifiant de notification manquant') 
        }));
        return;
      }
      
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        console.log('Loading booking details for notification ID:', notification.id);
        const bookingData = await getBookingById(notification.id);
        
        if (!bookingData) {
          console.log('No booking found for ID:', notification.id);
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: new Error('Réservation introuvable') 
          }));
          return;
        }
        
        console.log('Booking data loaded:', bookingData);
        setState(prev => ({ ...prev, booking: bookingData }));
        
        if (bookingData.spa_services) {
          console.log('Service data found in booking:', bookingData.spa_services);
          setState(prev => ({ ...prev, service: bookingData.spa_services }));
          
          if (bookingData.spa_services.facility_id) {
            try {
              const { data: facilityData, error: facilityError } = await supabase
                .from('spa_facilities')
                .select('*')
                .eq('id', bookingData.spa_services.facility_id)
                .maybeSingle();
              
              if (facilityError) {
                console.error('Error fetching facility:', facilityError);
              } else if (facilityData) {
                console.log('Facility data loaded:', facilityData);
                setState(prev => ({ ...prev, facility: facilityData }));
              }
            } catch (error) {
              console.error('Error loading facility data:', error);
              // Continue without facility data
            }
          }
        } else {
          console.error('Service data missing in booking');
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
    
    loadBookingDetails();
  }, [notification, getBookingById, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info("Tentative de rechargement des données...");
  };

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
    handleViewDetails,
    handleRetry
  };
};
