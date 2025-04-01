
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  message: string;
  time: string;
}

interface NotificationsListProps {
  notifications: Notification[];
  dismissNotification: (id: number) => void;
}

const NotificationsList = ({ notifications, dismissNotification }: NotificationsListProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Bell className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Notifications récentes</h2>
          </div>
        </div>
        {notifications.length > 0 ? (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-sm text-muted-foreground">{notification.time}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => dismissNotification(notification.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Aucune notification
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsList;
