
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface GuestInfoFieldsProps {
  form: UseFormReturn<any>;
}

const GuestInfoFields = ({ form }: GuestInfoFieldsProps) => {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="guestName"
          rules={{ required: 'Le nom est requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="guestEmail"
          rules={{ 
            required: 'L\'email est requis',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Adresse email invalide'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="votre@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="guestPhone"
          rules={{ required: 'Le téléphone est requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input placeholder="Votre numéro de téléphone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="roomNumber"
          rules={{ required: 'Le numéro de chambre est requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de chambre</FormLabel>
              <FormControl>
                <Input placeholder="Votre numéro de chambre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default GuestInfoFields;
