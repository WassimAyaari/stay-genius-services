import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';
import TabletMockup from '../components/TabletMockup';

const AnimatedCounter: React.FC<{ target: number; label: string; delay: number }> = ({ target, label, delay }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCount(prev => {
          if (prev >= target) { clearInterval(interval); return target; }
          return prev + Math.ceil(target / 30);
        });
      }, 50);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [target, delay]);

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="text-primary text-2xl font-bold">{count}+</div>
      <div className="text-white/50 text-xs">{label}</div>
    </motion.div>
  );
};

const TeamScene: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
      {/* Title */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-white text-xl md:text-3xl font-bold mb-2">
          360° <span className="text-primary">Unified Dashboard</span>
        </h2>
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Agentic AI in Action
        </motion.div>
      </motion.div>

      {/* Tablet mockup */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 80 }}
      >
        <TabletMockup>
          <div className="w-full h-full bg-gradient-to-br from-[#111] to-[#0a0a0a] p-4 flex flex-col">
            {/* Dashboard header */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-white text-[10px] font-semibold">Team Console</div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Service ticket animation */}
            <motion.div
              className="bg-white/5 border border-white/10 rounded-lg p-2 mb-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-[9px] font-medium">Guest Request: Extra Towels</div>
                  <div className="text-white/40 text-[8px]">Room 412 · Mr. Müller</div>
                </div>
                <motion.div
                  className="flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                >
                  <ArrowRight className="w-3 h-3 text-primary" />
                  <span className="text-primary text-[8px] font-medium">Housekeeping</span>
                  <CheckCircle className="w-3 h-3 text-primary" />
                </motion.div>
              </div>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2 mt-auto">
              {[
                { label: 'Active', val: '24' },
                { label: 'Resolved', val: '156' },
                { label: 'Avg Time', val: '2.3m' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/5 rounded-lg p-2 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3 + i * 0.2 }}
                >
                  <div className="text-white text-[11px] font-bold">{stat.val}</div>
                  <div className="text-white/40 text-[8px]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabletMockup>
      </motion.div>

      {/* Counters */}
      <motion.div
        className="flex gap-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <AnimatedCounter target={340} label="Bookings ++" delay={2.5} />
        <AnimatedCounter target={520} label="Sales ++" delay={3} />
        <div className="flex items-center gap-1 text-primary">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-semibold">Revenue ↑</span>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamScene;
