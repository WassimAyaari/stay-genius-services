
import { supabase } from '@/integrations/supabase/client';
import { EventReservation, CreateEventReservationDTO, UpdateEventReservationDTO } from '../types';

/**
 * Créer une nouvelle réservation d'événement
 */
export const createEventReservation = async (data: CreateEventReservationDTO): Promise<EventReservation> => {
  try {
    const { eventId, userId, date, guests, guestName, guestEmail, guestPhone, roomNumber, specialRequests } = data;
    
    const { data: reservation, error } = await supabase
      .from('event_reservations')
      .insert({
        event_id: eventId, 
        user_id: userId, 
        date, 
        guests, 
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        room_number: roomNumber,
        special_requests: specialRequests,
        status: 'pending'
      })
      .select('*, events:event_id(*)')
      .single();

    if (error) throw error;
    
    // Convertir les noms de colonnes snake_case en camelCase
    return {
      id: reservation.id,
      eventId: reservation.event_id,
      userId: reservation.user_id,
      date: reservation.date,
      guests: reservation.guests,
      guestName: reservation.guest_name,
      guestEmail: reservation.guest_email,
      guestPhone: reservation.guest_phone,
      roomNumber: reservation.room_number,
      specialRequests: reservation.special_requests,
      status: reservation.status,
      createdAt: reservation.created_at,
      updatedAt: reservation.updated_at,
      event: reservation.events ? {
        title: reservation.events.title,
        description: reservation.events.description,
        image: reservation.events.image,
        location: reservation.events.location
      } : undefined
    };
  } catch (error) {
    console.error('Erreur lors de la création de la réservation d\'événement:', error);
    throw error;
  }
};

/**
 * Mettre à jour une réservation d'événement existante
 */
export const updateEventReservation = async (data: UpdateEventReservationDTO): Promise<EventReservation> => {
  try {
    const { id, ...updateData } = data;
    
    // Convertir les noms de propriétés camelCase en snake_case
    const updatePayload: Record<string, any> = {};
    
    if (updateData.status) updatePayload.status = updateData.status;
    if (updateData.guests) updatePayload.guests = updateData.guests;
    if (updateData.guestName) updatePayload.guest_name = updateData.guestName;
    if (updateData.guestEmail) updatePayload.guest_email = updateData.guestEmail;
    if (updateData.guestPhone) updatePayload.guest_phone = updateData.guestPhone;
    if (updateData.roomNumber) updatePayload.room_number = updateData.roomNumber;
    if (updateData.specialRequests) updatePayload.special_requests = updateData.specialRequests;
    
    const { data: reservation, error } = await supabase
      .from('event_reservations')
      .update(updatePayload)
      .eq('id', id)
      .select('*, events:event_id(*)')
      .single();

    if (error) throw error;
    
    // Convertir les noms de colonnes snake_case en camelCase
    return {
      id: reservation.id,
      eventId: reservation.event_id,
      userId: reservation.user_id,
      date: reservation.date,
      guests: reservation.guests,
      guestName: reservation.guest_name,
      guestEmail: reservation.guest_email,
      guestPhone: reservation.guest_phone,
      roomNumber: reservation.room_number,
      specialRequests: reservation.special_requests,
      status: reservation.status,
      createdAt: reservation.created_at,
      updatedAt: reservation.updated_at,
      event: reservation.events ? {
        title: reservation.events.title,
        description: reservation.events.description,
        image: reservation.events.image,
        location: reservation.events.location
      } : undefined
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation d\'événement:', error);
    throw error;
  }
};

/**
 * Annuler une réservation d'événement
 */
export const cancelEventReservation = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('event_reservations')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation d\'événement:', error);
    throw error;
  }
};

/**
 * Récupérer une réservation d'événement par ID
 */
export const getEventReservationById = async (id: string): Promise<EventReservation> => {
  try {
    const { data: reservation, error } = await supabase
      .from('event_reservations')
      .select('*, events:event_id(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Convertir les noms de colonnes snake_case en camelCase
    return {
      id: reservation.id,
      eventId: reservation.event_id,
      userId: reservation.user_id,
      date: reservation.date,
      guests: reservation.guests,
      guestName: reservation.guest_name,
      guestEmail: reservation.guest_email,
      guestPhone: reservation.guest_phone,
      roomNumber: reservation.room_number,
      specialRequests: reservation.special_requests,
      status: reservation.status,
      createdAt: reservation.created_at,
      updatedAt: reservation.updated_at,
      event: reservation.events ? {
        title: reservation.events.title,
        description: reservation.events.description,
        image: reservation.events.image,
        location: reservation.events.location
      } : undefined
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation d\'événement:', error);
    throw error;
  }
};

/**
 * Récupérer les réservations d'événements pour un utilisateur
 */
export const getUserEventReservations = async (userId?: string, userEmail?: string): Promise<EventReservation[]> => {
  try {
    let query = supabase
      .from('event_reservations')
      .select('*, events:event_id(*)');
    
    if (userId) {
      query = query.eq('user_id', userId);
    } else if (userEmail) {
      query = query.eq('guest_email', userEmail);
    }
    
    query = query.order('date', { ascending: false });
    
    const { data: reservations, error } = await query;

    if (error) throw error;
    
    // Convertir les noms de colonnes snake_case en camelCase
    return reservations.map(reservation => ({
      id: reservation.id,
      eventId: reservation.event_id,
      userId: reservation.user_id,
      date: reservation.date,
      guests: reservation.guests,
      guestName: reservation.guest_name,
      guestEmail: reservation.guest_email,
      guestPhone: reservation.guest_phone,
      roomNumber: reservation.room_number,
      specialRequests: reservation.special_requests,
      status: reservation.status,
      createdAt: reservation.created_at,
      updatedAt: reservation.updated_at,
      event: reservation.events ? {
        title: reservation.events.title,
        description: reservation.events.description,
        image: reservation.events.image,
        location: reservation.events.location
      } : undefined
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations d\'événements:', error);
    return [];
  }
};
