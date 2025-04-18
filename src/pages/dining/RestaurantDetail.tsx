import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useRestaurantMenus } from '@/hooks/useRestaurantMenus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Restaurant } from '@/features/dining/types';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, Button } from '@radix-ui/react-dialog';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const openBookingFromNavigation = location.state?.openBooking || false;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(openBookingFromNavigation);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  
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

  const handleViewMenu = () => {
    if (restaurant?.menuPdf) {
      setSelectedPdf(restaurant.menuPdf);
    } else {
      setActiveTab("menu");
    }
  };

  if (isLoadingRestaurant || !restaurant) {
    return <div className="p-8 text-center">Chargement du restaurant...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <RestaurantGallery 
          images={restaurant.images} 
          name={restaurant.name} 
          status={restaurant.status}
        />
        
        <RestaurantInfo
          restaurant={restaurant}
          onBookingClick={() => setIsBookingOpen(true)}
          onViewMenuClick={handleViewMenu}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="mt-6">
          <AboutRestaurant restaurant={restaurant} />
        </TabsContent>
        
        <TabsContent value="menu" className="mt-6">
          <RestaurantMenu menuItems={menuItems} isLoading={isLoadingMenuItems} />
        </TabsContent>
      </Tabs>
      
      <BookingDialog
        isOpen={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        restaurantId={id || ''}
        restaurantName={restaurant.name}
        onSuccess={handleReservationSuccess}
        buttonText={restaurant.actionText}
      />

      <Dialog open={!!selectedPdf} onOpenChange={(open) => !open && setSelectedPdf(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
          <DialogHeader className="absolute top-0 right-0 z-10 p-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full" 
              onClick={() => setSelectedPdf(null)}
            >
              ✕
            </Button>
          </DialogHeader>
          {selectedPdf && (
            <iframe
              src={selectedPdf}
              className="w-full h-full"
              title="Menu PDF"
              style={{ border: 'none' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantDetail;
