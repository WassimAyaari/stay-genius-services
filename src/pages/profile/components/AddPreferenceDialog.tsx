
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const suggestions: Record<string, string[]> = {
  room: ['High floor', 'Sea view', 'Quiet room', 'Non-smoking', 'King size bed'],
  dining: ['Vegetarian', 'Vegan', 'Halal', 'Gluten-free', 'No seafood'],
  service: ['Early check-in', 'Late check-out', 'Extra towels', 'Hypoallergenic pillows'],
};

interface AddPreferenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (category: string, value: string) => void;
}

const AddPreferenceDialog: React.FC<AddPreferenceDialogProps> = ({ open, onOpenChange, onAdd }) => {
  const [category, setCategory] = useState('room');
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (!value.trim()) return;
    onAdd(category, value.trim());
    setValue('');
    setCategory('room');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Preference</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Preference type</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="room">Room preference</SelectItem>
                <SelectItem value="dining">Dining preference</SelectItem>
                <SelectItem value="service">Service preference</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Preference</label>
            <Input
              placeholder="E.g.: Sea view, Vegetarian..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Quick suggestions</label>
            <div className="flex flex-wrap gap-2">
              {(suggestions[category] || []).map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setValue(s)}
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!value.trim()}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPreferenceDialog;
