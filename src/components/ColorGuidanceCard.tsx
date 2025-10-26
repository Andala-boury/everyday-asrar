'use client';

import React from 'react';
import { Palette, AlertCircle } from 'lucide-react';
import type { ColorGuidance } from '../features/ilm-huruf/core';

interface ColorGuidanceCardProps {
  guidance: ColorGuidance;
}

export function ColorGuidanceCard({ guidance }: ColorGuidanceCardProps) {
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Today's Color Guidance
        </h3>
      </div>

      {/* Element Info */}
      <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-slate-600 dark:text-slate-400 mb-1">Your Element</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{guidance.userElement}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{dayName}</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{guidance.dayElement}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Harmony</p>
            <p className={`font-semibold text-sm ${
              guidance.harmony === 'harmonious' ? 'text-green-600 dark:text-green-400' :
              guidance.harmony === 'opposing' ? 'text-red-600 dark:text-red-400' :
              'text-blue-600 dark:text-blue-400'
            }`}>
              {guidance.harmony === 'harmonious' ? '✓ Good' :
               guidance.harmony === 'opposing' ? '⚠ Opposing' :
               '◆ Neutral'}
            </p>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
        {guidance.explanation}
      </p>

      {/* Primary Colors */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
          🎨 Wear These Colors
        </p>
        <div className="flex gap-3">
          {guidance.primaryColors.map((color) => (
            <div key={color.hex} className="flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-full shadow-md border-2 border-slate-300 dark:border-slate-600"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{color.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accent Colors */}
      {guidance.accentColors.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
            ✨ Accent Colors
          </p>
          <div className="flex gap-3">
            {guidance.accentColors.map((color) => (
              <div key={color.hex} className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full shadow-sm border-2 border-slate-300 dark:border-slate-600"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{color.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avoid Colors */}
      {guidance.avoidColors.length > 0 && (
        <div className="mb-5 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide">
              Minimize These Colors
            </p>
          </div>
          <div className="flex gap-3 pl-6">
            {guidance.avoidColors.map((color) => (
              <div key={color.hex} className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full shadow-sm border-2 border-red-300 dark:border-red-700 opacity-60"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{color.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practical Tip */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1">
          💡 Practical Tip
        </p>
        <p className="text-sm text-blue-900 dark:text-blue-100">
          {guidance.tip}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center border-t border-slate-200 dark:border-slate-700 pt-3">
        Based on elemental harmony principles
      </div>
    </div>
  );
}
