'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Star, Heart, BookOpen, Lightbulb, 
  Calendar, Clock, Compass, Users, Sparkles,
  TrendingUp, Target, MessageCircle, Home, Flame, Keyboard, ExternalLink
} from 'lucide-react';
import { BalanceMeter } from '../../components/BalanceMeter';
import type { ElementType } from '../../components/BalanceMeter';
import {
  analyzeNameDestiny,
  analyzeCompatibility,
  calculateLifePath,
  calculatePersonalYear,
  calculatePlanetaryHour,
  getDailyDhikr,
  SPIRITUAL_STATIONS,
  PLANET_DAYS,
  type Planet,
  calculateUserProfile,
  generateWeeklySummary,
  calculateHarmonyType,
  calculateDominantForce,
  getBalanceTip,
  type UserProfile,
  type WeeklySummary as WeeklySummaryType,
  type DailyReading,
  type HarmonyType,
  type DominantForce as DominantForceType
} from './core';
import { getQuranResonanceMessage } from './quranResonance';
import { fetchQuranVerse, type VerseText } from './quranApi';
import { transliterateLatinToArabic } from '../../lib/text-normalize';
import { ArabicKeyboard } from '../../components/ArabicKeyboard';
import { useAbjad } from '../../contexts/AbjadContext';
import { AbjadSystemSelector } from '../../components/AbjadSystemSelector';

/**
 * Get current day's element based on planetary day assignment
 * Sun=Fire, Mon=Water, Tue=Fire, Wed=Air, Thu=Water, Fri=Air, Sat=Earth
 * Based on classical planetary day rulership from Al-Būnī tradition
 */
function getCurrentDayElement(): ElementType {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, etc.
  const dayElements: ElementType[] = ['Fire', 'Water', 'Fire', 'Air', 'Water', 'Air', 'Earth'];
  return dayElements[dayOfWeek];
}

const PLANET_ICONS: Record<Planet, typeof Sun> = {
  Sun, Moon,
  Mercury: MessageCircle,
  Venus: Heart,
  Mars: Flame,
  Jupiter: Star,
  Saturn: Compass
};

const PLANET_COLORS: Record<Planet, string> = {
  Sun: 'text-yellow-500',
  Moon: 'text-blue-300',
  Mercury: 'text-purple-500',
  Venus: 'text-pink-500',
  Mars: 'text-red-500',
  Jupiter: 'text-indigo-500',
  Saturn: 'text-slate-600'
};

const PLANET_ICONS_EMOJI: Record<Planet, string> = {
  Sun: '☀️',
  Moon: '🌙',
  Mars: '♂️',
  Mercury: '☿️',
  Jupiter: '♃',
  Venus: '♀️',
  Saturn: '♄'
};

export function IlmHurufPanel() {
  const { abjad } = useAbjad(); // Get the current Abjad system
  const [mode, setMode] = useState<'destiny' | 'compatibility' | 'timing' | 'life-path' | 'weekly'>('weekly');
  const [name, setName] = useState('');
  const [name2, setName2] = useState('');
  const [latinInput, setLatinInput] = useState('');
  const [latinInput2, setLatinInput2] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showKeyboard2, setShowKeyboard2] = useState(false);
  const [translitConfidence, setTranslitConfidence] = useState<number | null>(null);
  const [translitWarnings, setTranslitWarnings] = useState<string[]>([]);
  const [birthDate, setBirthDate] = useState('');
  const [results, setResults] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Clear results when mode changes to prevent showing stale data
  useEffect(() => {
    setResults(null);
  }, [mode]);

  const handleLatinInput = (value: string, isFirstName: boolean = true) => {
    if (isFirstName) {
      setLatinInput(value);
    } else {
      setLatinInput2(value);
    }
    
    if (value.trim()) {
      const result = transliterateLatinToArabic(value);
      if (isFirstName) {
        setName(result.primary);
        setTranslitConfidence(result.confidence);
        setTranslitWarnings(result.warnings);
      } else {
        setName2(result.primary);
      }
    } else {
      if (isFirstName) {
        setName('');
        setTranslitConfidence(null);
        setTranslitWarnings([]);
      } else {
        setName2('');
      }
    }
  };

  const handleKeyboardPress = (char: string, isFirstName: boolean = true) => {
    const currentName = isFirstName ? name : name2;
    
    if (char === '⌫') {
      // Backspace
      const newValue = currentName.slice(0, -1);
      if (isFirstName) {
        setName(newValue);
        setLatinInput(''); // Clear latin when typing Arabic
      } else {
        setName2(newValue);
        setLatinInput2('');
      }
    } else if (char === '⎵') {
      // Space
      if (isFirstName) {
        setName(currentName + ' ');
      } else {
        setName2(currentName + ' ');
      }
    } else {
      // Regular character
      if (isFirstName) {
        setName(currentName + char);
        setLatinInput(''); // Clear latin when typing Arabic
      } else {
        setName2(currentName + char);
        setLatinInput2('');
      }
    }
  };

  const handleAnalyze = () => {
    try {
      if (mode === 'destiny' && name) {
        const result = analyzeNameDestiny(name, abjad);
        setResults(result);
      } else if (mode === 'compatibility' && name && name2) {
        const result = analyzeCompatibility(name, name2, abjad);
        setResults(result);
      } else if (mode === 'life-path' && birthDate) {
        const result = calculateLifePath(new Date(birthDate));
        setResults(result);
      } else if (mode === 'timing') {
        const now = new Date();
        const planetaryHour = calculatePlanetaryHour(now);
        const personalYear = birthDate ? calculatePersonalYear(new Date(birthDate), now.getFullYear()) : null;
        setResults({ planetaryHour, personalYear });
      } else if (mode === 'weekly' && name) {
        const profile = calculateUserProfile(name, birthDate ? new Date(birthDate) : undefined, undefined, abjad);
        const weeklySummary = generateWeeklySummary(profile);
        const harmonyType = calculateHarmonyType(
          profile.element,
          profile.kawkab,
          profile.ruh,
          weeklySummary.days[0].day_planet,
          weeklySummary.days[0].ruh_phase
        );
        const dominantForce = calculateDominantForce(
          profile.saghir,
          profile.element,
          profile.kawkab,
          profile.letter_geometry
        );
        setResults({ profile, weeklySummary, harmonyType, dominantForce });
        setSelectedDay(null);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setResults({
        error: true,
        message: error instanceof Error ? error.message : 'Unable to analyze. Please check your input.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Abjad System Selector */}
      <AbjadSystemSelector />
      
      {/* Mode Selection */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          ʿIlm al-Ḥurūf - Practical Life Guidance
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Following the tradition of Imam al-Būnī • Reflective guidance to plan your week
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            onClick={() => setMode('weekly')}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === 'weekly'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                : 'border-slate-200 dark:border-slate-700 hover:border-green-300'
            }`}
          >
            <Calendar className="w-5 h-5 mx-auto mb-2 text-green-500" />
            <div className="text-sm font-medium">Week at a Glance</div>
          </button>
          
          <button
            onClick={() => setMode('destiny')}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === 'destiny'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
            }`}
          >
            <Target className="w-5 h-5 mx-auto mb-2 text-purple-500" />
            <div className="text-sm font-medium">Name Destiny</div>
          </button>
          
          <button
            onClick={() => setMode('compatibility')}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === 'compatibility'
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30'
                : 'border-slate-200 dark:border-slate-700 hover:border-pink-300'
            }`}
          >
            <Users className="w-5 h-5 mx-auto mb-2 text-pink-500" />
            <div className="text-sm font-medium">Compatibility</div>
          </button>
          
          <button
            onClick={() => setMode('life-path')}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === 'life-path'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
            }`}
          >
            <Compass className="w-5 h-5 mx-auto mb-2 text-blue-500" />
            <div className="text-sm font-medium">Life Path</div>
          </button>
          
          <button
            onClick={() => setMode('timing')}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === 'timing'
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30'
                : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
            }`}
          >
            <Clock className="w-5 h-5 mx-auto mb-2 text-amber-500" />
            <div className="text-sm font-medium">Divine Timing</div>
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">
          {mode === 'weekly' && 'Generate Your Week'}
          {mode === 'destiny' && 'Enter Your Name'}
          {mode === 'compatibility' && 'Enter Two Names'}
          {mode === 'life-path' && 'Enter Your Birth Date'}
          {mode === 'timing' && 'Current Planetary Hour'}
        </h3>
        
        <div className="space-y-4">
          {(mode === 'destiny' || mode === 'compatibility' || mode === 'weekly') && (
            <div className="space-y-3">
              {/* Latin Input */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  {mode === 'compatibility' ? 'First Person - Latin (English/French)' : 'Name - Latin (English/French)'}
                </label>
                <input
                  type="text"
                  value={latinInput}
                  onChange={(e) => handleLatinInput(e.target.value, true)}
                  placeholder="e.g., Muhammad, Hassan, Fatima, Layla"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Auto-transliterates to Arabic • Supports EN/FR names
                </p>
                {translitConfidence !== null && translitConfidence < 100 && (
                  <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      Confidence: {translitConfidence}% 
                      {translitWarnings.length > 0 && ` • ${translitWarnings.join(', ')}`}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Arabic Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {mode === 'compatibility' ? 'First Person - Arabic' : 'Name - Arabic'}
                  </label>
                  <button
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      showKeyboard
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Keyboard className="w-3 h-3" />
                    {showKeyboard ? 'Hide' : 'Show'} Keyboard
                  </button>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setLatinInput(''); // Clear latin if user types Arabic directly
                  }}
                  placeholder="محمد"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-right text-xl font-arabic"
                  dir="rtl"
                  style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
                />
                {showKeyboard && (
                  <div className="mt-3">
                    <ArabicKeyboard 
                      onKeyPress={(char) => handleKeyboardPress(char, true)}
                      onClose={() => setShowKeyboard(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {mode === 'weekly' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Birth Date (Optional - for anchor date)
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Used to calculate your personal cycles. Defaults to today if not provided.
              </p>
            </div>
          )}
          
          {mode === 'compatibility' && (
            <div className="space-y-3">
              {/* Latin Input for Second Person */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Second Person - Latin (English/French)
                </label>
                <input
                  type="text"
                  value={latinInput2}
                  onChange={(e) => handleLatinInput(e.target.value, false)}
                  placeholder="e.g., Fatima, Aisha, Zainab"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Auto-transliterates to Arabic
                </p>
              </div>
              
              {/* Arabic Input for Second Person */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Second Person - Arabic
                  </label>
                  <button
                    onClick={() => setShowKeyboard2(!showKeyboard2)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      showKeyboard2
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Keyboard className="w-3 h-3" />
                    {showKeyboard2 ? 'Hide' : 'Show'} Keyboard
                  </button>
                </div>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => {
                    setName2(e.target.value);
                    setLatinInput2(''); // Clear latin if user types Arabic directly
                  }}
                  placeholder="فاطمة"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-right text-xl font-arabic"
                  dir="rtl"
                  style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
                />
                {showKeyboard2 && (
                  <div className="mt-3">
                    <ArabicKeyboard 
                      onKeyPress={(char) => handleKeyboardPress(char, false)}
                      onClose={() => setShowKeyboard2(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {mode === 'timing' && (
            <div className="space-y-4">
              {/* Name fields for Rest Signal feature */}
              <div className="space-y-3">
                {/* Latin Input */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Your Name - Latin (English/French) <span className="text-xs text-slate-500">(Optional - for Rest Signal)</span>
                  </label>
                  <input
                    type="text"
                    value={latinInput}
                    onChange={(e) => handleLatinInput(e.target.value, true)}
                    placeholder="e.g., Muhammad, Hassan, Fatima, Layla"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Enables personalized Rest Signal detection
                  </p>
                </div>
                
                {/* Arabic Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Your Name - Arabic <span className="text-xs text-slate-500">(Optional)</span>
                    </label>
                    <button
                      onClick={() => setShowKeyboard(!showKeyboard)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        showKeyboard
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <Keyboard className="w-3 h-3" />
                      {showKeyboard ? 'Hide' : 'Show'} Keyboard
                    </button>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setLatinInput('');
                    }}
                    placeholder="محمد"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-right text-xl font-arabic"
                    dir="rtl"
                    style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
                  />
                  {showKeyboard && (
                    <div className="mt-3">
                      <ArabicKeyboard 
                        onKeyPress={(char) => handleKeyboardPress(char, true)}
                        onClose={() => setShowKeyboard(false)}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Birth Date
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}
          
          {mode === 'life-path' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Birth Date
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          )}
          
          <button
            onClick={handleAnalyze}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Analyze
          </button>
        </div>
      </div>

      {/* Results */}
      {results && results.error && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200">Analysis Error</h3>
          </div>
          <p className="text-red-700 dark:text-red-300">{results.message}</p>
        </div>
      )}
      {results && !results.error && mode === 'weekly' && <WeeklyResults results={results} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />}
      {results && !results.error && mode === 'destiny' && <DestinyResults results={results} />}
      {results && !results.error && mode === 'compatibility' && results.person1 && results.person2 && <CompatibilityResults results={results} />}
      {results && !results.error && mode === 'life-path' && <LifePathResults results={results} />}
      {results && !results.error && mode === 'timing' && <TimingResults results={results} birthDate={birthDate} name={name} abjad={abjad} />}
    </div>
  );
}

// ============================================================================
// WEEKLY RESULTS COMPONENT
// ============================================================================

interface WeeklyResultsProps {
  results: {
    profile: UserProfile;
    weeklySummary: WeeklySummaryType;
    harmonyType: HarmonyType;
    dominantForce: DominantForceType;
  };
  selectedDay: string | null;
  setSelectedDay: (day: string | null) => void;
}

function WeeklyResults({ results, selectedDay, setSelectedDay }: WeeklyResultsProps) {
  const { profile, weeklySummary, harmonyType, dominantForce } = results;
  const [expandedRestDay, setExpandedRestDay] = useState<string | null>(null);
  
  const toggleRestSignal = (dayDate: string) => {
    setExpandedRestDay(expandedRestDay === dayDate ? null : dayDate);
  };
  
  // Safety check
  if (!profile || !weeklySummary) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <p className="text-red-800 dark:text-red-200">
          Unable to generate weekly forecast. Please enter a valid Arabic name.
        </p>
      </div>
    );
  }
  
  const balanceTip = getBalanceTip(dominantForce);
  
  const ELEMENT_COLORS = {
    Fire: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    Water: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    Air: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    Earth: 'text-green-500 bg-green-50 dark:bg-green-900/20'
  };
  
  const HARMONY_COLORS = {
    Complete: 'text-green-600 bg-green-50 dark:bg-green-900/30',
    Partial: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30',
    Conflict: 'text-red-600 bg-red-50 dark:bg-red-900/30'
  };

  return (
    <div className="space-y-6">
      {/* Profile Chips */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">
          Your Spiritual Profile
        </h3>
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700">
            <span className="text-sm font-medium text-purple-900 dark:text-purple-200">
              Rūḥ: {profile.ruh}
            </span>
          </div>
          <div className={`px-4 py-2 rounded-full border ${ELEMENT_COLORS[profile.element]}`}>
            <span className="text-sm font-medium">
              Element: {profile.element}
            </span>
          </div>
          <div className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-200 flex items-center gap-2">
              {React.createElement(PLANET_ICONS[profile.kawkab], { className: 'w-4 h-4' })}
              {profile.kawkab}
            </span>
          </div>
        </div>
      </div>

      {/* Balance Meter - Al-Būnī's Mīzān Concept */}
      <BalanceMeter 
        userElement={profile.element as ElementType} 
        currentDayElement={getCurrentDayElement()} 
      />

      {/* Harmony & Dominant Force */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`rounded-xl p-4 border-2 ${HARMONY_COLORS[harmonyType]}`}>
          <div className="text-sm font-medium opacity-75 mb-1">Current Harmony</div>
          <div className="text-xl font-bold">{harmonyType}</div>
          <p className="text-xs mt-2 opacity-90">
            {harmonyType === 'Complete' && 'All forces aligned—excellent flow'}
            {harmonyType === 'Partial' && 'Mixed signals—proceed mindfully'}
            {harmonyType === 'Conflict' && 'Challenging energies—patience needed'}
          </p>
        </div>
        
        <div className="rounded-xl p-4 border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Dominant Force</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{dominantForce}</div>
          <p className="text-xs mt-2 text-slate-600 dark:text-slate-400">{balanceTip}</p>
        </div>
      </div>

      {/* Week at a Glance - Enhanced Display */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-500" />
          Week at a Glance
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          {weeklySummary.days.map((day) => {
            const isBest = day.date === weeklySummary.best_day;
            const isGentle = day.date === weeklySummary.gentle_day;
            const isFocus = day.date === weeklySummary.focus_day;
            const isSelected = day.date === selectedDay;
            const firstTip = day.tips[0] || 'Plan mindfully';
            const truncatedTip = firstTip.length > 45 ? firstTip.slice(0, 45) + '...' : firstTip;
            
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDay(day.date === selectedDay ? null : day.date)}
                className={`relative rounded-xl p-3 transition-all duration-200 border-2 ${
                  isSelected 
                    ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 shadow-lg scale-105' 
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:shadow-md hover:scale-102'
                }`}
              >
                {/* Day name */}
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {day.weekday}
                </div>
                
                {/* Score display with bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Harmony</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {day.harmony_score}/10
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        day.band === 'High' ? 'bg-green-500' :
                        day.band === 'Moderate' ? 'bg-amber-500' :
                        'bg-blue-400'
                      }`}
                      style={{ width: `${(day.harmony_score / 10) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Planet info */}
                <div className="flex items-center gap-1.5 mb-2 py-1.5 px-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-lg">{PLANET_ICONS_EMOJI[day.day_planet]}</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {day.day_planet}
                  </span>
                </div>
                
                {/* Key tip preview */}
                <div className="mb-2 min-h-[2.5rem]">
                  <div className="flex items-start gap-1">
                    <span className="text-xs flex-shrink-0">💡</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight text-left">
                      {truncatedTip}
                    </p>
                  </div>
                </div>
                
                {/* Rest Signal Badge */}
                {day.isRestDay && (
                  <div className="mb-2">
                    <div
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent day selection toggle
                        toggleRestSignal(day.date);
                      }}
                      className={`w-full text-[10px] px-2 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                        day.restLevel === 'deep'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                      }`}
                    >
                      {day.restLevel === 'deep' ? '🛑 DEEP REST' : '🌙 REST SIGNAL'}
                    </div>
                  </div>
                )}
                
                {/* Energy Return Speed (Irtiṭāb) - Lesson 25 */}
                <div className="mb-2 p-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
                  <div className="flex items-start gap-1.5">
                    <span className="text-sm flex-shrink-0">
                      {day.energyReturn.speed === 'instant' && '⚡'}
                      {day.energyReturn.speed === 'quick' && '💨'}
                      {day.energyReturn.speed === 'gradual' && '🌊'}
                      {day.energyReturn.speed === 'delayed' && '🌱'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[10px] font-bold text-purple-900 dark:text-purple-100 uppercase">
                          {day.energyReturn.speed}
                        </span>
                        <span className="text-[9px] text-purple-600 dark:text-purple-400">
                          ({day.energyReturn.timeframe})
                        </span>
                      </div>
                      <p className="text-[10px] text-purple-700 dark:text-purple-300 leading-tight">
                        {day.energyReturn.practice}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                  {isBest && (
                    <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500 text-white font-bold">
                      Best
                    </div>
                  )}
                  {isGentle && (
                    <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-400 text-white font-bold">
                      Gentle
                    </div>
                  )}
                  {isFocus && !isBest && (
                    <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500 text-white font-bold">
                      Focus
                    </div>
                  )}
                </div>
                
                {/* Click indicator */}
                {!isSelected && (
                  <div className="absolute bottom-1 right-1 text-[10px] text-slate-400 dark:text-slate-600">
                    ▼
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Expandable Rest Signal Content */}
        {expandedRestDay && (() => {
          const restDay = weeklySummary.days.find(d => d.date === expandedRestDay);
          if (!restDay || !restDay.isRestDay) return null;
          
          return (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800 animate-in slide-in-from-top duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{restDay.restLevel === 'deep' ? '🛑' : '🌙'}</span>
                  <h4 className="font-bold text-blue-900 dark:text-blue-100">
                    {restDay.restLevel === 'deep' ? 'Deep Rest Needed' : 'Rest Signal (Infisāl)'}
                  </h4>
                </div>
                <button
                  onClick={() => setExpandedRestDay(null)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                {restDay.restLevel === 'deep' 
                  ? 'Critical low energy - honor this healing signal from your body and spirit.'
                  : `Low harmony (${restDay.harmony_score}/10) + ${restDay.day_planet} energy = Time to pause, not push.`
                }
              </p>
              
              {/* Rest Practices */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Rest Practices (choose one):
                </p>
                <ul className="space-y-2">
                  {restDay.restPractices?.map((practice, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-blue-500 dark:text-blue-400 flex-shrink-0">□</span>
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Better Days Suggestions */}
              {restDay.betterDays && restDay.betterDays.length > 0 && (
                <div className="pt-4 border-t border-blue-200 dark:border-blue-700">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-2 flex items-center gap-1">
                    <span>💡</span>
                    <span className="uppercase tracking-wide">Better Days This Week:</span>
                  </p>
                  <ul className="space-y-1">
                    {restDay.betterDays.map((betterDay, i) => (
                      <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span className="text-green-500">•</span>
                        <span>{betterDay}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic">
                    Reschedule important tasks to these high-harmony days for better outcomes.
                  </p>
                </div>
              )}
              
              {/* Classical Wisdom */}
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                <p className="text-xs italic text-slate-600 dark:text-slate-400 text-center">
                  <span className="font-semibold">Classical wisdom:</span> "Al-sukūn qabl al-ḥaraka" 
                  <br />
                  <span className="text-[10px]">(Stillness before motion brings blessed action)</span>
                </p>
              </div>
            </div>
          );
        })()}
        
        {/* Selected Day Details - Enhanced */}
        {selectedDay && (() => {
          const day = weeklySummary.days.find(d => d.date === selectedDay);
          if (!day) return null;
          
          const PlanetIcon = PLANET_ICONS[day.day_planet];
          
          return (
            <div className="mt-6 animate-in slide-in-from-top duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{PLANET_ICONS_EMOJI[day.day_planet]}</div>
                    <div>
                      <div className="text-2xl font-bold">
                        {day.weekday}
                      </div>
                      <div className="text-sm opacity-90">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{day.harmony_score}</div>
                    <div className="text-xs opacity-90">/ 10</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="text-xs opacity-75 mb-1">Planet</div>
                    <div className="font-bold flex items-center gap-2">
                      <PlanetIcon className="w-5 h-5" />
                      {day.day_planet}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {day.day_planet === 'Sun' && 'Leadership & Vitality'}
                      {day.day_planet === 'Moon' && 'Emotions & Intuition'}
                      {day.day_planet === 'Mars' && 'Action & Courage'}
                      {day.day_planet === 'Mercury' && 'Communication & Learning'}
                      {day.day_planet === 'Jupiter' && 'Expansion & Wisdom'}
                      {day.day_planet === 'Venus' && 'Love & Harmony'}
                      {day.day_planet === 'Saturn' && 'Structure & Discipline'}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="text-xs opacity-75 mb-1">Rūḥ Phase</div>
                    <div className="font-bold">{day.ruh_phase_group}</div>
                    <div className="text-xs opacity-75 mt-1">Phase {day.ruh_phase}/9</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="text-xs opacity-75 mb-1">Energy Band</div>
                    <div className={`font-bold flex items-center gap-2`}>
                      {day.band === 'High' && '🔥 High'}
                      {day.band === 'Moderate' && '⚖️ Moderate'}
                      {day.band === 'Low' && '🌊 Gentle'}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {day.band === 'High' && 'Peak performance day'}
                      {day.band === 'Moderate' && 'Steady progress day'}
                      {day.band === 'Low' && 'Rest & reflection day'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-white dark:bg-slate-800 rounded-xl p-5 border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Your Guidance for This Day</h4>
                </div>
                
                {/* Energy Return - Detailed (Irtiṭāb) */}
                <div className="mb-5 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                    <span className="text-2xl">
                      {day.energyReturn.speed === 'instant' && '⚡'}
                      {day.energyReturn.speed === 'quick' && '💨'}
                      {day.energyReturn.speed === 'gradual' && '🌊'}
                      {day.energyReturn.speed === 'delayed' && '🌱'}
                    </span>
                    <span>Energy Return Wisdom</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                        <strong className="text-purple-700 dark:text-purple-300">Return Speed:</strong>{' '}
                        <span className="uppercase font-bold">{day.energyReturn.speed}</span>
                        {' '}
                        <span className="text-purple-600 dark:text-purple-400">
                          ({day.energyReturn.timeframe})
                        </span>
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {day.energyReturn.description}
                      </p>
                    </div>
                    
                    <div className="pt-3 border-t border-purple-200 dark:border-purple-700">
                      <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 mb-2 uppercase tracking-wide flex items-center gap-1">
                        <span>🎯</span>
                        <span>Today's Practice:</span>
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {day.energyReturn.practice}
                      </p>
                    </div>
                    
                    <div className="pt-3 border-t border-purple-200 dark:border-purple-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                        <span className="font-semibold">Classical teaching (Lesson 25):</span> "Man zaraʿa khayran ḥaṣada khayran" 
                        (Who plants good, harvests good) — The timing of harvest depends on the seed and season.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Daily Tips */}
                <div className="space-y-3">
                  {day.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setSelectedDay(null)}
                  className="mt-4 w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <span>▲</span>
                  Close Details
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-900 dark:text-amber-200">
          <strong>Reflective guidance to plan your week.</strong> Use your own judgment. This is a rhythm and planning helper, not a prediction or medical/financial advice.
        </p>
      </div>
    </div>
  );
}

function DestinyResults({ results }: { results: any }) {
  const [verseText, setVerseText] = useState<VerseText | null>(null);
  const [loadingVerse, setLoadingVerse] = useState(false);
  const [verseError, setVerseError] = useState<string | null>(null);

  // Fetch Quranic verse when quranResonance is available
  useEffect(() => {
    if (results?.quranResonance) {
      console.log('Quranic Resonance:', results.quranResonance);
      setLoadingVerse(true);
      setVerseError(null);
      fetchQuranVerse(
        results.quranResonance.surahNumber,
        results.quranResonance.ayahNumber
      )
        .then(verse => {
          console.log('Fetched verse:', verse);
          setVerseText(verse);
          setLoadingVerse(false);
        })
        .catch(err => {
          console.error('Failed to fetch verse:', err);
          setVerseError('Unable to load verse text. Please try again.');
          setLoadingVerse(false);
        });
    }
  }, [results?.quranResonance]);

  // Safety check
  if (!results || !results.destiny) {
    return (
      <div className="text-center text-slate-500 dark:text-slate-400 py-8">
        Unable to calculate destiny. Please enter a name.
      </div>
    );
  }

  const station = results.destiny;
  
  // Debug log
  console.log('DestinyResults rendering. Has quranResonance?', !!results.quranResonance, results.quranResonance);
  
  return (
    <div className="space-y-6">
      {/* Main Destiny */}
      <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white shadow-xl">
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">{results.saghir}</div>
          <div className="text-2xl font-bold mb-2">{station.name}</div>
          <div className="text-xl opacity-90 mb-4 font-arabic">{station.arabic}</div>
          <div className="text-lg opacity-90">{station.meaning}</div>
        </div>
      </div>

      {/* Kabir & Hadath */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-600 dark:text-slate-400">Kabīr (Grand Total)</div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{results.kabir}</div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-600 dark:text-slate-400">Ḥadath (Element)</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{results.hadath}</div>
        </div>
      </div>

      {/* Qur'anic Resonance */}
      {results.quranResonance && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-emerald-500 dark:border-emerald-600 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold text-white">
                Qur'anic Resonance
              </h3>
            </div>
          </div>
          
          <div className="p-6 space-y-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900">
            <div className="text-center space-y-3">
              <div className="text-4xl font-bold text-black dark:text-white mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                {results.quranResonance.surahNameArabic}
              </div>
              <div className="text-2xl font-bold text-black dark:text-white">
                {results.quranResonance.surahName}
              </div>
              <div className="inline-block px-5 py-2 bg-emerald-600 dark:bg-emerald-700 rounded-lg shadow-md">
                <div className="text-base font-bold text-white">
                  Ayah {results.quranResonance.ayahNumber} of {results.quranResonance.totalAyahsInSurah}
                </div>
              </div>
            </div>
            
            {/* Verse Text Display */}
            {loadingVerse && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <p className="text-sm text-black dark:text-slate-400 mt-2">Loading verse...</p>
              </div>
            )}
            
            {verseError && !loadingVerse && (
              <div className="text-center py-4">
                <p className="text-sm text-red-600 dark:text-red-400">{verseError}</p>
              </div>
            )}
            
            {verseText && !loadingVerse && (
              <div className="space-y-4 bg-white dark:bg-slate-800 rounded-lg p-5 border-2 border-emerald-200 dark:border-emerald-700">
                {/* Arabic Text */}
                <div className="text-right">
                  <p className="text-2xl leading-loose text-black dark:text-white font-semibold" 
                     style={{ fontFamily: 'Amiri, serif', lineHeight: '2.2' }}>
                    {verseText.arabic}
                  </p>
                </div>
                
                {/* Translation */}
                <div className="pt-3 border-t border-emerald-200 dark:border-emerald-700">
                  <p className="text-base text-black dark:text-slate-300 leading-relaxed mb-2">
                    {verseText.translation}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-slate-500 italic">
                    — {verseText.translationName}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-center pt-2">
              <a
                href={results.quranResonance.quranLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 font-bold shadow-lg hover:shadow-xl text-base"
              >
                <BookOpen className="w-5 h-5" />
                Read Full Verse on Quran.com
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <div className="pt-4 border-t-2 border-emerald-200 dark:border-emerald-800">
              <p className="text-base text-black dark:text-slate-300 italic text-center leading-relaxed font-medium">
                {getQuranResonanceMessage()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Soul Triad */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          Your Soul Triad
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="font-bold text-purple-700 dark:text-purple-300 mb-1">
              Life Destiny ({results.saghir})
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300">
              {station.quality}
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="font-bold text-blue-700 dark:text-blue-300 mb-1">
              Soul Urge ({results.soulUrge?.name})
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300">
              {results.soulUrge?.quality}
            </div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="font-bold text-green-700 dark:text-green-300 mb-1">
              Outer Personality ({results.personality?.name})
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300">
              {results.personality?.quality}
            </div>
          </div>
        </div>
      </div>

      {/* Life Guidance */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Practical Guidance
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">✨ Your Path:</div>
            <p className="text-slate-700 dark:text-slate-300">{results.interpretation}</p>
          </div>
          
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">🌟 Spiritual Practice:</div>
            <p className="text-slate-700 dark:text-slate-300">{station.practice}</p>
          </div>
          
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">📖 Quranic Guidance:</div>
            <p className="text-slate-700 dark:text-slate-300 italic">{station.verse}</p>
          </div>
          
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">💼 Practical Action:</div>
            <p className="text-slate-700 dark:text-slate-300">{station.practical}</p>
          </div>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
            <div className="font-semibold text-amber-900 dark:text-amber-300 mb-2">⚠️ Shadow to Watch:</div>
            <p className="text-amber-800 dark:text-amber-200">{station.shadow}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompatibilityResults({ results }: { results: any }) {
  // Safety check
  if (!results || !results.person1 || !results.person2) {
    return (
      <div className="text-center text-slate-500 dark:text-slate-400 py-8">
        Unable to calculate compatibility. Please ensure both names are entered.
      </div>
    );
  }

  const harmonyColor = results.harmonyScore >= 75 ? 'text-green-600' : results.harmonyScore >= 50 ? 'text-amber-600' : 'text-red-600';
  const harmonyBg = results.harmonyScore >= 75 ? 'bg-green-50 dark:bg-green-900/20' : results.harmonyScore >= 50 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20';
  
  return (
    <div className="space-y-6">
      {/* Harmony Score */}
      <div className={`${harmonyBg} rounded-xl p-6 border-2 ${harmonyColor.replace('text-', 'border-')}`}>
        <div className="text-center">
          <div className={`text-6xl font-bold mb-2 ${harmonyColor}`}>{results.harmonyScore}%</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {results.relationship}
          </div>
          <div className="text-slate-700 dark:text-slate-300">{results.advice}</div>
        </div>
      </div>

      {/* Individual Profiles */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-3">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {results.person1.saghir}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {results.person1.destiny?.name || 'Unknown'}
            </div>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {results.person1.destiny?.quality || ''}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-3">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {results.person2.saghir}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {results.person2.destiny?.name || 'Unknown'}
            </div>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {results.person2.destiny?.quality || ''}
          </div>
        </div>
      </div>

      {/* Strengths & Challenges */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Strengths
          </h4>
          <ul className="space-y-2">
            {results.strengths.map((strength: string, idx: number) => (
              <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Growth Areas
          </h4>
          <ul className="space-y-2">
            {results.challenges.map((challenge: string, idx: number) => (
              <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">⚡</span>
                {challenge}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function LifePathResults({ results }: { results: any }) {
  const station = results.station;
  
  if (!station) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <p className="text-red-800 dark:text-red-200">
          Unable to calculate life path. Please check your birth date.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
        <div className="text-center">
          <Compass className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <div className="text-6xl font-bold mb-2">{results.number}</div>
          <div className="text-2xl font-bold mb-2">{station.name}</div>
          <div className="text-xl opacity-90 mb-4 font-arabic">{station.arabic}</div>
          <div className="text-lg opacity-90">{results.interpretation}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">
          Your Life Journey
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Soul Quality:</div>
            <p className="text-slate-700 dark:text-slate-300">{station.quality}</p>
          </div>
          
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Life Practice:</div>
            <p className="text-slate-700 dark:text-slate-300">{station.practice}</p>
          </div>
          
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Divine Guidance:</div>
            <p className="text-slate-700 dark:text-slate-300 italic">{station.verse}</p>
          </div>
          
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Practical Path:</div>
            <p className="text-slate-700 dark:text-slate-300">{station.practical}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimingResults({ results, birthDate, name, abjad }: { results: any; birthDate: string; name: string; abjad: any }) {
  const { planetaryHour, personalYear } = results;
  const [restAlertDismissed, setRestAlertDismissed] = useState(false);
  
  // Get today's rest status
  const today = new Date();
  const todayWeekday = today.toLocaleDateString('en-US', { weekday: 'long' });
  let todayReading: DailyReading | null = null;
  
  // Calculate today's reading if we have a birth date and name
  if (birthDate && name) {
    try {
      // Generate a profile for today's reading
      const tempProfile = calculateUserProfile(name, new Date(birthDate), undefined, abjad);
      const weeklySummary = generateWeeklySummary(tempProfile, today);
      todayReading = weeklySummary.days.find(d => d.weekday === todayWeekday) || null;
    } catch (e) {
      console.error('Error calculating today\'s reading:', e);
    }
  }
  
  // Check sessionStorage for dismissal
  useEffect(() => {
    const dismissed = sessionStorage.getItem('restAlertDismissed');
    const dismissedDate = sessionStorage.getItem('restAlertDismissedDate');
    const todayStr = today.toISOString().split('T')[0];
    
    if (dismissed === 'true' && dismissedDate === todayStr) {
      setRestAlertDismissed(true);
    }
  }, []);
  
  const dismissRestAlert = () => {
    setRestAlertDismissed(true);
    const todayStr = today.toISOString().split('T')[0];
    sessionStorage.setItem('restAlertDismissed', 'true');
    sessionStorage.setItem('restAlertDismissedDate', todayStr);
  };
  
  const scrollToWeekView = () => {
    // Scroll to weekly section if it exists
    const weekSection = document.querySelector('[data-week-view]');
    if (weekSection) {
      weekSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // If not on page, inform user
      alert('Switch to "Weekly View" tab to see your full week forecast');
    }
  };
  
  if (!planetaryHour || !planetaryHour.planet) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <p className="text-red-800 dark:text-red-200">
          Unable to calculate planetary hour. Please try again.
        </p>
      </div>
    );
  }
  
  const PlanetIcon = PLANET_ICONS[planetaryHour.planet as Planet];
  
  return (
    <div className="space-y-6">
      
      {/* Today's Rest Signal Alert */}
      {todayReading?.isRestDay && !restAlertDismissed && (
        <div className={`p-5 rounded-xl border-2 animate-in slide-in-from-top duration-300 ${
          todayReading.restLevel === 'deep' 
            ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700'
            : 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700'
        }`}>
          
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">
                {todayReading.restLevel === 'deep' ? '🛑' : '🌙'}
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {todayReading.restLevel === 'deep' ? 'Deep Rest Needed Today' : 'Today is a Rest Day'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Harmony: {todayReading.harmony_score}/10 • {todayReading.day_planet} energy • {todayReading.weekday}
                </p>
              </div>
            </div>
          </div>
          
          {/* Message */}
          <div className="mb-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {todayReading.restLevel === 'deep' 
                ? 'Critical low energy detected. Your spirit is recalibrating—honor this healing signal with deep physical and mental rest today.'
                : 'Low harmony today suggests this is a strategic rest day. Focus on planning and reflection rather than execution and new starts.'
              }
            </p>
          </div>
          
          {/* Quick Practices */}
          {todayReading.restPractices && todayReading.restPractices.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Recommended Today:
              </p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                {todayReading.restPractices.slice(0, 3).map((practice, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button 
              onClick={scrollToWeekView}
              className="text-sm px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Calendar className="w-4 h-4" />
              View Full Week
            </button>
            
            <button 
              onClick={dismissRestAlert}
              className="text-sm px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
          
          {/* Classical Wisdom */}
          <p className="text-xs italic text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-700">
            <span className="font-semibold">
              "{todayReading.restLevel === 'deep' 
                ? 'Man ʿarafa infisāl waqtihi, faqad ḥafaẓa ṭāqatahu' 
                : 'Al-sukūn qabl al-ḥaraka'
              }"
            </span>
            {' — '}
            {todayReading.restLevel === 'deep'
              ? 'Who knows the time for disconnection, preserves their energy'
              : 'Stillness before motion brings blessed action'
            }
          </p>
        </div>
      )}
      
      {/* Note about rest day context */}
      {todayReading?.isRestDay && !restAlertDismissed && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>⚠️ Rest day active</strong> — Planetary hours below are shown for reference, but minimize activities today.
          </p>
        </div>
      )}
      
      {/* Current Planetary Hour */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          Current Planetary Hour
        </h3>
        
        <div className="text-center mb-6">
          <PlanetIcon className={`w-16 h-16 mx-auto mb-3 ${PLANET_COLORS[planetaryHour.planet as Planet]}`} />
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {planetaryHour.planet}
          </div>
          <div className="text-lg text-slate-600 dark:text-slate-400">
            {planetaryHour.quality}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="font-bold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Favorable For:
            </div>
            <ul className="space-y-1">
              {planetaryHour.favorable.map((item: string, idx: number) => (
                <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="font-bold text-amber-700 dark:text-amber-300 mb-2">
              Avoid:
            </div>
            <ul className="space-y-1">
              {planetaryHour.avoid.map((item: string, idx: number) => (
                <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Personal Year */}
      {personalYear && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Your Personal Year
          </h3>
          
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {personalYear.year}
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {personalYear.station.name}
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              {personalYear.theme}
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {personalYear.station.practical}
            </p>
          </div>
        </div>
      )}

      {/* Daily Dhikr */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-xl">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Recommended Dhikr Today
        </h3>
        
        <div className="text-center">
          <div className="text-3xl font-bold mb-2 font-arabic">
            {getDailyDhikr(new Date().getDate() % 12).arabic}
          </div>
          <div className="text-xl mb-3">
            {getDailyDhikr(new Date().getDate() % 12).dhikr}
          </div>
          <div className="opacity-90 mb-4">
            Count: {getDailyDhikr(new Date().getDate() % 12).count} times • {getDailyDhikr(new Date().getDate() % 12).time}
          </div>
          <div className="text-sm opacity-90">
            {getDailyDhikr(new Date().getDate() % 12).benefit}
          </div>
        </div>
      </div>
    </div>
  );
}
