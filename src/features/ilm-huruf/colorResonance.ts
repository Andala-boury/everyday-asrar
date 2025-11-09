/**
 * Name Color Resonance
 * Based on elemental distribution in names
 */

export interface ElementColor {
  element: 'fire' | 'air' | 'water' | 'earth';
  primaryColor: string;
  primaryHex: string;
  secondaryColor: string;
  secondaryHex: string;
  meaningEn: string;
  meaningFr: string;
}

export const ELEMENT_COLORS: Record<'fire' | 'air' | 'water' | 'earth', ElementColor> = {
  fire: {
    element: 'fire',
    primaryColor: 'Red',
    primaryHex: '#F97316',
    secondaryColor: 'Orange',
    secondaryHex: '#FB923C',
    meaningEn: 'Passion, vitality, courage, and transformation',
    meaningFr: 'Passion, vitalité, courage et transformation'
  },
  water: {
    element: 'water',
    primaryColor: 'Blue',
    primaryHex: '#3B82F6',
    secondaryColor: 'Turquoise',
    secondaryHex: '#06B6D4',
    meaningEn: 'Calm, depth, intuition, and emotional wisdom',
    meaningFr: 'Calme, profondeur, intuition et sagesse émotionnelle'
  },
  air: {
    element: 'air',
    primaryColor: 'Yellow',
    primaryHex: '#FACC15',
    secondaryColor: 'Lavender',
    secondaryHex: '#C084FC',
    meaningEn: 'Clarity, communication, intellect, and freedom',
    meaningFr: 'Clarté, communication, intellect et liberté'
  },
  earth: {
    element: 'earth',
    primaryColor: 'Green',
    primaryHex: '#22C55E',
    secondaryColor: 'Brown',
    secondaryHex: '#92400E',
    meaningEn: 'Stability, grounding, growth, and practical wisdom',
    meaningFr: 'Stabilité, ancrage, croissance et sagesse pratique'
  }
};

export interface ColorResonanceResult {
  primary: {
    element: 'fire' | 'air' | 'water' | 'earth';
    percentage: number;
    color: string;
    hex: string;
    meaning: string;
    meaningFr: string;
  };
  secondary?: {
    element: 'fire' | 'air' | 'water' | 'earth';
    percentage: number;
    color: string;
    hex: string;
    meaning: string;
    meaningFr: string;
  };
  bestColorsEn: string[];
  bestColorsFr: string[];
  avoidColorsEn: string[];
  avoidColorsFr: string[];
  tipEn: string;
  tipFr: string;
}

/**
 * Calculate color resonance based on elemental distribution
 */
export function calculateColorResonance(
  elementDistribution: Record<'fire' | 'air' | 'water' | 'earth', number>
): ColorResonanceResult {
  // Sort elements by percentage
  const sorted = Object.entries(elementDistribution)
    .sort(([, a], [, b]) => b - a) as [('fire' | 'air' | 'water' | 'earth'), number][];
  
  const primaryElement = sorted[0][0];
  const primaryPercentage = sorted[0][1];
  const secondaryElement = sorted[1][0];
  const secondaryPercentage = sorted[1][1];
  const weakestElement = sorted[3][0];
  
  const primaryColorData = ELEMENT_COLORS[primaryElement];
  const secondaryColorData = ELEMENT_COLORS[secondaryElement];
  const weakestColorData = ELEMENT_COLORS[weakestElement];
  
  // Generate best colors (primary + secondary)
  const bestColorsEn = [
    primaryColorData.primaryColor,
    primaryColorData.secondaryColor,
    secondaryColorData.primaryColor
  ];
  
  const bestColorsFr = [
    translateColor(primaryColorData.primaryColor),
    translateColor(primaryColorData.secondaryColor),
    translateColor(secondaryColorData.primaryColor)
  ];
  
  // Generate colors to avoid (weakest element colors)
  const avoidColorsEn = [
    weakestColorData.primaryColor,
    weakestColorData.secondaryColor
  ];
  
  const avoidColorsFr = [
    translateColor(weakestColorData.primaryColor),
    translateColor(weakestColorData.secondaryColor)
  ];
  
  // Generate personalized tip
  const tipEn = `Use ${primaryColorData.primaryColor.toLowerCase()} tones for clothing, journaling, or meditation to enhance your natural ${primaryElement} energy. Add ${secondaryColorData.primaryColor.toLowerCase()} accents to balance with your ${secondaryElement} qualities.`;
  
  const tipFr = `Utilisez des tons ${translateColor(primaryColorData.primaryColor).toLowerCase()} pour les vêtements, l'écriture ou la méditation pour renforcer votre énergie ${translateElement(primaryElement)} naturelle. Ajoutez des accents ${translateColor(secondaryColorData.primaryColor).toLowerCase()} pour équilibrer avec vos qualités ${translateElement(secondaryElement)}.`;
  
  return {
    primary: {
      element: primaryElement,
      percentage: primaryPercentage,
      color: primaryColorData.primaryColor,
      hex: primaryColorData.primaryHex,
      meaning: primaryColorData.meaningEn,
      meaningFr: primaryColorData.meaningFr
    },
    secondary: secondaryPercentage > 0 ? {
      element: secondaryElement,
      percentage: secondaryPercentage,
      color: secondaryColorData.primaryColor,
      hex: secondaryColorData.primaryHex,
      meaning: secondaryColorData.meaningEn,
      meaningFr: secondaryColorData.meaningFr
    } : undefined,
    bestColorsEn,
    bestColorsFr,
    avoidColorsEn,
    avoidColorsFr,
    tipEn,
    tipFr
  };
}

/**
 * Translate color name to French
 */
function translateColor(color: string): string {
  const translations: Record<string, string> = {
    'Red': 'Rouge',
    'Orange': 'Orange',
    'Blue': 'Bleu',
    'Turquoise': 'Turquoise',
    'Yellow': 'Jaune',
    'Lavender': 'Lavande',
    'Green': 'Vert',
    'Brown': 'Marron'
  };
  return translations[color] || color;
}

/**
 * Translate element name to French
 */
function translateElement(element: string): string {
  const translations: Record<string, string> = {
    'fire': 'feu',
    'air': 'air',
    'water': 'eau',
    'earth': 'terre'
  };
  return translations[element] || element;
}

/**
 * Get element icon
 */
export function getElementIcon(element: 'fire' | 'air' | 'water' | 'earth'): string {
  const icons = {
    fire: '🔥',
    air: '🌬️',
    water: '💧',
    earth: '🌍'
  };
  return icons[element];
}
