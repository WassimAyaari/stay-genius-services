
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useRestaurantMenus } from '@/hooks/useRestaurantMenus';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { format } from 'date-fns';
import GuestInfoFields from '@/components/reservation/GuestInfoFields';
import DateTimeFields from '@/components/reservation/DateTimeFields';
import MenuSelection from '@/components/reservation/MenuSelection';
import SpecialRequests from '@/components/reservation/SpecialRequests';
import { ReservationFormProps, ReservationFormValues } from '@/components/reservation/types';
import { toast } from 'sonner';

const ReservationForm = ({ restaurantId, onSuccess, buttonText = "Réserver une table" }: ReservationFormProps) => {
  const { createReservation, isCreating } = useTableReservations(restaurantId);
  const { menuItems, isLoading: isLoadingMenuItems } = useRestaurantMenus(restaurantId);
  const { userData } = useAuth();
  
  // Grouper les menus par catégorie pour l'affichage
  const menuCategories = React.useMemo(() => {
    if (!menuItems) return [];
    
    const categories = [...new Set(menuItems.map(item => item.category))];
    return categories.map(category => ({
      category,
      items: menuItems.filter(item => item.category === category)
    }));
  }, [menuItems]);
  
  const form = useForm<ReservationFormValues>({
    defaultValues: {
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      roomNumber: '',
      date: undefined,
      time: '',
      guests: 2,
      menuId: '',
      specialRequests: ''
    }
  });

  // Populate form with user data when available
  useEffect(() => {
    if (userData) {
      // Format full name from user data
      const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
      
      // Get user details from localStorage if available
      let phone = '';
      let roomNumber = '';
      try {
        const userDataObj = localStorage.getItem('user_data');
        if (userDataObj) {
          const parsedData = JSON.parse(userDataObj);
          phone = parsedData.phone || '';
          roomNumber = parsedData.room_number || '';
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
      
      form.setValue('guestName', fullName);
      form.setValue('guestEmail', userData.email || '');
      form.setValue('guestPhone', phone);
      form.setValue('roomNumber', roomNumber || userData.room_number || '');
    }
  }, [userData, form]);

  const onSubmit = form.handleSubmit((data) => {
    if (!data.date) {
      form.setError('date', { message: 'Veuillez sélectionner une date' });
      return;
    }
    
    // Make sure the room number is included
    if (!data.roomNumber) {
      form.setError('roomNumber', { message: 'Le numéro de chambre est requis' });
      return;
    }
    
    const reservation = {
      restaurantId,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      roomNumber: data.roomNumber,
      date: format(data.date, 'yyyy-MM-dd'),
      time: data.time,
      guests: data.guests,
      menuId: data.menuId && data.menuId !== 'no-menu' ? data.menuId : undefined,
      specialRequests: data.specialRequests,
      status: 'pending' as const
    };
    
    console.log('Submitting reservation:', reservation);
    
    createReservation(reservation, {
      onSuccess: () => {
        form.reset();
        toast.success('Réservation créée avec succès');
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        console.error('Error creating reservation:', error);
        toast.error(`Erreur lors de la création de la réservation: ${error.message}`);
      }
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <GuestInfoFields form={form} />
        <DateTimeFields form={form} />
        <MenuSelection form={form} menuCategories={menuCategories} isLoadingMenuItems={isLoadingMenuItems} />
        <SpecialRequests form={form} />
        
        <Button type="submit" className="w-full" disabled={isCreating}>
          {isCreating ? 'Réservation en cours...' : buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default ReservationForm;
