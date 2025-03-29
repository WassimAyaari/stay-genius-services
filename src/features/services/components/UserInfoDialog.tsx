
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';

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
  const [showProfileAlert, setShowProfileAlert] = React.useState(false);

  useEffect(() => {
    // If dialog is opened and user profile is not set, show alert
    if (isOpen && (!userInfo.name || !userInfo.roomNumber)) {
      const userData = localStorage.getItem('user_data');
      if (!userData) {
        setShowProfileAlert(true);
      }
    }
  }, [isOpen, userInfo]);

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
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Please provide your information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
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
              <Label htmlFor="roomNumber">Room Number</Label>
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

      <AlertDialog open={showProfileAlert} onOpenChange={setShowProfileAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Profile Information Missing</AlertDialogTitle>
            <AlertDialogDescription>
              We couldn't find your profile information. Please update your profile in user settings for a smoother experience next time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowProfileAlert(false)}>
              Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserInfoDialog;
