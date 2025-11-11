/**
 * ========================================
 * HADAD ALIGNMENT SCORING
 * ========================================
 * 
 * Personal planetary alignment based on birth Hadad calculations
 * Analyzes how current planetary hour aligns with your spiritual essence
 * 
 * Features:
 * - Personal Hadad element vs current planet element
 * - Birth date planetary ruler vs current hour
 * - Sacred number resonances
 * - Optimal hour recommendations
 * 
 * Sources:
 * - Classical Ilm al-Ḥurūf calculations
 * - Traditional planetary hour correspondences
 * - Four element harmonies (Fire, Water, Air, Earth)
 */

import { hadathRemainder, hadathToElement, digitalRoot } from '../components/hadad-summary/hadad-core';
import type { ElementType } from '../components/hadad-summary/types';

// ========================================
// TYPES
// ========================================

export interface PersonalHadad {
  total: number; // Kabīr
  root: number; // Ṣaghīr
  element: ElementType; // From Ḥadath
  birthPlanet: string; // Ruling planet from birth date
}

export interface AlignmentScore {
  overall: number; // 0-100
  breakdown: {
    elementalHarmony: number; // 0-30
    planetaryResonance: number; // 0-30
    numericalAlignment: number; // 0-20
    sacredConnection: number; // 0-20
  };
  interpretation: {
    en: string;
    fr: string;
  };
  recommendations: {
    en: string[];
    fr: string[];
  };
}

export interface HourOptimality {
  planet: string;
  score: number; // 0-100
  reason: { en: string; fr: string };
}

// ========================================
// PLANETARY-ELEMENT MAPPINGS
// ========================================

const PLANET_ELEMENTS: Record<string, ElementType> = {
  'Sun': 'Fire',
  'Moon': 'Water',
  'Mars': 'Fire',
  'Mercury': 'Air',
  'Jupiter': 'Air',
  'Venus': 'Earth',
  'Saturn': 'Earth',
};

const PLANET_NUMBERS: Record<string, number> = {
  'Sun': 1,
  'Moon': 2,
  'Mars': 5,
  'Mercury': 4,
  'Jupiter': 3,
  'Venus': 6,
  'Saturn': 7,
};

// Birth date planetary rulers (day of week)
const WEEKDAY_PLANETS: string[] = [
  'Sun',    // Sunday
  'Moon',   // Monday
  'Mars',   // Tuesday
  'Mercury', // Wednesday
  'Jupiter', // Thursday
  'Venus',  // Friday
  'Saturn', // Saturday
];

// ========================================
// ELEMENT HARMONIES
// ========================================

/**
 * Calculate elemental harmony score (0-30)
 * Same element = 30, Compatible = 20, Neutral = 10, Opposing = 0
 */
function calculateElementalHarmony(element1: ElementType, element2: ElementType): number {
  // Same element - perfect harmony
  if (element1 === element2) return 30;

  // Element compatibilities (classical)
  const compatible: Record<ElementType, ElementType[]> = {
    'Fire': ['Air'], // Fire needs Air to burn
    'Air': ['Fire'], // Air feeds Fire
    'Water': ['Earth'], // Water nourishes Earth
    'Earth': ['Water'], // Earth contains Water
  };

  // Opposing elements
  const opposing: Record<ElementType, ElementType[]> = {
    'Fire': ['Water'], // Fire vs Water
    'Water': ['Fire'], // Water vs Fire
    'Air': ['Earth'], // Air vs Earth (somewhat)
    'Earth': ['Air'], // Earth vs Air (somewhat)
  };

  if (compatible[element1]?.includes(element2)) return 20;
  if (opposing[element1]?.includes(element2)) return 0;
  
  return 10; // Neutral
}

/**
 * Calculate planetary resonance score (0-30)
 */
function calculatePlanetaryResonance(birthPlanet: string, currentPlanet: string): number {
  // Same planet - perfect resonance
  if (birthPlanet === currentPlanet) return 30;

  // Friendly planets (classical relationships)
  const friends: Record<string, string[]> = {
    'Sun': ['Moon', 'Jupiter', 'Mars'],
    'Moon': ['Sun', 'Mercury', 'Jupiter'],
    'Mars': ['Sun', 'Jupiter', 'Venus'],
    'Mercury': ['Moon', 'Venus', 'Saturn'],
    'Jupiter': ['Sun', 'Moon', 'Mars'],
    'Venus': ['Mercury', 'Saturn', 'Mars'],
    'Saturn': ['Mercury', 'Venus', 'Jupiter'],
  };

  // Enemy planets (classical relationships)
  const enemies: Record<string, string[]> = {
    'Sun': ['Saturn', 'Venus'],
    'Moon': ['Mars', 'Saturn'],
    'Mars': ['Mercury', 'Moon'],
    'Mercury': ['Mars', 'Sun'],
    'Jupiter': ['Mercury', 'Venus'],
    'Venus': ['Sun', 'Moon'],
    'Saturn': ['Sun', 'Mars', 'Moon'],
  };

  if (friends[birthPlanet]?.includes(currentPlanet)) return 20;
  if (enemies[birthPlanet]?.includes(currentPlanet)) return 5;
  
  return 15; // Neutral
}

/**
 * Calculate numerical alignment (0-20)
 */
function calculateNumericalAlignment(hadadRoot: number, planetNumber: number): number {
  // Digital root match
  if (hadadRoot === planetNumber) return 20;
  
  // Within 1
  if (Math.abs(hadadRoot - planetNumber) === 1) return 15;
  
  // Within 2
  if (Math.abs(hadadRoot - planetNumber) === 2) return 10;
  
  // Same parity (odd/even)
  if (hadadRoot % 2 === planetNumber % 2) return 5;
  
  return 0;
}

/**
 * Calculate sacred connection score (0-20)
 */
function calculateSacredConnection(hadadTotal: number, planetNumber: number): number {
  const sacredNumbers = [7, 12, 19, 99, 114, 313];
  
  // Check if Hadad total is divisible by planet number
  if (hadadTotal % planetNumber === 0) {
    return 20;
  }
  
  // Check if Hadad total is a sacred number
  if (sacredNumbers.includes(hadadTotal)) {
    return 15;
  }
  
  // Check if digital root is sacred
  const root = digitalRoot(hadadTotal);
  if ([7, 9, 12].includes(root)) {
    return 10;
  }
  
  // Check if divisible by 7 or 9 (sacred)
  if (hadadTotal % 7 === 0 || hadadTotal % 9 === 0) {
    return 5;
  }
  
  return 0;
}

// ========================================
// MAIN ALIGNMENT CALCULATION
// ========================================

/**
 * Calculate birth planet from date
 */
export function getBirthPlanet(birthDate: Date): string {
  const dayOfWeek = birthDate.getDay(); // 0 = Sunday
  return WEEKDAY_PLANETS[dayOfWeek];
}

/**
 * Calculate personal Hadad essence
 */
export function calculatePersonalHadad(
  nameTotal: number,
  birthDate: Date
): PersonalHadad {
  const root = digitalRoot(nameTotal);
  const hadath = hadathRemainder(nameTotal);
  const element = hadathToElement(hadath);
  const birthPlanet = getBirthPlanet(birthDate);

  return {
    total: nameTotal,
    root,
    element,
    birthPlanet,
  };
}

/**
 * Calculate alignment score for current planetary hour
 */
export function calculateAlignmentScore(
  personalHadad: PersonalHadad,
  currentPlanet: string
): AlignmentScore {
  const currentElement = PLANET_ELEMENTS[currentPlanet];
  const currentPlanetNumber = PLANET_NUMBERS[currentPlanet];

  // Calculate sub-scores
  const elementalHarmony = calculateElementalHarmony(personalHadad.element, currentElement);
  const planetaryResonance = calculatePlanetaryResonance(personalHadad.birthPlanet, currentPlanet);
  const numericalAlignment = calculateNumericalAlignment(personalHadad.root, currentPlanetNumber);
  const sacredConnection = calculateSacredConnection(personalHadad.total, currentPlanetNumber);

  const overall = elementalHarmony + planetaryResonance + numericalAlignment + sacredConnection;

  // Generate interpretation
  let interpretation: { en: string; fr: string };
  let recommendations: { en: string[]; fr: string[] };

  if (overall >= 80) {
    interpretation = {
      en: `Exceptional alignment! Your spiritual essence (${personalHadad.element} element, ${personalHadad.birthPlanet} ruler) resonates powerfully with ${currentPlanet}'s ${currentElement} energy. This is an optimal time for important spiritual work.`,
      fr: `Alignement exceptionnel ! Votre essence spirituelle (élément ${personalHadad.element}, gouverneur ${personalHadad.birthPlanet}) résonne puissamment avec l'énergie ${currentElement} de ${currentPlanet}. C'est un moment optimal pour un travail spirituel important.`,
    };
    recommendations = {
      en: [
        'Engage in deep spiritual practices',
        'Make important decisions',
        'Perform dhikr of your resonant Divine Name',
        'Initiate significant projects',
      ],
      fr: [
        'Engagez-vous dans des pratiques spirituelles profondes',
        'Prenez des décisions importantes',
        'Pratiquez le dhikr de votre Nom Divin résonnant',
        'Initiez des projets significatifs',
      ],
    };
  } else if (overall >= 60) {
    interpretation = {
      en: `Strong alignment. Your ${personalHadad.element} essence harmonizes well with ${currentPlanet}'s ${currentElement} energy. Good time for spiritual growth and meaningful actions.`,
      fr: `Alignement fort. Votre essence ${personalHadad.element} s'harmonise bien avec l'énergie ${currentElement} de ${currentPlanet}. Bon moment pour la croissance spirituelle et les actions significatives.`,
    };
    recommendations = {
      en: [
        'Pursue spiritual learning',
        'Practice regular dhikr',
        'Work on personal projects',
        'Seek beneficial knowledge',
      ],
      fr: [
        'Poursuivez l\'apprentissage spirituel',
        'Pratiquez le dhikr régulièrement',
        'Travaillez sur des projets personnels',
        'Cherchez une connaissance bénéfique',
      ],
    };
  } else if (overall >= 40) {
    interpretation = {
      en: `Moderate alignment. ${currentPlanet}'s ${currentElement} energy has a neutral relationship with your ${personalHadad.element} essence. Time for balanced activities and reflection.`,
      fr: `Alignement modéré. L'énergie ${currentElement} de ${currentPlanet} a une relation neutre avec votre essence ${personalHadad.element}. Temps pour des activités équilibrées et la réflexion.`,
    };
    recommendations = {
      en: [
        'Maintain regular spiritual practices',
        'Focus on routine tasks',
        'Reflect and contemplate',
        'Prepare for better-aligned hours',
      ],
      fr: [
        'Maintenez des pratiques spirituelles régulières',
        'Concentrez-vous sur les tâches routinières',
        'Réfléchissez et contemplez',
        'Préparez-vous pour des heures mieux alignées',
      ],
    };
  } else {
    interpretation = {
      en: `Challenging alignment. ${currentPlanet}'s ${currentElement} energy opposes your ${personalHadad.element} essence. Time for patience, reflection, and gentle practices.`,
      fr: `Alignement difficile. L'énergie ${currentElement} de ${currentPlanet} s'oppose à votre essence ${personalHadad.element}. Temps pour la patience, la réflexion et les pratiques douces.`,
    };
    recommendations = {
      en: [
        'Practice patience and sabr',
        'Gentle dhikr and remembrance',
        'Avoid major decisions',
        'Rest and spiritual contemplation',
      ],
      fr: [
        'Pratiquez la patience et le sabr',
        'Dhikr doux et rappel',
        'Évitez les décisions majeures',
        'Repos et contemplation spirituelle',
      ],
    };
  }

  return {
    overall,
    breakdown: {
      elementalHarmony,
      planetaryResonance,
      numericalAlignment,
      sacredConnection,
    },
    interpretation,
    recommendations,
  };
}

/**
 * Get optimal hours for the day (sorted by score)
 */
export function getOptimalHours(personalHadad: PersonalHadad): HourOptimality[] {
  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  
  const hourScores = planets.map(planet => {
    const score = calculateAlignmentScore(personalHadad, planet);
    return {
      planet,
      score: score.overall,
      reason: score.interpretation,
    };
  });

  // Sort by score (highest first)
  return hourScores.sort((a, b) => b.score - a.score);
}

/**
 * Get element emoji for visual display
 */
export function getElementEmoji(element: ElementType): string {
  const emojis: Record<ElementType, string> = {
    'Fire': '🔥',
    'Water': '💧',
    'Air': '💨',
    'Earth': '🌍',
  };
  return emojis[element];
}

/**
 * Get alignment quality label
 */
export function getAlignmentQuality(score: number): {
  label: { en: string; fr: string };
  color: string;
  emoji: string;
} {
  if (score >= 80) {
    return {
      label: { en: 'Exceptional', fr: 'Exceptionnel' },
      color: '#10B981', // Green
      emoji: '⭐',
    };
  } else if (score >= 60) {
    return {
      label: { en: 'Strong', fr: 'Fort' },
      color: '#3B82F6', // Blue
      emoji: '✨',
    };
  } else if (score >= 40) {
    return {
      label: { en: 'Moderate', fr: 'Modéré' },
      color: '#F59E0B', // Amber
      emoji: '○',
    };
  } else {
    return {
      label: { en: 'Challenging', fr: 'Difficile' },
      color: '#6B7280', // Gray
      emoji: '▽',
    };
  }
}
