
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
import { Menu, BedDouble, UtensilsCrossed, Spa, Compass, Phone, Gift, Info } from 'lucide-react';

const MainMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <BedDouble className="h-5 w-5" />, label: 'Rooms & Suites', path: '/rooms' },
    { icon: <UtensilsCrossed className="h-5 w-5" />, label: 'Dining', path: '/dining' },
    { icon: <Spa className="h-5 w-5" />, label: 'Spa & Wellness', path: '/spa' },
    { icon: <Compass className="h-5 w-5" />, label: 'Activities', path: '/activities' },
    { icon: <Gift className="h-5 w-5" />, label: 'Hotel Boutiques', path: '/boutiques' },
    { icon: <Phone className="h-5 w-5" />, label: 'Contact', path: '/contact' },
    { icon: <Info className="h-5 w-5" />, label: 'About', path: '/about' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MainMenu;
