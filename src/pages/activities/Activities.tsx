
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';
import { Activity } from '@/features/activities/types';
import ActivityCard from '@/features/activities/components/ActivityCard';
import { useToast } from '@/hooks/use-toast';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const Activities = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { requireAuth } = useRequireAuth();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const activities: Activity[] = [
    {
      id: '1',
      name: 'Treasure Hunt Adventure',
      description: 'An exciting treasure hunt around the hotel grounds',
      date: '2024-03-20',
      time: '10:00 AM',
      duration: '1.5 hours',
      location: 'Hotel Garden',
      price: 45,
      capacity: 20,
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'entertainment',
      status: 'upcoming'
    },
    {
      id: '2',
      name: 'Wine Tasting',
      description: 'Experience the finest wines from our cellar',
      date: '2024-03-21',
      time: '18:00',
      duration: '2 hours',
      location: 'Wine Cellar',
      price: 75,
      capacity: 12,
      image: '/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png',
      category: 'entertainment',
      status: 'upcoming'
    },
    {
      id: '3',
      name: 'Morning Yoga Class',
      description: 'Start your day with rejuvenating yoga by the pool',
      date: '2024-03-22',
      time: '08:00',
      duration: '1 hour',
      location: 'Poolside Deck',
      price: 25,
      capacity: 15,
      image: '/lovable-uploads/3cbdcf79-9da5-48bd-90f2-2c1737b76741.png',
      category: 'fitness',
      status: 'upcoming'
    },
    {
      id: '4',
      name: 'Local Market Tour',
      description: 'Explore the vibrant local market with our guide',
      date: '2024-03-23',
      time: '09:30',
      duration: '3 hours',
      location: 'Hotel Lobby (Meeting Point)',
      price: 60,
      capacity: 10,
      image: '/lovable-uploads/ad4ef1bb-ac95-4aaf-87df-6e874d0fcf46.png',
      category: 'culture',
      status: 'upcoming'
    },
    {
      id: '5',
      name: 'Sunset Sailing',
      description: 'Enjoy a relaxing sail at sunset with drinks and snacks',
      date: '2024-03-24',
      time: '17:30',
      duration: '2.5 hours',
      location: 'Hotel Marina',
      price: 120,
      capacity: 8,
      image: '/lovable-uploads/b0b89a1c-2c12-444b-be2c-1a65b9884f18.png',
      category: 'entertainment',
      status: 'upcoming'
    }
  ];

  const filteredActivities = activeFilter === 'all' 
    ? activities 
    : activities.filter(activity => {
        switch(activeFilter) {
          case 'on-site':
            return ['Hotel Garden', 'Wine Cellar', 'Poolside Deck'].includes(activity.location);
          case 'local':
            return activity.location.includes('Lobby') || activity.location.includes('Marina');
          case 'guided':
            return activity.description.toLowerCase().includes('guide') || activity.description.toLowerCase().includes('tour');
          case 'special':
            return activity.price > 100;
          default:
            return true;
        }
      });

  const handleBookActivity = (activityId: string) => {
    requireAuth(() => {
      toast({
        title: t('activities.booking.confirmed'),
        description: t('activities.booking.success'),
      });
    });
  };

  return (
    <Layout>
      <div className="text-center mb-8 pt-6 md:pt-8">
        <h1 className="text-4xl font-semibold text-secondary mb-4">{t('activities.title')}</h1>
        <p className="text-gray-600">{t('activities.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <Button 
          variant={activeFilter === 'all' ? 'default' : 'outline'} 
          className={activeFilter === 'all' ? 'bg-primary' : ''}
          onClick={() => setActiveFilter('all')}
        >
          {t('activities.filters.all')}
        </Button>
        <Button 
          variant={activeFilter === 'on-site' ? 'default' : 'outline'} 
          className={activeFilter === 'on-site' ? 'bg-primary' : ''}
          onClick={() => setActiveFilter('on-site')}
        >
          {t('activities.filters.onSite')}
        </Button>
        <Button 
          variant={activeFilter === 'local' ? 'default' : 'outline'} 
          className={activeFilter === 'local' ? 'bg-primary' : ''}
          onClick={() => setActiveFilter('local')}
        >
          {t('activities.filters.local')}
        </Button>
        <Button 
          variant={activeFilter === 'guided' ? 'default' : 'outline'} 
          className={activeFilter === 'guided' ? 'bg-primary' : ''}
          onClick={() => setActiveFilter('guided')}
        >
          {t('activities.filters.guided')}
        </Button>
        <Button 
          variant={activeFilter === 'special' ? 'default' : 'outline'} 
          className={activeFilter === 'special' ? 'bg-primary' : ''}
          onClick={() => setActiveFilter('special')}
        >
          {t('activities.filters.special')}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <ActivityCard 
            key={activity.id} 
            activity={activity} 
            onBook={handleBookActivity} 
          />
        ))}
      </div>
    </Layout>
  );
};

export default Activities;
