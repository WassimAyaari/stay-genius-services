import React from 'react';
import { motion } from 'framer-motion';
import HotelCard from './HotelCard';

const demoHotels = [
  {
    slug: 'hotel-genius',
    name: 'Hotel Genius',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'fiesta-beach-djerba',
    name: 'Fiesta Beach Djerba',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

const HotelDirectory = () => {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Discover Our Hotels
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Explore hotels using Hotel Genius to elevate their guest experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-md sm:max-w-none mx-auto">
          {demoHotels.map((hotel, index) => (
            <motion.div
              key={hotel.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <HotelCard {...hotel} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelDirectory;
