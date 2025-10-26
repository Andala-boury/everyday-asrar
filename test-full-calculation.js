// Direct test - simulate what the component does
import SunCalc from 'suncalc';

const PLANET_INFO = {
  Sun: { name: 'Sun', nameArabic: 'الشمس', element: 'fire', elementArabic: 'نار' },
  Moon: { name: 'Moon', nameArabic: 'القمر', element: 'water', elementArabic: 'ماء' },
  Mars: { name: 'Mars', nameArabic: 'المريخ', element: 'fire', elementArabic: 'نار' },
  Mercury: { name: 'Mercury', nameArabic: 'عطارد', element: 'air', elementArabic: 'هواء' },
  Jupiter: { name: 'Jupiter', nameArabic: 'المشتري', element: 'air', elementArabic: 'هواء' },
  Venus: { name: 'Venus', nameArabic: 'الزهرة', element: 'earth', elementArabic: 'تراب' },
  Saturn: { name: 'Saturn', nameArabic: 'زحل', element: 'earth', elementArabic: 'تراب' }
};

const PLANETARY_SEQUENCES = {
  0: [
    'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn',
    'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury'
  ],
  1: [
    'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun',
    'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter'
  ],
  2: [
    'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon',
    'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus'
  ],
  3: [
    'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars',
    'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn'
  ],
  4: [
    'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury',
    'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun'
  ],
  5: [
    'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter',
    'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'
  ],
  6: [
    'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus',
    'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'
  ]
};

function calculateAccuratePlanetaryHours(date, latitude, longitude) {
  const times = SunCalc.getTimes(date, latitude, longitude);
  let sunrise = times.sunrise;
  let sunset = times.sunset;
  
  if (!sunrise || !sunset || isNaN(sunrise.getTime()) || isNaN(sunset.getTime())) {
    console.warn('Invalid sunrise/sunset times');
    return [];
  }
  
  const now = Date.now();
  
  // If current time is before sunrise, use yesterday's times
  if (now < sunrise.getTime()) {
    console.log('🌙 Current time is before sunrise, using yesterday\'s times...');
    
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTimes = SunCalc.getTimes(yesterday, latitude, longitude);
    
    sunset = yesterdayTimes.sunset;
    sunrise = yesterdayTimes.sunrise;
  }
  
  const dayStart = sunrise.getTime();
  const dayEnd = sunset.getTime();
  const dayDuration = dayEnd - dayStart;
  
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextSunrise = SunCalc.getTimes(nextDay, latitude, longitude).sunrise;
  const nightDuration = nextSunrise.getTime() - dayEnd;
  
  const dayHourLength = dayDuration / 12;
  const nightHourLength = nightDuration / 12;
  
  let dayOfWeek = date.getDay();
  if (now < SunCalc.getTimes(date, latitude, longitude).sunrise?.getTime()) {
    dayOfWeek = new Date(date.getTime() - 24 * 60 * 60 * 1000).getDay();
  }
  const sequence = PLANETARY_SEQUENCES[dayOfWeek];
  
  const hours = [];
  
  // Calculate 12 day hours
  for (let i = 0; i < 12; i++) {
    const startTime = new Date(dayStart + (i * dayHourLength));
    const endTime = new Date(dayStart + ((i + 1) * dayHourLength));
    const planetName = sequence[i];
    const planetInfo = PLANET_INFO[planetName];
    
    if (!planetInfo) continue;
    
    hours.push({
      planet: planetInfo,
      startTime,
      endTime,
      durationMinutes: Math.round(dayHourLength / 60000),
      isDayHour: true
    });
  }
  
  // Calculate 12 night hours
  for (let i = 0; i < 12; i++) {
    const startTime = new Date(dayEnd + (i * nightHourLength));
    const endTime = new Date(dayEnd + ((i + 1) * nightHourLength));
    const planetName = sequence[i + 12];
    const planetInfo = PLANET_INFO[planetName];
    
    if (!planetInfo) continue;
    
    hours.push({
      planet: planetInfo,
      startTime,
      endTime,
      durationMinutes: Math.round(nightHourLength / 60000),
      isDayHour: false
    });
  }
  
  return hours;
}

function getCurrentPlanetaryHour(hours) {
  const now = Date.now();
  const found = hours.find(h => now >= h.startTime.getTime() && now < h.endTime.getTime());
  return found || null;
}

// Test
const now = new Date();
console.log('Testing at:', now.toISOString());

const hours = calculateAccuratePlanetaryHours(now, 21.4225, 39.8262);
console.log('Calculated hours:', hours.length);

const current = getCurrentPlanetaryHour(hours);
if (current) {
  console.log('\n✅ FOUND CURRENT HOUR:');
  console.log('Planet:', current.planet.name, current.planet.nameArabic);
  console.log('Time:', current.startTime.toISOString(), '-', current.endTime.toISOString());
  console.log('Duration:', current.durationMinutes, 'minutes');
  console.log('Type:', current.isDayHour ? '☀️ Day' : '🌙 Night');
} else {
  console.log('\n❌ NO CURRENT HOUR FOUND');
  if (hours.length > 0) {
    console.log('First hour:', hours[0].startTime.toISOString());
    console.log('Last hour:', hours[hours.length - 1].endTime.toISOString());
    console.log('Current time:', new Date(now).toISOString());
  }
}
