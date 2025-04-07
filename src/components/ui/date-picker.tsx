
import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateRange } from "react-day-picker"

export interface DatePickerProps {
  mode?: "single" | "range" | "multiple"
  selected?: Date | Date[] | DateRange | undefined
  onSelect?: (date: Date | Date[] | DateRange | undefined) => void
  minDate?: Date
  maxDate?: Date
  required?: boolean
  className?: string
  locale?: typeof fr
  placeholder?: string
}

export function DatePicker({
  mode = "single",
  selected,
  onSelect,
  minDate,
  maxDate,
  required,
  className,
  locale = fr,
  placeholder = "Sélectionner une date",
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    selected as Date | undefined
  )

  React.useEffect(() => {
    if (selected && mode === "single") {
      setDate(selected as Date)
    }
  }, [selected, mode])

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (onSelect) {
      onSelect(selectedDate)
    }
  }

  const getCalendarProps = () => {
    const baseProps = {
      initialFocus: true,
      className: "p-3 pointer-events-auto",
      disabled: (dateToCheck: Date) => {
        const isBeforeMin = minDate && dateToCheck < minDate
        const isAfterMax = maxDate && dateToCheck > maxDate
        return Boolean(isBeforeMin || isAfterMax)
      },
      locale,
    }

    if (mode === "single") {
      return {
        ...baseProps,
        mode: "single" as const,
        selected: date,
        onSelect: handleSelect,
      }
    } else if (mode === "range") {
      return {
        ...baseProps,
        mode: "range" as const,
        selected: selected as DateRange | undefined,
        onSelect: onSelect as ((range: DateRange | undefined) => void) | undefined,
      }
    } else if (mode === "multiple") {
      return {
        ...baseProps,
        mode: "multiple" as const,
        selected: selected as Date[] | undefined,
        onSelect: onSelect as ((dates: Date[] | undefined) => void) | undefined,
      }
    }

    return baseProps
  }

  const formattedDate = date ? format(date, "PPP", { locale }) : placeholder;

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{formattedDate}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar 
            {...getCalendarProps()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
