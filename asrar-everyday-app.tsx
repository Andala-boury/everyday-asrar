'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, Book, TrendingUp, Moon, Sun, Info, Sparkles, Flame, Droplet, Wind, Mountain, History, Star, GitCompare, Calendar, Trash2, X, Copy, CheckCircle, AlertTriangle, Zap, Compass, Keyboard, Heart } from 'lucide-react';
import { transliterateLatinToArabic } from './src/lib/text-normalize';
import { HadadSummaryPanel } from './src/components/hadad-summary';
import { IlmHurufPanel } from './src/features/ilm-huruf';
import { CompatibilityPanel } from './src/features/compatibility';
import { LETTER_ELEMENTS, digitalRoot as calcDigitalRoot, hadathRemainder as calcHadathRemainder, hadathToElement, nearestSacred } from './src/components/hadad-summary/hadad-core';
import type { AbjadAudit, AuditStep, ElementType, SacredResonance } from './src/components/hadad-summary/types';
import { useAbjad } from './src/contexts/AbjadContext';
import { AbjadSystemSelector } from './src/components/AbjadSystemSelector';
import { ArabicKeyboard } from './src/components/ArabicKeyboard';

// ============================================================================
// DOMAIN RULES & CORE DATA
// ============================================================================

// ABJAD and LETTER_ELEMENTS are now imported from hadad-core
// ElementType is imported from types.ts

const ELEMENT_INFO = {
  Fire: { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Fire 🔥', quality: 'Transformative, Initiating' },
  Water: { icon: Droplet, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Water 💧', quality: 'Flowing, Adaptive' },
  Air: { icon: Wind, color: 'text-cyan-500', bg: 'bg-cyan-500/10', label: 'Air 🌬', quality: 'Intellectual, Communicative' },
  Earth: { icon: Mountain, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Earth 🌍', quality: 'Grounding, Stable' }
};

const SACRED_NUMBERS = [
  { num: 7, significance: 'Seven heavens, seven days of creation' },
  { num: 12, significance: 'Twelve Imams, twelve months' },
  { num: 19, significance: 'Numerical miracle of the Quran' },
  { num: 28, significance: 'Arabic alphabet letters' },
  { num: 40, significance: 'Days of spiritual significance' },
  { num: 70, significance: 'Surah Yā-Sīn (يس)' },
  { num: 99, significance: 'Asmā\' al-Ḥusnā (Beautiful Names)' },
  { num: 114, significance: 'Surahs in the Quran' },
  { num: 313, significance: 'Companions at Badr' },
  { num: 786, significance: 'Bismillah value (short form)' },
  { num: 1001, significance: 'Arabian Nights tales' }
];

const ELEMENT_SUGGESTIONS = {
  Fire: {
    verses: [
      { ref: '94:6', text: 'Indeed, with hardship comes ease', context: 'Patience through transformation' },
      { ref: '21:69', text: 'We said: O fire, be coolness and peace', context: 'Divine protection' },
      { ref: '55:14', text: 'Created man from clay like pottery', context: 'Creation through fire' }
    ],
    names: [
      { arabic: 'يَا فَتَّاح', transliteration: 'Yā Fattāḥ', meaning: 'The Opener', counts: [33, 66, 99] },
      { arabic: 'يَا قَوِيّ', transliteration: 'Yā Qawiyy', meaning: 'The Strong', counts: [11, 33, 111] },
      { arabic: 'يَا لَطِيف', transliteration: 'Yā Laṭīf', meaning: 'The Subtle', counts: [129, 300] }
    ],
    affirmation: 'I embrace transformation with wisdom and patience',
    times: ['Sunrise', 'Noon']
  },
  Water: {
    verses: [
      { ref: '21:30', text: 'We made every living thing from water', context: 'Source of life' },
      { ref: '25:48', text: 'We send the winds as glad tidings', context: 'Purification and renewal' },
      { ref: '67:30', text: 'If your water were to sink away', context: 'Divine provision' }
    ],
    names: [
      { arabic: 'يَا رَحِيم', transliteration: 'Yā Raḥīm', meaning: 'The Merciful', counts: [47, 100, 258] },
      { arabic: 'يَا حَلِيم', transliteration: 'Yā Ḥalīm', meaning: 'The Forbearing', counts: [88, 100] },
      { arabic: 'يَا سَلَام', transliteration: 'Yā Salām', meaning: 'The Source of Peace', counts: [131, 300] }
    ],
    affirmation: 'I flow with grace and adapt with compassion',
    times: ['After sunset', 'Before sleep']
  },
  Air: {
    verses: [
      { ref: '2:164', text: 'The winds that blow, the clouds between sky and earth', context: 'Divine signs' },
      { ref: '15:22', text: 'We send the winds to fertilize', context: 'Communication and connection' },
      { ref: '30:48', text: 'He sends the winds as bearers of good news', context: 'Messages and guidance' }
    ],
    names: [
      { arabic: 'يَا عَلِيم', transliteration: 'Yā ʿAlīm', meaning: 'The All-Knowing', counts: [150, 300] },
      { arabic: 'يَا حَكِيم', transliteration: 'Yā Ḥakīm', meaning: 'The Wise', counts: [78, 100] },
      { arabic: 'يَا خَبِير', transliteration: 'Yā Khabīr', meaning: 'The Aware', counts: [812, 1000] }
    ],
    affirmation: 'I seek knowledge with clarity and share wisdom freely',
    times: ['Dawn', 'Mid-morning']
  },
  Earth: {
    verses: [
      { ref: '55:10', text: 'And the earth He has laid for all beings', context: 'Foundation and sustenance' },
      { ref: '20:53', text: 'Who made the earth a resting place', context: 'Stability and grounding' },
      { ref: '15:19', text: 'The earth We have spread out', context: 'Divine provision' }
    ],
    names: [
      { arabic: 'يَا صَبُور', transliteration: 'Yā Ṣabūr', meaning: 'The Patient', counts: [298, 500] },
      { arabic: 'يَا مَتِين', transliteration: 'Yā Matīn', meaning: 'The Firm', counts: [500, 1000] },
      { arabic: 'يَا قَيُّوم', transliteration: 'Yā Qayyūm', meaning: 'The Sustainer', counts: [156, 300] }
    ],
    affirmation: 'I remain grounded, patient, and steadfast in my path',
    times: ['Afternoon', 'Evening']
  }
};

// ============================================================================
// CALCULATION UTILITIES
// ============================================================================

function normalizeArabic(text: string): string {
  return text
    .replace(/[ًٌٍَُِّْ]/g, '') // Remove diacritics
    .replace(/[أإآ]/g, 'ا') // Unify Alif
    .replace(/ى/g, 'ي') // Unify Ya
    .replace(/ة/g, 'ه') // Ta Marbuta as Ha
    .replace(/\s+/g, ''); // Remove spaces
}

function auditAbjad(text: string, abjadMap: Record<string, number>, elementsMap: Record<string, ElementType>): AbjadAudit {
  const normalized = normalizeArabic(text);
  const steps: AuditStep[] = [...normalized].map(ch => ({
    ch,
    value: abjadMap[ch] || 0,
    element: elementsMap[ch] || 'Earth'
  }));
  
  const total = steps.reduce((sum, step) => sum + step.value, 0);
  
  return {
    original: text,
    normalized,
    steps,
    total
  };
}

// Helper functions for calculations
function abjadSum(text: string, abjadMap: Record<string, number>): number {
  const normalized = text.replace(/[ًٌٍَُِّْ\s]/g, '');
  return [...normalized].reduce((sum, char) => sum + (abjadMap[char] || 0), 0);
}

function digitalRoot(n: number): number {
  return calcDigitalRoot(n);
}

function hadathRemainder(n: number): 0 | 1 | 2 | 3 {
  return calcHadathRemainder(n);
}

function sacredResonance(n: number) {
  const sacred = nearestSacred(n);
  return sacred;
}

// hadathToElement is now imported from hadad-core

function findSacredMatches(kabir: number) {
  return SACRED_NUMBERS
    .filter(s => Math.abs(s.num - kabir) <= s.num * 0.1)
    .map(s => ({
      ...s,
      confidence: s.num === kabir ? 'exact' as const : 'close' as const
    }));
}

// ============================================================================
// COMPONENTS
// ============================================================================

function DisclaimerBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-amber-900 dark:text-amber-100">
            <strong>Educational Tool:</strong> This app explores the traditional Islamic sciences of ʿIlm al-Ḥurūf and ʿIlm al-ʿAdad for cultural and historical reflection. 
            It is not for fortune-telling, medical advice, or religious rulings. Always consult qualified scholars for religious guidance.
          </p>
        </div>
        <button onClick={onDismiss} className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200">
          ×
        </button>
      </div>
    </div>
  );
}

function ElementBadge({ element, count }: { element: ElementType; count: number }) {
  const info = ELEMENT_INFO[element];
  const Icon = info.icon;
  
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${info.bg} border border-current/20`}>
      <Icon className={`w-4 h-4 ${info.color}`} />
      <span className={`font-medium ${info.color}`}>{element}</span>
      <span className="text-sm opacity-70">×{count}</span>
    </div>
  );
}

function ResultCard({ label, value, description }: { label: string; value: string | number; description?: string }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</div>
      <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{value}</div>
      {description && <div className="text-xs text-slate-500 dark:text-slate-400">{description}</div>}
    </div>
  );
}

function AuditPanel({ audit, resonance }: { audit: AbjadAudit; resonance: SacredResonance }) {
  const [copied, setCopied] = useState(false);
  
  const copyJSON = () => {
    const json = JSON.stringify({ audit, resonance }, null, 2);
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Calculation Breakdown
        </h3>
        <button
          onClick={copyJSON}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
          title="Copy as JSON"
        >
          {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'JSON'}
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Letter breakdown */}
        <div>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Letter Values:</div>
          <div className="flex flex-wrap gap-2 font-arabic text-lg" dir="rtl">
            {audit.steps.map((step, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg border ${
                  step.element 
                    ? `${ELEMENT_INFO[step.element as ElementType].bg} ${ELEMENT_INFO[step.element as ElementType].color} border-current/20`
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600'
                }`}
                title={step.element || 'No element'}
              >
                {step.ch}
                <span className="text-xs mx-1">:</span>
                <span className="font-bold">{step.value}</span>
              </div>
            ))}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Total: {audit.steps.map(s => s.value).join(' + ')} = <strong>{audit.total}</strong>
          </div>
        </div>
        
        {/* Signature strip */}
        <div>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Signature Pattern:</div>
          <div className="flex items-center gap-1 flex-wrap">
            {audit.steps.map((step, i) => {
              const reduced = calcDigitalRoot(step.value);
              const element = step.element as ElementType | undefined;
              return (
                <div key={i} className="flex items-center">
                  <span
                    className={`text-sm font-bold ${
                      element ? ELEMENT_INFO[element].color : 'text-slate-400'
                    }`}
                  >
                    {reduced}
                  </span>
                  {i < audit.steps.length - 1 && <span className="text-slate-400 mx-1">-</span>}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Sacred resonance */}
        {resonance && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <div className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Sacred Number Resonance
            </div>
            <div className="space-y-1 text-sm text-amber-800 dark:text-amber-200">
              {resonance.isExact && (
                <div className="font-bold">✨ Exact match: {resonance.nearest}</div>
              )}
              {!resonance.isExact && (
                <div>Nearest sacred: <strong>{resonance.nearest}</strong> (Δ {resonance.delta > 0 ? '+' : ''}{resonance.delta})</div>
              )}
              {resonance.factors.length > 0 && (
                <div>Divisible by: {resonance.factors.join(', ')}</div>
              )}
              {resonance.divisibleBy7 && <div>• Multiple of 7 (heavenly cycle)</div>}
              {resonance.divisibleBy19 && <div>• Multiple of 19 (Quranic miracle)</div>}
              {resonance.divisibleBy99 && <div>• Multiple of 99 (Beautiful Names)</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfidenceMeter({ confidence, warnings }: { confidence: number; warnings: string[] }) {
  const color = confidence >= 80 ? 'green' : confidence >= 60 ? 'yellow' : 'red';
  const colorClasses = {
    green: 'bg-green-500 text-green-900 border-green-200',
    yellow: 'bg-yellow-500 text-yellow-900 border-yellow-200',
    red: 'bg-red-500 text-red-900 border-red-200'
  };
  
  return (
    <div className={`rounded-lg p-3 border ${
      color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
      color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
      'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        {color === 'yellow' || color === 'red' ? (
          <AlertTriangle className={`w-4 h-4 ${color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`} />
        ) : (
          <CheckCircle className="w-4 h-4 text-green-600" />
        )}
        <span className={`text-sm font-medium ${
          color === 'green' ? 'text-green-900 dark:text-green-100' :
          color === 'yellow' ? 'text-yellow-900 dark:text-yellow-100' :
          'text-red-900 dark:text-red-100'
        }`}>
          Transliteration Confidence: {confidence}%
        </span>
      </div>
      
      {confidence < 80 && (
        <div className={`text-xs ${
          color === 'yellow' ? 'text-yellow-800 dark:text-yellow-200' : 'text-red-800 dark:text-red-200'
        }`}>
          {warnings.length > 0 ? (
            <div>
              {warnings.map((w, i) => (
                <div key={i}>• {w}</div>
              ))}
            </div>
          ) : (
            <div>Please verify the Arabic spelling before calculating.</div>
          )}
        </div>
      )}
    </div>
  );
}

function TaMarbutaToggle({ value, onChange }: { value: 'ه' | 'ة'; onChange: (v: 'ه' | 'ة') => void }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <label className="text-slate-600 dark:text-slate-400">Tāʾ Marbūṭa:</label>
      <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
        <button
          onClick={() => onChange('ه')}
          className={`px-3 py-1 rounded transition-colors ${
            value === 'ه'
              ? 'bg-white dark:bg-slate-600 shadow-sm'
              : 'hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
          title="Maghrib practice (default)"
        >
          <span className="font-arabic text-lg">ه</span>
        </button>
        <button
          onClick={() => onChange('ة')}
          className={`px-3 py-1 rounded transition-colors ${
            value === 'ة'
              ? 'bg-white dark:bg-slate-600 shadow-sm'
              : 'hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
          title="Mashreq practice"
        >
          <span className="font-arabic text-lg">ة</span>
        </button>
      </div>
      <div 
        title="Choose how tāʾ marbūṭa is counted: ه (hāʾ=5, Maghrib) or ة (tāʾ=400, Mashreq)"
        className="flex items-center"
      >
        <Info className="w-4 h-4 text-slate-400 cursor-help" />
      </div>
    </div>
  );
}

function SuggestionSection({ element }: { element: ElementType }) {
  const suggestions = ELEMENT_SUGGESTIONS[element];
  const info = ELEMENT_INFO[element];
  
  return (
    <div className="space-y-6">
      <div className={`rounded-xl p-6 ${info.bg} border border-current/20`}>
        <h3 className={`text-xl font-bold ${info.color} mb-2 flex items-center gap-2`}>
          <info.icon className="w-6 h-6" />
          {info.label} Element Guidance
        </h3>
        <p className="text-sm opacity-80 mb-4">{info.quality}</p>
        <p className="italic text-lg">&ldquo;{suggestions.affirmation}&rdquo;</p>
        <p className="text-xs mt-2 opacity-60">Optimal reflection times: {suggestions.times.join(', ')}</p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">Related Quranic Verses</h4>
        <div className="space-y-3">
          {suggestions.verses.map((verse, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{verse.ref}</div>
              <div className="text-sm mb-1">{verse.text}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{verse.context}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">Asmā' al-Ḥusnā (Beautiful Names)</h4>
        <div className="space-y-3">
          {suggestions.names.map((name, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-lg font-arabic" dir="rtl">{name.arabic}</span>
                <span className="text-xs text-slate-500">{name.transliteration}</span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">{name.meaning}</div>
              <div className="text-xs text-slate-500">Suggested counts: {name.counts.join(', ')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STORAGE & HISTORY
// ============================================================================

interface HistoryItem {
  id: string;
  timestamp: number;
  display: string;
  arabic: string;
  kabir: number;
  saghir: number;
  hadathElement: ElementType;
  dominant: ElementType;
  isFavorite?: boolean;
}

function loadHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('asrar-history');
  return stored ? JSON.parse(stored) : [];
}

function saveHistory(history: HistoryItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('asrar-history', JSON.stringify(history));
}

function getDailyReflection() {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  
  const allVerses = Object.values(ELEMENT_SUGGESTIONS).flatMap(s => s.verses);
  const allNames = Object.values(ELEMENT_SUGGESTIONS).flatMap(s => s.names);
  
  const verseIndex = dayOfYear % allVerses.length;
  const nameIndex = dayOfYear % allNames.length;
  
  return {
    verse: allVerses[verseIndex],
    name: allNames[nameIndex],
    date: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  };
}

// ============================================================================
// NEW COMPONENTS
// ============================================================================

function HistoryPanel({ 
  history, 
  onSelect, 
  onDelete, 
  onToggleFavorite, 
  onClear 
}: { 
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onClear: () => void;
}) {
  const favorites = history.filter(h => h.isFavorite);
  const recent = history.filter(h => !h.isFavorite).slice(0, 10);
  
  const HistoryCard = ({ item }: { item: HistoryItem }) => (
    <div 
      className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all cursor-pointer group"
      onClick={() => onSelect(item)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="font-medium text-slate-900 dark:text-slate-100" dir="rtl">{item.arabic}</div>
          {item.display !== item.arabic && (
            <div className="text-sm text-slate-600 dark:text-slate-400">{item.display}</div>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
            className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${item.isFavorite ? 'text-yellow-500' : 'text-slate-400'}`}
          >
            <Star className="w-4 h-4" fill={item.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex gap-2 text-xs">
        <span className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">Kabīr: {item.kabir}</span>
        <span className={`px-2 py-1 rounded ${ELEMENT_INFO[item.dominant].bg} ${ELEMENT_INFO[item.dominant].color}`}>
          {item.dominant}
        </span>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-4">
      {favorites.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              Favorites
            </h3>
          </div>
          <div className="space-y-2">
            {favorites.map(item => <HistoryCard key={item.id} item={item} />)}
          </div>
        </div>
      )}
      
      {recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Recent Calculations</h3>
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="space-y-2">
            {recent.map(item => <HistoryCard key={item.id} item={item} />)}
          </div>
        </div>
      )}
      
      {history.length === 0 && (
        <div className="text-center text-slate-500 dark:text-slate-400 py-8">
          <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No calculations yet</p>
        </div>
      )}
    </div>
  );
}

function ComparisonMode({ onClose, abjad, analyzeElements }: { 
  onClose: () => void;
  abjad: Record<string, number>;
  analyzeElements: (text: string) => any;
}) {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [comparison, setComparison] = useState<any>(null);
  
  const compare = () => {
    if (!input1.trim() || !input2.trim()) return;
    
    const calc1 = {
      display: name1 || input1,
      arabic: input1,
      kabir: abjadSum(input1, abjad),
      saghir: digitalRoot(abjadSum(input1, abjad)),
      hadathElement: hadathToElement(hadathRemainder(abjadSum(input1, abjad))),
      ...analyzeElements(input1)
    };
    
    const calc2 = {
      display: name2 || input2,
      arabic: input2,
      kabir: abjadSum(input2, abjad),
      saghir: digitalRoot(abjadSum(input2, abjad)),
      hadathElement: hadathToElement(hadathRemainder(abjadSum(input2, abjad))),
      ...analyzeElements(input2)
    };
    
    // Calculate compatibility score
    const elementMatch = calc1.dominant === calc2.dominant ? 30 : 
                        (calc1.dominant === calc2.secondary || calc1.secondary === calc2.dominant) ? 15 : 0;
    const numberHarmony = Math.abs(calc1.saghir - calc2.saghir) <= 2 ? 20 : 10;
    const kabirDiff = Math.abs(calc1.kabir - calc2.kabir);
    const kabirHarmony = kabirDiff < 50 ? 20 : kabirDiff < 100 ? 10 : 5;
    const hadathMatch = calc1.hadathElement === calc2.hadathElement ? 30 : 15;
    
    const compatibility = elementMatch + numberHarmony + kabirHarmony + hadathMatch;
    
    setComparison({ calc1, calc2, compatibility });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GitCompare className="w-5 h-5" />
            Comparison Mode
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">First Name/Text</h3>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                placeholder="Display name (optional)"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                placeholder="Arabic text"
                dir="rtl"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-arabic"
              />
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Second Name/Text</h3>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder="Display name (optional)"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                placeholder="Arabic text"
                dir="rtl"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-arabic"
              />
            </div>
          </div>
          
          <button
            onClick={compare}
            disabled={!input1.trim() || !input2.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Compare
          </button>
          
          {/* Results */}
          {comparison && (
            <div className="space-y-6">
              {/* Compatibility Score */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <h3 className="text-xl font-bold mb-2 text-purple-900 dark:text-purple-100">Elemental Harmony</h3>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-purple-600 dark:text-purple-400">{comparison.compatibility}%</div>
                  <div className="flex-1">
                    <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                        style={{ width: `${comparison.compatibility}%` }}
                      />
                    </div>
                    <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">
                      {comparison.compatibility >= 75 ? 'Strong harmony and resonance' :
                       comparison.compatibility >= 50 ? 'Moderate compatibility' :
                       'Complementary differences'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Side by Side Comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                {[comparison.calc1, comparison.calc2].map((calc, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-lg mb-3" dir="rtl">{calc.arabic}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Kabīr:</span>
                        <span className="font-semibold">{calc.kabir}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Ṣaghīr:</span>
                        <span className="font-semibold">{calc.saghir}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Element:</span>
                        <span className={`font-semibold ${ELEMENT_INFO[calc.dominant as ElementType].color}`}>{calc.dominant}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {Object.entries(calc.counts)
                          .filter(([_, count]) => (count as number) > 0)
                          .map(([element, count]) => (
                            <span key={element} className={`text-xs px-2 py-1 rounded ${ELEMENT_INFO[element as ElementType].bg}`}>
                              {element}: {count as number}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Shared Elements */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Analysis</h4>
                <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Dominant elements: {comparison.calc1.dominant} ↔ {comparison.calc2.dominant}</li>
                  <li>• Numerical difference: {Math.abs(comparison.calc1.kabir - comparison.calc2.kabir)}</li>
                  <li>• Digital root harmony: {Math.abs(comparison.calc1.saghir - comparison.calc2.saghir)} apart</li>
                  <li>• Hadath elements: {comparison.calc1.hadathElement} ↔ {comparison.calc2.hadathElement}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DailyReflectionCard() {
  const daily = getDailyReflection();
  
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
      <div className="flex items-start gap-3 mb-4">
        <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-1">Daily Reflection</h3>
          <p className="text-xs text-indigo-600 dark:text-indigo-400">{daily.date}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">Verse of the Day</div>
          <div className="text-sm font-medium mb-1">{daily.verse.text}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Quran {daily.verse.ref} • {daily.verse.context}</div>
        </div>
        
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">Divine Name for Reflection</div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xl font-arabic" dir="rtl">{daily.name.arabic}</span>
            <span className="text-xs text-slate-500">{daily.name.transliteration}</span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">{daily.name.meaning}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

export default function AsrarEveryday() {
  const { abjad } = useAbjad(); // Get the current Abjad system
  const [darkMode, setDarkMode] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [viewMode, setViewMode] = useState<'calculator' | 'guidance'>('calculator');
  const [arabicInput, setArabicInput] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [latinInput, setLatinInput] = useState('');
  const [taMarbutaAs, setTaMarbutaAs] = useState<'ه' | 'ة'>('ه');
  const [translitResult, setTranslitResult] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showCompatibility, setShowCompatibility] = useState(false);
  
  // Helper function for element analysis
  const analyzeElements = (text: string) => {
    const audit = auditAbjad(text, abjad, LETTER_ELEMENTS);
    const counts: Record<ElementType, number> = { Fire: 0, Water: 0, Air: 0, Earth: 0 };
    const values: Record<ElementType, number> = { Fire: 0, Water: 0, Air: 0, Earth: 0 };
    
    audit.steps.forEach(step => {
      const element = step.element as ElementType | undefined;
      if (element) {
        counts[element]++;
        values[element] += step.value;
      }
    });
    
    const entries = Object.entries(counts) as [ElementType, number][];
    const dominant = entries.reduce((a, b) => b[1] > a[1] ? b : a)[0];
    const secondary = entries.filter(([el]) => el !== dominant).reduce((a, b) => b[1] > a[1] ? b : a)[0];
    
    return { counts, values, dominant, secondary, audit };
  };
  
  useEffect(() => {
    setHistory(loadHistory());
  }, []);
  
  const handleLatinInput = (value: string) => {
    setLatinInput(value);
    if (value.trim()) {
      const result = transliterateLatinToArabic(value, { taMarbutaAs });
      setTranslitResult(result);
      setArabicInput(result.primary);
      setDisplayName(value);
    } else {
      setTranslitResult(null);
      setArabicInput('');
      setDisplayName('');
    }
  };
  
  const handleTaMarbutaChange = (newValue: 'ه' | 'ة') => {
    setTaMarbutaAs(newValue);
    // Retransliterate if Latin input exists
    if (latinInput.trim()) {
      const result = transliterateLatinToArabic(latinInput, { taMarbutaAs: newValue });
      setTranslitResult(result);
      setArabicInput(result.primary);
    }
    // Recalculate if result exists
    if (result && arabicInput) {
      calculate();
    }
  };

  const handleKeyboardPress = (char: string) => {
    if (char === '⌫') {
      // Backspace
      setArabicInput(arabicInput.slice(0, -1));
      setLatinInput(''); // Clear latin when typing Arabic
    } else if (char === '⎵') {
      // Space
      setArabicInput(arabicInput + ' ');
    } else {
      // Regular character
      setArabicInput(arabicInput + char);
      setLatinInput(''); // Clear latin when typing Arabic
    }
  };
  
  const calculate = () => {
    if (!arabicInput.trim()) return;
    
    const audit = auditAbjad(arabicInput, abjad, LETTER_ELEMENTS);
    const kabir = audit.total;
    const saghir = calcDigitalRoot(kabir);
    const hadath = calcHadathRemainder(kabir);
    const hadathElement = hadathToElement(hadath);
    const elementAnalysis = analyzeElements(arabicInput);
    const sacredMatches = findSacredMatches(kabir);
    const resonance = sacredResonance(kabir);
    
    const newResult = {
      display: displayName || arabicInput,
      arabic: arabicInput,
      kabir,
      saghir,
      hadath,
      hadathElement,
      ...elementAnalysis,
      sacredMatches,
      resonance
    };
    
    setResult(newResult);
    
    // Add to history
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      display: newResult.display,
      arabic: newResult.arabic,
      kabir: newResult.kabir,
      saghir: newResult.saghir,
      hadathElement: newResult.hadathElement,
      dominant: newResult.dominant,
      isFavorite: false
    };
    
    const newHistory = [historyItem, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    saveHistory(newHistory);
  };
  
  const handleHistorySelect = (item: HistoryItem) => {
    setArabicInput(item.arabic);
    setDisplayName(item.display !== item.arabic ? item.display : '');
    setShowHistory(false);
    // Trigger calculation
    setTimeout(calculate, 100);
  };
  
  const handleDeleteHistory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    saveHistory(newHistory);
  };
  
  const handleToggleFavorite = (id: string) => {
    const newHistory = history.map(h => 
      h.id === id ? { ...h, isFavorite: !h.isFavorite } : h
    );
    setHistory(newHistory);
    saveHistory(newHistory);
  };
  
  const handleClearHistory = () => {
    if (confirm('Clear all history? This cannot be undone.')) {
      setHistory([]);
      saveHistory([]);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };
  
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Asrār Everyday</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">ʿIlm al-Ḥurūf & ʿIlm al-ʿAdad Explorer</p>
              </div>
            </div>
            
            {/* Compact Abjad System Selector */}
            <div className="flex-shrink-0">
              <AbjadSystemSelector compact={true} />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCompatibility(true)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Relationship Compatibility"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowComparison(true)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Compare two names"
              >
                <GitCompare className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative"
                title="View history"
              >
                <History className="w-5 h-5" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                    {history.length > 9 ? '9+' : history.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {showDisclaimer && <DisclaimerBanner onDismiss={() => setShowDisclaimer(false)} />}
          
          {/* View Mode Tabs */}
          <div className="mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 inline-flex gap-2">
              <button
                onClick={() => setViewMode('calculator')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  viewMode === 'calculator'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Calculator className="w-5 h-5 inline mr-2" />
                Letter Calculator
              </button>
              <button
                onClick={() => setViewMode('guidance')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  viewMode === 'guidance'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Compass className="w-5 h-5 inline mr-2" />
                Life Guidance (Al-Būnī)
              </button>
            </div>
          </div>
          
          {viewMode === 'guidance' ? (
            <IlmHurufPanel />
          ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Input Section */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Calculate Letter Values
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Latin Text (English/French)
                  </label>
                  <TaMarbutaToggle value={taMarbutaAs} onChange={handleTaMarbutaChange} />
                </div>
                <input
                  type="text"
                  value={latinInput}
                  onChange={(e) => handleLatinInput(e.target.value)}
                  placeholder="e.g., Rahim, Musa, Latif, Allah"
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Auto-transliterates to Arabic • Supports EN/FR names
                </p>
                {translitResult && translitResult.confidence < 100 && (
                  <div className="mt-2">
                    <ConfidenceMeter 
                      confidence={translitResult.confidence} 
                      warnings={translitResult.warnings} 
                    />
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Arabic Text <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      showKeyboard
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Keyboard className="w-4 h-4" />
                    {showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
                  </button>
                </div>
                <input
                  type="text"
                  value={arabicInput}
                  onChange={(e) => {
                    setArabicInput(e.target.value);
                    setLatinInput(''); // Clear latin if user types Arabic directly
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="باكا"
                  dir="rtl"
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all text-2xl font-arabic"
                  style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
                />
                {showKeyboard && (
                  <div className="mt-3">
                    <ArabicKeyboard 
                      onKeyPress={handleKeyboardPress}
                      onClose={() => setShowKeyboard(false)}
                    />
                  </div>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Examples: يس (70), بسم الله (786), باكا (108)
                </p>
                {translitResult && translitResult.candidates.length > 1 && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-2">Alternative spellings:</p>
                    <div className="flex flex-wrap gap-2">
                      {translitResult.candidates.slice(0, 5).map((alt: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setArabicInput(alt)}
                          className="px-3 py-1 bg-white dark:bg-slate-800 rounded border border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-sm font-arabic"
                          dir="rtl"
                        >
                          {alt}
                        </button>
                      ))}
                    </div>
                    {translitResult.warnings.length > 0 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        ℹ️ {translitResult.warnings[0]}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <button
                onClick={calculate}
                disabled={!arabicInput.trim()}
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Calculate
              </button>
            </div>
          </div>
          
          {/* Results */}
          {result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Hadad Summary Panel - Comprehensive Analysis */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                  Complete Ḥadad Analysis for <span className="text-indigo-600 dark:text-indigo-400 font-arabic" dir="rtl">{result.arabic}</span>
                </h2>
                
                <HadadSummaryPanel
                  audit={result.audit}
                  taMarbutaMode={taMarbutaAs}
                  showGrid={true}
                  showResonance={true}
                  onCopyJson={(payload) => {
                    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                    alert('✅ Analysis copied to clipboard!');
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Welcome Message */}
          {!result && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Welcome to Asrār Everyday</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
                Explore the rich tradition of ʿIlm al-Ḥurūf (Science of Letters) and ʿIlm al-ʿAdad (Science of Numbers) through an intuitive, educational interface. 
                Enter Arabic text above to discover numerical values, elemental associations, and traditional guidance.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {Object.entries(ELEMENT_INFO).map(([element, info]) => {
                  const Icon = info.icon;
                  return (
                    <div key={element} className={`p-4 rounded-lg ${info.bg} border border-current/20`}>
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${info.color}`} />
                      <div className={`font-medium text-sm ${info.color}`}>{element}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
            </div>
            
            {/* Sidebar - History */}
            {showHistory && (
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <History className="w-5 h-5" />
                    History
                  </h2>
                  <HistoryPanel
                    history={history}
                    onSelect={handleHistorySelect}
                    onDelete={handleDeleteHistory}
                    onToggleFavorite={handleToggleFavorite}
                    onClear={handleClearHistory}
                  />
                </div>
              </div>
            )}
          </div>
          )}
        </main>
        
        {/* Modals */}
        {showComparison && <ComparisonMode onClose={() => setShowComparison(false)} abjad={abjad} analyzeElements={analyzeElements} />}
        
        {showCompatibility && (
          <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
            <CompatibilityPanel onBack={() => setShowCompatibility(false)} />
          </div>
        )}
        
        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
            <p className="mb-2">Built with Next.js, TypeScript, and Tailwind CSS</p>
            <p>For educational and cultural exploration only • Always consult qualified scholars for religious guidance</p>
          </div>
        </footer>
      </div>
    </div>
  );
}