
import React from 'react';
import { useHotel } from '@/context/HotelContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BedDouble, Users, CreditCard, ArrowUpRight } from 'lucide-react';

const HotelDashboard = () => {
  const { hotel } = useHotel();

  if (!hotel) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-gray-500">Bienvenue dans la gestion de {hotel.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux d'occupation</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-gray-500">+5.2% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chambres disponibles</CardTitle>
            <BedDouble className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">Sur 56 chambres au total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clients actuels</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-gray-500">19 arrivées aujourd'hui</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenu mensuel</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€38,450</div>
            <p className="text-xs text-gray-500">+12.5% par rapport au mois dernier</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Événements à venir</CardTitle>
            <CardDescription>Les prochains événements dans votre hôtel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md mr-3">
                  <Activity className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Dîner de gala</div>
                  <div className="text-xs text-gray-500">Demain, 20:00, Salle Grand Siècle</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </div>
              
              <div className="flex items-center">
                <div className="bg-violet-100 p-2 rounded-md mr-3">
                  <Activity className="h-4 w-4 text-violet-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Conférence Tech</div>
                  <div className="text-xs text-gray-500">15 Juin, 09:00-18:00, Salle Congrès</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center">
                <div className="bg-pink-100 p-2 rounded-md mr-3">
                  <Activity className="h-4 w-4 text-pink-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Mariage Dupont</div>
                  <div className="text-xs text-gray-500">18 Juin, 16:00, Terrasse Panoramique</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Demandes récentes</CardTitle>
            <CardDescription>Dernières demandes des clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-md mr-3">
                  <BedDouble className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Chambre 304: Demande de serviettes</div>
                  <div className="text-xs text-gray-500">Il y a 2 heures • En attente</div>
                </div>
                <div className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  En cours
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-md mr-3">
                  <Users className="h-4 w-4 text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Chambre 212: Problème de climatisation</div>
                  <div className="text-xs text-gray-500">Il y a 4 heures • Terminé</div>
                </div>
                <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  Terminé
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md mr-3">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Chambre 115: Demande de facturation</div>
                  <div className="text-xs text-gray-500">Il y a 7 heures • Nouvelle</div>
                </div>
                <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  Nouvelle
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HotelDashboard;
