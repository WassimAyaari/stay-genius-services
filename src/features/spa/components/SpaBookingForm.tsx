
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { SpaService } from '../types';
import { useSpaBookings } from '@/hooks/useSpaBookings';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { format, addDays } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/components/ui/date-picker';

interface SpaBookingFormProps {
  service: SpaService;
  onSuccess?: () => void;
  existingBooking?: any;
}

interface SpaBookingFormValues {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomNumber: string;
  specialRequests: string;
}

export default function SpaBookingForm({ service, onSuccess, existingBooking }: SpaBookingFormProps) {
  const { createBooking } = useSpaBookings();
  const { userData } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(existingBooking?.date ? new Date(existingBooking.date) : undefined);
  const [selectedTime, setSelectedTime] = useState<string>(existingBooking?.time || '');
  const userId = localStorage.getItem('user_id');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<SpaBookingFormValues>();

  useEffect(() => {
    if (userData) {
      setValue('guestName', userData.first_name + ' ' + userData.last_name);
      setValue('guestEmail', userData.email);
      setValue('guestPhone', userData.phone);
      setValue('roomNumber', userData.room_number);
    }
  }, [userData, setValue]);

  const onSubmit = async (data: SpaBookingFormValues) => {
    if (!selectedDate || !selectedTime) {
      toast.error("Veuillez sélectionner une date et une heure");
      return;
    }

    try {
      const bookingData = {
        service_id: service.id,
        facility_id: service.facility_id, // Fixed property name
        user_id: userId,
        guest_name: data.guestName,
        guest_email: data.guestEmail,
        guest_phone: data.guestPhone,
        room_number: data.roomNumber,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        special_requests: data.specialRequests,
        status: 'pending' as 'pending' | 'confirmed' | 'cancelled' | 'completed' // Fixed typing
      };

      await createBooking(bookingData);
      toast.success("Demande de réservation spa envoyée avec succès");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating spa booking:", error);
      toast.error("Erreur lors de l'envoi de la demande de réservation spa");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="guestName">Nom</Label>
          <Input
            id="guestName"
            type="text"
            {...register("guestName", { required: true })}
            className={cn({ "focus-visible:ring-red-500": errors.guestName })}
          />
          {errors.guestName && (
            <p className="text-red-500 text-sm mt-1">Champ obligatoire</p>
          )}
        </div>
        <div>
          <Label htmlFor="guestEmail">Email</Label>
          <Input
            id="guestEmail"
            type="email"
            {...register("guestEmail")}
            className={cn({ "focus-visible:ring-red-500": errors.guestEmail })}
          />
          {errors.guestEmail && (
            <p className="text-red-500 text-sm mt-1">Email invalide</p>
          )}
        </div>
        <div>
          <Label htmlFor="guestPhone">Téléphone</Label>
          <Input
            id="guestPhone"
            type="tel"
            {...register("guestPhone")}
            className={cn({ "focus-visible:ring-red-500": errors.guestPhone })}
          />
          {errors.guestPhone && (
            <p className="text-red-500 text-sm mt-1">Numéro de téléphone invalide</p>
          )}
        </div>
        <div>
          <Label htmlFor="roomNumber">Numéro de chambre</Label>
          <Input
            id="roomNumber"
            type="text"
            {...register("roomNumber", { required: true })}
            className={cn({ "focus-visible:ring-red-500": errors.roomNumber })}
          />
          {errors.roomNumber && (
            <p className="text-red-500 text-sm mt-1">Champ obligatoire</p>
          )}
        </div>
        <div>
          <Label>Date de réservation</Label>
          <DatePicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            minDate={new Date()}
            maxDate={addDays(new Date(), 30)}
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Heure</Label>
          <select
            id="time"
            className="w-full p-2 border rounded"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
          >
            <option value="">Sélectionner une heure</option>
            {[...Array(24)].map((_, i) => {
              const hour = i.toString().padStart(2, '0');
              return (
                <option key={hour + ':00'} value={hour + ':00'}>
                  {hour}:00
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <Label htmlFor="specialRequests">Demandes spéciales</Label>
          <Textarea
            id="specialRequests"
            {...register("specialRequests")}
            className="w-full border rounded"
          />
        </div>
        <Button type="submit">Envoyer la demande de réservation</Button>
      </form>
    </div>
  );
}
