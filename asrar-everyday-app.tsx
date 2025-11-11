'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, Book, TrendingUp, Moon, Sun, Info, Sparkles, Flame, Droplet, Wind, Mountain, History, Star, GitCompare, Calendar, Trash2, X, Copy, CheckCircle, AlertTriangle, Zap, Compass, Keyboard, Heart, ChevronUp, ChevronDown, HelpCircle, Menu, Lightbulb, Waves } from 'lucide-react';
import { transliterateLatinToArabic } from './src/lib/text-normalize';
import { HadadSummaryPanel } from './src/components/hadad-summary';
import { IlmHurufPanel } from './src/features/ilm-huruf';
import { CompatibilityPanel } from './src/features/compatibility';
import { OnboardingTutorial } from './src/components/OnboardingTutorial';
import { MobileMenu } from './src/components/MobileMenu';
import LanguageToggle from './src/components/LanguageToggle';
import { useLanguage } from './src/contexts/LanguageContext';
import { LETTER_ELEMENTS, digitalRoot as calcDigitalRoot, hadathRemainder as calcHadathRemainder, hadathToElement, nearestSacred, ELEMENT_INFO as HADAD_ELEMENT_INFO } from './src/components/hadad-summary/hadad-core';
import type { AbjadAudit, AuditStep, ElementType, SacredResonance } from './src/components/hadad-summary/types';
import { useAbjad } from './src/contexts/AbjadContext';
import { AbjadSystemSelector } from './src/components/AbjadSystemSelector';
import { ArabicKeyboard } from './src/components/ArabicKeyboard';

// ============================================================================
// DOMAIN RULES & CORE DATA
// ============================================================================

// ABJAD and LETTER_ELEMENTS are now imported from hadad-core
// ElementType is imported from types.ts

// Arabic planet names for display
const ARABIC_PLANET_NAMES: Record<string, string> = {
  'Mars': 'المريخ',      // al-Mirrīkh
  'Moon': 'القمر',       // al-Qamar
  'Mercury': 'عطارد',    // ʿUṭārid
  'Saturn': 'زحل'        // Zuḥal
};

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
// CELESTIAL CORRESPONDENCE MAPPING
// Based on Al-Buni's Shams al-Ma'arif and classical Ilm al-Huruf
// ============================================================================

// ============================================================================
// COMPONENTS
// ============================================================================

function DisclaimerBanner({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-amber-900 dark:text-amber-100">
            <strong>{t.disclaimer.title}</strong> {t.disclaimer.message}
          </p>
        </div>
        <button onClick={onDismiss} className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200">
          ×
        </button>
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
  const { t } = useLanguage();
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
        <p className="text-xs mt-2 opacity-60">{t.dailyReflection.optimalReflectionTimes}: {suggestions.times.join(', ')}</p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">{t.guidance.relatedQuranicVerses}</h4>
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
        <h4 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">{t.guidance.divineNames}</h4>
        <div className="space-y-3">
          {suggestions.names.map((name, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-lg font-arabic" dir="rtl">{name.arabic}</span>
                <span className="text-xs text-slate-500">{name.transliteration}</span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">{name.meaning}</div>
              <div className="text-xs text-slate-500">{t.dailyReflection.suggestedCounts}: {name.counts.join(', ')}</div>
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
  const { t } = useLanguage();
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
              {t.history.favorites}
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
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.history.recentCalculations}</h3>
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400"
              >
                {t.history.clearAll}
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
          <p className="text-sm">{t.history.noCalculationsYet}</p>
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
  const { t } = useLanguage();
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
            {t.comparison.title}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.comparison.firstName}</h3>
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
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.comparison.secondName}</h3>
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
                <h3 className="text-xl font-bold mb-2 text-purple-900 dark:text-purple-100">{t.comparison.elementalHarmony}</h3>
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

function DailyReflectionCard({ isCollapsed, onToggleCollapse }: { isCollapsed: boolean; onToggleCollapse: () => void }) {
  const { t } = useLanguage();
  const daily = getDailyReflection();
  
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 overflow-hidden transition-all duration-300">
      {/* Header - Always Visible */}
      <div className="p-6 cursor-pointer hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-colors" onClick={onToggleCollapse}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* Pulse Animation Badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-400 rounded-full opacity-75 animate-pulse" style={{width: '24px', height: '24px'}}></div>
              <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400 relative z-10" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">{t.dailyReflection.todaysReflection}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white animate-pulse">
                  {t.dailyReflection.dailyBadge}
                </span>
              </div>
              {!isCollapsed && (
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">{daily.date}</p>
              )}
            </div>
          </div>
          
          {/* Collapse Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse();
            }}
            className="p-2 hover:bg-indigo-200/50 dark:hover:bg-indigo-900/50 rounded-lg transition-colors flex-shrink-0 ml-2"
            aria-label={isCollapsed ? t.dailyReflection.expandReflection : t.dailyReflection.collapseReflection}
          >
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <ChevronUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            )}
          </button>
        </div>
      </div>
      
      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="px-6 pb-6 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
            <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">{t.dailyReflection.verseOfTheDay}</div>
            <div className="text-sm font-medium mb-1">{daily.verse.text}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Quran {daily.verse.ref} • {daily.verse.context}</div>
          </div>
          
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
            <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">{t.dailyReflection.divineNameForReflection}</div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xl font-arabic" dir="rtl">{daily.name.arabic}</span>
              <span className="text-xs text-slate-500">{daily.name.transliteration}</span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{daily.name.meaning}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

export default function AsrarEveryday() {
  const { abjad } = useAbjad(); // Get the current Abjad system
  const { t } = useLanguage(); // Get translations
  
  // Add mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  const [darkMode, setDarkMode] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [viewMode, setViewMode] = useState<'calculator' | 'guidance' | 'advanced'>('guidance');
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
  
  // Daily Reflection State - initialize to true (collapsed by default), set from localStorage in useEffect
  const [isDailyReflectionCollapsed, setIsDailyReflectionCollapsed] = useState(true);
  
  // Set mounted on client side only
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Load daily reflection preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dailyReflectionCollapsed');
      if (stored) {
        setIsDailyReflectionCollapsed(JSON.parse(stored));
      }
    }
  }, []);
  
  // Handle daily reflection collapse with localStorage
  const handleToggleDailyReflection = () => {
    setIsDailyReflectionCollapsed((prev: boolean) => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dailyReflectionCollapsed', JSON.stringify(newValue));
      }
      return newValue;
    });
  };

  // Onboarding Tutorial State
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Mobile Menu State
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Initialize onboarding on mount and ensure menu is closed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Ensure mobile menu starts closed
      setShowMobileMenu(false);
      
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        // Small delay for smoother UX
        const timer = setTimeout(() => setShowOnboarding(true), 500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Handle ESC key to close mobile menu and lock body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMobileMenu(false);
      }
    };

    // Lock body scroll when menu is open
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
      return () => {
        window.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showMobileMenu]);
  
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
  
  // Prevent hydration mismatch by showing loading state until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-4 animate-pulse" />
          <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">Loading Asrār...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
            {/* Mobile Header (< 768px) */}
            <div className="flex md:hidden items-center justify-between">
              {/* Logo & Title */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">Asrār</h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">ʿIlm al-Ḥurūf</p>
                </div>
              </div>

              {/* Mobile Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Language Toggle - hidden on very small screens */}
                <div className="hidden xs:block">
                  <LanguageToggle />
                </div>

                {/* History Button */}
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors relative"
                  title="View history"
                >
                  <History className="w-5 h-5" />
                  {history.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {history.length > 9 ? '9+' : history.length}
                    </span>
                  )}
                </button>

                {/* Hamburger Menu */}
                <button
                  onClick={() => setShowMobileMenu(true)}
                  className="flex md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tablet+ Header (>= 768px) */}
            <div className="hidden md:flex items-center justify-between">
              {/* Logo & Title */}
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Asrār Everyday</h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400">ʿIlm al-Ḥurūf & ʿIlm al-ʿAdad Explorer</p>
                </div>
              </div>

              {/* Abjad System Selector */}
              <div className="flex-shrink-0">
                <AbjadSystemSelector compact={true} />
              </div>

              {/* Desktop Controls */}
              <div className="flex items-center gap-2">
                {/* Help Button */}
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors hidden lg:flex"
                  title="Help & Tutorial"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>

                {/* Compatibility Button */}
                <button
                  onClick={() => setShowCompatibility(true)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors hidden lg:flex"
                  title="Relationship Compatibility"
                >
                  <Heart className="w-5 h-5" />
                </button>

                {/* Comparison Button */}
                <button
                  onClick={() => setShowComparison(true)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors hidden lg:flex"
                  title="Compare two names"
                >
                  <GitCompare className="w-5 h-5" />
                </button>

                {/* History Button */}
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative"
                  title="View history"
                >
                  <History className="w-5 h-5" />
                  {history.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {history.length > 9 ? '9+' : history.length}
                    </span>
                  )}
                </button>

                {/* Language Toggle */}
                <LanguageToggle />
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="w-full mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="max-w-6xl mx-auto">
            {showDisclaimer && <DisclaimerBanner onDismiss={() => setShowDisclaimer(false)} />}
            
            {/* Daily Reflection - Prominent Banner */}
            <div className="mb-6 sm:mb-8">
              <DailyReflectionCard 
                isCollapsed={isDailyReflectionCollapsed}
              onToggleCollapse={handleToggleDailyReflection}
            />
          </div>
          
          {/* View Mode Tabs - Mobile Responsive */}
          <div className="mb-6 sm:mb-8 overflow-x-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 inline-flex gap-2 min-w-full sm:min-w-0">
              <button
                onClick={() => setViewMode('calculator')}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                  viewMode === 'calculator'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Calculator className="w-4 sm:w-5 h-4 sm:h-5 inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t.calculator.title}</span>
                <span className="sm:hidden">{t.common.calculate}</span>
              </button>
              <button
                onClick={() => setViewMode('guidance')}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                  viewMode === 'guidance'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Compass className="w-4 sm:w-5 h-4 sm:h-5 inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t.nav.guidance}</span>
                <span className="sm:hidden">{t.nav.guidance}</span>
              </button>
              <button
                onClick={() => setViewMode('advanced')}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                  viewMode === 'advanced'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Compass className="w-4 sm:w-5 h-4 sm:h-5 inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t.nav.advanced}</span>
                <span className="sm:hidden">{t.nav.advanced}</span>
              </button>
            </div>
          </div>
          
          {viewMode === 'guidance' ? (
            <IlmHurufPanel />
          ) : viewMode === 'advanced' ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <p className="text-slate-600 dark:text-slate-400 text-center py-12">
                Advanced features coming soon...
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content Area - Mobile Full Width, Desktop 2/3 */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Input Section - Mobile Optimized */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 flex-shrink-0" />
              <span>{t.calculator.calculateLetterValues}</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.calculator.latinText}
                  </label>
                  <TaMarbutaToggle value={taMarbutaAs} onChange={handleTaMarbutaChange} />
                </div>
                <input
                  type="text"
                  value={latinInput}
                  onChange={(e) => handleLatinInput(e.target.value)}
                  placeholder="e.g., Rahim, Musa, Latif"
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t.calculator.autoTransliterates}
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.calculator.arabicText} <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      showKeyboard
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Keyboard className="w-4 h-4" />
                    <span className="hidden sm:inline">{showKeyboard ? t.calculator.hideKeyboard : t.calculator.showKeyboard}</span>
                    <span className="sm:hidden">{showKeyboard ? '✕' : '⌨'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={arabicInput}
                  onChange={(e) => {
                    setArabicInput(e.target.value);
                    setLatinInput('');
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="باكا"
                  dir="rtl"
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all text-2xl sm:text-3xl font-arabic"
                  style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
                />
                {showKeyboard && (
                  <div className="mt-3 overflow-x-auto">
                    <ArabicKeyboard 
                      onKeyPress={handleKeyboardPress}
                      onClose={() => setShowKeyboard(false)}
                    />
                  </div>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t.calculator.examples}: يس (70), بسم الله (786), باكا (108)
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
                className="w-full py-3 px-4 sm:px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-base sm:text-lg min-h-[44px]"
              >
                <Sparkles className="w-5 h-5" />
                {t.calculator.calculateButton}
              </button>
            </div>
          </div>
          
          {/* Results - Mobile Responsive with Educational Interface */}
          {result && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* 1. Educational Context Banner */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-4 sm:p-6 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-start gap-3 mb-4">
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-1">{t.calculator.whatYouLearn}</h3>
                    <p className="text-sm text-indigo-800 dark:text-indigo-200">{t.calculator.discoverSignificance}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white dark:bg-slate-800/50 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700">
                    <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">🔢 {t.calculator.numericalValues}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{t.calculator.numericalValuesDesc}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700">
                    <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">🌊 {t.calculator.elementalForces}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{t.calculator.elementalForcesDesc}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700">
                    <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">✨ {t.calculator.hiddenPatterns}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{t.calculator.hiddenPatternsDesc}</p>
                  </div>
                </div>
              </div>

              {/* 2. Enhanced Key Metrics Cards with Tooltips */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  {t.calculator.keyMetrics}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Kabīr Card */}
                  <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-xl p-4 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 cursor-help">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">{t.calculator.kabir.label}</span>
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">{result.kabir}</div>
                    <p className="text-xs text-blue-700 dark:text-blue-300">{t.calculator.totalOfAllLetterValues}</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-lg px-3 py-2 whitespace-nowrap font-medium">
                      {t.calculator.kabir.description}
                    </div>
                  </div>

                  {/* Ṣaghīr Card */}
                  <div className="group relative bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/40 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300 cursor-help">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">{t.calculator.saghir.label}</span>
                      <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-1">{result.saghir}</div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">{t.calculator.digitalRoot}</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-lg px-3 py-2 whitespace-nowrap font-medium">
                      {t.calculator.saghir.description}
                    </div>
                  </div>

                  {/* Ḥadath Card */}
                  <div className="group relative bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/40 rounded-xl p-4 border border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300 cursor-help">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">{t.calculator.hadath.label}</span>
                      <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-1">{result.hadath}</div>
                    <p className="text-xs text-amber-700 dark:text-amber-300">{t.calculator.remainderMod4}</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-lg px-3 py-2 whitespace-nowrap font-medium">
                      {t.calculator.hadath.description}
                    </div>
                  </div>

                  {/* Rūḥ Ḥadad Card */}
                  <div className="group relative bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-900/40 rounded-xl p-4 border border-rose-200 dark:border-rose-800 hover:shadow-lg transition-all duration-300 cursor-help">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wide">{t.calculator.ruh.label}</span>
                      <Info className="w-4 h-4 text-rose-600 dark:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-2xl font-bold text-rose-900 dark:text-rose-100 mb-1">{ELEMENT_INFO[result.hadathElement as ElementType].label}</div>
                    <p className="text-xs text-rose-700 dark:text-rose-300">{t.calculator.spiritOfTheCycle}</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-lg px-3 py-2 whitespace-nowrap font-medium">
                      {t.calculator.ruh.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Visual Calculation Breakdown */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  {t.calculator.stepByStep}
                </h3>
                <div className="space-y-4">
                  {/* Step 1: Letter Values */}
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm flex-shrink-0">1</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{t.guidance.letterValues}</p>
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-sm font-arabic" dir="rtl">
                        <div className="flex flex-wrap gap-2">
                          {result.audit.steps.slice(0, 10).map((step: any, i: number) => (
                            <span key={i} className={`px-2 py-1 rounded ${ELEMENT_INFO[step.element as ElementType]?.bg || 'bg-slate-200 dark:bg-slate-700'}`}>
                              {step.letter}: {step.value}
                            </span>
                          ))}
                          {result.audit.steps.length > 10 && <span className="text-slate-500">+{result.audit.steps.length - 10} more</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Sum */}
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm flex-shrink-0">2</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{t.guidance.sumAllValues}</p>
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-sm">
                        <p className="text-slate-600 dark:text-slate-400">{t.calculator.totalAbjadValue}: <span className="font-bold text-slate-900 dark:text-slate-100">{result.kabir}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Digital Root */}
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm flex-shrink-0">3</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{t.guidance.calculateDigitalRoot}</p>
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-sm">
                        <p className="text-slate-600 dark:text-slate-400">{t.calculator.reduceToSingleDigit}: <span className="font-bold text-slate-900 dark:text-slate-100">{result.saghir}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Element Discovery */}
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm flex-shrink-0">4</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{t.guidance.elementDiscovery}</p>
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-sm">
                        <p className="text-slate-600 dark:text-slate-400">{t.calculator.dominantElement}: <span className={`font-bold ${ELEMENT_INFO[result.dominant as ElementType].color}`}>{result.dominant}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Element Distribution */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <Waves className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  {t.elementalComposition.title}
                </h3>
                <div className="space-y-4">
                  {Object.entries(result.counts).map(([element, count]) => {
                    const total = Object.values(result.counts as Record<string, number>).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? Math.round((count as number / total) * 100) : 0;
                    const info = ELEMENT_INFO[element as ElementType];
                    const Icon = info.icon;
                    const elementKey = element.toLowerCase() as 'fire' | 'water' | 'air' | 'earth';
                    
                    return (
                      <div key={element}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${info.color}`} />
                            <span className="font-medium text-slate-900 dark:text-slate-100">{t.elements[elementKey]}</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{count as number} {t.elementalComposition.letters} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full ${info.bg} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Sacred Number Resonance */}
              {result.resonance && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 sm:p-6 border border-purple-200 dark:border-purple-800">
                  <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5" />
                    {t.sacredNumbers.title}
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Divisibility by 7 */}
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">🔢 {t.sacredNumbers.divisibleBy} 7</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{result.kabir % 7 === 0 ? `✓ Yes - ${t.sacredNumbers.divinePerfection}` : `${t.sacredNumbers.nearest}: ${Math.round(result.kabir / 7) * 7}`}</p>
                      </div>
                      {/* Divisibility by 19 */}
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">✨ {t.sacredNumbers.divisibleBy} 19</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{result.kabir % 19 === 0 ? `✓ Yes - ${t.sacredNumbers.quranicHarmony}` : `${t.sacredNumbers.nearest}: ${Math.round(result.kabir / 19) * 19}`}</p>
                      </div>
                      {/* Divisibility by 99 */}
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">🌟 {t.sacredNumbers.divisibleBy} 99</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{result.kabir % 99 === 0 ? `✓ Yes - ${t.sacredNumbers.divineNames}` : `${t.sacredNumbers.nearest}: ${Math.round(result.kabir / 99) * 99}`}</p>
                      </div>
                      {/* Digital Root Match */}
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">🎯 Essence Pattern</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Core number: {result.saghir}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Personal Interpretation Summary */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-xl p-4 sm:p-6 border border-indigo-500 dark:border-indigo-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    {t.numericalEssence.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Core Number Meaning */}
                    <div>
                      <p className="text-sm opacity-90 mb-2">{t.numericalEssence.coreNumberMeaning}</p>
                      <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <p className="font-bold text-lg mb-2">{t.numericalEssence.theNumber} {result.saghir}</p>
                        <p className="text-sm opacity-90">
                          {result.saghir === 1 && t.numericalEssence.number1}
                          {result.saghir === 2 && t.numericalEssence.number2}
                          {result.saghir === 3 && t.numericalEssence.number3}
                          {result.saghir === 4 && t.numericalEssence.number4}
                          {result.saghir === 5 && t.numericalEssence.number5}
                          {result.saghir === 6 && t.numericalEssence.number6}
                          {result.saghir === 7 && t.numericalEssence.number7}
                          {result.saghir === 8 && t.numericalEssence.number8}
                          {result.saghir === 9 && t.numericalEssence.number9}
                        </p>
                      </div>
                    </div>

                    {/* Element Meaning */}
                    <div>
                      <p className="text-sm opacity-90 mb-2">{t.numericalEssence.dominantElement}</p>
                      <div className={`${ELEMENT_INFO[result.dominant as ElementType].bg} text-slate-900 rounded-lg p-4`}>
                        <p className="font-bold text-lg mb-2">{result.dominant}</p>
                        <p className="text-sm opacity-90">
                          {result.dominant === 'Fire' && t.numericalEssence.fireDesc}
                          {result.dominant === 'Water' && t.numericalEssence.waterDesc}
                          {result.dominant === 'Air' && t.numericalEssence.airDesc}
                          {result.dominant === 'Earth' && t.numericalEssence.earthDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm opacity-90 italic border-t border-white/20 pt-4">
                    💫 {t.numericalEssence.guidanceMessage}
                  </p>
                </div>
              </div>

              {/* 7. Celestial Signature - From hadad-core ELEMENT_INFO */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 sm:p-6 border-2 border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  {t.celestialSignature.title}
                  <span className="text-xs font-normal opacity-70">(ʿIlm al-Ḥurūf)</span>
                </h3>
                
                {(() => {
                  // Get element from hadath, then look up celestial info
                  const element = hadathToElement(result.hadath);
                  const celestialInfo = HADAD_ELEMENT_INFO[element];
                  
                  return (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Planet */}
                        <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-700 hover:shadow-md transition-shadow">
                          <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">{t.celestialSignature.planet}</div>
                          <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                            {celestialInfo.planet}
                          </div>
                          <div className="text-xs font-arabic text-blue-600 dark:text-blue-400">
                            {ARABIC_PLANET_NAMES[celestialInfo.planet]}
                          </div>
                        </div>
                        
                        {/* Day */}
                        <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-700 hover:shadow-md transition-shadow">
                          <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">{t.celestialSignature.day}</div>
                          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {celestialInfo.day}
                          </div>
                        </div>
                        
                        {/* Best Hours */}
                        <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-700 hover:shadow-md transition-shadow">
                          <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">{t.celestialSignature.bestHours}</div>
                          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                            {celestialInfo.hours.join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-4 text-center italic">
                        ✨ {t.celestialSignature.footerNote}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
          
          {/* Welcome Message - Mobile Responsive */}
          {!result && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 text-center">
              <Sparkles className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">{t.welcome.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
                {t.welcome.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {Object.entries(ELEMENT_INFO).map(([element, info]) => {
                  const Icon = info.icon;
                  const elementKey = element.toLowerCase() as 'fire' | 'water' | 'air' | 'earth';
                  return (
                    <div key={element} className={`p-4 rounded-lg ${info.bg} border border-current/20`}>
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${info.color}`} />
                      <div className={`font-medium text-sm ${info.color}`}>{t.elements[elementKey]}</div>
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
                    {t.common.history}
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
          </div>
        </main>
        
        {/* Modals */}
        {showComparison && <ComparisonMode onClose={() => setShowComparison(false)} abjad={abjad} analyzeElements={analyzeElements} />}
        
        {showCompatibility && (
          <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
            <CompatibilityPanel onBack={() => setShowCompatibility(false)} />
          </div>
        )}

        {/* Onboarding Tutorial */}
        <OnboardingTutorial 
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
        />

        {/* Mobile Menu - Clean & Minimal */}
        {showMobileMenu && (
          <MobileMenu
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
            onShowTutorial={() => setShowOnboarding(true)}
            onShowHistory={() => setShowHistory(true)}
            historyCount={history.length}
          />
        )}
        
        {/* Footer - Mobile Responsive */}
        <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <p className="mb-2">Built with Next.js, TypeScript, and Tailwind CSS</p>
            <p>For educational and cultural exploration only • Always consult qualified scholars for religious guidance</p>
          </div>
        </footer>
      </div>
    </div>
  );
}