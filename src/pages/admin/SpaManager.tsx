
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SpaFacilitiesTab from './spa/SpaFacilitiesTab';
import SpaServicesTab from './spa/SpaServicesTab';
import SpaBookingsTab from './spa/SpaBookingsTab';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAdminNotifications } from '@/hooks/admin/useAdminNotifications';

export default function SpaManager() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('bookings');
  const [selectedSpaService, setSelectedSpaService] = useState<string | null>(null);
  const { markSectionSeen } = useAdminNotifications();

  React.useEffect(() => {
    if (activeTab === 'bookings') {
      markSectionSeen('spa');
    }
  }, [activeTab, markSectionSeen]);

  const refreshSpaData = () => {
    queryClient.invalidateQueries({ queryKey: ['spa-facilities'] });
    queryClient.invalidateQueries({ queryKey: ['spa-services'] });
    queryClient.invalidateQueries({ queryKey: ['spa-bookings'] });
  };

  React.useEffect(() => {
    refreshSpaData();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Spa Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage spa facilities, services and bookings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings">
          <Card>
            {!selectedSpaService && (
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1.5">
                  <CardTitle>Bookings</CardTitle>
                  <CardDescription>
                    Manage spa bookings and their status
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={refreshSpaData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardHeader>
            )}
            <CardContent>
              <SpaBookingsTab onServiceSelected={setSelectedSpaService} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <CardTitle>Facilities</CardTitle>
              <CardDescription>
                Manage the different spa facilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpaFacilitiesTab />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>
                Manage services offered in each facility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpaServicesTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
