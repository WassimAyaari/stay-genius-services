
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
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
  );
};
