
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Restaurant } from '@/features/dining/types';
import { UtensilsCrossed, Clock, MapPin, Calendar, BookText, Star, ArrowLeft } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    guests: '2',
    specialRequests: ''
  });
  
  // These restaurants would typically come from a database
  const restaurants: Restaurant[] = [{
    id: '5',
    name: 'In-Room Dining',
    description: 'Private dining experience in the comfort of your room',
    cuisine: 'Room Service',
    images: [
      'https://images.unsplash.com/photo-1635320514247-71bc21ef2c83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
    ],
    openHours: '24 Hours',
    location: 'Available in all rooms',
    status: 'open' as const
  }, {
    id: '1',
    name: 'Ocean View Restaurant',
    description: 'Enjoy international cuisine with breathtaking ocean views. Our chefs prepare a variety of international dishes using fresh, local ingredients. The panoramic ocean view provides the perfect backdrop for a memorable dining experience.',
    cuisine: 'International',
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'],
    openHours: '7:00 AM - 11:00 PM',
    location: 'Main Building, Ground Floor',
    status: 'open' as const
  }, {
    id: '2',
    name: 'Sunrise Buffet',
    description: 'Extensive breakfast and dinner buffet with global flavors. Start your day with our grand breakfast buffet featuring both local and international favorites. In the evening, enjoy a diverse dinner buffet with live cooking stations.',
    cuisine: 'Buffet',
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1174&q=80'],
    openHours: '6:30 AM - 10:30 AM, 6:00 PM - 10:30 PM',
    location: 'Main Building, First Floor',
    status: 'open' as const
  }, {
    id: '3',
    name: 'Seaside Grill',
    description: 'Fresh seafood and premium steaks by the beach. Dine with your feet in the sand as our chefs grill the freshest seafood and premium cuts of meat to perfection. Enjoy the sound of waves and breathtaking sunset views while you savor your meal.',
    cuisine: 'Steakhouse & Seafood',
    images: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
    ],
    openHours: '12:00 PM - 3:00 PM, 6:00 PM - 10:00 PM',
    location: 'Beach Area',
    status: 'open' as const
  }, {
    id: '4',
    name: 'Poolside Bar & Bistro',
    description: 'Light meals and refreshing drinks by the pool. Take a break from swimming and enjoy light bites, refreshing cocktails, and tropical drinks without leaving the pool area. Our menu features salads, sandwiches, and a variety of snacks perfect for a casual poolside meal.',
    cuisine: 'Snacks & Beverages',
    images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'],
    openHours: '10:00 AM - 8:00 PM',
    location: 'Pool Area',
    status: 'open' as const
  }];

  const restaurant = restaurants.find(r => r.id === id);

  if (!restaurant) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-semibold text-secondary mb-4">Restaurant not found</h2>
          <Button onClick={() => navigate('/dining')}>Back to Dining</Button>
        </div>
      </Layout>
    );
  }

  const handleBookTable = () => {
    setIsBookingOpen(true);
  };

  const handleSubmitBooking = () => {
    setIsBookingOpen(false);
    toast({
      title: "Reservation confirmed",
      description: `Your table at ${restaurant.name} has been booked for ${bookingDetails.date} at ${bookingDetails.time} for ${bookingDetails.guests} guests.`,
    });
  };

  const handleGetMenu = () => {
    toast({
      title: `${restaurant.name} Menu`,
      description: "The restaurant's menu has been opened. Enjoy browsing our delicious offerings!",
    });
    
    // In a real app, this would download or display a PDF menu
    // For now, we'll simulate it with a toast notification
  };
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handleNextImage = () => {
    if (restaurant.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % restaurant.images.length);
    }
  };
  
  const handlePrevImage = () => {
    if (restaurant.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + restaurant.images.length) % restaurant.images.length);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="relative h-64 md:h-80 lg:h-96 mb-6 overflow-hidden rounded-lg">
          <img 
            src={restaurant.images[currentImageIndex]} 
            alt={`${restaurant.name} - view`}
            className="w-full h-full object-cover"
          />
          
          {restaurant.images.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
                aria-label="Previous image"
              >
                <ArrowLeft size={20} />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 rotate-180 transition-colors"
                aria-label="Next image"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {restaurant.images.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
          
          <div className="absolute top-4 right-4">
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${restaurant.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            `}>
              {restaurant.status}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-secondary mb-2">{restaurant.name}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <UtensilsCrossed className="w-4 h-4" />
              <span>{restaurant.cuisine}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{restaurant.openHours}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.8 (120 reviews)</span>
            </div>
          </div>
          <p className="text-gray-700">{restaurant.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button 
            size="lg" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleBookTable}
          >
            <Calendar size={20} />
            Book a Table
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGetMenu}
          >
            <BookText size={20} />
            View Menu
          </Button>
        </div>

        <Separator className="my-8" />

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-4">Featured Dishes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Featured dishes section - would be populated from database */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 relative">
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" 
                  alt="Signature Dish" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">Chef's Special</h3>
                <p className="text-gray-600 text-sm">Our signature dish prepared with seasonal ingredients</p>
                <p className="text-primary font-medium mt-2">$26</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 relative">
                <img 
                  src="https://images.unsplash.com/photo-1485921325833-c519f76c4927?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80" 
                  alt="Popular Dish" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">Fresh Catch</h3>
                <p className="text-gray-600 text-sm">Daily seafood special from local fishermen</p>
                <p className="text-primary font-medium mt-2">$32</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book a Table at {restaurant.name}</DialogTitle>
            <DialogDescription>
              Fill in the details below to reserve your table. We'll send a confirmation to your registered contact.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={bookingDetails.date}
                onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={bookingDetails.time}
                onChange={(e) => setBookingDetails({...bookingDetails, time: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <Select 
                value={bookingDetails.guests} 
                onValueChange={(value) => setBookingDetails({...bookingDetails, guests: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number of guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="requests">Special Requests</Label>
              <Input
                id="requests"
                placeholder="Any special requests or dietary requirements?"
                value={bookingDetails.specialRequests}
                onChange={(e) => setBookingDetails({...bookingDetails, specialRequests: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitBooking}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default RestaurantDetail;
