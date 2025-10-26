'use client';

import React, { useState } from 'react';
import { Palette, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import type { DailyColorGuidance } from '../features/ilm-huruf/core';

interface DailyColorGuidanceCardProps {
  guidance: DailyColorGuidance;
}

export function DailyColorGuidanceCard({ guidance }: DailyColorGuidanceCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Determine icon and color based on harmony level
  const getHarmonyIcon = () => {
    switch (guidance.harmonyLevel) {
      case 'excellent': return '✨';
      case 'good': return '🌟';
      case 'neutral': return '⚖️';
      case 'challenging': return '⚡';
    }
  };
  
  const getScoreBarColor = () => {
    if (guidance.harmonyScore >= 80) return 'from-green-500 to-emerald-500';
    if (guidance.harmonyScore >= 60) return 'from-blue-500 to-cyan-500';
    return 'from-orange-500 to-red-500';
  };
  
  const getScoreBarBg = () => {
    if (guidance.harmonyScore >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (guidance.harmonyScore >= 60) return 'bg-blue-100 dark:bg-blue-900/20';
    return 'bg-orange-100 dark:bg-orange-900/20';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Palette className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Today's Color Guidance
          </h3>
        </div>
        <span className="text-3xl">{getHarmonyIcon()}</span>
      </div>

      {/* Element Info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-center">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Your Element</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{guidance.userElement}</p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-center">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Today's Energy</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{guidance.dailyDominantElement}</p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-center">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Harmony</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{guidance.harmonyScore}%</p>
        </div>
      </div>

      {/* Harmony Score Bar */}
      <div className={`p-4 ${getScoreBarBg()} rounded-lg`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">HARMONY SCORE</p>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{guidance.harmonyScore}%</p>
        </div>
        <div className="w-full bg-slate-300 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getScoreBarColor()} transition-all duration-700 ease-out`}
            style={{ width: `${guidance.harmonyScore}%` }}
          />
        </div>
      </div>

      {/* Energy Message */}
      <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <p className="text-base font-semibold text-indigo-900 dark:text-indigo-100">
          {guidance.energyMessage}
        </p>
      </div>

      {/* Color Recommendations */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          🎯 Wear Today:
        </h4>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Primary */}
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full shadow-lg border-4 border-slate-300 dark:border-slate-600 mb-2"
              style={{ backgroundColor: guidance.primaryColor.hex }}
              title={guidance.primaryColor.name}
            />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">
              {guidance.primaryColor.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Primary</p>
          </div>
          
          {/* Secondary */}
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full shadow-lg border-4 border-slate-300 dark:border-slate-600 mb-2"
              style={{ backgroundColor: guidance.secondaryColor.hex }}
              title={guidance.secondaryColor.name}
            />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">
              {guidance.secondaryColor.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Secondary</p>
          </div>
          
          {/* Accent */}
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full shadow-lg border-4 border-slate-300 dark:border-slate-600 mb-2"
              style={{ backgroundColor: guidance.accentColor.hex }}
              title={guidance.accentColor.name}
            />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">
              {guidance.accentColor.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Accent</p>
          </div>
        </div>
      </div>

      {/* Practical Tips */}
      <div className="space-y-3">
        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          💡 Practical Suggestions:
        </h4>
        <ul className="space-y-2">
          {guidance.practicalTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0 mt-0.5">•</span>
              <span className="text-slate-700 dark:text-slate-300">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Best Energy Times */}
      <div className="space-y-3">
        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          ⏰ Best Energy Times Today:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {guidance.bestEnergyTimes.map((time, idx) => (
            <div key={idx} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">{time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Avoid Colors - if challenging */}
      {guidance.avoidColors.length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100 mb-2">Minimize These Colors:</p>
              <div className="flex gap-3 flex-wrap">
                {guidance.avoidColors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-red-400 dark:border-red-600 opacity-60"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm text-red-800 dark:text-red-200">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why This Works Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full p-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg flex items-center justify-between transition-colors"
      >
        <span className="font-semibold text-slate-900 dark:text-slate-100">Why This Works</span>
        {showDetails ? (
          <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        )}
      </button>

      {/* Why This Works Details */}
      {showDetails && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <span className="font-semibold">Day Ruler:</span> {guidance.dayRulerElement} is today's planetary ruler, giving the day its primary energetic signature.
          </p>
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <span className="font-semibold">Most Active Element:</span> {guidance.mostActiveElement} dominates today's 24 planetary hours, reinforcing the day's energy pattern.
          </p>
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <span className="font-semibold">Daily Dominant:</span> {guidance.dailyDominantElement} combines these influences to create today's overall energetic character.
          </p>
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <span className="font-semibold">Your Harmony:</span> Your {guidance.userElement} element has a {guidance.harmonyScore}% harmony with today's {guidance.dailyDominantElement} energy.
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-200 italic pt-2 border-t border-blue-200 dark:border-blue-700">
            Calculation: {guidance.harmonyBreakdown}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-center text-xs text-slate-600 dark:text-slate-400">
        Based on elemental harmony principles from classical philosophy. Wear what makes you feel confident - colors are supportive, not prescriptive.
      </div>
    </div>
  );
}
