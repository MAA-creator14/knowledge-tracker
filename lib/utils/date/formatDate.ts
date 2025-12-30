import { format, formatDistanceToNow, formatDistance } from 'date-fns'

/**
 * Format a date as an absolute date string
 * @param date - Date to format
 * @param showTime - Whether to include time in the output
 * @returns Formatted date string (e.g., "January 15, 2024, 3:45 PM")
 */
export function formatAbsoluteDate(date: Date | string, showTime: boolean = true): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (showTime) {
    return format(dateObj, 'MMMM d, yyyy, h:mm a')
  }
  return format(dateObj, 'MMMM d, yyyy')
}

/**
 * Format a date as relative time
 * @param date - Date to format
 * @returns Relative time string (e.g., "2 days ago", "3 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

/**
 * Format a date range
 * @param start - Start date
 * @param end - End date
 * @returns Formatted date range string
 */
export function formatDateRange(start: Date | string, end: Date | string): string {
  const startObj = typeof start === 'string' ? new Date(start) : start
  const endObj = typeof end === 'string' ? new Date(end) : end
  
  const startFormatted = format(startObj, 'MMM d, yyyy')
  const endFormatted = format(endObj, 'MMM d, yyyy')
  
  if (startFormatted === endFormatted) {
    return startFormatted
  }
  
  return `${startFormatted} - ${endFormatted}`
}

/**
 * Calculate days since a date
 * @param date - Date to calculate from
 * @returns Number of days
 */
export function getDaysSince(date: Date | string): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - dateObj.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Calculate weeks since a date
 * @param date - Date to calculate from
 * @returns Number of weeks
 */
export function getWeeksSince(date: Date | string): number {
  return Math.floor(getDaysSince(date) / 7)
}

/**
 * Calculate months since a date
 * @param date - Date to calculate from
 * @returns Number of months
 */
export function getMonthsSince(date: Date | string): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const months = (now.getFullYear() - dateObj.getFullYear()) * 12 + (now.getMonth() - dateObj.getMonth())
  return Math.max(0, months)
}

/**
 * Get duration between two dates in a human-readable format
 * @param start - Start date
 * @param end - End date (defaults to now)
 * @returns Human-readable duration string
 */
export function getDuration(start: Date | string, end?: Date | string): string {
  const startObj = typeof start === 'string' ? new Date(start) : start
  const endObj = end ? (typeof end === 'string' ? new Date(end) : end) : new Date()
  
  return formatDistance(startObj, endObj, { addSuffix: false })
}


