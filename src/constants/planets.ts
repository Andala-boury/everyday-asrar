import { PlanetInfo } from '../types/planetary';

export const PLANET_INFO: Record<string, PlanetInfo> = {
  Sun: { 
    name: 'Sun', 
    nameArabic: 'الشمس', 
    element: 'fire', 
    elementArabic: 'نار' 
  },
  Moon: { 
    name: 'Moon', 
    nameArabic: 'القمر', 
    element: 'water', 
    elementArabic: 'ماء' 
  },
  Mars: { 
    name: 'Mars', 
    nameArabic: 'المريخ', 
    element: 'fire', 
    elementArabic: 'نار' 
  },
  Mercury: { 
    name: 'Mercury', 
    nameArabic: 'عطارد', 
    element: 'air', 
    elementArabic: 'هواء' 
  },
  Jupiter: { 
    name: 'Jupiter', 
    nameArabic: 'المشتري', 
    element: 'air', 
    elementArabic: 'هواء' 
  },
  Venus: { 
    name: 'Venus', 
    nameArabic: 'الزهرة', 
    element: 'earth', 
    elementArabic: 'تراب' 
  },
  Saturn: { 
    name: 'Saturn', 
    nameArabic: 'زحل', 
    element: 'earth', 
    elementArabic: 'تراب' 
  }
};

// Classical planetary sequence by day of week
// Sunday = 0, Monday = 1, etc.
// Each sequence has 24 elements: 12 for day hours (indices 0-11), 12 for night hours (indices 12-23)
export const PLANETARY_SEQUENCES: Record<number, string[]> = {
  0: [ // Sunday - Sun's day
    // Day hours (12)
    'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn',
    // Night hours (12)
    'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury'
  ],
  1: [ // Monday - Moon's day
    // Day hours (12)
    'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun',
    // Night hours (12)
    'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter'
  ],
  2: [ // Tuesday - Mars' day
    // Day hours (12)
    'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon',
    // Night hours (12)
    'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus'
  ],
  3: [ // Wednesday - Mercury's day
    // Day hours (12)
    'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars',
    // Night hours (12)
    'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn'
  ],
  4: [ // Thursday - Jupiter's day
    // Day hours (12)
    'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury',
    // Night hours (12)
    'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun'
  ],
  5: [ // Friday - Venus' day
    // Day hours (12)
    'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter',
    // Night hours (12)
    'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'
  ],
  6: [ // Saturday - Saturn's day
    // Day hours (12)
    'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus',
    // Night hours (12)
    'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'
  ]
};
