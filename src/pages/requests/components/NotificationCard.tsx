import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  FileText, 
  Ban,
  Sparkles,
  UtensilsCrossed,
  Calendar
} from 'lucide-react';
import { NotificationItem } from '@/types/notification';

interface NotificationCardProps {
  notification: NotificationItem;
  onCancel: (notification: NotificationItem) => void;
  canCancel: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  onCancel,
  canCancel
}) => {
  const navigate = useNavigate();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'spa_booking':
        return <Sparkles className="h-5 w-5" />;
      case 'reservation':
        return <UtensilsCrossed className="h-5 w-5" />;
      case 'event_reservation':
        return <Calendar className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'confirmed':
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return "Completed";
      case 'in_progress': return "In Progress";
      case 'cancelled': return "Cancelled";
      case 'confirmed': return "Confirmed";
      default: return "Pending";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return "bg-green-100 text-green-800";
      case 'in_progress': return "bg-blue-100 text-blue-800";
      case 'cancelled': return "bg-red-100 text-red-800";
      case 'confirmed': return "bg-blue-100 text-blue-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getDetailLink = () => {
    return notification.link || '/requests';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-full">
              {getTypeIcon(notification.type)}
            </div>
            <div>
              <CardTitle className="text-lg">{notification.title}</CardTitle>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Badge className={getStatusClass(notification.status)}>
            {getStatusText(notification.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {notification.description && (
          <div className="mb-4">
            <p className="text-gray-700">{notification.description}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getStatusIcon(notification.status)}
            <span className="text-sm font-medium">{getStatusText(notification.status)}</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(getDetailLink())}
            >
              View Details
            </Button>
            
            {canCancel && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onCancel(notification)}
              >
                <Ban className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
