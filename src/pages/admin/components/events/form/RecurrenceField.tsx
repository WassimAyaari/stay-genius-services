import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventFormValues } from './EventFormSchema';

interface RecurrenceFieldProps {
  form: UseFormReturn<EventFormValues>;
}

export const RecurrenceField: React.FC<RecurrenceFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="recurrence_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event Type</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">One-time Event</SelectItem>
                <SelectItem value="daily">Daily Event</SelectItem>
                <SelectItem value="weekly">Weekly Event</SelectItem>
                <SelectItem value="monthly">Monthly Event</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};