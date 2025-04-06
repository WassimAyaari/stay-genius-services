
import * as React from "react"
import { format } from "date-fns"
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
}

export function DatePicker({
  mode = "single",
  selected,
  onSelect,
  minDate,
  maxDate,
  required,
  className,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(selected as Date | undefined)

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
            {date ? format(date, "PPP") : <span>Sélectionner une date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode={mode}
            selected={date}
            onSelect={handleSelect}
            disabled={(dateToCheck) => {
              const isBeforeMin = minDate && dateToCheck < minDate
              const isAfterMax = maxDate && dateToCheck > maxDate
              return Boolean(isBeforeMin || isAfterMax)
            }}
            initialFocus
            className="p-3 pointer-events-auto"
            required={required}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
