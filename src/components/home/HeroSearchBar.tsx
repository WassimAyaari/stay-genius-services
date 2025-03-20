
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface HeroSearchBarProps {
  onFocus: () => void;
  onClick: () => void;
  placeholder: string;
}

const HeroSearchBar = ({ onFocus, onClick, placeholder }: HeroSearchBarProps) => {
  return (
    <div className="absolute -bottom-6 left-6 right-6">
      <div className="relative">
        <Input
          type="search"
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 rounded-xl text-base bg-white shadow-lg border-none"
          onClick={onClick}
          onFocus={onFocus}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
    </div>
  );
};

export default HeroSearchBar;
