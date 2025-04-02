
import React from 'react';
import Layout from '@/components/Layout';

export const LoadingState: React.FC = () => {
  return (
    <Layout>
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des détails...</p>
        </div>
      </div>
    </Layout>
  );
};
