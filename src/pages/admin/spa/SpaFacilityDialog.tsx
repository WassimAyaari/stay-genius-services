
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SpaFacility } from '@/features/spa/types';
import { useSpaFacilities } from '@/hooks/useSpaFacilities';

const facilitySchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  description: z.string().optional(),
  location: z.string().optional(),
  capacity: z.number().int().nonnegative().optional(),
  image_url: z.string().optional(),
  opening_hours: z.string().optional(),
  status: z.enum(['open', 'closed']),
});

type FacilityFormValues = z.infer<typeof facilitySchema>;

export interface SpaFacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility: SpaFacility | null;
  onClose: (success: boolean) => void;
}

export default function SpaFacilityDialog({ open, onOpenChange, facility, onClose }: SpaFacilityDialogProps) {
  const { createFacility, updateFacility, isCreating, isUpdating } = useSpaFacilities();
  const isLoading = isCreating || isUpdating;

  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: facility?.name || '',
      description: facility?.description || '',
      location: facility?.location || '',
      capacity: facility?.capacity || 0,
      image_url: facility?.image_url || '',
      opening_hours: facility?.opening_hours || '',
      status: (facility?.status as 'open' | 'closed') || 'open',
    },
  });

  React.useEffect(() => {
    if (facility) {
      form.reset({
        name: facility.name,
        description: facility.description || '',
        location: facility.location || '',
        capacity: facility.capacity || 0,
        image_url: facility.image_url || '',
        opening_hours: facility.opening_hours || '',
        status: (facility.status as 'open' | 'closed') || 'open',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        location: '',
        capacity: 0,
        image_url: '',
        opening_hours: '',
        status: 'open',
      });
    }
  }, [facility, form]);

  const onSubmit = (values: FacilityFormValues) => {
    if (facility) {
      updateFacility({
        ...values,
        id: facility.id,
      } as SpaFacility, {
        onSuccess: () => {
          onClose(true);
        },
      });
    } else {
      createFacility({
        ...values,
        name: values.name
      } as Omit<SpaFacility, 'id' | 'created_at' | 'updated_at'>, {
        onSuccess: () => {
          onClose(true);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{facility ? 'Modifier l\'installation' : 'Ajouter une installation'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
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
                    <Textarea placeholder="Description de l'installation" {...field} />
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
                      <Input placeholder="Emplacement" {...field} />
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
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Ouvert</SelectItem>
                        <SelectItem value="closed">Fermé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Enregistrement...' : facility ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
