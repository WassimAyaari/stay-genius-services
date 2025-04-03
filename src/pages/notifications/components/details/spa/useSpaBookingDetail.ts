
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useSpaBookings } from '@/hooks/useSpaBookings';
import { supabase } from '@/integrations/supabase/client';
import { NotificationItem } from '@/types/notification';
import { useNavigate } from 'react-router-dom';
import { SpaBooking } from '@/features/spa/types';

export interface BookingDetailState {
  booking: any | null;
  service: any | null;
  facility: any | null;
  isLoading: boolean;
  error: string | null;
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
  
  // Memoize les fonctions pour éviter les re-renders inutiles
  const loadBookingDetails = useCallback(async () => {
    if (!notification || !notification.id) {
      console.error('No notification or notification ID provided');
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Aucun identifiant de réservation fourni'
      }));
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('Loading booking details for notification ID:', notification.id);
      let bookingData = await getBookingById(notification.id);
      
      // Tentative de requête directe à la base de données si la première méthode échoue
      if (!bookingData) {
        console.log('Trying direct database query for booking:', notification.id);
        const { data: directBookingData, error: directBookingError } = await supabase
          .from('spa_bookings')
          .select('*')
          .eq('id', notification.id)
          .maybeSingle();
          
        if (directBookingError) {
          console.error('Error with direct booking query:', directBookingError);
        } else if (directBookingData) {
          console.log('Found booking via direct query:', directBookingData);
          // Cast the status to the required type to satisfy TypeScript
          bookingData = {
            ...directBookingData,
            status: directBookingData.status as SpaBooking['status']
          };
        }
      }
      
      console.log('Booking data received:', bookingData);
      
      if (!bookingData) {
        console.error('No booking data found for ID:', notification.id);
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: `Réservation avec ID ${notification.id} introuvable`
        }));
        return;
      }
      
      setState(prev => ({ ...prev, booking: bookingData }));
      
      // Récupérer les détails du service
      try {
        const serviceId = bookingData.service_id;
        console.log('Fetching service details for ID:', serviceId);
        
        if (!serviceId) {
          console.error('No service_id in booking data');
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: "Données de réservation incomplètes (service_id manquant)"
          }));
          return;
        }
        
        const { data: serviceData, error: serviceError } = await supabase
          .from('spa_services')
          .select('*')
          .eq('id', serviceId)
          .maybeSingle();
        
        if (serviceError) {
          console.error('Error fetching service:', serviceError);
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: "Erreur lors du chargement des détails du service"
          }));
          return;
        } 
        
        if (!serviceData) {
          console.error('No service data found for ID:', serviceId);
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: "Service de spa introuvable"
          }));
          return;
        }
        
        console.log('Service data received:', serviceData);
        setState(prev => ({ ...prev, service: serviceData }));
        
        // Récupérer les détails de l'installation si service a un facility_id
        if (serviceData.facility_id) {
          try {
            console.log('Fetching facility details for ID:', serviceData.facility_id);
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
      } catch (error) {
        console.error('Exception when fetching service:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Erreur lors du chargement des détails du service"
        }));
      }
      
    } catch (error) {
      console.error('Error loading booking details:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Erreur lors du chargement des détails de la réservation"
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [notification, getBookingById]);
  
  useEffect(() => {
    loadBookingDetails();
  }, [loadBookingDetails]);

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
