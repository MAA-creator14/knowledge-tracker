export interface TimestampProps {
  date: Date | string
  format?: 'relative' | 'absolute' | 'both'
  showTime?: boolean
  className?: string
}

export interface DateRange {
  start: Date
  end: Date
}

export interface DateRangePickerProps {
  startDate: Date | null
  endDate: Date | null
  onDateChange: (range: DateRange) => void
  presets?: Array<'today' | 'week' | 'month' | 'year'>
}


