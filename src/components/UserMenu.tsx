
import React from 'react';
import { User, Settings, LogOut, BedDouble } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserMenuProps {
  username?: string;
  roomNumber?: string;
}

const UserMenu = ({ username = "Guest", roomNumber }: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        {roomNumber && (
          <DropdownMenuItem className="py-2 cursor-pointer">
            <BedDouble className="mr-2 h-4 w-4 text-primary" />
            <span>Room {roomNumber}</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="py-2 cursor-pointer">
          <User className="mr-2 h-4 w-4 text-primary" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 cursor-pointer">
          <Settings className="mr-2 h-4 w-4 text-primary" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem className="py-2 cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
