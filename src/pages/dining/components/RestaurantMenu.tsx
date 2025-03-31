
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MenuItem } from '@/features/dining/types';

interface RestaurantMenuProps {
  menuItems: MenuItem[] | undefined;
  isLoading: boolean;
}

const RestaurantMenu = ({ menuItems, isLoading }: RestaurantMenuProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Chargement du menu...</div>;
  }
  
  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Menu non disponible</p>
      </div>
    );
  }
  
  // Get unique categories
  const categories = [...new Set(menuItems.map(item => item.category))];
  
  return (
    <div className="space-y-8">
      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">{category}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {menuItems.filter(item => item.category === category).map(item => (
              <Card key={item.id} className="overflow-hidden">
                {item.image && (
                  <div className="relative aspect-video">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.isFeatured && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Recommandé
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <span className="font-semibold">{item.price} €</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantMenu;
