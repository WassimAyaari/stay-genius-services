
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
        console.error('Notification invalide ou ID manquant');
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      console.log('Chargement des détails pour la réservation:', notification.id);
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Récupérer les données de réservation
        const bookingData = await getBookingById(notification.id);
        
        if (!bookingData) {
          console.error('Réservation introuvable pour ID:', notification.id);
          toast.error("Réservation introuvable");
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        console.log('Données de réservation récupérées:', bookingData);
        setState(prev => ({ ...prev, booking: bookingData }));
        
        // Récupérer les détails du service
        try {
          const { data: serviceData, error: serviceError } = await supabase
            .from('spa_services')
            .select('*')
            .eq('id', bookingData.service_id)
            .maybeSingle();
          
          if (serviceError) {
            console.error('Erreur lors de la récupération du service:', serviceError);
            throw serviceError;
          }
          
          if (serviceData) {
            console.log('Données de service récupérées:', serviceData);
            setState(prev => ({ ...prev, service: serviceData }));
            
            // Récupérer les détails de l'installation
            if (serviceData.facility_id) {
              const { data: facilityData, error: facilityError } = await supabase
                .from('spa_facilities')
                .select('*')
                .eq('id', serviceData.facility_id)
                .maybeSingle();
              
              if (facilityError) {
                console.error('Erreur lors de la récupération de l\'installation:', facilityError);
                // On continue même si on ne trouve pas l'installation
              } else if (facilityData) {
                console.log('Données d\'installation récupérées:', facilityData);
                setState(prev => ({ ...prev, facility: facilityData }));
              }
            }
          }
        } catch (error) {
          console.error('Erreur lors du chargement des détails du service:', error);
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement des détails de la réservation:', error);
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
      console.log('Annulation de la réservation:', id);
      await cancelBooking(id);
      const updatedBooking = await getBookingById(id);
      setState(prev => ({ ...prev, booking: updatedBooking }));
      toast.success("Réservation annulée avec succès");
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réservation:', error);
      toast.error("Erreur lors de l'annulation de la réservation");
    }
  };

  const handleViewDetails = () => {
    if (notification && notification.id) {
      console.log('Navigation vers la page détaillée:', `/spa/booking/${notification.id}`);
      navigate(`/spa/booking/${notification.id}`);
    }
  };

  return {
    ...state,
    handleCancelBooking,
    handleViewDetails
  };
};
