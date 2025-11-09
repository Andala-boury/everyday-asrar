'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Calendar, Sun, Moon, Star, AlertCircle } from 'lucide-react';
import type { DailyReading } from '../../features/ilm-huruf/core';

interface WeekOverviewProps {
  weekDays: DailyReading[];
  userElement: string;
  onDaySelect: (date: string) => void;
}

/**
 * Week Overview - Calendar Grid View
 * Shows all 7 days with visual harmony indicators
 */
export function WeekOverview({ weekDays, userElement, onDaySelect }: WeekOverviewProps) {
  const { language } = useLanguage();

  const getHarmonyColor = (score: number) => {
    if (score >= 8) return 'from-green-500 to-emerald-500';
    if (score >= 7) return 'from-blue-500 to-cyan-500';
    if (score >= 4) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getHarmonyLabel = (score: number) => {
    if (language === 'fr') {
      if (score >= 8) return 'Excellent';
      if (score >= 7) return 'Très Bon';
      if (score >= 4) return 'Modéré';
      return 'Repos Requis';
    } else {
      if (score >= 8) return 'Excellent';
      if (score >= 7) return 'Very Good';
      if (score >= 4) return 'Moderate';
      return 'Rest Needed';
    }
  };

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

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {language === 'fr' ? 'Vue de la Semaine' : 'Week at a Glance'}
          </h3>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const isToday = day.date === today;
            const isBest = day.harmony_score >= 7;
            const isRest = day.isRestDay;

            return (
              <button
                key={day.date}
                onClick={() => onDaySelect(day.date)}
                className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
                  isToday
                    ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                }`}
              >
                {/* Day Name */}
                <div className={`text-xs font-semibold mb-2 ${
                  isToday ? 'text-purple-700 dark:text-purple-300' : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {getDayName(day.weekday).slice(0, 3)}
                </div>

                {/* Planet Icon */}
                <div className="text-2xl mb-2">
                  {day.day_planet === 'Sun' && '☀️'}
                  {day.day_planet === 'Moon' && '🌙'}
                  {day.day_planet === 'Mars' && '♂️'}
                  {day.day_planet === 'Mercury' && '☿️'}
                  {day.day_planet === 'Jupiter' && '♃'}
                  {day.day_planet === 'Venus' && '♀️'}
                  {day.day_planet === 'Saturn' && '♄'}
                </div>

                {/* Harmony Score */}
                <div className={`text-2xl font-bold mb-2 bg-gradient-to-r ${getHarmonyColor(day.harmony_score)} bg-clip-text text-transparent`}>
                  {day.harmony_score}
                </div>

                {/* Status Badge */}
                {isBest && (
                  <div className="flex items-center justify-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3" />
                    {language === 'fr' ? 'Top' : 'Best'}
                  </div>
                )}
                {isRest && (
                  <div className="flex items-center justify-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                    <Moon className="w-3 h-3" />
                    {language === 'fr' ? 'Repos' : 'Rest'}
                  </div>
                )}
                {!isBest && !isRest && day.harmony_score >= 4 && (
                  <div className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full">
                    {language === 'fr' ? 'OK' : 'OK'}
                  </div>
                )}
                {day.harmony_score < 4 && !isRest && (
                  <div className="flex items-center justify-center gap-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    {language === 'fr' ? 'Bas' : 'Low'}
                  </div>
                )}

                {/* Today Indicator */}
                {isToday && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
              <span>{language === 'fr' ? '8-10: Excellent' : '8-10: Excellent'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
              <span>{language === 'fr' ? '7: Très Bon' : '7: Very Good'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
              <span>{language === 'fr' ? '4-6: Modéré' : '4-6: Moderate'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
              <span>{language === 'fr' ? '0-3: Repos' : '0-3: Rest'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
