
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

export interface DatePickerProps {
  mode?: "single" | "range" | "multiple"
  selected?: Date | Date[] | undefined
  onSelect?: (date: Date | undefined) => void
  minDate?: Date
  maxDate?: Date
  required?: boolean
  className?: string
  locale?: Locale
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
    if (selected) {
      setDate(selected as Date)
    }
  }, [selected])

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
        selected: selected as { from: Date; to: Date } | undefined,
        onSelect: onSelect,
      }
    } else if (mode === "multiple") {
      return {
        ...baseProps,
        mode: "multiple" as const,
        selected: selected as Date[] | undefined,
        onSelect: onSelect,
      }
    }

    return baseProps
  }

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
            {date ? format(date, "PPP", { locale }) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar 
            {...getCalendarProps()}
            locale={locale}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
