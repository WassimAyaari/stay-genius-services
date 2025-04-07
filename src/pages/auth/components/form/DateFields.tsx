
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegistrationFormValues } from '../../hooks/useRegistrationForm';
import { BirthDatePicker } from '@/components/ui/date-picker-birth';

interface DateFieldsProps {
  form: UseFormReturn<RegistrationFormValues>;
}

// Calculate reasonable range for birth dates (100 years ago to today)
const today = new Date();
const hundredYearsAgo = new Date();
hundredYearsAgo.setFullYear(today.getFullYear() - 100);

const DateFields: React.FC<DateFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date de naissance</FormLabel>
            <FormControl>
              <BirthDatePicker
                selected={field.value}
                onSelect={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="checkInDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date d'arrivée</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal w-full",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        field.value.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      ) : (
                        <span>Sélectionner</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[9999]" align="start" sideOffset={4}>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="pointer-events-auto bg-white"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="checkOutDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de départ</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal w-full",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        field.value.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      ) : (
                        <span>Sélectionner</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[9999]" align="start" sideOffset={4}>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="pointer-events-auto bg-white"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default DateFields;
