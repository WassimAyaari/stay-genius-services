import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityChartProps {
  data: Array<{
    day: string;
    messages: number;
    requests: number;
    reservations: number;
  }>;
  loading?: boolean;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Weekly Activity Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">Weekly Activity Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="messages" 
                stroke="#00AFB9" 
                strokeWidth={2}
                name="Messages"
                dot={{ fill: '#00AFB9' }}
              />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="#FF6B6B" 
                strokeWidth={2}
                name="Requests"
                dot={{ fill: '#FF6B6B' }}
              />
              <Line 
                type="monotone" 
                dataKey="reservations" 
                stroke="#4ECDC4" 
                strokeWidth={2}
                name="Reservations"
                dot={{ fill: '#4ECDC4' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;