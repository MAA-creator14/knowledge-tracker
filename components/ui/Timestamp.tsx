'use client'

import { formatAbsoluteDate, formatRelativeTime } from '@/lib/utils/date/formatDate'
import { TimestampProps } from '@/lib/types/timestamps'

export default function Timestamp({ 
  date, 
  format = 'relative', 
  showTime = true,
  className = '' 
}: TimestampProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  let displayText = ''
  
  if (format === 'relative') {
    displayText = formatRelativeTime(dateObj)
  } else if (format === 'absolute') {
    displayText = formatAbsoluteDate(dateObj, showTime)
  } else {
    // both
    displayText = `${formatRelativeTime(dateObj)} • ${formatAbsoluteDate(dateObj, showTime)}`
  }
  
  return (
    <span className={className} title={formatAbsoluteDate(dateObj, showTime)}>
      {displayText}
    </span>
  )
}


