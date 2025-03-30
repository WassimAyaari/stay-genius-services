
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Pencil, UserCircle, Users, Bell } from "lucide-react";
import Layout from '@/components/Layout';
import { CompanionData, UserData } from '@/features/users/types/userTypes';
import { getCompanions } from '@/features/users/services/companionService';

const Profile = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [companions, setCompanions] = useState<CompanionData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    room_number: '',
  });

  useEffect(() => {
    // Récupérer les données utilisateur du localStorage
    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      try {
        const parsedData = JSON.parse(userDataStr);
        setUserData(parsedData);
        setFormData({
          first_name: parsedData.first_name || '',
          last_name: parsedData.last_name || '',
          email: parsedData.email || '',
          room_number: parsedData.room_number || '',
        });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (!userData) return;

    // Mettre à jour les données utilisateur
    const updatedUserData = {
      ...userData,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      room_number: formData.room_number,
    };

    // Sauvegarder dans localStorage
    localStorage.setItem('user_data', JSON.stringify(updatedUserData));
    setUserData(updatedUserData);
    setIsEditing(false);

    // Afficher une notification de succès
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été mises à jour avec succès.",
    });
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profil Utilisateur</h1>
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Annuler" : <><Pencil className="h-4 w-4 mr-2" /> Modifier</>}
          </Button>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <UserCircle className="h-20 w-20 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">
                {userData?.first_name} {userData?.last_name}
              </h2>
              <p className="text-muted-foreground">Premium Guest</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">Prénom</Label>
                <Input 
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Nom</Label>
                <Input 
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="room_number">Numéro de chambre</Label>
              <Input 
                id="room_number"
                name="room_number"
                value={formData.room_number}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>

            {isEditing && (
              <Button onClick={handleSave} className="w-full mt-4">
                Enregistrer les modifications
              </Button>
            )}
          </div>
        </Card>

        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Membres de famille
        </h2>
        <Card className="p-6 mb-8">
          {companions.length > 0 ? (
            <div className="space-y-4">
              {companions.map((companion, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{companion.first_name || companion.firstName} {companion.last_name || companion.lastName}</p>
                    <p className="text-sm text-muted-foreground">{companion.relation}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Aucun membre de famille ajouté
            </p>
          )}
          <Button variant="outline" className="w-full mt-4">
            Ajouter un membre de famille
          </Button>
        </Card>

        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Bell className="h-6 w-6 mr-2" />
          Notifications
        </h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <p>Votre chambre a été nettoyée</p>
              <p className="text-sm text-muted-foreground">2 minutes ago</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Rendez-vous au spa confirmé</p>
              <p className="text-sm text-muted-foreground">1 heure ago</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
