'use client';

import React, { useState } from 'react';
import { Flame, Droplet, Wind, Mountain, Timer, X } from 'lucide-react';

/**
 * Balance Meter Component
 * Based on Imam al-Būnī's Mīzān (Scale) concept from ʿIlm al-Ḥurūf
 * 
 * Classical Sources:
 * - Mīzān (Scale) concept from Shams al-Maʿārif
 * - Element opposition theory from classical Ḥurūf tradition
 * - Quick fixes from traditional Sufi practice
 */

export type ElementType = 'Fire' | 'Water' | 'Air' | 'Earth';

interface BalanceState {
  score: number;        // 0-100: Balance quality
  dominant: ElementType; // What's excessive right now
  deficit: ElementType;  // What's needed for balance
  quickFix: string;      // ONE actionable practice
  fixDuration: number;   // Duration in minutes for the quick fix
  explanation: string;   // Why this score (based on Al-Būnī theory)
}

interface BalanceMeterProps {
  userElement: ElementType;
  currentDayElement: ElementType;
  compact?: boolean;
}

/**
 * Calculate balance based on Al-Būnī's Mīzān (Scale) theory
 * 
 * Logic from classical Ḥurūf tradition:
 * - Same elements = overheating (50 score) - needs cooling
 * - Complementary pairs = harmony (85-90 score)
 * - Opposing elements = conflict (20-30 score)
 * - Neutral combinations = moderate (60 score)
 */
function calculateBalance(userElement: ElementType, dayElement: ElementType): BalanceState {
  let score = 50;
  let dominant = userElement;
  let deficit: ElementType = 'Water';
  let quickFix = '';
  let fixDuration = 0;
  let explanation = '';

  // Same element = Double energy (needs opposite to cool)
  if (userElement === dayElement) {
    score = 50;
    dominant = userElement;
    deficit = getOppositeElement(userElement);
    explanation = `${userElement} element doubled today. Energy is intense - ${getElementQuality(userElement, true)}. Need ${getElementQuality(deficit, false)} to balance.`;
  }
  // Complementary pairs (harmonious - feed each other)
  else if (
    (userElement === 'Fire' && dayElement === 'Air') ||
    (userElement === 'Air' && dayElement === 'Fire')
  ) {
    score = 90;
    dominant = 'Fire';
    deficit = 'Water';
    explanation = 'Fire + Air = Harmonious! Air fans your flames. Excellent for action and creativity. Minor cooling recommended.';
  }
  else if (
    (userElement === 'Water' && dayElement === 'Earth') ||
    (userElement === 'Earth' && dayElement === 'Water')
  ) {
    score = 90;
    dominant = 'Earth';
    deficit = 'Air';
    explanation = 'Water + Earth = Growth harmony! Excellent for nurturing projects. Minor movement recommended.';
  }
  // Opposing elements (conflict - classical opposition)
  else if (
    (userElement === 'Fire' && dayElement === 'Water') ||
    (userElement === 'Water' && dayElement === 'Fire')
  ) {
    score = 30;
    dominant = dayElement; // Current day dominates
    deficit = userElement; // User element suppressed
    explanation = 'Fire vs Water = Classical opposition. Internal conflict between action and rest. Strong rebalancing needed.';
  }
  else if (
    (userElement === 'Air' && dayElement === 'Earth') ||
    (userElement === 'Earth' && dayElement === 'Air')
  ) {
    score = 35;
    dominant = dayElement;
    deficit = userElement;
    explanation = 'Air vs Earth = Movement vs Stability conflict. Scattered or stuck energy. Gentle rebalancing needed.';
  }
  // Neutral combinations
  else {
    score = 60;
    dominant = userElement;
    deficit = getComplementaryElement(userElement);
    explanation = `${userElement} + ${dayElement} = Moderate balance. Can be improved with ${deficit} practices.`;
  }

  // Get quick fix based on dominant (excessive) element
  const fix = getQuickFix(dominant, score);
  quickFix = fix.action;
  fixDuration = fix.duration;

  return { score, dominant, deficit, quickFix, fixDuration, explanation };
}

/**
 * Get opposite element (classical Al-Būnī pairs)
 * Fire ↔ Water (Heat vs Cold)
 * Air ↔ Earth (Movement vs Stillness)
 */
function getOppositeElement(element: ElementType): ElementType {
  const opposites: Record<ElementType, ElementType> = {
    Fire: 'Water',
    Water: 'Fire',
    Air: 'Earth',
    Earth: 'Air'
  };
  return opposites[element];
}

/**
 * Get complementary element for balance
 */
function getComplementaryElement(element: ElementType): ElementType {
  const complements: Record<ElementType, ElementType> = {
    Fire: 'Air',    // Air feeds fire
    Water: 'Earth', // Earth holds water
    Air: 'Fire',    // Fire rises with air
    Earth: 'Water'  // Water nourishes earth
  };
  return complements[element];
}

/**
 * Get element quality description
 * FIX #1 & #7: Show correct qualities for each element + personal "you might feel" language
 */
function getElementQuality(element: ElementType, excessive: boolean): string {
  const qualities: Record<ElementType, { excess: string; deficit: string }> = {
    Fire: { 
      excess: 'You might feel: restless, impatient, quick to anger, scattered energy', 
      deficit: 'energy, action, courage' 
    },
    Water: { 
      excess: 'You might feel: stuck in thoughts, low energy, avoiding decisions, emotionally heavy', 
      deficit: 'calm, patience, reflection' 
    },
    Air: { 
      excess: 'You might feel: anxious, unfocused, talking more than doing, mentally scattered', 
      deficit: 'clarity, communication, flexibility' 
    },
    Earth: { 
      excess: 'You might feel: stubborn, rigid, stuck in routine, resistant to change', 
      deficit: 'stability, grounding, patience' 
    }
  };
  return excessive ? qualities[element].excess : qualities[element].deficit;
}

/**
 * Quick Fix practices (authentic to Sufi tradition)
 * FIX #3: Severity-based scaling with appropriate durations
 * 
 * Severity Levels:
 * - Severe (0-30): 15-20min intensive practices
 * - Moderate (31-60): 5-10min focused actions
 * - Mild (61-80): 2-3min gentle adjustments
 * - Balanced (81-100): Maintenance message
 */
function getQuickFix(excessiveElement: ElementType, score: number): { action: string; duration: number } {
  // Balanced state - no fix needed
  if (score >= 81) {
    return { 
      action: '✨ You\'re balanced - maintain your current activities throughout the day',
      duration: 0 
    };
  }

  const fixes: Record<ElementType, { severe: string; moderate: string; mild: string }> = {
    Fire: {
      severe: '15min meditation by water + cold compress on forehead', // 15min
      moderate: '5min deep breathing + sip cold water slowly', // 5min
      mild: '2min slow breathing, eyes closed' // 2min
    },
    Water: {
      severe: '15min vigorous exercise (run, dance, pushups) + 5min sun exposure', // 20min
      moderate: '10 jumping jacks, then 5min sunlight exposure', // 5min
      mild: 'Stand and stretch toward sun for 2min' // 2min
    },
    Air: {
      severe: '15min grounding (barefoot walking, gardening, cooking)', // 15min
      moderate: '5min standing barefoot + eat something solid', // 5min
      mild: 'Sit still, feel your weight for 2min' // 2min
    },
    Earth: {
      severe: '15min brisk walk outdoors + deep breathing', // 15min
      moderate: '5min window gazing + 20 deep breaths', // 5min
      mild: 'Open window, take 10 deep breaths' // 2min
    }
  };

  // Determine severity and duration
  if (score <= 30) {
    const durations: Record<ElementType, number> = { Fire: 15, Water: 20, Air: 15, Earth: 15 };
    return { action: fixes[excessiveElement].severe, duration: durations[excessiveElement] };
  } else if (score <= 60) {
    return { action: fixes[excessiveElement].moderate, duration: 5 };
  } else {
    return { action: fixes[excessiveElement].mild, duration: 2 };
  }
}

/**
 * Get element icon component
 */
function getElementIcon(element: ElementType, className: string = 'w-5 h-5') {
  const icons = {
    Fire: Flame,
    Water: Droplet,
    Air: Wind,
    Earth: Mountain
  };
  const Icon = icons[element];
  return <Icon className={className} />;
}

/**
 * Get element emoji
 * FIX #4: Visual element icons for instant recognition
 */
function getElementEmoji(element: ElementType): string {
  const emojis = {
    Fire: '🔥',
    Water: '💧',
    Air: '💨',
    Earth: '�'
  };
  return emojis[element];
}

/**
 * Balance Meter Component
 */
export function BalanceMeter({ userElement, currentDayElement, compact = false }: BalanceMeterProps) {
  const balance = calculateBalance(userElement, currentDayElement);
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showGuide, setShowGuide] = useState(false); // FIX #5: Score guide toggle

  // FIX #2: Use actual fix duration from balance calculation
  const fixDurationSeconds = balance.fixDuration * 60;

  // Start quick fix timer with correct duration
  const startQuickFix = () => {
    if (balance.fixDuration === 0) return; // Don't start timer if balanced
    
    setShowTimer(true);
    setTimeLeft(fixDurationSeconds);
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowTimer(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚖️</span>
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">Balance</span>
          </div>
          <span className={`text-xl font-bold ${getScoreColor(balance.score)}`}>
            {balance.score}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(balance.score)}`}
            style={{ width: `${balance.score}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <h3 className="text-lg font-bold text-white">
              Your Balance Today
            </h3>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold text-white`}>
              {balance.score}
            </div>
            <div className="text-xs text-white/80">/ 100</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Balance Bar */}
        <div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(balance.score)}`}
              style={{ width: `${balance.score}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Conflict</span>
            <span>Moderate</span>
            <span>Harmony</span>
          </div>
        </div>

        {/* Element Status - FIX #4: Add emoji icons */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-xs text-red-700 dark:text-red-300 font-semibold mb-1">Too much:</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{getElementEmoji(balance.dominant)}</span>
              <span className="font-bold text-red-900 dark:text-red-100">{balance.dominant}</span>
            </div>
            <div className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
              {getElementQuality(balance.dominant, true)}
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-xs text-blue-700 dark:text-blue-300 font-semibold mb-1">Need more:</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{getElementEmoji(balance.deficit)}</span>
              <span className="font-bold text-blue-900 dark:text-blue-100">{balance.deficit}</span>
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              {getElementQuality(balance.deficit, false)}
            </div>
          </div>
        </div>

        {/* Quick Fix - FIX #2, #3: Show severity and correct duration */}
        {balance.score < 81 ? (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-xl">💡</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-bold text-amber-900 dark:text-amber-100">Quick Fix</div>
                  {balance.score <= 30 && (
                    <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full font-semibold">
                      Severe Conflict
                    </span>
                  )}
                  {balance.score > 30 && balance.score <= 60 && (
                    <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full font-semibold">
                      Moderate
                    </span>
                  )}
                  {balance.score > 60 && balance.score < 81 && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-semibold">
                      Mild
                    </span>
                  )}
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  {balance.quickFix}
                </p>
              </div>
            </div>

            {!showTimer ? (
              <button
                onClick={startQuickFix}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Timer className="w-4 h-4" />
                Start {balance.fixDuration}-Min Timer
              </button>
            ) : (
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Focus on your practice...
                  </div>
                </div>
                <button
                  onClick={() => setShowTimer(false)}
                  className="w-full px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center justify-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Stop Timer
                </button>
              </div>
            )}

            {/* FIX #6: Recheck timing information */}
            <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
              <div className="space-y-1 text-xs text-amber-700 dark:text-amber-300">
                <div className="flex items-center gap-1">
                  <span>⏱️</span>
                  <span>Recheck balance: 2 hours after completing Quick Fix</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⏰</span>
                  <span>Score updates: Midnight (new planetary day begins)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span>Valid for: Today only - each day brings new elemental balance</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* FIX #3: Balanced state maintenance message */
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-xl">✨</span>
              <div className="flex-1">
                <div className="font-bold text-green-900 dark:text-green-100 mb-1">You're Balanced!</div>
                <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                  {balance.quickFix}
                </p>
              </div>
            </div>
            {/* FIX #6: Recheck timing for balanced state */}
            <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-800">
              <div className="space-y-1 text-xs text-green-700 dark:text-green-300">
                <div className="flex items-center gap-1">
                  <span>⏰</span>
                  <span>Recheck: Tonight before bed (balance shifts with activities)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Why this score:
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {balance.explanation}
          </p>
        </div>

        {/* FIX #5: Score Context Guide - Collapsible */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <span className="text-sm">📊</span>
            <span>What does my score mean?</span>
            <span className="text-xs">{showGuide ? '▼' : '▶'}</span>
          </button>
          
          {showGuide && (
            <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg space-y-2">
              <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-green-600 dark:text-green-400 min-w-[60px]">81-100:</span>
                  <span>Harmonious - Elements working together beautifully</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 min-w-[60px]">61-80:</span>
                  <span>Slight tension - Minor adjustments keep you flowing</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-amber-600 dark:text-amber-400 min-w-[60px]">31-60:</span>
                  <span>Moderate conflict - Focused action brings relief</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-red-600 dark:text-red-400 min-w-[60px]">0-30:</span>
                  <span>Strong opposition - Multiple actions needed for balance</span>
                </div>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                  Classical teaching: Conflict isn't bad - it's growth opportunity. 
                  True harmony comes from consciously balancing opposing forces.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Al-Būnī Attribution */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-500 italic text-center">
            Based on Mīzān (Scale) concept from Imam al-Būnī's ʿIlm al-Ḥurūf tradition
          </p>
        </div>
      </div>
    </div>
  );
}
