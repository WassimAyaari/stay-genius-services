import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HotelCardProps {
  slug: string;
  name: string;
  image: string;
}

const HotelCard = ({ slug, name, image }: HotelCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(`/hotel/${slug}`)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group text-left rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-shadow cursor-pointer w-full"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-card-foreground">{name}</h3>
      </div>
    </motion.button>
  );
};

export default HotelCard;
