/**
 * ========================================
 * PRAYER TIME CALCULATIONS
 * ========================================
 * 
 * Accurate Islamic prayer time calculations using the Adhan library
 * Based on authentic Islamic astronomical calculations
 * 
 * Features:
 * - 5 obligatory prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
 * - Special times (Tahajjud, Ishraq, Duha)
 * - Current prayer period detection
 * - Time until next prayer
 * - Prayer-planetary hour synergy analysis
 * 
 * Sources:
 * - Islamic Society of North America (ISNA) calculation method
 * - Muslim World League standards
 * - Umm al-Qura University (Makkah) standards
 */

import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from 'adhan';

// ========================================
// TYPES & INTERFACES
// ========================================

export type PrayerName = 
  | 'Fajr' 
  | 'Sunrise' 
  | 'Dhuhr' 
  | 'Asr' 
  | 'Maghrib' 
  | 'Isha'
  | 'Tahajjud'
  | 'Ishraq'
  | 'Duha';

export interface PrayerTimeInfo {
  name: PrayerName;
  time: Date;
  isPassed: boolean;
  isNext: boolean;
  isCurrent: boolean;
  timeUntil?: string; // e.g., "2h 15m"
}

export interface CurrentPrayerPeriod {
  current: PrayerName | 'Between Prayers';
  next: PrayerName;
  nextTime: Date;
  timeUntil: string;
  spiritualGuidance: {
    en: string;
    fr: string;
  };
  planetarySynergy?: string;
}

export interface DailyPrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  // Special times
  tahajjud: Date; // Last third of night
  ishraq: Date; // ~15 min after sunrise
  duha: Date; // Mid-morning
}

// ========================================
// DEFAULT LOCATION (Makkah)
// ========================================

export const DEFAULT_COORDINATES: Coordinates = new Coordinates(
  21.4225, // Latitude (Makkah)
  39.8262  // Longitude (Makkah)
);

// ========================================
// CALCULATION METHOD
// ========================================

// Using Muslim World League as default (widely accepted)
export const DEFAULT_CALCULATION_METHOD = CalculationMethod.MuslimWorldLeague();

// ========================================
// CORE PRAYER TIME CALCULATIONS
// ========================================

/**
 * Calculate all prayer times for a given date and location
 */
export function calculatePrayerTimes(
  date: Date = new Date(),
  coordinates: Coordinates = DEFAULT_COORDINATES,
  calculationMethod = DEFAULT_CALCULATION_METHOD
): DailyPrayerTimes {
  const prayerTimes = new PrayerTimes(coordinates, date, calculationMethod);

  // Calculate special times
  const fajrTime = prayerTimes.fajr;
  const sunriseTime = prayerTimes.sunrise;
  const maghribTime = prayerTimes.maghrib;
  const ishaTime = prayerTimes.isha;

  // Tahajjud: Last third of night (between Isha and Fajr)
  const nightDuration = fajrTime.getTime() - ishaTime.getTime();
  const tahajjudTime = new Date(ishaTime.getTime() + (nightDuration * 2 / 3));

  // Ishraq: ~15 minutes after sunrise
  const ishraqTime = new Date(sunriseTime.getTime() + 15 * 60 * 1000);

  // Duha: Mid-morning (between Ishraq and Dhuhr)
  const duhaTime = new Date(
    sunriseTime.getTime() + 
    (prayerTimes.dhuhr.getTime() - sunriseTime.getTime()) / 2
  );

  return {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha,
    tahajjud: tahajjudTime,
    ishraq: ishraqTime,
    duha: duhaTime,
  };
}

/**
 * Get current prayer period and next prayer
 */
export function getCurrentPrayerPeriod(
  date: Date = new Date(),
  coordinates: Coordinates = DEFAULT_COORDINATES
): CurrentPrayerPeriod {
  const times = calculatePrayerTimes(date, coordinates);
  const now = date.getTime();

  // Determine current period
  let current: PrayerName | 'Between Prayers' = 'Between Prayers';
  let next: PrayerName = 'Fajr';
  let nextTime: Date = times.fajr;

  // Check if in Fajr period (Fajr to Sunrise)
  if (now >= times.fajr.getTime() && now < times.sunrise.getTime()) {
    current = 'Fajr';
    next = 'Dhuhr';
    nextTime = times.dhuhr;
  }
  // Between Sunrise and Dhuhr
  else if (now >= times.sunrise.getTime() && now < times.dhuhr.getTime()) {
    current = 'Between Prayers';
    next = 'Dhuhr';
    nextTime = times.dhuhr;
  }
  // Dhuhr period (Dhuhr to Asr)
  else if (now >= times.dhuhr.getTime() && now < times.asr.getTime()) {
    current = 'Dhuhr';
    next = 'Asr';
    nextTime = times.asr;
  }
  // Asr period (Asr to Maghrib)
  else if (now >= times.asr.getTime() && now < times.maghrib.getTime()) {
    current = 'Asr';
    next = 'Maghrib';
    nextTime = times.maghrib;
  }
  // Maghrib period (Maghrib to Isha)
  else if (now >= times.maghrib.getTime() && now < times.isha.getTime()) {
    current = 'Maghrib';
    next = 'Isha';
    nextTime = times.isha;
  }
  // Isha period (Isha to Fajr next day)
  else if (now >= times.isha.getTime()) {
    current = 'Isha';
    // Calculate next day's Fajr
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = calculatePrayerTimes(tomorrow, coordinates);
    next = 'Fajr';
    nextTime = tomorrowTimes.fajr;
  }
  // Before Fajr (late night/early morning)
  else {
    current = 'Between Prayers';
    next = 'Fajr';
    nextTime = times.fajr;
  }

  const timeUntil = formatTimeUntil(nextTime, date);
  const spiritualGuidance = getPrayerGuidance(current, next);

  return {
    current,
    next,
    nextTime,
    timeUntil,
    spiritualGuidance,
  };
}

/**
 * Get all prayer times with status info
 */
export function getAllPrayerTimesInfo(
  date: Date = new Date(),
  coordinates: Coordinates = DEFAULT_COORDINATES
): PrayerTimeInfo[] {
  const times = calculatePrayerTimes(date, coordinates);
  const currentPeriod = getCurrentPrayerPeriod(date, coordinates);
  const now = date.getTime();

  const prayers: PrayerTimeInfo[] = [
    {
      name: 'Fajr',
      time: times.fajr,
      isPassed: now > times.fajr.getTime(),
      isNext: currentPeriod.next === 'Fajr',
      isCurrent: currentPeriod.current === 'Fajr',
      timeUntil: currentPeriod.next === 'Fajr' ? currentPeriod.timeUntil : undefined,
    },
    {
      name: 'Sunrise',
      time: times.sunrise,
      isPassed: now > times.sunrise.getTime(),
      isNext: false,
      isCurrent: false,
    },
    {
      name: 'Dhuhr',
      time: times.dhuhr,
      isPassed: now > times.dhuhr.getTime(),
      isNext: currentPeriod.next === 'Dhuhr',
      isCurrent: currentPeriod.current === 'Dhuhr',
      timeUntil: currentPeriod.next === 'Dhuhr' ? currentPeriod.timeUntil : undefined,
    },
    {
      name: 'Asr',
      time: times.asr,
      isPassed: now > times.asr.getTime(),
      isNext: currentPeriod.next === 'Asr',
      isCurrent: currentPeriod.current === 'Asr',
      timeUntil: currentPeriod.next === 'Asr' ? currentPeriod.timeUntil : undefined,
    },
    {
      name: 'Maghrib',
      time: times.maghrib,
      isPassed: now > times.maghrib.getTime(),
      isNext: currentPeriod.next === 'Maghrib',
      isCurrent: currentPeriod.current === 'Maghrib',
      timeUntil: currentPeriod.next === 'Maghrib' ? currentPeriod.timeUntil : undefined,
    },
    {
      name: 'Isha',
      time: times.isha,
      isPassed: now > times.isha.getTime(),
      isNext: currentPeriod.next === 'Isha',
      isCurrent: currentPeriod.current === 'Isha',
      timeUntil: currentPeriod.next === 'Isha' ? currentPeriod.timeUntil : undefined,
    },
  ];

  return prayers;
}

// ========================================
// SPIRITUAL GUIDANCE
// ========================================

/**
 * Get spiritual guidance for each prayer period
 */
function getPrayerGuidance(
  current: PrayerName | 'Between Prayers',
  next: PrayerName
): { en: string; fr: string } {
  const guidance: Record<string, { en: string; fr: string }> = {
    'Fajr': {
      en: 'Time of divine closeness. The Prophet ﷺ said: "The two rak\'ahs of Fajr are better than this world and all it contains." Seek clarity and guidance.',
      fr: 'Temps de proximité divine. Le Prophète ﷺ a dit : "Les deux rak\'ahs de Fajr valent mieux que ce monde et tout ce qu\'il contient." Cherchez clarté et guidance.',
    },
    'Dhuhr': {
      en: 'Midday renewal. Break from worldly affairs to reconnect with the Divine. Time for gratitude and seeking provision.',
      fr: 'Renouveau de midi. Pause des affaires mondaines pour se reconnecter au Divin. Temps de gratitude et de recherche de subsistance.',
    },
    'Asr': {
      en: 'Time of reflection. The Prophet ﷺ emphasized this prayer greatly. Review your day and prepare for evening with mindfulness.',
      fr: 'Temps de réflexion. Le Prophète ﷺ a grandement souligné cette prière. Révisez votre journée et préparez la soirée avec pleine conscience.',
    },
    'Maghrib': {
      en: 'Transition from light to darkness. Time to seek forgiveness and make du\'a. The Prophet ﷺ said du\'a is accepted at this time.',
      fr: 'Transition de la lumière à l\'obscurité. Temps de chercher le pardon et faire du\'a. Le Prophète ﷺ a dit que les invocations sont acceptées à ce moment.',
    },
    'Isha': {
      en: 'Night\'s serenity. Time for deep reflection and contemplation. The last prayer before sleep - end your day in remembrance.',
      fr: 'Sérénité de la nuit. Temps de réflexion profonde et contemplation. La dernière prière avant le sommeil - terminez votre journée dans le rappel.',
    },
    'Between Prayers': {
      en: 'Use this time for good deeds, seeking knowledge, or helping others. Every moment is an opportunity for spiritual growth.',
      fr: 'Utilisez ce temps pour les bonnes actions, chercher la connaissance, ou aider les autres. Chaque moment est une opportunité de croissance spirituelle.',
    },
  };

  return guidance[current] || guidance['Between Prayers'];
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Format time until next prayer
 */
function formatTimeUntil(futureDate: Date, currentDate: Date): string {
  const diff = futureDate.getTime() - currentDate.getTime();
  
  if (diff <= 0) return '0m';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Format prayer time for display (12-hour format)
 */
export function formatPrayerTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format prayer time for display (24-hour format)
 */
export function formatPrayerTime24(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Get prayer time emoji
 */
export function getPrayerEmoji(prayerName: PrayerName): string {
  const emojis: Record<PrayerName, string> = {
    'Fajr': '🌅',
    'Sunrise': '☀️',
    'Dhuhr': '🌞',
    'Asr': '🌤️',
    'Maghrib': '🌆',
    'Isha': '🌙',
    'Tahajjud': '✨',
    'Ishraq': '🌄',
    'Duha': '☀️',
  };
  return emojis[prayerName] || '🕌';
}

/**
 * Get prayer-planetary hour synergy analysis
 */
export function getPrayerPlanetarySynergy(
  prayerName: PrayerName,
  planetaryHourPlanet: string
): {
  synergy: 'high' | 'medium' | 'low';
  explanation: { en: string; fr: string };
} {
  // Classical Islamic-astrological correspondences
  const prayerPlanets: Record<string, string[]> = {
    'Fajr': ['Venus', 'Jupiter'], // Beauty, expansion, spiritual opening
    'Dhuhr': ['Sun'], // Peak solar energy
    'Asr': ['Mercury'], // Reflection, communication
    'Maghrib': ['Moon', 'Venus'], // Transition, beauty, mercy
    'Isha': ['Saturn', 'Moon'], // Contemplation, night
  };

  const associatedPlanets = prayerPlanets[prayerName] || [];
  const hasSynergy = associatedPlanets.includes(planetaryHourPlanet);

  if (hasSynergy) {
    return {
      synergy: 'high',
      explanation: {
        en: `Excellent alignment! ${prayerName} prayer resonates with ${planetaryHourPlanet} energy. This is an optimal time for spiritual work.`,
        fr: `Excellent alignement ! La prière de ${prayerName} résonne avec l'énergie de ${planetaryHourPlanet}. C'est un moment optimal pour le travail spirituel.`,
      },
    };
  }

  return {
    synergy: 'medium',
    explanation: {
      en: `Prayer time adds spiritual dimension to the ${planetaryHourPlanet} hour. Combine worldly action with remembrance.`,
      fr: `Le temps de prière ajoute une dimension spirituelle à l'heure de ${planetaryHourPlanet}. Combinez action mondaine et rappel.`,
    },
  };
}

/**
 * Check if current time is a special prayer time (Tahajjud, Duha, Ishraq)
 */
export function getSpecialPrayerTime(
  date: Date = new Date(),
  coordinates: Coordinates = DEFAULT_COORDINATES
): { name: PrayerName; guidance: { en: string; fr: string } } | null {
  const times = calculatePrayerTimes(date, coordinates);
  const now = date.getTime();

  // Check Tahajjud (last third of night)
  const tahajjudStart = times.tahajjud.getTime();
  const tahajjudEnd = times.fajr.getTime();
  if (now >= tahajjudStart && now < tahajjudEnd) {
    return {
      name: 'Tahajjud',
      guidance: {
        en: 'The blessed time of Tahajjud! Allah descends to the lowest heaven asking "Who is calling upon Me?" Optimal for deep du\'a and spiritual connection.',
        fr: 'Le temps béni du Tahajjud ! Allah descend au ciel le plus bas en demandant "Qui M\'invoque ?" Optimal pour du\'a profond et connexion spirituelle.',
      },
    };
  }

  // Check Ishraq (15 min after sunrise)
  const ishraqStart = times.sunrise.getTime();
  const ishraqEnd = times.ishraq.getTime() + 30 * 60 * 1000; // +30 min window
  if (now >= ishraqStart && now < ishraqEnd) {
    return {
      name: 'Ishraq',
      guidance: {
        en: 'Ishraq time! The Prophet ﷺ said this prayer has immense reward. Time of new beginnings and fresh starts.',
        fr: 'Temps d\'Ishraq ! Le Prophète ﷺ a dit que cette prière a une récompense immense. Temps de nouveaux commencements et départs frais.',
      },
    };
  }

  // Check Duha (mid-morning)
  const duhaStart = times.ishraq.getTime() + 30 * 60 * 1000;
  const duhaEnd = times.dhuhr.getTime() - 30 * 60 * 1000;
  if (now >= duhaStart && now < duhaEnd) {
    return {
      name: 'Duha',
      guidance: {
        en: 'Duha prayer time! A Sunnah practice that brings barakah. The Prophet ﷺ called it "the prayer of the penitent."',
        fr: 'Temps de la prière Duha ! Une pratique Sunnah qui apporte la barakah. Le Prophète ﷺ l\'appelait "la prière des repentants."',
      },
    };
  }

  return null;
}
