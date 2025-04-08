
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface NotFoundStateProps {
  onBack: () => void;
  errorMessage?: string;
}

export const NotFoundState: React.FC<NotFoundStateProps> = React.memo(({ 
  onBack, 
  errorMessage 
}) => {
  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="mb-4"
      >
        &larr; Back
      </Button>
      
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 flex flex-col items-center text-center p-8">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          
          <h2 className="text-xl font-semibold mb-2">Notification not found</h2>
          
          <p className="text-muted-foreground mb-6">
            {errorMessage || "We couldn't find the requested notification."}
          </p>
          
          <Button onClick={onBack}>
            Back to notifications
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});

NotFoundState.displayName = 'NotFoundState';
