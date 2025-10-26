// Test the full calculation with SunCalc
import SunCalc from 'suncalc';

const now = new Date();
const latitude = 21.4225; // Mecca
const longitude = 39.8262;

console.log('Current time:', now.toISOString());
console.log('Location: Mecca', { latitude, longitude });

const times = SunCalc.getTimes(now, latitude, longitude);
console.log('\nSunrise:', times.sunrise.toISOString());
console.log('Sunset:', times.sunset.toISOString());

const dayStart = times.sunrise.getTime();
const dayEnd = times.sunset.getTime();
const dayDuration = dayEnd - dayStart;

const nextDay = new Date(now);
nextDay.setDate(nextDay.getDate() + 1);
const nextSunrise = SunCalc.getTimes(nextDay, latitude, longitude).sunrise;
const nightDuration = nextSunrise.getTime() - dayEnd;

console.log('\nDay duration (ms):', dayDuration);
console.log('Day duration (hours):', (dayDuration / (60 * 60 * 1000)).toFixed(2));
console.log('Night duration (ms):', nightDuration);
console.log('Night duration (hours):', (nightDuration / (60 * 60 * 1000)).toFixed(2));

const dayHourLength = dayDuration / 12;
const nightHourLength = nightDuration / 12;

console.log('\nDay hour length (minutes):', (dayHourLength / 60000).toFixed(2));
console.log('Night hour length (minutes):', (nightHourLength / 60000).toFixed(2));

// Find which hour we're in
const currentTime = now.getTime();

console.log('\n--- DAY HOURS ---');
for (let i = 0; i < 12; i++) {
  const startTime = dayStart + (i * dayHourLength);
  const endTime = dayStart + ((i + 1) * dayHourLength);
  const isCurrent = currentTime >= startTime && currentTime < endTime;
  console.log(`Hour ${i}: ${new Date(startTime).toLocaleTimeString()} - ${new Date(endTime).toLocaleTimeString()} ${isCurrent ? '← CURRENT' : ''}`);
}

console.log('\n--- NIGHT HOURS ---');
for (let i = 0; i < 12; i++) {
  const startTime = dayEnd + (i * nightHourLength);
  const endTime = dayEnd + ((i + 1) * nightHourLength);
  const isCurrent = currentTime >= startTime && currentTime < endTime;
  console.log(`Hour ${i+12}: ${new Date(startTime).toLocaleTimeString()} - ${new Date(endTime).toLocaleTimeString()} ${isCurrent ? '← CURRENT' : ''}`);
}
