
import React from 'react';
import Layout from '@/components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/hooks/useEvents';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  
  // Trouver l'événement correspondant à l'ID
  const event = events.find(event => event.id === id);
  
  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </Layout>
    );
  }
  
  if (!event) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Événement non trouvé</h1>
          <p className="mb-6">L'événement que vous cherchez n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/events')}>
            Retour aux événements
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <Button variant="outline" onClick={() => navigate('/events')} className="mb-4">
          Retour aux événements
        </Button>
        
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="relative h-72 md:h-96">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                {event.category === 'event' ? 'Événement' : 'Promotion'}
              </span>
              {event.is_featured && (
                <span className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                  En vedette
                </span>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{event.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold mb-2">Date et Heure</h2>
                <p>{event.date} {event.time && `à ${event.time}`}</p>
              </div>
              
              {event.location && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="font-semibold mb-2">Lieu</h2>
                  <p>{event.location}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button className="w-full md:w-auto">
                {event.category === 'event' ? 'Voir plus d\'informations' : 'Voir la promotion'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
