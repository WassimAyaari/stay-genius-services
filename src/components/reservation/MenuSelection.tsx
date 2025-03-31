
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface MenuSelectionProps {
  form: UseFormReturn<any>;
  menuCategories: Array<{
    category: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  }>;
  isLoadingMenuItems: boolean;
}

const MenuSelection = ({ form, menuCategories, isLoadingMenuItems }: MenuSelectionProps) => {
  return (
    <FormField
      control={form.control}
      name="menuId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Menu (optionnel)</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un menu" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-80">
              <SelectItem value="no-menu">Aucun menu pré-sélectionné</SelectItem>
              
              {isLoadingMenuItems ? (
                <div className="py-2 px-2 text-sm">Chargement des menus...</div>
              ) : (
                menuCategories.map(categoryGroup => (
                  <React.Fragment key={categoryGroup.category}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      {categoryGroup.category}
                    </div>
                    {categoryGroup.items.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - {item.price.toFixed(2)}€
                      </SelectItem>
                    ))}
                  </React.Fragment>
                ))
              )}
            </SelectContent>
          </Select>
          <FormDescription>
            Pré-sélectionnez un plat pour votre réservation (optionnel).
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MenuSelection;
