import React from 'react';
import { motion } from 'framer-motion';

interface PhoneMockupProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ children, scale = 1, className = '' }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ transform: `scale(${scale})` }}
    >
      {/* Phone frame */}
      <div className="relative w-[280px] h-[580px] bg-[#1a1a1a] rounded-[2.5rem] border-[3px] border-[#333] shadow-2xl shadow-black/50 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#1a1a1a] rounded-b-2xl z-10" />
        {/* Screen */}
        <div className="absolute inset-[3px] rounded-[2.2rem] overflow-hidden bg-[#0d0d0d]">
          {children}
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/20 rounded-full" />
      </div>
    </motion.div>
  );
};

export default PhoneMockup;
