
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { NotificationDetailContent } from './components/NotificationDetailContent';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationDetail: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  
  // Find the specific notification
  const notification = notifications.find(n => n.id === id && n.type === type);

  // Navigation handler
  const handleBack = () => {
    navigate('/notifications');
  };

  if (!notification) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex items-center mb-6">
            <button 
              onClick={handleBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold">Notification not found</h1>
          </div>
          
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
            <p className="text-red-700">
              This notification could not be found or may have been deleted.
            </p>
            <button 
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-primary text-white rounded"
            >
              Return to Notifications
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">{notification.title}</h1>
        </div>
        
        <NotificationDetailContent notification={notification} />
      </div>
    </Layout>
  );
};

export default NotificationDetail;
