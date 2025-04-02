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
const NotificationsList = ({
  notifications,
  dismissNotification
}: NotificationsListProps) => {
  return;
};
export default NotificationsList;