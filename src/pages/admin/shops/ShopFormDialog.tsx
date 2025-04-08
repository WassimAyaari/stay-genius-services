
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shop, ShopFormData } from '@/types/shop';
import { useForm } from 'react-hook-form';
import { useShops } from '@/hooks/useShops';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import ImageUploader from '@/components/admin/shops/ImageUploader';

interface ShopFormDialogProps {
  open: boolean;
  onClose: () => void;
  shop: Shop | null;
}

const ShopFormDialog = ({ open, onClose, shop }: ShopFormDialogProps) => {
  const { categories, createShop, updateShop } = useShops();
  const isEditing = !!shop;

  const form = useForm<ShopFormData>({
    defaultValues: {
      name: shop?.name || '',
      description: shop?.description || '',
      short_description: shop?.short_description || '',
      location: shop?.location || '',
      hours: shop?.hours || '',
      image: shop?.image || '',
      category_id: shop?.category_id || undefined,
      is_hotel_shop: shop?.is_hotel_shop || false,
      is_featured: shop?.is_featured || false,
      contact_phone: shop?.contact_phone || '',
      contact_email: shop?.contact_email || '',
      status: shop?.status || 'active'
    }
  });

  React.useEffect(() => {
    if (open && shop) {
      form.reset({
        name: shop.name,
        description: shop.description,
        short_description: shop.short_description || '',
        location: shop.location || '',
        hours: shop.hours || '',
        image: shop.image || '',
        category_id: shop.category_id,
        is_hotel_shop: shop.is_hotel_shop || false,
        is_featured: shop.is_featured || false,
        contact_phone: shop.contact_phone || '',
        contact_email: shop.contact_email || '',
        status: shop.status || 'active'
      });
    } else if (open) {
      form.reset({
        name: '',
        description: '',
        short_description: '',
        location: '',
        hours: '',
        image: '',
        category_id: undefined,
        is_hotel_shop: false,
        is_featured: false,
        contact_phone: '',
        contact_email: '',
        status: 'active'
      });
    }
  }, [open, shop, form]);

  const onSubmit = (data: ShopFormData) => {
    if (isEditing && shop) {
      updateShop({ id: shop.id, data });
    } else {
      createShop(data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Modifier la boutique: ${shop?.name}` : 'Ajouter une nouvelle boutique'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(80vh-180px)] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: 'Le nom est requis' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de la boutique" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="short_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description courte</FormLabel>
                      <FormControl>
                        <Input placeholder="Description courte" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  name="hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horaires</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 9h-19h" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de contact</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
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
                        <Input placeholder="Téléphone" {...field} />
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
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="inactive">Inactif</SelectItem>
                          <SelectItem value="coming_soon">Bientôt disponible</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormLabel>Image</FormLabel>
                    <div className="space-y-2">
                      <FormControl>
                        <ImageUploader 
                          value={field.value} 
                          onChange={field.onChange} 
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                rules={{ required: 'La description est requise' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description complète</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description détaillée de la boutique" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="is_hotel_shop"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Boutique de l'hôtel</FormLabel>
                        <p className="text-sm text-gray-500">
                          Cette boutique appartient-elle à l'hôtel ?
                        </p>
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

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Boutique mise en avant</FormLabel>
                        <p className="text-sm text-gray-500">
                          Cette boutique doit-elle apparaître en premier ?
                        </p>
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
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                <Button type="submit">{isEditing ? 'Mettre à jour' : 'Créer'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ShopFormDialog;
