
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTableReservations } from '@/hooks/useTableReservations';
import { useRestaurantMenus } from '@/hooks/useRestaurantMenus';
import { MenuItem } from '@/features/dining/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock } from 'lucide-react';

interface ReservationFormProps {
  restaurantId: string;
  onSuccess?: () => void;
  buttonText?: string; // Nouvelle prop pour le texte du bouton
}

const TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

const GUESTS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ReservationForm = ({ restaurantId, onSuccess, buttonText = "Réserver une table" }: ReservationFormProps) => {
  const { createReservation, isCreating } = useTableReservations(restaurantId);
  const { menuItems, isLoading: isLoadingMenuItems } = useRestaurantMenus(restaurantId);
  
  // Grouper les menus par catégorie pour l'affichage
  const menuCategories = React.useMemo(() => {
    if (!menuItems) return [];
    
    const categories = [...new Set(menuItems.map(item => item.category))];
    return categories.map(category => ({
      category,
      items: menuItems.filter(item => item.category === category)
    }));
  }, [menuItems]);
  
  const form = useForm({
    defaultValues: {
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      date: undefined as Date | undefined,
      time: '',
      guests: 2,
      menuId: '',
      specialRequests: ''
    }
  });

  const onSubmit = form.handleSubmit((data) => {
    if (!data.date) {
      form.setError('date', { message: 'Veuillez sélectionner une date' });
      return;
    }
    
    const reservation = {
      restaurantId,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      date: format(data.date, 'yyyy-MM-dd'),
      time: data.time,
      guests: data.guests,
      menuId: data.menuId || undefined,
      specialRequests: data.specialRequests,
      status: 'pending' as const
    };
    
    createReservation(reservation, {
      onSuccess: () => {
        form.reset();
        if (onSuccess) onSuccess();
      }
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="guestName"
            rules={{ required: 'Le nom est requis' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="guestEmail"
            rules={{ 
              required: 'L\'email est requis',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Adresse email invalide'
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="votre@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="guestPhone"
          rules={{ required: 'Le téléphone est requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input placeholder="Votre numéro de téléphone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            rules={{ required: 'La date est requise' }}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
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
                      disabled={(date) => date < new Date()}
                      initialFocus
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
            rules={{ required: 'L\'heure est requise' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une heure" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
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
          name="guests"
          rules={{ required: 'Le nombre de personnes est requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de personnes</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le nombre de personnes" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GUESTS_OPTIONS.map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'personne' : 'personnes'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Nouveau champ pour sélectionner un menu */}
        <FormField
          control={form.control}
          name="menuId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Menu (optionnel)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un menu" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-80">
                  <SelectItem key="no-menu" value="no-menu">Aucun menu pré-sélectionné</SelectItem>
                  
                  {isLoadingMenuItems ? (
                    <div className="py-2 px-2 text-sm">Chargement des menus...</div>
                  ) : (
                    menuCategories.map(categoryGroup => (
                      <React.Fragment key={categoryGroup.category}>
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                          {categoryGroup.category}
                        </div>
                        {categoryGroup.items.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} - {item.price.toFixed(2)}€
                          </SelectItem>
                        ))}
                      </React.Fragment>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Pré-sélectionnez un plat pour votre réservation (optionnel).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specialRequests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demandes spéciales</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Demandes spéciales (allergies, occasion spéciale, etc.)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Nous ferons de notre mieux pour répondre à vos demandes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isCreating}>
          {isCreating ? 'Réservation en cours...' : buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default ReservationForm;
