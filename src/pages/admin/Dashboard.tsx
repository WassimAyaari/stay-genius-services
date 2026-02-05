import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarCheck,
  MessageCircle,
  Users,
  PartyPopper,
  ClipboardList,
  CheckCircle2,
  Star,
  Bot,
  Utensils,
  Sparkles,
  Calendar,
  TrendingUp,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useAdminDashboardStats } from '@/hooks/useAdminDashboardStats';
import StatisticCard from '@/components/admin/StatisticCard';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useAdminDashboardStats();

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center text-destructive">
          <p>Erreur lors du chargement des statistiques</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Real-time statistics and insights for your hotel</p>
      </div>

      {/* Stats Row 1 - Main metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Total Reservations"
          value={stats?.totalReservations ?? 0}
          icon={CalendarCheck}
          trend={stats?.todayActivity.newReservations}
          suffix=""
          color="primary"
          loading={isLoading}
        />
        <StatisticCard
          title="Messages"
          value={stats?.messagesCount ?? 0}
          icon={MessageCircle}
          trend={stats?.todayActivity.newMessages}
          suffix=""
          color="info"
          loading={isLoading}
        />
        <StatisticCard
          title="Current Guests"
          value={stats?.currentGuests ?? 0}
          icon={Users}
          suffix=""
          color="success"
          loading={isLoading}
        />
        <StatisticCard
          title="Active Events"
          value={stats?.activeEvents ?? 0}
          icon={PartyPopper}
          suffix=""
          color="warning"
          loading={isLoading}
        />
      </div>

      {/* Stats Row 2 - Secondary metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Service Requests"
          value={stats?.serviceRequests.total ?? 0}
          icon={ClipboardList}
          subtitle={`${stats?.serviceRequests.pending ?? 0} pending`}
          color="warning"
          loading={isLoading}
        />
        <StatisticCard
          title="Completed Services"
          value={stats?.serviceRequests.completed ?? 0}
          icon={CheckCircle2}
          suffix=""
          color="success"
          loading={isLoading}
        />
        <StatisticCard
          title="Guest Satisfaction"
          value={stats?.guestSatisfaction ?? 0}
          icon={Star}
          suffix="/5"
          color="warning"
          loading={isLoading}
        />
        <StatisticCard
          title="AI Conversations"
          value={stats?.conversationsCount ?? 0}
          icon={Bot}
          subtitle={`${stats?.todayActivity.unansweredMessages ?? 0} unanswered`}
          color="info"
          loading={isLoading}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Reservations Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-primary" />
              Reservations Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Table Reservations</span>
                  </div>
                  <span className="font-medium">{stats?.tableReservations ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Spa Bookings</span>
                  </div>
                  <span className="font-medium">{stats?.spaBookings ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Event Reservations</span>
                  </div>
                  <span className="font-medium">{stats?.eventReservations ?? 0}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Today's Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Today's Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">New Reservations</span>
                  </div>
                  <span className="font-medium text-green-600">+{stats?.todayActivity.newReservations ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">New Messages</span>
                  </div>
                  <span className="font-medium text-blue-600">+{stats?.todayActivity.newMessages ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Unanswered</span>
                  </div>
                  <span className="font-medium text-orange-600">{stats?.todayActivity.unansweredMessages ?? 0}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Service Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Service Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Pending</span>
                  </div>
                  <span className="font-medium text-orange-600">{stats?.serviceRequests.pending ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Completed</span>
                  </div>
                  <span className="font-medium text-green-600">{stats?.serviceRequests.completed ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Avg. Rating</span>
                  </div>
                  <span className="font-medium">{stats?.guestSatisfaction ?? 0}/5</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Footer */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">System Status:</span>
              <span className="font-medium text-green-600">Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">AI Assistant:</span>
              <span className="font-medium text-blue-600">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="font-medium">Just now</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
