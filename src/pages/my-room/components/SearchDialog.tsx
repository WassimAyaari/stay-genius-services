
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

type Props = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
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
  onOpenChange,
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
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search hotel services..."
          value={searchTerm}
          onValueChange={onSearchTermChange}
          disabled={isSubmitting || isLoading}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading services...</div>
          ) : (
            <>
              {securityCategory && (
                <CommandGroup heading={securityCategory.name}>
                  {filterItemsBySearch(
                    allItems.filter(item => item.category_id === securityCategory.id && item.is_active),
                    searchTerm
                  ).map(item => (
                    <CommandItem
                      key={item.id}
                      disabled={isSubmitting}
                      onSelect={() => onSelect(item, securityCategory)}
                      className="cursor-pointer"
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                        )}
                      </div>
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
                  <CommandGroup key={categoryId} heading={category.name}>
                    {filtered.map(item => (
                      <CommandItem
                        key={item.id}
                        disabled={isSubmitting}
                        onSelect={() => onSelect(item, category)}
                        className="cursor-pointer"
                      >
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                          )}
                        </div>
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
