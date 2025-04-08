
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  Users, 
  Utensils, 
  Calendar, 
  Inbox, 
  ShowerHead, 
  Store, 
  PartyPopper, 
  FileText,
  MessageCircle,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const adminSections = [
    { 
      title: "Demandes de service", 
      icon: <ShowerHead className="h-5 w-5 text-primary" />, 
      count: 24, 
      trend: "+5 depuis hier", 
      path: "/admin/requests" 
    },
    { 
      title: "Réservations", 
      icon: <Calendar className="h-5 w-5 text-primary" />, 
      count: 12, 
      trend: "+2 depuis hier", 
      path: "/admin/reservations" 
    },
    { 
      title: "Utilisateurs", 
      icon: <Users className="h-5 w-5 text-primary" />, 
      count: 48, 
      trend: "+8 ce mois", 
      path: "#" 
    },
    { 
      title: "Restaurants", 
      icon: <Utensils className="h-5 w-5 text-primary" />, 
      count: 4, 
      trend: "", 
      path: "/admin/restaurants" 
    },
    { 
      title: "Menus", 
      icon: <FileText className="h-5 w-5 text-primary" />, 
      count: 15, 
      trend: "+3 cette semaine", 
      path: "/admin/restaurant-menus" 
    },
    { 
      title: "Boutiques", 
      icon: <Store className="h-5 w-5 text-primary" />, 
      count: 6, 
      trend: "", 
      path: "/admin/shops" 
    },
    { 
      title: "Spa", 
      icon: <ShowerHead className="h-5 w-5 text-primary" />, 
      count: 3, 
      trend: "", 
      path: "/admin/spa" 
    },
    { 
      title: "Événements", 
      icon: <PartyPopper className="h-5 w-5 text-primary" />, 
      count: 9, 
      trend: "+2 ce mois", 
      path: "/admin/events" 
    },
    { 
      title: "Messages", 
      icon: <MessageCircle className="h-5 w-5 text-primary" />, 
      count: 36, 
      trend: "+3 aujourd'hui", 
      path: "/admin/chat" 
    },
    { 
      title: "À propos", 
      icon: <FileText className="h-5 w-5 text-primary" />, 
      count: null, 
      trend: "", 
      path: "/admin/about" 
    },
    { 
      title: "Activité", 
      icon: <Activity className="h-5 w-5 text-primary" />, 
      count: 132, 
      trend: "+28 cette semaine", 
      path: "#" 
    }
  ];

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-2">Tableau de bord administrateur</h1>
        <p className="text-muted-foreground mb-6">Gérez toutes les sections de votre établissement</p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {adminSections.map((section, index) => (
            <Link 
              key={index} 
              to={section.path} 
              className="transition-transform hover:scale-[1.02] focus:scale-[1.02]"
            >
              <Card className="h-full hover:shadow-md transition-shadow border-2 hover:border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">{section.title}</CardTitle>
                  {section.icon}
                </CardHeader>
                <CardContent>
                  {section.count !== null && (
                    <div className="text-2xl font-bold">{section.count}</div>
                  )}
                  {section.trend && (
                    <p className="text-xs text-muted-foreground">{section.trend}</p>
                  )}
                  {!section.count && !section.trend && (
                    <div className="text-sm text-muted-foreground">Gérer</div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
