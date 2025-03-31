
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface GuestInfoFieldsProps {
  form: UseFormReturn<any>;
}

const GuestInfoFields = ({ form }: GuestInfoFieldsProps) => {
  const roomNumber = form.watch('roomNumber');
  
  return (
    <>
      {!roomNumber && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Numéro de chambre requis</AlertTitle>
          <AlertDescription>
            Veuillez indiquer votre numéro de chambre pour pouvoir effectuer une réservation.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="guestName"
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
          rules={{ required: "Le numéro de chambre est obligatoire" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de chambre</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Votre numéro de chambre" 
                  {...field} 
                  className={!field.value ? "border-red-500 focus:ring-red-500" : ""}
                />
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
