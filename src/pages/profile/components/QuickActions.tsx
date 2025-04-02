
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CalendarDays, Utensils, ShowerHead } from "lucide-react";
import { Link } from 'react-router-dom';

const QuickActions = () => {
  return <div className="grid grid-cols-2 gap-4">
      <Link to="/services">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <Bell className="h-10 w-10 text-primary mb-3 mt-2" />
            <h3 className="font-medium mb-1">Demande de service</h3>
            <p className="text-sm text-gray-500">Faites une demande de service auprès de notre personnel</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/dining">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <Utensils className="h-10 w-10 text-primary mb-3 mt-2" />
            <h3 className="font-medium mb-1">Réserver une table</h3>
            <p className="text-sm text-gray-500">Réservez une table dans l'un de nos restaurants</p>
          </CardContent>
        </Card>
      </Link>

      <Link to="/spa">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <ShowerHead className="h-10 w-10 text-primary mb-3 mt-2" />
            <h3 className="font-medium mb-1">Réserver un soin</h3>
            <p className="text-sm text-gray-500">Détendez-vous avec nos services spa et bien-être</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/events">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <CalendarDays className="h-10 w-10 text-primary mb-3 mt-2" />
            <h3 className="font-medium mb-1">Événements</h3>
            <p className="text-sm text-gray-500">Découvrez les événements à venir à l'hôtel</p>
          </CardContent>
        </Card>
      </Link>
    </div>;
};

export default QuickActions;
