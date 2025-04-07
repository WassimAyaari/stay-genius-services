
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Notification {
  id: string | number; // Updated to accept either string or number
  message: string;
  time: string;
}

interface NotificationsListProps {
  notifications: Notification[];
  dismissNotification: (id: string | number) => void; // Updated to accept either string or number
}

const NotificationsList = ({
  notifications,
  dismissNotification
}: NotificationsListProps) => {
  const { toast } = useToast();
  
  const handleDismiss = (id: string | number) => {
    dismissNotification(id);
    toast({
      title: "Notification dismissed",
      description: "The notification has been removed from your list."
    });
  };

  if (notifications.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">No notifications</h3>
            <p className="text-gray-500 text-sm">
              You don't have any notifications at the moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <Link to="/notifications">
          <Button variant="link" className="text-primary">View all</Button>
        </Link>
      </div>
      
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card key={notification.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full" 
                  onClick={() => handleDismiss(notification.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NotificationsList;
