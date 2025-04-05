import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Utensils, Calendar, Users, Settings, MessageSquare } from 'lucide-react';

interface NavigationLinkProps {
  to: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
          isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : "text-gray-600 dark:text-gray-400"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{children}</span>
      </Link>
    </li>
  );
};

const AdminSidebar = () => {
  return (
    <div className="min-h-screen border-r bg-white dark:bg-gray-950">
      <div className="flex h-20 items-center border-b px-4">
        <Link to="/" className="font-bold text-lg">
          Admin Dashboard
        </Link>
      </div>
      
      <div className="space-y-1">
        <NavigationLink to="/admin" icon={Home}>
          Vue d'ensemble
        </NavigationLink>
        <NavigationLink to="/admin/restaurants" icon={Utensils}>
          Restaurants
        </NavigationLink>
        <NavigationLink to="/admin/events" icon={Calendar}>
          Événements
        </NavigationLink>
        <NavigationLink to="/admin/events-reservations" icon={Users}>
          Réservations d'événements
        </NavigationLink>
        <NavigationLink to="/admin/service-requests" icon={MessageSquare}>
          Demandes de service
        </NavigationLink>
        <NavigationLink to="/admin/settings" icon={Settings}>
          Paramètres
        </NavigationLink>
      </div>
      
      <div className="mt-auto border-t p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Hotel Management System
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;
