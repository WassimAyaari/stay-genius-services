import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart as PieChartIcon } from 'lucide-react';

interface StatusChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  loading?: boolean;
}

const StatusChart: React.FC<StatusChartProps> = ({ data, loading }) => {
  const hasData = data && data.length > 0 && data.some(item => item.value > 0);

  if (loading) {
    return (
      <Card className="h-full bg-card border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <PieChartIcon className="h-4 w-4 text-primary" />
            Request Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] sm:h-[250px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-card border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
          <PieChartIcon className="h-4 w-4 text-primary" />
          Request Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px] sm:h-[250px]">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    fontSize: '12px',
                  }}
                  formatter={(value) => (
                    <span className="text-card-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <PieChartIcon className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No service requests</p>
              <p className="text-xs text-muted-foreground/70">Data will appear when requests are created</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusChart;
