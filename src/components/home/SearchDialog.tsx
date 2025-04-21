
import React, { useState, useEffect, useMemo } from 'react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty
} from '@/components/ui/command';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCommandSearchOptions } from './useCommandSearchOptions';

type SearchDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SearchDialog: React.FC<SearchDialogProps> = ({ open, setOpen }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { getFilteredResults } = useCommandSearchOptions();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen, open]);

  const handleClearSearch = () => setQuery('');

  const filteredResults = useMemo(() => getFilteredResults(query), [query, getFilteredResults]);

  const handleSelect = (route: string) => {
    navigate(route);
    setOpen(false);
    setQuery('');
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="px-3 pt-4">
        <div className="flex items-center border-b">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="Type to search..."
            value={query}
            onValueChange={setQuery}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="ml-2 rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-4 w-4 opacity-50" />
            </button>
          )}
        </div>
      </div>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages principales">
          {filteredResults.filter(item => item.type === 'page').map(item => (
            <CommandItem
              key={item.route}
              onSelect={() => handleSelect(item.route)}
              className="cursor-pointer"
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Spa & Bien-être">
          {filteredResults.filter(item => item.type === 'spa-service').map(item => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.route}
                onSelect={() => handleSelect(item.route)}
                className="cursor-pointer flex items-center"
              >
                {Icon && <Icon className="w-4 h-4 text-green-600 mr-2" />}
                {item.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandGroup heading="Restaurants">
          {filteredResults.filter(item => item.type === 'restaurant').map(item => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.route}
                onSelect={() => handleSelect(item.route)}
                className="cursor-pointer flex items-center"
              >
                {Icon && <Icon className="w-4 h-4 text-primary mr-2" />}
                {item.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandGroup heading="Shops">
          {filteredResults.filter(item => item.type === 'shop').map(item => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.route}
                onSelect={() => handleSelect(item.route)}
                className="cursor-pointer flex items-center"
              >
                {Icon && <Icon className="w-4 h-4 text-yellow-700 mr-2" />}
                {item.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchDialog;
