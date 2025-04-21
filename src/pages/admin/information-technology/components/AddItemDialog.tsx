
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AddItemDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newItem: {
    name: string;
    description: string;
    category_id: string;
    is_active: boolean;
  };
  setNewItem: (i: any) => void;
  onAdd: () => void;
};

const AddItemDialog = ({ isOpen, onOpenChange, newItem, setNewItem, onAdd }: AddItemDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add IT Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="Item Name"
            value={newItem.name}
            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
          />
          <Input
            label="Description"
            placeholder="Description"
            value={newItem.description}
            onChange={e => setNewItem({ ...newItem, description: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button onClick={onAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
