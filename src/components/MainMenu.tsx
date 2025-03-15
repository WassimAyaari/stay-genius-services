
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Menu, BedDouble, UtensilsCrossed, Heart, Compass, Phone, Gift, Info, Home, Bell } from 'lucide-react';

const MainMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Home', path: '/' },
    { icon: <BedDouble className="h-5 w-5" />, label: 'My Room', path: '/my-room' },
    { icon: <UtensilsCrossed className="h-5 w-5" />, label: 'Dining', path: '/dining' },
    { icon: <Heart className="h-5 w-5" />, label: 'Spa & Wellness', path: '/spa' },
    { icon: <Compass className="h-5 w-5" />, label: 'Activities', path: '/activities' },
    { icon: <Gift className="h-5 w-5" />, label: 'Hotel Services', path: '/services' },
    { icon: <Phone className="h-5 w-5" />, label: 'Contact', path: '/contact' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Menu className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="p-6 bg-gradient-to-br from-primary-light to-white">
          <SheetTitle className="text-2xl">Menu</SheetTitle>
        </SheetHeader>
        <div className="grid gap-2 p-4">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-start gap-3 p-4 rounded-xl hover:bg-primary/10 transition-colors"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MainMenu;
