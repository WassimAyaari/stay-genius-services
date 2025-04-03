
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
      if (!notification || !notification.id) return;
      
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const bookingData = await getBookingById(notification.id);
        
        if (!bookingData) {
          toast.error("Réservation introuvable");
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: new Error('Réservation introuvable') 
          }));
          return;
        }
        
        setState(prev => ({ ...prev, booking: bookingData }));
        
        try {
          const { data: serviceData, error: serviceError } = await supabase
            .from('spa_services')
            .select('*')
            .eq('id', bookingData.service_id)
            .maybeSingle();
          
          if (serviceError) {
            console.error('Error fetching service:', serviceError);
          } else if (serviceData) {
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
                setState(prev => ({ ...prev, facility: facilityData }));
              }
            }
          }
        } catch (error) {
          console.error('Error fetching related data:', error);
        }
        
      } catch (error) {
        console.error('Error loading booking details:', error);
        toast.error("Erreur lors du chargement des détails de la réservation");
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error : new Error('Erreur de chargement') 
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
