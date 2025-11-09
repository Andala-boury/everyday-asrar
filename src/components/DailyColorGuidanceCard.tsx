'use client';

import React, { useState } from 'react';
import { Palette, ChevronDown, ChevronUp } from 'lucide-react';
import type { DailyColorGuidance } from '../features/ilm-huruf/core';
import { useLanguage } from '../contexts/LanguageContext';

interface DailyColorGuidanceCardProps {
  guidance: DailyColorGuidance;
}

export function DailyColorGuidanceCard({ guidance }: DailyColorGuidanceCardProps) {
  const { t } = useLanguage();
  const [showWhy, setShowWhy] = useState(false);
  
  const getHarmonyIcon = () => {
    switch (guidance.harmonyLevel) {
      case 'excellent': return '✨';
      case 'good': return '🌟';
      case 'neutral': return '⚖️';
      case 'challenging': return '⚡';
    }
  };
  
  const getHarmonyLabel = () => {
    switch (guidance.harmonyLevel) {
      case 'excellent': return t.timingResults.perfectFit;
      case 'good': return t.timingResults.goingWell;
      case 'neutral': return t.timingResults.balanced;
      case 'challenging': return t.timingResults.needCare;
    }
  };
  
  const getScoreBarColor = () => {
    if (guidance.harmonyScore >= 80) return 'from-green-500 to-emerald-500';
    if (guidance.harmonyScore >= 60) return 'from-blue-500 to-cyan-500';
    return 'from-orange-500 to-red-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-4 space-y-3">
      
      {/* Header - Compact */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {t.timingResults.whatToWearToday}
          </h3>
        </div>
        <span className="text-2xl">{getHarmonyIcon()}</span>
      </div>

      {/* Quick Info Row */}
      <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm">
        <div className="flex gap-3 flex-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {t.timingResults.you}: <span className="text-purple-600 dark:text-purple-400">{guidance.userElement}</span>
          </span>
          <span className="text-slate-400 dark:text-slate-500">•</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {t.timingResults.today}: <span className="text-blue-600 dark:text-blue-400">{guidance.dailyDominantElement}</span>
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          guidance.harmonyScore >= 80 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
          guidance.harmonyScore >= 60 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
          'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
        }`}>
          {getHarmonyLabel()} ({guidance.harmonyScore}%)
        </span>
      </div>

      {/* Colors to Wear - Compact */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">🎨 {t.timingResults.wearTheseColors}</p>
        <div className="flex gap-2">
          {[guidance.primaryColor, guidance.secondaryColor, guidance.accentColor].map((color, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className="w-12 h-12 rounded-full shadow-md border-3 border-slate-300 dark:border-slate-600"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center">{color.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Best Time + Practical Tip */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-0.5">⏰ {t.timingResults.bestTime}:</p>
          <p className="text-xs text-amber-900 dark:text-amber-200">{guidance.bestEnergyTimes[0]}</p>
        </div>
        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-0.5">💡 {t.timingResults.tryThis}:</p>
          <p className="text-xs text-blue-900 dark:text-blue-200">{guidance.practicalTips[0]}</p>
        </div>
      </div>

      {/* Avoid Colors - Compact */}
      {guidance.avoidColors.length > 0 && (
        <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">⚠️ Try to avoid:</p>
          <div className="flex gap-2 flex-wrap">
            {guidance.avoidColors.map((color, idx) => (
              <span key={idx} className="text-xs text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded">
                {color.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Why This Works - Collapsible */}
      <button
        onClick={() => setShowWhy(!showWhy)}
        className="w-full p-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors flex items-center justify-between"
      >
        <span>📚 {t.timingResults.howWeFiguredThisOut}</span>
        {showWhy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Why Details - Hidden by default */}
      {showWhy && (
        <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <p>
            <span className="font-semibold">{t.timingResults.howItWorks}</span> {t.timingResults.planetaryRulerExplanation.replace('{planet}', guidance.dayRulerElement).replace('{element}', guidance.mostActiveElement)}
          </p>
          <p>
            <span className="font-semibold">{t.timingResults.yourFitExplanation.split(':')[0]}:</span> {t.timingResults.yourFitExplanation.split(':')[1]?.replace('{userElement}', guidance.userElement).replace('{dayElement}', guidance.dailyDominantElement).replace('{harmonyPercent}', guidance.harmonyScore.toString())}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 italic">
            {guidance.harmonyBreakdown}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
        {t.timingResults.ancientWisdomMessage}
      </div>
    </div>
  );
}
