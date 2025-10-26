import React from 'react';
import {
  Star, Heart, User, Target, Calendar, Clock, AlertTriangle,
  Sparkles, Book, TrendingUp, Award, Shield, Zap
} from 'lucide-react';

interface LifePath {
  name: string;
  nameArabic: string;
  planet: string;
  planetArabic: string;
  element: string;
  elementArabic: string;
  spiritualStation: string;
  spiritualStationArabic: string;
  lifePurpose: string;
  lifePurposeArabic: string;
  qualities: string[];
  qualitiesArabic: string[];
  challenges: string[];
  challengesArabic: string[];
  quranResonance: string;
  quranResonanceArabic: string;
  advice: string[];
  adviceArabic: string[];
}

interface EnhancedLifePathAnalysis {
  lifePathNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  destinyNumber: number;
  lifePath: LifePath;
  soulUrge: Partial<LifePath>;
  personality: Partial<LifePath>;
  currentCycle: {
    cycleNumber: number;
    cycleStage: string;
    cycleStageArabic: string;
    yearNumber: number;
    yearTheme: string;
    yearThemeArabic: string;
    focus: string[];
    focusArabic: string[];
  };
  personalYear: number;
  karmicDebts: Array<{
    number: number;
    name: string;
    nameArabic: string;
    lesson: string;
    lessonArabic: string;
    remedy: string;
    remedyArabic: string;
  }>;
  sacredNumbers: Array<{
    number: number;
    significance: string;
    significanceArabic: string;
    spiritualMeaning: string;
    spiritualMeaningArabic: string;
  }>;
  pinnacleChallenge: {
    currentPinnacle: number;
    currentChallenge: number;
    pinnacleInterpretation: string;
    challengeInterpretation: string;
  };
  overallGuidance: string;
  overallGuidanceArabic: string;
  spiritualFocus: string[];
  spiritualFocusArabic: string[];
  yearAhead: string;
  yearAheadArabic: string;
}

interface EnhancedLifePathViewProps {
  analysis: EnhancedLifePathAnalysis;
  language?: 'en' | 'ar';
}

export function EnhancedLifePathView({ analysis, language = 'en' }: EnhancedLifePathViewProps) {
  const {
    lifePathNumber,
    soulUrgeNumber,
    personalityNumber,
    destinyNumber,
    lifePath,
    soulUrge,
    personality,
    currentCycle,
    personalYear,
    karmicDebts,
    sacredNumbers,
    pinnacleChallenge,
    overallGuidance,
    overallGuidanceArabic,
    spiritualFocus,
    spiritualFocusArabic,
    yearAhead,
    yearAheadArabic
  } = analysis;

  const isArabic = language === 'ar';

  return (
    <div className="space-y-6">
      
      {/* Header - Core Numbers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Life Path */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-center mb-2">
            <Star className="w-6 h-6" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{lifePathNumber}</div>
            <div className="text-sm opacity-90">{isArabic ? 'رقم الحياة' : 'Life Path'}</div>
            <div className="text-xs mt-1 font-semibold">
              {isArabic ? lifePath.nameArabic : lifePath.name}
            </div>
          </div>
        </div>
        
        {/* Soul Urge */}
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-center mb-2">
            <Heart className="w-6 h-6" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{soulUrgeNumber}</div>
            <div className="text-sm opacity-90">{isArabic ? 'دافع الروح' : 'Soul Urge'}</div>
            <div className="text-xs mt-1 font-semibold">
              {isArabic && soulUrge.nameArabic ? soulUrge.nameArabic : (soulUrge.name || '')}
            </div>
          </div>
        </div>
        
        {/* Personality */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-center mb-2">
            <User className="w-6 h-6" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{personalityNumber}</div>
            <div className="text-sm opacity-90">{isArabic ? 'الشخصية' : 'Personality'}</div>
            <div className="text-xs mt-1 font-semibold">
              {isArabic && personality.nameArabic ? personality.nameArabic : (personality.name || '')}
            </div>
          </div>
        </div>
        
        {/* Destiny */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-black p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-black" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1 text-black">{destinyNumber}</div>
            <div className="text-sm opacity-90 text-black">{isArabic ? 'القدر' : 'Destiny'}</div>
          </div>
        </div>
        
      </div>
      
      {/* Overall Guidance - Prominent Section */}
      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-6 border-2 border-indigo-300 dark:border-indigo-700 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
            {isArabic ? 'إرشادك الروحاني' : 'Your Spiritual Guidance'}
          </h3>
        </div>
        <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
          {isArabic ? overallGuidanceArabic : overallGuidance}
        </p>
      </div>
      
      {/* Life Path Detailed */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-lg">🌟</div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isArabic ? `رقم الحياة ${lifePathNumber}: ${lifePath.nameArabic}` : `Life Path ${lifePathNumber}: ${lifePath.name}`}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isArabic ? `${lifePath.planetArabic} • ${lifePath.elementArabic}` : `${lifePath.planet} • ${lifePath.element}`}
            </p>
          </div>
        </div>
        
        {/* Spiritual Station */}
        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="font-semibold text-purple-900 dark:text-purple-300 mb-1">
            {isArabic ? 'المقام الروحاني:' : 'Spiritual Station:'}
          </div>
          <div className="text-purple-800 dark:text-purple-200">
            {isArabic ? lifePath.spiritualStationArabic : lifePath.spiritualStation}
          </div>
        </div>
        
        {/* Life Purpose */}
        <div className="mb-4">
          <div className="font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            {isArabic ? 'هدف الحياة:' : 'Life Purpose:'}
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            {isArabic ? lifePath.lifePurposeArabic : lifePath.lifePurpose}
          </p>
        </div>
        
        {/* Qualities & Challenges */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="font-bold text-green-700 dark:text-green-300 mb-2">
              {isArabic ? '✨ الصفات:' : '✨ Qualities:'}
            </div>
            <ul className="space-y-1">
              {(isArabic ? lifePath.qualitiesArabic : lifePath.qualities).map((q: string, i: number) => (
                <li key={i} className="text-sm text-slate-700 dark:text-slate-300">• {q}</li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="font-bold text-amber-700 dark:text-amber-300 mb-2">
              {isArabic ? '⚡ التحديات:' : '⚡ Challenges:'}
            </div>
            <ul className="space-y-1">
              {(isArabic ? lifePath.challengesArabic : lifePath.challenges).map((c: string, i: number) => (
                <li key={i} className="text-sm text-slate-700 dark:text-slate-300">• {c}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Quranic Resonance */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="font-bold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2">
            <Book className="w-4 h-4" />
            {isArabic ? 'صدى قرآني:' : 'Quranic Resonance:'}
          </div>
          <div className="text-sm text-emerald-900 dark:text-emerald-100">
            {isArabic ? lifePath.quranResonanceArabic : lifePath.quranResonance}
          </div>
        </div>
        
        {/* Advice */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="font-bold text-blue-700 dark:text-blue-300 mb-2">
            {isArabic ? '💡 نصائح للنمو:' : '💡 Advice for Growth:'}
          </div>
          <ul className="space-y-1">
            {(isArabic ? lifePath.adviceArabic : lifePath.advice).map((a: string, i: number) => (
              <li key={i} className="text-sm text-slate-700 dark:text-slate-300">• {a}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Current Cycle & Timing */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {isArabic ? 'موقعك الحالي' : 'Your Current Position'}
          </h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {currentCycle.cycleNumber}
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300">
              {isArabic ? currentCycle.cycleStageArabic : currentCycle.cycleStage}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isArabic ? 'دورة' : 'Cycle'}
            </div>
          </div>
          
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              {currentCycle.yearNumber}
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300">
              {isArabic ? currentCycle.yearThemeArabic : currentCycle.yearTheme}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isArabic ? 'سنة' : 'Year'}
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {personalYear}
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300">
              {isArabic ? 'سنة شخصية' : 'Personal Year'}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isArabic ? yearAheadArabic : yearAhead}
            </div>
          </div>
        </div>
        
        {/* Year Focus */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg">
          <div className="font-bold text-purple-900 dark:text-purple-300 mb-2">
            {isArabic ? '🎯 تركيز هذه السنة:' : '🎯 This Year\'s Focus:'}
          </div>
          <ul className="space-y-1">
            {(isArabic ? currentCycle.focusArabic : currentCycle.focus).map((f: string, i: number) => (
              <li key={i} className="text-sm text-slate-700 dark:text-slate-300">• {f}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Karmic Debts (if any) */}
      {karmicDebts.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-amber-300 dark:border-amber-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {isArabic ? 'الدروس الكارمية' : 'Karmic Lessons'}
            </h3>
          </div>
          
          {karmicDebts.map((debt, idx) => (
            <div key={idx} className="mb-4 last:mb-0 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="font-bold text-amber-900 dark:text-amber-300 mb-2">
                {isArabic ? `${debt.number}: ${debt.nameArabic}` : `${debt.number}: ${debt.name}`}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                {isArabic ? debt.lessonArabic : debt.lesson}
              </p>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="font-semibold text-green-800 dark:text-green-300 mb-1 text-sm">
                  {isArabic ? '🌱 العلاج:' : '🌱 Remedy:'}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {isArabic ? debt.remedyArabic : debt.remedy}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Sacred Numbers (if any) */}
      {sacredNumbers.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-emerald-300 dark:border-emerald-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {isArabic ? 'الأرقام المقدسة في اسمك' : 'Sacred Numbers in Your Name'}
            </h3>
          </div>
          
          <div className="grid gap-3">
            {sacredNumbers.map((sacred, idx) => (
              <div key={idx} className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {sacred.number}
                  </div>
                  <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                    {isArabic ? sacred.significanceArabic : sacred.significance}
                  </div>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {isArabic ? sacred.spiritualMeaningArabic : sacred.spiritualMeaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Spiritual Focus for the Year */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6" />
          <h3 className="text-xl font-bold">
            {isArabic ? 'تركيزك الروحاني' : 'Your Spiritual Focus'}
          </h3>
        </div>
        
        <ul className="space-y-2">
          {(isArabic ? spiritualFocusArabic : spiritualFocus).map((focus: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-yellow-300">✨</span>
              <span className="text-sm opacity-95">{focus}</span>
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
}
