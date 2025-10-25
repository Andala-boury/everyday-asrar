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
export const PLANETARY_SEQUENCES: Record<number, string[]> = {
  0: [ // Sunday - Sun's day
    'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars',
    'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars',
    'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars',
    'Sun', 'Venus', 'Mercury'
  ],
  1: [ // Monday - Moon's day
    'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury',
    'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury',
    'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury',
    'Moon', 'Saturn', 'Jupiter'
  ],
  2: [ // Tuesday - Mars' day
    'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter',
    'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter',
    'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter',
    'Mars', 'Sun', 'Venus'
  ],
  3: [ // Wednesday - Mercury's day
    'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus',
    'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus',
    'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus',
    'Mercury', 'Moon', 'Saturn'
  ],
  4: [ // Thursday - Jupiter's day
    'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn',
    'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn',
    'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn',
    'Jupiter', 'Mars', 'Sun'
  ],
  5: [ // Friday - Venus' day
    'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun',
    'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun',
    'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun',
    'Venus', 'Mercury', 'Moon'
  ],
  6: [ // Saturday - Saturn's day
    'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon',
    'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon',
    'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon',
    'Saturn', 'Jupiter', 'Mars'
  ]
};
