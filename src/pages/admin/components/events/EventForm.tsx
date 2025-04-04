
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Event } from '@/types/event';

const formSchema = z.object({
  title: z.string().min(1, 'Le titre est obligatoire'),
  description: z.string().min(1, 'La description est obligatoire'),
  image: z.string().url('Veuillez saisir une URL d\'image valide'),
  category: z.enum(['event', 'promo'], {
    required_error: 'Veuillez sélectionner une catégorie',
  }),
  date: z.string().min(1, 'La date est obligatoire'),
  time: z.string().optional(),
  location: z.string().optional(),
  is_featured: z.boolean().optional().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  onSubmit: (data: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => void;
  initialData?: Event | null;
}

export const EventForm: React.FC<EventFormProps> = ({ onSubmit, initialData }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData 
      ? {
          ...initialData,
          date: format(new Date(initialData.date), 'yyyy-MM-dd'),
        }
      : {
          title: '',
          description: '',
          image: '',
          category: 'event',
          date: format(new Date(), 'yyyy-MM-dd'),
          time: '',
          location: '',
          is_featured: false,
        },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre de l'événement" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Catégorie</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="event" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Événement</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="promo" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Promotion</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure (optionnel)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 19:00 - 22:00" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Lieu de l'événement" {...field} value={field.value || ''} />
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
                <Input placeholder="https://example.com/image.jpg" {...field} />
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
                  placeholder="Description de l'événement"
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Réinitialiser
          </Button>
          <Button type="submit">
            {initialData ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
