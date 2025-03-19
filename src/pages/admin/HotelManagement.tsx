
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Building, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface Hotel {
  id: string;
  name: string;
  address: string;
  contact_email: string | null;
  contact_phone: string | null;
  logo_url: string | null;
}

interface HotelFormData {
  name: string;
  address: string;
  contact_email: string;
  contact_phone: string;
}

const HotelManagement = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>("demo-user-id");
  const navigate = useNavigate();
  
  const form = useForm<HotelFormData>({
    defaultValues: {
      name: '',
      address: '',
      contact_email: '',
      contact_phone: '',
    }
  });
  
  // Mock data for hotels
  useEffect(() => {
    const fetchHotels = () => {
      setLoading(true);
      // Mock data
      const mockHotels: Hotel[] = [
        {
          id: '1',
          name: 'Grand Hotel Paris',
          address: '1 Rue de Rivoli, 75001 Paris',
          contact_email: 'contact@grandhotel.com',
          contact_phone: '+33 1 23 45 67 89',
          logo_url: null
        },
        {
          id: '2',
          name: 'Luxury Resort London',
          address: '10 Baker Street, London',
          contact_email: 'info@luxuryresort.com',
          contact_phone: '+44 20 1234 5678',
          logo_url: null
        }
      ];
      
      setHotels(mockHotels);
      setLoading(false);
    };
    
    fetchHotels();
  }, []);
  
  // Add a new hotel
  const onSubmit = async (data: HotelFormData) => {
    setLoading(true);
    
    // Simulate adding a hotel
    setTimeout(() => {
      const newHotel: Hotel = {
        id: Date.now().toString(),
        name: data.name,
        address: data.address,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        logo_url: null
      };
      
      setHotels([...hotels, newHotel]);
      toast.success('Hôtel ajouté avec succès');
      form.reset();
      setIsAdding(false);
      setLoading(false);
    }, 1000);
  };
  
  // Delete a hotel
  const deleteHotel = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ? Cette action est irréversible.')) {
      return;
    }
    
    setLoading(true);
    
    // Simulate deleting a hotel
    setTimeout(() => {
      setHotels(hotels.filter(hotel => hotel.id !== id));
      toast.success('Hôtel supprimé avec succès');
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold text-primary">Gestion des Hôtels</h1>
      </div>
      
      {!isAdding ? (
        <div className="mb-8">
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un hôtel
          </Button>
        </div>
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ajouter un nouvel hôtel</CardTitle>
            <CardDescription>Remplissez le formulaire pour ajouter un nouvel hôtel au système</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'hôtel</FormLabel>
                      <FormControl>
                        <Input placeholder="Grand Hôtel Paris" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="1 rue de Rivoli, 75001 Paris" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de contact</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@hotel.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone de contact</FormLabel>
                      <FormControl>
                        <Input placeholder="+33 1 23 45 67 89" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    Enregistrer
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="h-40 flex items-center justify-center">
                <div className="w-full h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : hotels.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-10">
            <Building className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-500">Aucun hôtel trouvé</p>
            <p className="text-gray-400">
              Ajoutez votre premier hôtel pour commencer à utiliser le système
            </p>
          </div>
        ) : (
          hotels.map(hotel => (
            <Card key={hotel.id}>
              <CardHeader>
                <CardTitle className="text-xl">{hotel.name}</CardTitle>
                <CardDescription>{hotel.address}</CardDescription>
              </CardHeader>
              <CardContent>
                {hotel.contact_email && <p className="text-sm">Email: {hotel.contact_email}</p>}
                {hotel.contact_phone && <p className="text-sm">Tél: {hotel.contact_phone}</p>}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button size="sm" variant="outline" 
                  onClick={() => navigate(`/admin/hotels/${hotel.id}`)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Éditer
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteHotel(hotel.id)}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default HotelManagement;
