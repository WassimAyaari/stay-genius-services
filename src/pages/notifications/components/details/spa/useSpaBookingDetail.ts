
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
      if (!notification || !notification.id) return;
      
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        const bookingData = await getBookingById(notification.id);
        
        if (!bookingData) {
          toast.error("Réservation introuvable");
          return;
        }
        
        setState(prev => ({ ...prev, booking: bookingData }));
        
        const { data: serviceData } = await supabase
          .from('spa_services')
          .select('*')
          .eq('id', bookingData.service_id)
          .single();
        
        if (serviceData) {
          setState(prev => ({ ...prev, service: serviceData }));
          
          const { data: facilityData } = await supabase
            .from('spa_facilities')
            .select('*')
            .eq('id', serviceData.facility_id)
            .single();
          
          setState(prev => ({ ...prev, facility: facilityData }));
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
