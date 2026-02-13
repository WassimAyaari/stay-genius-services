import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Clock, MapPin, User, FileText, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import AssignToDropdown from '@/components/admin/AssignToDropdown';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const serviceTypeLabels: Record<string, string> = {
  housekeeping: 'Housekeeping',
  maintenance: 'Maintenance',
  security: 'Security',
  it_support: 'IT Support',
  'information-technology': 'IT Support',
};

const serviceTypeRoutes: Record<string, string> = {
  housekeeping: '/admin/housekeeping',
  maintenance: '/admin/maintenance',
  security: '/admin/security',
  it_support: '/admin/information-technology',
  'information-technology': '/admin/information-technology',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  on_hold: 'bg-orange-100 text-orange-800 border-orange-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const ServiceRequestDetailPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: request, isLoading, error } = useQuery({
    queryKey: ['admin-service-request', requestId],
    queryFn: async () => {
      if (!requestId) return null;
      const { data, error } = await supabase
        .from('service_requests')
        .select('*, request_items(name, description)')
        .eq('id', requestId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!requestId,
  });

  const handleStatusUpdate = async (newStatus: string) => {
    if (!requestId) return;
    const { error } = await supabase
      .from('service_requests')
      .update({ status: newStatus } as any)
      .eq('id', requestId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
      return;
    }
    toast({ title: 'Updated', description: `Status changed to ${newStatus.replace('_', ' ')}` });
    queryClient.invalidateQueries({ queryKey: ['admin-service-request', requestId] });
  };

  const serviceType = request?.type || '';
  const serviceLabel = serviceTypeLabels[serviceType] || serviceType;
  const serviceRoute = serviceTypeRoutes[serviceType] || '/admin';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading request...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <p className="text-muted-foreground">Request not found.</p>
      </div>
    );
  }

  const currentStatus = request.status || 'pending';

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={serviceRoute}>{serviceLabel}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Request Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Service Request</h1>
        <Badge className={statusColors[currentStatus] || ''}>
          {currentStatus.replace('_', ' ')}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5 text-muted-foreground" />
            {(request as any).request_items?.name || request.description || 'Service Request'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Room:</span>
              <span className="font-medium text-foreground">{request.room_number || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Guest:</span>
              <span className="font-medium text-foreground">{request.guest_name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium text-foreground">{serviceLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium text-foreground">
                {request.created_at ? format(new Date(request.created_at), 'PPp') : 'N/A'}
              </span>
            </div>
          </div>

          {request.description && (
            <div className="pt-2 border-t">
              <div className="flex items-start gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-muted-foreground">Description:</span>
                  <p className="text-foreground mt-1">{request.description}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Assigned to:</span>
            <AssignToDropdown
              requestId={request.id}
              serviceType={serviceType}
              assignedToName={request.assigned_to_name}
              onAssigned={() => queryClient.invalidateQueries({ queryKey: ['admin-service-request', requestId] })}
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {currentStatus !== 'on_hold' && (
              <Button variant="outline" size="sm" onClick={() => handleStatusUpdate('on_hold')}>
                Hold
              </Button>
            )}
            {currentStatus !== 'in_progress' && (
              <Button variant="outline" size="sm" onClick={() => handleStatusUpdate('in_progress')}>
                Start
              </Button>
            )}
            {currentStatus !== 'completed' && (
              <Button size="sm" onClick={() => handleStatusUpdate('completed')}>
                Complete
              </Button>
            )}
            {currentStatus !== 'cancelled' && (
              <Button variant="destructive" size="sm" onClick={() => handleStatusUpdate('cancelled')}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceRequestDetailPage;
