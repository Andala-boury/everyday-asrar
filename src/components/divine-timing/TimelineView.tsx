'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Sun, Moon, X } from 'lucide-react';
import type { AccuratePlanetaryHour, Element } from '../../types/planetary';
import { analyzeAlignment } from '../../utils/alignment';

interface TimelineViewProps {
  planetaryHours: AccuratePlanetaryHour[];
  currentHour: AccuratePlanetaryHour;
  userElement: Element;
}

export function TimelineView({ planetaryHours, currentHour, userElement }: TimelineViewProps) {
  const { language } = useLanguage();
  const [selectedHour, setSelectedHour] = useState<AccuratePlanetaryHour | null>(null);
  
  // Get color based on alignment quality
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'perfect':
        return 'bg-green-500 dark:bg-green-600';
      case 'strong':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'moderate':
        return 'bg-yellow-500 dark:bg-yellow-600';
      default:
        return 'bg-gray-400 dark:bg-gray-600';
    }
  };
  
  const getElementIcon = (element: Element) => {
    const icons = { fire: '🔥', water: '💧', air: '💨', earth: '🌍' };
    return icons[element];
  };
  
  const getElementName = (element: Element, lang: string) => {
    const names: Record<Element, { en: string; fr: string }> = {
      fire: { en: 'fire', fr: 'feu' },
      water: { en: 'water', fr: 'eau' },
      air: { en: 'air', fr: 'air' },
      earth: { en: 'earth', fr: 'terre' }
    };
    return lang === 'fr' ? names[element].fr : names[element].en;
  };
  
  const getPlanetName = (planetName: string, lang: string) => {
    const names: Record<string, { en: string; fr: string }> = {
      'Sun': { en: 'Sun', fr: 'Soleil' },
      'Moon': { en: 'Moon', fr: 'Lune' },
      'Mars': { en: 'Mars', fr: 'Mars' },
      'Mercury': { en: 'Mercury', fr: 'Mercure' },
      'Jupiter': { en: 'Jupiter', fr: 'Jupiter' },
      'Venus': { en: 'Venus', fr: 'Vénus' },
      'Saturn': { en: 'Saturn', fr: 'Saturne' }
    };
    return lang === 'fr' ? (names[planetName]?.fr || planetName) : planetName;
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {language === 'fr' ? 'Votre Journée Complète' : 'Your Complete Day'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {language === 'fr' 
              ? 'Appuyez sur une heure pour voir les détails'
              : 'Tap any hour to see details'}
          </p>
        </div>
        
        {/* Timeline */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {planetaryHours.map((hour, index) => {
            const alignment = analyzeAlignment(userElement, hour.planet.element);
            const isCurrent = hour.planet.name === currentHour.planet.name && 
                            hour.startTime.getTime() === currentHour.startTime.getTime();
            const isSelected = selectedHour?.startTime.getTime() === hour.startTime.getTime();
            
            return (
              <button
                key={index}
                onClick={() => setSelectedHour(isSelected ? null : hour)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  isCurrent 
                    ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-[1.02]'
                    : isSelected
                    ? 'border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-700/50'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  
                  {/* Time & Planet */}
                  <div className="flex items-center gap-3 flex-1">
                    {/* Day/Night indicator */}
                    <div className={`p-2 rounded-lg ${
                      hour.isDayHour 
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {hour.isDayHour ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </div>
                    
                    {/* Time & Planet Info */}
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {hour.startTime.toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-purple-500 text-white rounded-full animate-pulse">
                            {language === 'fr' ? 'MAINTENANT' : 'NOW'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span>{getPlanetName(hour.planet.name, language)}</span>
                        <span className="opacity-50">•</span>
                        <span>{getElementIcon(hour.planet.element)} {getElementName(hour.planet.element, language)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Energy Level Indicator */}
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getQualityColor(alignment.quality)}`}></div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 hidden md:inline">
                      {alignment.harmonyScore}%
                    </span>
                  </div>
                </div>
                
                {/* Expanded details */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {language === 'fr' ? 'Qualité d\'énergie' : 'Energy Quality'}:
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {getQualityLabel(alignment.quality, language)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {language === 'fr' ? 'Recommandé :' : 'Recommended:'}
                      </p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                        {getHourGuidance(alignment.quality, language).map((item, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {language === 'fr' ? 'Légende' : 'Legend'}:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-600 dark:text-slate-400">
                {language === 'fr' ? 'Parfait' : 'Perfect'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-slate-600 dark:text-slate-400">
                {language === 'fr' ? 'Fort' : 'Strong'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-slate-600 dark:text-slate-400">
                {language === 'fr' ? 'Modéré' : 'Moderate'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-slate-600 dark:text-slate-400">
                {language === 'fr' ? 'Repos' : 'Rest'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for selected hour (mobile-friendly) */}
      {selectedHour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 md:hidden">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {getPlanetName(selectedHour.planet.name, language)} {language === 'fr' ? 'Heure' : 'Hour'}
              </h4>
              <button 
                onClick={() => setSelectedHour(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {selectedHour.startTime.toLocaleTimeString()} - {selectedHour.endTime.toLocaleTimeString()}
              </p>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'fr' ? 'Recommandations :' : 'Recommendations:'}
                </p>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  {getHourGuidance(
                    analyzeAlignment(userElement, selectedHour.planet.element).quality,
                    language
                  ).map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getQualityLabel(quality: string, language: string): string {
  const labels = {
    perfect: { en: 'Perfect Match', fr: 'Parfait' },
    strong: { en: 'Strong Energy', fr: 'Énergie Forte' },
    moderate: { en: 'Moderate Energy', fr: 'Énergie Modérée' },
    weak: { en: 'Low Energy', fr: 'Énergie Faible' },
    opposing: { en: 'Rest Time', fr: 'Temps de Repos' }
  };
  
  return language === 'fr' 
    ? labels[quality as keyof typeof labels]?.fr || quality
    : labels[quality as keyof typeof labels]?.en || quality;
}

function getHourGuidance(quality: string, language: string): string[] {
  if (quality === 'perfect' || quality === 'strong') {
    return language === 'fr'
      ? ['Prendre des actions importantes', 'Commencer de nouveaux projets', 'Conversations cruciales']
      : ['Take important actions', 'Start new projects', 'Crucial conversations'];
  } else if (quality === 'moderate') {
    return language === 'fr'
      ? ['Travail de routine', 'Continuer les projets en cours', 'Organiser et préparer']
      : ['Routine work', 'Continue ongoing projects', 'Organize and prepare'];
  } else {
    return language === 'fr'
      ? ['Se reposer', 'Réfléchir et planifier', 'Pratique spirituelle']
      : ['Rest', 'Reflect and plan', 'Spiritual practice'];
  }
}
