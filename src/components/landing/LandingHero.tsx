import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const LandingHero = () => {
  return (
    <section className="relative py-16 sm:py-20 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Your hotel experience, simplified
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight mb-5">
            Your Hotel,
            <span className="block text-primary">At Your Fingertips</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Browse restaurants, book the spa, discover events, and chat with your hotel — all from your phone. Select your hotel below to get started.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingHero;
