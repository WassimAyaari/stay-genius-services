
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventFormValues } from './EventFormSchema';

interface CategoryFieldProps {
  form: UseFormReturn<EventFormValues>;
}

export const CategoryField: React.FC<CategoryFieldProps> = ({ form }) => {
  return (
    <FormField 
      control={form.control} 
      name="category" 
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="promo">Promotion</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} 
    />
  );
};
