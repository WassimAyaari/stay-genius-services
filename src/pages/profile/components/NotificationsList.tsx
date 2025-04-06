
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Notification {
  id: number;
  message: string;
  time: string;
}

interface NotificationsListProps {
  notifications: Notification[];
  dismissNotification: (id: number) => void;
}

const NotificationsList = ({
  notifications,
  dismissNotification
}: NotificationsListProps) => {
  const { toast } = useToast();

  const handleDismiss = (id: number) => {
    dismissNotification(id);
    toast({
      title: "Notification dismissed",
      description: "The notification has been removed from your list.",
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <Link to="/notifications" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">{notification.message}</div>
                    <div className="text-sm text-gray-500 mt-1">{notification.time}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDismiss(notification.id)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
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
