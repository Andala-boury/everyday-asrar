/**
 * ʿIlm al-Ḥurūf (Science of Letters) - Core Calculations
 * Based on the tradition of Imam al-Būnī and classical masters
 */

import { digitalRoot, hadathRemainder } from '../../components/hadad-summary/hadad-core';
import { ABJAD_MAGHRIBI } from '../../contexts/AbjadContext';
import { computeQuranResonance, type QuranResonance } from './quranResonance';

// ============================================================================
// CLASSICAL LETTER SCIENCE - Al-Būnī's Methodology
// ============================================================================

/**
 * The Four Natures (Ṭabāʾiʿ) - Fundamental qualities of existence
 */
export type Nature = 'Hot' | 'Cold' | 'Wet' | 'Dry';

/**
 * Letter classification by nature (from Shams al-Maʿārif)
 */
export const LETTER_NATURES: Record<string, Nature[]> = {
  // Fire letters (Hot & Dry)
  'ا': ['Hot', 'Dry'],
  'ه': ['Hot', 'Dry'],
  'ط': ['Hot', 'Dry'],
  'م': ['Hot', 'Dry'],
  'ف': ['Hot', 'Dry'],
  'ش': ['Hot', 'Dry'],
  'ذ': ['Hot', 'Dry'],
  
  // Air letters (Hot & Wet)
  'ب': ['Hot', 'Wet'],
  'و': ['Hot', 'Wet'],
  'ي': ['Hot', 'Wet'],
  'ن': ['Hot', 'Wet'],
  'ض': ['Hot', 'Wet'],
  'ظ': ['Hot', 'Wet'],
  'غ': ['Hot', 'Wet'],
  
  // Water letters (Cold & Wet)
  'ج': ['Cold', 'Wet'],
  'ز': ['Cold', 'Wet'],
  'ك': ['Cold', 'Wet'],
  'س': ['Cold', 'Wet'],
  'ق': ['Cold', 'Wet'],
  'ث': ['Cold', 'Wet'],
  'خ': ['Cold', 'Wet'],
  
  // Earth letters (Cold & Dry)
  'د': ['Cold', 'Dry'],
  'ح': ['Cold', 'Dry'],
  'ل': ['Cold', 'Dry'],
  'ع': ['Cold', 'Dry'],
  'ر': ['Cold', 'Dry'],
  'ص': ['Cold', 'Dry'],
  'ت': ['Cold', 'Dry']
};

/**
 * Planetary rulership of letters (classical tradition)
 */
export type Planet = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn';

export const LETTER_PLANETS: Record<string, Planet> = {
  // Sun (Leadership, Authority)
  'ا': 'Sun', 'ط': 'Sun', 'ظ': 'Sun', 'غ': 'Sun',
  
  // Moon (Emotion, Intuition)
  'ب': 'Moon', 'ي': 'Moon', 'ر': 'Moon',
  
  // Mercury (Communication, Learning)
  'ج': 'Mercury', 'ك': 'Mercury', 'س': 'Mercury',
  
  // Venus (Beauty, Harmony)
  'د': 'Venus', 'ل': 'Venus', 'ش': 'Venus',
  
  // Mars (Action, Energy)
  'ه': 'Mars', 'م': 'Mars', 'ت': 'Mars',
  
  // Jupiter (Expansion, Wisdom)
  'و': 'Jupiter', 'ن': 'Jupiter', 'ث': 'Jupiter',
  
  // Saturn (Structure, Discipline)
  'ز': 'Saturn', 'ع': 'Saturn', 'ف': 'Saturn', 'ص': 'Saturn', 'ق': 'Saturn', 'ض': 'Saturn', 'خ': 'Saturn', 'ذ': 'Saturn', 'ح': 'Saturn'
};

/**
 * Days of the week ruled by planets
 */
export const PLANET_DAYS: Record<Planet, string[]> = {
  'Sun': ['Sunday', 'الأحد'],
  'Moon': ['Monday', 'الاثنين'],
  'Mars': ['Tuesday', 'الثلاثاء'],
  'Mercury': ['Wednesday', 'الأربعاء'],
  'Jupiter': ['Thursday', 'الخميس'],
  'Venus': ['Friday', 'الجمعة'],
  'Saturn': ['Saturday', 'السبت']
};

/**
 * Planetary hours (each day has 12 daylight and 12 night hours)
 * The first hour of each day is ruled by the day's planet
 */
export const PLANETARY_HOURS_ORDER: Planet[] = [
  'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'
];

/**
 * Zodiacal classification of letters (12 signs)
 */
export type ZodiacSign = 
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' 
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' 
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

/**
 * The spiritual stations (Maqāmāt) associated with numbers 1-9
 */
export const SPIRITUAL_STATIONS = {
  1: {
    name: 'Tawḥīd',
    arabic: 'التوحيد',
    meaning: 'Divine Unity',
    quality: 'Leadership, Independence, Originality',
    shadow: 'Pride, Isolation, Rigidity',
    practice: 'Meditate on divine oneness. Reflect: "All power belongs to the One."',
    verse: 'Say: He is Allah, the One (112:1)',
    practical: 'Start new projects, take initiative, practice self-reliance. Best for solo work.'
  },
  2: {
    name: 'Muʿāwana',
    arabic: 'المعاونة',
    meaning: 'Divine Assistance',
    quality: 'Cooperation, Balance, Diplomacy',
    shadow: 'Indecision, Dependency, Conflict-avoidance',
    practice: 'Seek harmony in relationships. Reflect: "Two are better than one."',
    verse: 'Help one another in righteousness (5:2)',
    practical: 'Build partnerships, mediate conflicts, create balance. Good for teamwork.'
  },
  3: {
    name: 'Ibdāʿ',
    arabic: 'الإبداع',
    meaning: 'Creative Expression',
    quality: 'Creativity, Communication, Joy',
    shadow: 'Scattered energy, Superficiality, Gossip',
    practice: 'Express divine inspiration. Reflect: "Beauty manifests through me."',
    verse: 'Read in the name of your Lord who created (96:1)',
    practical: 'Create art, write, speak publicly, teach. Channel creative energy.'
  },
  4: {
    name: 'Istiqrār',
    arabic: 'الاستقرار',
    meaning: 'Stability',
    quality: 'Foundation, Order, Discipline',
    shadow: 'Rigidity, Limitation, Stubbornness',
    practice: 'Build strong foundations. Reflect: "Patience is the key to paradise."',
    verse: 'Allah loves those who are firm and steadfast (61:4)',
    practical: 'Organize, plan, build systems, establish routines. Create structure.'
  },
  5: {
    name: 'Taḥawwul',
    arabic: 'التحول',
    meaning: 'Transformation',
    quality: 'Freedom, Adventure, Change',
    shadow: 'Restlessness, Irresponsibility, Addiction',
    practice: 'Embrace sacred change. Reflect: "Everything changes except the Face of God."',
    verse: 'Allah will not change the condition of a people until they change themselves (13:11)',
    practical: 'Travel, learn new skills, adapt to change. Seek variety and experience.'
  },
  6: {
    name: 'Khidma',
    arabic: 'الخدمة',
    meaning: 'Service',
    quality: 'Responsibility, Nurturing, Harmony',
    shadow: 'Martyrdom, Interference, Perfectionism',
    practice: 'Serve with love. Reflect: "The best of people are those who benefit others."',
    verse: 'The best among you are those who feed others (Ahmad)',
    practical: 'Help family, heal others, create beauty. Focus on home and community.'
  },
  7: {
    name: 'Ḥikma',
    arabic: 'الحكمة',
    meaning: 'Divine Wisdom',
    quality: 'Analysis, Introspection, Spirituality',
    shadow: 'Isolation, Cynicism, Overthinking',
    practice: 'Seek inner knowledge. Reflect: "Know thyself to know thy Lord."',
    verse: 'He gives wisdom to whom He wills (2:269)',
    practical: 'Study, research, meditate, retreat. Deepen spiritual practice.'
  },
  8: {
    name: 'Qudra',
    arabic: 'القدرة',
    meaning: 'Divine Power',
    quality: 'Abundance, Authority, Achievement',
    shadow: 'Greed, Domination, Materialism',
    practice: 'Steward divine abundance. Reflect: "I am a channel for divine provision."',
    verse: 'Whatever you spend, He will replace it (34:39)',
    practical: 'Manage resources, lead organizations, create wealth. Build influence.'
  },
  9: {
    name: 'Kamāl',
    arabic: 'الكمال',
    meaning: 'Completion',
    quality: 'Compassion, Wisdom, Universal Love',
    shadow: 'Martyrdom, Emotional manipulation, Escapism',
    practice: 'Serve humanity. Reflect: "I release with love and trust."',
    verse: 'This day I have perfected your religion for you (5:3)',
    practical: 'Complete projects, forgive, let go. Teach and mentor others.'
  }
};

/**
 * Life path guidance based on birth date calculation
 */
export function calculateLifePath(birthDate: Date): {
  number: number;
  station: typeof SPIRITUAL_STATIONS[keyof typeof SPIRITUAL_STATIONS];
  interpretation: string;
} {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  
  const sum = day + month + year;
  let lifePath = digitalRoot(sum);
  
  // Ensure lifePath is between 1-9
  if (lifePath < 1 || lifePath > 9) {
    lifePath = ((lifePath - 1) % 9) + 1;
  }
  
  const station = SPIRITUAL_STATIONS[lifePath as keyof typeof SPIRITUAL_STATIONS];
  
  return {
    number: lifePath,
    station: station,
    interpretation: `Your soul's journey is through the station of ${station?.name || 'Unknown'}`
  };
}

/**
 * Name destiny - What your name reveals about your life purpose
 */
export function analyzeNameDestiny(name: string, abjad: Record<string, number> = ABJAD_MAGHRIBI) {
  const normalized = name.replace(/[ًٌٍَُِّْ]/g, '').replace(/\s+/g, '');
  const letters = [...normalized];
  
  // Safety check - ensure we have valid input
  if (letters.length === 0) {
    throw new Error('Name cannot be empty');
  }
  
  // Kabīr (sum of all letters)
  const kabir = letters.reduce((sum, ch) => sum + (abjad[ch] || 0), 0);
  
  // Ṣaghīr (digital root)
  const saghir = digitalRoot(kabir);
  
  // Ḥadath (remainder ÷ 12)
  const hadath = hadathRemainder(kabir);
  
  // Soul urge (vowels only)
  const vowels = letters.filter(ch => 'اوي'.includes(ch));
  const soulUrge = digitalRoot(vowels.reduce((sum, ch) => sum + (abjad[ch] || 0), 0));
  
  // Personality (consonants only)
  const consonants = letters.filter(ch => !'اوي'.includes(ch));
  const personality = digitalRoot(consonants.reduce((sum, ch) => sum + (abjad[ch] || 0), 0));
  
  // Ensure values are within valid range (1-9)
  const validSaghir = saghir || 9;
  const validSoulUrge = soulUrge || 9;
  const validPersonality = personality || 9;
  
  // Compute Qur'anic Resonance from Kabīr (Hadad)
  const quranResonance = computeQuranResonance(kabir);
  console.log('✨ analyzeNameDestiny - Kabir:', kabir, 'QuranResonance:', quranResonance);
  
  return {
    kabir,
    saghir: validSaghir,
    hadath,
    soulUrgeNumber: validSoulUrge,
    personalityNumber: validPersonality,
    destiny: SPIRITUAL_STATIONS[validSaghir as keyof typeof SPIRITUAL_STATIONS],
    soulUrge: SPIRITUAL_STATIONS[validSoulUrge as keyof typeof SPIRITUAL_STATIONS],
    personality: SPIRITUAL_STATIONS[validPersonality as keyof typeof SPIRITUAL_STATIONS],
    interpretation: generateDestinyInterpretation(validSaghir, validSoulUrge, validPersonality),
    quranResonance
  };
}

function generateDestinyInterpretation(destiny: number, soul: number, personality: number): string {
  const d = SPIRITUAL_STATIONS[destiny as keyof typeof SPIRITUAL_STATIONS];
  const s = SPIRITUAL_STATIONS[soul as keyof typeof SPIRITUAL_STATIONS];
  const p = SPIRITUAL_STATIONS[personality as keyof typeof SPIRITUAL_STATIONS];
  
  return `Your life destiny (${d.name}) calls you to ${d.quality.toLowerCase()}. ` +
    `Your soul deeply yearns for ${s.quality.toLowerCase()}, ` +
    `while outwardly you express ${p.quality.toLowerCase()}. ` +
    `Integration comes when you align all three dimensions.`;
}

/**
 * Compatibility analysis between two souls
 */
export function analyzeCompatibility(name1: string, name2: string, abjad: Record<string, number> = ABJAD_MAGHRIBI) {
  const person1 = analyzeNameDestiny(name1, abjad);
  const person2 = analyzeNameDestiny(name2, abjad);
  
  const destinyDiff = Math.abs(person1.saghir - person2.saghir);
  const soulDiff = Math.abs(person1.soulUrgeNumber - person2.soulUrgeNumber);
  
  // Calculate harmony score (0-100)
  let harmonyScore = 100;
  
  // Destiny compatibility
  if (destinyDiff === 0) harmonyScore += 20; // Perfect match
  else if (destinyDiff <= 2) harmonyScore += 10; // Complementary
  else if (destinyDiff >= 4) harmonyScore -= 10; // Challenging
  
  // Soul urge compatibility
  if (soulDiff === 0) harmonyScore += 15;
  else if (soulDiff <= 2) harmonyScore += 5;
  
  // Specific number combinations
  const combo = `${person1.saghir}-${person2.saghir}`;
  const specialPairs: Record<string, { type: string; bonus: number; note: string }> = {
    '1-2': { type: 'Leader & Supporter', bonus: 15, note: 'Natural partnership' },
    '3-5': { type: 'Creative & Adventurous', bonus: 10, note: 'Exciting but unstable' },
    '4-8': { type: 'Builder & Achiever', bonus: 20, note: 'Material success together' },
    '6-9': { type: 'Nurturer & Healer', bonus: 15, note: 'Compassionate union' },
    '7-7': { type: 'Twin Mystics', bonus: 10, note: 'Deep understanding, may isolate' }
  };
  
  const pair = specialPairs[combo] || specialPairs[`${person2.saghir}-${person1.saghir}`];
  if (pair) harmonyScore += pair.bonus;
  
  return {
    person1,
    person2,
    harmonyScore: Math.min(100, Math.max(0, harmonyScore)),
    relationship: pair?.type || 'Unique Dynamic',
    strengths: generateCompatibilityStrengths(person1.saghir, person2.saghir),
    challenges: generateCompatibilityChallenges(person1.saghir, person2.saghir),
    advice: pair?.note || 'Each relationship teaches unique lessons'
  };
}

function generateCompatibilityStrengths(n1: number, n2: number): string[] {
  const strengths: string[] = [];
  
  if (n1 === n2) {
    strengths.push('Deep mutual understanding');
    strengths.push('Shared values and goals');
  }
  
  if (Math.abs(n1 - n2) === 1) {
    strengths.push('Natural progression and growth together');
    strengths.push('Complementary energies');
  }
  
  if ((n1 + n2) === 10) {
    strengths.push('Complete cycle together');
    strengths.push('Wholeness through union');
  }
  
  return strengths.length > 0 ? strengths : ['Opportunity for growth', 'Learning through differences'];
}

function generateCompatibilityChallenges(n1: number, n2: number): string[] {
  const challenges: string[] = [];
  
  if (n1 === n2) {
    challenges.push('May mirror each other\'s shadows');
    challenges.push('Need external perspectives');
  }
  
  if (Math.abs(n1 - n2) >= 5) {
    challenges.push('Very different life approaches');
    challenges.push('Requires conscious effort to harmonize');
  }
  
  return challenges.length > 0 ? challenges : ['Balance individuality with togetherness'];
}

/**
 * Favorable timing based on planetary hours
 */
export function calculatePlanetaryHour(date: Date): {
  planet: Planet;
  quality: string;
  favorable: string[];
  avoid: string[];
} {
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const planetOrder: Planet[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const dayPlanet = planetOrder[dayOfWeek];
  
  const hour = date.getHours();
  const isDaytime = hour >= 6 && hour < 18;
  
  // Calculate planetary hour (simplified)
  const hoursSinceDawn = isDaytime ? hour - 6 : hour + 6;
  const planetIndex = (planetOrder.indexOf(dayPlanet) + hoursSinceDawn) % 7;
  const currentPlanet = PLANETARY_HOURS_ORDER[planetIndex];
  
  const qualities: Record<Planet, { quality: string; favorable: string[]; avoid: string[] }> = {
    'Sun': {
      quality: 'Leadership, Authority, Success',
      favorable: ['Start new ventures', 'Seek promotions', 'Public speaking', 'Creative projects'],
      avoid: ['Ego-driven decisions', 'Confrontations with authority']
    },
    'Moon': {
      quality: 'Emotion, Intuition, Home',
      favorable: ['Family matters', 'Emotional healing', 'Dream work', 'Nurturing activities'],
      avoid: ['Important decisions (emotions may cloud judgment)', 'Legal matters']
    },
    'Mercury': {
      quality: 'Communication, Learning, Commerce',
      favorable: ['Study', 'Writing', 'Business deals', 'Social networking', 'Short travel'],
      avoid: ['Signing contracts if Mercury retrograde', 'Gossip']
    },
    'Venus': {
      quality: 'Love, Beauty, Harmony',
      favorable: ['Romance', 'Art', 'Socializing', 'Beautification', 'Peace-making'],
      avoid: ['Harsh criticism', 'Conflict']
    },
    'Mars': {
      quality: 'Action, Courage, Competition',
      favorable: ['Physical exercise', 'Assertive action', 'Courage needed', 'Surgery'],
      avoid: ['Anger', 'Rash decisions', 'Starting fights']
    },
    'Jupiter': {
      quality: 'Expansion, Wisdom, Abundance',
      favorable: ['Legal matters', 'Education', 'Spiritual practice', 'Long-term planning', 'Generosity'],
      avoid: ['Excess', 'Overconfidence']
    },
    'Saturn': {
      quality: 'Structure, Discipline, Karma',
      favorable: ['Hard work', 'Long-term commitments', 'Dealing with authorities', 'Property matters'],
      avoid: ['Fun activities', 'Quick results expectations']
    }
  };
  
  return {
    planet: currentPlanet,
    ...qualities[currentPlanet]
  };
}

/**
 * Personal year cycle (1-9 repeating)
 */
export function calculatePersonalYear(birthDate: Date, currentYear: number) {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  const sum = day + month + currentYear;
  const personalYear = digitalRoot(sum);
  
  return {
    year: personalYear,
    station: SPIRITUAL_STATIONS[personalYear as keyof typeof SPIRITUAL_STATIONS],
    theme: getYearTheme(personalYear)
  };
}

function getYearTheme(year: number): string {
  const themes: Record<number, string> = {
    1: 'New beginnings, planting seeds, independence',
    2: 'Partnerships, patience, cooperation',
    3: 'Creative expression, joy, social expansion',
    4: 'Building foundations, hard work, stability',
    5: 'Change, freedom, adventure, unexpected events',
    6: 'Responsibility, service, family matters, love',
    7: 'Spiritual growth, introspection, study, rest',
    8: 'Achievement, power, financial matters, recognition',
    9: 'Completion, release, humanitarianism, endings leading to new beginnings'
  };
  
  return themes[year] || 'Transition';
}

/**
 * Daily dhikr recommendation based on hadath element
 */
export function getDailyDhikr(hadath: number): {
  dhikr: string;
  arabic: string;
  count: number;
  time: string;
  benefit: string;
} {
  const element = hadathToElement(hadath);
  
  const recommendations = {
    Fire: {
      dhikr: 'Yā Qawiyy (O Mighty One)',
      arabic: 'يَا قَوِيّ',
      count: 116,
      time: 'After Fajr',
      benefit: 'Strengthens willpower and courage'
    },
    Water: {
      dhikr: 'Yā Laṭīf (O Subtle One)',
      arabic: 'يَا لَطِيف',
      count: 129,
      time: 'After Maghrib',
      benefit: 'Brings ease in difficulties, softens hearts'
    },
    Air: {
      dhikr: 'Yā ʿAlīm (O All-Knowing)',
      arabic: 'يَا عَلِيم',
      count: 150,
      time: 'After ʿIshā',
      benefit: 'Increases knowledge and clarity'
    },
    Earth: {
      dhikr: 'Yā Ṣabūr (O Patient One)',
      arabic: 'يَا صَبُور',
      count: 298,
      time: 'Before sleep',
      benefit: 'Grants patience and steadfastness'
    }
  };
  
  return recommendations[element] || recommendations.Earth;
}

function hadathToElement(hadath: number): 'Fire' | 'Water' | 'Air' | 'Earth' {
  if (hadath >= 1 && hadath <= 3) return 'Fire';
  if (hadath >= 4 && hadath <= 6) return 'Water';
  if (hadath >= 7 && hadath <= 9) return 'Air';
  return 'Earth';
}

// ============================================================================
// WEEKLY CALENDAR & DAILY GUIDANCE - Practical Life Timing
// ============================================================================

export type ElementType = 'Fire' | 'Water' | 'Air' | 'Earth';
export type HarmonyType = 'Complete' | 'Partial' | 'Conflict';
export type DominantForce = 'Rūḥ' | 'Element' | 'Kawkab';
export type RuhPhaseGroup = 'Begin' | 'Build' | 'Complete';

/**
 * User Profile from name and birth date
 */
export interface UserProfile {
  name_ar: string;
  kabir: number;
  saghir: number; // Rūḥ number (1-9)
  ruh: number;
  element: ElementType;
  kawkab: Planet;
  letter_geometry: string[];
  anchor: string; // ISO date string
}

/**
 * Daily reading with practical tips
 */
export interface DailyReading {
  date: string; // ISO date
  weekday: string;
  day_planet: Planet;
  ruh_phase: number; // 1-9
  ruh_phase_group: RuhPhaseGroup;
  element_phase: ElementType;
  harmony_score: number; // 0-10
  band: 'High' | 'Moderate' | 'Low';
  tips: string[];
  // Rest Signal (Infisāl) fields
  isRestDay?: boolean; // True if harmony ≤ 4
  restLevel?: 'gentle' | 'deep'; // Deep if ≤ 1, gentle if 2-4
  restPractices?: string[]; // Specific rest practices
  betterDays?: string[]; // Suggest better days for rescheduling
  // Energy Return (Irtiṭāb) - Lesson 25
  energyReturn: {
    speed: 'instant' | 'quick' | 'gradual' | 'delayed';
    timeframe: string; // "same day", "few hours", "2-3 days", "1-2 weeks"
    description: string; // User-friendly explanation
    practice: string; // Actionable suggestion
  };
  // Task Sequencer (Niẓām) - Lesson 28
  taskSequence?: TaskSequence;
}

/**
 * Task Sequencer interfaces for optimal timing throughout the day
 */
export interface TaskSequence {
  morning: TaskWindow;
  midday: TaskWindow;
  afternoon: TaskWindow;
  evening: TaskWindow;
}

export interface TaskWindow {
  timeRange: string;        // "7-9 AM"
  energyType: string;        // "Peak clarity", "Social energy", etc.
  bestFor: string[];         // ["Important decisions", "Creative work"]
  avoid: string[];           // ["Routine tasks", "Interruptions"]
  planetalPhase?: string;    // "Jupiter hour begins"
}

/**
 * Weekly summary with badges
 */
export interface WeeklySummary {
  days: DailyReading[];
  best_day: string; // Date of highest score
  gentle_day: string; // Date of lowest score
  focus_day: string; // Good for concentration (Saturn/Mercury)
}

/**
 * Planet support/opposition for elements
 */
const PLANET_ELEMENT_SUPPORT: Record<ElementType, { supportive: Planet[]; opposing: Planet[] }> = {
  Fire: { 
    supportive: ['Sun', 'Mars', 'Jupiter'], 
    opposing: ['Moon'] 
  },
  Water: { 
    supportive: ['Moon', 'Venus'], 
    opposing: ['Sun', 'Mars'] 
  },
  Air: { 
    supportive: ['Mercury', 'Venus'], 
    opposing: ['Saturn'] 
  },
  Earth: { 
    supportive: ['Saturn', 'Venus'], 
    opposing: ['Sun', 'Mercury'] 
  }
};

/**
 * Friendly planet pairs
 */
const PLANET_FRIENDSHIPS: Record<Planet, Planet[]> = {
  Sun: ['Jupiter', 'Mars'],
  Moon: ['Venus', 'Mercury'],
  Mars: ['Sun', 'Jupiter'],
  Mercury: ['Venus', 'Moon'],
  Jupiter: ['Sun', 'Mars'],
  Venus: ['Moon', 'Mercury', 'Saturn'],
  Saturn: ['Venus', 'Mercury']
};

/**
 * Get rest practices based on rest level and planetary influence
 * Classical wisdom: Al-sukūn qabl al-ḥaraka (Stillness before motion)
 */
function getRestPractices(level: 'gentle' | 'deep', planet: Planet): string[] {
  if (level === 'deep') {
    return [
      'Physical rest - sleep, lie down, minimal movement',
      'Cancel all non-essential meetings/tasks',
      'Light prayer or dhikr only (no intensive practice)',
      'No decision-making today - defer to better days',
      'Hydrate, nourish, be gentle with yourself'
    ];
  }
  
  // Gentle rest - planet-specific suggestions
  const gentlePractices: Record<Planet, string[]> = {
    Sun: [
      '20min silence or meditation away from bright light',
      'Gentle walk in shade (no goals, just presence)',
      'Journal thoughts without forcing solutions',
      'Postpone leadership decisions until tomorrow',
      'Early bedtime for solar repair (before 10pm)'
    ],
    Moon: [
      '20min by water (real or visualized)',
      'Gentle emotional release - cry, write, express',
      'Nourish with warm, comforting food',
      'Postpone emotional conversations',
      'Extra sleep - honor your lunar rhythm'
    ],
    Mars: [
      'Very gentle movement only (stretching, slow walk)',
      'Channel anger into gentle journaling, not action',
      'No conflicts or confrontations today',
      'Postpone physical challenges',
      'Cool down with breathing exercises'
    ],
    Mercury: [
      'Information fast - limit reading/messages',
      'Speak less, listen to silence',
      'Postpone important communications',
      'Simple, single-focus tasks only',
      'Mental rest - no problem-solving'
    ],
    Jupiter: [
      'Scale back ambitious plans',
      'Small, contained activities only',
      'Postpone teaching or sharing wisdom',
      'Gratitude practice for what is',
      'Rest in contentment, not expansion'
    ],
    Venus: [
      'Gentle self-care (bath, soft music, beauty)',
      'No relationship decisions today',
      'Postpone social gatherings',
      'Solo time in pleasant surroundings',
      'Appreciate without acquiring'
    ],
    Saturn: [
      'Release rigidity - no forcing structure',
      'Postpone long-term planning',
      'Let go of "should" thoughts',
      'Gentle flexibility exercises',
      'Trust the pause before discipline returns'
    ]
  };
  
  return gentlePractices[planet];
}

/**
 * Find better days in the week for rescheduling
 */
function findBetterDays(allDays: DailyReading[], currentScore: number): string[] {
  return allDays
    .filter(day => day.harmony_score >= 7) // Only high-harmony days
    .map(day => `${day.weekday} (${day.day_planet}, ${day.harmony_score}/10)`)
    .slice(0, 2); // Max 2 suggestions
}

// ============================================================================
// ENERGY RETURN (IRTIṬĀB) - LESSON 25
// Classical teaching: Different elements return energy at different speeds
// ============================================================================

export type EnergyReturnSpeed = 'instant' | 'quick' | 'gradual' | 'delayed';

export interface EnergyReturnInfo {
  speed: EnergyReturnSpeed;
  timeframe: string;
  description: string;
  practice: string;
}

/**
 * Get planet's natural energy return speed
 * Based on classical elemental timing
 */
function getPlanetReturnSpeed(planet: Planet): EnergyReturnSpeed {
  const speedMap: Record<Planet, EnergyReturnSpeed> = {
    'Sun': 'instant',      // Fire - immediate results
    'Mars': 'instant',     // Fire - fast action/reaction
    'Mercury': 'quick',    // Air - rapid communication
    'Jupiter': 'quick',    // Air/Fire - expansion happens steadily but noticeably
    'Moon': 'gradual',     // Water - emotional cycles
    'Venus': 'gradual',    // Water - relationships take time
    'Saturn': 'delayed'    // Earth - structure takes time to build
  };
  
  return speedMap[planet];
}

/**
 * Get detailed energy return information
 * Customized by planet and speed
 */
function getEnergyReturnDetails(
  speed: EnergyReturnSpeed,
  planet: Planet
): EnergyReturnInfo {
  
  const baseDetails: Record<EnergyReturnSpeed, { timeframe: string; description: string }> = {
    'instant': {
      timeframe: 'same day',
      description: 'Actions create immediate consequences'
    },
    'quick': {
      timeframe: 'few hours',
      description: 'What you give flows back quickly'
    },
    'gradual': {
      timeframe: '2-3 days',
      description: 'What you give today takes time to return'
    },
    'delayed': {
      timeframe: '1-2 weeks',
      description: 'Building foundations—results come later'
    }
  };
  
  // Planet-specific practices for each speed
  const planetPractices: Record<Planet, Record<EnergyReturnSpeed, string>> = {
    'Sun': {
      instant: 'Lead with generosity—authority returns respect today',
      quick: 'Lead with generosity—results come quickly',
      gradual: 'Lead with patience—influence grows steadily',
      delayed: 'Lead with consistency—reputation builds over time'
    },
    'Mars': {
      instant: 'Act with courage—strength returns strength immediately',
      quick: 'Act boldly—momentum builds fast',
      gradual: 'Push forward—progress shows in days',
      delayed: 'Train consistently—power builds gradually'
    },
    'Mercury': {
      instant: 'Speak clearly—understanding comes back instantly',
      quick: 'Communicate well—replies come swiftly',
      gradual: 'Share knowledge—learning compounds over days',
      delayed: 'Write persistently—wisdom accumulates slowly'
    },
    'Moon': {
      instant: 'Give care—comfort returns quickly today',
      quick: 'Give care—warmth returns in hours',
      gradual: 'Nurture bonds—emotional depth grows over days',
      delayed: 'Tend relationships—trust builds with time'
    },
    'Venus': {
      instant: 'Show love—beauty reflects back today',
      quick: 'Show love—joy returns soon',
      gradual: 'Create beauty—appreciation deepens over days',
      delayed: 'Invest in art—value increases with time'
    },
    'Jupiter': {
      instant: 'Think big—opportunities appear today',
      quick: 'Expand horizons—doors open quickly',
      gradual: 'Study deeply—wisdom unfolds over days',
      delayed: 'Build legacy—growth compounds over time'
    },
    'Saturn': {
      instant: 'Structure well—stability shows today',
      quick: 'Organize now—order appears soon',
      gradual: 'Plan carefully—results manifest in days',
      delayed: 'Build foundations—lasting results take weeks'
    }
  };
  
  const practice = planetPractices[planet]?.[speed] || baseDetails[speed].description;
  
  return {
    speed,
    timeframe: baseDetails[speed].timeframe,
    description: baseDetails[speed].description,
    practice
  };
}

/**
 * Calculate energy return speed for a given day
 * Based on Lesson 25: Irtiṭāb (Energy Return) concept
 * 
 * Fire: Instant (same day)
 * Air: Quick (few hours)
 * Water: Gradual (2-3 days)
 * Earth: Delayed (1-2 weeks)
 */
function calculateEnergyReturn(planet: Planet): EnergyReturnInfo {
  const speed = getPlanetReturnSpeed(planet);
  return getEnergyReturnDetails(speed, planet);
}

/**
 * Generate Task Sequence for high-harmony days (Niẓām - Lesson 28)
 * Returns optimal timing for different activities throughout the day
 * Only for harmony >= 7
 */
function generateTaskSequence(
  planet: Planet,
  element: ElementType,
  harmonyScore: number
): TaskSequence | undefined {
  
  // Only generate for high-harmony days (7-10)
  if (harmonyScore < 7) {
    return undefined;
  }
  
  // Planet-specific sequences
  const sequences: Record<Planet, TaskSequence> = {
    'Sun': {
      morning: {
        timeRange: '7-9 AM',
        energyType: 'Peak leadership energy',
        bestFor: [
          'Important decisions',
          'Set daily direction',
          'Lead team meetings',
          'Strategic planning'
        ],
        avoid: ['Routine tasks', 'Following others'],
        planetalPhase: 'Sun rises - authority peaks'
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'High visibility',
        bestFor: [
          'Public presentations',
          'Client meetings',
          'Performance reviews',
          'Launch initiatives'
        ],
        avoid: ['Background work', 'Hiding mistakes'],
        planetalPhase: 'Solar noon - maximum presence'
      },
      afternoon: {
        timeRange: '3-5 PM',
        energyType: 'Delegation phase',
        bestFor: [
          'Delegate tasks',
          'Teach and mentor',
          'Review team work',
          'Empower others'
        ],
        avoid: ['Micromanaging', 'Solo work']
      },
      evening: {
        timeRange: '6-8 PM',
        energyType: 'Reflection time',
        bestFor: [
          'Reflect on achievements',
          'Plan tomorrow',
          'Celebrate wins',
          'Rest with dignity'
        ],
        avoid: ['New starts', 'Criticism']
      }
    },
    
    'Moon': {
      morning: {
        timeRange: '6-8 AM',
        energyType: 'Emotional clarity',
        bestFor: [
          'Check in with feelings',
          'Nurturing activities',
          'Self-care routines',
          'Gentle exercise'
        ],
        avoid: ['Harsh decisions', 'Confrontation']
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'Empathy peak',
        bestFor: [
          'One-on-one conversations',
          'Emotional support',
          'Counseling sessions',
          'Family matters'
        ],
        avoid: ['Cold logic', 'Aggressive negotiations']
      },
      afternoon: {
        timeRange: '3-5 PM',
        energyType: 'Creative flow',
        bestFor: [
          'Creative writing',
          'Art and music',
          'Intuitive work',
          'Dream interpretation'
        ],
        avoid: ['Analytical tasks', 'Number crunching']
      },
      evening: {
        timeRange: '7-9 PM',
        energyType: 'Deep rest begins',
        bestFor: [
          'Wind down gently',
          'Light reading',
          'Meditation',
          'Early sleep preparation'
        ],
        avoid: ['Stimulation', 'Heavy meals', 'Screens']
      }
    },
    
    'Mars': {
      morning: {
        timeRange: '6-8 AM',
        energyType: 'Peak physical energy',
        bestFor: [
          'Vigorous exercise',
          'Tackle hardest task first',
          'Difficult conversations',
          'Physical challenges'
        ],
        avoid: ['Procrastination', 'Hesitation']
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'Combat mode',
        bestFor: [
          'Competitive situations',
          'Negotiations',
          'Push through obstacles',
          'Defend positions'
        ],
        avoid: ['Passive waiting', 'People-pleasing']
      },
      afternoon: {
        timeRange: '2-4 PM',
        energyType: 'Sustained push',
        bestFor: [
          'Complete unfinished tasks',
          'Power through resistance',
          'Athletic training',
          'Assert boundaries'
        ],
        avoid: ['Giving up', 'Overthinking']
      },
      evening: {
        timeRange: '6-8 PM',
        energyType: 'Cool down needed',
        bestFor: [
          'Gentle stretching',
          'Process day\'s battles',
          'Release tension',
          'Forgive conflicts'
        ],
        avoid: ['New fights', 'Revenge planning', 'Alcohol']
      }
    },
    
    'Mercury': {
      morning: {
        timeRange: '7-9 AM',
        energyType: 'Mental sharpness',
        bestFor: [
          'Writing tasks',
          'Study complex topics',
          'Plan communications',
          'Learn new skills'
        ],
        avoid: ['Mindless work', 'Physical-only tasks']
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'Communication peak',
        bestFor: [
          'Important calls',
          'Presentations',
          'Teach or explain',
          'Networking'
        ],
        avoid: ['Solo work', 'Silence']
      },
      afternoon: {
        timeRange: '3-5 PM',
        energyType: 'Quick connections',
        bestFor: [
          'Short trips/errands',
          'Email responses',
          'Quick meetings',
          'Social media'
        ],
        avoid: ['Deep focus', 'Long commitments']
      },
      evening: {
        timeRange: '6-8 PM',
        energyType: 'Integration time',
        bestFor: [
          'Review what you learned',
          'Journal insights',
          'Organize notes',
          'Light reading'
        ],
        avoid: ['New information', 'Complex learning']
      }
    },
    
    'Jupiter': {
      morning: {
        timeRange: '8-10 AM',
        energyType: 'Expansion begins',
        bestFor: [
          'Think big picture',
          'Strategic planning',
          'Study philosophy',
          'Set ambitious goals'
        ],
        avoid: ['Small thinking', 'Petty details']
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'Opportunity window',
        bestFor: [
          'Seek opportunities',
          'Make connections',
          'Generous acts',
          'Teaching'
        ],
        avoid: ['Stinginess', 'Narrowness']
      },
      afternoon: {
        timeRange: '2-4 PM',
        energyType: 'Growth momentum',
        bestFor: [
          'Expand projects',
          'Take calculated risks',
          'Travel planning',
          'Cultural exploration'
        ],
        avoid: ['Contraction', 'Fear-based decisions']
      },
      evening: {
        timeRange: '6-8 PM',
        energyType: 'Wisdom integration',
        bestFor: [
          'Philosophical reflection',
          'Gratitude practice',
          'Mentor someone',
          'Spiritual study'
        ],
        avoid: ['Materialism', 'Pessimism']
      }
    },
    
    'Venus': {
      morning: {
        timeRange: '7-9 AM',
        energyType: 'Beauty appreciation',
        bestFor: [
          'Self-care rituals',
          'Beautify environment',
          'Artistic creation',
          'Gentle movement'
        ],
        avoid: ['Harsh criticism', 'Ugliness']
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'Relationship harmony',
        bestFor: [
          'Romantic gestures',
          'Diplomatic meetings',
          'Collaborative work',
          'Peacemaking'
        ],
        avoid: ['Conflict', 'Criticism', 'Confrontation']
      },
      afternoon: {
        timeRange: '3-5 PM',
        energyType: 'Creative flow',
        bestFor: [
          'Art and music',
          'Design work',
          'Cooking',
          'Fashion/style choices'
        ],
        avoid: ['Analytical work', 'Criticism']
      },
      evening: {
        timeRange: '6-8 PM',
        energyType: 'Pleasure time',
        bestFor: [
          'Enjoy good food',
          'Time with loved ones',
          'Entertainment',
          'Sensory pleasures'
        ],
        avoid: ['Work', 'Stress', 'Discipline']
      }
    },
    
    'Saturn': {
      morning: {
        timeRange: '6-8 AM',
        energyType: 'Discipline peak',
        bestFor: [
          'Difficult tasks first',
          'Build structures',
          'Set boundaries',
          'Focus on responsibilities'
        ],
        avoid: ['Procrastination', 'Play']
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'Serious work mode',
        bestFor: [
          'Complex problem-solving',
          'Long-term planning',
          'Quality control',
          'Professional duties'
        ],
        avoid: ['Shortcuts', 'Quick fixes']
      },
      afternoon: {
        timeRange: '2-4 PM',
        energyType: 'Endurance phase',
        bestFor: [
          'Persist through challenges',
          'Detail-oriented work',
          'Administrative tasks',
          'Build foundations'
        ],
        avoid: ['Giving up', 'Seeking easy path']
      },
      evening: {
        timeRange: '6-8 PM',
        energyType: 'Review time',
        bestFor: [
          'Assess progress',
          'Plan improvements',
          'Organize for tomorrow',
          'Solo reflection'
        ],
        avoid: ['Socializing', 'Indulgence']
      }
    }
  };
  
  return sequences[planet];
}

/**
 * Determine Rūḥ phase group (Begin/Build/Complete)
 */
function getRuhPhaseGroup(phase: number): RuhPhaseGroup {
  if (phase >= 1 && phase <= 3) return 'Begin';
  if (phase >= 4 && phase <= 6) return 'Build';
  return 'Complete';
}

/**
 * Calculate harmony type between user and current influences
 */
export function calculateHarmonyType(
  userElement: ElementType,
  userKawkab: Planet,
  userRuh: number,
  dayPlanet: Planet,
  ruhPhase: number
): HarmonyType {
  const elementSupport = PLANET_ELEMENT_SUPPORT[userElement];
  const planetSupportsElement = elementSupport.supportive.includes(dayPlanet);
  const planetOpposesElement = elementSupport.opposing.includes(dayPlanet);
  
  const planetMatch = userKawkab === dayPlanet;
  const planetFriendly = PLANET_FRIENDSHIPS[userKawkab]?.includes(dayPlanet);
  
  const ruhGroup = getRuhPhaseGroup(userRuh);
  const phaseGroup = getRuhPhaseGroup(ruhPhase);
  const ruhAligned = ruhGroup === phaseGroup;
  
  // Complete harmony: planet supports element AND planets align AND ruh aligned
  if (planetSupportsElement && (planetMatch || planetFriendly) && ruhAligned) {
    return 'Complete';
  }
  
  // Conflict: planet opposes element AND no planet harmony AND ruh not aligned
  if (planetOpposesElement && !planetMatch && !planetFriendly && !ruhAligned) {
    return 'Conflict';
  }
  
  // Everything else is Partial
  return 'Partial';
}

/**
 * Determine dominant force in user's profile
 */
export function calculateDominantForce(
  saghir: number,
  element: ElementType,
  kawkab: Planet,
  letterGeometry: string[]
): DominantForce {
  // Heuristic scoring
  let ruhScore = 0;
  let elementScore = 0;
  let kawkabScore = 0;
  
  // Strong Rūḥ: numbers 4, 7, 8 suggest discipline/structure/introspection
  if ([4, 7, 8].includes(saghir)) ruhScore += 2;
  
  // Element score: if geometry is very pronounced
  const geometryCount = letterGeometry.length;
  if (geometryCount >= 3) elementScore += 2;
  
  // Kawkab score: outer planets (Jupiter, Saturn) suggest external timing sensitivity
  if (['Jupiter', 'Saturn'].includes(kawkab)) kawkabScore += 2;
  
  // Personal numbers (1, 5, 9) suggest soul-driven
  if ([1, 5, 9].includes(saghir)) ruhScore += 1;
  
  // Emotional elements (Water) and passionate (Fire) suggest element dominance
  if (['Water', 'Fire'].includes(element)) elementScore += 1;
  
  // Fast planets (Mercury, Moon) suggest timing sensitivity
  if (['Mercury', 'Moon'].includes(kawkab)) kawkabScore += 1;
  
  // Return dominant
  const max = Math.max(ruhScore, elementScore, kawkabScore);
  if (ruhScore === max) return 'Rūḥ';
  if (elementScore === max) return 'Element';
  return 'Kawkab';
}

/**
 * Generate balance tip based on dominant force
 */
export function getBalanceTip(dominant: DominantForce): string {
  const tips = {
    Rūḥ: 'Your inner compass guides you—balance introspection with outer engagement.',
    Element: 'Your temperament leads—balance feelings with mindful structure.',
    Kawkab: 'External timing shapes you—balance receptivity with inner purpose.'
  };
  return tips[dominant];
}

/**
 * Calculate daily harmony score (0-10)
 */
function calculateDailyScore(
  dayPlanet: Planet,
  userElement: ElementType,
  userKawkab: Planet,
  ruhPhase: number,
  userRuh: number
): number {
  let score = 0;
  
  // A) Day planet vs user element (0-3)
  const elementSupport = PLANET_ELEMENT_SUPPORT[userElement];
  if (elementSupport.supportive.includes(dayPlanet)) score += 3;
  else if (elementSupport.opposing.includes(dayPlanet)) score += 0;
  else score += 1;
  
  // B) Day planet vs user Kawkab (0-3)
  if (dayPlanet === userKawkab) score += 3;
  else if (PLANET_FRIENDSHIPS[userKawkab]?.includes(dayPlanet)) score += 2;
  else score += 1;
  
  // C) Rūḥ phase synergy (0-4)
  const phaseGroup = getRuhPhaseGroup(ruhPhase);
  const ruhGroup = getRuhPhaseGroup(userRuh);
  
  if (phaseGroup === 'Begin' && ['Sun', 'Mars', 'Mercury'].includes(dayPlanet)) score += 4;
  else if (phaseGroup === 'Build' && ['Saturn', 'Jupiter', 'Mercury'].includes(dayPlanet)) score += 3;
  else if (phaseGroup === 'Complete' && ['Moon', 'Venus', 'Saturn'].includes(dayPlanet)) score += 3;
  else score += 1;
  
  // Bonus for alignment
  if (phaseGroup === ruhGroup) score += 1;
  
  return Math.min(10, score);
}

/**
 * Get band from score
 */
function getScoreBand(score: number): 'High' | 'Moderate' | 'Low' {
  if (score >= 8) return 'High';
  if (score >= 5) return 'Moderate';
  return 'Low';
}

/**
 * Generate daily tips based on planet-specific energies
 * Each planet gets unique, actionable guidance for daily planning
 */
function generateDailyTips(
  band: 'High' | 'Moderate' | 'Low',
  element: ElementType,
  planet: Planet
): string[] {
  const tips: string[] = [];
  
  // Planet-specific primary guidance (unique for each planet)
  const planetGuidance: Record<Planet, { high: string; moderate: string; low: string }> = {
    Sun: {
      high: 'Excellent for leadership—schedule important meetings and presentations',
      moderate: 'Lead projects and take initiative—high energy for achievements',
      low: 'Challenging for visibility—lead quietly, support others today'
    },
    Moon: {
      high: 'Perfect for reflection—trust your intuition and emotional wisdom',
      moderate: 'Gentle day—plan, review, nurture relationships, avoid overload',
      low: 'Rest needed—minimize commitments, process emotions, be kind to yourself'
    },
    Mars: {
      high: 'Fierce energy—tackle tough challenges and push through obstacles boldly',
      moderate: 'Take action on difficult tasks—courage and determination favored',
      low: 'Channel carefully—physical activity helps, avoid conflicts and rushing'
    },
    Mercury: {
      high: 'Sharp mind—perfect for writing, calls, learning, and travel plans',
      moderate: 'Communicate clearly—good for emails, meetings, and study sessions',
      low: 'Mental fog possible—double-check messages, postpone major decisions'
    },
    Jupiter: {
      high: 'Timing is perfect—make big decisions, start new ventures, expand horizons',
      moderate: 'Growth day—great for planning expansion and seeking opportunities',
      low: 'Temper optimism—research thoroughly before committing to anything big'
    },
    Venus: {
      high: 'Excellent for connection—ideal for relationships, creativity, and beauty',
      moderate: 'Harmonious day—connect with others, enjoy art, balance work-pleasure',
      low: 'Social challenges—focus on self-care, solo creative work, gentle interactions'
    },
    Saturn: {
      high: 'Build strong foundations—organize, plan long-term, establish structures',
      moderate: 'Structure your week—discipline and planning bring good results',
      low: 'Heavy responsibilities—break tasks into small steps, be patient with delays'
    }
  };
  
  // Add primary planet-specific guidance based on harmony score
  tips.push(planetGuidance[planet][band.toLowerCase() as 'high' | 'moderate' | 'low']);
  
  // Element balance tip (shorter, supportive advice)
  const elementTips: Record<ElementType, string> = {
    Fire: 'Balance heat—practice calm speech, charity, time near water',
    Water: 'Activate energy—light exercise, sunlight, decisive action',
    Air: 'Ground yourself—stick to routine, nature walk, one task at a time',
    Earth: 'Add lightness—try creativity, flexibility, or a short change of scenery'
  };
  tips.push(elementTips[element]);
  
  // Planet secondary tip (alternative actionable advice)
  const planetSecondaryTips: Record<Planet, string> = {
    Sun: 'Shine your light—but stay humble and generous with recognition',
    Moon: 'Honor your feelings—they guide you to what truly matters',
    Mars: 'Channel warrior energy—protect boundaries, pursue goals with courage',
    Mercury: 'Mental agility peaks—network, negotiate, adapt quickly',
    Jupiter: 'Seek wisdom and growth—mentor others or learn from teachers',
    Venus: 'Appreciate beauty—create harmony in your environment and relationships',
    Saturn: 'Master discipline—small consistent efforts build lasting success'
  };
  tips.push(planetSecondaryTips[planet]);
  
  return tips;
}

/**
 * Get planet for a given day of week
 */
function getPlanetForDay(date: Date): Planet {
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const planets: Planet[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  return planets[dayOfWeek];
}

/**
 * Get weekday name
 */
function getWeekdayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Get element phase for a day (1-4 cycle)
 */
function getElementPhase(daysSinceAnchor: number): ElementType {
  const phases: ElementType[] = ['Fire', 'Water', 'Air', 'Earth'];
  return phases[daysSinceAnchor % 4];
}

/**
 * Calculate user profile from name and optional birth date
 */
export function calculateUserProfile(
  nameArabic: string,
  birthDate?: Date,
  motherName?: string,
  abjad: Record<string, number> = ABJAD_MAGHRIBI
): UserProfile {
  const destiny = analyzeNameDestiny(nameArabic, abjad);
  
  // Determine element from letters
  const letters = [...nameArabic.replace(/[ًٌٍَُِّْ\s]/g, '')];
  const firstLetter = letters[0];
  const userPlanet = LETTER_PLANETS[firstLetter] || 'Sun';
  
  // Determine element from hadath
  const userElement = hadathToElement(destiny.hadath);
  
  // Letter geometry
  const geometry: string[] = [];
  const verticalLetters = 'الكلىهطظ';
  const roundLetters = 'وقفعصض';
  if (letters.some(l => verticalLetters.includes(l))) geometry.push('vertical');
  if (letters.some(l => roundLetters.includes(l))) geometry.push('round');
  
  const anchor = birthDate ? birthDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  
  return {
    name_ar: nameArabic,
    kabir: destiny.kabir,
    saghir: destiny.saghir,
    ruh: destiny.saghir,
    element: userElement,
    kawkab: userPlanet,
    letter_geometry: geometry,
    anchor
  };
}

/**
 * Generate daily reading for a specific date
 */
export function generateDailyReading(
  profile: UserProfile,
  date: Date,
  allWeekDays?: DailyReading[] // Optional: for betterDays calculation
): DailyReading {
  const anchorDate = new Date(profile.anchor);
  const daysSinceAnchor = Math.floor((date.getTime() - anchorDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const ruhPhase = (daysSinceAnchor % 9) + 1;
  const elementPhase = getElementPhase(daysSinceAnchor);
  const dayPlanet = getPlanetForDay(date);
  const weekday = getWeekdayName(date);
  
  const score = calculateDailyScore(dayPlanet, profile.element, profile.kawkab, ruhPhase, profile.ruh);
  const band = getScoreBand(score);
  const tips = generateDailyTips(band, profile.element, dayPlanet);
  
  // Rest Signal Detection (Infisāl)
  const isRestDay = score <= 4;
  const restLevel = score <= 1 ? 'deep' : 'gentle';
  const restPractices = isRestDay ? getRestPractices(restLevel, dayPlanet) : undefined;
  const betterDays = (isRestDay && allWeekDays) ? findBetterDays(allWeekDays, score) : undefined;
  
  // Energy Return (Irtiṭāb) - Lesson 25
  const energyReturn = calculateEnergyReturn(dayPlanet);
  
  // Task Sequencer (Niẓām) - Lesson 28 (only for high-harmony days)
  const taskSequence = generateTaskSequence(dayPlanet, elementPhase, score);
  
  return {
    date: date.toISOString().split('T')[0],
    weekday,
    day_planet: dayPlanet,
    ruh_phase: ruhPhase,
    ruh_phase_group: getRuhPhaseGroup(ruhPhase),
    element_phase: elementPhase,
    harmony_score: score,
    band,
    tips,
    isRestDay,
    restLevel: isRestDay ? restLevel : undefined,
    restPractices,
    betterDays,
    energyReturn,
    taskSequence
  };
}

/**
 * Generate weekly summary
 */
export function generateWeeklySummary(
  profile: UserProfile,
  startDate: Date = new Date()
): WeeklySummary {
  const days: DailyReading[] = [];
  
  // First pass: generate all days without betterDays
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(generateDailyReading(profile, date));
  }
  
  // Second pass: add betterDays for rest days
  for (let i = 0; i < days.length; i++) {
    if (days[i].isRestDay) {
      days[i].betterDays = findBetterDays(days, days[i].harmony_score);
    }
  }
  
  // Find best and gentle days
  let bestDay = days[0];
  let gentleDay = days[0];
  let focusDay = days[0];
  
  days.forEach(day => {
    if (day.harmony_score > bestDay.harmony_score) bestDay = day;
    if (day.harmony_score < gentleDay.harmony_score) gentleDay = day;
    if (['Saturn', 'Mercury'].includes(day.day_planet) && 
        day.harmony_score >= focusDay.harmony_score) {
      focusDay = day;
    }
  });
  
  return {
    days,
    best_day: bestDay.date,
    gentle_day: gentleDay.date,
    focus_day: focusDay.date
  };
}
