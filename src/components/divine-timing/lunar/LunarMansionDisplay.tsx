/**
 * ========================================
 * LUNAR MANSION DISPLAY COMPONENT
 * ========================================
 * 
 * Beautiful display of current lunar mansion (Manzil) with:
 * - Arabic name + transliteration
 * - Spiritual qualities and focus
 * - Favorable/unfavorable activities
 * - Classical wisdom quote
 * - Moon phase indication
 * - Element and planetary ruler
 * 
 * Design: Lunar gradient card with moon imagery
 * Bilingual: EN/FR support
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  getCurrentLunarMansion,
  getMansionPlanetarySynergy,
  type CurrentMansion,
  type LunarMansion,
} from '../../../lib/lunarMansions';

interface LunarMansionDisplayProps {
  currentPlanet?: string; // For synergy analysis
}

export default function LunarMansionDisplay({ currentPlanet }: LunarMansionDisplayProps) {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  const [currentMansion, setCurrentMansion] = useState<CurrentMansion | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const mansion = getCurrentLunarMansion();
    setCurrentMansion(mansion);
  }, []);

  if (!currentMansion) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
        <div className="text-center text-gray-600 dark:text-gray-400">
          {isFr ? 'Calcul du manoir lunaire...' : 'Calculating lunar mansion...'}
        </div>
      </div>
    );
  }

  const { mansion, moonPhase } = currentMansion;

  // Calculate synergy if current planet provided
  const synergy = currentPlanet
    ? getMansionPlanetarySynergy(mansion, currentPlanet)
    : null;

  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800 shadow-lg overflow-hidden">
      {/* Crescent Moon Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="moon-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 12 5 Q 12 15, 12 25 Q 2 15, 12 5" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill="url(#moon-pattern)" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌙</span>
            <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
              {isFr ? 'Manoir Lunaire' : 'Lunar Mansion'}
            </h3>
          </div>
          <div className="text-xs bg-indigo-100 dark:bg-indigo-900 px-3 py-1 rounded-full text-indigo-700 dark:text-indigo-300">
            #{mansion.number}/28
          </div>
        </div>

        {/* Mansion Name Card */}
        <div className="mb-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg">
          {/* Arabic Name */}
          <div 
            className="text-4xl font-amiri font-bold text-center mb-2 text-indigo-800 dark:text-indigo-200"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            {mansion.nameArabic}
          </div>
          
          {/* Transliteration */}
          <div className="text-center text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">
            {mansion.nameTransliteration}
          </div>
          
          {/* English/French Name */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {isFr ? mansion.nameFr : mansion.nameEn}
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Moon Phase */}
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {isFr ? 'Phase Lunaire' : 'Moon Phase'}
            </div>
            <div className="text-sm font-semibold text-purple-900 dark:text-purple-100">
              {moonPhase}
            </div>
          </div>

          {/* Element */}
          <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {isFr ? 'Élément' : 'Element'}
            </div>
            <div className="text-sm font-semibold text-pink-900 dark:text-pink-100">
              {mansion.element}
            </div>
          </div>

          {/* Planetary Ruler */}
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg col-span-2">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {isFr ? 'Gouverneur Planétaire' : 'Planetary Ruler'}
            </div>
            <div className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
              {mansion.emoji} {mansion.planetaryRuler}
            </div>
          </div>
        </div>

        {/* Divine Quality */}
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {isFr ? 'Qualité Divine' : 'Divine Quality'}
          </div>
          <div className="text-base font-semibold text-purple-900 dark:text-purple-100">
            {isFr ? mansion.divineQuality.fr : mansion.divineQuality.en}
          </div>
        </div>

        {/* Spiritual Focus */}
        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">✨</span>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
              {isFr ? 'Focus Spirituel' : 'Spiritual Focus'}
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            {isFr ? mansion.spiritualFocus.fr : mansion.spiritualFocus.en}
          </p>
        </div>

        {/* Planetary Synergy */}
        {synergy && (
          <div className={`mb-4 p-3 rounded-lg border-2 ${
            synergy.synergy === 'high'
              ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700'
              : synergy.synergy === 'medium'
              ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700'
              : 'bg-gray-50 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">
                {synergy.synergy === 'high' ? '⚡' : synergy.synergy === 'medium' ? '✨' : '○'}
              </span>
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                {isFr ? 'Synergie Lunaire-Planétaire' : 'Lunar-Planetary Synergy'}
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {isFr ? synergy.explanation.fr : synergy.explanation.en}
            </p>
          </div>
        )}

        {/* Expandable Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mb-3 px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-sm font-medium"
        >
          {showDetails 
            ? (isFr ? '▼ Masquer les détails' : '▼ Hide Details')
            : (isFr ? '▶ Voir activités et sagesse' : '▶ View Activities & Wisdom')
          }
        </button>

        {showDetails && (
          <div className="space-y-3 animate-fade-in">
            {/* Favorable Activities */}
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">✅</span>
                <div className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-300">
                  {isFr ? 'Favorable Pour' : 'Favorable For'}
                </div>
              </div>
              <ul className="space-y-1">
                {(isFr ? mansion.favorableFor.fr : mansion.favorableFor.en).map((activity, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Unfavorable Activities */}
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">⚠️</span>
                <div className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">
                  {isFr ? 'Défavorable Pour' : 'Unfavorable For'}
                </div>
              </div>
              <ul className="space-y-1">
                {(isFr ? mansion.unfavorableFor.fr : mansion.unfavorableFor.en).map((activity, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Classical Wisdom */}
            <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📜</span>
                <div className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                  {isFr ? 'Sagesse Classique' : 'Classical Wisdom'}
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2 leading-relaxed">
                "{mansion.classicalWisdom.quote}"
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                — {mansion.classicalWisdom.scholar}, <em>{mansion.classicalWisdom.source}</em>
              </div>
            </div>
          </div>
        )}

        {/* Constellation Info */}
        <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-500">
          ⭐ {isFr ? 'Constellation' : 'Constellation'}: {mansion.constellation}
        </div>
      </div>
    </div>
  );
}
