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
  let sunrise = times.sunrise;
  let sunset = times.sunset;
  
  console.log('Initial SunCalc times:', { sunrise: sunrise?.toISOString(), sunset: sunset?.toISOString(), latitude, longitude });
  
  // Handle edge cases (polar regions, invalid times)
  if (!sunrise || !sunset || isNaN(sunrise.getTime()) || isNaN(sunset.getTime())) {
    console.warn('Invalid sunrise/sunset times, using fallback');
    return generateFallbackHours(date);
  }
  
  const now = Date.now();
  
  // If current time is before sunrise, use yesterday's sunrise/sunset for night hours
  // and today's sunrise for day hours boundary
  if (now < sunrise.getTime()) {
    console.log('Current time is before sunrise, adjusting calculations...');
    
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTimes = SunCalc.getTimes(yesterday, latitude, longitude);
    
    // Shift everything: yesterday's sunset to yesterday's next sunrise (which is today's sunrise)
    sunset = yesterdayTimes.sunset;
    // Get yesterday's sunrise
    sunrise = yesterdayTimes.sunrise;
    
    console.log('Adjusted times (using yesterday):', { sunrise: sunrise?.toISOString(), sunset: sunset?.toISOString() });
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
  
  console.log('Day/Night durations:', { dayDuration, nightDuration });
  
  // Each planetary hour is 1/12 of day or night
  const dayHourLength = dayDuration / 12;
  const nightHourLength = nightDuration / 12;
  
  // Get planetary sequence for this day of week
  // If we're in night hours before dawn, use yesterday's day of week
  let dayOfWeek = date.getDay();
  if (now < SunCalc.getTimes(date, latitude, longitude).sunrise?.getTime()) {
    dayOfWeek = new Date(date.getTime() - 24 * 60 * 60 * 1000).getDay();
  }
  const sequence = PLANETARY_SEQUENCES[dayOfWeek];
  
  console.log('Day of week:', dayOfWeek, 'Sequence length:', sequence.length);
  
  const hours: AccuratePlanetaryHour[] = [];
  
  // Calculate 12 day hours
  for (let i = 0; i < 12; i++) {
    const startTime = new Date(dayStart + (i * dayHourLength));
    const endTime = new Date(dayStart + ((i + 1) * dayHourLength));
    const planetName = sequence[i];
    const planetInfo = PLANET_INFO[planetName];
    
    if (!planetInfo) {
      console.warn(`Invalid planet name at day index ${i}: ${planetName}`);
      continue;
    }
    
    hours.push({
      planet: planetInfo,
      startTime,
      endTime,
      durationMinutes: Math.round(dayHourLength / 60000),
      isCurrent: false, // Will be set by getCurrentPlanetaryHour
      isDayHour: true
    });
  }
  
  // Calculate 12 night hours
  for (let i = 0; i < 12; i++) {
    const startTime = new Date(dayEnd + (i * nightHourLength));
    const endTime = new Date(dayEnd + ((i + 1) * nightHourLength));
    const planetName = sequence[i + 12];
    const planetInfo = PLANET_INFO[planetName];
    
    if (!planetInfo) {
      console.warn(`Invalid planet name at night index ${i + 12}: ${planetName}`);
      continue;
    }
    
    hours.push({
      planet: planetInfo,
      startTime,
      endTime,
      durationMinutes: Math.round(nightHourLength / 60000),
      isCurrent: false, // Will be set by getCurrentPlanetaryHour
      isDayHour: false
    });
  }
  
  console.log('Calculated hours count:', hours.length);
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
    
    // Safely access the sequence, wrapping around if necessary
    const planetName = sequence[i % sequence.length] || 'Sun';
    
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
  const now = Date.now();
  console.log('Looking for current hour at time:', now, new Date(now).toISOString());
  console.log('Available hours:', hours.length);
  
  if (hours.length === 0) {
    console.warn('No hours calculated');
    return null;
  }
  
  const found = hours.find(h => {
    const isInRange = now >= h.startTime.getTime() && now < h.endTime.getTime();
    if (isInRange) {
      console.log('Found current hour:', h.planet.name, h.startTime.toISOString(), '-', h.endTime.toISOString());
    }
    return isInRange;
  });
  
  if (!found) {
    console.warn('No current hour found. Time range check:');
    if (hours.length > 0) {
      console.log('First hour:', hours[0].startTime.toISOString(), '-', hours[0].endTime.toISOString());
      console.log('Last hour:', hours[hours.length - 1].startTime.toISOString(), '-', hours[hours.length - 1].endTime.toISOString());
      console.log('Current time vs first:', now, 'vs', hours[0].startTime.getTime());
      console.log('Current time vs last:', now, 'vs', hours[hours.length - 1].endTime.getTime());
    }
  } else {
    // Mark this hour as current
    found.isCurrent = true;
  }
  
  return found || null;
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
