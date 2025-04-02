
import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSpaFacilities } from '@/hooks/useSpaFacilities';
import { SpaFacility } from '@/features/spa/types';

const facilitySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  location: z.string().optional(),
  image_url: z.string().optional(),
  opening_hours: z.string().optional(),
  capacity: z.number().int().optional(),
  status: z.enum(['open', 'closed']).default('open'),
});

type FacilityFormValues = z.infer<typeof facilitySchema>;

interface SpaFacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility?: SpaFacility;
}

const SpaFacilityDialog: React.FC<SpaFacilityDialogProps> = ({ 
  open, 
  onOpenChange,
  facility
}) => {
  const { createFacility, updateFacility, isCreating, isUpdating } = useSpaFacilities();
  const isSubmitting = isCreating || isUpdating;
  const isEditing = !!facility;
  
  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      image_url: '',
      opening_hours: '',
      capacity: 0,
      status: 'open' as const,
    }
  });

  useEffect(() => {
    if (facility) {
      form.reset({
        name: facility.name,
        description: facility.description || '',
        location: facility.location || '',
        image_url: facility.image_url || '',
        opening_hours: facility.opening_hours || '',
        capacity: facility.capacity || 0,
        status: facility.status,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        location: '',
        image_url: '',
        opening_hours: '',
        capacity: 0,
        status: 'open' as const,
      });
    }
  }, [facility, form]);

  const onSubmit = async (data: FacilityFormValues) => {
    try {
      if (isEditing && facility) {
        await updateFacility({
          ...facility,
          ...data,
        });
      } else {
        await createFacility({
          ...data,
          status: data.status || 'open',
        });
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier' : 'Ajouter'} une installation spa</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les détails de cette installation spa'
              : 'Remplissez les informations pour créer une nouvelle installation spa'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'installation" {...field} />
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
                    <Textarea 
                      placeholder="Description de l'installation" 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emplacement</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Niveau 4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacité</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Capacité" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="opening_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heures d'ouverture</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 9h-20h tous les jours" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de l'image</FormLabel>
                  <FormControl>
                    <Input placeholder="URL de l'image" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : isEditing ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SpaFacilityDialog;
