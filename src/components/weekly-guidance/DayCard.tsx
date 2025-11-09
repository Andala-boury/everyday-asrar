'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChevronDown, ChevronUp, Sparkles, Moon, Zap } from 'lucide-react';
import type { DailyReading } from '../../features/ilm-huruf/core';

interface DayCardProps {
  day: DailyReading;
  isToday: boolean;
  userElement: string;
}

/**
 * Detailed Day Card
 * Expandable card showing full daily guidance
 */
export function DayCard({ day, isToday, userElement }: DayCardProps) {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(isToday);

  const getDayName = (weekday: string) => {
    if (language === 'en') return weekday;
    
    const days: Record<string, string> = {
      'Monday': 'Lundi',
      'Tuesday': 'Mardi',
      'Wednesday': 'Mercredi',
      'Thursday': 'Jeudi',
      'Friday': 'Vendredi',
      'Saturday': 'Samedi',
      'Sunday': 'Dimanche'
    };
    return days[weekday] || weekday;
  };

  const getPlanetName = (planet: string) => {
    if (language === 'en') return planet;
    
    const planets: Record<string, string> = {
      'Sun': 'Soleil',
      'Moon': 'Lune',
      'Mars': 'Mars',
      'Mercury': 'Mercure',
      'Jupiter': 'Jupiter',
      'Venus': 'Vénus',
      'Saturn': 'Saturne'
    };
    return planets[planet] || planet;
  };

  const getHarmonyColor = (score: number) => {
    if (score >= 8) return 'from-green-500 to-emerald-500';
    if (score >= 7) return 'from-blue-500 to-cyan-500';
    if (score >= 4) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getHarmonyBg = (score: number) => {
    if (score >= 8) return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800';
    if (score >= 7) return 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800';
    if (score >= 4) return 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800';
    return 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-gradient-to-br ${getHarmonyBg(day.harmony_score)} rounded-xl border-2 overflow-hidden transition-all ${
      isToday ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-slate-900' : ''
    }`}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-white/50 dark:hover:bg-black/10 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          {/* Planet Icon */}
          <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-3xl">
            {day.day_planet === 'Sun' && '☀️'}
            {day.day_planet === 'Moon' && '🌙'}
            {day.day_planet === 'Mars' && '♂️'}
            {day.day_planet === 'Mercury' && '☿️'}
            {day.day_planet === 'Jupiter' && '♃'}
            {day.day_planet === 'Venus' && '♀️'}
            {day.day_planet === 'Saturn' && '♄'}
          </div>

          {/* Day Info */}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {getDayName(day.weekday)}
              </h3>
              {isToday && (
                <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full font-semibold">
                  {language === 'fr' ? 'Aujourd\'hui' : 'Today'}
                </span>
              )}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {formatDate(day.date)} • {getPlanetName(day.day_planet)} {language === 'fr' ? 'jour' : 'day'}
            </div>
          </div>

          {/* Harmony Score */}
          <div className="text-center">
            <div className={`text-4xl font-bold bg-gradient-to-r ${getHarmonyColor(day.harmony_score)} bg-clip-text text-transparent`}>
              {day.harmony_score}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              / 10
            </div>
          </div>
        </div>

        {/* Expand Icon */}
        <div className="ml-4">
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-slate-400" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4 bg-white/30 dark:bg-black/10">
          
          {/* Energy Band */}
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {language === 'fr' ? 'Bande d\'énergie' : 'Energy Band'}:
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              day.band === 'High' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : day.band === 'Moderate'
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}>
              {day.band === 'High' && (language === 'fr' ? 'Élevé' : 'High')}
              {day.band === 'Moderate' && (language === 'fr' ? 'Modéré' : 'Moderate')}
              {day.band === 'Low' && (language === 'fr' ? 'Faible' : 'Low')}
            </span>
          </div>

          {/* Guidance Tips */}
          {day.tips && day.tips.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'fr' ? 'Conseils du jour' : 'Daily Guidance'}
                </span>
              </div>
              {day.tips.map((tip: string, idx: number) => (
                <div key={idx} className="pl-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  • {tip}
                </div>
              ))}
            </div>
          )}

          {/* Rest Day Info */}
          {day.isRestDay && day.restPractices && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-blue-900 dark:text-blue-100">
                  {language === 'fr' ? 'Jour de Repos Recommandé' : 'Rest Day Recommended'}
                </span>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                {language === 'fr'
                  ? 'Utilisez ce jour pour recharger votre énergie spirituelle.'
                  : 'Use this day to recharge your spiritual energy.'}
              </p>
              <div className="space-y-1">
                {day.restPractices.map((practice: string, idx: number) => (
                  <div key={idx} className="text-sm text-blue-700 dark:text-blue-300">
                    • {practice}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Energy Return Info */}
          {day.energyReturn && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {language === 'fr' ? 'Retour d\'Énergie' : 'Energy Return'}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  day.energyReturn.speed === 'instant' || day.energyReturn.speed === 'quick'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                }`}>
                  {day.energyReturn.timeframe}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {day.energyReturn.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
