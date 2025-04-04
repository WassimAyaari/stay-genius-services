
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useStories } from '@/hooks/useStories';
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

interface StoryFormProps {
  story?: Story;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StoryForm: React.FC<StoryFormProps> = ({ story, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const { createStory, updateStory } = useStories();
  
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: story ? {
      title: story.title,
      description: story.description,
      image: story.image,
      category: story.category,
      is_active: story.is_active || true,
      seen: story.seen || false,
    } : {
      title: '',
      description: '',
      image: '',
      category: 'event',
      is_active: true,
      seen: false,
    },
  });

  const onSubmit = async (values: StoryFormValues) => {
    try {
      if (story) {
        await updateStory(story.id, values);
      } else {
        await createStory({
          title: values.title,
          description: values.description,
          image: values.image,
          category: values.category,
          is_active: values.is_active,
          seen: values.seen,
        });
      }
      toast({
        title: 'Success',
        description: `Story ${story ? 'updated' : 'created'} successfully`,
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting story:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${story ? 'update' : 'create'} story`,
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
            {story ? 'Update' : 'Create'} Story
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StoryForm;
