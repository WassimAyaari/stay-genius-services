
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  Utensils, 
  ShowerHead, 
  Store, 
  PartyPopper, 
  FileText,
  MessageCircle,
  Trash2,
  Wrench,
  MessageSquare,
  Shield,
  Laptop
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const adminSections = [
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
      trend: "+3 this week", 
      path: "/admin/restaurant-menus" 
    },
    { 
      title: "Shops", 
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
      title: "Events", 
      icon: <PartyPopper className="h-5 w-5 text-primary" />, 
      count: 9, 
      trend: "+2 this month", 
      path: "/admin/events" 
    },
    { 
      title: "Messages", 
      icon: <MessageCircle className="h-5 w-5 text-primary" />, 
      count: 36, 
      trend: "+3 today", 
      path: "/admin/chat" 
    },
    { 
      title: "Feedback", 
      icon: <MessageSquare className="h-5 w-5 text-primary" />, 
      count: 3, 
      trend: "+1 today", 
      path: "/admin/feedback" 
    },
    { 
      title: "Security", 
      icon: <Shield className="h-5 w-5 text-primary" />, 
      count: null, 
      trend: "", 
      path: "/admin/security" 
    },
    { 
      title: "Housekeeping", 
      icon: <Trash2 className="h-5 w-5 text-primary" />, 
      count: null, 
      trend: "", 
      path: "/admin/housekeeping" 
    },
    { 
      title: "Maintenance", 
      icon: <Wrench className="h-5 w-5 text-primary" />, 
      count: null, 
      trend: "", 
      path: "/admin/maintenance" 
    },
    { 
      title: "IT", 
      icon: <Laptop className="h-5 w-5 text-primary" />, 
      count: null, 
      trend: "", 
      path: "/admin/information-technology" 
    },
    { 
      title: "About", 
      icon: <FileText className="h-5 w-5 text-primary" />, 
      count: null, 
      trend: "", 
      path: "/admin/about" 
    },
    { 
      title: "Activity", 
      icon: <Activity className="h-5 w-5 text-primary" />, 
      count: 132, 
      trend: "+28 this week", 
      path: "#" 
    }
  ];

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">Manage all sections of your establishment</p>
        
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
                    <div className="text-sm text-muted-foreground">Manage</div>
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
