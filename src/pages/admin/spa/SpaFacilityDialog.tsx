
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useSpaFacilities } from '@/hooks/useSpaFacilities';
import { SpaFacility } from '@/features/spa/types';

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  location: z.string().min(1, "L'emplacement est requis"),
  image_url: z.string().optional(),
  capacity: z.string().optional(),
  opening_hours: z.string().optional(),
  status: z.enum(['open', 'closed'])
});

type FormValues = z.infer<typeof formSchema>;

interface SpaFacilityDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  facility: SpaFacility | null;
  onClose: (success: boolean) => void;
}

const SpaFacilityDialog = ({ isOpen, onOpenChange, facility, onClose }: SpaFacilityDialogProps) => {
  const { createFacility, updateFacility, isCreating, isUpdating } = useSpaFacilities();
  const isEditing = !!facility;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      image_url: "",
      capacity: "",
      opening_hours: "",
      status: "open"
    }
  });

  // Set form values when editing
  React.useEffect(() => {
    if (isOpen && facility) {
      form.reset({
        name: facility.name,
        description: facility.description || "",
        location: facility.location || "",
        image_url: facility.image_url || "",
        capacity: facility.capacity ? String(facility.capacity) : "",
        opening_hours: facility.opening_hours || "",
        status: facility.status as 'open' | 'closed'
      });
    } else if (isOpen) {
      form.reset({
        name: "",
        description: "",
        location: "",
        image_url: "",
        capacity: "",
        opening_hours: "",
        status: "open"
      });
    }
  }, [isOpen, facility, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing && facility) {
        await updateFacility({
          id: facility.id,
          ...values,
          capacity: values.capacity ? parseInt(values.capacity) : null
        });
      } else {
        await createFacility({
          ...values,
          capacity: values.capacity ? parseInt(values.capacity) : null
        });
      }
      onClose(true);
    } catch (error) {
      console.error('Error submitting facility form:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier l'installation" : "Ajouter une installation"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les détails de l'installation ci-dessous."
              : "Remplissez le formulaire pour ajouter une nouvelle installation spa."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input placeholder="Ex: 2ème étage" {...field} />
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
                        placeholder="Nombre de personnes"
                        {...field}
                      />
                    </FormControl>
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
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose(false)}
                disabled={isCreating || isUpdating}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
              >
                {(isCreating || isUpdating) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SpaFacilityDialog;
