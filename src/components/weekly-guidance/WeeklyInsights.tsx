'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { TrendingUp, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';
import type { DailyReading } from '../../features/ilm-huruf/core';

interface WeeklyInsightsProps {
  bestDays: DailyReading[];
  restDays: DailyReading[];
  moderateDays: DailyReading[];
}

/**
 * Weekly Insights Panel
 * Smart recommendations and actionable insights
 */
export function WeeklyInsights({ bestDays, restDays, moderateDays }: WeeklyInsightsProps) {
  const { language } = useLanguage();

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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {language === 'fr' ? 'Perspectives de la Semaine' : 'Weekly Insights'}
          </h3>
        </div>
      </div>

      <div className="p-6 space-y-5">
        
        {/* Best Days for Action */}
        {bestDays.length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-5 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">
                  {language === 'fr' ? '🌟 Meilleurs Jours pour l\'Action' : '🌟 Best Days for Action'}
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                  {language === 'fr'
                    ? 'Ces jours ont une harmonie élevée. Parfait pour les tâches importantes, les décisions majeures et les nouveaux départs.'
                    : 'These days have high harmony. Perfect for important tasks, major decisions, and new beginnings.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {bestDays.map(day => (
                    <div key={day.date} className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {getDayName(day.weekday)}
                      <span className="text-xs opacity-75">({day.harmony_score}/10)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rest Days */}
        {restDays.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
                  {language === 'fr' ? '🌙 Jours de Repos Spirituel' : '🌙 Spiritual Rest Days'}
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  {language === 'fr'
                    ? 'Énergies faibles. Idéal pour la méditation, la réflexion et recharger votre énergie spirituelle. Évitez les grandes décisions.'
                    : 'Low energies. Ideal for meditation, reflection, and recharging your spiritual energy. Avoid major decisions.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {restDays.map(day => (
                    <div key={day.date} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {getDayName(day.weekday)}
                      <span className="text-xs opacity-75 ml-1">({day.harmony_score}/10)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Planning Strategy */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-5 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📋</div>
            <div className="flex-1">
              <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">
                {language === 'fr' ? 'Stratégie de Planification' : 'Planning Strategy'}
              </h4>
              <div className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                {bestDays.length > 0 && (
                  <p>
                    ✅ <strong>{language === 'fr' ? 'Planifiez' : 'Schedule'}:</strong>{' '}
                    {language === 'fr'
                      ? 'Réunions importantes, lancements, négociations'
                      : 'Important meetings, launches, negotiations'}{' '}
                    {language === 'fr' ? 'pour' : 'for'} {bestDays.map(d => getDayName(d.weekday)).join(', ')}
                  </p>
                )}
                {moderateDays.length > 0 && (
                  <p>
                    📊 <strong>{language === 'fr' ? 'Tâches de routine' : 'Routine tasks'}:</strong>{' '}
                    {language === 'fr'
                      ? 'Travail régulier, suivi, tâches quotidiennes'
                      : 'Regular work, follow-ups, daily tasks'}{' '}
                    {language === 'fr' ? 'fonctionnent bien' : 'work well'}
                  </p>
                )}
                {restDays.length > 0 && (
                  <p>
                    🌙 <strong>{language === 'fr' ? 'Temps de repos' : 'Rest time'}:</strong>{' '}
                    {language === 'fr'
                      ? 'Utilisez pour la réflexion, la planification, les pratiques spirituelles'
                      : 'Use for reflection, planning, spiritual practices'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Week Quality Summary */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <div className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold">{language === 'fr' ? 'Qualité de la semaine' : 'Week Quality'}:</span>
            {' '}
            {bestDays.length >= 3 && (language === 'fr' ? 'Excellente semaine!' : 'Excellent week!')}
            {bestDays.length === 2 && (language === 'fr' ? 'Très bonne semaine' : 'Very good week')}
            {bestDays.length === 1 && (language === 'fr' ? 'Bonne semaine' : 'Good week')}
            {bestDays.length === 0 && (language === 'fr' ? 'Semaine de repos et réflexion' : 'Rest and reflection week')}
          </div>
          <div className="flex gap-1">
            {bestDays.length >= 3 && '⭐⭐⭐'}
            {bestDays.length === 2 && '⭐⭐'}
            {bestDays.length === 1 && '⭐'}
          </div>
        </div>
      </div>
    </div>
  );
}
