
import React from 'react';
import { motion } from 'framer-motion';
import TodayHighlightsSection from '@/components/home/TodayHighlightsSection';
import FeaturedExperienceSection from '@/components/home/FeaturedExperienceSection';
import { useActiveHotel } from '@/hooks/useActiveHotel';
import AboutSection from '@/components/home/AboutSection';
import HomeServicesSection from '@/components/home/HomeServicesSection';
import { Skeleton } from '@/components/ui/skeleton';
import HeroSectionWithProps from '@/components/home/HeroSectionWithProps';

const HomePage = () => {
  const { hotel, aboutSections, services, loading } = useActiveHotel();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <div className="space-y-8 py-8">
        <Skeleton className="h-[400px] w-full" />
        <div className="container mx-auto">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col min-h-screen"
    >
      <motion.div variants={itemVariants}>
        <HeroSectionWithProps
          title={hotel?.name || "Bienvenue à l'hôtel"}
          subtitle={hotel?.address || "Votre séjour de luxe vous attend"}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TodayHighlightsSection />
      </motion.div>

      {aboutSections.length > 0 && (
        <motion.div variants={itemVariants}>
          <AboutSection sections={aboutSections} />
        </motion.div>
      )}

      {services.length > 0 && (
        <>
          <motion.div variants={itemVariants}>
            <HomeServicesSection 
              services={services} 
              type="main" 
              title="Nos Services" 
              description="Découvrez nos services exclusifs pour rendre votre séjour inoubliable" 
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <HomeServicesSection 
              services={services} 
              type="additional" 
              title="Services Additionnels" 
              description="Des options supplémentaires pour personnaliser votre expérience" 
              className="bg-gray-50" 
            />
          </motion.div>
        </>
      )}

      <motion.div variants={itemVariants}>
        <FeaturedExperienceSection />
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
