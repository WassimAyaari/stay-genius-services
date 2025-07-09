import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import RestaurantBookingForm from './RestaurantBookingForm';
import { Restaurant } from '../types';

interface RestaurantBookingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: Restaurant;
  onSuccess?: () => void;
}

const RestaurantBookingDialog = ({
  isOpen,
  onOpenChange,
  restaurant,
  onSuccess
}: RestaurantBookingDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-secondary">
            Book a Table at {restaurant.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Reserve your table for a wonderful dining experience. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">
              <strong>Restaurant:</strong> {restaurant.name}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Cuisine:</strong> {restaurant.cuisine}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Location:</strong> {restaurant.location}
            </p>
          </div>
          
          <RestaurantBookingForm
            restaurant={restaurant}
            onSuccess={() => {
              onOpenChange(false);
              if (onSuccess) onSuccess();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantBookingDialog;