
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types/event';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { eventSchema, EventFormValues } from './form/EventFormSchema';
import { BasicInfoFields } from './form/BasicInfoFields';
import { CategoryField } from './form/CategoryField';
import { DateTimeFields } from './form/DateTimeFields';
import { LocationAndFeaturedFields } from './form/LocationAndFeaturedFields';
import { useRestaurants } from '@/hooks/useRestaurants';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';

export interface EventFormProps {
  initialData?: Partial<Event> | null; // Make Partial so we can pass just restaurant_id
  onSubmit: (event: Partial<Event>) => Promise<void>;
  onCancel?: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const { restaurants } = useRestaurants();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData ? {
      title: initialData.title || '',
      description: initialData.description || '',
      image: initialData.image || '',
      category: initialData.category || 'event',
      is_featured: initialData.is_featured || false,
      location: initialData.location || '',
      date: initialData.date || format(new Date(), 'yyyy-MM-dd'),
      time: initialData.time || '',
      restaurant_id: initialData.restaurant_id ?? null,
      spa_facility_id: initialData.spa_facility_id ?? null
    } : {
      title: '',
      description: '',
      image: '',
      category: 'event',
      is_featured: false,
      location: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '',
      restaurant_id: null,
      spa_facility_id: null
    }
  });

  const handleSubmit = async (values: EventFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${initialData ? 'update' : 'create'} event`
      });
    }
  };

  // Determine if restaurant selection should be displayed
  // Ne pas afficher le champ restaurant si c'est un événement de spa
  const showRestaurantField = !initialData?.spa_facility_id;
  
  // Check if either restaurant or spa facility is locked
  const restaurantLocked = !!(initialData && typeof initialData.restaurant_id === 'string' && initialData.restaurant_id);
  const spaFacilityLocked = !!(initialData && typeof initialData.spa_facility_id === 'string' && initialData.spa_facility_id);

  return (
    <Form {...form}>
      <ScrollArea className="h-[70vh] pr-4">
        <div className="px-1">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <BasicInfoFields form={form} />
            
            {showRestaurantField && !spaFacilityLocked && (
              <FormItem>
                <FormLabel>Link to Restaurant (optional)</FormLabel>
                <FormControl>
                  <Select
                    value={form.watch('restaurant_id') ?? 'null'}
                    onValueChange={val => form.setValue('restaurant_id', val === 'null' ? null : val)}
                    disabled={restaurantLocked || spaFacilityLocked}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        restaurantLocked
                          ? (restaurants?.find(r => r.id === form.watch('restaurant_id'))?.name ?? "Linked Restaurant")
                          : "No restaurant"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">No restaurant</SelectItem>
                      {(restaurants || []).map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
            
            <CategoryField form={form} />
            <DateTimeFields form={form} />
            <LocationAndFeaturedFields form={form} />
            
            <div className="flex justify-end space-x-2 py-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {initialData && initialData.title ? 'Update' : 'Create'} Event
              </Button>
            </div>
          </form>
        </div>
      </ScrollArea>
    </Form>
  );
};

export default EventForm;
