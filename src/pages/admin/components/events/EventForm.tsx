
import React, { useState } from 'react';
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
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Upload } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const eventSchema = z.object({
  title: z.string().min(3, {
    message: 'Title is required'
  }),
  description: z.string().min(3, {
    message: 'Description is required'
  }),
  image: z.string().min(3, {
    message: 'Image URL is required'
  }),
  category: z.enum(['event', 'promo'], {
    message: 'Category is required'
  }),
  is_featured: z.boolean().default(false),
  location: z.string().optional(),
  date: z.string().min(3, {
    message: 'Date is required'
  }),
  time: z.string().optional()
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    setImagePreview(fileUrl);
    setSelectedImage(file);
    
    // Update form value with the file name or URL
    form.setValue('image', file.name, { shouldValidate: true });
  };

  const handleSubmit = async (values: EventFormValues) => {
    try {
      if (selectedImage) {
        // In a real app, you would upload the image to a server or storage service here
        // and then use the returned URL for the event
        // For now, we'll just use the file name as a placeholder
        values.image = imagePreview || values.image;
        
        // Show a toast to indicate that in a real-world scenario, the image would be uploaded
        toast({
          title: "Note",
          description: "Dans un environnement de production, l'image serait téléchargée sur un serveur.",
        });
      }
      
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
    <ScrollArea className="h-[70vh] pr-4">
      <div className="p-1">
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
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative w-full h-36 rounded-md overflow-hidden border border-gray-300">
                        <img 
                          src={imagePreview} 
                          alt="Event preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Importer une image
                      </Button>
                      <Input 
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Input 
                        placeholder="ou entrer une URL d'image" 
                        value={value}
                        onChange={(e) => {
                          onChange(e);
                          if (e.target.value) {
                            setImagePreview(e.target.value);
                            setSelectedImage(null);
                          }
                        }}
                        {...fieldProps}
                      />
                    </div>
                  </div>
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
                      className="w-full p-2 border border-gray-300 rounded-md bg-zinc-100"
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
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal flex justify-between items-center",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(new Date(field.value), 'dd MMMM yyyy') : <span>Select a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        initialFocus
                        className="pointer-events-auto"
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
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
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
      </div>
    </ScrollArea>
  );
};

export default EventForm;
