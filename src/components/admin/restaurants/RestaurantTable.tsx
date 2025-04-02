
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, UtensilsCrossed, Utensils, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RestaurantTableProps {
  restaurants: any[];
  onEdit: (restaurant: any) => void;
  onDelete: (id: string) => void;
  onViewMenus: (id: string) => void;
  onViewReservations: (id: string) => void;
}

export const RestaurantTable: React.FC<RestaurantTableProps> = ({
  restaurants,
  onEdit,
  onDelete,
  onViewMenus,
  onViewReservations
}) => {
  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No restaurants found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Cuisine</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {restaurants.map((restaurant) => (
            <TableRow key={restaurant.id}>
              <TableCell className="font-medium">{restaurant.name}</TableCell>
              <TableCell>{restaurant.cuisine}</TableCell>
              <TableCell>{restaurant.location}</TableCell>
              <TableCell>
                <Badge
                  variant={restaurant.status === 'open' ? 'success' : 'destructive'}
                >
                  {restaurant.status === 'open' ? (
                    <Utensils className="h-3 w-3 mr-1" />
                  ) : (
                    <UtensilsCrossed className="h-3 w-3 mr-1" />
                  )}
                  {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {restaurant.is_featured ? (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                    Featured
                  </Badge>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewReservations(restaurant.id)}
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span className="sr-only">Reservations</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewMenus(restaurant.id)}
                  >
                    <Utensils className="h-4 w-4" />
                    <span className="sr-only">Menus</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(restaurant)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(restaurant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
