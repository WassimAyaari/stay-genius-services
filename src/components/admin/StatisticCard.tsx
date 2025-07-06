import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatisticCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  suffix?: string;
  color?: 'primary' | 'success' | 'warning' | 'info';
  loading?: boolean;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  suffix = '',
  color = 'primary',
  loading = false,
}) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    success: 'text-green-600 bg-green-100',
    warning: 'text-orange-600 bg-orange-100',
    info: 'text-blue-600 bg-blue-100',
  };

  const getTrendIcon = () => {
    if (!trend || trend === 0) return <Minus className="h-3 w-3" />;
    return trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (!trend || trend === 0) return 'text-muted-foreground';
    return trend > 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <Card className="glass-card hover-scale">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
          <div className="h-3 w-12 bg-muted animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card hover-scale border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-1">
          <h3 className="text-2xl font-bold text-card-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center mt-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-xs ml-1">
              {trend === 0 ? 'No change' : `${Math.abs(trend)} ${trend > 0 ? 'increase' : 'decrease'}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticCard;