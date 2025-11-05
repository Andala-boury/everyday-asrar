import { ElementAlignment, TimeWindow } from './planetary';

// Compatibility calculation modes
export type CompatibilityMode = 'transit' | 'relationship';

// The three calculation methods
export type CompatibilityMethod = 'spiritual-destiny' | 'elemental-temperament' | 'planetary-cosmic';

// Spiritual-Destiny results (Mod-9)
export interface SpiritualDestinyResult {
  method: 'spiritual-destiny';
  methodArabic: 'الطريقة الروحانية';
  remainder: number; // 1-9
  score: number; // 0-100
  quality: 'excellent' | 'good' | 'moderate' | 'challenging' | 'completion';
  qualityArabic: string;
  qualityFrench: string;
  description: string;
  descriptionFrench: string;
  descriptionArabic: string;
  color: string;
}

// Elemental-Temperament results (Mod-4)
export interface ElementalTemperamentResult {
  method: 'elemental-temperament';
  methodArabic: 'طريقة الطبائع الأربع';
  remainder: number; // 1-4
  sharedElement: 'fire' | 'water' | 'air' | 'earth';
  sharedElementArabic: string;
  sharedElementFrench: string;
  score: number; // 0-100
  quality: 'harmonious' | 'complementary' | 'balanced' | 'dynamic';
  qualityArabic: string;
  qualityFrench: string;
  description: string;
  descriptionFrench: string;
  descriptionArabic: string;
  color: string;
}

// Planetary-Cosmic results
export interface PlanetaryCosmicResult {
  method: 'planetary-cosmic';
  methodArabic: 'الطريقة الكوكبية';
  person1Planet: {
    name: string;
    nameArabic: string;
    element: 'fire' | 'water' | 'air' | 'earth';
  };
  person2Planet: {
    name: string;
    nameArabic: string;
    element: 'fire' | 'water' | 'air' | 'earth';
  };
  relationship: 'friendly' | 'neutral' | 'opposing';
  relationshipArabic: string;
  relationshipFrench: string;
  score: number; // 0-100
  quality: 'excellent' | 'good' | 'moderate' | 'challenging';
  qualityArabic: string;
  qualityFrench: string;
  description: string;
  descriptionFrench: string;
  descriptionArabic: string;
  color: string;
}

// Combined relationship compatibility result
export interface RelationshipCompatibility {
  mode: 'relationship';
  person1: {
    name: string;
    arabicName: string;
    abjadTotal: number;
    element: 'fire' | 'water' | 'air' | 'earth';
  };
  person2: {
    name: string;
    arabicName: string;
    abjadTotal: number;
    element: 'fire' | 'water' | 'air' | 'earth';
  };
  methods: {
    spiritualDestiny: SpiritualDestinyResult;
    elementalTemperament: ElementalTemperamentResult;
    planetaryCosmic: PlanetaryCosmicResult;
  };
  overallScore: number; // Average of 3 methods, 0-100
  overallQuality: 'excellent' | 'very-good' | 'good' | 'moderate' | 'challenging';
  overallQualityArabic: string;
  overallQualityFrench: string;
  summary: string;
  summaryFrench: string;
  summaryArabic: string;
  recommendations: string[];
  recommendationsFrench: string[];
  recommendationsArabic: string[];
}

// Transit compatibility (existing, but updated)
export interface TransitCompatibility {
  mode: 'transit';
  user: {
    element: 'fire' | 'water' | 'air' | 'earth';
  };
  currentHour: {
    planet: string;
    planetArabic: string;
    element: 'fire' | 'water' | 'air' | 'earth';
  };
  alignment: ElementAlignment; // Your existing type
  timeWindow: TimeWindow; // Your existing type
}
