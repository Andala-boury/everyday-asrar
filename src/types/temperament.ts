/**
 * Enhanced Temperament System - Psychological & Career Guidance
 * Bilingual (EN/FR) - Modern, non-spiritual approach
 */

export type TemperamentElement = 'fire' | 'water' | 'air' | 'earth';

/**
 * Psychological profile for each temperament
 */
export interface TemperamentPsychology {
  // Core traits
  traits: string[];
  traitsFr: string[];
  
  // Positive qualities
  strengths: string[];
  strengthsFr: string[];
  
  // Common pitfalls to watch
  watchOuts: string[];
  watchOutsFr: string[];
  
  // Simple balance guidance
  balanceTips: string[];
  balanceTipsFr: string[];
}

/**
 * Career guidance for each temperament
 */
export interface TemperamentCareer {
  // Good career fits
  goodFits: string[];
  goodFitsFr: string[];
  
  // Areas to avoid (soft tone)
  avoid: string[];
  avoidFr: string[];
  
  // Brief explanation
  rationale: string;
  rationaleFr: string;
}

/**
 * Complete temperament profile
 */
export interface TemperamentProfile {
  element: TemperamentElement;
  
  // Classical info (existing)
  name: string;
  nameFr: string;
  nameAr: string;
  icon: string;
  quality: string; // e.g., "Hot & Dry"
  qualityFr: string;
  
  // NEW: Psychological profile
  psychology: TemperamentPsychology;
  
  // NEW: Career guidance
  career: TemperamentCareer;
}

/**
 * Complete temperament data repository
 */
export interface TemperamentData {
  fire: TemperamentProfile;
  water: TemperamentProfile;
  air: TemperamentProfile;
  earth: TemperamentProfile;
}
