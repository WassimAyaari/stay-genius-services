
import React, { useEffect } from 'react';
import { Restaurant } from '@/features/dining/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { restaurantFormSchema, RestaurantFormValues } from './form/RestaurantFormSchema';
import RestaurantBasicInfo from './form/RestaurantBasicInfo';
import RestaurantDetails from './form/RestaurantDetails';
import ImageUploader from './form/ImageUploader';

interface RestaurantFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingRestaurant: Restaurant | null;
  onSubmit: (values: RestaurantFormValues) => void;
}

const RestaurantFormDialog = ({ 
  isOpen, 
  onOpenChange, 
  editingRestaurant, 
  onSubmit 
}: RestaurantFormDialogProps) => {
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      name: "",
      description: "",
      cuisine: "",
      openHours: "",
      location: "",
      status: "open",
      images: [],
    },
  });
  
  // Update form values when editing restaurant changes or dialog opens
  useEffect(() => {
    if (isOpen && editingRestaurant) {
      form.reset({
        name: editingRestaurant.name,
        description: editingRestaurant.description,
        cuisine: editingRestaurant.cuisine,
        openHours: editingRestaurant.openHours,
        location: editingRestaurant.location,
        status: editingRestaurant.status,
        images: editingRestaurant.images,
      });
    } else if (isOpen && !editingRestaurant) {
      // Reset form when opening for a new restaurant
      form.reset({
        name: "",
        description: "",
        cuisine: "",
        openHours: "",
        location: "",
        status: "open",
        images: [],
      });
    }
  }, [isOpen, editingRestaurant, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{editingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}</DialogTitle>
          <DialogDescription>
            {editingRestaurant 
              ? "Update the restaurant details below." 
              : "Fill out the form below to add a new restaurant."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <RestaurantBasicInfo form={form} />
              <RestaurantDetails form={form} />
              <ImageUploader form={form} />
              <DialogFooter className="pt-4">
                <Button type="submit">{editingRestaurant ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantFormDialog;
