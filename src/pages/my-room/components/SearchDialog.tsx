
import React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { filterItemsBySearch } from "./commandSearchUtils";
import { Room } from "@/hooks/useRoom";
import { RequestCategory, RequestItem } from "@/features/rooms/types";
import { Check, Search, X } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  searchTerm: string;
  onSearchTermChange: (val: string) => void;
  isSubmitting: boolean;
  isLoading: boolean;
  categories: RequestCategory[];
  allItems: RequestItem[];
  itemsByCategory: Record<string, RequestItem[]>;
  securityCategory?: RequestCategory;
  onSelect: (item: RequestItem, category: RequestCategory) => void;
};

const SearchDialog: React.FC<Props> = ({
  open,
  setOpen,
  searchTerm,
  onSearchTermChange,
  isSubmitting,
  isLoading,
  categories,
  allItems,
  itemsByCategory,
  securityCategory,
  onSelect
}) => {
  const handleClearSearch = () => {
    onSearchTermChange('');
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border shadow-xl">
        <div className="relative flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-5 w-5 shrink-0 text-primary" />
          <CommandInput
            placeholder="Search hotel services..."
            value={searchTerm}
            onValueChange={onSearchTermChange}
            disabled={isSubmitting || isLoading}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="ml-2 rounded-full p-1 hover:bg-gray-100"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <CommandList className="max-h-[65vh] overflow-y-auto">
          <CommandEmpty>
            <div className="py-6 text-center flex flex-col items-center">
              <Search className="h-10 w-10 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
            </div>
          </CommandEmpty>
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading services...</p>
            </div>
          ) : (
            <>
              {securityCategory && (
                <CommandGroup heading={securityCategory.name} className="px-2 py-1">
                  {filterItemsBySearch(
                    allItems.filter(item => item.category_id === securityCategory.id && item.is_active),
                    searchTerm
                  ).map(item => (
                    <CommandItem
                      key={item.id}
                      disabled={isSubmitting}
                      onSelect={() => onSelect(item, securityCategory)}
                      className="cursor-pointer flex items-center px-3 py-3 rounded-lg group hover:bg-primary/5"
                    >
                      <div className="flex flex-1 items-center">
                        <div className="mr-3 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-red-600 text-xs font-semibold">!</span>
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                          )}
                        </div>
                      </div>
                      <Check className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {Object.entries(itemsByCategory).map(([categoryId, items]) => {
                if (securityCategory && securityCategory.id === categoryId) return null;
                const category = categories.find(c => c.id === categoryId);
                if (!category) return null;
                const filtered = filterItemsBySearch(items, searchTerm);
                if (filtered.length === 0) return null;
                return (
                  <CommandGroup key={categoryId} heading={category.name} className="px-2 py-1">
                    {filtered.map(item => (
                      <CommandItem
                        key={item.id}
                        disabled={isSubmitting}
                        onSelect={() => onSelect(item, category)}
                        className="cursor-pointer flex items-center px-3 py-3 rounded-lg group hover:bg-primary/5"
                      >
                        <div className="flex flex-1 items-center">
                          <div className="mr-3 h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-xs font-semibold">{category.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                            )}
                          </div>
                        </div>
                        <Check className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })}
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default SearchDialog;
