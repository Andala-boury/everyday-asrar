'use client';

import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { AccuratePlanetaryHour, Element } from '../../types/planetary';

interface TimelineViewProps {
  hours: AccuratePlanetaryHour[];
  userElement: Element;
  currentHour: AccuratePlanetaryHour | null;
  onClose?: () => void;
}

// Element compatibility scoring
function getElementHarmony(hourElement: Element, userElement: Element): {
  score: number;
  quality: 'excellent' | 'good' | 'moderate' | 'weak';
  color: string;
  bgColor: string;
} {
  const harmony: Record<string, Record<string, number>> = {
    fire: { fire: 100, air: 75, earth: 50, water: 25 },
    air: { air: 100, Fire: 75, water: 50, earth: 25 },
    water: { water: 100, earth: 75, air: 50, Fire: 25 },
    earth: { earth: 100, water: 75, Fire: 50, air: 25 }
  };

  const score = harmony[hourElement]?.[userElement] || 50;

  if (score >= 90) return { score, quality: 'excellent', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-500' };
  if (score >= 70) return { score, quality: 'good', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-500' };
  if (score >= 50) return { score, quality: 'moderate', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-500' };
  return { score, quality: 'weak', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-500' };
}

export function TimelineView({ hours, userElement, currentHour, onClose }: TimelineViewProps) {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [expandedHour, setExpandedHour] = useState<number | null>(null);
  const [showFullDay, setShowFullDay] = useState(false);

  const now = new Date();
  const currentHourIndex = hours.findIndex(h => h.isCurrent);
  
  // Show current hour + next 5 hours by default
  const displayedHours = showFullDay ? hours : hours.slice(currentHourIndex, currentHourIndex + 6);

  const toggleHour = (index: number) => {
    setExpandedHour(expandedHour === index ? null : index);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {isFr ? 'Ligne du Temps d\'Aujourd\'hui' : 'Today\'s Timeline'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFullDay(!showFullDay)}
            className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 
              rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            {showFullDay 
              ? (isFr ? 'Voir Moins' : 'Show Less')
              : (isFr ? 'Voir 24h' : 'View 24h')}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 
                rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">←</span>
              <span>{isFr ? 'Retour' : 'Back'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          {isFr ? 'Qualité d\'Énergie:' : 'Energy Quality:'}
        </p>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-700 dark:text-slate-300">
              {isFr ? 'Excellent' : 'Excellent'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-700 dark:text-slate-300">
              {isFr ? 'Bon' : 'Good'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-slate-700 dark:text-slate-300">
              {isFr ? 'Modéré' : 'Moderate'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-slate-700 dark:text-slate-300">
              {isFr ? 'Faible' : 'Weak'}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        {displayedHours.map((hour, index) => {
          const harmony = getElementHarmony(hour.planet.element, userElement);
          const isExpanded = expandedHour === index;
          const startTime = new Date(hour.startTime);
          const endTime = new Date(hour.endTime);
          const timeStr = startTime.toLocaleTimeString(isFr ? 'fr-FR' : 'en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: !isFr 
          });
          const endTimeStr = endTime.toLocaleTimeString(isFr ? 'fr-FR' : 'en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: !isFr 
          });

          return (
            <div
              key={index}
              className={`border rounded-lg transition-all duration-300 ${
                hour.isCurrent
                  ? 'border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-900/20 ring-2 ring-amber-500/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {/* Hour Summary Bar */}
              <button
                onClick={() => toggleHour(index)}
                className="w-full p-4 flex items-center gap-4 text-left"
              >
                {/* Time */}
                <div className="flex-shrink-0 w-24">
                  <div className="flex items-center gap-1">
                    {hour.isDayHour ? (
                      <Sun className="w-3 h-3 text-amber-500" />
                    ) : (
                      <Moon className="w-3 h-3 text-indigo-500" />
                    )}
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {timeStr}
                    </span>
                  </div>
                  {hour.isCurrent && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      {isFr ? 'En cours' : 'Now'}
                    </span>
                  )}
                </div>

                {/* Quality Indicator */}
                <div className="flex-shrink-0">
                  <div className={`w-4 h-4 rounded-full ${harmony.bgColor}`} />
                </div>

                {/* Planet Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {hour.planet.name}
                    {isFr && hour.planet.nameArabic && (
                      <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">
                        {' '}({hour.planet.nameArabic})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {isFr ? hour.planet.elementArabic : hour.planet.element} • {harmony.score}%
                  </div>
                </div>

                {/* Expand Icon */}
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-slate-700 space-y-3 animate-slide-down">
                  {/* Time Window */}
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">
                      {isFr ? 'Durée:' : 'Duration:'}
                    </span>
                    {' '}{timeStr} - {endTimeStr} ({hour.durationMinutes} {isFr ? 'min' : 'min'})
                  </div>

                  {/* Energy Quality */}
                  <div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {isFr ? 'Qualité d\'Énergie:' : 'Energy Quality:'}
                    </span>
                    <div className={`mt-1 text-sm font-bold ${harmony.color}`}>
                      {harmony.quality === 'excellent' && (isFr ? '✨ Excellent - Temps Parfait!' : '✨ Excellent - Perfect Time!')}
                      {harmony.quality === 'good' && (isFr ? '✅ Bon - Timing Favorable' : '✅ Good - Favorable Timing')}
                      {harmony.quality === 'moderate' && (isFr ? '⚡ Modéré - Procédez avec Conscience' : '⚡ Moderate - Proceed with Awareness')}
                      {harmony.quality === 'weak' && (isFr ? '🌙 Faible - Temps de Repos' : '🌙 Weak - Time to Rest')}
                    </div>
                  </div>

                  {/* Element Compatibility */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        {isFr ? 'Votre Élément:' : 'Your Element:'}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {userElement}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-slate-600 dark:text-slate-400">
                        {isFr ? 'Élément de l\'Heure:' : 'Hour Element:'}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {isFr ? hour.planet.elementArabic : hour.planet.element}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {isFr ? 'Harmonie:' : 'Harmony:'}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${harmony.bgColor} transition-all duration-500`}
                              style={{ width: `${harmony.score}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${harmony.color}`}>
                            {harmony.score}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Guidance */}
                  <div className="text-sm">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {isFr ? '💡 Conseil Rapide:' : '💡 Quick Tip:'}
                    </span>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                      {getQuickGuidance(harmony.quality, isFr)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show More Hint */}
      {!showFullDay && hours.length > 6 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowFullDay(true)}
            className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
          >
            {isFr ? '👁️ Voir toutes les 24 heures' : '👁️ View all 24 hours'}
          </button>
        </div>
      )}
    </div>
  );
}

// Get quick guidance based on quality
function getQuickGuidance(quality: 'excellent' | 'good' | 'moderate' | 'weak', isFr: boolean): string {
  const guidance: Record<string, Record<string, string>> = {
    excellent: {
      en: 'Perfect time for important actions! Your energy aligns beautifully with this hour. Take initiative.',
      fr: 'Moment parfait pour des actions importantes! Votre énergie s\'aligne magnifiquement avec cette heure. Prenez l\'initiative.'
    },
    good: {
      en: 'Favorable timing for steady progress. Good for teamwork, planning, and following through.',
      fr: 'Timing favorable pour des progrès réguliers. Bon pour le travail d\'équipe, la planification et le suivi.'
    },
    moderate: {
      en: 'Proceed with awareness. Good for routine tasks and preparation, but save major decisions for better timing.',
      fr: 'Procédez avec conscience. Bon pour les tâches routinières et la préparation, mais gardez les décisions majeures pour un meilleur moment.'
    },
    weak: {
      en: 'Time to rest and recharge. Avoid important decisions. Use this for reflection, journaling, or gentle activities.',
      fr: 'Temps de repos et de recharge. Évitez les décisions importantes. Utilisez ce moment pour la réflexion, l\'écriture ou des activités douces.'
    }
  };

  return isFr ? guidance[quality].fr : guidance[quality].en;
}
