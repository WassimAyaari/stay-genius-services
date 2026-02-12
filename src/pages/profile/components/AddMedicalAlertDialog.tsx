
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddMedicalAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (alert: { alert_type: string; severity: string; description: string }) => void;
}

const AddMedicalAlertDialog: React.FC<AddMedicalAlertDialogProps> = ({ open, onOpenChange, onAdd }) => {
  const [alertType, setAlertType] = useState('Allergy');
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!description.trim()) return;
    onAdd({ alert_type: alertType, severity, description: description.trim() });
    setDescription('');
    setAlertType('Allergy');
    setSeverity('Medium');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Medical Alert</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Alert type</label>
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Medical alert">Medical alert</SelectItem>
                <SelectItem value="Allergy">Allergy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Severity level</label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe your condition or allergy..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!description.trim()}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicalAlertDialog;
