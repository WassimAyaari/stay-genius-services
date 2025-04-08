
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { EventFormValues } from './EventFormSchema';

interface DateTimeFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};
