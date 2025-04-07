
import React, { useCallback } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import NotificationList from './notifications/NotificationList';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationMenu = () => {
  const { 
    notifications, 
    unreadCount, 
    isAuthenticated,
    hasNewNotifications, 
    setHasNewNotifications,
    refetchServices,
    refetchReservations,
    refetchSpaBookings,
    refetchEventReservations
  } = useNotifications();

  // Reset the "new notifications" indicator when the menu is opened
  // and refresh notifications data to ensure we have the latest data
  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      setHasNewNotifications(false);
      
      // Refresh all notifications data when menu opens
      Promise.all([
        refetchServices(),
        refetchReservations(),
        refetchSpaBookings(),
        refetchEventReservations()
      ]).catch(err => {
        console.error('Failed to refresh notifications:', err);
      });
    }
  }, [setHasNewNotifications, refetchServices, refetchReservations, refetchSpaBookings, refetchEventReservations]);

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Bell className={`h-5 w-5 ${hasNewNotifications ? 'text-primary' : 'text-gray-600'}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-primary rounded-full text-[10px] text-white flex items-center justify-center font-medium border border-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-zinc-100">
        <DropdownMenuLabel>Notifications ({notifications.length})</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-80 overflow-y-auto">
          <NotificationList 
            notifications={notifications.slice(0, 5)} 
            isAuthenticated={isAuthenticated} 
          />
        </div>
        
        <DropdownMenuSeparator />
        <Link to="/notifications">
          <DropdownMenuItem className="text-center cursor-pointer hover:bg-gray-200/70">
            <span className="w-full text-center text-primary font-medium">
              Voir toutes les notifications
            </span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
