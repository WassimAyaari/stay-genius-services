import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatisticCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  subtitleColor?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  suffix?: string;
  iconColor?: 'amber' | 'emerald' | 'pink' | 'yellow' | 'blue' | 'purple' | 'green';
  loading?: boolean;
}

const iconColorClasses = {
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
};

const subtitleColorClasses = {
  default: 'text-muted-foreground',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-orange-600 dark:text-orange-400',
  danger: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
};

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  subtitleColor = 'default',
  suffix = '',
  iconColor = 'amber',
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="h-full bg-card border shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-card border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-bold text-card-foreground">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </h3>
              {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
            </div>
            {subtitle && (
              <p className={cn('text-xs', subtitleColorClasses[subtitleColor])}>
                {subtitle}
              </p>
            )}
          </div>
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', iconColorClasses[iconColor])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;
