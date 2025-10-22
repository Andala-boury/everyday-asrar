// hadad-core.ts - Pure calculation helpers

import { ElementType, RuhHadad, UmHadad, SacredResonance } from './types';

// ============================================================================
// ABJAD MAPPING (Maghrib standard)
// ============================================================================

export const ABJAD: Record<string, number> = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
  'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000
};

export const LETTER_ELEMENTS: Record<string, ElementType> = {
  'ا': 'Fire', 'ه': 'Fire', 'ط': 'Fire', 'م': 'Fire', 'ف': 'Fire', 'ص': 'Fire',
  'ب': 'Water', 'و': 'Water', 'ي': 'Water', 'ن': 'Water',
  'ج': 'Air', 'ز': 'Air', 'ك': 'Air', 'س': 'Air', 'ق': 'Air', 'ش': 'Air',
  'd': 'Earth', 'ل': 'Earth', 'ع': 'Earth', 'ر': 'Earth', 'ت': 'Earth', 
  'ث': 'Earth', 'خ': 'Earth', 'ذ': 'Earth', 'ض': 'Earth', 'ظ': 'Earth', 'غ': 'Earth'
};

// ============================================================================
// CORE CALCULATIONS
// ============================================================================

/**
 * Digital root (Ṣaghīr): reduces to 1-9
 */
export const digitalRoot = (n: number): number => {
  if (n === 0) return 0;
  return 1 + ((n - 1) % 9);
};

/**
 * Aṣghar: reduce twice (rarely used, but available)
 */
export const asghar = (n: number): number => {
  return digitalRoot(digitalRoot(n));
};

/**
 * Ḥadath: remainder when divided by 4
 */
export const hadathRemainder = (n: number): 0 | 1 | 2 | 3 => {
  return (n % 4) as 0 | 1 | 2 | 3;
};

/**
 * Map Ḥadath remainder to element (Maghrib mapping)
 * 0→Earth, 1→Fire, 2→Water, 3→Air
 */
export const hadathToElement = (r: 0 | 1 | 2 | 3): ElementType => {
  const map = { 0: 'Earth', 1: 'Fire', 2: 'Water', 3: 'Air' } as const;
  return map[r];
};

/**
 * Element of a single letter
 */
export const elementOfLetter = (ch: string): ElementType => {
  return LETTER_ELEMENTS[ch] || 'Earth'; // default to Earth if unknown
};

/**
 * Signature: reduce each step to its digital root
 */
export const signatureReduce = (steps: { value: number }[]): number[] => {
  return steps.map(s => digitalRoot(s.value));
};

/**
 * Rūḥ Ḥadad: (Kabīr + Ṣaghīr) / 2, then analyze
 */
export const ruhHadad = (total: number): RuhHadad => {
  const saghir = digitalRoot(total);
  const r = Math.floor((total + saghir) / 2);
  return {
    value: r,
    root: digitalRoot(r),
    element: hadathToElement(hadathRemainder(r))
  };
};

/**
 * Um Ḥadad: combine with mother's total
 */
export const withMother = (total: number, motherTotal: number): UmHadad => {
  const t = total + motherTotal;
  return {
    total: t,
    root: digitalRoot(t),
    hadath: hadathToElement(hadathRemainder(t))
  };
};

// ============================================================================
// SACRED NUMBERS
// ============================================================================

export const sacredSet = [7, 12, 19, 70, 99, 114, 313, 786];

export const nearestSacred = (n: number): SacredResonance => {
  const nearest = sacredSet.reduce((best, x) => 
    Math.abs(x - n) < Math.abs(best - n) ? x : best, 
    sacredSet[0]
  );
  
  return {
    nearest,
    delta: n - nearest,
    div7: n % 7 === 0,
    div19: n % 19 === 0,
    div99: n % 99 === 0
  };
};

export const sacredSignificance: Record<number, string> = {
  7: 'Seven heavens, seven days of creation',
  12: 'Twelve Imams, twelve months',
  19: 'Numerical miracle of the Quran',
  70: 'Surah Yā-Sīn (يس)',
  99: 'Asmā\' al-Ḥusnā (Beautiful Names)',
  114: 'Surahs in the Quran',
  313: 'Companions at Badr',
  786: 'Bismillah value (short form)'
};

// ============================================================================
// ELEMENT INFO
// ============================================================================

export const ELEMENT_INFO = {
  Fire: {
    icon: '🔥',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    label: 'Fire',
    quality: 'Transformative, Initiating',
    planet: 'Mars',
    day: 'Tuesday',
    hours: ['Sunrise', 'Noon']
  },
  Water: {
    icon: '💧',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: 'Water',
    quality: 'Flowing, Adaptive',
    planet: 'Moon',
    day: 'Monday',
    hours: ['Night', 'Fajr']
  },
  Air: {
    icon: '🌬',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    label: 'Air',
    quality: 'Intellectual, Communicative',
    planet: 'Mercury',
    day: 'Wednesday',
    hours: ['Dawn', 'Morning']
  },
  Earth: {
    icon: '🌍',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    label: 'Earth',
    quality: 'Grounding, Stable',
    planet: 'Saturn',
    day: 'Saturday',
    hours: ['Dusk', 'Night']
  }
};

// ============================================================================
// ASMA' AL-HUSNA (Built-in mini list)
// ============================================================================

export const ASMA_LIST = [
  { ar: 'يَا فَتَّاح', transliteration: 'Yā Fattāḥ', en: 'The Opener', abjad: 489, element: 'Fire' as ElementType, counts: [33, 66, 99] },
  { ar: 'يَا قَوِيّ', transliteration: 'Yā Qawiyy', en: 'The Strong', abjad: 117, element: 'Fire' as ElementType, counts: [11, 33, 111] },
  { ar: 'يَا نُور', transliteration: 'Yā Nūr', en: 'The Light', abjad: 266, element: 'Fire' as ElementType, counts: [33, 99, 266] },
  { ar: 'يَا رَحِيم', transliteration: 'Yā Raḥīm', en: 'The Merciful', abjad: 258, element: 'Water' as ElementType, counts: [47, 100, 258] },
  { ar: 'يَا حَلِيم', transliteration: 'Yā Ḥalīm', en: 'The Forbearing', abjad: 88, element: 'Water' as ElementType, counts: [88, 100] },
  { ar: 'يَا وَدُود', transliteration: 'Yā Wadūd', en: 'The Loving', abjad: 30, element: 'Water' as ElementType, counts: [30, 99] },
  { ar: 'يَا عَلِيم', transliteration: 'Yā ʿAlīm', en: 'The All-Knowing', abjad: 150, element: 'Air' as ElementType, counts: [150, 300] },
  { ar: 'يَا حَكِيم', transliteration: 'Yā Ḥakīm', en: 'The Wise', abjad: 78, element: 'Air' as ElementType, counts: [78, 100] },
  { ar: 'يَا لَطِيف', transliteration: 'Yā Laṭīf', en: 'The Subtle', abjad: 129, element: 'Air' as ElementType, counts: [129, 300] },
  { ar: 'يَا صَبُور', transliteration: 'Yā Ṣabūr', en: 'The Patient', abjad: 298, element: 'Earth' as ElementType, counts: [298, 500] },
  { ar: 'يَا مَتِين', transliteration: 'Yā Matīn', en: 'The Firm', abjad: 500, element: 'Earth' as ElementType, counts: [500, 1000] },
  { ar: 'يَا قَيُّوم', transliteration: 'Yā Qayyūm', en: 'The Sustainer', abjad: 156, element: 'Earth' as ElementType, counts: [156, 300] }
];

// ============================================================================
// VERSES BY ELEMENT
// ============================================================================

export const VERSES_BY_ELEMENT = {
  Fire: [
    { ref: '94:6', text: 'Indeed, with hardship comes ease', context: 'Patience through transformation' },
    { ref: '21:69', text: 'We said: O fire, be coolness and peace', context: 'Divine protection' },
    { ref: '55:14', text: 'Created man from clay like pottery', context: 'Creation through fire' }
  ],
  Water: [
    { ref: '21:30', text: 'We made every living thing from water', context: 'Source of life' },
    { ref: '25:48', text: 'We send the winds as glad tidings', context: 'Purification and renewal' },
    { ref: '65:2', text: 'Allah will bring about ease after hardship', context: 'Flow and adaptation' }
  ],
  Air: [
    { ref: '2:164', text: 'The winds that blow, the clouds between sky and earth', context: 'Divine signs' },
    { ref: '15:22', text: 'We send the winds to fertilize', context: 'Communication and connection' },
    { ref: '49:6', text: 'Verify before acting on information', context: 'Clarity and discernment' }
  ],
  Earth: [
    { ref: '55:10', text: 'And the earth He has laid for all beings', context: 'Foundation and sustenance' },
    { ref: '20:53', text: 'Who made the earth a resting place', context: 'Stability and grounding' },
    { ref: '11:115', text: 'Be patient, for Allah does not waste the reward', context: 'Perseverance' }
  ]
};

// ============================================================================
// GUIDANCE TEXT BY ELEMENT & ROOT
// ============================================================================

export const getGuidanceText = (element: ElementType, root: number): string => {
  const base = {
    Fire: 'Transformative drive and creativity.',
    Water: 'Empathy and emotional depth.',
    Air: 'Intellectual clarity and communication.',
    Earth: 'Stability and practical grounding.'
  }[element];
  
  const rootAdvice = root <= 3 
    ? 'Balance by scheduling gentle breaks.' 
    : root <= 6 
    ? 'Channel your energy into focused practice.'
    : 'Maintain equilibrium through regular reflection.';
  
  return `${base} ${rootAdvice}`;
};

// ============================================================================
// MAGIC GRID (Educational)
// ============================================================================

export const generateMagicGrid = (seed: number): number[][] => {
  const grid: number[][] = [];
  let current = seed;
  
  for (let i = 0; i < 3; i++) {
    const row: number[] = [];
    for (let j = 0; j < 3; j++) {
      row.push(current);
      current++;
    }
    grid.push(row);
  }
  
  return grid;
};
