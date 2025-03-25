
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/features/dining/types";
import { PenSquare, Trash2, BookCopy, Clipboard, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface RestaurantTableProps {
  restaurants: Restaurant[];
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
}

const RestaurantTable = ({ restaurants, onEdit, onDelete }: RestaurantTableProps) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Restaurant</TableHead>
            <TableHead>Cuisine</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {restaurants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Aucun restaurant trouvé
              </TableCell>
            </TableRow>
          ) : (
            restaurants.map((restaurant) => (
              <TableRow key={restaurant.id}>
                <TableCell>
                  <div className="font-medium">{restaurant.name}</div>
                  <div className="text-sm text-muted-foreground">{restaurant.location}</div>
                </TableCell>
                <TableCell>{restaurant.cuisine}</TableCell>
                <TableCell>
                  <Badge variant={restaurant.status === 'open' ? 'default' : 'secondary'}>
                    {restaurant.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(restaurant)}
                    title="Modifier"
                  >
                    <PenSquare className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onDelete(restaurant.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Link to={`/admin/restaurants/${restaurant.id}/menu`}>
                    <Button 
                      variant="outline" 
                      size="icon"
                      title="Gérer le menu"
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/admin/restaurants/${restaurant.id}/reservations`}>
                    <Button 
                      variant="outline" 
                      size="icon"
                      title="Gérer les réservations"
                    >
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RestaurantTable;
