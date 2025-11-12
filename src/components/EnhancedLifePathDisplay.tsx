/**
 * Enhanced Life Path Display Component
 * Shows all 5 core numbers with spiritual meanings and interpretations
 * Enhanced with educational tabs
 */

import React, { useState } from 'react';
import { Sparkles, Heart, Zap, Shield, CircleDot, Flame, ChevronDown, ChevronUp, BookOpen, Lightbulb, Library, Clock, AlertTriangle, Briefcase, Target, TrendingUp, AlertCircle, Users, Calendar, TrendingDown, Star } from 'lucide-react';
import { LIFE_PATH_MEANINGS, MASTER_NUMBERS } from '../constants/lifePathMeanings';
import {
  calculateAllLifePathNumbers,
  isMasterNumber,
  formatNumberDisplay,
  getColorForNumber,
  getPlanetForNumber,
  getElementForNumber
} from '../utils/lifePathCalculator';
import { SIMPLE_TERMS, getSimpleTerm, getTooltip } from '../constants/lifePathSimpleLanguage';
import { InfoTooltip } from './InfoTooltip';
import type { EnhancedLifePathResult } from '../utils/enhancedLifePath';
import { 
  calculateElementalBalance,
  getCareerGuidance,
  getBalanceTips,
  getShadowWork,
  getPracticalGuidance,
  getQuranicConnection,
  getPersonalYearGuidance,
  getKarmicDebtData,
  getCompatibility
} from '../utils/enhancedLifePath';
import { useLanguage } from '../contexts/LanguageContext';

// Import educational components
import { LearningCenterLifePath } from './life-path/education/LearningCenterLifePath';
import NumberGuidePanel from './life-path/education/NumberGuidePanel';
import LifePathGlossary from './life-path/education/LifePathGlossary';
import CycleTimeline from './life-path/visualization/CycleTimeline';

interface EnhancedLifePathDisplayProps {
  data: EnhancedLifePathResult;
}

interface NumberCard {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  color: string;
  isMaster: boolean;
}

const EnhancedLifePathDisplay: React.FC<EnhancedLifePathDisplayProps> = ({
  data
}) => {
  // Get language context and translations
  const { language, t } = useLanguage();
  const isArabic = false; // TODO: Add Arabic support when available
  const isFrench = language === 'fr';
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState<'overview' | 'learning' | 'numbers' | 'glossary' | 'timeline'>('overview');
  
  // State for progressive disclosure
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [showColorLegend, setShowColorLegend] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(true);
  const [showCycleDetails, setShowCycleDetails] = useState(true);
  const [showSynthesis, setShowSynthesis] = useState(true);
  
  // Phase 1 Enhancement: State for new sections
  const [showElemental, setShowElemental] = useState(true);
  const [showCareer, setShowCareer] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [showShadow, setShowShadow] = useState(true);
  const [showPractical, setShowPractical] = useState(true);
  
  // Phase 2 Enhancement: State for new sections
  const [showQuranic, setShowQuranic] = useState(true);
  const [showPersonalYear, setShowPersonalYear] = useState(true);
  const [showKarmicDebt, setShowKarmicDebt] = useState(true);
  
  // Phase 3 Enhancement: State for interactive features
  const [showCompatibility, setShowCompatibility] = useState(true);
  const [showPersonalMonth, setShowPersonalMonth] = useState(true);
  const [showPinnacles, setShowPinnacles] = useState(true);
  const [selectedPartnerLifePath, setSelectedPartnerLifePath] = useState<number | null>(null);
  
  // Phase 3B Enhancement: State for sacred numbers and maternal influence
  const [showSacredNumbers, setShowSacredNumbers] = useState(true);
  const [showMaternalInfluence, setShowMaternalInfluence] = useState(true);

  // Extract data from the result
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
  } = data;
  
  // DEBUG: Log Phase 3B data to console
  console.log('🔍 Phase 3B Data Check:', {
    sacredNumbers,
    sacredNumbersLength: sacredNumbers?.length,
    maternalInfluence,
    hasSacredNumbers: sacredNumbers && sacredNumbers.length > 0,
    hasMaternalInfluence: !!maternalInfluence
  });
  
  // Phase 1 Enhancement: Calculate elemental balance and get guidance data
  const elementalBalance = calculateElementalBalance(
    lifePathNumber,
    soulUrgeNumber,
    personalityNumber,
    destinyNumber
  );
  
  const lang = isFrench ? 'fr' : 'en';
  const careerGuidance = getCareerGuidance(lifePathNumber, lang);
  const balanceTips = getBalanceTips(lifePathNumber, lang);
  const shadowWork = getShadowWork(lifePathNumber, lang);
  const practicalGuidance = getPracticalGuidance(lifePathNumber, lang);
  
  // Phase 2 Enhancement: Get Phase 2 guidance data
  const quranicConnection = getQuranicConnection(lifePathNumber, lang);
  const personalYearGuidance = personalYear ? getPersonalYearGuidance(personalYear, lang) : null;
  const karmicDebtData = karmicDebts && karmicDebts.length > 0 ? getKarmicDebtData(karmicDebts[0], lang) : null;
  
  // Phase 3 Enhancement: Get compatibility data
  const compatibilityData = selectedPartnerLifePath 
    ? getCompatibility(lifePathNumber, selectedPartnerLifePath, lang)
    : null;
  
  // Available Life Path numbers for compatibility dropdown
  const availableLifePaths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
  
  // Phase 3B: Sacred number meanings
  const sacredNumberMeanings: Record<number, { en: string; fr: string }> = {
    7: { 
      en: "Days of Creation - Spiritual completion and divine perfection",
      fr: "Jours de la Création - Achèvement spirituel et perfection divine"
    },
    12: { 
      en: "Months & Holy Imams - Cosmic order and divine leadership",
      fr: "Mois et Imams Saints - Ordre cosmique et leadership divin"
    },
    19: { 
      en: "Quranic Miracle Number - Mathematical proof of divine authorship",
      fr: "Nombre Miracle Coranique - Preuve mathématique de l'auteur divin"
    },
    40: { 
      en: "Testing Period - Spiritual transformation and purification",
      fr: "Période d'Épreuve - Transformation spirituelle et purification"
    },
    70: { 
      en: "Nations & Completion - Universal wisdom and fulfillment",
      fr: "Nations et Achèvement - Sagesse universelle et accomplissement"
    },
    99: { 
      en: "Names of Allah (Asma ul-Husna) - Divine attributes manifestation",
      fr: "Noms d'Allah (Asma ul-Husna) - Manifestation des attributs divins"
    },
    111: { 
      en: "Surah Al-Ikhlas Value - Pure monotheism and divine oneness",
      fr: "Valeur de la Sourate Al-Ikhlas - Monothéisme pur et unicité divine"
    },
    313: { 
      en: "Warriors of Badr - Victory through faith and courage",
      fr: "Guerriers de Badr - Victoire par la foi et le courage"
    },
    786: { 
      en: "Bismillah Value - Divine grace and blessed beginnings",
      fr: "Valeur de Bismillah - Grâce divine et débuts bénis"
    },
    1000: { 
      en: "Symbolic Perfection - Ultimate completion and mastery",
      fr: "Perfection Symbolique - Achèvement ultime et maîtrise"
    }
  };
  
  // Element colors for visual display
  const elementColors: Record<string, string> = {
    fire: '#ef4444',
    earth: '#84cc16',
    air: '#06b6d4',
    water: '#3b82f6'
  };
  
  // Toggle card expansion
  const toggleCard = (index: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Get meanings with fallback
  const lifePathMeaning = LIFE_PATH_MEANINGS[lifePathNumber as keyof typeof LIFE_PATH_MEANINGS]
    || MASTER_NUMBERS[lifePathNumber as keyof typeof MASTER_NUMBERS]
    || { name: 'Unknown', qualities: [], challenges: [], planet: '', element: '' };
  
  const soulUrgeMeaning = LIFE_PATH_MEANINGS[soulUrgeNumber as keyof typeof LIFE_PATH_MEANINGS]
    || MASTER_NUMBERS[soulUrgeNumber as keyof typeof MASTER_NUMBERS]
    || { name: 'Unknown', qualities: [], challenges: [], planet: '', element: '' };
  
  const personalityMeaning = LIFE_PATH_MEANINGS[personalityNumber as keyof typeof LIFE_PATH_MEANINGS]
    || MASTER_NUMBERS[personalityNumber as keyof typeof MASTER_NUMBERS]
    || { name: 'Unknown', qualities: [], challenges: [], planet: '', element: '' };
  
  const destinyMeaning = LIFE_PATH_MEANINGS[destinyNumber as keyof typeof LIFE_PATH_MEANINGS]
    || MASTER_NUMBERS[destinyNumber as keyof typeof MASTER_NUMBERS]
    || { name: 'Unknown', qualities: [], challenges: [], planet: '', element: '' };

  // Get cycle information from data
  const cycleInfo = cycle;
  const cyclePosition = cycle.positionInCycle;

  const numberCards: NumberCard[] = [
    {
      title: t.lifePath.lifePathNumber,
      value: lifePathNumber,
      description: lifePathMeaning?.name || '',
      icon: <Zap className="w-5 h-5" />,
      color: getColorForNumber(lifePathNumber),
      isMaster: isMasterNumber(lifePathNumber)
    },
    {
      title: t.lifePath.soulUrge,
      value: soulUrgeNumber,
      description: soulUrgeMeaning?.name || '',
      icon: <Heart className="w-5 h-5" />,
      color: getColorForNumber(soulUrgeNumber),
      isMaster: isMasterNumber(soulUrgeNumber)
    },
    {
      title: t.lifePath.personality,
      value: personalityNumber,
      description: personalityMeaning?.name || '',
      icon: <Shield className="w-5 h-5" />,
      color: getColorForNumber(personalityNumber),
      isMaster: isMasterNumber(personalityNumber)
    },
    {
      title: t.lifePath.destiny,
      value: destinyNumber,
      description: destinyMeaning?.name || '',
      icon: <Sparkles className="w-5 h-5" />,
      color: getColorForNumber(destinyNumber),
      isMaster: isMasterNumber(destinyNumber)
    }
  ];

  return (
    <div className="w-full space-y-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center border-b-2 border-slate-200 dark:border-slate-700 pb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-3">
          {t.lifePath.title}
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b-2 border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-purple-600 dark:bg-purple-700 text-slate-50 shadow-lg scale-105'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {t.common.results}
        </button>
        
        <button
          onClick={() => setActiveTab('learning')}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeTab === 'learning'
              ? 'bg-blue-600 dark:bg-blue-700 text-slate-50 shadow-lg scale-105'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          {isFrench ? 'Centre d\'Apprentissage' : 'Learning Center'}
        </button>

        <button
          onClick={() => setActiveTab('numbers')}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeTab === 'numbers'
              ? 'bg-emerald-600 dark:bg-emerald-700 text-slate-50 shadow-lg scale-105'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          {isFrench ? 'Guide des Nombres' : 'Number Guide'}
        </button>

        <button
          onClick={() => setActiveTab('glossary')}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeTab === 'glossary'
              ? 'bg-amber-600 dark:bg-amber-700 text-slate-50 shadow-lg scale-105'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700'
          }`}
        >
          <Library className="w-4 h-4" />
          {isFrench ? 'Glossaire' : 'Glossary'}
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeTab === 'timeline'
              ? 'bg-pink-600 dark:bg-pink-700 text-slate-50 shadow-lg scale-105'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          {isFrench ? 'Chronologie' : 'Timeline'}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
      {/* Core Numbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {numberCards.map((card, index) => {
          // Determine which tooltip to show based on card index
          const tooltipKey = index === 0 ? 'lifePathNumber' : 
                            index === 1 ? 'soulUrgeNumber' :
                            index === 2 ? 'personalityNumber' : 'destinyNumber';
          const tooltip = isFrench 
            ? SIMPLE_TERMS.fr[tooltipKey].tooltip 
            : (isArabic 
              ? SIMPLE_TERMS.ar[tooltipKey].tooltip 
              : SIMPLE_TERMS.en[tooltipKey].tooltip);
          
          return (
          <div
            key={card.title}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4"
            style={{ borderLeftColor: card.color }}
          >
            {/* Icon and Number */}
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl shadow-sm" style={{ backgroundColor: `${card.color}20` }}>
                {React.cloneElement(card.icon as React.ReactElement, {
                  style: { color: card.color },
                  className: 'w-6 h-6'
                })}
              </div>
              <div className="text-right">
                <div
                  className="text-4xl font-bold tracking-tight"
                  style={{ color: card.color }}
                >
                  {formatNumberDisplay(card.value)}
                </div>
                {card.isMaster && (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mt-1 block">
                    {isFrench ? 'Maître' : 'Master'}
                  </span>
                )}
              </div>
            </div>

            {/* Title and Description */}
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-1.5 leading-tight">
              {card.title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              {card.description}
            </p>

            {/* Quick stat */}
            <div className="text-sm bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-600">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {isFrench ? 'Élément: ' : 'Element: '}
              </span>
              <span style={{ color: card.color }} className="font-bold">
                {getElementForNumber(card.value)}
              </span>
            </div>
          </div>
        );
        })}
      </div>

      {/* Color Legend */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-600">
        <button
          type="button"
          onClick={() => setShowColorLegend(!showColorLegend)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-500 group-hover:text-purple-600 transition-colors" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isFrench ? 'Légende des Couleurs' : 'Number Meanings'}
            </h3>
          </div>
          {showColorLegend ? (
            <ChevronUp className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          )}
        </button>

        <div 
          className={`transition-all duration-300 overflow-hidden ${
            showColorLegend ? 'max-h-96 mt-5' : 'max-h-0'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(SIMPLE_TERMS[isFrench ? 'fr' : (isArabic ? 'ar' : 'en')].colorLegend.numbers).map(([num, data]) => (
              <div
                key={num}
                className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-4 border-l-4 transition-all duration-200 hover:scale-105 hover:shadow-md"
                style={{ borderLeftColor: data.color }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md"
                  style={{ backgroundColor: data.color }}
                >
                  {num}
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold leading-tight">
                  {data.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Life Path Interpretation */}
      {lifePathMeaning && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setShowInterpretation(!showInterpretation)}
            className="w-full flex items-center justify-between text-left mb-5 group"
          >
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: getColorForNumber(lifePathNumber) }} />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isFrench ? 'Interprétation' : 'Interpretation'}
              </h3>
            </div>
            {showInterpretation ? (
              <ChevronUp className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            )}
          </button>

          <div 
            className={`transition-all duration-300 overflow-hidden ${
              showInterpretation ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Qualities */}
              {lifePathMeaning?.qualities && (
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white mb-3 text-base flex items-center gap-2">
                    {isFrench ? 'Qualités Positives' : 'Positive Qualities'}
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-normal">✨</span>
                  </h5>
                  <div className="flex flex-wrap gap-2.5">
                    {(isFrench && (lifePathMeaning as any).qualitiesFrench 
                      ? (lifePathMeaning as any).qualitiesFrench 
                      : lifePathMeaning.qualities
                    ).map((quality: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-800 shadow-sm"
                        >
                          {quality}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Challenges */}
              {lifePathMeaning?.challenges && (
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white mb-3 text-base flex items-center gap-2">
                    {isFrench ? 'Défis' : 'Challenges'}
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-normal">⚠️</span>
                  </h5>
                  <div className="flex flex-wrap gap-2.5">
                    {(isFrench && (lifePathMeaning as any).challengesFrench 
                      ? (lifePathMeaning as any).challengesFrench 
                      : lifePathMeaning.challenges
                    ).map((challenge: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full text-sm font-semibold border border-amber-200 dark:border-amber-800 shadow-sm"
                        >
                          {challenge}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Life Purpose */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
                <h5 className="font-bold text-slate-900 dark:text-white mb-3 text-base flex items-center gap-2">
                  {isFrench ? 'But de Vie' : 'Life Purpose'}
                  <span className="text-xs">🎯</span>
                </h5>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                  {isFrench && (lifePathMeaning as any).lifePurposeFrench 
                    ? (lifePathMeaning as any).lifePurposeFrench 
                    : lifePathMeaning.lifePurpose}
                </p>
              </div>

              {/* Deepest Desire */}
              {(lifePathMeaning as any).deepestDesire && (
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-5 border border-pink-200 dark:border-pink-800">
                <h5 className="font-bold text-slate-900 dark:text-white mb-3 text-base flex items-center gap-2">
                  {isFrench ? 'Désir Profond' : 'Deepest Desire'}
                  <span className="text-xs">💫</span>
                </h5>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                  {isFrench && (lifePathMeaning as any).deepestDesireFrench 
                    ? (lifePathMeaning as any).deepestDesireFrench 
                    : (lifePathMeaning as any).deepestDesire}
                </p>
              </div>
              )}

              {/* Quranic Resonance */}
              {(lifePathMeaning as any).quranResonance && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
                <h5 className="font-bold text-slate-900 dark:text-white mb-3 text-base flex items-center gap-2">
                  {isFrench ? 'Résonance Coranique' : 'Quranic Resonance'}
                  <span className="text-xs">📖</span>
                </h5>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                  {isFrench && (lifePathMeaning as any).quranResonanceFrench 
                    ? (lifePathMeaning as any).quranResonanceFrench 
                    : (lifePathMeaning as any).quranResonance}
                </p>
              </div>
              )}
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Current Life Cycle */}
      {cycle && typeof cycle !== 'number' && 'cycle' in cycle && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/40 dark:to-blue-900/40 rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-700">
          <button
            type="button"
            onClick={() => setShowCycleDetails(!showCycleDetails)}
            className="w-full flex items-center justify-between text-left mb-4 group"
          >
            <div className="flex items-center gap-3">
              <CircleDot className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:rotate-90 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isFrench ? 'Cycle de Vie Actuel' : 'Current Life Cycle'}
              </h3>
            </div>
            {showCycleDetails ? (
              <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            )}
          </button>

          <div 
            className={`transition-all duration-300 overflow-hidden ${
              showCycleDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {isFrench ? 'Année dans le Cycle' : 'Year in Cycle'}
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {cyclePosition}/9
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                {isFrench ? 'Thème de l\'Année' : 'Year Theme'}
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {cycle.yearTheme}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {isFrench ? 'Phase de Vie' : 'Life Phase'}
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {cycle.cycleStage}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {isFrench ? `Âge: ${cycle.age}` : `Age: ${cycle.age}`}
              </p>
            </div>
          </div>

          {/* Cycle Description */}
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {isArabic ? cycle.yearThemeArabic : cycle.yearTheme}
            </p>
          </div>
          </div>
        </div>
      )}

      {/* PHASE 1 ENHANCEMENTS */}
      
      {/* 1. Elemental Composition */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/40 dark:to-indigo-900/40 rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-700">
        <button
          type="button"
          onClick={() => setShowElemental(!showElemental)}
          className="w-full flex items-center justify-between text-left mb-4 group"
        >
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.lifePath.elementalComposition}
            </h3>
          </div>
          {showElemental ? (
            <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          )}
        </button>
        
        <div 
          className={`transition-all duration-300 overflow-hidden ${
            showElemental ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-purple-200 dark:border-purple-700 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {t.lifePath.elementalCompositionDesc}
            </p>
            
            {/* Element Bars */}
            <div className="space-y-3">
              {(['fire', 'earth', 'air', 'water'] as const).map(element => (
                <div key={element}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold capitalize" style={{ color: elementColors[element] }}>
                      {element === 'fire' ? (isFrench ? 'Feu' : 'Fire') :
                       element === 'earth' ? (isFrench ? 'Terre' : 'Earth') :
                       element === 'air' ? (isFrench ? 'Air' : 'Air') :
                       (isFrench ? 'Eau' : 'Water')}
                    </span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {elementalBalance[element]}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${elementalBalance[element]}%`,
                        backgroundColor: elementColors[element]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Dominant Element */}
            <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.lifePath.dominantElement}:
              </p>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5" style={{ color: elementColors[elementalBalance.dominant] }} />
                <span className="font-bold capitalize" style={{ color: elementColors[elementalBalance.dominant] }}>
                  {elementalBalance.dominant === 'fire' ? (isFrench ? 'Feu' : 'Fire') :
                   elementalBalance.dominant === 'earth' ? (isFrench ? 'Terre' : 'Earth') :
                   elementalBalance.dominant === 'air' ? (isFrench ? 'Air' : 'Air') :
                   (isFrench ? 'Eau' : 'Water')}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {t.lifePath.elementDescriptions[elementalBalance.dominant]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Career Guidance */}
      {careerGuidance && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-xl p-6 shadow-lg border border-blue-200 dark:border-blue-700">
          <button
            type="button"
            onClick={() => setShowCareer(!showCareer)}
            className="w-full flex items-center justify-between text-left mb-4 group"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.lifePath.careerGuidance}
              </h3>
            </div>
            {showCareer ? (
              <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            )}
          </button>
          
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              showCareer ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-blue-200 dark:border-blue-700 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {t.lifePath.careerGuidanceIntro}
              </p>
              
              {/* Why These Fit */}
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mb-4">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                  {t.lifePath.whyTheseFit}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {careerGuidance.why}
                </p>
              </div>
              
              {/* Ideal Careers */}
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  {t.lifePath.idealCareers}
                </p>
                <div className="flex flex-wrap gap-2">
                  {careerGuidance.idealCareers.map((career, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-full text-xs font-medium"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Careers to Avoid */}
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  {t.lifePath.careersToAvoid}
                </p>
                <div className="flex flex-wrap gap-2">
                  {careerGuidance.avoid.map((career, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded-full text-xs font-medium"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Balance & Self-Care Tips */}
      {balanceTips.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl p-6 shadow-lg border border-green-200 dark:border-green-700">
          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className="w-full flex items-center justify-between text-left mb-4 group"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.lifePath.balanceTips}
              </h3>
            </div>
            {showBalance ? (
              <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            )}
          </button>
          
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              showBalance ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-green-200 dark:border-green-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {t.lifePath.balanceTipsIntro}
              </p>
              <ul className="space-y-2">
                {balanceTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. Shadow Work & Growth Edges */}
      {shadowWork.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/40 rounded-xl p-6 shadow-lg border border-amber-200 dark:border-amber-700">
          <button
            type="button"
            onClick={() => setShowShadow(!showShadow)}
            className="w-full flex items-center justify-between text-left mb-4 group"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.lifePath.shadowWork}
              </h3>
            </div>
            {showShadow ? (
              <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            )}
          </button>
          
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              showShadow ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-amber-200 dark:border-amber-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {t.lifePath.shadowWorkIntro}
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3 mb-3">
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  {t.lifePath.growthOpportunities}
                </p>
              </div>
              <ul className="space-y-2">
                {shadowWork.map((challenge, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 5. Practical Guidance */}
      {practicalGuidance && (
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/40 dark:to-purple-900/40 rounded-xl p-6 shadow-lg border border-violet-200 dark:border-violet-700">
          <button
            type="button"
            onClick={() => setShowPractical(!showPractical)}
            className="w-full flex items-center justify-between text-left mb-4 group"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.lifePath.practicalGuidance}
              </h3>
            </div>
            {showPractical ? (
              <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            )}
          </button>
          
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              showPractical ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-violet-200 dark:border-violet-700 space-y-4">
              
              {/* Path Summary */}
              <div>
                <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1">
                  {t.lifePath.pathSummary}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                  {practicalGuidance.summary}
                </p>
              </div>
              
              {/* Spiritual Practice */}
              <div className="pt-3 border-t border-violet-200 dark:border-violet-700">
                <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1">
                  {t.lifePath.spiritualPractice}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {practicalGuidance.spiritualPractice}
                </p>
              </div>
              
              {/* Weekly Actions */}
              <div className="pt-3 border-t border-violet-200 dark:border-violet-700">
                <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-2">
                  {t.lifePath.weeklyActions}
                </p>
                <ul className="space-y-2">
                  {practicalGuidance.weeklyActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-violet-600 dark:text-violet-400 font-bold text-xs mt-0.5">
                        {idx + 1}.
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Shadow to Avoid */}
              <div className="pt-3 border-t border-violet-200 dark:border-violet-700 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {t.lifePath.shadowToAvoid}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {practicalGuidance.shadowToAvoid}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: Quranic Wisdom */}
      {quranicConnection && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/40 dark:to-green-900/40 rounded-xl p-6 shadow-lg border border-emerald-200 dark:border-emerald-700">
          <button
            type="button"
            onClick={() => setShowQuranic(!showQuranic)}
            className="w-full flex items-center justify-between text-left mb-4 group"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isFrench ? 'Sagesse Coranique' : 'Quranic Wisdom'}
              </h3>
            </div>
            {showQuranic ? (
              <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            )}
          </button>
          
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              showQuranic ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-emerald-200 dark:border-emerald-700 space-y-4">
              
              {/* Quranic Verse */}
              <div className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-lg p-4">
                <p className="text-lg font-arabic text-center text-slate-900 dark:text-white mb-3 leading-loose">
                  {quranicConnection.verseArabic}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 text-center italic mb-1">
                  "{quranicConnection.verse}"
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 text-center font-semibold">
                  {quranicConnection.reference}
                </p>
              </div>

              {/* Divine Attribute */}
              <div className="pt-3 border-t border-emerald-200 dark:border-emerald-700">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {isFrench ? 'Attribut Divin' : 'Divine Attribute'}
                  </p>
                </div>
                <p className="text-sm text-slate-900 dark:text-white font-semibold mb-1">
                  {quranicConnection.divineAttribute}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-arabic">
                  {quranicConnection.divineAttributeArabic}
                </p>
              </div>

              {/* Spiritual Meaning */}
              <div className="pt-3 border-t border-emerald-200 dark:border-emerald-700">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                  {isFrench ? 'Signification Spirituelle' : 'Spiritual Meaning'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {quranicConnection.spiritualMeaning}
                </p>
              </div>

              {/* Daily Practice */}
              <div className="pt-3 border-t border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                  {isFrench ? 'Pratique Quotidienne' : 'Daily Practice'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {quranicConnection.dailyPractice}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: Personal Year Guidance */}
      {personalYearGuidance && (
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/40 dark:to-blue-900/40 rounded-xl p-6 shadow-lg border border-sky-200 dark:border-sky-700">
          <button
            type="button"
            onClick={() => setShowPersonalYear(!showPersonalYear)}
            className="w-full flex items-center justify-between text-left mb-4 group"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isFrench ? `Année Personnelle ${personalYear}` : `Personal Year ${personalYear}`}
              </h3>
            </div>
            {showPersonalYear ? (
              <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            )}
          </button>
          
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              showPersonalYear ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-sky-200 dark:border-sky-700 space-y-4">
              
              {/* Theme */}
              <div className="bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-sky-900 dark:text-sky-100">
                  {personalYearGuidance.theme}
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {personalYearGuidance.description}
                </p>
              </div>

              {/* Focus Areas */}
              <div className="pt-3 border-t border-sky-200 dark:border-sky-700">
                <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-3">
                  {isFrench ? 'Domaines de Focus' : 'Focus Areas'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {personalYearGuidance.focusAreas.map((area, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg p-2">
                      <Target className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Themes */}
              <div className="pt-3 border-t border-sky-200 dark:border-sky-700">
                <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-3">
                  {isFrench ? 'Thèmes Mensuels' : 'Monthly Themes'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {Object.entries(personalYearGuidance.monthlyThemes).map(([month, theme]) => (
                    <div key={month} className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-2">
                      <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                        {isFrench ? 'Mois' : 'Month'} {month}
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{theme}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Steps */}
              <div className="pt-3 border-t border-sky-200 dark:border-sky-700">
                <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-2">
                  {isFrench ? 'Étapes d\'Action' : 'Action Steps'}
                </p>
                <ul className="space-y-2">
                  {personalYearGuidance.actionSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-sky-600 dark:text-sky-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: Karmic Debt */}
      {karmicDebtData && (
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/40 dark:to-pink-900/40 rounded-xl p-6 shadow-lg border border-rose-200 dark:border-rose-700">
          <button
            type="button"
            onClick={() => setShowKarmicDebt(!showKarmicDebt)}
            className="w-full flex items-center justify-between text-left mb-4 group"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isFrench ? `Dette Karmique ${karmicDebtData.debtNumber}` : `Karmic Debt ${karmicDebtData.debtNumber}`}
              </h3>
            </div>
            {showKarmicDebt ? (
              <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            )}
          </button>
          
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              showKarmicDebt ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-rose-200 dark:border-rose-700 space-y-4">
              
              {/* Reduces To */}
              <div className="bg-rose-100 dark:bg-rose-900/30 rounded-lg p-3 text-center">
                <p className="text-sm text-rose-700 dark:text-rose-300 mb-1">
                  {isFrench ? 'Se réduit à' : 'Reduces to'}
                </p>
                <p className="text-3xl font-bold text-rose-900 dark:text-rose-100">
                  {karmicDebtData.reducesTo}
                </p>
              </div>

              {/* Past Life Pattern */}
              <div className="pt-3 border-t border-rose-200 dark:border-rose-700">
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 mb-2">
                  {isFrench ? 'Schéma de Vie Passée' : 'Past Life Pattern'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {karmicDebtData.pastLifePattern}
                </p>
              </div>

              {/* This Life Challenge */}
              <div className="pt-3 border-t border-rose-200 dark:border-rose-700">
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 mb-2">
                  {isFrench ? 'Défi de Cette Vie' : 'This Life Challenge'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {karmicDebtData.thisLifeChallenge}
                </p>
              </div>

              {/* Lessons to Learn */}
              <div className="pt-3 border-t border-rose-200 dark:border-rose-700">
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 mb-2">
                  {isFrench ? 'Leçons à Apprendre' : 'Lessons to Learn'}
                </p>
                <ul className="space-y-2">
                  {karmicDebtData.lessonsToLearn.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Transformation Path */}
              <div className="pt-3 border-t border-rose-200 dark:border-rose-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                  {isFrench ? 'Chemin de Transformation' : 'Transformation Path'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {karmicDebtData.transformationPath}
                </p>
              </div>

              {/* Spiritual Practice */}
              <div className="pt-3 border-t border-rose-200 dark:border-rose-700">
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 mb-2">
                  {isFrench ? 'Pratique Spirituelle' : 'Spiritual Practice'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {karmicDebtData.spiritualPractice}
                </p>
              </div>

              {/* Warning Sign */}
              <div className="pt-3 border-t border-rose-200 dark:border-rose-700 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {isFrench ? 'Signe d\'Avertissement' : 'Warning Sign'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {karmicDebtData.warningSign}
                </p>
              </div>

              {/* Mastery Gift */}
              <div className="pt-3 border-t border-rose-200 dark:border-rose-700 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {isFrench ? 'Don de Maîtrise' : 'Mastery Gift'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {karmicDebtData.masteryGift}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3A: Life Path Compatibility Calculator */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/40 dark:to-rose-900/40 rounded-xl p-6 shadow-lg border border-pink-200 dark:border-pink-700">
        <button
          type="button"
          onClick={() => setShowCompatibility(!showCompatibility)}
          className="w-full flex items-center justify-between text-left mb-4 group"
        >
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isFrench ? 'Calculateur de Compatibilité' : 'Compatibility Calculator'}
            </h3>
          </div>
          {showCompatibility ? (
            <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          )}
        </button>
        
        <div 
          className={`transition-all duration-300 overflow-hidden ${
            showCompatibility ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-pink-200 dark:border-pink-700 space-y-4">
            
            {/* Life Path Selection */}
            <div>
              <label className="block text-sm font-semibold text-pink-700 dark:text-pink-300 mb-2">
                {isFrench ? 'Sélectionnez le Chemin de Vie de votre partenaire:' : 'Select your partner\'s Life Path number:'}
              </label>
              <select
                value={selectedPartnerLifePath || ''}
                onChange={(e) => setSelectedPartnerLifePath(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2 rounded-lg border-2 border-pink-300 dark:border-pink-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">
                  {isFrench ? '-- Choisir un numéro --' : '-- Choose a number --'}
                </option>
                {availableLifePaths.map(num => (
                  <option key={num} value={num}>
                    {isFrench ? `Chemin de Vie ${num}` : `Life Path ${num}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Compatibility Results */}
            {compatibilityData && (
              <>
                {/* Compatibility Level Badge */}
                <div className="flex items-center justify-center gap-3 py-4">
                  <div className={`px-6 py-3 rounded-full text-white font-bold text-lg shadow-lg ${
                    compatibilityData.level === 'soulmate' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    compatibilityData.level === 'harmonious' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    compatibilityData.level === 'challenging' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                    compatibilityData.level === 'karmic' ? 'bg-gradient-to-r from-violet-500 to-purple-500' :
                    'bg-gradient-to-r from-blue-500 to-cyan-500'
                  }`}>
                    {compatibilityData.level.charAt(0).toUpperCase() + compatibilityData.level.slice(1)}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic text-center">
                    {compatibilityData.summary}
                  </p>
                </div>

                {/* Strengths */}
                <div className="pt-3 border-t border-pink-200 dark:border-pink-700">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                      {isFrench ? 'Forces' : 'Strengths'}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {compatibilityData.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                        <span className="text-sm text-slate-700 dark:text-slate-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div className="pt-3 border-t border-pink-200 dark:border-pink-700">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                      {isFrench ? 'Défis' : 'Challenges'}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {compatibilityData.challenges.map((challenge, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span>
                        <span className="text-sm text-slate-700 dark:text-slate-300">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Advice */}
                <div className="pt-3 border-t border-pink-200 dark:border-pink-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                      {isFrench ? 'Conseil' : 'Advice'}
                    </p>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {compatibilityData.advice}
                  </p>
                </div>
              </>
            )}

            {!selectedPartnerLifePath && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {isFrench 
                    ? 'Sélectionnez un numéro de Chemin de Vie pour voir la compatibilité'
                    : 'Select a Life Path number to see compatibility'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PHASE 3A: Personal Month Guidance */}
      {personalMonth && personalYearGuidance && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 rounded-xl p-6 shadow-lg border border-indigo-200 dark:border-indigo-700">
          <button
            type="button"
            onClick={() => setShowPersonalMonth(!showPersonalMonth)}
            className="w-full flex items-center justify-between text-left mb-4 group"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isFrench ? `Mois Personnel ${personalMonth}` : `Personal Month ${personalMonth}`}
              </h3>
            </div>
            {showPersonalMonth ? (
              <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            )}
          </button>
          
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              showPersonalMonth ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-indigo-200 dark:border-indigo-700 space-y-4">
              
              {/* Month Position */}
              <div className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-lg p-4 text-center">
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-1">
                  {isFrench ? `Mois ${personalMonth} dans l'Année ${personalYear}` : `Month ${personalMonth} in Year ${personalYear}`}
                </p>
                <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                  {personalYearGuidance.monthlyThemes[personalMonth as keyof typeof personalYearGuidance.monthlyThemes]}
                </p>
              </div>

              {/* Month Energy Description */}
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isFrench 
                    ? `Ce mois apporte l'énergie du ${personalMonth}, qui s'aligne avec le thème général de votre Année Personnelle ${personalYear}: "${personalYearGuidance.theme}".`
                    : `This month brings the energy of ${personalMonth}, aligning with your Personal Year ${personalYear} theme: "${personalYearGuidance.theme}".`}
                </p>
              </div>

              {/* Monthly Focus */}
              <div className="pt-3 border-t border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                  {isFrench ? 'Focus du Mois' : 'Monthly Focus'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {isFrench
                    ? 'Concentrez-vous sur les opportunités qui correspondent au thème de ce mois tout en gardant à l\'esprit les objectifs de votre année.'
                    : 'Focus on opportunities that align with this month\'s theme while keeping your year\'s goals in mind.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3A: Pinnacles & Challenges Timeline */}
      {pinnaclesAndChallenges && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/40 dark:to-yellow-900/40 rounded-xl p-6 shadow-lg border border-amber-200 dark:border-amber-700">
          <button
            type="button"
            onClick={() => setShowPinnacles(!showPinnacles)}
            className="w-full flex items-center justify-between text-left mb-4 group"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isFrench ? 'Sommets et Défis de Vie' : 'Life Pinnacles & Challenges'}
              </h3>
            </div>
            {showPinnacles ? (
              <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            )}
          </button>
          
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              showPinnacles ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-amber-200 dark:border-amber-700 space-y-6">
              
              {/* Timeline Description */}
              <p className="text-sm text-slate-700 dark:text-slate-300 italic mb-4">
                {isFrench
                  ? 'Votre vie est divisée en 4 périodes principales (Sommets) avec leurs défis correspondants. Chaque période apporte des leçons et opportunités uniques.'
                  : 'Your life is divided into 4 major periods (Pinnacles) with corresponding challenges. Each period brings unique lessons and opportunities.'}
              </p>

              {/* Pinnacles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pinnacle 1 */}
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border-l-4 border-amber-500">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">
                    {isFrench ? 'Sommet 1' : 'Pinnacle 1'}
                  </p>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                    {pinnaclesAndChallenges.pinnacle1}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {isFrench ? 'Défi:' : 'Challenge:'} {pinnaclesAndChallenges.challenge1}
                  </p>
                </div>

                {/* Pinnacle 2 */}
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border-l-4 border-orange-500">
                  <p className="text-xs font-semibold text-orange-700 dark:text-orange-300 mb-1">
                    {isFrench ? 'Sommet 2' : 'Pinnacle 2'}
                  </p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {pinnaclesAndChallenges.pinnacle2}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {isFrench ? 'Défi:' : 'Challenge:'} {pinnaclesAndChallenges.challenge2}
                  </p>
                </div>

                {/* Pinnacle 3 */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">
                    {isFrench ? 'Sommet 3' : 'Pinnacle 3'}
                  </p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    {pinnaclesAndChallenges.pinnacle3}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {isFrench ? 'Défi:' : 'Challenge:'} {pinnaclesAndChallenges.challenge3}
                  </p>
                </div>

                {/* Pinnacle 4 */}
                <div className="bg-lime-50 dark:bg-lime-900/20 rounded-lg p-4 border-l-4 border-lime-500">
                  <p className="text-xs font-semibold text-lime-700 dark:text-lime-300 mb-1">
                    {isFrench ? 'Sommet 4' : 'Pinnacle 4'}
                  </p>
                  <p className="text-2xl font-bold text-lime-900 dark:text-lime-100">
                    {pinnaclesAndChallenges.pinnacle4}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {isFrench ? 'Défi:' : 'Challenge:'} {pinnaclesAndChallenges.challenge4}
                  </p>
                </div>
              </div>

              {/* Current Status */}
              <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                  {isFrench ? 'Actuellement:' : 'Currently:'} {isFrench ? 'Sommet' : 'Pinnacle'} {pinnaclesAndChallenges.currentPinnacle} | {isFrench ? 'Défi' : 'Challenge'} {pinnaclesAndChallenges.currentChallenge}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 3B: Sacred Numbers - ALWAYS SHOW */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/40 dark:to-yellow-900/40 rounded-xl p-6 shadow-lg border border-amber-200 dark:border-amber-700">
        <button
          type="button"
          onClick={() => setShowSacredNumbers(!showSacredNumbers)}
          className="w-full flex items-center justify-between text-left mb-4 group"
        >
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isFrench ? 'Nombres Sacrés dans Votre Nom' : 'Sacred Numbers in Your Name'}
            </h3>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform ${
              showSacredNumbers ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showSacredNumbers && (
          <div className="space-y-4">
            {sacredNumbers && sacredNumbers.length > 0 ? (
              <>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  {isFrench 
                    ? `Votre nom contient ${sacredNumbers.length} nombre${sacredNumbers.length > 1 ? 's' : ''} sacré${sacredNumbers.length > 1 ? 's' : ''} islamique${sacredNumbers.length > 1 ? 's' : ''}, portant une signification spirituelle profonde :`
                    : `Your name contains ${sacredNumbers.length} sacred Islamic number${sacredNumbers.length > 1 ? 's' : ''}, carrying deep spiritual significance:`
                  }
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {sacredNumbers.map((num) => (
                    <div 
                      key={num}
                      className="bg-white dark:bg-slate-800 rounded-lg p-4 border-l-4 border-amber-500 dark:border-amber-600 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-amber-700 dark:text-amber-400">
                            {num}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-900 dark:text-white font-medium">
                            {sacredNumberMeanings[num]?.[isFrench ? 'fr' : 'en'] || (isFrench ? 'Nombre sacré' : 'Sacred number')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                    {isFrench 
                      ? `Ces nombres sacrés dans votre nom suggèrent une connexion profonde avec la tradition spirituelle islamique et portent des énergies spécifiques qui peuvent guider votre chemin de vie.`
                      : `These sacred numbers in your name suggest a deep connection with Islamic spiritual tradition and carry specific energies that can guide your life path.`
                    }
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-amber-200 dark:border-amber-700">
                <p className="text-slate-600 dark:text-slate-400 text-center">
                  {isFrench
                    ? `Aucun nombre sacré islamique spécifique détecté dans votre nom pour l'instant. Les nombres sacrés incluent : 7 (création), 12 (mois/Imams), 19 (miracle coranique), 40 (transformation), 70 (nations), 99 (noms d'Allah), 111 (Al-Ikhlas), 313 (guerriers de Badr), 786 (Bismillah), 1000 (perfection).`
                    : `No specific sacred Islamic numbers detected in your name at this time. Sacred numbers include: 7 (creation), 12 (months/Imams), 19 (Quranic miracle), 40 (transformation), 70 (nations), 99 (names of Allah), 111 (Al-Ikhlas), 313 (Badr warriors), 786 (Bismillah), 1000 (perfection).`
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PHASE 3B: Maternal Influence - ALWAYS SHOW */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/40 dark:to-pink-900/40 rounded-xl p-6 shadow-lg border border-rose-200 dark:border-rose-700">
        <button
          type="button"
          onClick={() => setShowMaternalInfluence(!showMaternalInfluence)}
          className="w-full flex items-center justify-between text-left mb-4 group"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isFrench ? 'Influence Maternelle' : 'Maternal Influence'}
            </h3>
          </div>
          {showMaternalInfluence ? (
            <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          )}
        </button>
        
        <div 
          className={`transition-all duration-300 overflow-hidden ${
            showMaternalInfluence ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {maternalInfluence ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-rose-200 dark:border-rose-700 space-y-4">
              
              {/* Maternal Number */}
              <div className="bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-lg p-4 text-center">
                <p className="text-sm text-rose-700 dark:text-rose-300 mb-2">
                  {isFrench ? 'Nombre d\'Influence Maternelle' : 'Maternal Influence Number'}
                </p>
                <p className="text-4xl font-bold text-rose-900 dark:text-rose-100">
                  {maternalInfluence}
                </p>
              </div>

              {/* Influence Description */}
              <div>
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 mb-2">
                  {isFrench ? 'Influence Énergétique' : 'Energetic Influence'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isFrench 
                    ? `L'énergie du nombre ${maternalInfluence} de votre mère a façonné votre développement émotionnel et spirituel. Cette influence maternelle apporte des qualités uniques à votre parcours de vie.`
                    : `The energy of your mother's number ${maternalInfluence} has shaped your emotional and spiritual development. This maternal influence brings unique qualities to your life path.`}
                </p>
              </div>

              {/* Nurturing Qualities */}
              <div className="pt-3 border-t border-rose-200 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-rose-800 dark:text-rose-300 mb-2">
                  {isFrench ? 'Qualités Nourricières' : 'Nurturing Qualities'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {isFrench 
                    ? 'Cette influence maternelle enrichit votre compréhension émotionnelle et votre capacité à prendre soin des autres.'
                    : 'This maternal influence enriches your emotional understanding and capacity to care for others.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-rose-200 dark:border-rose-700">
              <p className="text-slate-600 dark:text-slate-400 text-center">
                {isFrench
                  ? `Pour voir l'influence maternelle, veuillez fournir le nom de votre mère lors du calcul. Cette section montre comment l'énergie numérologique de votre mère influence votre développement émotionnel et spirituel.`
                  : `To see maternal influence, please provide your mother's name during calculation. This section shows how your mother's numerological energy influences your emotional and spiritual development.`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Synthesis */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-xl p-6 shadow-lg border border-emerald-200 dark:border-emerald-700">
        <button
          type="button"
          onClick={() => setShowSynthesis(!showSynthesis)}
          className="w-full flex items-center justify-between text-left mb-4 group"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isFrench ? 'Synthèse' : 'Synthesis'}
            </h3>
          </div>
          {showSynthesis ? (
            <ChevronUp className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          )}
        </button>
        
        <div 
          className={`transition-all duration-300 overflow-hidden ${
            showSynthesis ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-emerald-200 dark:border-emerald-700">
            <p className="text-base text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
              {isFrench
                ? `Votre Chemin de Vie (${formatNumberDisplay(lifePathNumber)}) représente votre essence spirituelle, tandis que votre Élan de l'Âme (${formatNumberDisplay(soulUrgeNumber)}) révèle vos désirs les plus profonds. Votre Personnalité (${formatNumberDisplay(personalityNumber)}) montre comment les autres vous perçoivent, et votre Destinée (${formatNumberDisplay(destinyNumber)}) vous guide vers votre but supérieur.`
              : `Your Life Path (${formatNumberDisplay(lifePathNumber)}) represents your spiritual essence, while your Soul Urge (${formatNumberDisplay(soulUrgeNumber)}) reveals your deepest desires. Your Personality (${formatNumberDisplay(personalityNumber)}) shows how others perceive you, and your Destiny (${formatNumberDisplay(destinyNumber)}) guides you toward your higher purpose.`}
          </p>

          {cycle && typeof cycle !== 'number' && 'cycle' in cycle && (
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pt-3 border-t border-emerald-200 dark:border-emerald-700">
              {isFrench
                ? `Vous êtes actuellement dans l'année ${cyclePosition} de votre cycle de neuf ans, avec un focus sur ${cycle.yearTheme}.`
                : `You are currently in Year ${cyclePosition} of your nine-year cycle, with a focus on ${cycle.yearTheme}.`}
            </p>
          )}
          </div>
        </div>
      </div>
      </>
      )}

      {/* Learning Center Tab */}
      {activeTab === 'learning' && (
        <LearningCenterLifePath />
      )}

      {/* Number Guide Tab */}
      {activeTab === 'numbers' && (
        <NumberGuidePanel />
      )}

      {/* Glossary Tab */}
      {activeTab === 'glossary' && (
        <LifePathGlossary />
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <CycleTimeline currentYear={cyclePosition} birthDate={data.birthDate} />
      )}
    </div>
  );
};

export default EnhancedLifePathDisplay;
