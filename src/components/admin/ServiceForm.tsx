
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HotelService } from '@/lib/types';

const serviceSchema = z.object({
  title: z.string().min(1, { message: 'Le titre est requis' }),
  description: z.string().min(1, { message: 'La description est requise' }),
  icon: z.string().min(1, { message: "L'icône est requis" }),
  action_text: z.string().min(1, { message: "Le texte d'action est requis" }),
  action_link: z.string().min(1, { message: "Le lien d'action est requis" }),
  type: z.string().min(1, { message: 'Le type est requis' }),
  display_order: z.coerce.number(),
  status: z.string().min(1, { message: 'Le statut est requis' }),
});

interface ServiceFormProps {
  initialData: HotelService;
  onSubmit: (data: HotelService) => void;
}

const defaultService: HotelService = {
  id: '',
  hotel_id: '',
  title: '',
  description: '',
  icon: '',
  action_text: 'Explorer',
  action_link: '#',
  status: 'active',
  type: 'main',
  display_order: 0
};

const ServiceForm = ({ initialData = defaultService, onSubmit }: ServiceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description,
      icon: initialData.icon,
      action_text: initialData.action_text,
      action_link: initialData.action_link,
      type: initialData.type,
      display_order: initialData.display_order,
      status: initialData.status,
    },
  });

  const handleSubmit = async (data: z.infer<typeof serviceSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...initialData,
        ...data,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
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

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icône</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'icône ou URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="action_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texte du bouton</FormLabel>
              <FormControl>
                <Input placeholder="Explorer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="action_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lien du bouton</FormLabel>
              <FormControl>
                <Input placeholder="/services/spa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="main">Principal</SelectItem>
                  <SelectItem value="additional">Additionnel</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="display_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordre d'affichage</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </Form>
  );
};

export default ServiceForm;
