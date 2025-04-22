
import React, { useState } from 'react';
import { useSpaFacilities } from '@/hooks/useSpaFacilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEvents } from '@/hooks/useEvents';
import SpaFacilityDialog from './SpaFacilityDialog';
import SpaEventsDialog from './SpaEventsDialog';
import SpaEventsList from './SpaEventsList';
import { Event } from '@/types/event';

const SpaFacilitiesTab = () => {
  const { facilities, isLoading } = useSpaFacilities();
  const [selectedFacility, setSelectedFacility] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { events, loading: eventsLoading, deleteEvent } = useEvents();

  const handleEditFacility = (facility: any) => {
    setSelectedFacility(facility);
    setIsDialogOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsEventDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const filteredEvents = events?.filter(event => event.spa_facility_id === selectedFacility?.id) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Installations du Spa</h2>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-[#00AEBB]">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une installation
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {facilities?.map((facility) => (
          <Card key={facility.id} className="p-6">
            <div className="relative aspect-video mb-4">
              <img
                src={facility.image_url || '/placeholder.svg'}
                alt={facility.name}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{facility.name}</h3>
            <p className="text-gray-600 mb-4">{facility.description}</p>
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => handleEditFacility(facility)}>
                Modifier
              </Button>
              <Button onClick={() => {
                setSelectedFacility(facility);
                handleAddEvent();
              }}>
                Ajouter un événement
              </Button>
            </div>

            {selectedFacility?.id === facility.id && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">Événements</h4>
                <SpaEventsList 
                  events={filteredEvents}
                  onEditEvent={handleEditEvent}
                  onDeleteEvent={deleteEvent}
                  isLoading={eventsLoading}
                />
              </div>
            )}
          </Card>
        ))}
      </div>

      <SpaFacilityDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        facility={selectedFacility}
      />

      {selectedFacility && (
        <SpaEventsDialog
          isOpen={isEventDialogOpen}
          onOpenChange={setIsEventDialogOpen}
          facility={selectedFacility}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default SpaFacilitiesTab;
