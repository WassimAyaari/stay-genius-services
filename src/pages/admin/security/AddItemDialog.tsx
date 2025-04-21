
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { useCreateRequestItem } from '@/hooks/useRequestCategories';

type AddItemDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newItem: {
    name: string;
    description: string;
    category_id: string;
    is_active: boolean;
  };
  setNewItem: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    category_id: string;
    is_active: boolean;
  }>>;
  onAdd: () => Promise<void>;
};

const AddItemDialog = ({
  isOpen,
  onOpenChange,
  newItem,
  setNewItem,
  onAdd,
}: AddItemDialogProps) => {
  const createItem = useCreateRequestItem();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un item de sécurité</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Nom</label>
            <Input
              id="name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              placeholder="Caméra de surveillance"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Input
              id="description"
              value={newItem.description || ''}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              placeholder="Demander l'installation d'une caméra de surveillance"
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={onAdd} disabled={createItem.isPending}>
            {createItem.isPending ? 'Ajout en cours...' : 'Ajouter l\'item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
