import React from 'react';
import { motion } from 'framer-motion';

interface DemoProgressBarProps {
  progress: number; // 0-100
  isPaused: boolean;
}

const DemoProgressBar: React.FC<DemoProgressBarProps> = ({ progress }) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] bg-white/10 z-50">
      <motion.div
        className="h-full bg-primary"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'linear' }}
      />
    </div>
  );
};

export default DemoProgressBar;
