
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
  onClose: (success?: boolean) => void;
  restaurant: Restaurant | null;
}

const RestaurantFormDialog = ({ 
  isOpen, 
  onOpenChange, 
  onClose, 
  restaurant 
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
      actionText: "Book a Table",
      images: [],
    },
  });
  
  // Update form values when editing restaurant changes or dialog opens
  useEffect(() => {
    if (isOpen && restaurant) {
      form.reset({
        name: restaurant.name,
        description: restaurant.description,
        cuisine: restaurant.cuisine,
        openHours: restaurant.openHours,
        location: restaurant.location,
        status: restaurant.status,
        actionText: restaurant.actionText || "Book a Table",
        images: restaurant.images,
      });
    } else if (isOpen && !restaurant) {
      // Reset form when opening for a new restaurant
      form.reset({
        name: "",
        description: "",
        cuisine: "",
        openHours: "",
        location: "",
        status: "open",
        actionText: "Book a Table",
        images: [],
      });
    }
  }, [isOpen, restaurant, form]);

  const onSubmit = async (values: RestaurantFormValues) => {
    try {
      // Handle submission logic here (you'll need to implement this)
      onClose(true);
    } catch (error) {
      console.error('Error submitting restaurant form:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{restaurant ? "Edit Restaurant" : "Add New Restaurant"}</DialogTitle>
          <DialogDescription>
            {restaurant 
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
                <Button type="submit">{restaurant ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantFormDialog;
