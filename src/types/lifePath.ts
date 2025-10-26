/**
 * Enhanced Life Path System
 * Based on classical ʿIlm al-Ḥurūf traditions (Al-Būnī, Ibn ʿArabī)
 * Integrates Abjad numerology with spiritual stations (maqāmāt)
 */

export type Element = 'fire' | 'water' | 'air' | 'earth';

// ============================================================================
// CORE LIFE PATH NUMBERS
// ============================================================================

export interface EnhancedLifePath {
  // Core Numbers
  lifePathNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  destinyNumber: number;
  
  // Descriptions
  lifePath: LifePathDetails;
  soulUrge: SoulUrgeDetails;
  personality: PersonalityDetails;
  destiny: DestinyDetails;
  
  // Current Cycle
  currentCycle: LifeCycle;
  
  // Spiritual Journey
  spiritualStation: SpiritualStation;
  currentLesson: string;
  currentLessonArabic: string;
  karmicDebts: number[];
  
  // Timing
  personalYear: number;
  personalMonth: number;
  pinnacleNumber: number;
  challengeNumber: number;
  
  // Synthesis
  overallGuidance: string;
  overallGuidanceArabic: string;
  sacredNumbers: number[];
}

export interface LifePathDetails {
  number: number;
  name: string;
  nameArabic: string;
  planet: string;
  planetArabic: string;
  element: Element;
  elementArabic: string;
  spiritualStation: string;
  spiritualStationArabic: string;
  qualities: string[];
  qualitiesArabic: string[];
  challenges: string[];
  challengesArabic: string[];
  lifePurpose: string;
  lifePurposeArabic: string;
  quranResonance: string;
  quranResonanceArabic: string;
  famousArchetypes: string[];
  famousArchetypesArabic: string[];
  color: string;
}

export interface SoulUrgeDetails {
  number: number;
  deepestDesire: string;
  deepestDesireArabic: string;
  innerMotivation: string;
  innerMotivationArabic: string;
  spiritualHunger: string;
  spiritualHungerArabic: string;
}

export interface PersonalityDetails {
  number: number;
  outwardExpression: string;
  outwardExpressionArabic: string;
  howOthersSeeYou: string;
  howOthersSeeYouArabic: string;
  socialMask: string;
  socialMaskArabic: string;
}

export interface DestinyDetails {
  number: number;
  overarchingPurpose: string;
  overarchingPurposeArabic: string;
  divineAssignment: string;
  divineAssignmentArabic: string;
  lifeWork: string;
  lifeWorkArabic: string;
}

export interface LifeCycle {
  cycleNumber: number;
  cycleStage: string;
  cycleStageArabic: string;
  ageRange: string;
  positionInCycle: number;
  completionPercentage: number;
  yearTheme: string;
  yearThemeArabic: string;
  focus: string[];
  focusArabic: string[];
  transitions: string[];
  transitionsArabic: string[];
  lesson: string;
  lessonArabic: string;
}

export interface SpiritualStation {
  name: string;
  nameArabic: string;
  description: string;
  descriptionArabic: string;
  practices: string[];
  practicesArabic: string[];
  signs: string[];
  signsArabic: string[];
  nextStation: string;
  previousStation: string;
}

// ============================================================================
// CYCLE DEFINITIONS (9-Year System)
// ============================================================================

export const LIFE_CYCLES = [
  {
    cycle: 1,
    ageRange: '1-9',
    stage: 'Foundation (Taʾsīs)',
    stageArabic: 'التأسيس',
    description: 'Birth and early development of character and talents'
  },
  {
    cycle: 2,
    ageRange: '10-18',
    stage: 'Growth (Numūw)',
    stageArabic: 'النمو',
    description: 'Education and development of skills'
  },
  {
    cycle: 3,
    ageRange: '19-27',
    stage: 'Mastery (Itqān)',
    stageArabic: 'الإتقان',
    description: 'Peak of capability and establishment'
  },
  {
    cycle: 4,
    ageRange: '28-36',
    stage: 'Wisdom (Ḥikmah)',
    stageArabic: 'الحكمة',
    description: 'Integration of experience into understanding'
  },
  {
    cycle: 5,
    ageRange: '37-45',
    stage: 'Service (Khidmah)',
    stageArabic: 'الخدمة',
    description: 'Contribution to family and community'
  },
  {
    cycle: 6,
    ageRange: '46-54',
    stage: 'Teaching (Taʿlīm)',
    stageArabic: 'التعليم',
    description: 'Sharing knowledge and guiding others'
  },
  {
    cycle: 7,
    ageRange: '55-63',
    stage: 'Legacy (Turāth)',
    stageArabic: 'التراث',
    description: 'Creating lasting impact and inheritance'
  },
  {
    cycle: 8,
    ageRange: '64-72',
    stage: 'Completion (Itmām)',
    stageArabic: 'الإتمام',
    description: 'Preparation for transition and wisdom sharing'
  },
  {
    cycle: 9,
    ageRange: '73+',
    stage: 'Eternal Wisdom (Ḥikmah Bāqiyah)',
    stageArabic: 'الحكمة الباقية',
    description: 'Transcendence and spiritual elevation'
  }
] as const;

// ============================================================================
// SPIRITUAL STATIONS (Maqāmāt)
// ============================================================================

export const SPIRITUAL_STATIONS = {
  1: { name: 'Tawbah', arabic: 'توبة', meaning: 'Repentance', level: 'Beginning' },
  2: { name: 'Wara\'', arabic: 'ورع', meaning: 'Scrupulousness', level: 'Beginning' },
  3: { name: 'Zuhd', arabic: 'زهد', meaning: 'Asceticism', level: 'Intermediate' },
  4: { name: 'Sabr', arabic: 'صبر', meaning: 'Patience', level: 'Intermediate' },
  5: { name: 'Tawakkul', arabic: 'توكل', meaning: 'Trust in Divine', level: 'Intermediate' },
  6: { name: 'Rida', arabic: 'رضا', meaning: 'Contentment', level: 'Advanced' },
  7: { name: 'Tafakkur', arabic: 'تفكر', meaning: 'Contemplation', level: 'Advanced' },
  8: { name: 'Muraqabah', arabic: 'مراقبة', meaning: 'Watchfulness', level: 'Advanced' },
  9: { name: 'Mahabba', arabic: 'محبة', meaning: 'Divine Love', level: 'Mastery' }
} as const;
