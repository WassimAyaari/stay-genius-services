
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EventFormValues } from './EventFormSchema';

interface BasicInfoFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};
