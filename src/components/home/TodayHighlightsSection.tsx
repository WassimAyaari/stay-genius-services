
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Wine, Calendar, MapPin } from 'lucide-react';
import { useTodayHighlights } from '@/hooks/useTodayHighlights';
import { format } from 'date-fns';

const TodayHighlightsSection = () => {
  const { todayEvents, loading } = useTodayHighlights();

  if (loading) {
    return (
      <section className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-secondary mb-4">Les Événements du Jour</h2>
        <div className="grid grid-cols-1 gap-4">
          <Card className="p-4 h-32 animate-pulse bg-gray-100" />
          <Card className="p-4 h-32 animate-pulse bg-gray-100" />
        </div>
      </section>
    );
  }

  if (todayEvents.length === 0) {
    return (
      <section className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-secondary mb-4">Les Événements du Jour</h2>
        <Card className="p-6 text-center">
          <p className="text-gray-500">Aucun événement prévu aujourd'hui</p>
          <Link to="/events">
            <Button variant="link" className="mt-2">
              Voir tous les événements à venir
            </Button>
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <section className="px-6 mb-10">
      <h2 className="text-2xl font-bold text-secondary mb-4">Les Événements du Jour</h2>
      <div className="grid grid-cols-1 gap-4">
        {todayEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <div className="flex items-center">
              <div className="relative w-1/3 h-32">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {event.category === 'event' ? (
                      <Calendar className="w-5 h-5 text-primary" />
                    ) : (
                      <Wine className="w-5 h-5 text-primary" />
                    )}
                    <h3 className="text-lg font-semibold text-secondary">{event.title}</h3>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Aujourd'hui</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {event.time} {event.location && `- ${event.location}`}
                </p>
                <Link to="/events">
                  <Button size="sm" className="w-full sm:w-auto">
                    {event.category === 'event' ? 'Réserver' : 'En profiter'}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TodayHighlightsSection;
