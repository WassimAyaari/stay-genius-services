import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Calendar, MapPin, Heart } from 'lucide-react';
import PhoneMockup from '../components/PhoneMockup';

const actions = [
  { label: 'Ask', icon: MessageSquare, desc: 'AI Concierge' },
  { label: 'Book', icon: Calendar, desc: 'Amenities' },
  { label: 'Go', icon: MapPin, desc: 'Navigate' },
  { label: 'Tip', icon: Heart, desc: 'Staff Tips' },
];

const GuestScene: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-full gap-8 px-4">
      {/* Phone with welcome + chat */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <PhoneMockup>
          <div className="w-full h-full bg-gradient-to-b from-[#1a2e1a] to-[#0d0d0d] flex flex-col pt-10 px-4">
            {/* Welcome widget */}
            <motion.div
              className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-[10px] text-white/40 mb-0.5">Good Evening</div>
              <div className="text-white text-xs font-semibold">Welcome back, Mr. Müller</div>
              <div className="text-white/40 text-[9px] mt-1">Room 412 · Suite Deluxe</div>
            </motion.div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {actions.map((action, i) => (
                <motion.div
                  key={action.label}
                  className="bg-primary/10 border border-primary/20 rounded-xl p-2.5 flex flex-col items-center gap-1 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.3, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <action.icon className="w-4 h-4 text-primary" />
                  <span className="text-white text-[10px] font-semibold">{action.label}</span>
                  <span className="text-white/40 text-[8px]">{action.desc}</span>
                </motion.div>
              ))}
            </div>

            {/* Chat simulation */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              <div className="flex justify-end">
                <div className="bg-primary/20 text-white text-[10px] rounded-xl rounded-br-sm px-3 py-1.5 max-w-[70%]">
                  Can I get a late checkout?
                </div>
              </div>
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4 }}
              >
                <div className="bg-white/10 text-white text-[10px] rounded-xl rounded-bl-sm px-3 py-1.5 max-w-[80%]">
                  Of course, Mr. Müller! I've extended your checkout to 2:00 PM. Enjoy your stay! ✨
                </div>
              </motion.div>
            </motion.div>
          </div>
        </PhoneMockup>
      </motion.div>

      {/* Text overlay */}
      <motion.div
        className="flex flex-col items-start gap-4 max-w-xs"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h2 className="text-white text-xl md:text-2xl font-bold leading-tight">
          The Ultimate<br />
          <span className="text-primary">Digital Companion</span>
        </h2>
        {['Zero friction', 'No app downloads', '100+ languages'].map((text, i) => (
          <motion.div
            key={text}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 + i * 0.4 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-white/60 text-sm">{text}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GuestScene;
