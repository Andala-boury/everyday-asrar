'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Star, Heart, BookOpen, Lightbulb, 
  Calendar, Clock, Compass, Users, Sparkles,
  TrendingUp, Target, MessageCircle, Home, Flame, Keyboard, ExternalLink,
  Plus, Info, X, ArrowUp, Circle, Minus, Zap, CheckCircle2, User
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BalanceMeter } from '../../components/BalanceMeter';
import type { ElementType } from '../../components/BalanceMeter';
import { HarmonyTooltip, type HarmonyBreakdown } from '../../components/HarmonyTooltip';
import { InfoTooltip } from '../../components/InfoTooltip';
import { GlossaryModal } from '../../components/GlossaryModal';
import { CalculationBreakdownModal } from '../../components/CalculationBreakdownModal';
import { ActNowButtons } from '../../components/ActNowButtons';
import { DailyColorGuidanceCard } from '../../components/DailyColorGuidanceCard';
import NameAutocomplete from '../../components/NameAutocomplete';
import { TemperamentDisplay } from '../../components/TemperamentDisplay';
import {
  analyzeNameDestiny,
  analyzeCompatibility,
  calculateLifePath,
  calculatePersonalYear,
  calculatePlanetaryHour,
  getDailyDhikr,
  SPIRITUAL_STATIONS,
  PLANET_DAYS,
  type Planet,
  calculateUserProfile,
  generateWeeklySummary,
  calculateHarmonyType,
  calculateDominantForce,
  getBalanceTip,
  calculateHarmonyBreakdown,
  type UserProfile,
  type WeeklySummary as WeeklySummaryType,
  type DailyReading,
  type HarmonyType,
  type DominantForce as DominantForceType,
  analyzeMotherName,
  generateInheritanceInsight,
  type MotherAnalysis,
  type GeometryAnalysis,
  type GeometryType,
  GEOMETRY_NAMES,
  GEOMETRY_KEYWORDS,
  getCurrentPlanetaryHour,
  detectAlignment,
  calculateTimeWindow,
  generateActionButtons,
  ELEMENT_GUIDANCE_MAP,
  getElementArabicName,
  calculateDailyColorGuidance,
  type CurrentPlanetaryHour,
  type ElementAlignment,
  type TimeWindow,
  type ActionButton,
  type AlignmentQuality,
  type ElementType2,
  type DailyColorGuidance,
  // New imports for Name Destiny module
  buildDestiny,
  type NameDestinyResult,
  BURUJ,
  ELEMENTS,
  PLANETARY_HOURS,
} from './core';
import { getQuranResonanceMessage } from './quranResonance';
import { fetchQuranVerse, type VerseText } from './quranApi';
import { transliterateLatinToArabic } from '../../lib/text-normalize';
import { ArabicKeyboard } from '../../components/ArabicKeyboard';
import { useAbjad } from '../../contexts/AbjadContext';
import { AbjadSystemSelector } from '../../components/AbjadSystemSelector';
import { analyzeRelationshipCompatibility, getElementFromAbjadTotal } from '../../utils/relationshipCompatibility';
import { analyzeFourLayerCompatibility } from '../../utils/fourLayerCompatibility';
import type { RelationshipCompatibility, FourLayerCompatibility } from '../../types/compatibility';
import { CompatibilityGauge } from '../../components/CompatibilityGauge';
import { EnhancedLifePathView } from '../../components/EnhancedLifePathView';
import {
  calculateEnhancedLifePath,
  calculateLifePathNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculateDestinyNumber,
  calculateLifeCycle,
  calculatePersonalYear as calculatePersonalYearEnhanced,
  calculatePersonalMonth,
  detectKarmicDebts,
  detectSacredNumbers,
  calculatePinnaclesAndChallenges,
  type EnhancedLifePathResult,
  type LifeCycleAnalysis,
  type PinnacleChallenge
} from '../../utils/enhancedLifePath';
import { DivineTiming } from '../../components/divine-timing';

// ============================================================================
// ELEMENT HARMONY & LETTER CHEMISTRY CONSTANTS
// ============================================================================

// Element harmony scores (0-1 scale)
const ELEMENT_HARMONY: Record<string, Record<string, number>> = {
  fire: { fire: 0.95, air: 0.85, water: 0.45, earth: 0.60 },
  air: { fire: 0.85, air: 0.95, water: 0.70, earth: 0.50 },
  water: { fire: 0.45, air: 0.70, water: 0.95, earth: 0.85 },
  earth: { fire: 0.60, air: 0.50, water: 0.85, earth: 0.95 }
};

// Letter to Element mapping (28 Arabic letters)
const LETTER_ELEMENTS: Record<string, 'fire' | 'air' | 'water' | 'earth'> = {
  // Fire letters (hot & dry): Ø§ Ø¯ Ø· Ù… Ù Ø´ Ø°
  'Ø§': 'fire', 'Ø¯': 'fire', 'Ø·': 'fire', 'Ù…': 'fire', 'Ù': 'fire', 'Ø´': 'fire', 'Ø°': 'fire',
  // Air letters (hot & wet): Ù‡ Ùˆ ÙŠ Ù† Øµ Øª Ø¶  
  'Ù‡': 'air', 'Ùˆ': 'air', 'ÙŠ': 'air', 'Ù†': 'air', 'Øµ': 'air', 'Øª': 'air', 'Ø¶': 'air',
  // Water letters (cold & wet): Ø¨ Ø­ Ù„ Ø¹ Ø± Ùƒ Øº
  'Ø¨': 'water', 'Ø­': 'water', 'Ù„': 'water', 'Ø¹': 'water', 'Ø±': 'water', 'Ùƒ': 'water', 'Øº': 'water',
  // Earth letters (cold & dry): Ø¬ Ø² Ø³ Ù‚ Ø« Ø® Ø¸
  'Ø¬': 'earth', 'Ø²': 'earth', 'Ø³': 'earth', 'Ù‚': 'earth', 'Ø«': 'earth', 'Ø®': 'earth', 'Ø¸': 'earth'
};

// Helper function to get balance advice key from element pair
function getBalanceAdviceKey(element1: 'fire' | 'air' | 'water' | 'earth', element2: 'fire' | 'air' | 'water' | 'earth'): string {
  const pairs: Record<string, string> = {
    'fire-fire': 'fireFire',
    'fire-air': 'fireAir',
    'air-fire': 'fireAir',
    'fire-water': 'fireWater',
    'water-fire': 'fireWater',
    'fire-earth': 'fireEarth',
    'earth-fire': 'fireEarth',
    'air-air': 'airAir',
    'air-water': 'airWater',
    'water-air': 'airWater',
    'air-earth': 'airEarth',
    'earth-air': 'airEarth',
    'water-water': 'waterWater',
    'water-earth': 'waterEarth',
    'earth-water': 'waterEarth',
    'earth-earth': 'earthEarth'
  };
  return pairs[`${element1}-${element2}`] || 'fireFire';
}

// Helper function to get dhikr effect key
function getDhikrEffectKey(element: 'fire' | 'air' | 'water' | 'earth'): string {
  const keys: Record<string, string> = {
    fire: 'fireEffect',
    air: 'airEffect',
    water: 'waterEffect',
    earth: 'earthEffect'
  };
  return keys[element];
}

// Divine Names for each element (these are proper names, don't translate)
const DHIKR_NAMES: Record<'fire' | 'air' | 'water' | 'earth', { name: string; nameFr: string; nameAr: string }> = {
  fire: { name: 'YÄ Laá¹­Ä«f (ÙŠØ§ Ù„Ø·ÙŠÙ)', nameFr: 'YÄ Laá¹­Ä«f (ÙŠØ§ Ù„Ø·ÙŠÙ)', nameAr: 'ÙŠØ§ Ù„Ø·ÙŠÙ' },
  air: { name: 'YÄ á¸¤akÄ«m (ÙŠØ§ Ø­ÙƒÙŠÙ…)', nameFr: 'YÄ á¸¤akÄ«m (ÙŠØ§ Ø­ÙƒÙŠÙ…)', nameAr: 'ÙŠØ§ Ø­ÙƒÙŠÙ…' },
  water: { name: 'YÄ NÅ«r (ÙŠØ§ Ù†ÙˆØ±)', nameFr: 'YÄ NÅ«r (ÙŠØ§ Ù†ÙˆØ±)', nameAr: 'ÙŠØ§ Ù†ÙˆØ±' },
  earth: { name: 'YÄ FattÄá¸¥ (ÙŠØ§ ÙØªØ§Ø­)', nameFr: 'YÄ FattÄá¸¥ (ÙŠØ§ ÙØªØ§Ø­)', nameAr: 'ÙŠØ§ ÙØªØ§Ø­' }
};

// Helper function to calculate element distribution from Arabic text
function calculateElementDistribution(arabicText: string): Record<'fire' | 'air' | 'water' | 'earth', number> {
  const normalized = arabicText.replace(/[Ù‹ÙŒÙÙŽÙÙÙ‘Ù’\s]/g, '');
  const letters = [...normalized];
  const total = letters.length;
  
  const counts = { fire: 0, air: 0, water: 0, earth: 0 };
  
  letters.forEach(letter => {
    const element = LETTER_ELEMENTS[letter];
    if (element) {
      counts[element]++;
    }
  });
  
  return {
    fire: total > 0 ? Math.round((counts.fire / total) * 100) : 0,
    air: total > 0 ? Math.round((counts.air / total) * 100) : 0,
    water: total > 0 ? Math.round((counts.water / total) * 100) : 0,
    earth: total > 0 ? Math.round((counts.earth / total) * 100) : 0
  };
}

// Helper function to get dominant element
function getDominantElement(distribution: Record<'fire' | 'air' | 'water' | 'earth', number>): 'fire' | 'air' | 'water' | 'earth' {
  let max = 0;
  let dominant: 'fire' | 'air' | 'water' | 'earth' = 'fire';
  
  (Object.entries(distribution) as [typeof dominant, number][]).forEach(([element, percentage]) => {
    if (percentage > max) {
      max = percentage;
      dominant = element;
    }
  });
  
  return dominant;
}

// Helper function to get element icon
function getElementIcon(element: 'fire' | 'air' | 'water' | 'earth'): string {
  const icons = { fire: 'ðŸ”¥', air: 'ðŸ’¨', water: 'ðŸ’§', earth: 'ðŸŒ' };
  return icons[element];
}

// Helper function to get element name in multiple languages
function getElementName(element: 'fire' | 'air' | 'water' | 'earth', lang: 'en' | 'fr' | 'ar'): string {
  const names = {
    fire: { en: 'Fire', fr: 'Feu', ar: 'Ø§Ù„Ù†Ø§Ø±' },
    air: { en: 'Air', fr: 'Air', ar: 'Ø§Ù„Ù‡ÙˆØ§Ø¡' },
    water: { en: 'Water', fr: 'Eau', ar: 'Ø§Ù„Ù…Ø§Ø¡' },
    earth: { en: 'Earth', fr: 'Terre', ar: 'Ø§Ù„Ø£Ø±Ø¶' }
  };
  return names[element][lang];
}

/**
 * Get current day's element based on planetary day assignment
 * Sun=Fire, Mon=Water, Tue=Fire, Wed=Air, Thu=Water, Fri=Air, Sat=Earth
 * Based on classical planetary day rulership
 */
function getCurrentDayElement(): ElementType {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, etc.
  const dayElements: ElementType[] = ['Fire', 'Water', 'Fire', 'Air', 'Water', 'Air', 'Earth'];
  return dayElements[dayOfWeek];
}

const PLANET_ICONS: Record<Planet, typeof Sun> = {
  Sun, Moon,
  Mercury: MessageCircle,
  Venus: Heart,
  Mars: Flame,
  Jupiter: Star,
  Saturn: Compass
};

const PLANET_COLORS: Record<Planet, string> = {
  Sun: 'text-yellow-500',
  Moon: 'text-blue-300',
  Mercury: 'text-purple-500',
  Venus: 'text-pink-500',
  Mars: 'text-red-500',
  Jupiter: 'text-indigo-500',
  Saturn: 'text-slate-600'
};

const PLANET_ICONS_EMOJI: Record<Planet, string> = {
  Sun: 'â˜€ï¸',
  Moon: 'ðŸŒ™',
  Mars: 'â™‚ï¸',
  Mercury: 'â˜¿ï¸',
  Jupiter: 'â™ƒ',
  Venus: 'â™€ï¸',
  Saturn: 'â™„'
};

export function IlmHurufPanel() {
  const { t, language } = useLanguage();
  const { abjad } = useAbjad(); // Get the current Abjad system
  const [mode, setMode] = useState<'destiny' | 'compatibility' | 'timing' | 'life-path'>('destiny');
  const [name, setName] = useState('');
  const [name2, setName2] = useState('');
  const [latinInput, setLatinInput] = useState('');
  const [latinInput2, setLatinInput2] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showKeyboard2, setShowKeyboard2] = useState(false);
  const [translitConfidence, setTranslitConfidence] = useState<number | null>(null);
  const [translitWarnings, setTranslitWarnings] = useState<string[]>([]);
  const [birthDate, setBirthDate] = useState('');
  const [results, setResults] = useState<any>(null);
  
  // Mother's name feature (Um á¸¤adad)
  const [motherName, setMotherName] = useState('');
  const [motherLatinInput, setMotherLatinInput] = useState('');
  const [showMotherNameSection, setShowMotherNameSection] = useState(false);
  const [showMotherKeyboard, setShowMotherKeyboard] = useState(false);

  // Four-layer compatibility: Mother's names for both people
  const [motherName2, setMotherName2] = useState('');
  const [motherLatinInput2, setMotherLatinInput2] = useState('');
  const [showMotherNameSection1, setShowMotherNameSection1] = useState(false);
  const [showMotherNameSection2, setShowMotherNameSection2] = useState(false);
  const [showMotherKeyboard1, setShowMotherKeyboard1] = useState(false);
  const [showMotherKeyboard2Compat, setShowMotherKeyboard2Compat] = useState(false);
  const [compatibilityAnalysisMode, setCompatibilityAnalysisMode] = useState<'quick' | 'complete'>('quick');

  // Modal states for educational features
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [showGlossaryModal, setShowGlossaryModal] = useState(false);

  // Refs for auto-scroll and animations
  const formSectionRef = useRef<HTMLDivElement>(null);
  const [highlightInput, setHighlightInput] = useState(false);

  // Clear results when mode changes to prevent showing stale data
  useEffect(() => {
    setResults(null);
  }, [mode]);

  // Handle mode change with auto-scroll and highlight animation
  const handleModeChange = (newMode: 'destiny' | 'compatibility' | 'timing' | 'life-path') => {
    setMode(newMode);
    setHighlightInput(true);
    
    // Trigger smooth scroll to input section after brief delay
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }, 100);
    
    // Remove highlight animation after it completes
    setTimeout(() => {
      setHighlightInput(false);
    }, 2000);
  };

  const handleLatinInput = (value: string, isFirstName: boolean = true) => {
    if (isFirstName) {
      setLatinInput(value);
    } else {
      setLatinInput2(value);
    }
    
    if (value.trim()) {
      const result = transliterateLatinToArabic(value);
      if (isFirstName) {
        setName(result.primary);
        setTranslitConfidence(result.confidence);
        setTranslitWarnings(result.warnings);
      } else {
        setName2(result.primary);
      }
    } else {
      if (isFirstName) {
        setName('');
        setTranslitConfidence(null);
        setTranslitWarnings([]);
      } else {
        setName2('');
      }
    }
  };

  const handleKeyboardPress = (char: string, isFirstName: boolean = true) => {
    const currentName = isFirstName ? name : name2;
    
    if (char === 'âŒ«') {
      // Backspace
      const newValue = currentName.slice(0, -1);
      if (isFirstName) {
        setName(newValue);
        setLatinInput(''); // Clear latin when typing Arabic
      } else {
        setName2(newValue);
        setLatinInput2('');
      }
    } else if (char === 'âŽµ') {
      // Space
      if (isFirstName) {
        setName(currentName + ' ');
      } else {
        setName2(currentName + ' ');
      }
    } else {
      // Regular character
      if (isFirstName) {
        setName(currentName + char);
        setLatinInput(''); // Clear latin when typing Arabic
      } else {
        setName2(currentName + char);
        setLatinInput2('');
      }
    }
  };

  const handleMotherLatinInput = (value: string) => {
    setMotherLatinInput(value);
    if (value.trim()) {
      const result = transliterateLatinToArabic(value);
      setMotherName(result.primary);
    } else {
      setMotherName('');
    }
  };

  const handleMotherKeyboardPress = (char: string) => {
    if (char === 'âŒ«') {
      // Backspace
      setMotherName(motherName.slice(0, -1));
      setMotherLatinInput('');
    } else if (char === 'âŽµ') {
      // Space
      setMotherName(motherName + ' ');
    } else {
      // Regular character
      setMotherName(motherName + char);
      setMotherLatinInput('');
    }
  };

  // Keyboard handlers for compatibility mode mother's names
  const handleMotherKeyboardPress1 = (char: string) => {
    if (char === 'âŒ«') {
      setMotherName(motherName.slice(0, -1));
      setMotherLatinInput('');
    } else if (char === 'âŽµ') {
      setMotherName(motherName + ' ');
    } else {
      setMotherName(motherName + char);
      setMotherLatinInput('');
    }
  };

  const handleMotherKeyboardPress2 = (char: string) => {
    if (char === 'âŒ«') {
      setMotherName2(motherName2.slice(0, -1));
      setMotherLatinInput2('');
    } else if (char === 'âŽµ') {
      setMotherName2(motherName2 + ' ');
    } else {
      setMotherName2(motherName2 + char);
      setMotherLatinInput2('');
    }
  };

  const handleAnalyze = () => {
    try {
      if (mode === 'destiny' && name) {
        const result: any = analyzeNameDestiny(name, abjad);
        
        // Add mother's name analysis if provided
        if (motherName.trim()) {
          try {
            const motherAnalysis = analyzeMotherName(motherName, abjad);
            result.motherAnalysis = motherAnalysis;
          } catch (error) {
            console.error('Error analyzing mother\'s name:', error);
            // Continue without mother analysis if it fails
          }
        }
        
        // ENHANCEMENT: Add complete Name Destiny calculation with mother's name
        try {
          const nameDestiny = buildDestiny(name, motherName || undefined, abjad);
          result.nameDestiny = nameDestiny;
        } catch (error) {
          console.error('Error building name destiny:', error);
          // Continue without name destiny enhancement if it fails
        }
        
        setResults(result);
      } else if (mode === 'compatibility' && name && name2) {
        // Calculate Abjad totals
        const calculateAbjadTotal = (text: string, abjadMap: Record<string, number>): number => {
          const normalized = text.replace(/[Ù‹ÙŒÙÙŽÙÙÙ‘Ù’\s]/g, '');
          return [...normalized].reduce((sum, char) => sum + (abjadMap[char] || 0), 0);
        };
        
        const person1Total = calculateAbjadTotal(name, abjad);
        const person2Total = calculateAbjadTotal(name2, abjad);
        
        // Determine elements
        const person1Element = getElementFromAbjadTotal(person1Total);
        const person2Element = getElementFromAbjadTotal(person2Total);
        
        // Use traditional three-method analysis (Quick Analysis)
        const result = analyzeRelationshipCompatibility(
          name,
          name,
          person1Total,
          person1Element,
          name2,
          name2,
          person2Total,
          person2Element
        );
        setResults(result);
      } else if (mode === 'life-path' && birthDate && name) {
        const result = calculateEnhancedLifePath(name, new Date(birthDate));
        setResults(result);
      } else if (mode === 'timing') {
        const now = new Date();
        const planetaryHour = calculatePlanetaryHour(now);
        const personalYear = birthDate ? calculatePersonalYear(new Date(birthDate), now.getFullYear()) : null;
        setResults({ planetaryHour, personalYear });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setResults({
        error: true,
        message: error instanceof Error ? error.message : (t?.errors?.analysisError || 'Unable to analyze. Please check your input.')
      });
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Mode Selection Header */}
      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 md:p-8 shadow-md">
        <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-purple-500" />
          {t.ilmHuruf.title}
        </h2>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-6">
          {t.ilmHuruf.subtitle}
        </p>
        
        {/* Mode Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Destiny Mode */}
          <button
            onClick={() => handleModeChange('destiny')}
            className={`relative group p-4 md:p-5 rounded-xl border-2 transition-all duration-300 transform ${
              mode === 'destiny'
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 scale-105 shadow-xl ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-slate-900'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-400 hover:shadow-lg hover:scale-102 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
            }`}
            aria-pressed={mode === 'destiny'}
          >
            <div className="relative">
              <Target className={`w-6 h-6 mx-auto mb-2 transition-colors ${mode === 'destiny' ? 'text-purple-600' : 'text-purple-500 group-hover:text-purple-600'}`} />
              <div className={`text-sm font-bold text-slate-900 dark:text-slate-100 transition-all ${mode === 'destiny' ? 'animate-scale-in' : ''}`}>
                {t.ilmHuruf.nameDestiny}
              </div>
              {mode === 'destiny' && (
                <div className="absolute top-0 right-0 animate-scale-in">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                </div>
              )}
            </div>
          </button>
          
          {/* Compatibility Mode */}
          <button
            onClick={() => handleModeChange('compatibility')}
            className={`relative group p-4 md:p-5 rounded-xl border-2 transition-all duration-300 transform ${
              mode === 'compatibility'
                ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/40 dark:to-pink-800/40 scale-105 shadow-xl ring-2 ring-pink-500 ring-offset-2 dark:ring-offset-slate-900'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-pink-400 hover:shadow-lg hover:scale-102 hover:bg-pink-50/50 dark:hover:bg-pink-900/10'
            }`}
            aria-pressed={mode === 'compatibility'}
          >
            <div className="relative">
              <Users className={`w-6 h-6 mx-auto mb-2 transition-colors ${mode === 'compatibility' ? 'text-pink-600' : 'text-pink-500 group-hover:text-pink-600'}`} />
              <div className={`text-sm font-bold text-slate-900 dark:text-slate-100 transition-all ${mode === 'compatibility' ? 'animate-scale-in' : ''}`}>
                {t.ilmHuruf.compatibility}
              </div>
              {mode === 'compatibility' && (
                <div className="absolute top-0 right-0 animate-scale-in">
                  <CheckCircle2 className="w-4 h-4 text-pink-600" />
                </div>
              )}
            </div>
          </button>
          
          {/* Life Path Mode */}
          <button
            onClick={() => handleModeChange('life-path')}
            className={`relative group p-4 md:p-5 rounded-xl border-2 transition-all duration-300 transform ${
              mode === 'life-path'
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 scale-105 shadow-xl ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 hover:shadow-lg hover:scale-102 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
            }`}
            aria-pressed={mode === 'life-path'}
          >
            <div className="relative">
              <Compass className={`w-6 h-6 mx-auto mb-2 transition-colors ${mode === 'life-path' ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600'}`} />
              <div className={`text-sm font-bold text-slate-900 dark:text-slate-100 transition-all ${mode === 'life-path' ? 'animate-scale-in' : ''}`}>
                {t.ilmHuruf.lifePath}
              </div>
              {mode === 'life-path' && (
                <div className="absolute top-0 right-0 animate-scale-in">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
              )}
            </div>
          </button>
          
          {/* Divine Timing Mode */}
          <button
            onClick={() => handleModeChange('timing')}
            className={`relative group p-4 md:p-5 rounded-xl border-2 transition-all duration-300 transform ${
              mode === 'timing'
                ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40 scale-105 shadow-xl ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-slate-900'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-400 hover:shadow-lg hover:scale-102 hover:bg-amber-50/50 dark:hover:bg-amber-900/10'
            }`}
            aria-pressed={mode === 'timing'}
          >
            <div className="relative">
              <Clock className={`w-6 h-6 mx-auto mb-2 transition-colors ${mode === 'timing' ? 'text-amber-600' : 'text-amber-500 group-hover:text-amber-600'}`} />
              <div className={`text-sm font-bold text-slate-900 dark:text-slate-100 transition-all ${mode === 'timing' ? 'animate-scale-in' : ''}`}>
                {t.ilmHuruf.divineTiming}
              </div>
              {mode === 'timing' && (
                <div className="absolute top-0 right-0 animate-scale-in">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Input Section with Highlight Animation */}
      <div 
        ref={formSectionRef}
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 md:p-8 transition-all duration-300 ${
          highlightInput ? 'animate-soft-highlight' : ''
        }`}
      >
        <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full transition-colors ${
              mode === 'destiny' ? 'bg-purple-500' : 
              mode === 'compatibility' ? 'bg-pink-500' : 
              mode === 'life-path' ? 'bg-blue-500' : 
              'bg-amber-500'
            }`}></span>
            {mode === 'destiny' && t.ilmHuruf.discoverNameDestiny}
            {mode === 'compatibility' && t.ilmHuruf.analyzeTwoSouls}
            {mode === 'life-path' && t.ilmHuruf.calculateLifePath}
            {mode === 'timing' && t.ilmHuruf.currentPlanetaryInfluence}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {mode === 'destiny' && t.ilmHuruf.nameDestinyDesc}
            {mode === 'compatibility' && t.ilmHuruf.compatibilityDesc}
            {mode === 'life-path' && t.ilmHuruf.lifePathDesc}
            {mode === 'timing' && t.ilmHuruf.divineTimingDesc}
          </p>
        </div>
        
        <div className="space-y-4 animate-slide-up">
          {(mode === 'destiny' || mode === 'life-path') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Latin Input with Autocomplete */}
              <div className={mode === 'life-path' ? 'md:col-span-1' : 'md:col-span-2'}>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  {t.ilmHuruf.nameLatinLabel}
                </label>
                <NameAutocomplete
                  value={latinInput}
                  onChange={(value) => handleLatinInput(value, true)}
                  onArabicSelect={(arabic, latin) => {
                    setName(arabic);
                    setLatinInput(latin);
                  }}
                  placeholder={t.ilmHuruf.namePlaceholderEn}
                  showHelper={true}
                />
                {translitConfidence !== null && translitConfidence < 100 && (
                  <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      {t.ilmHuruf.confidence}: {translitConfidence}% 
                      {translitWarnings.length > 0 && ` â€¢ ${translitWarnings.join(', ')}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Birth Date field - only for life-path mode, shown inline */}
              {mode === 'life-path' && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    {t.ilmHuruf.birthDate}
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              )}

              {/* Arabic Input */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.ilmHuruf.nameArabic}
                  </label>
                  <button
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      showKeyboard
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Keyboard className="w-3 h-3" />
                    {showKeyboard ? t.ilmHuruf.hideKeyboard : t.ilmHuruf.showKeyboard}
                  </button>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setLatinInput(''); // Clear latin if user types Arabic directly
                  }}
                  placeholder={t.ilmHuruf.namePlaceholderAr}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-right text-xl font-arabic"
                  dir="rtl"
                  style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
                />
                {showKeyboard && (
                  <div className="mt-3">
                    <ArabicKeyboard 
                      onKeyPress={(char) => handleKeyboardPress(char, true)}
                      onClose={() => setShowKeyboard(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Mother's Name Section - Only for Destiny Mode */}
          {mode === 'destiny' && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              {!showMotherNameSection ? (
                <button
                  onClick={() => setShowMotherNameSection(true)}
                  className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  title={t?.tooltips?.umHadad1 || "Um á¸¤adad (Ø£Ù… Ø­Ø¯Ø¯) - Required for complete Name Destiny calculation"}
                >
                  <Plus className="h-4 w-4" />
                  <span>{t.nameDestiny.inputs.motherOptional}</span>
                  <Info className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                </button>
              ) : (
                <div className="space-y-3 animate-slide-down">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t.nameDestiny.inputs.motherName}
                      <span title={t?.tooltips?.umHadad2 || "Um á¸¤adad (Ø£Ù… Ø­Ø¯Ø¯) - Reveals your Aá¹£l al-RÅ«á¸¥ÄnÄ« (spiritual origin)"}>
                        <Info className="h-4 w-4 text-slate-400 inline ml-2 cursor-help" />
                      </span>
                    </label>
                    <button
                      onClick={() => {
                        setShowMotherNameSection(false);
                        setMotherName('');
                        setMotherLatinInput('');
                      }}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      {t.ilmHuruf.clearMotherName}
                    </button>
                  </div>
                  
                  {/* Mother's Latin Input with Autocomplete */}
                  <div>
                    <NameAutocomplete
                      value={motherLatinInput}
                      onChange={handleMotherLatinInput}
                      onArabicSelect={(arabic, latin) => {
                        setMotherName(arabic);
                        setMotherLatinInput(latin);
                      }}
                      placeholder={t.ilmHuruf.motherNamePlaceholderEn}
                      showHelper={false}
                    />
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
                      ðŸ’¡ {t.nameDestiny.inputs.motherHint}
                    </p>
                  </div>
                  
                  {/* Mother's Arabic Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                        {t.ilmHuruf.arabicDirectInput}
                      </label>
                      <button
                        onClick={() => setShowMotherKeyboard(!showMotherKeyboard)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                          showMotherKeyboard
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        <Keyboard className="w-3 h-3" />
                        {showMotherKeyboard ? t.ilmHuruf.hideKeyboard : t.ilmHuruf.showKeyboard}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => {
                        setMotherName(e.target.value);
                        setMotherLatinInput('');
                      }}
                      placeholder={t.ilmHuruf.motherNamePlaceholderAr}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-right text-lg font-arabic"
                      dir="rtl"
                      style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
                    />
                    {showMotherKeyboard && (
                      <div className="mt-3">
                        <ArabicKeyboard 
                          onKeyPress={handleMotherKeyboardPress}
                          onClose={() => setShowMotherKeyboard(false)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {mode === 'compatibility' && (
            <div className="space-y-6">
              {/* Person 1 Inputs */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.fourLayerCompatibility?.person1Name || "First Person's Name"}
                  </h4>
                </div>

                {/* Latin Input for Person 1 with Autocomplete */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    {t.ilmHuruf.yourNameLatin}
                    <span 
                      className="text-slate-400 cursor-help" 
                      title={t.fourLayerCompatibility?.nameTooltip || "Your name reveals your conscious self"}
                    >
                      <Info className="h-4 w-4" />
                    </span>
                  </label>
                  <NameAutocomplete
                    value={latinInput}
                    onChange={(value) => handleLatinInput(value, true)}
                    onArabicSelect={(arabic, latin) => {
                      setName(arabic);
                      setLatinInput(latin);
                    }}
                    placeholder={t.ilmHuruf.namePlaceholderEn}
                    showHelper={true}
                  />
                </div>

                {/* Arabic Input for Person 1 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t.ilmHuruf.yourNameArabic}
                    </label>
                    <button
                      onClick={() => setShowKeyboard(!showKeyboard)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        showKeyboard
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <Keyboard className="w-3 h-3" />
                      {showKeyboard ? t.ilmHuruf.hideKeyboard : t.ilmHuruf.showKeyboard}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setLatinInput('');
                    }}
                    placeholder={t.ilmHuruf.namePlaceholderAr}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-right text-xl font-arabic"
                    dir="rtl"
                    style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
                  />
                  {showKeyboard && (
                    <div className="mt-3">
                      <ArabicKeyboard 
                        onKeyPress={(char) => handleKeyboardPress(char, true)}
                        onClose={() => setShowKeyboard(false)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Person 2 Inputs */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.fourLayerCompatibility?.person2Name || "Second Person's Name"}
                  </h4>
                </div>

                {/* Latin Input for Second Person with Autocomplete */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    {t.ilmHuruf.secondPersonLatin}
                  </label>
                  <NameAutocomplete
                    value={latinInput2}
                    onChange={(value) => handleLatinInput(value, false)}
                    onArabicSelect={(arabic, latin) => {
                      setName2(arabic);
                      setLatinInput2(latin);
                    }}
                    placeholder={t.ilmHuruf.namePlaceholderEn}
                    showHelper={true}
                  />
                </div>
              
              {/* Arabic Input for Second Person */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.ilmHuruf.secondPersonArabic}
                  </label>
                  <button
                    onClick={() => setShowKeyboard2(!showKeyboard2)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      showKeyboard2
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Keyboard className="w-3 h-3" />
                    {showKeyboard2 ? t.ilmHuruf.hideKeyboard : t.ilmHuruf.showKeyboard}
                  </button>
                </div>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => {
                    setName2(e.target.value);
                    setLatinInput2(''); // Clear latin if user types Arabic directly
                  }}
                  placeholder={t.ilmHuruf.motherNamePlaceholderAr}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-right text-xl font-arabic"
                  dir="rtl"
                  style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
                />
                {showKeyboard2 && (
                  <div className="mt-3">
                    <ArabicKeyboard 
                      onKeyPress={(char) => handleKeyboardPress(char, false)}
                      onClose={() => setShowKeyboard2(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          )}
          
          {mode === 'timing' && (
            <div className="space-y-4">
              {/* Name fields for Rest Signal feature */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Latin Input with Autocomplete */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    {t.ilmHuruf.yourNameLatin} <span className="text-xs text-slate-500">({t.ilmHuruf.optionalForRestSignal})</span>
                  </label>
                  <NameAutocomplete
                    value={latinInput}
                    onChange={(value) => handleLatinInput(value, true)}
                    onArabicSelect={(arabic, latin) => {
                      setName(arabic);
                      setLatinInput(latin);
                    }}
                    placeholder={t.ilmHuruf.namePlaceholderEn}
                    showHelper={false}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t.ilmHuruf.restSignalNote}
                  </p>
                </div>
                
                {/* Arabic Input */}
                <div className="md:col-span-1">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t.ilmHuruf.yourNameArabic} <span className="text-xs text-slate-500">({t.ilmHuruf.optional})</span>
                    </label>
                    <button
                      onClick={() => setShowKeyboard(!showKeyboard)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        showKeyboard
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <Keyboard className="w-3 h-3" />
                      {showKeyboard ? t.ilmHuruf.hideKeyboard : t.ilmHuruf.showKeyboard}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setLatinInput('');
                    }}
                    placeholder={t.ilmHuruf.namePlaceholderAr}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-right text-xl font-arabic"
                    dir="rtl"
                    style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
                  />
                  {showKeyboard && (
                    <div className="mt-3">
                      <ArabicKeyboard 
                        onKeyPress={(char) => handleKeyboardPress(char, true)}
                        onClose={() => setShowKeyboard(false)}
                      />
                    </div>
                  )}
                </div>

                {/* Birth Date - Inline with Arabic name */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    {t.ilmHuruf.birthDate}
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleAnalyze}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            {t.ilmHuruf.analyzeButton}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && results.error && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200">{t.ilmHuruf.analysisError}</h3>
          </div>
          <p className="text-red-700 dark:text-red-300">{results.message}</p>
        </div>
      )}
      {results && !results.error && mode === 'destiny' && <DestinyResults results={results} />}
      {results && !results.error && mode === 'compatibility' && results.person1 && results.person2 && <CompatibilityResults results={results} />}
      {results && !results.error && mode === 'life-path' && <LifePathResults results={results} />}
      {results && !results.error && mode === 'timing' && (
        (() => {
          // Calculate user element from name if available
          let userElement: ElementType | null = null;
          if (name) {
            try {
              const tempProfile = calculateUserProfile(name, birthDate ? new Date(birthDate) : undefined, undefined, abjad);
              userElement = tempProfile.element;
            } catch (e) {
              console.error('Error calculating user element:', e);
            }
          }
          // Convert ElementType ('Fire') to Element ('fire') for DivineTiming component
          const normalizedElement: 'fire' | 'water' | 'air' | 'earth' = 
            userElement ? (userElement.toLowerCase() as 'fire' | 'water' | 'air' | 'earth') : 'fire';
          return <DivineTiming userElement={normalizedElement} />;
        })()
      )}
    </div>
  );
}

// ============================================================================
// WEEKLY RESULTS COMPONENT
// ============================================================================

interface WeeklyResultsProps {
  results: {
    profile: UserProfile;
    weeklySummary: WeeklySummaryType;
    harmonyType: HarmonyType;
    dominantForce: DominantForceType;
  };
  selectedDay: string | null;
  setSelectedDay: (day: string | null) => void;
}

function WeeklyResults({ results, selectedDay, setSelectedDay }: WeeklyResultsProps) {
  const { profile, weeklySummary, harmonyType, dominantForce } = results;
  const { t, language } = useLanguage();
  const [expandedRestDay, setExpandedRestDay] = useState<string | null>(null);
  
  const toggleRestSignal = (dayDate: string) => {
    setExpandedRestDay(expandedRestDay === dayDate ? null : dayDate);
  };
  
  // Safety check
  if (!profile || !weeklySummary) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <p className="text-red-800 dark:text-red-200">
          Unable to generate weekly forecast. Please enter a valid Arabic name.
        </p>
      </div>
    );
  }
  
  const balanceTip = getBalanceTip(dominantForce);
  
  const ELEMENT_COLORS = {
    Fire: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    Water: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    Air: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    Earth: 'text-green-500 bg-green-50 dark:bg-green-900/20'
  };
  
  const HARMONY_COLORS = {
    Complete: 'text-green-600 bg-green-50 dark:bg-green-900/30',
    Partial: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30',
    Conflict: 'text-red-600 bg-red-50 dark:bg-red-900/30'
  };

  // Helper: localized weekday from ISO date
  const getTranslatedWeekday = (isoDate?: string) => {
    if (!isoDate) return '';
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long' });
    } catch (e) {
      return isoDate;
    }
  };

  // Helper: localized planet name
  const getPlanetName = (planetName: string) => {
    const names: Record<string, { en: string; fr: string }> = {
      Sun: { en: 'Sun', fr: 'Soleil' },
      Moon: { en: 'Moon', fr: 'Lune' },
      Mars: { en: 'Mars', fr: 'Mars' },
      Mercury: { en: 'Mercury', fr: 'Mercure' },
      Jupiter: { en: 'Jupiter', fr: 'Jupiter' },
      Venus: { en: 'Venus', fr: 'VÃ©nus' },
      Saturn: { en: 'Saturn', fr: 'Saturne' }
    };
    return language === 'fr' ? (names[planetName]?.fr || planetName) : (names[planetName]?.en || planetName);
  };

  // Helper: translate generated tips (mapping English -> French)
  const translateTip = (tip: string) => {
    if (!tip) return tip;
    if (language !== 'fr') return tip;

    const map: Record<string, string> = {
      // Sun
      'Excellent for leadershipâ€”schedule important meetings and presentations': 'Excellent pour le leadership â€” planifiez des rÃ©unions et prÃ©sentations importantes',
      'Lead projects and take initiativeâ€”high energy for achievements': 'Dirigez des projets et prenez l\'initiative â€” Ã©nergie Ã©levÃ©e pour les rÃ©alisations',
      'Challenging for visibilityâ€”lead quietly, support others today': 'Difficile pour la visibilitÃ© â€” dirigez discrÃ¨tement, soutenez les autres aujourd\'hui',
      // Moon
      'Perfect for reflectionâ€”trust your intuition and emotional wisdom': 'Parfait pour la rÃ©flexion â€” faites confiance Ã  votre intuition et sagesse Ã©motionnelle',
      'Gentle dayâ€”plan, review, nurture relationships, avoid overload': 'JournÃ©e douce â€” planifiez, rÃ©visez, entretenez les relations, Ã©vitez la surcharge',
      'Rest neededâ€”minimize commitments, process emotions, be kind to yourself': 'Repos nÃ©cessaire â€” rÃ©duisez les engagements, traitez les Ã©motions, soyez bienveillant avec vous-mÃªme',
      // Mars
      'Fierce energyâ€”tackle tough challenges and push through obstacles boldly': 'Ã‰nergie fÃ©roce â€” relevez les dÃ©fis difficiles et surmontez les obstacles avec audace',
      'Take action on difficult tasksâ€”courage and determination favored': 'Agissez sur les tÃ¢ches difficiles â€” le courage et la dÃ©termination sont favorisÃ©s',
      'Channel carefullyâ€”physical activity helps, avoid conflicts and rushing': 'Canalisez prudemment â€” l\'activitÃ© physique aide, Ã©vitez les conflits et la prÃ©cipitation',
      // Mercury
      'Sharp mindâ€”perfect for writing, calls, learning, and travel plans': 'Esprit vif â€” parfait pour l\'Ã©criture, les appels, l\'apprentissage et les projets de voyage',
      'Communicate clearlyâ€”good for emails, meetings, and study sessions': 'Communiquez clairement â€” bon pour les e-mails, rÃ©unions et sessions d\'Ã©tude',
      'Mental fog possibleâ€”double-check messages, postpone major decisions': 'Brouillard mental possible â€” vÃ©rifiez les messages, reportez les dÃ©cisions majeures',
      // Jupiter
      'Timing is perfectâ€”make big decisions, start new ventures, expand horizons': 'Le moment est parfait â€” prenez de grandes dÃ©cisions, lancez de nouvelles entreprises, Ã©largissez vos horizons',
      'Growth dayâ€”great for planning expansion and seeking opportunities': 'JournÃ©e de croissance â€” idÃ©ale pour planifier l\'expansion et rechercher des opportunitÃ©s',
      'Temper optimismâ€”research thoroughly before committing to anything big': 'ModÃ©rez l\'optimisme â€” recherchez soigneusement avant de vous engager dans de grandes choses',
      // Venus
      'Excellent for connectionâ€”ideal for relationships, creativity, and beauty': 'Excellent pour la connexion â€” idÃ©al pour les relations, la crÃ©ativitÃ© et la beautÃ©',
      'Harmonious dayâ€”connect with others, enjoy art, balance work-pleasure': 'JournÃ©e harmonieuse â€” connectez-vous aux autres, apprÃ©ciez l\'art, Ã©quilibrer travail et plaisir',
      'Social challengesâ€”focus on self-care, solo creative work, gentle interactions': 'DÃ©fis sociaux â€” concentrez-vous sur les soins personnels, travail crÃ©atif en solo, interactions douces',
      // Saturn
      'Build strong foundationsâ€”organize, plan long-term, establish structures': 'Construisez des bases solides â€” organisez, planifiez Ã  long terme, Ã©tablissez des structures',
      'Structure your weekâ€”discipline and planning bring good results': 'Structurez votre semaine â€” la discipline et la planification apportent de bons rÃ©sultats',
      'Heavy responsibilitiesâ€”break tasks into small steps, be patient with delays': 'ResponsabilitÃ©s lourdes â€” dÃ©composez les tÃ¢ches en petites Ã©tapes, soyez patient face aux retards',
      // Element tips
      'Balance heatâ€”practice calm speech, charity, time near water': 'Ã‰quilibrez la chaleur â€” pratiquez la parole calme, la charitÃ©, du temps prÃ¨s de l\'eau',
      'Activate energyâ€”light exercise, sunlight, decisive action': 'Activez l\'Ã©nergie â€” exercice lÃ©ger, lumiÃ¨re du soleil, action dÃ©cisive',
      'Ground yourselfâ€”stick to routine, nature walk, one task at a time': 'Ancrez-vous â€” respectez la routine, promenade dans la nature, une tÃ¢che Ã  la fois',
      'Add lightnessâ€”try creativity, flexibility, or a short change of scenery': 'Ajoutez de la lÃ©gÃ¨retÃ© â€” essayez la crÃ©ativitÃ©, la flexibilitÃ© ou un court changement de dÃ©cor',
      // Planet secondary tips
      'Shine your lightâ€”but stay humble and generous with recognition': 'Faites briller votre lumiÃ¨re â€” restez humble et gÃ©nÃ©reux dans la reconnaissance',
      'Honor your feelingsâ€”they guide you to what truly matters': 'Honorez vos sentiments â€” ils vous guident vers ce qui compte vraiment',
      'Channel warrior energyâ€”protect boundaries, pursue goals with courage': 'Canalisez l\'Ã©nergie guerriÃ¨re â€” protÃ©gez les limites, poursuivez vos objectifs avec courage',
      'Mental agility peaksâ€”network, negotiate, adapt quickly': 'L\'agilitÃ© mentale atteint son apogÃ©e â€” rÃ©seauter, nÃ©gocier, s\'adapter rapidement',
      'Seek wisdom and growthâ€”mentor others or learn from teachers': 'Recherchez la sagesse et la croissance â€” mentorat ou apprentissage auprÃ¨s des enseignants',
      'Appreciate beautyâ€”create harmony in your environment and relationships': 'ApprÃ©ciez la beautÃ© â€” crÃ©ez l\'harmonie dans votre environnement et vos relations',
      'Master disciplineâ€”small consistent efforts build lasting success': 'MaÃ®trisez la discipline â€” de petits efforts constants construisent un succÃ¨s durable'
    };

    return map[tip] || tip;
  };

  // Helper: translate rest practice items
  const translatePractice = (practice: string) => {
    if (!practice) return practice;
    if (language !== 'fr') return practice;
    const m: Record<string, string> = {
      '20min Silence': '20min de silence',
      'Nature Walk': 'Promenade en nature',
      'Journal Freely': 'Journal libre',
      'Read Sacred Texts': 'Lire des textes sacrÃ©s',
      'Mindful Tea': 'ThÃ© conscient',
      'Early Sleep': 'Dormir tÃ´t'
    };
    return m[practice] || practice;
  };

  // Translation helper for energy types
  const translateEnergyType = (energyType: string): string => {
    if (language === 'en') return energyType;
    
    const m: Record<string, string> = {
      // Mercury
      'Mental sharpness': 'AcuitÃ© mentale',
      'Communication peak': 'Pic de communication',
      'Quick connections': 'Connexions rapides',
      'Integration time': 'Temps d\'intÃ©gration',
      
      // Sun
      'Peak leadership energy': 'Pic d\'Ã©nergie de leadership',
      'High visibility': 'Haute visibilitÃ©',
      'Delegation phase': 'Phase de dÃ©lÃ©gation',
      'Reflection time': 'Temps de rÃ©flexion',
      
      // Moon
      'Emotional clarity': 'ClartÃ© Ã©motionnelle',
      'Nurturing peak': 'Pic de soin',
      'Intuitive window': 'FenÃªtre intuitive',
      'Release & rest': 'RelÃ¢chement & repos',
      
      // Mars
      'Peak action energy': 'Pic d\'Ã©nergie d\'action',
      'Competitive drive': 'Esprit de compÃ©tition',
      'Courage window': 'FenÃªtre de courage',
      'Power-down time': 'Temps de rÃ©cupÃ©ration',
      
      // Venus
      'Beauty & connection': 'BeautÃ© & connexion',
      'Pleasure peak': 'Pic de plaisir',
      'Relationship time': 'Temps relationnel',
      'Art & beauty': 'Art & beautÃ©',
      
      // Jupiter
      'Expansion begins': 'L\'expansion commence',
      'Opportunity window': 'FenÃªtre d\'opportunitÃ©',
      'Growth momentum': 'Momentum de croissance',
      'Wisdom integration': 'IntÃ©gration de la sagesse',
      
      // Saturn
      'Structure setting': 'Mise en place de structure',
      'Discipline peak': 'Pic de discipline',
      'Responsibility time': 'Temps de responsabilitÃ©',
      'Completion energy': 'Ã‰nergie de completion'
    };
    
    return m[energyType] || energyType;
  };

  // Translation helper for task items (bestFor and avoid lists)
  const translateTask = (task: string): string => {
    if (language === 'en') return task;
    
    const m: Record<string, string> = {
      // Mercury tasks
      'Writing tasks': 'TÃ¢ches d\'Ã©criture',
      'Study complex topics': 'Ã‰tudier des sujets complexes',
      'Plan communications': 'Planifier les communications',
      'Learn new skills': 'Apprendre de nouvelles compÃ©tences',
      'Mindless work': 'Travail machinal',
      'Physical-only tasks': 'TÃ¢ches uniquement physiques',
      'Important calls': 'Appels importants',
      'Presentations': 'PrÃ©sentations',
      'Teach or explain': 'Enseigner ou expliquer',
      'Networking': 'RÃ©seautage',
      'Solo work': 'Travail en solo',
      'Silence': 'Silence',
      'Short trips/errands': 'Courts trajets/courses',
      'Email responses': 'RÃ©ponses aux e-mails',
      'Quick meetings': 'RÃ©unions rapides',
      'Social media': 'MÃ©dias sociaux',
      'Deep focus': 'Concentration profonde',
      'Long commitments': 'Engagements longs',
      'Review what you learned': 'Revoir ce que vous avez appris',
      'Journal insights': 'Noter les perspectives',
      'Organize notes': 'Organiser les notes',
      'Light reading': 'Lecture lÃ©gÃ¨re',
      'New information': 'Nouvelles informations',
      'Complex learning': 'Apprentissage complexe',
      
      // Sun tasks
      'Important decisions': 'DÃ©cisions importantes',
      'Set daily direction': 'DÃ©finir la direction du jour',
      'Lead team meetings': 'Diriger des rÃ©unions d\'Ã©quipe',
      'Strategic planning': 'Planification stratÃ©gique',
      'Routine tasks': 'TÃ¢ches routiniÃ¨res',
      'Following others': 'Suivre les autres',
      'Public presentations': 'PrÃ©sentations publiques',
      'Client meetings': 'RÃ©unions avec clients',
      'Performance reviews': 'Ã‰valuations de performance',
      'Launch initiatives': 'Lancer des initiatives',
      'Background work': 'Travail en arriÃ¨re-plan',
      'Hiding mistakes': 'Cacher les erreurs',
      'Delegate tasks': 'DÃ©lÃ©guer des tÃ¢ches',
      'Teach and mentor': 'Enseigner et encadrer',
      'Review team work': 'RÃ©viser le travail d\'Ã©quipe',
      'Empower others': 'Responsabiliser les autres',
      'Micromanaging': 'Microgestion',
      'Reflect on the day': 'RÃ©flÃ©chir sur la journÃ©e',
      'Celebrate wins': 'CÃ©lÃ©brer les victoires',
      'Plan tomorrow': 'Planifier demain',
      'Rest with pride': 'Se reposer avec fiertÃ©',
      'Self-criticism': 'Auto-critique',
      'Dim your light': 'Diminuer votre lumiÃ¨re',
      
      // Moon tasks
      'Check in with feelings': 'VÃ©rifier vos sentiments',
      'Care for family': 'Prendre soin de la famille',
      'Gentle morning ritual': 'Rituel matinal doux',
      'Cook nourishing food': 'Cuisiner des aliments nourrissants',
      'Harsh decisions': 'DÃ©cisions dures',
      'Ignore emotions': 'Ignorer les Ã©motions',
      'Mother/nurture others': 'Materner/prendre soin des autres',
      'Create safe space': 'CrÃ©er un espace sÃ»r',
      'Listen deeply': 'Ã‰couter profondÃ©ment',
      'Comfort someone': 'RÃ©conforter quelqu\'un',
      'Aggression': 'Agression',
      'Emotional coldness': 'Froideur Ã©motionnelle',
      'Trust your gut': 'Faire confiance Ã  votre instinct',
      'Dream journaling': 'Journal des rÃªves',
      'Water activities': 'ActivitÃ©s aquatiques',
      'Meditate': 'MÃ©diter',
      'Logic-only thinking': 'PensÃ©e uniquement logique',
      'Ignore intuition': 'Ignorer l\'intuition',
      'Let go of the day': 'LÃ¢cher prise sur la journÃ©e',
      'Forgive conflicts': 'Pardonner les conflits',
      'New fights': 'Nouvelles disputes',
      'Revenge planning': 'Planification de vengeance',
      'Alcohol': 'Alcool',
      
      // Mars tasks
      'Start difficult tasks': 'Commencer les tÃ¢ches difficiles',
      'Physical exercise': 'Exercice physique',
      'Tackle challenges': 'Relever des dÃ©fis',
      'Assert yourself': 'S\'affirmer',
      'Passive activities': 'ActivitÃ©s passives',
      'Procrastination': 'Procrastination',
      'Compete or debate': 'CompÃ©tition ou dÃ©bat',
      'Sales pitches': 'PrÃ©sentations de vente',
      'Push through obstacles': 'Surmonter les obstacles',
      'Take action': 'Passer Ã  l\'action',
      'Avoid conflict': 'Ã‰viter les conflits',
      'Fence-sitting': 'IndÃ©cision',
      'Face your fear': 'Affronter votre peur',
      'Bold moves': 'Mouvements audacieux',
      'Defend boundaries': 'DÃ©fendre les limites',
      'Stand up for yourself': 'DÃ©fendre vos droits',
      'Cowardice': 'LÃ¢chetÃ©',
      'People-pleasing': 'Plaire aux autres',
      'Wind down intensity': 'RÃ©duire l\'intensitÃ©',
      'Repair any damage': 'RÃ©parer les dÃ©gÃ¢ts',
      'Cool down': 'Se calmer',
      'Forgive self': 'Se pardonner',
      'Stir up conflict': 'Attiser les conflits',
      'Reckless action': 'Action imprudente',
      
      // Venus tasks
      'Beautify space': 'Embellir l\'espace',
      'Dress nicely': 'S\'habiller joliment',
      'Enjoy breakfast': 'Savourer le petit dÃ©jeuner',
      'Appreciate beauty': 'ApprÃ©cier la beautÃ©',
      'Ugliness': 'Laideur',
      'Harshness': 'DuretÃ©',
      'Socialize': 'Socialiser',
      'Express affection': 'Exprimer l\'affection',
      'Enjoy pleasures': 'ApprÃ©cier les plaisirs',
      'Share love': 'Partager l\'amour',
      'Isolation': 'Isolation',
      'Rudeness': 'Impolitesse',
      'Connect deeply': 'Se connecter profondÃ©ment',
      'Date night': 'SoirÃ©e en amoureux',
      'Quality time': 'Temps de qualitÃ©',
      'Relationship talk': 'Discussion relationnelle',
      'Conflict': 'Conflit',
      'Distance': 'Distance',
      'Create art': 'CrÃ©er de l\'art',
      'Listen to music': 'Ã‰couter de la musique',
      'Indulge senses': 'Se faire plaisir',
      'Luxury bath': 'Bain de luxe',
      'Frugality': 'FrugalitÃ©',
      'Denial': 'DÃ©ni',
      
      // Jupiter tasks
      'Think big picture': 'Penser Ã  long terme',
      'Study philosophy': 'Ã‰tudier la philosophie',
      'Set ambitious goals': 'Fixer des objectifs ambitieux',
      'Small thinking': 'PensÃ©e limitÃ©e',
      'Petty details': 'DÃ©tails insignifiants',
      'Seek opportunities': 'Chercher des opportunitÃ©s',
      'Make connections': 'CrÃ©er des connexions',
      'Generous acts': 'Actes gÃ©nÃ©reux',
      'Teaching': 'Enseignement',
      'Stinginess': 'Avarice',
      'Narrowness': 'Ã‰troitesse d\'esprit',
      'Expand projects': 'Ã‰tendre les projets',
      'Take calculated risks': 'Prendre des risques calculÃ©s',
      'Travel planning': 'Planification de voyage',
      'Cultural exploration': 'Exploration culturelle',
      'Contraction': 'Contraction',
      'Fear-based decisions': 'DÃ©cisions basÃ©es sur la peur',
      'Philosophical reflection': 'RÃ©flexion philosophique',
      'Gratitude practice': 'Pratique de gratitude',
      'Mentor someone': 'Encadrer quelqu\'un',
      'Spiritual study': 'Ã‰tude spirituelle',
      'Materialism': 'MatÃ©rialisme',
      'Pessimism': 'Pessimisme',
      
      // Saturn tasks
      'Build structure': 'Construire une structure',
      'Long-term planning': 'Planification Ã  long terme',
      'Set boundaries': 'DÃ©finir des limites',
      'Serious work': 'Travail sÃ©rieux',
      'Chaos': 'Chaos',
      'Frivolity': 'FrivolitÃ©',
      'Focused work': 'Travail concentrÃ©',
      'Meet deadlines': 'Respecter les dÃ©lais',
      'Quality control': 'ContrÃ´le qualitÃ©',
      'Professional duties': 'Devoirs professionnels',
      'Slacking': 'Paresse',
      'Shortcuts': 'Raccourcis',
      'Take responsibility': 'Prendre ses responsabilitÃ©s',
      'Difficult conversations': 'Conversations difficiles',
      'Face consequences': 'Faire face aux consÃ©quences',
      'Do what you must': 'Faire ce qui doit Ãªtre fait',
      'Blame others': 'BlÃ¢mer les autres',
      'Avoid duty': 'Ã‰viter le devoir',
      'Complete projects': 'Terminer les projets',
      'Tie up loose ends': 'RÃ©gler les dÃ©tails',
      'Archive & organize': 'Archiver & organiser',
      'Review progress': 'RÃ©viser les progrÃ¨s',
      'Start new things': 'Commencer de nouvelles choses',
      'Rush': 'PrÃ©cipitation'
    };
    
    return m[task] || task;
  };

  // Translation helper for planetal phases
  const translatePlanetalPhase = (phase: string): string => {
    if (language === 'en') return phase;
    
    const m: Record<string, string> = {
      'Sun rises - authority peaks': 'Le soleil se lÃ¨ve - pic d\'autoritÃ©',
      'Solar noon - maximum presence': 'Midi solaire - prÃ©sence maximale',
      'Moon opens heart': 'La lune ouvre le cÅ“ur',
      'Emotional tide peaks': 'Pic de marÃ©e Ã©motionnelle',
      'Mars fuels courage': 'Mars alimente le courage'
    };
    
    return m[phase] || phase;
  };

  return (
    <div className="space-y-6">
      {/* Profile Chips */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">
          {t.ilmHuruf.yourSpiritualProfile}
        </h3>
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700 text-black dark:text-white">
            <span className="text-sm font-medium">
              {t.ilmHuruf.ruh}: {profile.ruh}
            </span>
          </div>
          <div className={`px-4 py-2 rounded-full border ${ELEMENT_COLORS[profile.element]}`}>
            <span className="text-sm font-medium">
              {t.ilmHuruf.element}: {profile.element}
            </span>
          </div>
          <div className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-200 flex items-center gap-2">
              {React.createElement(PLANET_ICONS[profile.kawkab], { className: 'w-4 h-4' })}
              {profile.kawkab}
            </span>
          </div>
        </div>
      </div>

      {/* Balance Meter - Energy Harmony */}
      <BalanceMeter 
        userElement={profile.element as ElementType} 
        currentDayElement={getCurrentDayElement()} 
      />

      {/* Harmony & Dominant Force */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`rounded-xl p-4 border-2 ${HARMONY_COLORS[harmonyType]}`}>
          <div className="text-sm font-medium opacity-75 mb-1">{t.ilmHuruf.currentHarmony}</div>
          <div className="text-xl font-bold">{harmonyType}</div>
          <p className="text-xs mt-2 opacity-90">
            {harmonyType === 'Complete' && t.ilmHuruf.allForcesAligned}
            {harmonyType === 'Partial' && t.ilmHuruf.mixedSignals}
            {harmonyType === 'Conflict' && t.ilmHuruf.challengingEnergies}
          </p>
        </div>
        
        <div className="rounded-xl p-4 border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t.ilmHuruf.dominantForce}</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{dominantForce}</div>
          <p className="text-xs mt-2 text-slate-600 dark:text-slate-400">{balanceTip}</p>
        </div>
      </div>

      {/* Week at a Glance - Enhanced Display */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-500" />
          {t.ilmHuruf.weekAtAGlance}
        </h3>
        
        {/* Week Summary - Best Days */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-800">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Best Day */}
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">{t.ilmHuruf.peakDayThisWeek}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">â­</span>
                <div>
                  {weeklySummary?.days?.find(d => d.date === weeklySummary?.best_day) && (
                    <>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {getTranslatedWeekday(weeklySummary?.days?.find(d => d.date === weeklySummary?.best_day)?.date)}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {t.ilmHuruf.harmony}: {weeklySummary?.days?.find(d => d.date === weeklySummary?.best_day)?.harmony_score}/10
                      </div>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{t.ilmHuruf.bestForInitiatives}</p>
            </div>

            {/* Focus Day */}
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">{t.ilmHuruf.focusDay}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">ðŸŽ¯</span>
                <div>
                  {weeklySummary?.days?.find(d => d.date === weeklySummary?.focus_day) && (
                    <>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {getTranslatedWeekday(weeklySummary?.days?.find(d => d.date === weeklySummary?.focus_day)?.date)}
                      </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                {t.ilmHuruf.planet}: {getPlanetName(weeklySummary?.days?.find(d => d.date === weeklySummary?.focus_day)?.day_planet || '')}
                              </div>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{t.ilmHuruf.forDeepWorkAndPlanning}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          {weeklySummary?.days?.map((day) => {
            const isBest = day.date === weeklySummary?.best_day;
            const isGentle = day.date === weeklySummary?.gentle_day;
            const isFocus = day.date === weeklySummary?.focus_day;
            const isSelected = day.date === selectedDay;
            const firstTip = day.tips?.[0] || t.ilmHuruf.planMindfully;
            const displayedFirstTip = translateTip(firstTip);
            const truncatedTip = displayedFirstTip.length > 45 ? displayedFirstTip.slice(0, 45) + '...' : displayedFirstTip;
            
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDay(day.date === selectedDay ? null : day.date)}
                className={`relative rounded-xl p-3 transition-all duration-200 border-2 ${
                  isSelected 
                    ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 shadow-lg scale-105' 
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:shadow-md hover:scale-102'
                }`}
              >
                {/* Day name */}
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {getTranslatedWeekday(day.date)}
                </div>
                
                {/* Score display with bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600 dark:text-slate-400">{t.ilmHuruf.harmony}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {day.harmony_score}/10
                      </span>
                      <HarmonyTooltip
                        breakdown={calculateHarmonyBreakdown(
                          day.day_planet,
                          profile.element,
                          profile.kawkab,
                          day.ruh_phase,
                          profile.ruh,
                          `${day.day_planet} day`
                        ) as HarmonyBreakdown}
                        context="weekly"
                      />
                    </div>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        day.band === 'High' ? 'bg-green-500' :
                        day.band === 'Moderate' ? 'bg-amber-500' :
                        'bg-blue-400'
                      }`}
                      style={{ width: `${(day.harmony_score / 10) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Planet info */}
                <div className="flex items-center gap-1.5 mb-2 py-1.5 px-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-lg">{PLANET_ICONS_EMOJI[day.day_planet]}</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {getPlanetName(day.day_planet)}
                  </span>
                </div>
                
                {/* Key tip preview */}
                <div className="mb-2 min-h-[2.5rem]">
                  <div className="flex items-start gap-1">
                    <span className="text-xs flex-shrink-0">ðŸ’¡</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight text-left">
                      {truncatedTip}
                    </p>
                  </div>
                </div>
                
                {/* Rest Signal Badge */}
                {day.isRestDay && (
                  <div className="mb-2">
                    <div
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent day selection toggle
                        toggleRestSignal(day.date);
                      }}
                      className={`w-full text-[10px] px-2 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                        day.restLevel === 'deep'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                      }`}
                    >
                      {day.restLevel === 'deep' ? `ðŸ›‘ ${t.ilmHuruf.deepRest}` : `ðŸŒ™ ${t.ilmHuruf.restSignalBadge}`}
                    </div>
                  </div>
                )}
                
                {/* Energy Return Speed (Irtiá¹­Äb) - Lesson 25 */}
                <div className="mb-2 p-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
                  <div className="flex items-start gap-1.5">
                    <span className="text-sm flex-shrink-0">
                      {day.energyReturn.speed === 'instant' && 'âš¡'}
                      {day.energyReturn.speed === 'quick' && 'ðŸ’¨'}
                      {day.energyReturn.speed === 'gradual' && 'ðŸŒŠ'}
                      {day.energyReturn.speed === 'delayed' && 'ðŸŒ±'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[10px] font-bold text-purple-900 dark:text-purple-100 uppercase">
                          {day.energyReturn.speed === 'instant' && t.ilmHuruf.instant}
                          {day.energyReturn.speed === 'quick' && t.ilmHuruf.quick}
                          {day.energyReturn.speed === 'gradual' && t.ilmHuruf.gradual}
                          {day.energyReturn.speed === 'delayed' && t.ilmHuruf.delayed}
                        </span>
                        <span className="text-[9px] text-purple-600 dark:text-purple-400">
                          {day.energyReturn.speed === 'instant' && t.ilmHuruf.sameDayParens}
                          {day.energyReturn.speed === 'quick' && t.ilmHuruf.fewHoursParens}
                          {day.energyReturn.speed === 'gradual' && t.ilmHuruf.twoDaysParens}
                          {day.energyReturn.speed === 'delayed' && t.ilmHuruf.oneToTwoWeeksParens}
                        </span>
                      </div>
                      <p className="text-[10px] text-purple-700 dark:text-purple-300 leading-tight">
                        {day.energyReturn.practice}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                  {isBest && (
                    <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500 text-white font-bold">
                      {t.ilmHuruf.best}
                    </div>
                  )}
                  {isGentle && (
                    <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-400 text-white font-bold">
                      {t.ilmHuruf.gentle}
                    </div>
                  )}
                  {isFocus && !isBest && (
                    <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500 text-white font-bold">
                      {t.ilmHuruf.focus}
                    </div>
                  )}
                </div>
                
                {/* Click indicator */}
                {!isSelected && (
                  <div className="absolute bottom-1 right-1 text-[10px] text-slate-400 dark:text-slate-600">
                    â–¼
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Energy Return Speeds Overview (Irtiá¹­Äb) */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <span className="text-lg">âš¡</span>
            {t.ilmHuruf.energyReturnSpeedsThisWeek}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            {t.ilmHuruf.whenActionsManifestResults}
          </p>
          <div className="grid md:grid-cols-4 gap-3">
            {(() => {
              const speedCounts = {
                instant: weeklySummary?.days?.filter(d => d.energyReturn?.speed === 'instant').length || 0,
                quick: weeklySummary?.days?.filter(d => d.energyReturn?.speed === 'quick').length || 0,
                gradual: weeklySummary?.days?.filter(d => d.energyReturn?.speed === 'gradual').length || 0,
                delayed: weeklySummary?.days?.filter(d => d.energyReturn?.speed === 'delayed').length || 0,
              };
              return Object.entries(speedCounts).map(([speed, count]) => (
                <div key={speed} className="bg-white dark:bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="flex justify-center text-2xl mb-1">
                    {speed === 'instant' && 'âš¡'}
                    {speed === 'quick' && 'ðŸ’¨'}
                    {speed === 'gradual' && 'ðŸŒŠ'}
                    {speed === 'delayed' && 'ðŸŒ±'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {speed === 'instant' ? t.ilmHuruf.instant : speed === 'quick' ? t.ilmHuruf.fewHours : speed === 'gradual' ? t.ilmHuruf.twoDays : t.ilmHuruf.oneToTwoWeeks}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {language === 'fr' ? `${count} jour${count !== 1 ? 's' : ''}` : `${count} day${count !== 1 ? 's' : ''}`}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-500 mt-2">
                    {speed === 'instant' && t.ilmHuruf.sameDay}
                    {speed === 'quick' && t.ilmHuruf.fewHours}
                    {speed === 'gradual' && t.ilmHuruf.twoDays}
                    {speed === 'delayed' && t.ilmHuruf.oneToTwoWeeks}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
        
        {/* Expandable Rest Signal Content */}
        {expandedRestDay && (() => {
          const restDay = weeklySummary?.days?.find(d => d.date === expandedRestDay);
          if (!restDay || !restDay.isRestDay) return null;
          
          return (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800 animate-in slide-in-from-top duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{restDay.restLevel === 'deep' ? 'ðŸ›‘' : 'ðŸŒ™'}</span>
                  <h4 className="font-bold text-blue-900 dark:text-blue-100">
                    {restDay.restLevel === 'deep' ? t.ilmHuruf.deepRestNeeded : t.ilmHuruf.restSignal}
                  </h4>
                </div>
                <button
                  onClick={() => setExpandedRestDay(null)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm"
                >
                  âœ•
                </button>
              </div>
              
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                {restDay.restLevel === 'deep' 
                  ? t.ilmHuruf.criticalLowEnergy
                  : t.ilmHuruf.lowHarmonyPause.replace('{planet}', getPlanetName(restDay.day_planet))
                }
              </p>
              
              {/* Rest Practices */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  {t.ilmHuruf.restPractices}
                </p>
                <ul className="space-y-2">
                  {restDay.restPractices?.map((practice, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-blue-500 dark:text-blue-400 flex-shrink-0">â–¡</span>
                      <span>{translatePractice(practice)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Better Days Suggestions */}
              {restDay.betterDays && restDay.betterDays.length > 0 && (
                <div className="pt-4 border-t border-blue-200 dark:border-blue-700">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-2 flex items-center gap-1">
                    <span>ðŸ’¡</span>
                    <span className="uppercase tracking-wide">{t.ilmHuruf.betterDaysThisWeek}</span>
                  </p>
                  <ul className="space-y-1">
                    {restDay.betterDays.map((betterDay, i) => (
                      <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span className="text-green-500">â€¢</span>
                        <span>{betterDay}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic">
                    {t.ilmHuruf.rescheduleImportantTasks}
                  </p>
                </div>
              )}
              
              {/* Classical Wisdom */}
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                <p className="text-xs italic text-slate-600 dark:text-slate-400 text-center">
                  <span className="font-semibold">{t.ilmHuruf.classicalWisdom}</span> "{t.ilmHuruf.stillnessBeforeMotion}"
                  <br />
                  <span className="text-[10px]">{t.ilmHuruf.stillnessExplanation}</span>
                </p>
              </div>
            </div>
          );
        })()}
        
        {/* Selected Day Details - Enhanced */}
        {selectedDay && (() => {
          const day = weeklySummary?.days?.find(d => d.date === selectedDay);
          if (!day) return null;
          
          const PlanetIcon = PLANET_ICONS[day.day_planet];
          
          return (
            <div className="mt-6 animate-in slide-in-from-top duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{PLANET_ICONS_EMOJI[day.day_planet]}</div>
                    <div>
                      <div className="text-2xl font-bold">
                        {day.weekday}
                      </div>
                      <div className="text-sm opacity-90">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="text-4xl font-bold">{day.harmony_score}</div>
                      <div className="self-start mt-2">
                        <HarmonyTooltip
                          breakdown={calculateHarmonyBreakdown(
                            day.day_planet,
                            profile.element,
                            profile.kawkab,
                            day.ruh_phase,
                            profile.ruh,
                            `${day.day_planet} day`
                          ) as HarmonyBreakdown}
                          context="weekly"
                        />
                      </div>
                    </div>
                    <div className="text-xs opacity-90">/ 10</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="text-xs opacity-75 mb-1">{t.ilmHuruf.planet}</div>
                    <div className="font-bold flex items-center gap-2">
                      <PlanetIcon className="w-5 h-5" />
                      {day.day_planet}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {day.day_planet === 'Sun' && t.ilmHuruf.leadership}
                      {day.day_planet === 'Moon' && t.ilmHuruf.emotions}
                      {day.day_planet === 'Mars' && t.ilmHuruf.action}
                      {day.day_planet === 'Mercury' && t.ilmHuruf.communication}
                      {day.day_planet === 'Jupiter' && t.ilmHuruf.expansion}
                      {day.day_planet === 'Venus' && t.ilmHuruf.love}
                      {day.day_planet === 'Saturn' && t.ilmHuruf.structure}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="text-xs opacity-75 mb-1">{t.ilmHuruf.ruhPhase}</div>
                    <div className="font-bold">{day.ruh_phase_group}</div>
                    <div className="text-xs opacity-75 mt-1">{t.ilmHuruf.phase} {day.ruh_phase}/9</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="text-xs opacity-75 mb-1">{t.ilmHuruf.energyBand}</div>
                    <div className={`font-bold flex items-center gap-2`}>
                      {day.band === 'High' && 'ðŸ”¥ High'}
                      {day.band === 'Moderate' && 'âš–ï¸ Moderate'}
                      {day.band === 'Low' && 'ðŸŒŠ Gentle'}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {day.band === 'High' && 'Peak performance day'}
                      {day.band === 'Moderate' && 'Steady progress day'}
                      {day.band === 'Low' && 'Rest & reflection day'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-white dark:bg-slate-800 rounded-xl p-5 border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{t.ilmHuruf.yourGuidanceForThisDay}</h4>
                </div>
                
                {/* Energy Return - Detailed (Irtiá¹­Äb) */}
                <div className="mb-5 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                    <span className="text-2xl">
                      {day.energyReturn.speed === 'instant' && 'âš¡'}
                      {day.energyReturn.speed === 'quick' && 'ðŸ’¨'}
                      {day.energyReturn.speed === 'gradual' && 'ðŸŒŠ'}
                      {day.energyReturn.speed === 'delayed' && 'ðŸŒ±'}
                    </span>
                    <span>{t.ilmHuruf.energyReturnWisdom}</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                        <strong className="text-purple-700 dark:text-purple-300">{t.ilmHuruf.returnSpeed}</strong>{' '}
                        <span className="uppercase font-bold">
                          {day.energyReturn.speed === 'instant' && t.ilmHuruf.instant}
                          {day.energyReturn.speed === 'quick' && t.ilmHuruf.quick}
                          {day.energyReturn.speed === 'gradual' && t.ilmHuruf.gradual}
                          {day.energyReturn.speed === 'delayed' && t.ilmHuruf.delayed}
                        </span>
                        {' '}
                        <span className="text-purple-600 dark:text-purple-400">
                          ({day.energyReturn.timeframe})
                        </span>
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {day.energyReturn.description}
                      </p>
                    </div>
                    
                    <div className="pt-3 border-t border-purple-200 dark:border-purple-700">
                      <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 mb-2 uppercase tracking-wide flex items-center gap-1">
                        <span>ðŸŽ¯</span>
                        <span>{t.ilmHuruf.todaysPractice}</span>
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {day.energyReturn.practice}
                      </p>
                    </div>
                    
                    <div className="pt-3 border-t border-purple-200 dark:border-purple-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                        <span className="font-semibold">{t.ilmHuruf.classicalTeaching}</span> "{t.ilmHuruf.classicalQuote}" 
                        {t.ilmHuruf.classicalMeaning}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Task Sequencer (Niáº“Äm - Lesson 28) - Only for high-harmony days */}
                {day.taskSequence && (
                  <div className="p-5 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                    
                    {/* Header */}
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                        <span className="text-2xl">ðŸ“‹</span>
                        <span>
                          {language === 'fr' ? 'SÃ©quence Optimale pour' : 'Optimal Sequence for'} {getTranslatedWeekday(day.date)}
                        </span>
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {getPlanetName(day.day_planet)} {language === 'fr' ? 'jour' : 'day'} â€¢ {t.ilmHuruf.harmony} {day.harmony_score}/10
                      </p>
                    </div>
                    
                    {/* Time Windows */}
                    <div className="space-y-4">
                      
                      {/* Morning */}
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-l-4 border-yellow-400">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-slate-900 dark:text-slate-100">
                            ðŸŒ… {language === 'fr' ? 'Matin' : 'Morning'}
                          </h5>
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-yellow-800 dark:text-yellow-200 font-medium">
                            {day.taskSequence.morning.timeRange}
                          </span>
                        </div>
                        
                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-3 font-medium">
                          {translateEnergyType(day.taskSequence.morning.energyType)}
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">
                              âœ“ {language === 'fr' ? 'IdÃ©al Pour :' : 'Best For:'}
                            </p>
                            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                              {day.taskSequence.morning.bestFor.map((task, i) => (
                                <li key={i}>â€¢ {translateTask(task)}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">
                              âœ— {language === 'fr' ? 'Ã€ Ã‰viter :' : 'Avoid:'}
                            </p>
                            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                              {day.taskSequence.morning.avoid.map((task, i) => (
                                <li key={i}>â€¢ {translateTask(task)}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        {day.taskSequence.morning.planetalPhase && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 italic">
                            {translatePlanetalPhase(day.taskSequence.morning.planetalPhase)}
                          </p>
                        )}
                      </div>
                      
                      {/* Midday */}
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-l-4 border-blue-400">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-slate-900 dark:text-slate-100">
                            â˜€ï¸ {language === 'fr' ? 'Midi' : 'Midday'}
                          </h5>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-800 dark:text-blue-200 font-medium">
                            {day.taskSequence.midday.timeRange}
                          </span>
                        </div>
                        
                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-3 font-medium">
                          {translateEnergyType(day.taskSequence.midday.energyType)}
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">
                              âœ“ {language === 'fr' ? 'IdÃ©al Pour :' : 'Best For:'}
                            </p>
                            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                              {day.taskSequence.midday.bestFor.map((task, i) => (
                                <li key={i}>â€¢ {translateTask(task)}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">
                              âœ— {language === 'fr' ? 'Ã€ Ã‰viter :' : 'Avoid:'}
                            </p>
                            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                              {day.taskSequence.midday.avoid.map((task, i) => (
                                <li key={i}>â€¢ {translateTask(task)}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        {day.taskSequence.midday.planetalPhase && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 italic">
                            {translatePlanetalPhase(day.taskSequence.midday.planetalPhase)}
                          </p>
                        )}
                      </div>
                      
                      {/* Afternoon */}
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-l-4 border-orange-400">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-slate-900 dark:text-slate-100">
                            ðŸŒ† {language === 'fr' ? 'AprÃ¨s-midi' : 'Afternoon'}
                          </h5>
                          <span className="text-xs bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded text-orange-800 dark:text-orange-200 font-medium">
                            {day.taskSequence.afternoon.timeRange}
                          </span>
                        </div>
                        
                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-3 font-medium">
                          {translateEnergyType(day.taskSequence.afternoon.energyType)}
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">
                              âœ“ {language === 'fr' ? 'IdÃ©al Pour :' : 'Best For:'}
                            </p>
                            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                              {day.taskSequence.afternoon.bestFor.map((task, i) => (
                                <li key={i}>â€¢ {translateTask(task)}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">
                              âœ— {language === 'fr' ? 'Ã€ Ã‰viter :' : 'Avoid:'}
                            </p>
                            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                              {day.taskSequence.afternoon.avoid.map((task, i) => (
                                <li key={i}>â€¢ {translateTask(task)}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        {day.taskSequence.afternoon.planetalPhase && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 italic">
                            {translatePlanetalPhase(day.taskSequence.afternoon.planetalPhase)}
                          </p>
                        )}
                      </div>
                      
                      {/* Evening */}
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-l-4 border-purple-400">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-slate-900 dark:text-slate-100">
                            ðŸŒ™ {language === 'fr' ? 'Soir' : 'Evening'}
                          </h5>
                          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded text-purple-800 dark:text-purple-200 font-medium">
                            {day.taskSequence.evening.timeRange}
                          </span>
                        </div>
                        
                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-3 font-medium">
                          {translateEnergyType(day.taskSequence.evening.energyType)}
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">
                              âœ“ {language === 'fr' ? 'IdÃ©al Pour :' : 'Best For:'}
                            </p>
                            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                              {day.taskSequence.evening.bestFor.map((task, i) => (
                                <li key={i}>â€¢ {translateTask(task)}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">
                              âœ— {language === 'fr' ? 'Ã€ Ã‰viter :' : 'Avoid:'}
                            </p>
                            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                              {day.taskSequence.evening.avoid.map((task, i) => (
                                <li key={i}>â€¢ {translateTask(task)}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        {day.taskSequence.evening.planetalPhase && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 italic">
                            {translatePlanetalPhase(day.taskSequence.evening.planetalPhase)}
                          </p>
                        )}
                      </div>
                      
                    </div>
                    
                    {/* Classical Wisdom */}
                    <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
                      <p className="text-xs italic text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">Classical teaching (Lesson 28):</span> "Li-kulli shay'in waqtun" 
                        (For everything there is a time) â€” Success comes from right action at right time.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Daily Tips */}
                <div className="space-y-3">
                  {day.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setSelectedDay(null)}
                  className="mt-4 w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <span>â–²</span>
                  Close Details
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-900 dark:text-amber-200">
          {t.ilmHuruf.reflectiveGuidance}
        </p>
      </div>
    </div>
  );
}

function DestinyResults({ results }: { results: any }) {
  const { t, language } = useLanguage();
  const [verseText, setVerseText] = useState<VerseText | null>(null);
  const [loadingVerse, setLoadingVerse] = useState(false);
  const [verseError, setVerseError] = useState<string | null>(null);

  // Fetch Quranic verse when quranResonance is available
  useEffect(() => {
    if (results?.quranResonance) {
      console.log('ðŸ•Œ Fetching Quranic Resonance:', results.quranResonance);
      setLoadingVerse(true);
      setVerseError(null);
      setVerseText(null);
      
      const fetchVerse = async () => {
        const verse = await fetchQuranVerse(
          results.quranResonance.surahNumber,
          results.quranResonance.ayahNumber
        );
        
        if (verse) {
          console.log('âœ… Successfully fetched verse:', verse);
          setVerseText(verse);
        } else {
          console.warn('âš ï¸ Verse fetch returned null');
          setVerseError('Unable to load verse at this moment. Please refresh or visit Quran.com directly.');
        }
        setLoadingVerse(false);
      };
      
      fetchVerse().catch(err => {
        console.error('âŒ Error fetching verse:', err);
        setVerseError(t?.errors?.verseLoadError || 'Unable to load verse text. Please try again.');
        setLoadingVerse(false);
      });
    }
  }, [results?.quranResonance]);

  // Safety check
  if (!results || !results.destiny) {
    return (
      <div className="text-center text-slate-500 dark:text-slate-400 py-8">
        Unable to calculate destiny. Please enter a name.
      </div>
    );
  }

  const station = results.destiny;
  
  // Debug log
  console.log('DestinyResults rendering. Has quranResonance?', !!results.quranResonance, results.quranResonance);
  
  // Extract language - already imported at top
  const isFr = language === 'fr';
  
  // Get localized station data
  const localizedStation = isFr && results.saghir in t.spiritualStations
    ? t.spiritualStations[results.saghir as keyof typeof t.spiritualStations]
    : station;
  
  return (
    <div className="space-y-6">
      {/* ========== NAME DESTINY RESULTS ========== */}
      {results.nameDestiny && (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl p-6 border-2 border-indigo-300 dark:border-indigo-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-7 h-7 text-indigo-700 dark:text-indigo-300" />
                <div>
                  <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {t.nameDestiny.coreAnalysis}
                  </h2>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                    {t.nameDestiny.coreAnalysisDesc}
                  </p>
                </div>
              </div>
              <InfoTooltip content={t.nameDestiny.motherNameInfo} />
            </div>
          </div>

          {/* Section 1: Core Numerology Values */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-700 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200">
                  {t.nameDestiny.nameChart.title}
                </h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  {t.nameDestiny.nameChart.subtitle}
                </p>
              </div>
            </div>

            {/* Primary Numerology Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {/* Total á¸¤adad KabÄ«r */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
              <div className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
                {t.nameDestiny.nameChart.total}
              </div>
              <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-100">
                {results.nameDestiny.totalKabir}
              </div>
              {results.nameDestiny.motherKabir > 0 && (
                <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                  ({results.nameDestiny.personKabir} + {results.nameDestiny.motherKabir})
                </div>
              )}
            </div>

            {/* Digital Root (á¹¢aghÄ«r) */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
              <div className="text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold mb-1">
                {t.nameDestiny.nameChart.saghir}
              </div>
              <div className="text-4xl font-bold text-purple-900 dark:text-purple-100">
                {results.nameDestiny.saghir}
              </div>
            </div>

            {/* Element (á¹¬abÊ¿) */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
              <div className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                {t.nameDestiny.nameChart.tabh}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{results.nameDestiny.element.icon}</span>
                <div>
                  <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {isFr ? results.nameDestiny.element.fr : results.nameDestiny.element.en}
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300">
                    {isFr ? results.nameDestiny.element.qualityFr : results.nameDestiny.element.qualityEn}
                  </div>
                </div>
              </div>
            </div>

            {/* Burj (Zodiac) */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
              <div className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold mb-1">
                {t.nameDestiny.nameChart.burj}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{results.nameDestiny.burj.symbol}</span>
                <div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                    {isFr ? results.nameDestiny.burj.fr : results.nameDestiny.burj.en}
                  </div>
                  <div className="text-xs text-amber-700 dark:text-amber-300 font-arabic mb-1">
                    {results.nameDestiny.burj.ar}
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 italic">
                    {isFr ? results.nameDestiny.burj.qualityFr : results.nameDestiny.burj.qualityEn}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Planet, Day, Hour row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center border border-slate-200 dark:border-slate-700">
              <div className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold mb-1">
                {t.nameDestiny.nameChart.planet}
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {results.nameDestiny.burj.planet}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center border border-slate-200 dark:border-slate-700">
              <div className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold mb-1">
                {t.nameDestiny.nameChart.day}
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {isFr ? results.nameDestiny.burj.dayFr : results.nameDestiny.burj.dayEn}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center border border-slate-200 dark:border-slate-700">
              <div className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center justify-center gap-1">
                {t.nameDestiny.nameChart.hour}
                <span className="relative group">
                  <Info className="h-3 w-3 text-slate-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {t.nameDestiny.nameChart.hourTip}
                  </div>
                </span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {results.nameDestiny.hourIndex}
              </div>
            </div>
          </div>

          {/* Element Inheritance (if mother's name provided) */}
          {results.nameDestiny.foundation && (
            <>
              {/* ========== INHERITED INFLUENCES SECTION (Mother's Name Impact) ========== */}
              <div className="mt-6 mb-4 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 rounded-xl p-4 border-2 border-rose-300 dark:border-rose-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-rose-700 dark:text-rose-300" />
                    <div>
                      <h2 className="text-lg font-bold text-rose-900 dark:text-rose-100">
                        {t.nameDestiny.inheritedInfluences}
                      </h2>
                      <p className="text-xs text-rose-700 dark:text-rose-300">
                        {t.nameDestiny.inheritedInfluencesDesc}
                      </p>
                    </div>
                  </div>
                  <InfoTooltip content={t.nameDestiny.motherNameExplanation} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-rose-200 dark:border-rose-700">
                <div className="text-sm uppercase tracking-wider text-rose-700 dark:text-rose-300 font-semibold mb-3">
                  {t.nameDestiny.origin.inheritance}
                </div>
              <div className="flex items-center justify-center gap-6 mb-3">
                {/* Expression (Person) */}
                <div className="text-center">
                  <div className="text-xs text-rose-600 dark:text-rose-400 mb-1 font-semibold">
                    {t.nameDestiny.origin.expression}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{results.nameDestiny.expression.icon}</span>
                    <span className="text-lg font-bold text-rose-900 dark:text-rose-100">
                      {isFr ? results.nameDestiny.expression.fr : results.nameDestiny.expression.en}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-3xl text-rose-400">â†”</div>

                {/* Foundation (Mother) */}
                <div className="text-center">
                  <div className="text-xs text-rose-600 dark:text-rose-400 mb-1 font-semibold">
                    {t.nameDestiny.origin.foundation}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{results.nameDestiny.foundation.icon}</span>
                    <span className="text-lg font-bold text-rose-900 dark:text-rose-100">
                      {isFr ? results.nameDestiny.foundation.fr : results.nameDestiny.foundation.en}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Element Harmony Badge */}
              {(() => {
                const expressionElem = isFr ? results.nameDestiny.expression.fr : results.nameDestiny.expression.en;
                const foundationElem = isFr ? results.nameDestiny.foundation.fr : results.nameDestiny.foundation.en;
                
                let harmonyType = '';
                let harmonyColor = '';
                
                if (expressionElem === foundationElem) {
                  harmonyType = t.nameDestiny.nameChart.unified;
                  harmonyColor = 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700';
                } else if (
                  (expressionElem === 'Fire' || expressionElem === 'Feu') && (foundationElem === 'Air' || foundationElem === 'Air') ||
                  (expressionElem === 'Air' || expressionElem === 'Air') && (foundationElem === 'Fire' || foundationElem === 'Feu') ||
                  (expressionElem === 'Water' || expressionElem === 'Eau') && (foundationElem === 'Earth' || foundationElem === 'Terre') ||
                  (expressionElem === 'Earth' || expressionElem === 'Terre') && (foundationElem === 'Water' || foundationElem === 'Eau')
                ) {
                  harmonyType = t.nameDestiny.nameChart.harmonious;
                  harmonyColor = 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700';
                } else if (
                  (expressionElem === 'Fire' || expressionElem === 'Feu') && (foundationElem === 'Earth' || foundationElem === 'Terre') ||
                  (expressionElem === 'Earth' || expressionElem === 'Terre') && (foundationElem === 'Air' || foundationElem === 'Air') ||
                  (expressionElem === 'Air' || expressionElem === 'Air') && (foundationElem === 'Water' || foundationElem === 'Eau') ||
                  (expressionElem === 'Water' || expressionElem === 'Eau') && (foundationElem === 'Fire' || foundationElem === 'Feu')
                ) {
                  harmonyType = t.nameDestiny.nameChart.nourishing;
                  harmonyColor = 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700';
                } else {
                  harmonyType = t.nameDestiny.nameChart.transformative;
                  harmonyColor = 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700';
                }
                
                return (
                  <div className="text-center">
                    <div className="text-xs text-rose-600 dark:text-rose-400 mb-1">{t.nameDestiny.nameChart.elementHarmony}</div>
                    <div className={`inline-block px-3 py-1 rounded-full border text-sm font-semibold ${harmonyColor}`}>
                      {harmonyType}
                    </div>
                  </div>
                );
              })()}
              </div>
            </>
          )}

          {/* Disclaimer */}
          <div className="mt-4 text-xs text-center text-indigo-600 dark:text-indigo-400 italic">
            {t.nameDestiny.disclaimer.reflectionOnly}
          </div>
        </div>
        </div>
      )}

      {/* Section 2: Element Distribution Chart */}
      {results.nameDestiny && results.nameDestiny.arabicName && (
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-teal-200 dark:border-teal-700 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            <div>
              <h3 className="text-2xl font-bold text-teal-900 dark:text-teal-200">
                {t.nameDestiny.elementChart.title}
              </h3>
              <p className="text-sm text-teal-700 dark:text-teal-300">
                {t.nameDestiny.elementChart.subtitle}
              </p>
            </div>
          </div>

          {(() => {
            // Calculate element distribution for the name
            const elementDist = calculateElementDistribution(results.nameDestiny.arabicName);
            
            // Find dominant element
            let dominantElement: 'fire' | 'air' | 'water' | 'earth' = 'fire';
            let maxPercentage = 0;
            
            Object.entries(elementDist).forEach(([elem, pct]) => {
              if (pct > maxPercentage) {
                maxPercentage = pct;
                dominantElement = elem as 'fire' | 'air' | 'water' | 'earth';
              }
            });

            // Element visual config
            const elementConfig = {
              fire: { icon: 'ðŸ”¥', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', bar: 'bg-red-500' },
              air: { icon: 'ðŸ’¨', color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30', bar: 'bg-sky-500' },
              water: { icon: 'ðŸ’§', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', bar: 'bg-blue-500' },
              earth: { icon: 'ðŸŒ', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', bar: 'bg-amber-500' }
            };

            return (
              <>
                {/* Element Bars */}
                <div className="space-y-3 mb-6">
                  {Object.entries(elementDist).map(([elem, pct]) => {
                    const config = elementConfig[elem as keyof typeof elementConfig];
                    const elemName = elem as 'fire' | 'air' | 'water' | 'earth';
                    const displayName = isFr ? t.nameDestiny.elementChart[elemName].name : elem.charAt(0).toUpperCase() + elem.slice(1);
                    
                    return (
                      <div key={elem} className="bg-white dark:bg-slate-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{config.icon}</span>
                            <span className={`font-semibold ${config.color}`}>{displayName}</span>
                          </div>
                          <span className={`font-bold text-lg ${config.color}`}>{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                          <div 
                            className={`${config.bar} h-2.5 rounded-full transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dominant Element Info */}
                <div className={`${elementConfig[dominantElement].bg} rounded-lg p-5 border-2 border-${dominantElement === 'fire' ? 'red' : dominantElement === 'air' ? 'sky' : dominantElement === 'water' ? 'blue' : 'amber'}-300 dark:border-${dominantElement === 'fire' ? 'red' : dominantElement === 'air' ? 'sky' : dominantElement === 'water' ? 'blue' : 'amber'}-700`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">{elementConfig[dominantElement].icon}</span>
                    <div>
                      <div className="text-xs uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-400">
                        {t.nameDestiny.elementChart.dominant}
                      </div>
                      <div className={`text-xl font-bold ${elementConfig[dominantElement].color}`}>
                        {isFr ? t.nameDestiny.elementChart[dominantElement].name : dominantElement.charAt(0).toUpperCase() + dominantElement.slice(1)} ({maxPercentage}%)
                      </div>
                    </div>
                  </div>
                  
                  {/* Personality Reflection */}
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      {t.nameDestiny.elementChart.personality}
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {t.nameDestiny.elementChart[dominantElement].personality}
                    </p>
                  </div>

                  {/* Balancing Dhikr */}
                  <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {t.nameDestiny.elementChart.balancingDhikr}
                    </div>
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {t.nameDestiny.elementChart.dhikr[dominantElement]}
                    </p>
                  </div>
                </div>
              </>
            );
          })()}

          {/* Disclaimer */}
          <div className="mt-4 text-xs text-center text-teal-600 dark:text-teal-400 italic">
            {t.nameDestiny.disclaimer.reflectionOnly}
          </div>
        </div>
      )}

      {/* Section 3: Temperament & Personality Profile */}
      {results.nameDestiny && results.nameDestiny.arabicName && (
        (() => {
          // Calculate dominant element from the name
          const elementDist = calculateElementDistribution(results.nameDestiny.arabicName);
          let dominantElement: 'fire' | 'air' | 'water' | 'earth' = 'fire';
          let maxPercentage = 0;
          
          Object.entries(elementDist).forEach(([elem, pct]) => {
            if (pct > maxPercentage) {
              maxPercentage = pct;
              dominantElement = elem as 'fire' | 'air' | 'water' | 'earth';
            }
          });

          return (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-700 shadow-lg">
              <TemperamentDisplay 
                element={dominantElement}
                compact={false}
                showCareer={true}
                showPsychology={true}
              />
            </div>
          );
        })()
      )}

      {/* Section 4: Spiritual & Color Resonance */}
      {results.nameDestiny && (results.nameDestiny.divineNameResonance || results.nameDestiny.colorResonance) && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700 shadow-lg">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-200 mb-1">
              âœ¨ {t.nameDestiny.higherResonance.title}
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              {t.nameDestiny.higherResonance.subtitle}
            </p>
          </div>

          {/* Divine Name Resonance */}
          {results.nameDestiny.divineNameResonance && (
            <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg p-5 border-2 border-purple-300 dark:border-purple-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">ðŸ•Šï¸</span>
                <h4 className="text-xl font-bold text-purple-900 dark:text-purple-200">
                  {t.nameDestiny.divineNameResonance.title}
                </h4>
              </div>
              
              <div className="text-center mb-4">
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
                  {t.nameDestiny.divineNameResonance.subtitle}
                </p>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-white">
                  <div className="text-3xl font-bold mb-2 font-arabic">
                    {results.nameDestiny.divineNameResonance.arabic}
                  </div>
                  <div className="text-xl font-semibold mb-1">
                    {results.nameDestiny.divineNameResonance.transliteration}
                  </div>
                  <div className="text-lg">
                    {isFr ? results.nameDestiny.divineNameResonance.meaningFr : results.nameDestiny.divineNameResonance.meaningEn}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
                  <div className="text-sm font-semibold text-purple-900 dark:text-purple-200 mb-1 flex items-center gap-2">
                    <span>ðŸ”¹</span> {t.nameDestiny.divineNameResonance.spiritualInfluence}
                  </div>
                  <p className="text-sm text-purple-800 dark:text-purple-300">
                    {isFr ? results.nameDestiny.divineNameResonance.spiritualInfluenceFr : results.nameDestiny.divineNameResonance.spiritualInfluence}
                  </p>
                </div>

                <div className="bg-pink-50 dark:bg-pink-900/30 rounded-lg p-4">
                  <div className="text-sm font-semibold text-pink-900 dark:text-pink-200 mb-1 flex items-center gap-2">
                    <span>ðŸ”¹</span> {t.nameDestiny.divineNameResonance.reflection}
                  </div>
                  <p className="text-sm text-pink-800 dark:text-pink-300">
                    {isFr ? results.nameDestiny.divineNameResonance.reflectionFr : results.nameDestiny.divineNameResonance.reflection}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Color Resonance */}
          {results.nameDestiny.colorResonance && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border-2 border-pink-300 dark:border-pink-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">ðŸŽ¨</span>
                <h4 className="text-xl font-bold text-pink-900 dark:text-pink-200">
                  {t.nameDestiny.colorResonance.title}
                </h4>
              </div>
              
              <p className="text-sm text-pink-700 dark:text-pink-300 mb-4">
                {t.nameDestiny.colorResonance.subtitle}
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Primary Color */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    ðŸŽ¨ {t.nameDestiny.colorResonance.primary}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-slate-300 dark:border-slate-600 shadow-md"
                      style={{ backgroundColor: results.nameDestiny.colorResonance.primary.hex }}
                    ></div>
                    <div>
                      <div className="font-bold text-lg text-slate-900 dark:text-slate-100">
                        {results.nameDestiny.colorResonance.primary.color}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {results.nameDestiny.colorResonance.primary.percentage}%
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {isFr ? results.nameDestiny.colorResonance.primary.meaningFr : results.nameDestiny.colorResonance.primary.meaning}
                  </p>
                </div>

                {/* Secondary Color */}
                {results.nameDestiny.colorResonance.secondary && (
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      ðŸŽ¨ {t.nameDestiny.colorResonance.secondary}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-slate-300 dark:border-slate-600 shadow-md"
                        style={{ backgroundColor: results.nameDestiny.colorResonance.secondary.hex }}
                      ></div>
                      <div>
                        <div className="font-bold text-lg text-slate-900 dark:text-slate-100">
                          {results.nameDestiny.colorResonance.secondary.color}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {results.nameDestiny.colorResonance.secondary.percentage}%
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {isFr ? results.nameDestiny.colorResonance.secondary.meaningFr : results.nameDestiny.colorResonance.secondary.meaning}
                    </p>
                  </div>
                )}
              </div>

              {/* Best Colors */}
              <div className="mb-4 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                <div className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
                  âœ… {t.nameDestiny.colorResonance.bestColors}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(isFr ? results.nameDestiny.colorResonance.bestColorsFr : results.nameDestiny.colorResonance.bestColorsEn).map((color: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-full text-sm font-medium border border-green-300 dark:border-green-600">
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* Colors to Avoid */}
              <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                <div className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                  âš ï¸ {t.nameDestiny.colorResonance.avoidColors}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(isFr ? results.nameDestiny.colorResonance.avoidColorsFr : results.nameDestiny.colorResonance.avoidColorsEn).map((color: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full text-sm font-medium border border-amber-300 dark:border-amber-600">
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <div className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ðŸ’¡</span> {t.nameDestiny.colorResonance.tip}
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {isFr ? results.nameDestiny.colorResonance.tipFr : results.nameDestiny.colorResonance.tipEn}
                </p>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-4 text-xs text-center text-purple-600 dark:text-purple-400 italic">
            {t.nameDestiny.disclaimer.reflectionOnly}
          </div>
        </div>
      )}

      {/* Section 5: Core Destiny Number & Station */}
      <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-8 text-white shadow-xl">
        <div className="text-center space-y-3">
          <div className="text-sm uppercase tracking-wider opacity-90 mb-2">{t.nameDestiny.destinyNumber.title}</div>
          <div className="text-7xl font-bold mb-3">{results.saghir}</div>
          <div className="text-3xl font-bold mb-2">{localizedStation.name}</div>
          <div className="text-2xl opacity-95 mb-4 font-arabic">{station.arabic}</div>
          <div className="text-lg opacity-90 max-w-2xl mx-auto">{localizedStation.meaning}</div>
        </div>
      </div>

      {/* Section 6: Supporting Numerology Values */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border-2 border-purple-200 dark:border-purple-700 shadow-md">
          <div className="text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold mb-2">KabÄ«r (Grand Total)</div>
          <div className="text-4xl font-bold text-purple-900 dark:text-purple-400">{results.kabir}</div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{t.nameDestiny.destinyNumber.sumOfLetters}</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border-2 border-blue-200 dark:border-blue-700 shadow-md">
          <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-2">á¸¤adath (Elemental Value)</div>
          <div className="text-4xl font-bold text-blue-900 dark:text-blue-400">{results.hadath}</div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{t.nameDestiny.destinyNumber.reducedRoot}</p>
        </div>
      </div>

      {/* Section 7: Qur'anic Resonance */}
      {results.quranResonance && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-emerald-500 dark:border-emerald-600 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-white" />
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {t.nameDestiny.quranicResonance.title}
                </h3>
                <p className="text-sm text-emerald-100 mt-1">{t.nameDestiny.quranicResonance.subtitle}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900">
            <div className="text-center space-y-3">
              <div className="text-4xl font-bold text-black dark:text-white mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                {results.quranResonance.surahNameArabic}
              </div>
              <div className="text-2xl font-bold text-black dark:text-white">
                {results.quranResonance.surahName}
              </div>
              <div className="inline-block px-5 py-2 bg-emerald-600 dark:bg-emerald-700 rounded-lg shadow-md">
                <div className="text-base font-bold text-white">
                  Ayah {results.quranResonance.ayahNumber} of {results.quranResonance.totalAyahsInSurah}
                </div>
              </div>
            </div>
            
            {/* Verse Text Display */}
            {loadingVerse && (
              <div className="text-center py-8 bg-emerald-50 dark:bg-slate-700 rounded-lg">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-300 border-t-emerald-600"></div>
                <p className="text-sm text-black dark:text-slate-300 mt-3 font-medium">Loading Qur'anic verse...</p>
              </div>
            )}
            
            {verseError && !loadingVerse && !verseText && (
              <div className="text-center py-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                <p className="text-sm text-amber-800 dark:text-amber-300">{verseError}</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                  The verse reference is valid (Surah {results.quranResonance.surahNumber}:{results.quranResonance.ayahNumber}), but we're having trouble fetching it.
                </p>
              </div>
            )}
            
            {verseText && !loadingVerse && (
              <div className="space-y-4 bg-white dark:bg-slate-750 rounded-lg p-6 border-2 border-emerald-200 dark:border-emerald-700">
                {/* Arabic Text */}
                {verseText.arabic && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Arabic Text</h4>
                    <div className="text-right bg-gradient-to-l from-emerald-50 to-transparent dark:from-slate-800 dark:to-transparent rounded p-5 border-r-4 border-emerald-500">
                      <p className="text-2xl md:text-3xl font-semibold leading-relaxed text-black dark:text-white" 
                         style={{ fontFamily: 'Amiri, Scheherazade, serif', lineHeight: '2', direction: 'rtl' }}>
                        {verseText.arabic}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Translation */}
                {verseText.translation && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">English Translation</h4>
                    <div className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent rounded p-5 border-l-4 border-blue-400">
                      <p className="text-base text-black dark:text-slate-200 leading-relaxed mb-3">
                        "{verseText.translation}"
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                        â€” {verseText.translationName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!verseText && !loadingVerse && !verseError && (
              <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
                <p>No verse data available for this resonance.</p>
              </div>
            )}
            
            <div className="flex justify-center pt-2">
              <a
                href={results.quranResonance.quranLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 font-bold shadow-lg hover:shadow-xl text-base"
              >
                <BookOpen className="w-5 h-5" />
                Read Full Verse on Quran.com
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <div className="pt-4 border-t-2 border-emerald-200 dark:border-emerald-800">
              <p className="text-base text-black dark:text-slate-300 italic text-center leading-relaxed font-medium">
                {getQuranResonanceMessage()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 8: Spiritual Origin (Mother's Name Analysis) */}
      {results.motherAnalysis && (
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl border-2 border-rose-200 dark:border-rose-800 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <Heart className="h-6 w-6 text-rose-500" />
            <div>
              <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                {t.nameDestiny.origin.title}
              </h3>
              <p className="text-sm text-rose-700 dark:text-rose-300 mt-1">
                {t.nameDestiny.motherOrigin.subtitle}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Mother's Element */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-rose-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {t.nameDestiny.origin.motherElement}
              </p>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                  {results.motherAnalysis.element}
                </div>
                <div className="text-lg font-arabic text-slate-700 dark:text-slate-300">
                  {results.motherAnalysis.elementArabic}
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {t.nameDestiny.origin.kabir}: {results.motherAnalysis.kabir} â€¢ {t.nameDestiny.origin.saghir}: {results.motherAnalysis.saghir} â€¢ {t.nameDestiny.origin.hadath}: {results.motherAnalysis.hadath}
              </div>
            </div>
            
            {/* Element Inheritance Comparison */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-rose-700">
              <p className="text-sm font-medium mb-3 text-black dark:text-slate-300">
                {t.nameDestiny.origin.inheritance}:
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1 text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.nameDestiny.origin.yourExpression}</p>
                  <p className="font-bold text-purple-600 dark:text-purple-400">
                    {(() => {
                      // Calculate user's element from their hadath
                      const userHadath = results.hadath;
                      let userElement = 'Earth';
                      if (userHadath >= 1 && userHadath <= 3) userElement = 'Fire';
                      else if (userHadath >= 4 && userHadath <= 6) userElement = 'Water';
                      else if (userHadath >= 7 && userHadath <= 9) userElement = 'Air';
                      return userElement;
                    })()}
                  </p>
                </div>
                <div className="text-3xl text-slate-400">â†”</div>
                <div className="flex-1 text-center p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.nameDestiny.origin.yourFoundation}</p>
                  <p className="font-bold text-rose-600 dark:text-rose-400">
                    {results.motherAnalysis.element}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Inheritance Insight */}
            <div className="p-4 bg-gradient-to-br from-white to-rose-50 dark:from-slate-800 dark:to-rose-900/10 rounded-lg border border-rose-200 dark:border-rose-700">
              <p className="text-sm font-semibold text-black dark:text-slate-100 mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                {t.nameDestiny.origin.insight}:
              </p>
              <p className="text-sm text-black dark:text-slate-300 leading-relaxed">
                {(() => {
                  // Calculate user's element and generate insight
                  const userHadath = results.hadath;
                  let userElement: 'Fire' | 'Water' | 'Air' | 'Earth' = 'Earth';
                  if (userHadath >= 1 && userHadath <= 3) userElement = 'Fire';
                  else if (userHadath >= 4 && userHadath <= 6) userElement = 'Water';
                  else if (userHadath >= 7 && userHadath <= 9) userElement = 'Air';
                  
                  // Check if French and use translation keys
                  if (language === 'fr' && t.inheritanceSame && t.inheritanceCompatible && t.inheritanceOpposing) {
                    const motherEl = results.motherAnalysis.element;
                    
                    // Same element
                    if (userElement === motherEl) {
                      return t.inheritanceSame.replace('{element}', 
                        userElement === 'Fire' ? t.elements.fire :
                        userElement === 'Water' ? t.elements.water :
                        userElement === 'Air' ? t.elements.air :
                        t.elements.earth
                      );
                    }
                    
                    // Compatible elements
                    const compatKey = `${userElement.toLowerCase()}${motherEl.charAt(0).toUpperCase()}${motherEl.slice(1).toLowerCase()}` as keyof typeof t.inheritanceCompatible;
                    if (t.inheritanceCompatible[compatKey]) {
                      return t.inheritanceCompatible[compatKey];
                    }
                    
                    // Opposing elements
                    const opposKey = `${userElement.toLowerCase()}${motherEl.charAt(0).toUpperCase()}${motherEl.slice(1).toLowerCase()}` as keyof typeof t.inheritanceOpposing;
                    if (t.inheritanceOpposing[opposKey]) {
                      return t.inheritanceOpposing[opposKey];
                    }
                  }
                  
                  // Fallback to English
                  return generateInheritanceInsight(
                    userElement,
                    results.motherAnalysis.element
                  );
                })()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 9: Letter Geometry & Form Analysis */}
      {results.geometry && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl shadow-lg border-2 border-indigo-200 dark:border-indigo-800 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Compass className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                {t.nameDestiny.geometry.title}
              </h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                The shapes and forms within your name
              </p>
            </div>
          </div>
          <div className="space-y-5">
            {/* Vertical */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ArrowUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold uppercase text-black dark:text-indigo-300">
                  {isFr ? GEOMETRY_NAMES.vertical.fr : GEOMETRY_NAMES.vertical.en} ({GEOMETRY_NAMES.vertical.transliteration} - {GEOMETRY_NAMES.vertical.ar})
                  <span className="ml-2 text-xs font-normal">({results.geometry.vertical.count} {isFr ? 'lettres' : 'letters'})</span>
                </span>
              </div>
              {results.geometry.vertical.count > 0 ? (
                <>
                  <div className="flex gap-2 mb-2 flex-wrap" dir="rtl">
                    {results.geometry.vertical.letters.map((letter: string, i: number) => (
                      <span 
                        key={i}
                        className="text-3xl p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-900 dark:text-blue-100"
                        style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-black dark:text-gray-400">
                    {GEOMETRY_KEYWORDS.vertical.join(' â€¢ ')}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-500 italic">{t.nameDestiny.geometry.none}</p>
              )}
            </div>

            <div className="border-t border-indigo-200 dark:border-indigo-800"></div>

            {/* Round */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Circle className="w-4 h-4 text-rose-600" />
                <span className="text-sm font-bold uppercase text-black dark:text-indigo-300">
                  {isFr ? GEOMETRY_NAMES.round.fr : GEOMETRY_NAMES.round.en} ({GEOMETRY_NAMES.round.transliteration} - {GEOMETRY_NAMES.round.ar})
                  <span className="ml-2 text-xs font-normal">({results.geometry.round.count} {isFr ? 'lettres' : 'letters'})</span>
                </span>
              </div>
              {results.geometry.round.count > 0 ? (
                <>
                  <div className="flex gap-2 mb-2 flex-wrap" dir="rtl">
                    {results.geometry.round.letters.map((letter: string, i: number) => (
                      <span 
                        key={i}
                        className="text-3xl p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-900 dark:text-rose-100"
                        style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-black dark:text-gray-400">
                    {GEOMETRY_KEYWORDS.round.join(' â€¢ ')}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-500 italic">{t.nameDestiny.geometry.none}</p>
              )}
            </div>

            <div className="border-t border-indigo-200 dark:border-indigo-800"></div>

            {/* Flat */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Minus className="w-4 h-4 text-amber-700" />
                <span className="text-sm font-bold uppercase text-black dark:text-indigo-300">
                  {isFr ? GEOMETRY_NAMES.flat.fr : GEOMETRY_NAMES.flat.en} ({GEOMETRY_NAMES.flat.transliteration} - {GEOMETRY_NAMES.flat.ar})
                  <span className="ml-2 text-xs font-normal">({results.geometry.flat.count} {isFr ? 'lettres' : 'letters'})</span>
                </span>
              </div>
              {results.geometry.flat.count > 0 ? (
                <>
                  <div className="flex gap-2 mb-2 flex-wrap" dir="rtl">
                    {results.geometry.flat.letters.map((letter: string, i: number) => (
                      <span 
                        key={i}
                        className="text-3xl p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-900 dark:text-amber-100"
                        style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-black dark:text-gray-400">
                    {GEOMETRY_KEYWORDS.flat.join(' â€¢ ')}
                  </p>
                </>
              ) : (
                <p className="text-sm text-black dark:text-gray-500 italic">{t.nameDestiny.geometry.none}</p>
              )}
            </div>

            <div className="border-t border-indigo-200 dark:border-indigo-800"></div>

            {/* Angular */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-bold uppercase text-black dark:text-indigo-300">
                  {isFr ? GEOMETRY_NAMES.angular.fr : GEOMETRY_NAMES.angular.en} ({GEOMETRY_NAMES.angular.transliteration} - {GEOMETRY_NAMES.angular.ar})
                  <span className="ml-2 text-xs font-normal">({results.geometry.angular.count} {isFr ? 'lettres' : 'letters'})</span>
                </span>
              </div>
              {results.geometry.angular.count > 0 ? (
                <>
                  <div className="flex gap-2 mb-2 flex-wrap" dir="rtl">
                    {results.geometry.angular.letters.map((letter: string, i: number) => (
                      <span 
                        key={i}
                        className="text-3xl p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-900 dark:text-orange-100"
                        style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-black dark:text-gray-400">
                    {GEOMETRY_KEYWORDS.angular.join(' â€¢ ')}
                  </p>
                </>
              ) : (
                <p className="text-sm text-black dark:text-gray-500 italic">{t.nameDestiny.geometry.none}</p>
              )}
            </div>

            {/* Geometric Profile */}
            <div className="mt-4 p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg border-l-4 border-indigo-500">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-black dark:text-indigo-200 mb-2">
                    {t.nameDestiny.geometry.profile}
                  </div>
                  <p className="text-sm text-black dark:text-indigo-300 leading-relaxed">
                    {(() => {
                      // Determine the profile type based on geometry percentages
                      const { vertical, round, flat, angular } = results.geometry;
                      const dominantType = results.geometry.dominant;
                      const dominantPct = results.geometry[dominantType].percentage;
                      
                      // Map to translation key
                      if (dominantPct > 60) {
                        return t.geometryProfiles[`${dominantType}Dominant` as keyof typeof t.geometryProfiles];
                      } else {
                        return t.geometryProfiles.balanced;
                      }
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Soul Triad */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-4 text-black dark:text-slate-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          {t.nameDestiny.triad.title}
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="font-bold text-black dark:text-purple-300 mb-1">
              {t.nameDestiny.triad.lifeDestiny} ({results.saghir})
            </div>
            <div className="text-sm text-black dark:text-slate-300">
              {localizedStation.quality}
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="font-bold text-black dark:text-blue-300 mb-1">
              {t.nameDestiny.triad.soulUrge} ({results.soulUrge?.name})
            </div>
            <div className="text-sm text-black dark:text-slate-300">
              {(() => {
                if (!results.soulUrge) return '';
                const soulNumber = results.soulUrge.name;
                return isFr && soulNumber in t.spiritualStations
                  ? t.spiritualStations[soulNumber as keyof typeof t.spiritualStations].quality
                  : results.soulUrge.quality;
              })()}
            </div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="font-bold text-black dark:text-green-300 mb-1">
              {t.nameDestiny.triad.outerPersonality} ({results.personality?.name})
            </div>
            <div className="text-sm text-black dark:text-slate-300">
              {(() => {
                if (!results.personality) return '';
                const personalityNumber = results.personality.name;
                return isFr && personalityNumber in t.spiritualStations
                  ? t.spiritualStations[personalityNumber as keyof typeof t.spiritualStations].quality
                  : results.personality.quality;
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Life Guidance */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          {t.nameDestiny.guidance.title}
        </h3>
        
        <div className="space-y-5">
          <div>
            <div className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1 flex items-center gap-2">
              âœ¨ {t.nameDestiny.guidance.yourPath}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">
              {t.nameDestiny.guidance.yourPathDesc}
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              {(() => {
                // Build localized interpretation
                const destinyStation = localizedStation;
                const soulStation = isFr && results.soulUrge && results.soulUrge.name in t.spiritualStations
                  ? t.spiritualStations[results.soulUrge.name as keyof typeof t.spiritualStations]
                  : results.soulUrge;
                const personalityStation = isFr && results.personality && results.personality.name in t.spiritualStations
                  ? t.spiritualStations[results.personality.name as keyof typeof t.spiritualStations]
                  : results.personality;
                
                if (isFr) {
                  return `Votre destin de vie (${destinyStation.name}) vous appelle Ã  ${destinyStation.quality.toLowerCase()}. ` +
                    `Votre Ã¢me aspire profondÃ©ment Ã  ${soulStation?.quality.toLowerCase()}, ` +
                    `tandis qu'extÃ©rieurement vous exprimez ${personalityStation?.quality.toLowerCase()}. ` +
                    `L'intÃ©gration se produit lorsque vous alignez ces trois dimensions.`;
                } else {
                  return results.interpretation;
                }
              })()}
            </p>
          </div>
          
          <div>
            <div className="font-semibold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-2">
              ðŸ•Š {t.nameDestiny.guidance.spiritualPractice}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">
              {t.nameDestiny.guidance.spiritualPracticeDesc}
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              {localizedStation.practice}
            </p>
          </div>
          
          <div>
            <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-2">
              ðŸ“– {t.nameDestiny.guidance.quranicGuidance}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">
              {t.nameDestiny.guidance.quranicGuidanceDesc}
            </p>
            <p className="text-slate-700 dark:text-slate-300 italic">
              {localizedStation.verse}
            </p>
          </div>
          
          <div>
            <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-2">
              ðŸ§­ {t.nameDestiny.guidance.practicalAction}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">
              {t.nameDestiny.guidance.practicalActionDesc}
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              {localizedStation.practical}
            </p>
          </div>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
            <div className="font-semibold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-2">
              âš ï¸ {t.nameDestiny.guidance.shadowToWatch}
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2 italic">
              {t.nameDestiny.guidance.shadowToWatchDesc}
            </p>
            <p className="text-amber-800 dark:text-amber-200">
              {localizedStation.shadow}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompatibilityResults({ results }: { results: any }) {
  const { t, language } = useLanguage();
  
  // Helper function to get score interpretation
  const getScoreInterpretation = (score: number, quality: string): string[] => {
    if (language === 'fr') {
      if (score >= 85) {
        return [
          'ðŸŒŸ CompatibilitÃ© exceptionnelle',
          '',
          'Ce que cela signifie :',
          'Harmonie exceptionnelle aux niveaux de surface et d\'Ã¢me. Vos Ã©nergies se complÃ¨tent magnifiquement. Cette relation a un potentiel extraordinaire pour la croissance mutuelle et le bonheur.',
          '',
          'Attente rÃ©aliste :',
          'â€¢ La communication coule naturellement',
          'â€¢ Vous vous "comprenez" intuitivement',
          'â€¢ Les dÃ©fis sont gÃ©rables ensemble',
          'â€¢ Concentrez-vous sur la croissance continue'
        ];
      } else if (score >= 70) {
        return [
          'ðŸ’« TrÃ¨s bonne compatibilitÃ©',
          '',
          'Ce que cela signifie :',
          'Forte compatibilitÃ© avec des domaines mineurs Ã  cultiver. Cette connexion a un grand potentiel avec un effort mutuel. Vos forces dÃ©passent largement vos dÃ©fis.',
          '',
          'Attente rÃ©aliste :',
          'â€¢ Excellent potentiel Ã  long terme',
          'â€¢ Quelques domaines nÃ©cessitent une attention consciente',
          'â€¢ La communication et le compromis sont essentiels',
          'â€¢ Cultivez ce que vous avez construit ensemble'
        ];
      } else if (score >= 55) {
        return [
          'âœ¨ Bonne compatibilitÃ©',
          '',
          'Ce que cela signifie :',
          'CompatibilitÃ© modÃ©rÃ©e. Vous pouvez construire une relation harmonieuse avec comprÃ©hension, communication et compromis. Vos diffÃ©rences sont gÃ©rablesâ€”pas des obstaclesâ€”mais nÃ©cessitent un effort conscient.',
          '',
          'Attente rÃ©aliste :',
          score >= 60 
            ? 'â€¢ La vie quotidienne peut avoir des frictions\nâ€¢ Mais votre fondation Ã©motionnelle est solide\nâ€¢ Concentrez-vous sur le lien profond que vous partagez'
            : 'â€¢ Les deux partenaires doivent Ãªtre engagÃ©s\nâ€¢ Les diffÃ©rences enrichissent quand honorÃ©es\nâ€¢ La patience et la comprÃ©hension sont essentielles'
        ];
      } else if (score >= 40) {
        return [
          'âš ï¸ CompatibilitÃ© difficile',
          '',
          'Ce que cela signifie :',
          'DiffÃ©rences significatives d\'Ã©nergie et d\'approche. Cette relation nÃ©cessite un effort substantiel, de la patience et une croissance mutuelle. Possible, mais les deux partenaires doivent Ãªtre pleinement engagÃ©s.',
          '',
          'Attente rÃ©aliste :',
          'â€¢ NÃ©cessite un travail conscient quotidien',
          'â€¢ Les deux doivent vouloir grandir ensemble',
          'â€¢ Cherchez des conseils professionnels si nÃ©cessaire',
          'â€¢ CÃ©lÃ©brez les petites victoires'
        ];
      } else {
        return [
          'ðŸš¨ TrÃ¨s difficile',
          '',
          'Ce que cela signifie :',
          'Conflits Ã©lÃ©mentaires majeurs. Bien que non impossible, ce jumelage fait face Ã  des dÃ©fis fondamentaux qui nÃ©cessitent un engagement profond pour Ãªtre surmontÃ©s.',
          '',
          'ConsidÃ©ration sÃ©rieuse :',
          'â€¢ ÃŠtes-vous tous deux pleinement engagÃ©s Ã  grandir ?',
          'â€¢ Le conseil professionnel est fortement recommandÃ©',
          'â€¢ Fixez des attentes rÃ©alistes',
          'â€¢ Honorez vos besoins individuels aussi'
        ];
      }
    } else {
      if (score >= 85) {
        return [
          'ðŸŒŸ Exceptional Compatibility',
          '',
          'What This Means:',
          'Outstanding compatibility on both surface and soul levels. Your energies complement each other beautifully. This relationship has extraordinary potential for mutual growth and happiness.',
          '',
          'Realistic Expectation:',
          'â€¢ Communication flows naturally',
          'â€¢ You "get" each other intuitively',
          'â€¢ Challenges are manageable together',
          'â€¢ Focus on continuous growth'
        ];
      } else if (score >= 70) {
        return [
          'ðŸ’« Very Good Compatibility',
          '',
          'What This Means:',
          'Strong compatibility with minor areas to nurture. This connection has great potential with mutual effort. Your strengths far outweigh your challenges.',
          '',
          'Realistic Expectation:',
          'â€¢ Excellent long-term potential',
          'â€¢ Some areas need conscious attention',
          'â€¢ Communication and compromise are key',
          'â€¢ Nurture what you\'ve built together'
        ];
      } else if (score >= 55) {
        return [
          'âœ¨ Good Compatibility',
          '',
          'What This Means:',
          'Moderate compatibility. You can build a harmonious relationship with understanding, communication, and compromise. Your differences are workableâ€”not deal-breakersâ€”but require conscious effort.',
          '',
          'Realistic Expectation:',
          score >= 60 
            ? 'â€¢ Daily life may have friction\nâ€¢ But your emotional foundation is strong\nâ€¢ Focus on nurturing the deep bond you share'
            : 'â€¢ Both partners need to be committed\nâ€¢ Differences enrich when honored\nâ€¢ Patience and understanding are essential'
        ];
      } else if (score >= 40) {
        return [
          'âš ï¸ Challenging Compatibility',
          '',
          'What This Means:',
          'Significant differences in energy and approach. This relationship requires substantial effort, patience, and mutual growth. Possible, but both partners must be fully committed.',
          '',
          'Realistic Expectation:',
          'â€¢ Requires conscious daily work',
          'â€¢ Both must want to grow together',
          'â€¢ Seek professional guidance if needed',
          'â€¢ Celebrate small victories'
        ];
      } else {
        return [
          'ðŸš¨ Very Difficult',
          '',
          'What This Means:',
          'Major elemental conflicts. While not impossible, this pairing faces fundamental challenges that require deep commitment to overcome.',
          '',
          'Serious Consideration:',
          'â€¢ Are you both fully committed to growth?',
          'â€¢ Professional counseling is strongly recommended',
          'â€¢ Set realistic expectations',
          'â€¢ Honor your individual needs too'
        ];
      }
    }
  };
  
  // Check format type
  const isNewThreeMethod = results?.mode === 'relationship' && results?.methods;
  
  if (!results || !results.person1 || !results.person2) {
    return (
      <div className="text-center text-slate-500 dark:text-slate-400 py-8">
        Unable to calculate compatibility. Please ensure both names are entered.
      </div>
    );
  }

  // New format with four methods (Spiritual, Elemental, Planetary, Daily Interaction)
  if (isNewThreeMethod) {
    const { person1, person2, methods, overallScore, overallQuality, overallQualityFrench, summary, summaryFrench, recommendations, recommendationsFrench } = results as RelationshipCompatibility;
    
    const qualityColors: Record<string, string> = {
      'excellent': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'very-good': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'good': 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
      'moderate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'challenging': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
    };
    
    // Select content based on language
    const displayRecommendations = language === 'fr' ? recommendationsFrench : recommendations;
    const displaySummary = language === 'fr' ? summaryFrench : summary;
    const displayOverallQuality = language === 'fr' ? overallQualityFrench : overallQuality.toUpperCase().replace('-', ' ');
    return (
      <div className="space-y-6">
        {/* Overall Score */}
        <div className="flex flex-col items-center py-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg">
          <CompatibilityGauge 
            score={overallScore} 
            size="lg"
            label="Overall Compatibility"
          />
          <div className={`mt-4 px-4 py-2 rounded-full font-semibold ${qualityColors[overallQuality] || qualityColors['moderate']}`}>
            {displayOverallQuality}
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {displaySummary}
            </p>
          </div>
        </div>

        {/* Four Methods */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 text-center">
            {language === 'fr' ? 'Quatre MÃ©thodes d\'Analyse' : 'Four Analysis Methods'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Spiritual-Destiny */}
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg space-y-3">
              <div className="flex items-center justify-center">
                <CompatibilityGauge 
                  score={methods.spiritualDestiny.score}
                  size="md"
                  color={methods.spiritualDestiny.color === 'green' ? '#10b981' : 
                         methods.spiritualDestiny.color === 'blue' ? '#3b82f6' :
                         methods.spiritualDestiny.color === 'yellow' ? '#eab308' :
                         methods.spiritualDestiny.color === 'purple' ? '#a855f7' : '#f97316'}
                />
              </div>
              <h4 className="font-bold text-center text-gray-900 dark:text-gray-100">
                ðŸŒ™ Spiritual Destiny
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Remainder: {methods.spiritualDestiny.remainder}
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {language === 'fr' ? methods.spiritualDestiny.descriptionFrench : methods.spiritualDestiny.description}
              </p>
            </div>

            {/* Elemental-Temperament */}
            <div className="p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg space-y-3">
              <div className="flex items-center justify-center">
                <CompatibilityGauge 
                  score={methods.elementalTemperament.score}
                  size="md"
                  color={methods.elementalTemperament.color === 'red' ? '#ef4444' :
                         methods.elementalTemperament.color === 'blue' ? '#3b82f6' :
                         methods.elementalTemperament.color === 'cyan' ? '#06b6d4' : '#10b981'}
                />
              </div>
              <h4 className="font-bold text-center text-gray-900 dark:text-gray-100">
                ðŸŒŠ Elemental Temperament
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Element: {language === 'fr' ? methods.elementalTemperament.sharedElementFrench : methods.elementalTemperament.sharedElement}
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {language === 'fr' ? methods.elementalTemperament.descriptionFrench : methods.elementalTemperament.description}
              </p>
            </div>

            {/* Planetary-Cosmic */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg space-y-3">
              <div className="flex items-center justify-center">
                <CompatibilityGauge 
                  score={methods.planetaryCosmic.score}
                  size="md"
                  color={methods.planetaryCosmic.color === 'green' ? '#10b981' :
                         methods.planetaryCosmic.color === 'blue' ? '#3b82f6' :
                         methods.planetaryCosmic.color === 'yellow' ? '#eab308' : '#f97316'}
                />
              </div>
              <h4 className="font-bold text-center text-gray-900 dark:text-gray-100">
                {language === 'fr' ? 'â­ Cosmique PlanÃ©taire' : 'â­ Planetary Cosmic'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {methods.planetaryCosmic.person1Planet.name} Ã— {methods.planetaryCosmic.person2Planet.name}
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {language === 'fr' ? methods.planetaryCosmic.descriptionFrench : methods.planetaryCosmic.description}
              </p>
            </div>

            {/* Daily Interaction (NEW) */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg space-y-3">
              <div className="flex items-center justify-center">
                <CompatibilityGauge 
                  score={methods.dailyInteraction.score}
                  size="md"
                  color={methods.dailyInteraction.color === 'green' ? '#10b981' :
                         methods.dailyInteraction.color === 'blue' ? '#3b82f6' :
                         methods.dailyInteraction.color === 'yellow' ? '#eab308' : '#f97316'}
                />
              </div>
              <h4 className="font-bold text-center text-gray-900 dark:text-gray-100">
                {language === 'fr' ? 'ðŸ¤ Interaction Quotidienne' : 'ðŸ¤ Daily Interaction'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {language === 'fr' 
                  ? `${methods.dailyInteraction.person1DominantFrench} Ã— ${methods.dailyInteraction.person2DominantFrench}`
                  : `${methods.dailyInteraction.person1Dominant} Ã— ${methods.dailyInteraction.person2Dominant}`
                }
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {language === 'fr' ? methods.dailyInteraction.descriptionFrench : methods.dailyInteraction.description}
              </p>
            </div>
          </div>
        </div>

        {/* NEW FEATURE 1: Letter Chemistry Breakdown */}
        <div className="p-6 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/20 dark:to-orange-950/20 rounded-xl space-y-4">
          {/* Title with Explanation */}
          <div className="text-center space-y-2 mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
              <span>âœ¨</span>
              <span>{t.compatibilityResults.letterChemistry}</span>
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                ({t.compatibilityResults.letterChemistryArabic} â€¢ Ø²ÙˆØ§Ø¬ Ø§Ù„Ø­Ø±ÙˆÙ)
              </span>
            </h3>
            {/* Description Line */}
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t.compatibilityResults.letterChemistryDesc}
            </p>
          </div>
          
          {(() => {
            // Calculate element distributions for both people
            const person1Dist = calculateElementDistribution(person1.arabicName);
            const person2Dist = calculateElementDistribution(person2.arabicName);
            
            // Calculate combined distribution
            const combined = {
              fire: Math.round((person1Dist.fire + person2Dist.fire) / 2),
              air: Math.round((person1Dist.air + person2Dist.air) / 2),
              water: Math.round((person1Dist.water + person2Dist.water) / 2),
              earth: Math.round((person1Dist.earth + person2Dist.earth) / 2)
            };
            
            // Calculate overall harmony percentage (based on element balance)
            const maxElement = Math.max(combined.fire, combined.air, combined.water, combined.earth);
            const minElement = Math.min(combined.fire, combined.air, combined.water, combined.earth);
            const harmonyPercentage = Math.round(100 - ((maxElement - minElement) * 1.5)); // More balanced = higher harmony
            
            const dominant1 = getDominantElement(person1Dist);
            const dominant2 = getDominantElement(person2Dist);
            
            return (
              <>
                {/* Combined Element Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {t.compatibilityResults.combinedHarmony}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {t.ilmHuruf.harmony}: {harmonyPercentage}%
                    </span>
                  </div>
                  {/* Harmony explanation */}
                  <p className="text-xs italic text-gray-600 dark:text-gray-400 text-center">
                    {t.compatibilityResults.combinedHarmonyExplain}
                  </p>
                  <div className="flex h-6 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-inner">
                    {combined.fire > 0 && (
                      <div 
                        style={{ width: `${combined.fire}%` }}
                        className="bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold"
                        title={`${getElementName('fire', language === 'fr' ? 'fr' : 'en')} ${combined.fire}%`}
                      >
                        {combined.fire >= 15 && `ðŸ”¥ ${combined.fire}%`}
                      </div>
                    )}
                    {combined.air > 0 && (
                      <div 
                        style={{ width: `${combined.air}%` }}
                        className="bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold"
                        title={`${getElementName('air', language === 'fr' ? 'fr' : 'en')} ${combined.air}%`}
                      >
                        {combined.air >= 15 && `ðŸ’¨ ${combined.air}%`}
                      </div>
                    )}
                    {combined.water > 0 && (
                      <div 
                        style={{ width: `${combined.water}%` }}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold"
                        title={`${getElementName('water', language === 'fr' ? 'fr' : 'en')} ${combined.water}%`}
                      >
                        {combined.water >= 15 && `ðŸ’§ ${combined.water}%`}
                      </div>
                    )}
                    {combined.earth > 0 && (
                      <div 
                        style={{ width: `${combined.earth}%` }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center text-white text-xs font-bold"
                        title={`${getElementName('earth', language === 'fr' ? 'fr' : 'en')} ${combined.earth}%`}
                      >
                        {combined.earth >= 15 && `ðŸŒ ${combined.earth}%`}
                      </div>
                    )}
                  </div>
                </div>

                {/* NEW FEATURE 2: Dominant Element Pair Insight */}
                <div className="mt-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-rose-200 dark:border-rose-800">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-2xl">{getElementIcon(dominant1)}</span>
                    <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
                      {getElementName(dominant1, language === 'fr' ? 'fr' : 'en')}
                    </span>
                    <span className="text-2xl">Ã—</span>
                    <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
                      {getElementName(dominant2, language === 'fr' ? 'fr' : 'en')}
                    </span>
                    <span className="text-2xl">{getElementIcon(dominant2)}</span>
                  </div>
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {t.compatibilityResults.balanceAdvice[getBalanceAdviceKey(dominant1, dominant2) as keyof typeof t.compatibilityResults.balanceAdvice]}
                  </p>
                </div>

                {/* Individual breakdowns */}
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="space-y-2 mb-3">
                      <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                        {person1.name}
                      </div>
                      {/* Element Temperament Tag */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg">{getElementIcon(dominant1)}</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 px-2 py-1 rounded-full border border-purple-300 dark:border-purple-700">
                          {(() => {
                            const key = `${dominant1}Temperament` as 'fireTemperament' | 'airTemperament' | 'waterTemperament' | 'earthTemperament';
                            return t.compatibilityResults[key];
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {(['fire', 'air', 'water', 'earth'] as const).map(el => (
                        person1Dist[el] > 0 && (
                          <div key={el} className="flex items-center gap-2 text-xs">
                            <span>{getElementIcon(el)}</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  el === 'fire' ? 'bg-red-500' :
                                  el === 'air' ? 'bg-cyan-500' :
                                  el === 'water' ? 'bg-blue-500' : 'bg-green-600'
                                }`}
                                style={{ width: `${person1Dist[el]}%` }}
                              />
                            </div>
                            <span className="w-10 text-right text-gray-600 dark:text-gray-400">
                              {person1Dist[el]}%
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg border border-pink-200 dark:border-pink-800">
                    <div className="space-y-2 mb-3">
                      <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                        {person2.name}
                      </div>
                      {/* Element Temperament Tag */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg">{getElementIcon(dominant2)}</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 px-2 py-1 rounded-full border border-pink-300 dark:border-pink-700">
                          {(() => {
                            const key = `${dominant2}Temperament` as 'fireTemperament' | 'airTemperament' | 'waterTemperament' | 'earthTemperament';
                            return t.compatibilityResults[key];
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {(['fire', 'air', 'water', 'earth'] as const).map(el => (
                        person2Dist[el] > 0 && (
                          <div key={el} className="flex items-center gap-2 text-xs">
                            <span>{getElementIcon(el)}</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  el === 'fire' ? 'bg-red-500' :
                                  el === 'air' ? 'bg-cyan-500' :
                                  el === 'water' ? 'bg-blue-500' : 'bg-green-600'
                                }`}
                                style={{ width: `${person2Dist[el]}%` }}
                              />
                            </div>
                            <span className="w-10 text-right text-gray-600 dark:text-gray-400">
                              {person2Dist[el]}%
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {/* NEW FEATURE 3: Balancing Dhikr Recommendation */}
        <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-xl">
          <h3 className="text-lg font-bold text-center text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center gap-2">
            <span>ðŸ¤²</span>
            <span>{t.compatibilityResults.balancingDhikr}</span>
          </h3>
          {/* Contextual Sentence */}
          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4 italic">
            {t.compatibilityResults.balancingDhikrContext}
          </p>
          {(() => {
            const person1Dist = calculateElementDistribution(person1.arabicName);
            const person2Dist = calculateElementDistribution(person2.arabicName);
            const dominant1 = getDominantElement(person1Dist);
            const dominant2 = getDominantElement(person2Dist);
            
            // Get dhikr for the most dominant element
            const primaryDhikr = DHIKR_NAMES[dominant1];
            const primaryEffectKey = getDhikrEffectKey(dominant1) as 'fireEffect' | 'airEffect' | 'waterEffect' | 'earthEffect';
            const primaryEffect = t.compatibilityResults.dhikrEffects[primaryEffectKey];
            const secondaryDhikr = dominant1 !== dominant2 ? DHIKR_NAMES[dominant2] : null;
            const secondaryEffectKey = secondaryDhikr ? getDhikrEffectKey(dominant2) as 'fireEffect' | 'airEffect' | 'waterEffect' | 'earthEffect' : null;
            const secondaryEffect = secondaryEffectKey ? t.compatibilityResults.dhikrEffects[secondaryEffectKey] : null;
            
            return (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getElementIcon(dominant1)}</span>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-gray-100">
                        {language === 'fr' ? primaryDhikr.nameFr : primaryDhikr.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {t.compatibilityResults.for} {getElementName(dominant1, language === 'fr' ? 'fr' : 'en')}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {primaryEffect}
                  </p>
                </div>
                
                {secondaryDhikr && (
                  <div className="p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getElementIcon(dominant2)}</span>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">
                          {language === 'fr' ? secondaryDhikr.nameFr : secondaryDhikr.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {t.compatibilityResults.for} {getElementName(dominant2, language === 'fr' ? 'fr' : 'en')}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {secondaryEffect}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100">
              {t.compatibilityResults.recommendations}
            </h3>
          </div>
          
          <ul className="space-y-2">
            {displayRecommendations.map((rec, idx) => (
              <li 
                key={idx}
                className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg"
              >
                <span className="text-amber-600 dark:text-amber-400 font-bold">â€¢</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Old format (fallback)
  const harmonyColor = results.harmonyScore >= 75 ? 'text-green-600' : results.harmonyScore >= 50 ? 'text-amber-600' : 'text-red-600';
  const harmonyBg = results.harmonyScore >= 75 ? 'bg-green-50 dark:bg-green-900/20' : results.harmonyScore >= 50 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20';
  
  return (
    <div className="space-y-6">
      {/* Harmony Score */}
      <div className={`${harmonyBg} rounded-xl p-6 border-2 ${harmonyColor.replace('text-', 'border-')}`}>
        <div className="text-center">
          <div className={`text-6xl font-bold mb-2 ${harmonyColor}`}>{results.harmonyScore}%</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {results.relationship}
          </div>
          <div className="text-slate-700 dark:text-slate-300">{results.advice}</div>
        </div>
      </div>

      {/* Individual Profiles */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-3">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {results.person1.saghir}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {results.person1.destiny?.name || 'Unknown'}
            </div>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {results.person1.destiny?.quality || ''}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-3">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {results.person2.saghir}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {results.person2.destiny?.name || 'Unknown'}
            </div>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {results.person2.destiny?.quality || ''}
          </div>
        </div>
      </div>

      {/* Strengths & Challenges */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Strengths
          </h4>
          <ul className="space-y-2">
            {results.strengths.map((strength: string, idx: number) => (
              <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">âœ“</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Growth Areas
          </h4>
          <ul className="space-y-2">
            {results.challenges.map((challenge: string, idx: number) => (
              <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">âš¡</span>
                {challenge}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function LifePathResults({ results }: { results: EnhancedLifePathResult }) {
  const { t, language } = useLanguage();
  const isFr = language === 'fr';
  const {
    lifePathNumber,
    soulUrgeNumber,
    personalityNumber,
    destinyNumber,
    personalYear,
    personalMonth,
    cycle,
    karmicDebts,
    sacredNumbers,
    pinnaclesAndChallenges,
    maternalInfluence
  } = results;
  
  return (
    <div className="space-y-6">
      {/* Introduction Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
          {t.lifePath.coreNumbers}
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
          {t.lifePath.coreNumbersDesc}
        </p>
        
        <div className="grid md:grid-cols-2 gap-3 text-xs">
          <div className="bg-white dark:bg-slate-900/40 rounded p-3 border-l-2 border-blue-500">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{t.lifePath.lifePathNumber}:</span>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.lifePathQuick}</p>
          </div>
          <div className="bg-white dark:bg-slate-900/40 rounded p-3 border-l-2 border-purple-500">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{t.lifePath.soulUrge}:</span>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.soulUrgeQuick}</p>
          </div>
          <div className="bg-white dark:bg-slate-900/40 rounded p-3 border-l-2 border-pink-500">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{t.lifePath.personality}:</span>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.personalityQuick}</p>
          </div>
          <div className="bg-white dark:bg-slate-900/40 rounded p-3 border-l-2 border-amber-500">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{t.lifePath.destiny}:</span>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.destinyQuick}</p>
          </div>
        </div>
      </div>

      {/* Core Numbers Grid with Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Life Path Number */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-5 text-black shadow-lg border-2 border-blue-700">
          <div className="text-sm font-semibold text-black opacity-90 mb-1">{t.lifePath.lifePathLabel}</div>
          <div className="text-4xl font-bold text-black mb-2">{lifePathNumber}</div>
          <div className="text-xs text-black opacity-75 mb-3 font-semibold">
            {isFr && t.lifePath.numberArchetypes[lifePathNumber as keyof typeof t.lifePath.numberArchetypes]
              ? t.lifePath.numberArchetypes[lifePathNumber as keyof typeof t.lifePath.numberArchetypes].title
              : t.lifePath.numberArchetypes[lifePathNumber as keyof typeof t.lifePath.numberArchetypes]?.title || "Your Core Path"}
          </div>
          <p className="text-xs text-black opacity-85 leading-relaxed mb-2">
            {isFr && t.lifePath.numberArchetypes[lifePathNumber as keyof typeof t.lifePath.numberArchetypes]
              ? t.lifePath.numberArchetypes[lifePathNumber as keyof typeof t.lifePath.numberArchetypes].meaning
              : t.lifePath.numberArchetypes[lifePathNumber as keyof typeof t.lifePath.numberArchetypes]?.meaning || "This is your main life purpose and natural talents."}
          </p>
          <div className="bg-white bg-opacity-20 rounded p-2 text-xs text-black opacity-90">
            <span className="font-semibold">{t.lifePath.whatItMeans}</span> {t.lifePath.lifePathSimple}
          </div>
        </div>

        {/* Soul Urge Number */}
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-5 text-black shadow-lg border-2 border-purple-700">
          <div className="text-sm font-semibold text-black opacity-90 mb-1">{t.lifePath.soulUrgeLabel}</div>
          <div className="text-4xl font-bold text-black mb-2">{soulUrgeNumber}</div>
          <div className="text-xs text-black opacity-75 mb-3 font-semibold">
            {isFr && t.lifePath.numberArchetypes[soulUrgeNumber as keyof typeof t.lifePath.numberArchetypes]
              ? t.lifePath.numberArchetypes[soulUrgeNumber as keyof typeof t.lifePath.numberArchetypes].title
              : t.lifePath.numberArchetypes[soulUrgeNumber as keyof typeof t.lifePath.numberArchetypes]?.title || "What You Truly Want"}
          </div>
          <p className="text-xs text-black opacity-85 leading-relaxed mb-2">
            {isFr && t.lifePath.numberArchetypes[soulUrgeNumber as keyof typeof t.lifePath.numberArchetypes]
              ? t.lifePath.numberArchetypes[soulUrgeNumber as keyof typeof t.lifePath.numberArchetypes].meaning
              : t.lifePath.numberArchetypes[soulUrgeNumber as keyof typeof t.lifePath.numberArchetypes]?.meaning || "This reveals your deepest desires and what makes you feel fulfilled."}
          </p>
          <div className="bg-white bg-opacity-20 rounded p-2 text-xs text-black opacity-90">
            <span className="font-semibold">{t.lifePath.whatItMeans}</span> {t.lifePath.soulUrgeSimple}
          </div>
        </div>

        {/* Personality Number */}
        <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg p-5 text-black shadow-lg border-2 border-pink-700">
          <div className="text-sm font-semibold text-black opacity-90 mb-1">{t.lifePath.personalityLabel}</div>
          <div className="text-4xl font-bold text-black mb-2">{personalityNumber}</div>
          <div className="text-xs text-black opacity-75 mb-3 font-semibold">
            {isFr && t.lifePath.numberArchetypes[personalityNumber as keyof typeof t.lifePath.numberArchetypes]
              ? t.lifePath.numberArchetypes[personalityNumber as keyof typeof t.lifePath.numberArchetypes].title
              : t.lifePath.numberArchetypes[personalityNumber as keyof typeof t.lifePath.numberArchetypes]?.title || "How People See You"}
          </div>
          <p className="text-xs text-black opacity-85 leading-relaxed mb-2">
            {isFr && t.lifePath.numberArchetypes[personalityNumber as keyof typeof t.lifePath.numberArchetypes]
              ? t.lifePath.numberArchetypes[personalityNumber as keyof typeof t.lifePath.numberArchetypes].meaning
              : t.lifePath.numberArchetypes[personalityNumber as keyof typeof t.lifePath.numberArchetypes]?.meaning || "This is the impression you make when people meet you."}
          </p>
          <div className="bg-white bg-opacity-20 rounded p-2 text-xs text-black opacity-90">
            <span className="font-semibold">{t.lifePath.whatItMeans}</span> {t.lifePath.personalitySimple}
          </div>
        </div>

        {/* Destiny Number */}
        <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg p-5 text-black shadow-lg border-2 border-amber-700">
          <div className="text-sm font-semibold text-black opacity-90 mb-1">{t.lifePath.destinyLabel}</div>
          <div className="text-4xl font-bold text-black mb-2">{destinyNumber}</div>
          <div className="text-xs text-black opacity-75 mb-3 font-semibold">
            {isFr && t.lifePath.numberArchetypes[destinyNumber as keyof typeof t.lifePath.numberArchetypes]
              ? t.lifePath.numberArchetypes[destinyNumber as keyof typeof t.lifePath.numberArchetypes].title
              : t.lifePath.numberArchetypes[destinyNumber as keyof typeof t.lifePath.numberArchetypes]?.title || "Your Life Mission"}
          </div>
          <p className="text-xs text-black opacity-85 leading-relaxed mb-2">
            {isFr && t.lifePath.numberArchetypes[destinyNumber as keyof typeof t.lifePath.numberArchetypes]
              ? t.lifePath.numberArchetypes[destinyNumber as keyof typeof t.lifePath.numberArchetypes].meaning
              : t.lifePath.numberArchetypes[destinyNumber as keyof typeof t.lifePath.numberArchetypes]?.meaning || "This is what you're meant to achieve and contribute to the world."}
          </p>
          <div className="bg-white bg-opacity-20 rounded p-2 text-xs text-black opacity-90">
            <span className="font-semibold">{t.lifePath.whatItMeans}</span> {t.lifePath.destinySimple}
          </div>
        </div>
      </div>

      {/* Maternal Influence Section - Only shown if available */}
      {maternalInfluence !== undefined && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                {t.lifePath.externalInfluences}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {t.lifePath.maternalInfluenceExplanation}
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg p-5 text-black shadow-lg border-2 border-indigo-600">
            <div className="text-sm font-semibold text-black opacity-90 mb-1">
              {t.lifePath.maternalInfluence}
            </div>
            <div className="text-4xl font-bold text-black mb-2">{maternalInfluence}</div>
            <div className="text-xs text-black opacity-75 mb-3 font-semibold">
              {isFr && t.lifePath.numberArchetypes[maternalInfluence as keyof typeof t.lifePath.numberArchetypes]
                ? t.lifePath.numberArchetypes[maternalInfluence as keyof typeof t.lifePath.numberArchetypes].title
                : t.lifePath.numberArchetypes[maternalInfluence as keyof typeof t.lifePath.numberArchetypes]?.title || t.lifePath.externalEnergy}
            </div>
            <p className="text-xs text-black opacity-85 leading-relaxed mb-2">
              {t.lifePath.maternalInfluenceDesc}
            </p>
            <div className="bg-white bg-opacity-20 rounded p-2 text-xs text-black opacity-90">
              <span className="font-semibold">{t.lifePath.important}</span> {t.lifePath.importantNote}
            </div>
          </div>
        </div>
      )}

      {/* Current Life Cycle */}
      {cycle && (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          {t.lifePath.whereYouAreNow}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t.lifePath.currentLifePhase}</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {t.lifePath.phaseOf9.replace('{number}', cycle.cycleNumber.toString())}
            </div>
            <div className="text-slate-700 dark:text-slate-300 mb-3">
              <span className="font-semibold">{cycle.cycleStage}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {t.lifePath.yearTheme.replace('{position}', cycle.positionInCycle.toString())} <span className="font-semibold">{cycle.yearTheme}</span>
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-3 border-l-4 border-blue-500">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.lifePath.focusAreas}</div>
              <div className="text-sm text-slate-700 dark:text-slate-300">
                {cycle.focus.join(' â€¢ ')}
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t.lifePath.yourAge}</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t.lifePath.years.replace('{age}', cycle.age.toString())}
            </div>
            
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">{t.lifePath.yearMonthEnergy}</div>
              <div className="flex gap-3">
                <div className="bg-amber-50 dark:bg-amber-900/30 rounded p-3 flex-1 border border-amber-200 dark:border-amber-800">
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{t.lifePath.personalYearLabel}</div>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{personalYear}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.overallEnergy}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded p-3 flex-1 border border-purple-200 dark:border-purple-800">
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{t.lifePath.personalMonthLabel}</div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{personalMonth}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.monthFlow}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Strengths and Challenges - Only show if data is available */}
      {pinnaclesAndChallenges && (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
          {t.lifePath.strengthsAndGrowth}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          {t.lifePath.strengthsIntro}
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-green-700 dark:text-green-400">{t.lifePath.whatYouAreStrongAt}</h4>
            <div className="space-y-2">
              {pinnaclesAndChallenges.pinnacle1 && (
              <div className="bg-green-50 dark:bg-green-900/30 rounded p-3 border-l-4 border-green-500">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t.lifePath.strength.replace('{number}', '1')}</div>
                <span className="font-bold text-green-700 dark:text-green-400">{pinnaclesAndChallenges.pinnacle1}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.strengthDesc1}</p>
              </div>
              )}
              {pinnaclesAndChallenges.pinnacle2 && (
              <div className="bg-green-50 dark:bg-green-900/30 rounded p-3 border-l-4 border-green-500">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t.lifePath.strength.replace('{number}', '2')}</div>
                <span className="font-bold text-green-700 dark:text-green-400">{pinnaclesAndChallenges.pinnacle2}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.strengthDesc2}</p>
              </div>
              )}
              {pinnaclesAndChallenges.pinnacle3 && (
              <div className="bg-green-50 dark:bg-green-900/30 rounded p-3 border-l-4 border-green-500">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t.lifePath.strength.replace('{number}', '3')}</div>
                <span className="font-bold text-green-700 dark:text-green-400">{pinnaclesAndChallenges.pinnacle3}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.strengthDesc3}</p>
              </div>
              )}
              {pinnaclesAndChallenges.pinnacle4 && (
              <div className="bg-green-50 dark:bg-green-900/30 rounded p-3 border-l-4 border-green-500">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t.lifePath.strength.replace('{number}', '4')}</div>
                <span className="font-bold text-green-700 dark:text-green-400">{pinnaclesAndChallenges.pinnacle4}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.strengthDesc4}</p>
              </div>
              )}
              {pinnaclesAndChallenges.currentPinnacle && (
              <div className="bg-emerald-100 dark:bg-emerald-900/50 rounded p-3 mt-3 border-2 border-emerald-500">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t.lifePath.currentStrength}</span>
                <div className="text-emerald-700 dark:text-emerald-300 font-bold mt-1">{pinnaclesAndChallenges.currentPinnacle}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.currentStrengthDesc}</p>
              </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-amber-700 dark:text-amber-400">{t.lifePath.whereYouCanGrow}</h4>
            <div className="space-y-2">
              {pinnaclesAndChallenges.challenge1 && (
              <div className="bg-amber-50 dark:bg-amber-900/30 rounded p-3 border-l-4 border-amber-500">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t.lifePath.growthArea.replace('{number}', '1')}</div>
                <span className="font-bold text-amber-700 dark:text-amber-400">{pinnaclesAndChallenges.challenge1}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.growthDesc1}</p>
              </div>
              )}
              {pinnaclesAndChallenges.challenge2 && (
              <div className="bg-amber-50 dark:bg-amber-900/30 rounded p-3 border-l-4 border-amber-500">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t.lifePath.growthArea.replace('{number}', '2')}</div>
                <span className="font-bold text-amber-700 dark:text-amber-400">{pinnaclesAndChallenges.challenge2}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.growthDesc2}</p>
              </div>
              )}
              {pinnaclesAndChallenges.challenge3 && (
              <div className="bg-amber-50 dark:bg-amber-900/30 rounded p-3 border-l-4 border-amber-500">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t.lifePath.growthArea.replace('{number}', '3')}</div>
                <span className="font-bold text-amber-700 dark:text-amber-400">{pinnaclesAndChallenges.challenge3}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.growthDesc3}</p>
              </div>
              )}
              {pinnaclesAndChallenges.challenge4 && (
              <div className="bg-amber-50 dark:bg-amber-900/30 rounded p-3 border-l-4 border-amber-500">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t.lifePath.growthArea.replace('{number}', '4')}</div>
                <span className="font-bold text-amber-700 dark:text-amber-400">{pinnaclesAndChallenges.challenge4}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.growthDesc4}</p>
              </div>
              )}
              {pinnaclesAndChallenges.currentChallenge && (
              <div className="bg-orange-100 dark:bg-orange-900/50 rounded p-3 mt-3 border-2 border-orange-500">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t.lifePath.currentChallenge}</span>
                <div className="text-orange-700 dark:text-orange-300 font-bold mt-1">{pinnaclesAndChallenges.currentChallenge}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.lifePath.currentChallengeDesc}</p>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Special Numbers */}
      {(karmicDebts?.length > 0 || sacredNumbers?.length > 0) && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            {t.lifePath.specialNumbers}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {karmicDebts?.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">{t.lifePath.lessonsToLearn}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {t.lifePath.lessonsDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {karmicDebts?.map((debt) => (
                    <div key={debt} className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 rounded-full px-4 py-2 text-sm font-semibold border border-red-300 dark:border-red-700">
                      {debt}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {sacredNumbers?.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">{t.lifePath.blessedNumbers}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {t.lifePath.blessedDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sacredNumbers?.map((sacred) => (
                    <div key={sacred} className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full px-4 py-2 text-sm font-semibold border border-indigo-300 dark:border-indigo-700">
                      {sacred}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TimingResults({ results, birthDate, name, abjad }: { results: any; birthDate: string; name: string; abjad: any }) {
  const { t, language } = useLanguage();
  const isFr = language === 'fr';
  const { planetaryHour, personalYear } = results;
  const [restAlertDismissed, setRestAlertDismissed] = useState(false);
  
  // Real-time state for Act Now feature
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentHour, setCurrentHour] = useState<CurrentPlanetaryHour | null>(null);
  const [alignment, setAlignment] = useState<ElementAlignment | null>(null);
  const [timeWindow, setTimeWindow] = useState<TimeWindow | null>(null);
  const [actionButtons, setActionButtons] = useState<ActionButton[]>([]);
  const [userElement, setUserElement] = useState<ElementType | null>(null);
  const [dailyColorGuidance, setDailyColorGuidance] = useState<DailyColorGuidance | null>(null);
  const [todayReading, setTodayReading] = useState<DailyReading | null>(null);
  
  // Get today's info
  const today = new Date();
  const todayWeekday = today.toLocaleDateString('en-US', { weekday: 'long' });
  
  // Check sessionStorage for dismissal
  useEffect(() => {
    const dismissed = sessionStorage.getItem('restAlertDismissed');
    const dismissedDate = sessionStorage.getItem('restAlertDismissedDate');
    const todayStr = today.toISOString().split('T')[0];
    
    if (dismissed === 'true' && dismissedDate === todayStr) {
      setRestAlertDismissed(true);
    }
  }, []);
  
  // Calculate today's reading if we have a birth date and name
  useEffect(() => {
    if (birthDate && name) {
      try {
        // Generate a profile for today's reading
        const tempProfile = calculateUserProfile(name, new Date(birthDate), undefined, abjad);
        const weeklySummary = generateWeeklySummary(tempProfile, today);
        setTodayReading(weeklySummary.days.find(d => d.weekday === todayWeekday) || null);
      } catch (e) {
        console.error('Error calculating today\'s reading:', e);
        setTodayReading(null);
      }
    }
  }, [birthDate, name, abjad, todayWeekday]);
  
  // Real-time updates for Act Now feature
  useEffect(() => {
    // Update current hour and alignment
    const updateRealTimeData = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Calculate user's element if we have name
      let calculatedElement: ElementType | null = null;
      if (name) {
        try {
          const tempProfile = calculateUserProfile(name, birthDate ? new Date(birthDate) : undefined, undefined, abjad);
          calculatedElement = tempProfile.element;
          setUserElement(calculatedElement);
          
          // Calculate DAILY color guidance
          const dailyGuidance = calculateDailyColorGuidance(calculatedElement as ElementType2);
          setDailyColorGuidance(dailyGuidance);
        } catch (e) {
          console.error('Error calculating user element:', e);
        }
      }
      
      // Always get current hour
      const hour = getCurrentPlanetaryHour(now);
      setCurrentHour(hour);
      
      // Calculate alignment and actions if we have user element
      if (calculatedElement && hour) {
        const align = detectAlignment(calculatedElement, hour.element);
        const window = calculateTimeWindow(hour, calculatedElement);
        const buttons = generateActionButtons(align, window, t);
        
        setAlignment(align);
        setTimeWindow(window);
        setActionButtons(buttons);
      }
    };
    
    // Initial update
    updateRealTimeData();
    
    // Update every minute
    const interval = setInterval(updateRealTimeData, 60000);
    
    return () => clearInterval(interval);
  }, [name, birthDate, abjad]);
  
  const dismissRestAlert = () => {
    setRestAlertDismissed(true);
    const todayStr = today.toISOString().split('T')[0];
    sessionStorage.setItem('restAlertDismissed', 'true');
    sessionStorage.setItem('restAlertDismissedDate', todayStr);
  };
  
  const scrollToWeekView = () => {
    // Scroll to weekly section if it exists
    const weekSection = document.querySelector('[data-week-view]');
    if (weekSection) {
      weekSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // If not on page, inform user
      alert('Switch to "Weekly View" tab to see your full week forecast');
    }
  };
  
  if (!planetaryHour || !planetaryHour.planet) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <p className="text-red-800 dark:text-red-200">
          {t.timingResults.unableToCalculate}
        </p>
      </div>
    );
  }
  
  const PlanetIcon = PLANET_ICONS[planetaryHour.planet as Planet];
  
  return (
    <div className="space-y-6">
      
      {/* Today's Rest Signal Alert */}
      {todayReading?.isRestDay && !restAlertDismissed && (
        <div className={`p-5 rounded-xl border-2 animate-in slide-in-from-top duration-300 ${
          todayReading.restLevel === 'deep' 
            ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700'
            : 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700'
        }`}>
          
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">
                {todayReading.restLevel === 'deep' ? 'ðŸ›‘' : 'ðŸŒ™'}
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {todayReading.restLevel === 'deep' ? t.timingResults.deepRestNeededToday : t.timingResults.todayIsRestDay}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <span>{t.timingResults.harmonyScore}: {todayReading.harmony_score}/10</span>
                  {birthDate && name && (
                    <HarmonyTooltip
                      breakdown={(() => {
                        try {
                          const tempProfile = calculateUserProfile(name, new Date(birthDate), undefined, abjad);
                          return calculateHarmonyBreakdown(
                            todayReading.day_planet,
                            tempProfile.element,
                            tempProfile.kawkab,
                            todayReading.ruh_phase,
                            tempProfile.ruh,
                            t.timingResults.planetEnergy.replace('{planet}', todayReading.day_planet)
                          ) as HarmonyBreakdown;
                        } catch {
                          // Fallback if profile calculation fails
                          return {
                            score: todayReading.harmony_score,
                            userElement: 'Fire' as ElementType,
                            contextElement: 'Fire' as ElementType,
                            contextLabel: t.timingResults.planetEnergy.replace('{planet}', todayReading.day_planet),
                            ruhPhase: todayReading.ruh_phase,
                            connectionType: 'weak' as const,
                            elementMatch: 25,
                            planetMatch: 50,
                            ruhImpact: 50
                          };
                        }
                      })()}
                      context="daily"
                    />
                  )}
                  <span className="mx-1">â€¢</span>
                  <span>{t.timingResults.planetEnergy.replace('{planet}', todayReading.day_planet)}</span>
                  <span className="mx-1">â€¢</span>
                  <span>{todayReading.weekday}</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Message */}
          <div className="mb-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {todayReading.restLevel === 'deep' 
                ? t.timingResults.criticalLowEnergy
                : t.timingResults.lowHarmonyToday
              }
            </p>
          </div>
          
          {/* Quick Practices */}
          {todayReading.restPractices && todayReading.restPractices.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                {t.timingResults.recommendedToday}
              </p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                {todayReading.restPractices.slice(0, 3).map((practice, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 dark:text-blue-400 flex-shrink-0">â€¢</span>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button 
              onClick={scrollToWeekView}
              className="text-sm px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Calendar className="w-4 h-4" />
              {t.timingResults.viewFullWeek}
            </button>
            
            <button 
              onClick={dismissRestAlert}
              className="text-sm px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              {t.timingResults.dismiss}
            </button>
          </div>
          
          {/* Classical Wisdom */}
          <p className="text-xs italic text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-700">
            <span className="font-semibold">
              "{todayReading.restLevel === 'deep' 
                ? t.timingResults.deepRestQuote
                : t.timingResults.restDayQuote
              }"
            </span>
            {' â€” '}
            {todayReading.restLevel === 'deep'
              ? t.timingResults.deepRestTranslation
              : t.timingResults.restDayTranslation
            }
          </p>
        </div>
      )}
      
      {/* Note about rest day context */}
      {todayReading?.isRestDay && !restAlertDismissed && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>âš ï¸ {t.timingResults.restDayActive}</strong> â€” {t.timingResults.restDayNote}
          </p>
        </div>
      )}
      
      {/* Daily Color Guidance - Positioned before hourly planetary info */}
      {dailyColorGuidance && <DailyColorGuidanceCard guidance={dailyColorGuidance} />}
      
      {/* Act Now - Real-Time Planetary Hour */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          {t.timingResults.currentPlanetaryHour} {currentHour && 'âš¡'}
        </h3>
        
        <div className="text-center mb-6">
          <PlanetIcon className={`w-16 h-16 mx-auto mb-3 ${PLANET_COLORS[planetaryHour.planet as Planet]}`} />
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {planetaryHour.planet}
          </div>
          <div className="text-lg text-slate-600 dark:text-slate-400">
            {planetaryHour.quality}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="font-bold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 w-4" />
              {t.timingResults.favorableFor}
            </div>
            <ul className="space-y-1">
              {planetaryHour.favorable.map((item: string, idx: number) => (
                <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">
                  â€¢ {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="font-bold text-amber-700 dark:text-amber-300 mb-2">
              {t.timingResults.avoid}
            </div>
            <ul className="space-y-1">
              {planetaryHour.avoid.map((item: string, idx: number) => (
                <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">
                  â€¢ {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Act Now Enhancement - Show if we have user element */}
        {currentHour && alignment && timeWindow && userElement && (
          <div className="mt-6 space-y-4">
            {/* Status Banner */}
            <div className={`rounded-lg p-4 ${
              alignment.quality === 'perfect' || alignment.quality === 'strong'
                ? userElement === 'Fire' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' :
                  userElement === 'Air' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' :
                  userElement === 'Water' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' :
                  'bg-gradient-to-r from-amber-600 to-yellow-700 text-white'
                : 'bg-gradient-to-r from-gray-200 to-gray-300 text-slate-900'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-2 font-bold">
                  {alignment.quality === 'perfect' ? `âœ¨ ${t.timingResults.perfectAlignment}` : 
                   alignment.quality === 'strong' ? `ðŸ’« ${t.timingResults.strongEnergy}` :
                   alignment.quality === 'opposing' ? `â¸ï¸ ${t.timingResults.restTime}` : `ðŸ“Š ${t.timingResults.moderate}`}
                </div>
                <p className={`text-sm mb-2 font-medium ${
                  alignment.quality === 'perfect' || alignment.quality === 'strong' 
                    ? 'opacity-90' 
                    : 'text-slate-800'
                }`}>
                  {t.timingResults.yourElement.replace('{element}', userElement)} + {t.timingResults.hourElement.replace('{element}', currentHour.element)} = {alignment.quality.toUpperCase()}
                </p>
                <div className={`flex items-center justify-center gap-2 text-sm font-bold ${
                  alignment.quality === 'perfect' || alignment.quality === 'strong'
                    ? ''
                    : 'text-slate-900'
                }`}>
                  <Clock className={`h-4 w-4 ${timeWindow.urgency === 'high' ? 'animate-pulse' : ''}`} />
                  <span>{t.timingResults.windowClosesIn} {timeWindow.closesIn}</span>
                  {timeWindow.urgency === 'high' && <span>âš ï¸</span>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {actionButtons.slice(0, 3).map((button, idx) => (
                <button
                  key={idx}
                  className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                    button.priority === 'primary'
                      ? alignment.quality === 'perfect' || alignment.quality === 'strong'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                      : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-xl">{button.icon}</span>
                  {button.label}
                </button>
              ))}
            </div>

            {/* Next Window */}
            {timeWindow.nextWindow && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100 font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  ðŸ“ {t.timingResults.nextWindow.replace('{element}', userElement)} {timeWindow.nextWindowIn}
                </p>
              </div>
            )}

            {/* Element Guidance */}
            {ELEMENT_GUIDANCE_MAP[userElement] && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2 text-sm">
                  <Lightbulb className="w-4 h-4" />
                  {alignment.quality === 'perfect' || alignment.quality === 'strong' ? t.timingResults.bestForNow : t.timingResults.bestForWhenReturns}
                </h4>
                <ul className="space-y-1">
                  {ELEMENT_GUIDANCE_MAP[userElement].bestFor.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2 font-medium">
                      <span className="text-green-600 dark:text-green-400 flex-shrink-0">â€¢</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Personal Year */}
      {personalYear && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            {t.timingResults.yourPersonalYear}
          </h3>
          
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {personalYear.year}
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {personalYear.station.name}
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              {personalYear.theme}
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {personalYear.station.practical}
            </p>
          </div>
        </div>
      )}

      {/* Daily Dhikr */}
      <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-600 dark:to-teal-700 rounded-xl p-6 shadow-xl border-2 border-emerald-400 dark:border-emerald-500">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-900 dark:text-white">
          <BookOpen className="w-5 h-5" />
          {t.timingResults.recommendedDhikr}
        </h3>
        
        <div className="text-center">
          <div className="text-4xl font-bold mb-3 font-arabic text-emerald-900 dark:text-white" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
            {getDailyDhikr(new Date().getDate() % 12).arabic}
          </div>
          <div className="text-2xl mb-4 font-semibold text-emerald-900 dark:text-white">
            {getDailyDhikr(new Date().getDate() % 12).dhikr}
          </div>
          <div className="bg-white/70 dark:bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-4">
            <p className="font-medium text-emerald-900 dark:text-white">
              {t.timingResults.count}: <span className="font-bold text-xl">{getDailyDhikr(new Date().getDate() % 12).count}</span> {t.timingResults.times}
            </p>
            <p className="text-sm mt-1 text-emerald-800 dark:text-white">
              {t.timingResults.bestTime}: {getDailyDhikr(new Date().getDate() % 12).time}
            </p>
          </div>
          <div className="text-base bg-emerald-200/70 dark:bg-emerald-800/50 rounded-lg p-3 text-emerald-900 dark:text-white">
            <strong>{t.timingResults.benefit}:</strong> {getDailyDhikr(new Date().getDate() % 12).benefit}
          </div>
        </div>
      </div>

      {/* Act Now Buttons - Real-Time Action Prompts */}
      {userElement && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            ðŸŽ¯ {t.timingResults.actNowRealTimeGuidance}
          </h3>
          <ActNowButtons userElement={userElement as 'fire' | 'water' | 'air' | 'earth'} />
        </div>
      )}
    </div>
  );
}









