
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useHotelConfig } from '@/hooks/useHotelConfig';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: 'Le nom doit contenir au moins 2 caractères.',
  }),
  logo_url: z.string().url({
    message: 'Veuillez entrer une URL valide.',
  }).optional().nullable(),
  primary_color: z.string().regex(/^#[0-9A-F]{6}$/i, {
    message: 'Veuillez entrer une couleur hexadécimale valide (ex: #1e40af).',
  }),
  secondary_color: z.string().regex(/^#[0-9A-F]{6}$/i, {
    message: 'Veuillez entrer une couleur hexadécimale valide (ex: #4f46e5).',
  }),
  contact_email: z.string().email({
    message: 'Veuillez entrer une adresse email valide.',
  }).optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

type ConfigFormValues = z.infer<typeof formSchema>;

const ConfigPage = () => {
  const { hotelConfig, isLoading, updateHotelConfig, isUpdating } = useHotelConfig();

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      logo_url: '',
      primary_color: '#1e40af',
      secondary_color: '#4f46e5',
      contact_email: '',
      contact_phone: '',
      address: '',
    },
  });

  React.useEffect(() => {
    if (hotelConfig) {
      form.reset({
        id: hotelConfig.id,
        name: hotelConfig.name,
        logo_url: hotelConfig.logo_url || '',
        primary_color: hotelConfig.primary_color || '#1e40af',
        secondary_color: hotelConfig.secondary_color || '#4f46e5',
        contact_email: hotelConfig.contact_email || '',
        contact_phone: hotelConfig.contact_phone || '',
        address: hotelConfig.address || '',
      });
    }
  }, [hotelConfig, form]);

  const onSubmit = (values: ConfigFormValues) => {
    updateHotelConfig(values);
  };

  if (isLoading) {
    return <div className="container mx-auto p-6">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-secondary">Configuration de l'hôtel</h1>
          <p className="text-gray-600">Gérez les informations de base de votre hôtel</p>
        </div>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'hôtel</FormLabel>
                  <FormControl>
                    <Input placeholder="Hotel Genius" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL du logo</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    URL de l'image du logo de votre hôtel
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="primary_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleur primaire</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                    <FormDescription>
                      Code hexadécimal (ex: #1e40af)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondary_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleur secondaire</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                    <FormDescription>
                      Code hexadécimal (ex: #4f46e5)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de contact</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@hotelgenius.com" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone de contact</FormLabel>
                  <FormControl>
                    <Input placeholder="+33 1 23 45 67 89" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Rue de l'Hôtel, 75001 Paris" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full md:w-auto" 
              disabled={isUpdating}
            >
              {isUpdating ? 'Enregistrement...' : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Enregistrer les modifications
                </>
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ConfigPage;
