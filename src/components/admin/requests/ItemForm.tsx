
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader } from 'lucide-react';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { RequestCategory } from '@/features/rooms/types';

interface ItemFormProps {
  selectedCategory: RequestCategory | null;
  itemForm: {
    name: string;
    description: string;
  };
  setItemForm: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
  }>>;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

export const ItemForm = ({ 
  selectedCategory, 
  itemForm, 
  setItemForm, 
  onSubmit, 
  isLoading 
}: ItemFormProps) => {
  return (
    <>
      <div className="grid gap-4 py-4">
        <div>
          <p className="text-sm font-medium mb-2">Category</p>
          <p className="bg-muted p-2 rounded-md">
            {selectedCategory?.name}
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="itemName">Item Name</Label>
          <Input 
            id="itemName"
            value={itemForm.name}
            onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
            placeholder="e.g. Extra pillows, Clean bathroom"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="itemDescription">Description (Optional)</Label>
          <Textarea 
            id="itemDescription"
            value={itemForm.description}
            onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
            placeholder="Additional details about this request item"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button 
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Item'
          )}
        </Button>
      </DialogFooter>
    </>
  );
};
