
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  LayoutDashboard, 
  Hotel, 
  UtensilsCrossed, 
  Dumbbell, 
  Calendar, 
  MessageSquare, 
  Phone 
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminModules = [
    {
      title: 'Configuration',
      description: 'Gérer les informations de base de l\'hôtel',
      icon: <Settings className="w-8 h-8 text-primary" />,
      route: '/admin/config'
    },
    {
      title: 'Page d\'accueil',
      description: 'Gérer les sections de la page d\'accueil',
      icon: <LayoutDashboard className="w-8 h-8 text-primary" />,
      route: '/admin/home'
    },
    {
      title: 'Chambres',
      description: 'Gérer les chambres et leurs détails',
      icon: <Hotel className="w-8 h-8 text-primary" />,
      route: '/admin/rooms'
    },
    {
      title: 'Restauration',
      description: 'Gérer les restaurants et menus',
      icon: <UtensilsCrossed className="w-8 h-8 text-primary" />,
      route: '/admin/dining'
    },
    {
      title: 'Activités',
      description: 'Gérer les activités et services spa',
      icon: <Dumbbell className="w-8 h-8 text-primary" />,
      route: '/admin/activities'
    },
    {
      title: 'Événements',
      description: 'Gérer les événements et stories',
      icon: <Calendar className="w-8 h-8 text-primary" />,
      route: '/admin/events'
    },
    {
      title: 'Services',
      description: 'Gérer les services et demandes',
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      route: '/admin/services'
    },
    {
      title: 'Contact',
      description: 'Gérer les informations de contact',
      icon: <Phone className="w-8 h-8 text-primary" />,
      route: '/admin/contact'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-secondary">Administration de l'hôtel</h1>
        <p className="text-gray-600">Gérez toutes les sections et informations de votre site</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module, index) => (
          <Card 
            key={index}
            className="p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(module.route)}
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                {module.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-1">{module.title}</h3>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <Button variant="outline" className="w-full" onClick={() => navigate(module.route)}>
                  Gérer
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
