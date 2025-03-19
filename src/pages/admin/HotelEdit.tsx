
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Building, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface HotelFormData {
  name: string;
  address: string;
  contact_email: string;
  contact_phone: string;
}

const HotelEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<HotelFormData>({
    defaultValues: {
      name: '',
      address: '',
      contact_email: '',
      contact_phone: '',
    }
  });
  
  // Fetch hotel data
  useEffect(() => {
    const fetchHotel = () => {
      setLoading(true);
      
      // Mock data for hotels
      const mockHotels = [
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
      
      // Find the hotel with the matching ID
      const hotel = mockHotels.find(h => h.id === id);
      
      if (hotel) {
        form.reset({
          name: hotel.name,
          address: hotel.address,
          contact_email: hotel.contact_email || '',
          contact_phone: hotel.contact_phone || '',
        });
      } else {
        setNotFound(true);
        toast.error("Hôtel non trouvé");
      }
      
      setLoading(false);
    };
    
    fetchHotel();
  }, [id, form]);
  
  const onSubmit = async (data: HotelFormData) => {
    setLoading(true);
    
    // Simulate updating a hotel
    setTimeout(() => {
      toast.success('Hôtel mis à jour avec succès');
      setLoading(false);
      navigate('/admin/hotels');
    }, 1000);
  };
  
  if (notFound) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/hotels')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-primary">Hôtel non trouvé</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10">
              <Building className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-xl font-medium text-gray-500">Cet hôtel n'existe pas ou a été supprimé</p>
              <Button 
                onClick={() => navigate('/admin/hotels')} 
                className="mt-6"
              >
                Retour à la liste des hôtels
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/hotels')}
          className="mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold text-primary">Éditer l'hôtel</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'hôtel</CardTitle>
          <CardDescription>Modifiez les détails de votre hôtel</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ) : (
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
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={loading} className="gap-2">
                    {loading ? 'Enregistrement...' : (
                      <>
                        <Save className="w-4 h-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelEdit;
