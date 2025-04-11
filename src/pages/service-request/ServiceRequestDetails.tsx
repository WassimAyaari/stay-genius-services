
import React from 'react';
import Layout from '@/components/Layout';
import { useParams } from 'react-router-dom';

const ServiceRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Service Request Details</h1>
        <p className="mb-4">
          Details for service request ID: {id}
        </p>
      </div>
    </Layout>
  );
};

export default ServiceRequestDetails;
