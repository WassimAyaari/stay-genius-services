
import * as React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface BirthDatePickerProps {
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function BirthDatePicker({
  selected,
  onSelect,
  required,
  className,
  disabled = false,
  placeholder = "Sélectionner une date",
}: BirthDatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(selected);
  
  // Calculate reasonable date range for birth dates (100 years ago to today)
  const today = new Date();
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(today.getFullYear() - 100);

  React.useEffect(() => {
    if (selected) {
      setDate(selected);
    }
  }, [selected]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onSelect) {
      onSelect(selectedDate);
    }
  };

  const formattedDate = date ? format(date, "d MMMM yyyy", { locale: fr }) : placeholder;

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{formattedDate}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar 
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={(date) => date > today || date < hundredYearsAgo}
            initialFocus
            locale={fr}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
