
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader } from 'lucide-react';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

interface CategoryFormProps {
  categoryForm: {
    name: string;
    description: string;
    icon: string;
  };
  setCategoryForm: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    icon: string;
  }>>;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

export const CategoryForm = ({ 
  categoryForm, 
  setCategoryForm, 
  onSubmit, 
  isLoading 
}: CategoryFormProps) => {
  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Category Name</Label>
          <Input 
            id="name"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
            placeholder="e.g. Housekeeping, Maintenance"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="icon">Icon (Emoji)</Label>
          <Input 
            id="icon"
            value={categoryForm.icon}
            onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
            placeholder="e.g. 🧹, 🛠️"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            value={categoryForm.description}
            onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
            placeholder="Brief description of this category"
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
            'Save Category'
          )}
        </Button>
      </DialogFooter>
    </>
  );
};
