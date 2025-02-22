import React from 'react';
import { User, Settings, LogOut, BedDouble, Bell, Heart, BookMarked } from 'lucide-react';
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

interface UserMenuProps {
  username?: string;
  roomNumber?: string;
}

const UserMenu = ({ username = "Emma Watson", roomNumber }: UserMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent relative">
          <Avatar className="h-9 w-9 border-2 border-primary/10">
            <AvatarImage src="/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png" alt={username} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {username[0]}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0">
        <SheetHeader className="p-6 bg-gradient-to-br from-primary-light to-white">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white/50">
              <AvatarImage src="/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png" alt={username} />
              <AvatarFallback className="bg-primary text-white text-xl">
                {username[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle>{username}</SheetTitle>
              <p className="text-sm text-gray-600">Premium Guest</p>
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

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full rounded-xl p-4 h-auto">
              <div className="text-center">
                <Bell className="h-5 w-5 mx-auto mb-1 text-primary" />
                <span className="text-sm font-medium">Notifications</span>
              </div>
            </Button>
            <Button variant="outline" className="w-full rounded-xl p-4 h-auto">
              <div className="text-center">
                <Heart className="h-5 w-5 mx-auto mb-1 text-primary" />
                <span className="text-sm font-medium">Favorites</span>
              </div>
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3 p-4">
              <User className="h-5 w-5 text-primary" />
              Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 p-4">
              <BookMarked className="h-5 w-5 text-primary" />
              My Bookings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 p-4">
              <Settings className="h-5 w-5 text-primary" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 p-4 text-red-600 hover:text-red-700 hover:bg-red-50">
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
