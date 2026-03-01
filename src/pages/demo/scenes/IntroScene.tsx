import React from 'react';
import { motion } from 'framer-motion';
import PhoneMockup from '../components/PhoneMockup';

const IntroScene: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
      {/* Logo */}
      <motion.img
        src="/lovable-uploads/aab13959-5215-4313-87f8-c3012cdb27f0.png"
        alt="HotelGenius"
        className="h-16 md:h-20"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.2 }}
      />

      {/* Badge */}
      <motion.div
        className="px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-medium tracking-wider uppercase"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        #1 Smart Hospitality Ecosystem
      </motion.div>

      {/* Tagline */}
      <motion.p
        className="text-white/70 text-center text-sm md:text-base max-w-md leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        The Agentic AI ecosystem that unifies your hotel operations and guest experience into one intelligent platform.
      </motion.p>

      {/* Phone mockup */}
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.8, type: 'spring', stiffness: 80, damping: 18 }}
      >
        <PhoneMockup>
          <div className="w-full h-full bg-gradient-to-b from-primary/20 to-[#0d0d0d] flex flex-col items-center justify-start pt-10 px-4">
            <div className="w-10 h-10 rounded-full bg-primary/30 mb-3" />
            <div className="text-white text-xs font-semibold mb-1">Welcome to HotelGenius</div>
            <div className="text-white/50 text-[10px] mb-4">Your smart hotel companion</div>
            <div className="w-full space-y-2">
              {['Rooms & Suites', 'Dining', 'Spa & Wellness', 'Activities'].map((item, i) => (
                <motion.div
                  key={item}
                  className="w-full h-8 bg-white/5 rounded-lg flex items-center px-3 text-white/60 text-[10px]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.5 + i * 0.15 }}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </PhoneMockup>
      </motion.div>
    </div>
  );
};

export default IntroScene;
