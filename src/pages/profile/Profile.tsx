
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Key, Bell, Users, Pencil, X, Calendar, Mail, Flag, Building } from "lucide-react";
import { CompanionData, UserData } from '@/features/users/types/userTypes';
import { getCompanions } from '@/features/users/services/companionService';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import ProfileImageUploader from '@/components/profile/ProfileImageUploader';
import { syncGuestData } from '@/features/users/services/guestService';

const Profile = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [companions, setCompanions] = useState<CompanionData[]>([]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Your room has been cleaned",
      time: "2 minutes ago"
    },
    {
      id: 2,
      message: "Spa appointment confirmed",
      time: "1 hour ago"
    }
  ]);

  useEffect(() => {
    // Récupérer les données utilisateur du localStorage
    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      try {
        const parsedData = JSON.parse(userDataStr);
        setUserData(parsedData);

        // Récupérer les accompagnateurs si un ID utilisateur est disponible
        const userId = localStorage.getItem('user_id');
        if (userId) {
          fetchCompanions(userId);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const fetchCompanions = async (userId: string) => {
    try {
      const companionsList = await getCompanions(userId);
      setCompanions(companionsList);
    } catch (error) {
      console.error('Error fetching companions:', error);
    }
  };

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast({
      title: "Notification dismissed",
      description: "The notification has been removed",
    });
  };

  // Format date
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Non défini';
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Calculate stay duration
  const calculateStayDuration = () => {
    if (!userData?.check_in_date || !userData?.check_out_date) return null;
    
    try {
      const checkIn = new Date(userData.check_in_date);
      const checkOut = new Date(userData.check_out_date);
      
      // Calculate the difference in days
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error('Error calculating stay duration:', error);
      return null;
    }
  };

  const handleProfileImageChange = async (imageData: string | null) => {
    if (!userData) return;
    
    // Mettre à jour les données utilisateur locales
    const updatedUserData = {
      ...userData,
      profile_image: imageData
    };
    
    setUserData(updatedUserData);
    localStorage.setItem('user_data', JSON.stringify(updatedUserData));
    
    // Synchroniser avec Supabase si un ID utilisateur est disponible
    const userId = localStorage.getItem('user_id');
    if (userId) {
      try {
        await syncGuestData(userId, updatedUserData);
      } catch (error) {
        console.error('Error syncing profile image with Supabase:', error);
      }
    }
  };

  const stayDuration = calculateStayDuration();

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        {/* Header avec le nom et photo de profil */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-primary/10 p-6">
            <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:text-left">
              {userData && (
                <ProfileImageUploader
                  initialImage={userData.profile_image}
                  firstName={userData.first_name}
                  lastName={userData.last_name}
                  onImageChange={handleProfileImageChange}
                />
              )}
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-2xl font-bold">
                    {userData ? `${userData.first_name} ${userData.last_name}` : 'Guest'}
                  </h1>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground">Premium Guest</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Reste du contenu de la page */}
        {/* Informations personnelles */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Users className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Informations personnelles</h2>
              </div>
            </div>
            <div className="divide-y">
              {userData?.email && (
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{userData.email}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {userData?.birth_date && (
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Date de naissance</p>
                      <p className="text-sm text-muted-foreground">{formatDate(userData.birth_date)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {userData?.nationality && (
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Flag className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Nationalité</p>
                      <p className="text-sm text-muted-foreground">{userData.nationality}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informations sur le séjour actuel */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Building className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Séjour actuel</h2>
              </div>
            </div>
            <div className="divide-y">
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Chambre</p>
                    <p className="text-sm text-muted-foreground">{userData?.room_number || '406'}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Key className="h-4 w-4" />
                  Clé mobile
                </Button>
              </div>
              
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Dates de séjour</p>
                    <p className="text-sm text-muted-foreground">
                      Du {formatDate(userData?.check_in_date)} au {formatDate(userData?.check_out_date)}
                    </p>
                  </div>
                </div>
                {stayDuration && (
                  <Badge variant="outline" className="ml-2">
                    {stayDuration} {stayDuration > 1 ? 'nuits' : 'nuit'}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membres de la famille */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Users className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Accompagnateurs</h2>
              </div>
            </div>
            {companions.length > 0 ? (
              <div className="divide-y">
                {companions.map((companion, index) => (
                  <div key={index} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{companion.first_name || companion.firstName} {companion.last_name || companion.lastName}</p>
                      <p className="text-sm text-muted-foreground">{companion.relation}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Aucun accompagnateur ajouté
              </div>
            )}
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full">
                Ajouter un accompagnateur
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications récentes */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Bell className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Notifications récentes</h2>
              </div>
            </div>
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-sm text-muted-foreground">{notification.time}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Aucune notification
              </div>
            )}
          </CardContent>
        </Card>

        {/* Boutons de navigation en bas */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Bell className="h-6 w-6 mb-2 text-primary" />
              <p className="font-medium">Notifications</p>
            </CardContent>
          </Card>
          <Card className="text-center cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mb-2 text-primary">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <p className="font-medium">Favoris</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
