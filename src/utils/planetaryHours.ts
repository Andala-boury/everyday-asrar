import SunCalc from 'suncalc';
import { AccuratePlanetaryHour } from '../types/planetary';
import { PLANET_INFO, PLANETARY_SEQUENCES } from '../constants/planets';

export function calculateAccuratePlanetaryHours(
  date: Date,
  latitude: number,
  longitude: number
): AccuratePlanetaryHour[] {
  
  // Get sunrise and sunset for this location and date
  const times = SunCalc.getTimes(date, latitude, longitude);
  const sunrise = times.sunrise;
  const sunset = times.sunset;
  
  // Handle edge cases (polar regions, invalid times)
  if (!sunrise || !sunset || isNaN(sunrise.getTime()) || isNaN(sunset.getTime())) {
    console.warn('Invalid sunrise/sunset times, using fallback');
    return generateFallbackHours(date);
  }
  
  // Calculate day and night durations in milliseconds
  const dayStart = sunrise.getTime();
  const dayEnd = sunset.getTime();
  const dayDuration = dayEnd - dayStart;
  
  // Night starts at sunset and ends at next sunrise
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextSunrise = SunCalc.getTimes(nextDay, latitude, longitude).sunrise;
  const nightDuration = nextSunrise.getTime() - dayEnd;
  
  // Each planetary hour is 1/12 of day or night
  const dayHourLength = dayDuration / 12;
  const nightHourLength = nightDuration / 12;
  
  // Get planetary sequence for this day of week
  const dayOfWeek = date.getDay();
  const sequence = PLANETARY_SEQUENCES[dayOfWeek];
  
  const hours: AccuratePlanetaryHour[] = [];
  const now = Date.now();
  
  // Calculate 12 day hours
  for (let i = 0; i < 12; i++) {
    const startTime = new Date(dayStart + (i * dayHourLength));
    const endTime = new Date(dayStart + ((i + 1) * dayHourLength));
    const planetName = sequence[i];
    
    hours.push({
      planet: PLANET_INFO[planetName],
      startTime,
      endTime,
      durationMinutes: Math.round(dayHourLength / 60000),
      isCurrent: now >= startTime.getTime() && now < endTime.getTime(),
      isDayHour: true
    });
  }
  
  // Calculate 12 night hours
  for (let i = 0; i < 12; i++) {
    const startTime = new Date(dayEnd + (i * nightHourLength));
    const endTime = new Date(dayEnd + ((i + 1) * nightHourLength));
    const planetName = sequence[i + 12];
    
    hours.push({
      planet: PLANET_INFO[planetName],
      startTime,
      endTime,
      durationMinutes: Math.round(nightHourLength / 60000),
      isCurrent: now >= startTime.getTime() && now < endTime.getTime(),
      isDayHour: false
    });
  }
  
  return hours;
}

// Fallback to simplified hours if location/calculation fails
export function generateFallbackHours(date: Date): AccuratePlanetaryHour[] {
  const dayOfWeek = date.getDay();
  const sequence = PLANETARY_SEQUENCES[dayOfWeek];
  const hours: AccuratePlanetaryHour[] = [];
  const now = Date.now();
  
  // Simplified: 60-minute blocks starting at 6 AM
  const startOfDay = new Date(date);
  startOfDay.setHours(6, 0, 0, 0);
  
  for (let i = 0; i < 24; i++) {
    const startTime = new Date(startOfDay.getTime() + (i * 60 * 60 * 1000));
    const endTime = new Date(startOfDay.getTime() + ((i + 1) * 60 * 60 * 1000));
    const planetName = sequence[i];
    
    hours.push({
      planet: PLANET_INFO[planetName],
      startTime,
      endTime,
      durationMinutes: 60,
      isCurrent: now >= startTime.getTime() && now < endTime.getTime(),
      isDayHour: i < 12
    });
  }
  
  return hours;
}

// Get current planetary hour from the array
export function getCurrentPlanetaryHour(
  hours: AccuratePlanetaryHour[]
): AccuratePlanetaryHour | null {
  return hours.find(h => h.isCurrent) || null;
}

// Get next hour with specific element
export function getNextHourWithElement(
  hours: AccuratePlanetaryHour[],
  targetElement: string,
  startIndex: number = 0
): AccuratePlanetaryHour | null {
  for (let i = startIndex; i < hours.length; i++) {
    if (hours[i].planet.element === targetElement) {
      return hours[i];
    }
  }
  return null;
}
