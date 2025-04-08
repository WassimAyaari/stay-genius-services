
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { EventFormValues } from './EventFormSchema';

interface LocationAndFeaturedFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export const LocationAndFeaturedFields: React.FC<LocationAndFeaturedFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};
