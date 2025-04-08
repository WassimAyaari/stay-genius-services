
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { useEventReservations } from '@/hooks/useEventReservations';
import { Event } from '@/types/event';
import { CreateEventReservationDTO } from '../types';

const formSchema = z.object({
  guests: z.coerce.number().min(1, 'Au moins 1 participant est requis'),
  guestName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  guestEmail: z.string().email('Adresse email invalide'),
  guestPhone: z.string().optional(),
  roomNumber: z.string().optional(),
  specialRequests: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EventReservationFormProps {
  event: Event;
  onSuccess?: () => void;
  buttonText?: string;
}

const EventReservationForm: React.FC<EventReservationFormProps> = ({
  event,
  onSuccess,
  buttonText = 'Réserver'
}) => {
  const { user, userData } = useAuth();
  const { makeEventReservation, loading } = useEventReservations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guests: 1,
      guestName: userData?.first_name && userData?.last_name 
        ? `${userData.first_name} ${userData.last_name}` 
        : '',
      guestEmail: user?.email || '',
      guestPhone: userData?.phone || '',
      roomNumber: userData?.room_number || '',
      specialRequests: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const reservationData: CreateEventReservationDTO = {
        eventId: event.id,
        date: event.date,
        guests: values.guests,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        roomNumber: values.roomNumber,
        specialRequests: values.specialRequests,
      };
      
      if (user?.id) {
        reservationData.userId = user.id;
      }

      await makeEventReservation(reservationData);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="guests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de participants</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="guestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="guestEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="guestPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone (optionnel)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="roomNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de chambre (optionnel)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specialRequests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demandes spéciales (optionnel)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Traitement en cours...' : buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default EventReservationForm;
