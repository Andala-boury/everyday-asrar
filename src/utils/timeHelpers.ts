/**
 * Time-related helper functions for planetary hour calculations
 * Handles edge cases like midnight transitions and recalculation triggers
 */

/**
 * Determines if a full planetary hour recalculation is needed
 * Triggered when:
 * - The calendar date has changed (crossed midnight)
 * - More than 1 hour has passed since last calculation
 * 
 * @param lastCalculation - Timestamp of the last full calculation
 * @returns true if recalculation is needed
 */
export function needsRecalculation(lastCalculation: Date): boolean {
  const now = new Date();
  const last = new Date(lastCalculation);
  
  // Recalculate if date changed (crossed midnight)
  if (now.getDate() !== last.getDate()) {
    return true;
  }
  
  // Recalculate if more than 1 hour passed
  const hoursDiff = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
  if (hoursDiff > 1) {
    return true;
  }
  
  return false;
}

/**
 * Calculates milliseconds remaining until midnight
 * Useful for setting up midnight transition alerts or schedules
 * 
 * @returns Milliseconds until next midnight
 */
export function getTimeUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

/**
 * Gets the current hour of the day (0-23)
 * @returns Hour in 24-hour format
 */
export function getCurrentHourOfDay(): number {
  return new Date().getHours();
}

/**
 * Checks if current time is during daylight hours
 * Simple heuristic: 6 AM to 6 PM
 * 
 * @returns true if between 6:00 and 18:00
 */
export function isDayTime(): boolean {
  const hour = getCurrentHourOfDay();
  return hour >= 6 && hour < 18;
}

/**
 * Formats a time string with proper localization
 * @param date - Date to format
 * @param includeSeconds - Whether to include seconds
 * @returns Localized time string
 */
export function formatTime(date: Date, includeSeconds = false): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: true
  });
}

/**
 * Calculates minutes remaining in an hour
 * @param now - Current date
 * @returns Number of minutes remaining until top of next hour
 */
export function getMinutesRemainingInHour(now: Date = new Date()): number {
  const nextHour = new Date(now);
  nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
  return Math.ceil((nextHour.getTime() - now.getTime()) / (1000 * 60));
}
