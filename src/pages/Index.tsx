import React, { useEffect, useState } from 'react';
import { BedDouble, UtensilsCrossed, Calendar, PhoneCall, MapPin, Search, Sun, Clock, Heart, CloudSun, ThermometerSun, Wind, Bell, MessageCircle } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import RoomList from '@/components/RoomList';
import DiningSection from '@/features/dining/components/DiningSection';
import SpaSection from '@/features/spa/components/SpaSection';
import ActivitiesSection from '@/features/activities/components/ActivitiesSection';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { 
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20 
  },
  show: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

const Index = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [currentNotification, setCurrentNotification] = useState(0);

  const notifications = [
    {
      icon: <Sun className="w-8 h-8 text-primary" />,
      temp: "24°C",
      weather: "Sunny",
      info: "Perfect day for the pool!"
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8 text-primary" />,
      title: "Dinner Reservation",
      time: "7:00 PM",
      info: "Italian Restaurant - Table for 2"
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "Wine Tasting",
      time: "5:00 PM",
      info: "Join us at the Cellar"
    }
  ];

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good Afternoon");
      } else if (hour >= 17 && hour < 21) {
        setGreeting("Time for Dinner");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotification((prev) => (prev + 1) % notifications.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <section className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative overflow-hidden rounded-3xl max-w-4xl mx-auto h-[250px]">
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary-light/20 to-transparent" />
            <div className="relative p-6 sm:p-8 h-full">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  <Bell className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-secondary">
                    {greeting}, Emma
                  </h2>
                  <span className="text-gray-600">- Hotel Genius</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNotification}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/5 rounded-xl">
                      {notifications[currentNotification].icon}
                    </div>
                    <div>
                      {notifications[currentNotification].temp ? (
                        <>
                          <p className="text-3xl font-semibold text-secondary">
                            {notifications[currentNotification].temp}
                          </p>
                          <p className="text-gray-600">
                            {notifications[currentNotification].weather}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-secondary">
                            {notifications[currentNotification].title}
                          </p>
                          <p className="text-gray-600">
                            {notifications[currentNotification].time}
                          </p>
                        </>
                      )}
                      <p className="text-sm text-primary mt-1">
                        {notifications[currentNotification].info}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </section>

      <motion.section 
        className="mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Button 
              className="w-full flex items-center justify-center gap-3 bg-primary text-white py-8 text-lg rounded-3xl hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={() => navigate('/my-room')}
            >
              <BedDouble className="w-7 h-7" />
              My Room
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button 
              className="w-full flex items-center justify-center gap-3 bg-secondary text-white py-8 text-lg rounded-3xl hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={() => navigate('/contact')}
            >
              <PhoneCall className="w-7 h-7" />
              Request Service
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Input
            type="search"
            placeholder="Find restaurants, spa services, or activities..."
            className="w-full pl-12 pr-6 py-4 rounded-2xl text-base bg-white/80 backdrop-blur-sm shadow-sm border-gray-100"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </motion.section>

      <motion.section 
        className="mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-2xl font-semibold text-secondary mb-6">Today's Highlights</h2>
        <div className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card className="p-6 animate-fade-in bg-white/80 backdrop-blur-sm rounded-2xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-4">
                <Calendar className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium text-secondary">Wine Tasting</p>
                  <p className="text-sm text-gray-600">Today at 6 PM - Wine Cellar</p>
                </div>
                <Button 
                  variant="outline" 
                  className="ml-auto rounded-xl" 
                  size="sm"
                  onClick={() => navigate('/activities')}
                >
                  Book Now
                </Button>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="p-6 animate-fade-in bg-white/80 backdrop-blur-sm rounded-2xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-4">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium text-secondary">Chef's Special Dinner</p>
                  <p className="text-sm text-gray-600">Tonight at 7 PM - Main Restaurant</p>
                </div>
                <Button 
                  variant="outline" 
                  className="ml-auto rounded-xl" 
                  size="sm"
                  onClick={() => navigate('/dining')}
                >
                  Reserve
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-secondary">Available Rooms</h2>
          <Button 
            variant="ghost" 
            className="text-primary font-medium"
            onClick={() => navigate('/my-room')}
          >
            View All
          </Button>
        </div>
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <RoomList />
        </div>
      </motion.section>

      <motion.section 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-secondary">Spa & Wellness</h2>
          <Button 
            variant="ghost" 
            className="text-primary font-medium"
            onClick={() => navigate('/spa')}
          >
            View All
          </Button>
        </div>
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <SpaSection />
        </div>
      </motion.section>

      <motion.section 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-secondary">Restaurants & Dining</h2>
          <Button 
            variant="ghost" 
            className="text-primary font-medium"
            onClick={() => navigate('/dining')}
          >
            View All
          </Button>
        </div>
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <DiningSection />
        </div>
      </motion.section>

      <motion.section 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-secondary">Activities & Events</h2>
          <Button 
            variant="ghost" 
            className="text-primary font-medium"
            onClick={() => navigate('/activities')}
          >
            View All
          </Button>
        </div>
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <ActivitiesSection />
        </div>
      </motion.section>

      <motion.section 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card className="bg-primary/95 backdrop-blur-sm text-white rounded-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-lg border-none">
          <div 
            className="flex items-center justify-between p-6"
            onClick={() => navigate('/contact')}
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <PhoneCall className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Need Assistance?</h3>
                <p className="text-white/90">We're here to help 24/7</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                size="icon"
                variant="secondary"
                className="rounded-xl bg-white/20 hover:bg-white/30 h-12 w-12"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = 'tel:+1234567890';
                }}
              >
                <PhoneCall className="w-6 h-6" />
              </Button>
              <Button 
                size="icon"
                variant="secondary"
                className="rounded-xl bg-white/20 hover:bg-white/30 h-12 w-12"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = 'https://wa.me/1234567890';
                }}
              >
                <MessageCircle className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.section>

    </Layout>
  );
};

export default Index;
