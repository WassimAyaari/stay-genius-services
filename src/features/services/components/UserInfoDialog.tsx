
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

interface UserInfo {
  name: string;
  roomNumber: string;
}

interface UserInfoDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
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
  const { userData } = useAuth();

  useEffect(() => {
    // If dialog is opened, automatically fetch user data
    if (isOpen) {
      // Try to get user profile data from auth context first
      if (userData) {
        const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
        const roomNumber = userData.room_number || '';
        
        if (fullName || roomNumber) {
          setUserInfo({
            ...userInfo,
            name: fullName || userInfo.name,
            roomNumber: roomNumber || userInfo.roomNumber
          });
        }
      }
      
      // If user info is still incomplete, try localStorage
      if (!userInfo.name || !userInfo.roomNumber) {
        const storedUserData = localStorage.getItem('user_data');
        const storedRoomNumber = localStorage.getItem('user_room_number');
        
        if (storedUserData) {
          try {
            const parsedData = JSON.parse(storedUserData);
            const fullName = `${parsedData.first_name || ''} ${parsedData.last_name || ''}`.trim();
            
            if (fullName) {
              setUserInfo((prev) => ({
                ...prev,
                name: fullName
              }));
            }
            
            if (parsedData.room_number) {
              setUserInfo((prev) => ({
                ...prev,
                roomNumber: parsedData.room_number
              }));
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }
        
        // If room number is available in localStorage directly
        if (storedRoomNumber && !userInfo.roomNumber) {
          setUserInfo((prev) => ({
            ...prev,
            roomNumber: storedRoomNumber
          }));
        }
        
        // If still no user info, show alert
        if (!userInfo.name || !userInfo.roomNumber) {
          setShowProfileAlert(true);
        }
      }
    }
  }, [isOpen, userData, userInfo, setUserInfo]);

  const handleSubmit = () => {
    if (!userInfo.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your name.",
        variant: "destructive"
      });
      return;
    }

    if (!userInfo.roomNumber.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your room number.",
        variant: "destructive"
      });
      return;
    }

    // Store the information for future use
    try {
      localStorage.setItem('user_room_number', userInfo.roomNumber);
      
      // Store in user_data format for compatibility with the rest of the app
      const userData = {
        first_name: userInfo.name.split(' ')[0] || '',
        last_name: userInfo.name.split(' ').slice(1).join(' ') || '',
        room_number: userInfo.roomNumber
      };
      localStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error("Error storing user data:", error);
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
              We couldn't find your profile information. Please provide your name and room number to continue. This information will be saved for future requests.
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
