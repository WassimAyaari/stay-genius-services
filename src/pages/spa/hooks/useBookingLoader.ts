
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSpaBookings } from '@/hooks/useSpaBookings';
import { SpaService, SpaFacility } from '@/features/spa/types';
import { BookingDetailsState, UseBookingDetailsProps } from './types/bookingDetailsTypes';

export const useBookingLoader = ({ id }: UseBookingDetailsProps) => {
  const [state, setState] = useState<BookingDetailsState>({
    booking: null,
    service: null,
    facility: null,
    isLoading: true,
    userId: null,
    error: null
  });
  
  const { getBookingById } = useSpaBookings();
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setState(prev => ({ ...prev, userId: user.id }));
      }
    };
    
    checkAuth();
  }, []);
  
  // Load booking data
  useEffect(() => {
    const loadBooking = async () => {
      if (!id) {
        console.error('No booking ID provided');
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: 'Aucun identifiant de réservation fourni'
        }));
        return;
      }
      
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        console.log('Fetching booking details for ID:', id);
        const bookingData = await getBookingById(id);
        console.log('Booking data received:', bookingData);
        
        if (!bookingData) {
          console.error('No booking data found for ID:', id);
          setState(prev => ({ 
            ...prev, 
            isLoading: false,
            error: `Réservation avec ID ${id} introuvable`
          }));
          return;
        }
        
        setState(prev => ({ ...prev, booking: bookingData }));
        
        // First, try to get service data from the booking data if it includes it
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
          
          await loadFacilityData(serviceData.facility_id);
        } else {
          // If the booking doesn't include service data, fetch it separately
          await loadServiceData(bookingData.service_id);
        }
      } catch (error) {
        console.error('Error loading booking details:', error);
        setState(prev => ({ 
          ...prev,
          error: "Erreur lors du chargement des détails de la réservation",
          isLoading: false
        }));
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    loadBooking();
  }, [id, getBookingById]);

  // Load service data separately
  const loadServiceData = async (serviceId: string) => {
    if (!serviceId) return;
    
    try {
      console.log('Fetching service data for service ID:', serviceId);
      const { data: serviceData, error: serviceError } = await supabase
        .from('spa_services')
        .select('*')
        .eq('id', serviceId)
        .maybeSingle();
      
      if (serviceError) {
        console.error('Error fetching service:', serviceError);
        setState(prev => ({ 
          ...prev,
          error: "Erreur lors du chargement des détails du service"
        }));
      } else if (serviceData) {
        console.log('Service data received separately:', serviceData);
        const typedServiceData: SpaService = {
          ...serviceData,
          category: serviceData.category as 'massage' | 'facial' | 'body' | 'wellness' | string,
          image: serviceData.image || '',
          status: serviceData.status || 'available',
        };
        setState(prev => ({ ...prev, service: typedServiceData }));
        
        await loadFacilityData(typedServiceData.facility_id);
      }
    } catch (error) {
      console.error('Exception when fetching service:', error);
      setState(prev => ({ 
        ...prev,
        error: "Erreur lors du chargement des détails du service"
      }));
    }
  };
  
  // Load facility data
  const loadFacilityData = async (facilityId: string | undefined) => {
    if (!facilityId) return;
    
    try {
      const { data: facilityData, error: facilityError } = await supabase
        .from('spa_facilities')
        .select('*')
        .eq('id', facilityId)
        .maybeSingle();
      
      if (facilityError) {
        console.error('Error fetching facility:', facilityError);
      } else if (facilityData) {
        console.log('Facility data received:', facilityData);
        setState(prev => ({ ...prev, facility: facilityData as SpaFacility }));
      }
    } catch (error) {
      console.error('Exception when fetching facility:', error);
    }
  };
  
  return state;
};
