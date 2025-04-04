
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
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
      time: initialData.time || '',
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

  const handleSubmit = async (values: EventFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${initialData ? 'update' : 'create'} event`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
            {initialData ? 'Update' : 'Create'} Event
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
