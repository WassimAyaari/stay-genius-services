
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { HotelHero, defaultHotelHero } from '@/lib/types';
import { Card } from '@/components/ui/card';

const heroSchema = z.object({
  title: z.string().min(1, { message: 'Le titre est requis' }),
  subtitle: z.string().min(1, { message: 'Le sous-titre est requis' }),
  background_image: z.string().min(1, { message: "L'URL de l'image est requise" }),
  search_placeholder: z.string().min(1, { message: 'Le texte du placeholder est requis' }),
  status: z.string().min(1, { message: 'Le statut est requis' }),
});

interface HeroFormProps {
  initialData: HotelHero;
  onSubmit: (data: HotelHero) => void;
  isSubmitting?: boolean;
}

const HeroForm = ({ initialData = defaultHotelHero, onSubmit, isSubmitting = false }: HeroFormProps) => {
  const form = useForm<z.infer<typeof heroSchema>>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: initialData.title,
      subtitle: initialData.subtitle,
      background_image: initialData.background_image,
      search_placeholder: initialData.search_placeholder,
      status: initialData.status,
    },
  });

  const handleSubmit = async (data: z.infer<typeof heroSchema>) => {
    await onSubmit({
      ...initialData,
      ...data,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input placeholder="Bienvenue dans notre hôtel" {...field} />
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
                  <Input placeholder="Découvrez une expérience unique" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="search_placeholder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texte du placeholder de recherche</FormLabel>
                <FormControl>
                  <Input placeholder="Rechercher un service..." {...field} />
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
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" disabled={isSubmitting}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HeroForm;
