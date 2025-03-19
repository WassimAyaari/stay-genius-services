
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Building, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';

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
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<HotelFormData>({
    defaultValues: {
      name: '',
      address: '',
      contact_email: '',
      contact_phone: '',
    }
  });
  
  // Vérifier si l'utilisateur est un super admin
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth/login');
        return;
      }
      
      setCurrentUser(session.user.id);
      
      // Vérifier si l'utilisateur est un super admin
      const { data, error } = await supabase.rpc('is_super_admin', {
        user_id: session.user.id
      });
      
      if (error) {
        console.error('Erreur lors de la vérification des droits:', error);
        toast.error('Impossible de vérifier vos droits d\'accès');
        navigate('/');
        return;
      }
      
      setIsSuperAdmin(data);
      
      if (!data) {
        toast.error('Vous n\'avez pas les droits pour accéder à cette page');
        navigate('/');
        return;
      }
      
      fetchHotels();
    };
    
    checkAuth();
  }, [navigate]);
  
  // Récupérer la liste des hôtels
  const fetchHotels = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      setHotels(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des hôtels:', error);
      toast.error('Impossible de récupérer la liste des hôtels');
    } finally {
      setLoading(false);
    }
  };
  
  // Ajouter un nouvel hôtel
  const onSubmit = async (data: HotelFormData) => {
    try {
      const { data: newHotel, error } = await supabase
        .from('hotels')
        .insert([
          {
            name: data.name,
            address: data.address,
            contact_email: data.contact_email || null,
            contact_phone: data.contact_phone || null,
          }
        ])
        .select();
        
      if (error) {
        throw error;
      }
      
      // Créer l'admin de l'hôtel (l'utilisateur courant devient admin de cet hôtel)
      if (newHotel && newHotel.length > 0) {
        const { error: adminError } = await supabase
          .from('hotel_admins')
          .insert([
            {
              user_id: currentUser,
              hotel_id: newHotel[0].id
            }
          ]);
          
        if (adminError) {
          console.error('Erreur lors de la création de l\'admin:', adminError);
          toast.error('L\'hôtel a été créé mais vous n\'avez pas été ajouté comme administrateur');
        }
      }
      
      toast.success('Hôtel ajouté avec succès');
      form.reset();
      setIsAdding(false);
      fetchHotels();
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de l\'hôtel:', error);
      toast.error(error.message || 'Une erreur est survenue lors de l\'ajout de l\'hôtel');
    }
  };
  
  // Supprimer un hôtel
  const deleteHotel = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ? Cette action est irréversible.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Hôtel supprimé avec succès');
      fetchHotels();
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'hôtel:', error);
      toast.error(error.message || 'Une erreur est survenue lors de la suppression de l\'hôtel');
    }
  };
  
  if (!isSuperAdmin) {
    return null; // Page non accessible si l'utilisateur n'est pas super admin
  }
  
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
