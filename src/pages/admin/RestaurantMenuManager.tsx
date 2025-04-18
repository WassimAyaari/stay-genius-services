import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useRestaurantMenus } from '@/hooks/useRestaurantMenus';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MenuItem } from '@/features/dining/types';
import { Pencil, Trash2, Plus, Image, ArrowLeft, Upload, Store, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { compressAndConvertToWebP } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Menu item name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  category: z.string().min(2, {
    message: "Category is required.",
  }),
  image: z.string().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['available', 'unavailable']),
  menuPdf: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const RestaurantMenuManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  const { 
    menuItems, 
    isLoading, 
    error, 
    updateMenuItem, 
    createMenuItem, 
    deleteMenuItem 
  } = useRestaurantMenus(restaurantId || undefined);
  const { restaurants, isLoading: isLoadingRestaurants } = useRestaurants();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const restaurant = restaurants?.find(r => r.id === restaurantId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      isFeatured: false,
      status: "available" as const,
      menuPdf: "",
    },
  });

  // Update form when editing item changes or dialog opens
  useEffect(() => {
    if (isDialogOpen && editingItem) {
      form.reset({
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price,
        category: editingItem.category,
        image: editingItem.image || "",
        isFeatured: editingItem.isFeatured,
        status: editingItem.status,
        menuPdf: editingItem.menuPdf || "",
      });
    } else if (isDialogOpen && !editingItem) {
      // Reset form when opening for a new menu item
      form.reset({
        name: "",
        description: "",
        price: 0,
        category: "",
        image: "",
        isFeatured: false,
        status: "available" as const,
        menuPdf: "",
      });
    }
  }, [isDialogOpen, editingItem, form]);

  const handleSubmit = async (values: FormValues) => {
    if (!restaurantId) {
      toast("Error", {
        description: "Please select a restaurant first."
      });
      return;
    }
    
    try {
      if (editingItem) {
        await updateMenuItem({
          id: editingItem.id,
          restaurantId,
          name: values.name,
          description: values.description,
          price: values.price,
          category: values.category,
          image: values.image || undefined,
          isFeatured: values.isFeatured,
          status: values.status,
          menuPdf: values.menuPdf || undefined,
        });
        toast("Menu item updated", {
          description: "The menu item has been updated successfully."
        });
      } else {
        await createMenuItem({
          restaurantId,
          name: values.name,
          description: values.description,
          price: values.price,
          category: values.category,
          image: values.image || undefined,
          isFeatured: values.isFeatured,
          status: values.status,
          menuPdf: values.menuPdf || undefined,
        });
        toast("Menu item added", {
          description: "The menu item has been added successfully."
        });
      }
      setIsDialogOpen(false);
      form.reset();
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast("Error", {
        description: "There was a problem saving the menu item."
      });
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMenuItem(id);
      toast("Menu item deleted", {
        description: "The menu item has been deleted successfully."
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast("Error", {
        description: "There was a problem deleting the menu item."
      });
    }
  };

  const handleDialogOpen = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast("Error", {
        description: "Only image files are accepted."
      });
      return;
    }

    try {
      setIsProcessing(true);
      const compressedImageDataUrl = await compressAndConvertToWebP(file);
      form.setValue("image", compressedImageDataUrl);
    } catch (error) {
      console.error("Error processing image:", error);
      toast("Error", {
        description: "There was a problem processing the image."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
      // Reset the input value so the same file can be selected again
      e.target.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRestaurantChange = (id: string) => {
    setSearchParams({ restaurantId: id });
  };

  const RestaurantSelector = () => (
    <div className="space-y-6 py-12">
      <div className="text-center space-y-2">
        <Store className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Sélectionner un restaurant</h2>
        <p className="text-muted-foreground">Veuillez choisir un restaurant pour gérer son menu</p>
      </div>
      
      {isLoadingRestaurants ? (
        <div className="text-center py-4">Chargement des restaurants...</div>
      ) : restaurants && restaurants.length > 0 ? (
        <div className="max-w-md mx-auto">
          <Select onValueChange={handleRestaurantChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un restaurant" />
            </SelectTrigger>
            <SelectContent>
              {restaurants.map((restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="mt-4 text-center">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/restaurants">
                <Plus className="mr-2 h-4 w-4" />
                Créer un restaurant
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 space-y-4">
          <p className="text-muted-foreground">Aucun restaurant trouvé</p>
          <Button asChild>
            <Link to="/admin/restaurants">
              <Plus className="mr-2 h-4 w-4" />
              Créer un restaurant
            </Link>
          </Button>
        </div>
      )}
    </div>
  );

  const handlePdfUpload = async (file: File) => {
    if (!file.type.startsWith('application/pdf')) {
      toast.error("Seuls les fichiers PDF sont acceptés");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Le fichier PDF ne doit pas dépasser 5MB");
      return;
    }

    try {
      setIsProcessing(true);
      // Convert PDF to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          form.setValue("menuPdf", reader.result);
        }
      };
    } catch (error) {
      console.error("Erreur lors du traitement du PDF:", error);
      toast.error("Erreur lors du traitement du PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingRestaurants) return <div className="p-8 text-center">Chargement des restaurants...</div>;
  if (!restaurantId) return <RestaurantSelector />;
  if (error) return <div className="p-8 text-center text-red-500">Erreur lors du chargement des menus : {error.message}</div>;
  if (!restaurant) return (
    <div className="p-8 text-center">
      <h2 className="text-xl text-red-500 mb-4">Restaurant non trouvé</h2>
      <RestaurantSelector />
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setSearchParams({})}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Changer de restaurant
          </Button>
          <h1 className="text-2xl font-bold">{restaurant.name} - Menu</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" onClick={handleDialogOpen}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un plat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Modifier le plat" : "Ajouter un plat"}</DialogTitle>
              <DialogDescription>
                {editingItem 
                  ? "Modifiez les informations du plat." 
                  : "Remplissez le formulaire pour ajouter un nouveau plat."}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du plat" {...field} />
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
                            placeholder="Description du plat" 
                            {...field} 
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              {...field} 
                              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                            />
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
                            <Input placeholder="Ex: Entrées, Plats principaux" {...field} />
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
                        <FormLabel>Image</FormLabel>
                        
                        {/* URL Input */}
                        <FormControl>
                          <Input 
                            placeholder="URL de l'image (optionnel)" 
                            {...field} 
                            value={field.value || ""}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        
                        {/* File upload area */}
                        <div 
                          className={cn(
                            "border-2 border-dashed rounded-md p-6 mt-2 flex flex-col items-center justify-center cursor-pointer transition-colors",
                            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-muted-foreground/50",
                            isProcessing && "opacity-50 cursor-not-allowed"
                          )}
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => !isProcessing && document.getElementById('menu-image-upload')?.click()}
                        >
                          <input
                            id="menu-image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleInputFileChange}
                            disabled={isProcessing}
                          />
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground text-center mb-1">
                            Déposez une image ici ou cliquez pour naviguer
                          </p>
                          <p className="text-xs text-muted-foreground text-center">
                            Les images seront compressées à ~30KB et converties au format WebP
                          </p>
                          {isProcessing && (
                            <p className="text-xs text-primary mt-2 animate-pulse">
                              Traitement de l'image...
                            </p>
                          )}
                        </div>
                        
                        {/* Image preview */}
                        {field.value && !isProcessing && (
                          <div className="mt-2 relative">
                            <div className="relative aspect-video rounded-md overflow-hidden border">
                              <img 
                                src={field.value} 
                                alt="Aperçu du plat" 
                                className="object-cover w-full h-full"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                onClick={() => form.setValue("image", "")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <FormDescription>
                          Téléchargez une image ou fournissez une URL pour le plat.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="menuPdf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Menu PDF (optionnel)</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {field.value && (
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">PDF ajouté</span>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => form.setValue("menuPdf", "")}
                                >
                                  Supprimer
                                </Button>
                              </div>
                            )}
                            <div
                              className={cn(
                                "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
                                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-muted-foreground/50",
                                isProcessing && "opacity-50 cursor-not-allowed"
                              )}
                              onDragEnter={handleDrag}
                              onDragOver={handleDrag}
                              onDragLeave={handleDrag}
                              onDrop={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDragActive(false);
                                
                                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                  await handlePdfUpload(e.dataTransfer.files[0]);
                                }
                              }}
                              onClick={() => !isProcessing && document.getElementById('pdf-upload')?.click()}
                            >
                              <input
                                id="pdf-upload"
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={async (e) => {
                                  const files = e.target.files;
                                  if (files && files.length > 0) {
                                    await handlePdfUpload(files[0]);
                                    e.target.value = '';
                                  }
                                }}
                                disabled={isProcessing}
                              />
                              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground text-center mb-1">
                                Déposez un PDF ici ou cliquez pour naviguer
                              </p>
                              <p className="text-xs text-muted-foreground text-center">
                                Taille maximale: 5MB
                              </p>
                              {isProcessing && (
                                <p className="text-xs text-primary mt-2 animate-pulse">
                                  Traitement du PDF...
                                </p>
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>À la une</FormLabel>
                            <FormDescription>
                              Les plats mis en avant apparaissent dans des sections spéciales.
                            </FormDescription>
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
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Statut</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un statut" />
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
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit">{editingItem ? "Mettre à jour" : "Créer"}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu de {restaurant.name}</CardTitle>
          <CardDescription>Gérez les plats du restaurant.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Chargement du menu...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Mise en avant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems?.length ? (
                  menuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.price.toFixed(2)} €</TableCell>
                      <TableCell>
                        {item.isFeatured ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            À la une
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === "available" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {item.status === "available" ? "Disponible" : "Indisponible"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action ne peut pas être annulée. Le plat sera définitivement supprimé.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Aucun plat trouvé. Ajoutez votre premier plat pour commencer.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantMenuManager;

function useToast() {
  return {
    toast
  };
}
