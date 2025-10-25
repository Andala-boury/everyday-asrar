'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';

export type ElementType = 'Fire' | 'Water' | 'Air' | 'Earth';
export type ConnectionType = 'perfect' | 'strong' | 'moderate' | 'weak';

export interface HarmonyBreakdown {
  score: number;
  userElement: ElementType;
  contextElement: ElementType;
  contextLabel: string; // "Mars day" or "Jupiter hour"
  ruhPhase: number;
  connectionType: ConnectionType;
  elementMatch: number; // percentage 0-100
  planetMatch: number; // percentage 0-100
  ruhImpact: number; // percentage 0-100
}

interface HarmonyTooltipProps {
  breakdown: HarmonyBreakdown;
  context: 'weekly' | 'daily';
}

const ELEMENT_ARABIC: Record<ElementType, string> = {
  'Fire': 'نار',
  'Water': 'ماء',
  'Air': 'هواء',
  'Earth': 'تراب'
};

const ELEMENT_TRANSLITERATION: Record<ElementType, string> = {
  'Fire': 'Nār',
  'Water': 'Māʾ',
  'Air': 'Hawāʾ',
  'Earth': 'Turāb'
};

const CONNECTION_LABELS: Record<ConnectionType, { en: string; ar: string; transliteration: string }> = {
  'perfect': {
    en: 'Perfect Connection',
    ar: 'اتصال تام',
    transliteration: 'Ittiṣāl Tāmm'
  },
  'strong': {
    en: 'Strong Connection',
    ar: 'اتصال قوي',
    transliteration: 'Ittiṣāl Qawī'
  },
  'moderate': {
    en: 'Moderate Connection',
    ar: 'اتصال متوسط',
    transliteration: 'Ittiṣāl Mutawassiṭ'
  },
  'weak': {
    en: 'Weak Connection',
    ar: 'اتصال ضعيف',
    transliteration: 'Ittiṣāl Ḍaʿīf'
  }
};

const ACTION_GUIDANCE: Record<ConnectionType, string> = {
  'perfect': '→ Optimal flow - all forces aligned',
  'strong': '→ Easy flow today',
  'moderate': '→ Steady progress with effort',
  'weak': '→ Gentle approach recommended'
};

export function HarmonyTooltip({ breakdown, context }: HarmonyTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissTimeout, setDismissTimeout] = useState<NodeJS.Timeout | null>(null);

  const connection = CONNECTION_LABELS[breakdown.connectionType];

  const handleMouseEnter = () => {
    setIsVisible(true);
    if (dismissTimeout) clearTimeout(dismissTimeout);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleClick = () => {
    setIsVisible(!isVisible);
    
    // Auto-dismiss after 10 seconds on mobile
    if (!isVisible) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      setDismissTimeout(timeout);
    }
  };

  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative inline-block ml-1">
      <button
        type="button"
        className="inline-flex items-center justify-center w-4 h-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={isVisible ? 'harmony-tooltip' : undefined}
        aria-label="Learn about this harmony score"
      >
        <Info className="w-4 h-4" />
      </button>

      {isVisible && (
        <div
          id="harmony-tooltip"
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-[280px] animate-in fade-in duration-150"
        >
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-[1px]">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800 dark:border-t-slate-700"></div>
          </div>

          {/* Content */}
          <div className="bg-slate-800 dark:bg-slate-700 text-slate-100 rounded-lg shadow-lg p-3 text-xs leading-relaxed">
            
            {/* Main calculation */}
            <div className="mb-2 pb-2 border-b border-slate-600 dark:border-slate-500">
              <p className="font-semibold mb-1">
                Your {ELEMENT_TRANSLITERATION[breakdown.userElement]} ({ELEMENT_ARABIC[breakdown.userElement]}) 
                + {breakdown.contextLabel}
              </p>
              <p className="text-purple-300 dark:text-purple-200 font-medium">
                = {connection.transliteration} ({connection.ar})
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-1 mb-2 text-[10px] text-slate-300 dark:text-slate-200">
              <div className="flex justify-between">
                <span>Element match:</span>
                <span className="font-medium">{breakdown.elementMatch}%</span>
              </div>
              <div className="flex justify-between">
                <span>Planet alignment:</span>
                <span className="font-medium">{breakdown.planetMatch}%</span>
              </div>
              <div className="flex justify-between">
                <span>Rūḥ phase {breakdown.ruhPhase}:</span>
                <span className="font-medium">{breakdown.ruhImpact}%</span>
              </div>
            </div>

            {/* Action guidance */}
            <p className="text-green-300 dark:text-green-200 font-medium text-[11px] mt-2">
              {ACTION_GUIDANCE[breakdown.connectionType]}
            </p>

            {/* Teaching note */}
            <p className="text-[9px] text-slate-400 dark:text-slate-300 mt-2 pt-2 border-t border-slate-600 dark:border-slate-500 italic">
              ʿIlm al-Ḥurūf (علم الحروف) - Science of Letters
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
