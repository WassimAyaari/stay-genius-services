import React from 'react';

interface TabletMockupProps {
  children: React.ReactNode;
  className?: string;
}

const TabletMockup: React.FC<TabletMockupProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="relative w-[480px] h-[340px] bg-[#1a1a1a] rounded-[1.5rem] border-[3px] border-[#333] shadow-2xl shadow-black/50 overflow-hidden">
        {/* Camera dot */}
        <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] bg-[#333] rounded-full z-10" />
        {/* Screen */}
        <div className="absolute inset-[3px] rounded-[1.2rem] overflow-hidden bg-[#0d0d0d]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TabletMockup;
