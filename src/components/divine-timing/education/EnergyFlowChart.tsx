/**
 * ========================================
 * ENERGY FLOW CHART COMPONENT
 * ========================================
 * 
 * Visual timeline showing energy quality throughout the entire day
 * - Color-coded bars for each planetary hour
 * - User's elemental harmony visualization
 * - Interactive timeline with hour selection
 * - Best/worst hour highlights
 * 
 * Design: Horizontal timeline with gradient bars
 * Purpose: Help users see the full day's energy flow at a glance
 */

'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { AccuratePlanetaryHour, Element } from '../../../types/planetary';

interface EnergyFlowChartProps {
  hours: AccuratePlanetaryHour[];
  userElement: Element;
  currentHour?: string | null; // Current planet name for highlighting
  onSelectHour?: (index: number) => void;
}

export default function EnergyFlowChart({
  hours,
  userElement,
  currentHour,
  onSelectHour,
}: EnergyFlowChartProps) {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  const [selectedHour, setSelectedHour] = useState<AccuratePlanetaryHour | null>(null);

  // Calculate harmony score for each hour
  const calculateHarmony = (hourElement: string): number => {
    // Normalize the element to lowercase for comparison
    const normalizedHourElement = hourElement.toLowerCase() as Element;
    const normalizedUserElement = userElement.toLowerCase() as Element;

    // Same element - EXCELLENT compatibility
    if (normalizedUserElement === normalizedHourElement) return 90;

    // Compatible pairs - Fire+Air and Water+Earth support each other
    if (
      (normalizedUserElement === 'fire' && normalizedHourElement === 'air') ||
      (normalizedUserElement === 'air' && normalizedHourElement === 'fire') ||
      (normalizedUserElement === 'water' && normalizedHourElement === 'earth') ||
      (normalizedUserElement === 'earth' && normalizedHourElement === 'water')
    ) return 70;

    // Neutral pairs - Tangential elements
    if (
      (normalizedUserElement === 'fire' && normalizedHourElement === 'earth') ||
      (normalizedUserElement === 'earth' && normalizedHourElement === 'fire') ||
      (normalizedUserElement === 'air' && normalizedHourElement === 'water') ||
      (normalizedUserElement === 'water' && normalizedHourElement === 'air')
    ) return 50;

    // Opposing elements - Fire vs Water, Air vs Earth
    return 30;
  };

  // Get color based on harmony score
  const getHarmonyColor = (score: number): string => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#3b82f6'; // Blue
    if (score >= 40) return '#eab308'; // Yellow
    return '#f97316'; // Orange
  };

  // Get quality label
  const getQualityLabel = (score: number): { en: string; fr: string } => {
    if (score >= 80) return { en: 'Excellent', fr: 'Excellent' };
    if (score >= 60) return { en: 'Good', fr: 'Bon' };
    if (score >= 40) return { en: 'Neutral', fr: 'Neutre' };
    return { en: 'Challenging', fr: 'Difficile' };
  };

  const handleHourClick = (hour: AccuratePlanetaryHour, index: number) => {
    setSelectedHour(hour);
    if (onSelectHour) {
      onSelectHour(index);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📊</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {isFr ? 'Flux d\'Énergie Quotidien' : 'Daily Energy Flow'}
          </h3>
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
          {isFr
            ? 'Visualisation de votre harmonie avec chaque heure planétaire'
            : 'Visualization of your harmony with each planetary hour'}
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="font-medium text-slate-900 dark:text-slate-200">
            {isFr ? 'Excellent (80-100)' : 'Excellent (80-100)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="font-medium text-slate-900 dark:text-slate-200">
            {isFr ? 'Bon (60-79)' : 'Good (60-79)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="font-medium text-slate-900 dark:text-slate-200">
            {isFr ? 'Neutre (40-59)' : 'Neutral (40-59)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="font-medium text-slate-900 dark:text-slate-200">
            {isFr ? 'Difficile (0-39)' : 'Challenging (0-39)'}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-1 mb-6">
        {hours.map((hour, index) => {
          const harmony = calculateHarmony(hour.planet.element);
          const color = getHarmonyColor(harmony);
          const quality = getQualityLabel(harmony);
          const isCurrent = currentHour === hour.planet.name;
          const isSelected = selectedHour?.planet.name === hour.planet.name;

          return (
            <button
              key={index}
              onClick={() => handleHourClick(hour, index)}
              className={`w-full text-left transition-all ${
                isCurrent || isSelected
                  ? 'ring-2 ring-offset-2 ring-amber-500 dark:ring-offset-slate-900'
                  : 'hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600'
              } rounded-lg overflow-hidden`}
            >
              <div className="flex items-center">
                {/* Time label */}
                <div className="w-24 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white">
                  {hour.startTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </div>

                {/* Energy bar */}
                <div className="flex-1 relative h-10">
                  {/* Background */}
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700"></div>
                  
                  {/* Harmony bar */}
                  <div
                    className="absolute inset-y-0 left-0 transition-all duration-300"
                    style={{
                      width: `${harmony}%`,
                      backgroundColor: color,
                      opacity: isCurrent ? 1 : 0.9,
                    }}
                  ></div>

                  {/* Label overlay */}
                  <div className="absolute inset-0 flex items-center justify-between px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                        {hour.planet.name}
                      </span>
                      {isCurrent && (
                        <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold shadow-md">
                          {isFr ? 'Actuel' : 'Current'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                      {harmony}% - {isFr ? quality.fr : quality.en}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Hour Details */}
      {selectedHour && (
        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200 dark:border-amber-800 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔍</span>
            <div className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              {selectedHour.planet.name} {isFr ? 'Heure' : 'Hour'}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-amber-700 dark:text-amber-300 mb-1">
                {isFr ? 'Élément' : 'Element'}
              </div>
              <div className="font-medium text-amber-900 dark:text-amber-100">
                {selectedHour.planet.element}
              </div>
            </div>
            <div>
              <div className="text-xs text-amber-700 dark:text-amber-300 mb-1">
                {isFr ? 'Harmonie' : 'Harmony'}
              </div>
              <div className="font-medium text-amber-900 dark:text-amber-100">
                {calculateHarmony(selectedHour.planet.element)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-amber-700 dark:text-amber-300 mb-1">
                {isFr ? 'Début' : 'Starts'}
              </div>
              <div className="font-medium text-amber-900 dark:text-amber-100">
                {selectedHour.startTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </div>
            </div>
            <div>
              <div className="text-xs text-amber-700 dark:text-amber-300 mb-1">
                {isFr ? 'Fin' : 'Ends'}
              </div>
              <div className="font-medium text-amber-900 dark:text-amber-100">
                {selectedHour.endTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {hours.filter(h => calculateHarmony(h.planet.element) >= 80).length}
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">
              {isFr ? 'Heures Excellentes' : 'Excellent Hours'}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {hours.filter(h => {
                const score = calculateHarmony(h.planet.element);
                return score >= 60 && score < 80;
              }).length}
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">
              {isFr ? 'Bonnes Heures' : 'Good Hours'}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {hours.filter(h => calculateHarmony(h.planet.element) < 40).length}
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">
              {isFr ? 'Heures Difficiles' : 'Challenging Hours'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
