/**
 * Enhanced Life Path Display Component
 * Shows all 5 core numbers with spiritual meanings and interpretations
 * Enhanced with educational tabs
 */

import React, { useState } from 'react';
import { Sparkles, Heart, Zap, Shield, CircleDot, Flame, ChevronDown, ChevronUp, BookOpen, Lightbulb, Library, Clock, AlertTriangle, Briefcase, Target, TrendingUp, AlertCircle } from 'lucide-react';
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
  getPracticalGuidance 
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
