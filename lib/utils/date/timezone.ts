/**
 * Convert UTC date to user's local timezone
 * @param utcDate - UTC date string or Date object
 * @returns Date object in local timezone
 */
export function utcToLocal(utcDate: Date | string): Date {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate
  // JavaScript Date objects are already in local timezone when created
  // This function is mainly for clarity and future timezone handling
  return date
}

/**
 * Convert local date to UTC
 * @param localDate - Local date string or Date object
 * @returns Date object in UTC
 */
export function localToUtc(localDate: Date | string): Date {
  const date = typeof localDate === 'string' ? new Date(localDate) : localDate
  // When storing, ensure we're working with UTC
  return new Date(date.toISOString())
}

/**
 * Get user's timezone
 * @returns Timezone string (e.g., "America/New_York")
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}


