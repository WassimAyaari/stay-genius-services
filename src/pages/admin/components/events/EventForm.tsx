
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

export interface EventFormProps {
  initialData?: Event | null;
  onSubmit: (event: Partial<Event>) => Promise<void>;
  onCancel?: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      image: initialData.image,
      category: initialData.category,
      is_featured: initialData.is_featured || false,
      location: initialData.location || '',
      date: initialData.date,
      time: initialData.time || ''
    } : {
      title: '',
      description: '',
      image: '',
      category: 'event',
      is_featured: false,
      location: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: ''
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

  return (
    <Form {...form}>
      <ScrollArea className="h-[70vh] pr-4">
        <div className="px-1">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <BasicInfoFields form={form} />
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
                {initialData ? 'Update' : 'Create'} Event
              </Button>
            </div>
          </form>
        </div>
      </ScrollArea>
    </Form>
  );
};

export default EventForm;
