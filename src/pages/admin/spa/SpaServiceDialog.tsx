import React, { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { SpaService, SpaFacility } from '@/features/spa/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const serviceSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  description: z.string().min(1, { message: "La description est requise" }),
  duration: z.string().min(1, { message: "La durée est requise" }),
  price: z.number().positive({ message: "Le prix doit être supérieur à 0" }),
  category: z.string().min(1, { message: "La catégorie est requise" }),
  facility_id: z.string().min(1, { message: "L'installation est requise" }),
  is_featured: z.boolean().default(false),
  image: z.string().optional(),
  status: z.enum(['available', 'unavailable']),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export interface SpaServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: SpaService | null;
  facilities: SpaFacility[];
  onClose: (success: boolean) => void;
}

export default function SpaServiceDialog({ 
  open, 
  onOpenChange, 
  service, 
  facilities,
  onClose 
}: SpaServiceDialogProps) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      duration: service?.duration || '',
      price: service?.price || 0,
      category: service?.category || 'massage',
      facility_id: service?.facility_id || '',
      is_featured: service?.is_featured || false,
      image: service?.image || '',
      status: (service?.status as 'available' | 'unavailable') || 'available',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        facility_id: service.facility_id,
        is_featured: service.is_featured || false,
        image: service.image || '',
        status: (service.status as 'available' | 'unavailable') || 'available',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        duration: '',
        price: 0,
        category: 'massage',
        facility_id: facilities.length > 0 ? facilities[0].id : '',
        is_featured: false,
        image: '',
        status: 'available',
      });
    }
  }, [service, form, facilities]);

  const onSubmit = async (values: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      if (service) {
        // Update existing service
        const { error } = await supabase
          .from('spa_services')
          .update({
            name: values.name,
            description: values.description,
            duration: values.duration,
            price: values.price,
            category: values.category,
            facility_id: values.facility_id,
            is_featured: values.is_featured,
            image: values.image,
            status: values.status,
          })
          .eq('id', service.id);
          
        if (error) throw error;
        toast.success('Service mis à jour avec succès');
      } else {
        // Create new service
        const { error } = await supabase
          .from('spa_services')
          .insert({
            name: values.name,
            description: values.description,
            duration: values.duration,
            price: values.price,
            category: values.category,
            facility_id: values.facility_id,
            is_featured: values.is_featured,
            image: values.image,
            status: values.status,
          });
          
        if (error) throw error;
        toast.success('Service créé avec succès');
      }
      
      onClose(true);
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Erreur lors de l\'enregistrement du service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{service ? 'Modifier le service' : 'Ajouter un service'}</DialogTitle>
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
                    <Input placeholder="Nom du service" {...field} />
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
                    <Textarea placeholder="Description du service" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 60 min" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Prix"
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="massage">Massage</SelectItem>
                        <SelectItem value="facial">Soin du visage</SelectItem>
                        <SelectItem value="body">Soin du corps</SelectItem>
                        <SelectItem value="wellness">Bien-être</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facility_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une installation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem key={facility.id} value={facility.id}>
                            {facility.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="unavailable">Indisponible</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
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
            </div>

            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Mettre en avant</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Afficher ce service sur la page d'accueil
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                {isSubmitting ? 'Enregistrement...' : service ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
