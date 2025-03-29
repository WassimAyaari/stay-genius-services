
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UserInfo {
  name: string;
  roomNumber: string;
}

interface UserInfoDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  onSubmit: () => void;
}

const UserInfoDialog = ({ 
  isOpen, 
  onOpenChange, 
  userInfo, 
  setUserInfo, 
  onSubmit 
}: UserInfoDialogProps) => {
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!userInfo.name.trim() || !userInfo.roomNumber.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your name and room number.",
        variant: "destructive"
      });
      return;
    }
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Please provide your information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Your Name</label>
            <Input 
              id="name" 
              value={userInfo.name} 
              onChange={e => setUserInfo({
                ...userInfo,
                name: e.target.value
              })} 
              placeholder="Enter your name" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="roomNumber" className="text-sm font-medium">Room Number</label>
            <Input 
              id="roomNumber" 
              value={userInfo.roomNumber} 
              onChange={e => setUserInfo({
                ...userInfo,
                roomNumber: e.target.value
              })} 
              placeholder="Enter your room number" 
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoDialog;
