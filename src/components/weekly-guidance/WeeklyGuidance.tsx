'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { WeekOverview } from './WeekOverview';
import { DayCard } from './DayCard';
import { WeeklyInsights } from './WeeklyInsights';
import { EnergyFlowChart } from './EnergyFlowChart';
import type { DailyReading } from '../../features/ilm-huruf/core';

interface WeeklyGuidanceProps {
  weekDays: DailyReading[];
  userElement: string;
  userPlanet: string;
}

/**
 * Advanced Weekly Guidance Component
 * 
 * A user-friendly, narrative-driven weekly planning interface
 * Transforms technical astrological data into actionable daily guidance
 * 
 * Features:
 * - Week at a glance overview
 * - Day-by-day guidance cards
 * - Energy flow visualization
 * - Best days identification
 * - Rest day recommendations
 * - Bilingual support (EN/FR)
 */
export function WeeklyGuidance({ weekDays, userElement, userPlanet }: WeeklyGuidanceProps) {
  const { t, language } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  // Calculate best days (harmony >= 7)
  const bestDays = weekDays.filter(day => day.harmony_score >= 7);
  const restDays = weekDays.filter(day => day.isRestDay);
  const moderateDays = weekDays.filter(day => day.harmony_score >= 4 && day.harmony_score < 7);

  // Find today
  const today = new Date().toISOString().split('T')[0];
  const todayReading = weekDays.find(day => day.date === today);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {language === 'fr' ? '📅 Votre Semaine Spirituelle' : '📅 Your Spiritual Week'}
            </h2>
            <p className="text-white/90 text-sm">
              {language === 'fr' 
                ? 'Planification intelligente basée sur votre énergie cosmique'
                : 'Smart planning based on your cosmic energy'}
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex gap-2 bg-white/20 rounded-lg p-1">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'overview'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {language === 'fr' ? 'Vue d\'ensemble' : 'Overview'}
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'detailed'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {language === 'fr' ? 'Détaillé' : 'Detailed'}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-white/80 text-xs mb-1">
              {language === 'fr' ? 'Meilleurs Jours' : 'Best Days'}
            </div>
            <div className="text-2xl font-bold">{bestDays.length}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-white/80 text-xs mb-1">
              {language === 'fr' ? 'Jours Modérés' : 'Moderate Days'}
            </div>
            <div className="text-2xl font-bold">{moderateDays.length}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-white/80 text-xs mb-1">
              {language === 'fr' ? 'Jours de Repos' : 'Rest Days'}
            </div>
            <div className="text-2xl font-bold">{restDays.length}</div>
          </div>
        </div>
      </div>

      {/* Today's Quick Tip (if available) */}
      {todayReading && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border-2 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💡</span>
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2">
                {language === 'fr' ? 'Conseil du Jour' : 'Today\'s Tip'}
              </h3>
              <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                {todayReading.tips[0]}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                <span>⚡</span>
                <span>
                  {language === 'fr' ? 'Harmonie' : 'Harmony'}: {todayReading.harmony_score}/10
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'overview' ? (
        <>
          {/* Week Overview */}
          <WeekOverview 
            weekDays={weekDays}
            userElement={userElement}
            onDaySelect={setSelectedDay}
          />

          {/* Energy Flow Chart */}
          <EnergyFlowChart weekDays={weekDays} />

          {/* Weekly Insights */}
          <WeeklyInsights 
            bestDays={bestDays}
            restDays={restDays}
            moderateDays={moderateDays}
          />
        </>
      ) : (
        <>
          {/* Detailed Day Cards */}
          <div className="space-y-4">
            {weekDays.map((day) => (
              <DayCard 
                key={day.date}
                day={day}
                isToday={day.date === today}
                userElement={userElement}
              />
            ))}
          </div>
        </>
      )}

      {/* Classical Source Attribution */}
      <div className="text-center py-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
          {language === 'fr'
            ? 'Basé sur les principes classiques de ʿIlm al-Ḥurūf et d\'astrologie islamique'
            : 'Based on classical ʿIlm al-Ḥurūf and Islamic astrology principles'}
        </p>
      </div>
    </div>
  );
}
