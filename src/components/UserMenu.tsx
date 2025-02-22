
import React, { useState } from 'react';
import { User, Settings, LogOut, BedDouble, Bell, Heart, BookMarked, Pencil, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface UserMenuProps {
  username?: string;
  roomNumber?: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const UserMenu = ({ username = "Emma Watson", roomNumber }: UserMenuProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(username);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Room Service',
      description: 'Your room has been cleaned',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'Dinner Reservation',
      description: 'Your table is ready at the restaurant',
      time: '5 mins ago',
      read: false
    }
  ]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleNameUpdate = () => {
    // Here you would typically update the name in your backend
    toast({
      title: "Success",
      description: "Name updated successfully",
    });
    setIsEditing(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent relative">
          <Avatar className="h-9 w-9 border-2 border-primary/10">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {username[0]}
            </AvatarFallback>
          </Avatar>
          {notifications.some(n => !n.read) && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 overflow-y-auto">
        <SheetHeader className="p-6 bg-gradient-to-br from-primary-light to-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-4 border-white/50">
                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src={avatarUrl} alt={username} />
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {username[0]}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Pencil className="h-3 w-3 text-white" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="h-8"
                    />
                    <Button size="sm" onClick={handleNameUpdate}>Save</Button>
                  </div>
                </div>
              ) : (
                <>
                  <SheetTitle className="flex items-center gap-2">
                    {username}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </SheetTitle>
                  <p className="text-sm text-gray-600">Premium Guest</p>
                </>
              )}
            </div>
          </div>
        </SheetHeader>
        
        <div className="p-4 space-y-6">
          {roomNumber && (
            <div className="bg-primary/5 p-4 rounded-xl">
              <div className="flex items-center gap-3 text-primary mb-2">
                <BedDouble className="h-5 w-5" />
                <span className="font-medium">Current Stay</span>
              </div>
              <p className="text-sm text-gray-600">Room {roomNumber}</p>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-600">Recent Notifications</h4>
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className="bg-gray-50 rounded-lg p-3 space-y-1 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-sm">{notification.title}</h5>
                  {!notification.read && (
                    <span className="h-2 w-2 bg-primary rounded-full" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{notification.description}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full rounded-xl p-4 h-auto" onClick={() => handleNavigate('/notifications')}>
              <div className="text-center">
                <Bell className="h-5 w-5 mx-auto mb-1 text-primary" />
                <span className="text-sm font-medium">Notifications</span>
              </div>
            </Button>
            <Button variant="outline" className="w-full rounded-xl p-4 h-auto" onClick={() => handleNavigate('/favorites')}>
              <div className="text-center">
                <Heart className="h-5 w-5 mx-auto mb-1 text-primary" />
                <span className="text-sm font-medium">Favorites</span>
              </div>
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3 p-4" onClick={() => handleNavigate('/profile')}>
              <User className="h-5 w-5 text-primary" />
              Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 p-4" onClick={() => handleNavigate('/bookings')}>
              <BookMarked className="h-5 w-5 text-primary" />
              My Bookings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 p-4" onClick={() => handleNavigate('/settings')}>
              <Settings className="h-5 w-5 text-primary" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 p-4 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/login');
              }}
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserMenu;
