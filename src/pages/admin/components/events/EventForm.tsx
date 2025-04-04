
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/types/event';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';

const eventSchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }),
  description: z.string().min(3, { message: 'Description is required' }),
  image: z.string().min(3, { message: 'Image URL is required' }),
  category: z.enum(['event', 'promo'], { message: 'Category is required' }),
  is_featured: z.boolean().default(false),
  location: z.string().optional(),
  date: z.string().min(3, { message: 'Date is required' }),
  time: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const { createEvent, updateEvent } = useEvents();
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? {
      title: event.title,
      description: event.description,
      image: event.image,
      category: event.category,
      is_featured: event.is_featured || false,
      location: event.location || '',
      date: event.date,
      time: event.time || '',
    } : {
      title: '',
      description: '',
      image: '',
      category: 'event',
      is_featured: false,
      location: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '',
    },
  });

  const onSubmit = async (values: EventFormValues) => {
    try {
      if (event) {
        await updateEvent(event.id, values);
      } else {
        await createEvent({
          title: values.title,
          description: values.description,
          image: values.image,
          category: values.category,
          is_featured: values.is_featured,
          location: values.location || '',
          date: values.date,
          time: values.time || '',
        });
      }
      toast({
        title: 'Success',
        description: `Event ${event ? 'updated' : 'created'} successfully`,
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${event ? 'update' : 'create'} event`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Event description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  {...field}
                >
                  <option value="event">Event</option>
                  <option value="promo">Promotion</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time (optional)</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Featured</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Display this event prominently on the home page
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {event ? 'Update' : 'Create'} Event
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
