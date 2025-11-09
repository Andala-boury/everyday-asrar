'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { TrendingUp } from 'lucide-react';
import type { DailyReading } from '../../features/ilm-huruf/core';

interface EnergyFlowChartProps {
  weekDays: DailyReading[];
}

/**
 * Energy Flow Visualization
 * Simple bar chart showing harmony trends across the week
 */
export function EnergyFlowChart({ weekDays }: EnergyFlowChartProps) {
  const { language } = useLanguage();

  const getDayName = (weekday: string) => {
    if (language === 'en') return weekday.slice(0, 3);
    
    const days: Record<string, string> = {
      'Monday': 'Lun',
      'Tuesday': 'Mar',
      'Wednesday': 'Mer',
      'Thursday': 'Jeu',
      'Friday': 'Ven',
      'Saturday': 'Sam',
      'Sunday': 'Dim'
    };
    return days[weekday] || weekday.slice(0, 3);
  };

  const getBarColor = (score: number) => {
    if (score >= 8) return 'bg-gradient-to-t from-green-500 to-emerald-500';
    if (score >= 7) return 'bg-gradient-to-t from-blue-500 to-cyan-500';
    if (score >= 4) return 'bg-gradient-to-t from-amber-500 to-orange-500';
    return 'bg-gradient-to-t from-red-500 to-pink-500';
  };

  const maxScore = 10;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {language === 'fr' ? 'Flux d\'Énergie Hebdomadaire' : 'Weekly Energy Flow'}
          </h3>
        </div>
      </div>

      <div className="p-6">
        {/* Chart */}
        <div className="flex items-end justify-between gap-3 h-64 mb-4">
          {weekDays.map((day) => {
            const heightPercent = (day.harmony_score / maxScore) * 100;
            const isToday = day.date === today;

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                {/* Score Label */}
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {day.harmony_score}
                </div>

                {/* Bar */}
                <div className="relative w-full flex-1 flex items-end">
                  <div
                    className={`w-full ${getBarColor(day.harmony_score)} rounded-t-lg transition-all hover:opacity-80 ${
                      isToday ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-slate-800' : ''
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Planet Icon */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl">
                      {day.day_planet === 'Sun' && '☀️'}
                      {day.day_planet === 'Moon' && '🌙'}
                      {day.day_planet === 'Mars' && '♂️'}
                      {day.day_planet === 'Mercury' && '☿️'}
                      {day.day_planet === 'Jupiter' && '♃'}
                      {day.day_planet === 'Venus' && '♀️'}
                      {day.day_planet === 'Saturn' && '♄'}
                    </div>
                  </div>
                </div>

                {/* Day Label */}
                <div className={`text-xs font-semibold ${
                  isToday 
                    ? 'text-purple-600 dark:text-purple-400' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {getDayName(day.weekday)}
                </div>

                {/* Today Indicator */}
                {isToday && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Y-axis labels */}
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2">
          <span>{language === 'fr' ? 'Faible' : 'Low'}</span>
          <span>{language === 'fr' ? 'Modéré' : 'Moderate'}</span>
          <span>{language === 'fr' ? 'Élevé' : 'High'}</span>
        </div>

        {/* Insight */}
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-sm text-slate-700 dark:text-slate-300">
          <p>
            {language === 'fr'
              ? '💡 Les barres plus hautes indiquent une meilleure harmonie. Planifiez vos tâches importantes pendant les pics d\'énergie.'
              : '💡 Higher bars indicate better harmony. Schedule your important tasks during energy peaks.'}
          </p>
        </div>
      </div>
    </div>
  );
}
