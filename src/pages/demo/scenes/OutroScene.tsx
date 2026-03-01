import React from 'react';
import { motion } from 'framer-motion';

const OutroScene: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
      {/* Main headline */}
      <motion.h2
        className="text-white text-2xl md:text-4xl font-bold text-center leading-tight"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
      >
        Elevate Experience.<br />
        <span className="text-primary">Streamline Operations.</span>
      </motion.h2>

      {/* CTA Button with animated cursor */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: 'spring' }}
      >
        <motion.a
          href="https://www.hotelgenius.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
          animate={{ boxShadow: ['0 0 20px hsl(var(--primary) / 0.3)', '0 0 40px hsl(var(--primary) / 0.5)', '0 0 20px hsl(var(--primary) / 0.3)'] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Book a Demo Today
        </motion.a>

        {/* Animated cursor */}
        <motion.div
          className="absolute -right-6 -bottom-4"
          initial={{ opacity: 0, x: 40, y: -20 }}
          animate={{ opacity: [0, 1, 1, 0], x: [40, 0, 0, 0], y: [-20, 0, 2, 2] }}
          transition={{ delay: 2.5, duration: 1.5, times: [0, 0.4, 0.7, 1] }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .68-.61.3-.91L5.93 2.92c-.34-.27-.43.06-.43.29z" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Logo + URL */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
      >
        <motion.img
          src="/lovable-uploads/aab13959-5215-4313-87f8-c3012cdb27f0.png"
          alt="HotelGenius"
          className="h-10"
          animate={{ filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] }}
          transition={{ repeat: Infinity, duration: 3, delay: 4 }}
        />
        <span className="text-white/40 text-xs tracking-widest">www.hotelgenius.app</span>
      </motion.div>
    </div>
  );
};

export default OutroScene;
