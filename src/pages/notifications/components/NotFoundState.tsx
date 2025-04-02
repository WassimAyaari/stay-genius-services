
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileX2 } from 'lucide-react';

interface NotFoundStateProps {
  onBack: () => void;
}

export const NotFoundState: React.FC<NotFoundStateProps> = ({ onBack }) => {
  return (
    <Layout>
      <div className="container py-8 max-w-md">
        <Card>
          <CardContent className="pt-6 text-center">
            <FileX2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Notification introuvable</h2>
            <p className="text-muted-foreground mb-6">
              Impossible de trouver les détails de cette notification.
            </p>
            <Button onClick={onBack}>
              Retour aux notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
