import React from 'react';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DebugInfo = () => {
  const { user, userData, loading, isAuthenticated } = useAuth();
  const { data: serviceRequests, isLoading, error, isError } = useServiceRequests();
  
  const userId = user?.id || localStorage.getItem('user_id');
  const userRoomNumber = userData?.room_number || localStorage.getItem('user_room_number');

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
                <p><strong>User ID:</strong> {user?.id || 'None'}</p>
                <p><strong>User ID (localStorage):</strong> {localStorage.getItem('user_id') || 'None'}</p>
                <p><strong>Room Number:</strong> {userData?.room_number || 'None'}</p>
                <p><strong>Room Number (localStorage):</strong> {localStorage.getItem('user_room_number') || 'None'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Requests Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
                <p><strong>Error:</strong> {isError ? 'Yes' : 'No'}</p>
                <p><strong>Error Details:</strong> {error?.message || 'None'}</p>
                <p><strong>Data Count:</strong> {serviceRequests?.length || 0}</p>
                <p><strong>Query Key Values:</strong></p>
                <ul className="ml-4">
                  <li>userId: {userId || 'undefined'}</li>
                  <li>userRoomNumber: {userRoomNumber || 'undefined'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {serviceRequests && serviceRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Service Requests Data</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify(serviceRequests.slice(0, 2), null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DebugInfo;