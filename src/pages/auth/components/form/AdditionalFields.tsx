
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegistrationFormValues } from '../../hooks/useRegistrationForm';

interface AdditionalFieldsProps {
  form: UseFormReturn<RegistrationFormValues>;
}

const AdditionalFields: React.FC<AdditionalFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="nationality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nationalité</FormLabel>
            <FormControl>
              <Input placeholder="Nationalité" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="roomNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de chambre</FormLabel>
            <FormControl>
              <Input placeholder="Numéro de chambre" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Email" {...field} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AdditionalFields;
