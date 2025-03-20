
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HotelExperience, defaultHotelExperience } from '@/lib/types';

const experienceSchema = z.object({
  title: z.string().min(1, { message: 'Le titre est requis' }),
  subtitle: z.string().min(1, { message: 'Le sous-titre est requis' }),
  description: z.string().min(1, { message: 'La description est requise' }),
  image: z.string().min(1, { message: "L'URL de l'image est requise" }),
  action_text: z.string().min(1, { message: "Le texte d'action est requis" }),
  action_link: z.string().min(1, { message: "Le lien d'action est requis" }),
  category: z.string().min(1, { message: 'La catégorie est requise' }),
  display_order: z.coerce.number(),
  status: z.string().min(1, { message: 'Le statut est requis' }),
});

interface ExperienceFormProps {
  initialData: HotelExperience;
  onSubmit: (data: HotelExperience) => void;
}

const ExperienceForm = ({ initialData = defaultHotelExperience, onSubmit }: ExperienceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: initialData.title,
      subtitle: initialData.subtitle,
      description: initialData.description,
      image: initialData.image,
      action_text: initialData.action_text,
      action_link: initialData.action_link,
      category: initialData.category,
      display_order: initialData.display_order,
      status: initialData.status,
    },
  });

  const handleSubmit = async (data: z.infer<typeof experienceSchema>) => {
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
                <Input placeholder="Nom de l'expérience" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sous-titre</FormLabel>
              <FormControl>
                <Input placeholder="Sous-titre de l'expérience" {...field} />
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
                <Textarea placeholder="Description de l'expérience" {...field} />
              </FormControl>
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
                <Input placeholder="https://exemple.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <FormControl>
                <Input placeholder="Catégorie" {...field} />
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
                <Input placeholder="/experiences/spa" {...field} />
              </FormControl>
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

export default ExperienceForm;
