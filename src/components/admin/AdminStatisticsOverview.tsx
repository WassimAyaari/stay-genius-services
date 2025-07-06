import React from 'react';
import { 
  Users, 
  MessageCircle, 
  AlertCircle, 
  Calendar,
  Monitor,
  Clock,
  Activity,
  Star
} from 'lucide-react';
import StatisticCard from './StatisticCard';
import { useAdminStatistics } from '@/hooks/useAdminStatistics';

const AdminStatisticsOverview: React.FC = () => {
  const { statistics, loading } = useAdminStatistics();

  const mainMetrics = [
    {
      title: 'Users Connected',
      value: statistics.usersConnected,
      icon: Users,
      trend: statistics.trending.messages,
      color: 'primary' as const,
    },
    {
      title: 'Total Messages',
      value: statistics.totalMessages,
      icon: MessageCircle,
      trend: statistics.trending.messages,
      color: 'info' as const,
    },
    {
      title: 'Active Requests',
      value: statistics.activeRequests,
      icon: AlertCircle,
      trend: statistics.trending.requests,
      color: 'warning' as const,
    },
    {
      title: 'Total Reservations',
      value: statistics.totalReservations,
      icon: Calendar,
      trend: statistics.trending.reservations,
      color: 'success' as const,
    },
  ];

  const secondaryMetrics = [
    {
      title: 'Demo Sessions',
      value: statistics.demoSessions,
      icon: Monitor,
      color: 'info' as const,
    },
    {
      title: 'Avg Resolution Time',
      value: statistics.avgResolutionTime,
      icon: Clock,
      suffix: 'hrs',
      color: 'primary' as const,
    },
    {
      title: 'Today\'s Activity',
      value: statistics.todayActivity,
      icon: Activity,
      color: 'success' as const,
    },
    {
      title: 'Customer Satisfaction',
      value: statistics.customerSatisfaction,
      icon: Star,
      suffix: '/5',
      color: 'warning' as const,
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground mb-2">Statistics Overview</h2>
            <p className="text-muted-foreground">Real-time insights into your hotel operations</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Completion Rate</div>
            <div className="text-3xl font-bold text-primary">{statistics.completionRate}%</div>
          </div>
        </div>
      </div>

      {/* Main Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mainMetrics.map((metric, index) => (
          <StatisticCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            color={metric.color}
            loading={loading}
          />
        ))}
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {secondaryMetrics.map((metric, index) => (
          <StatisticCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            suffix={metric.suffix}
            color={metric.color}
            loading={loading}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-secondary/50 to-accent/30 rounded-lg p-4 border border-border/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">Live data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatisticsOverview;