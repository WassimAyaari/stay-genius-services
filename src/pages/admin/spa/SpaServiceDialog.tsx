
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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  duration: z.string().min(1, "La durée est requise"),
  price: z.string().min(1, "Le prix est requis").refine(val => !isNaN(Number(val)), {
    message: "Le prix doit être un nombre",
  }),
  image: z.string().optional(),
  category: z.enum(['massage', 'facial', 'body', 'wellness']),
  status: z.enum(['available', 'unavailable']),
  is_featured: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

interface SpaServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  service: any | null;
  facilityId: string;
  onClose: (success: boolean) => void;
}

const SpaServiceDialog = ({ isOpen, onOpenChange, service, facilityId, onClose }: SpaServiceDialogProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditing = !!service;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      price: "",
      image: "",
      category: "massage",
      status: "available",
      is_featured: false
    }
  });

  // Set form values when editing
  React.useEffect(() => {
    if (isOpen && service) {
      form.reset({
        name: service.name,
        description: service.description || "",
        duration: service.duration || "",
        price: service.price ? String(service.price) : "",
        image: service.image || "",
        category: service.category || "massage",
        status: service.status || "available",
        is_featured: !!service.is_featured
      });
    } else if (isOpen) {
      form.reset({
        name: "",
        description: "",
        duration: "",
        price: "",
        image: "",
        category: "massage",
        status: "available",
        is_featured: false
      });
    }
  }, [isOpen, service, form]);

  const onSubmit = async (values: FormValues) => {
    if (!facilityId) {
      toast.error("Id d'installation manquant");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const serviceData = {
        name: values.name,
        description: values.description,
        duration: values.duration,
        price: parseFloat(values.price),
        image: values.image || null,
        category: values.category,
        status: values.status,
        facility_id: facilityId,
        is_featured: values.is_featured
      };

      if (isEditing) {
        const { error } = await supabase
          .from('spa_services')
          .update(serviceData)
          .eq('id', service.id);

        if (error) throw error;
        toast.success('Service mis à jour avec succès');
      } else {
        const { error } = await supabase
          .from('spa_services')
          .insert(serviceData);

        if (error) throw error;
        toast.success('Service créé avec succès');
      }

      onClose(true);
    } catch (error) {
      console.error('Error submitting service:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le service" : "Ajouter un service"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les détails du service ci-dessous."
              : "Remplissez le formulaire pour ajouter un nouveau service."}
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
                    <Textarea
                      placeholder="Description du service"
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
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 60 minutes" {...field} />
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
                    <FormLabel>Prix ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Ex: 120"
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
              name="image"
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
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="massage">Massage</SelectItem>
                        <SelectItem value="facial">Soins du visage</SelectItem>
                        <SelectItem value="body">Soins du corps</SelectItem>
                        <SelectItem value="wellness">Bien-être</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="unavailable">Non disponible</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mettre en avant</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Ce service sera affiché dans les services en vedette
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting && (
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

export default SpaServiceDialog;
