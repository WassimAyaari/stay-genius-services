
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, BedDouble, UtensilsCrossed, Heart, Compass, Phone, ShoppingBag, Map, Home, Info, Calendar, BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainMenuProps {
  buttonClassName?: string;
}

const MainMenu = ({ buttonClassName }: MainMenuProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ajout d'informations de débogage pour voir le chemin actuel
  console.log('Current path in MainMenu:', location.pathname);

  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Home', path: '/' },
    { icon: <BellRing className="h-5 w-5" />, label: 'Notifications', path: '/notifications' },
    { icon: <Info className="h-5 w-5" />, label: 'About Us', path: '/about' },
    { icon: <UtensilsCrossed className="h-5 w-5" />, label: 'Gastronomy', path: '/dining' },
    { icon: <Heart className="h-5 w-5" />, label: 'Spa & Wellness', path: '/spa' },
    { icon: <Phone className="h-5 w-5" />, label: 'Concierge', path: '/services' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Events & Promos', path: '/events' },
    { icon: <Compass className="h-5 w-5" />, label: 'Destination', path: '/destination' },
    { icon: <ShoppingBag className="h-5 w-5" />, label: 'Shops', path: '/shops' },
    { icon: <Map className="h-5 w-5" />, label: 'Hotel Map', path: '/map' },
    { icon: <BedDouble className="h-5 w-5" />, label: 'My Room', path: '/my-room' },
  ];

  const handleNavigate = (path: string) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("relative p-2.5 rounded-full", buttonClassName)}
        >
          <Menu className="h-5 w-5 text-secondary" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-full sm:max-w-full">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 bg-gradient-to-br from-primary-light to-white">
            <SheetTitle className="text-2xl text-secondary">Menu</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
            <div className="grid gap-2 p-4">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start gap-3 p-4 rounded-xl hover:bg-primary/10 transition-colors"
                  onClick={() => handleNavigate(item.path)}
                >
                  <span className="text-secondary">{item.icon}</span>
                  <span className="font-medium text-secondary">{item.label}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MainMenu;
