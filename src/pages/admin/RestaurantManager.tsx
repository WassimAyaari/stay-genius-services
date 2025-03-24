
import React, { useState } from 'react';
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
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Restaurant } from '@/features/dining/types';
import { Pencil, Trash2, Plus, Image } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Restaurant name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  cuisine: z.string().min(2, {
    message: "Cuisine type is required.",
  }),
  openHours: z.string().min(2, {
    message: "Opening hours are required.",
  }),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  status: z.enum(['open', 'closed']),
  images: z.array(z.string()).min(1, {
    message: "At least one image is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const RestaurantManager: React.FC = () => {
  const { toast } = useToast();
  const { restaurants, isLoading, error, updateRestaurant, createRestaurant, deleteRestaurant } = useRestaurants();
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      cuisine: "",
      openHours: "",
      location: "",
      status: "open" as const,
      images: [""],
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      if (editingRestaurant) {
        await updateRestaurant({
          ...values,
          id: editingRestaurant.id,
          status: values.status,
        });
        toast({
          title: "Restaurant updated",
          description: "The restaurant has been updated successfully.",
        });
      } else {
        await createRestaurant({
          ...values,
          status: values.status,
        });
        toast({
          title: "Restaurant added",
          description: "The restaurant has been added successfully.",
        });
      }
      setIsDialogOpen(false);
      form.reset();
      setEditingRestaurant(null);
    } catch (error) {
      console.error("Error saving restaurant:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving the restaurant.",
      });
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    form.reset({
      name: restaurant.name,
      description: restaurant.description,
      cuisine: restaurant.cuisine,
      openHours: restaurant.openHours,
      location: restaurant.location,
      status: restaurant.status,
      images: restaurant.images,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRestaurant(id);
      toast({
        title: "Restaurant deleted",
        description: "The restaurant has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem deleting the restaurant.",
      });
    }
  };

  const handleAddImage = () => {
    if (newImageUrl) {
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  const handleDialogOpen = () => {
    form.reset({
      name: "",
      description: "",
      cuisine: "",
      openHours: "",
      location: "",
      status: "open" as const,
      images: [],
    });
    setEditingRestaurant(null);
    setIsDialogOpen(true);
  };

  if (isLoading) return <div className="p-8 text-center">Loading restaurants...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading restaurants: {error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurant Manager</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" onClick={handleDialogOpen}>
              <Plus className="mr-2 h-4 w-4" /> Add Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}</DialogTitle>
              <DialogDescription>
                {editingRestaurant 
                  ? "Update the restaurant details below." 
                  : "Fill out the form below to add a new restaurant."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Restaurant name" {...field} />
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
                          placeholder="Restaurant description" 
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
                    name="cuisine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cuisine</FormLabel>
                        <FormControl>
                          <Input placeholder="Cuisine type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="openHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Hours</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 9:00 AM - 10:00 PM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Restaurant location" {...field} />
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
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Input 
                            placeholder="Image URL" 
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                          />
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={handleAddImage}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {form.watch("images")?.map((url, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="flex-1 truncate border p-2 rounded text-sm">
                                <div className="flex items-center gap-2">
                                  <Image className="h-4 w-4 shrink-0" />
                                  <span className="truncate">{url}</span>
                                </div>
                              </div>
                              <Button 
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">{editingRestaurant ? "Update" : "Create"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restaurants</CardTitle>
          <CardDescription>Manage your hotel's restaurants.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Cuisine</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurants?.length ? (
                restaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell className="font-medium">{restaurant.name}</TableCell>
                    <TableCell>{restaurant.cuisine}</TableCell>
                    <TableCell>{restaurant.location}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        restaurant.status === "open" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {restaurant.status === "open" ? "Open" : "Closed"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(restaurant)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link to={`/admin/restaurants/${restaurant.id}/menu`}>
                            Menu
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link to={`/admin/restaurants/${restaurant.id}/reservations`}>
                            Reservations
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                restaurant and all associated menus and reservations.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(restaurant.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
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
                  <TableCell colSpan={5} className="text-center py-4">
                    No restaurants found. Add your first restaurant to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantManager;
