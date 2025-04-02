
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useSpaServices } from '@/hooks/useSpaServices';
import { SpaService, SpaBooking } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  date: z.date({
    required_error: "La date est requise",
  }),
  time: z.string({
    required_error: "L'heure est requise",
  }),
  guest_name: z.string().min(3, "Le nom est requis"),
  guest_email: z.string().email("Email invalide"),
  guest_phone: z.string().optional(),
  special_requests: z.string().optional(),
  room_number: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SpaBookingFormProps {
  service: SpaService;
  onSuccess: () => void;
  existingBooking?: any;
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

const SpaBookingForm = ({ service, onSuccess, existingBooking }: SpaBookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { bookTreatment, isBooking } = useSpaServices();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: existingBooking 
      ? {
          date: new Date(existingBooking.date),
          time: existingBooking.time,
          guest_name: existingBooking.guest_name,
          guest_email: existingBooking.guest_email,
          guest_phone: existingBooking.guest_phone || '',
          special_requests: existingBooking.special_requests || '',
          room_number: existingBooking.room_number || '',
        }
      : {
          date: new Date(),
          time: "",
          guest_name: "",
          guest_email: "",
          guest_phone: "",
          special_requests: "",
          room_number: "",
        }
  });

  React.useEffect(() => {
    const getUserInfo = async () => {
      try {
        // Get the current user data
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No user found, checking localStorage");
          // Try to get data from localStorage
          const userData = localStorage.getItem('user_data');
          const roomNumber = localStorage.getItem('user_room_number');
          
          if (userData) {
            try {
              const parsedUserData = JSON.parse(userData);
              const fullName = `${parsedUserData.first_name || ''} ${parsedUserData.last_name || ''}`.trim();
              
              if (fullName) form.setValue('guest_name', fullName);
              if (parsedUserData.email) form.setValue('guest_email', parsedUserData.email);
              if (parsedUserData.phone) form.setValue('guest_phone', parsedUserData.phone);
              if (roomNumber) form.setValue('room_number', roomNumber);
            } catch (error) {
              console.error("Error parsing user data from localStorage:", error);
            }
          }
          return;
        }
        
        // First, check if user has metadata
        const userMetadata = user.user_metadata;
        if (userMetadata) {
          // Pre-fill form with metadata if available
          const fullName = userMetadata.first_name && userMetadata.last_name 
            ? `${userMetadata.first_name} ${userMetadata.last_name}` 
            : userMetadata.name || '';
          
          if (fullName) form.setValue('guest_name', fullName);
          if (user.email) form.setValue('guest_email', user.email);
        }
        
        // Then fetch the guest record to get more detailed info
        const { data: guest, error } = await supabase
          .from('guests')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.log("No guest record found, using default metadata");
          return;
        }

        if (guest) {
          const fullName = `${guest.first_name || ''} ${guest.last_name || ''}`.trim();
          if (fullName) form.setValue('guest_name', fullName);
          if (guest.email) form.setValue('guest_email', guest.email);
          if (guest.phone) form.setValue('guest_phone', guest.phone);
          if (guest.room_number) form.setValue('room_number', guest.room_number);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer vos informations. Veuillez les saisir manuellement.",
          variant: "destructive"
        });
      }
    };

    if (!existingBooking) {
      getUserInfo();
    }
  }, [form, existingBooking, toast]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Get the user ID if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      // Format the booking
      const booking: Omit<SpaBooking, 'id'> = {
        service_id: service.id,
        facility_id: service.facility_id,
        user_id: userId,
        date: format(values.date, 'yyyy-MM-dd'),
        time: values.time,
        guest_name: values.guest_name,
        guest_email: values.guest_email,
        guest_phone: values.guest_phone,
        special_requests: values.special_requests,
        room_number: values.room_number,
        status: 'pending'
      };

      // Create or update the booking
      await bookTreatment(booking);
      
      // Store room number in localStorage for future use
      if (values.room_number) {
        localStorage.setItem('user_room_number', values.room_number);
      }
      
      // Store basic user info
      const userInfo = {
        first_name: values.guest_name.split(' ')[0],
        last_name: values.guest_name.split(' ').slice(1).join(' '),
        email: values.guest_email,
        phone: values.guest_phone,
        room_number: values.room_number
      };
      localStorage.setItem('user_data', JSON.stringify(userInfo));
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-gray-100 p-3 rounded-md mb-4">
          <h3 className="font-medium">{service.name}</h3>
          <div className="flex justify-between text-sm mt-1">
            <span>Durée: {service.duration}</span>
            <span className="font-semibold">${service.price}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
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
                      disabled={(date) => 
                        date < new Date() || 
                        date > addDays(new Date(), 30)
                      }
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
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une heure" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="guest_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guest_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="votre@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="guest_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="Téléphone (optionnel)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="room_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de chambre</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="special_requests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demandes spéciales</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Demandes particulières (optionnel)" 
                  {...field}
                  className="resize-none"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting || isBooking}>
          {isSubmitting || isBooking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement en cours
            </>
          ) : existingBooking ? (
            "Modifier ma réservation"
          ) : (
            "Réserver"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SpaBookingForm;
