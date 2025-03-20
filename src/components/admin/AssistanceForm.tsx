
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HotelAssistance, defaultHotelAssistance } from '@/lib/types';

const assistanceSchema = z.object({
  title: z.string().min(1, { message: 'Le titre est requis' }),
  description: z.string().min(1, { message: 'La description est requise' }),
  action_text: z.string().min(1, { message: "Le texte d'action est requis" }),
  action_link: z.string().min(1, { message: "Le lien d'action est requis" }),
  background_image: z.string().min(1, { message: "L'URL de l'image de fond est requise" }),
  status: z.string().min(1, { message: 'Le statut est requis' }),
});

interface AssistanceFormProps {
  initialData: HotelAssistance;
  onSubmit: (data: HotelAssistance) => void;
}

const AssistanceForm = ({ initialData = defaultHotelAssistance, onSubmit }: AssistanceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof assistanceSchema>>({
    resolver: zodResolver(assistanceSchema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description,
      action_text: initialData.action_text,
      action_link: initialData.action_link,
      background_image: initialData.background_image,
      status: initialData.status,
    },
  });

  const handleSubmit = async (data: z.infer<typeof assistanceSchema>) => {
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
                <Input placeholder="Besoin d'assistance ?" {...field} />
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
                <Textarea placeholder="Description de l'assistance" {...field} />
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
                <Input placeholder="Contacter" {...field} />
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
                <Input placeholder="/contact" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="background_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l'image de fond</FormLabel>
              <FormControl>
                <Input placeholder="https://exemple.com/image.jpg" {...field} />
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

export default AssistanceForm;
