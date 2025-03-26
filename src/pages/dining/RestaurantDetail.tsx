import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useRestaurantMenus } from '@/hooks/useRestaurantMenus';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Restaurant } from '@/features/dining/types';
import { Clock, MapPin, UtensilsCrossed, Calendar } from 'lucide-react';
import ReservationForm from '@/components/ReservationForm';
import { toast } from 'sonner';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const openBookingFromNavigation = location.state?.openBooking || false;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(openBookingFromNavigation);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("info");
  
  const { fetchRestaurantById, isLoading: isLoadingRestaurant } = useRestaurants();
  const { menuItems, isLoading: isLoadingMenuItems } = useRestaurantMenus(id);
  
  useEffect(() => {
    if (id && id !== ':id') {
      fetchRestaurantById(id)
        .then(data => setRestaurant(data))
        .catch(err => {
          console.error("Error fetching restaurant:", err);
          toast.error("Erreur lors du chargement du restaurant");
          navigate('/dining');
        });
    } else {
      toast.error("ID de restaurant invalide");
      navigate('/dining');
    }
  }, [id, fetchRestaurantById, navigate]);
  
  const handleReservationSuccess = () => {
    setIsBookingOpen(false);
  };
  
  if (isLoadingRestaurant || !restaurant) {
    return <div className="p-8 text-center">Chargement du restaurant...</div>;
  }

  const buttonText = restaurant.actionText || "Book a Table";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img 
              src={restaurant.images[activeImageIndex]} 
              alt={restaurant.name}
              className="w-full h-full object-cover transition-all"
            />
            <div className="absolute top-2 right-2">
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${restaurant.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
              `}>
                {restaurant.status}
              </span>
            </div>
          </div>
          
          {restaurant.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto py-2">
              {restaurant.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative rounded-md overflow-hidden w-16 h-16 flex-shrink-0 border-2 ${
                    activeImageIndex === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${restaurant.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <p className="text-gray-600 mt-2">{restaurant.description}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <UtensilsCrossed className="w-5 h-5" />
              <span>{restaurant.cuisine}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>{restaurant.openHours}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{restaurant.location}</span>
            </div>
          </div>
          
          <Button 
            className="w-full md:w-auto"
            onClick={() => setIsBookingOpen(true)}
            disabled={restaurant.status !== 'open'}
          >
            <Calendar className="mr-2 h-5 w-5" />
            {buttonText}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="mt-6">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">À propos de {restaurant.name}</h2>
            <p className="text-gray-700">{restaurant.description}</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Heures d'ouverture</h3>
            <p className="text-gray-700">{restaurant.openHours}</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Emplacement</h3>
            <p className="text-gray-700">{restaurant.location}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="menu" className="mt-6">
          {isLoadingMenuItems ? (
            <div className="text-center py-8">Chargement du menu...</div>
          ) : menuItems?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Menu non disponible</p>
            </div>
          ) : (
            <div className="space-y-8">
              {(() => {
                const categories = menuItems ? [...new Set(menuItems.map(item => item.category))] : [];
                return categories.map(category => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">{category}</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {menuItems?.filter(item => item.category === category).map(item => (
                        <Card key={item.id} className="overflow-hidden">
                          {item.image && (
                            <div className="relative aspect-video">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              {item.isFeatured && (
                                <div className="absolute top-2 left-2">
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                    Recommandé
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          <CardContent className="p-4">
                            <div className="flex justify-between mb-1">
                              <h4 className="font-semibold">{item.name}</h4>
                              <span className="font-semibold">{item.price} €</span>
                            </div>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[500px] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Réserver une table - {restaurant.name}</DialogTitle>
            <DialogDescription>
              Remplissez le formulaire ci-dessous pour réserver une table.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6 pt-2">
              {id && id !== ':id' && (
                <ReservationForm 
                  restaurantId={id} 
                  onSuccess={handleReservationSuccess}
                  buttonText={buttonText}
                />
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantDetail;
