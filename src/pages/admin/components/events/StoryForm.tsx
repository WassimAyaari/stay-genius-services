import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Story } from '@/types/event';
import { Switch } from '@/components/ui/switch';

const storySchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }),
  description: z.string().min(3, { message: 'Description is required' }),
  image: z.string().min(3, { message: 'Image URL is required' }),
  category: z.enum(['event', 'promo'], { message: 'Category is required' }),
  is_active: z.boolean().default(true),
  seen: z.boolean().default(false),
});

type StoryFormValues = z.infer<typeof storySchema>;

export interface StoryFormProps {
  initialData?: Story | null;
  onSubmit: (story: Partial<Story>) => Promise<void>;
  onCancel?: () => void;
}

const StoryForm: React.FC<StoryFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}) => {
  const { toast } = useToast();
  
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      image: initialData.image,
      category: initialData.category,
      is_active: initialData.is_active || true,
      seen: initialData.seen || false,
    } : {
      title: '',
      description: '',
      image: '',
      category: 'event',
      is_active: true,
      seen: false,
    },
  });

  const handleSubmit = async (values: StoryFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting story:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${initialData ? 'update' : 'create'} story`,
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
                <Input placeholder="Story title" {...field} />
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
                <Textarea placeholder="Story description" {...field} />
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
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Active</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Story will be visible to users
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
            {initialData ? 'Update' : 'Create'} Story
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StoryForm;
