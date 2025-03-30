
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import GuestStatusBadge from './GuestStatusBadge';

interface UserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  room_number?: string;
}

const UserMenu = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('user_data');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    // Simple logout for now - just redirect to login page
    navigate('/auth/login');
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!userData) return 'G';
    return `${userData.first_name?.charAt(0) || ''}${userData.last_name?.charAt(0) || ''}`;
  };

  // Get user full name
  const getFullName = () => {
    if (!userData) return 'Guest';
    return `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span>{getFullName()}</span>
          <GuestStatusBadge />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/my-room">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>My Room</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/settings">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
