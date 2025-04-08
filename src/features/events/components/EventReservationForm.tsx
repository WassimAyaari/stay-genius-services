
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Event } from '@/types/event';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { useEventReservations } from '@/hooks/useEventReservations';
import { CreateEventReservationDTO } from '../types';

const eventReservationSchema = z.object({
  eventId: z.string(),
  date: z.date(),
  guests: z.coerce.number().int().min(1).max(20),
  guestName: z.string().min(2, { message: 'Le nom est requis' }),
  guestEmail: z.string().email({ message: 'Email invalide' }),
  guestPhone: z.string().optional(),
  roomNumber: z.string().optional(),
  specialRequests: z.string().optional(),
});

type FormValues = z.infer<typeof eventReservationSchema>;

interface EventReservationFormProps {
  event: Event;
  onSuccess: () => void;
  buttonText?: string;
}

const EventReservationForm: React.FC<EventReservationFormProps> = ({ 
  event, 
  onSuccess,
  buttonText = "Réserver"
}) => {
  const { user, userData } = useAuth();
  const { makeEventReservation, loading } = useEventReservations();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(eventReservationSchema),
    defaultValues: {
      eventId: event.id,
      date: event.date ? new Date(event.date) : new Date(),
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
      const formattedDate = format(values.date, 'yyyy-MM-dd');
      
      const reservationData: CreateEventReservationDTO = {
        ...values,
        date: formattedDate,
      };
      
      await makeEventReservation(reservationData);
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "d MMMM yyyy", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="guests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de participants</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={20} {...field} />
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
                <Input {...field} value={field.value || ''} />
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
                <Input {...field} value={field.value || ''} />
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
                <Textarea {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Réservation en cours...' : buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default EventReservationForm;
