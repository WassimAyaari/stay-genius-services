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
  const {
    toast
  } = useToast();
  const handleDismiss = (id: string | number) => {
    dismissNotification(id);
    toast({
      title: "Notification dismissed",
      description: "The notification has been removed from your list."
    });
  };
  if (notifications.length === 0) {
    return <div className="mt-8">
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
      </div>;
  }
  return;
};
export default NotificationsList;