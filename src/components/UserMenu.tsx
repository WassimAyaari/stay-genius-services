
import React from 'react';
import { User, Settings, LogOut, BedDouble } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserMenuProps {
  username?: string;
  roomNumber?: string;
}

const UserMenu = ({ username = "Guest", roomNumber }: UserMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
          <div className="flex items-center gap-2">
            <div className="text-right mr-2">
              <p className="text-sm font-medium text-secondary">{username}</p>
              <p className="text-xs text-gray-500">Guest</p>
            </div>
            <Avatar className="h-8 w-8 border-2 border-gray-100">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {username[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>User Profile</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {roomNumber && (
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BedDouble className="h-4 w-4 text-primary" />
              Room {roomNumber}
            </Button>
          )}
          <Button variant="ghost" className="w-full justify-start gap-2">
            <User className="h-4 w-4 text-primary" />
            Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4 text-primary" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-red-600">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserMenu;
