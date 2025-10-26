/**
 * Enhanced Life Path Display Component
 * Shows all 5 core numbers with spiritual meanings and interpretations
 */

import React from 'react';
import { Sparkles, Heart, Zap, Shield, CircleDot, Flame } from 'lucide-react';
import { LIFE_PATH_MEANINGS, MASTER_NUMBERS } from '../constants/lifePathMeanings';
import { LIFE_CYCLES, SPIRITUAL_STATIONS } from '../types/lifePath';
import {
  calculateAllLifePathNumbers,
  isMasterNumber,
  formatNumberDisplay,
  getColorForNumber,
  getPlanetForNumber,
  getElementForNumber
} from '../utils/lifePathCalculator';

interface EnhancedLifePathDisplayProps {
  firstName: string;
  motherName: string;
  fatherName: string;
  birthDate: Date;
  isArabic?: boolean;
}

interface NumberCard {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  color: string;
  isMaster: boolean;
}

const EnhancedLifePathDisplay: React.FC<EnhancedLifePathDisplayProps> = ({
  firstName,
  motherName,
  fatherName,
  birthDate,
  isArabic = false
}) => {
  // Calculate all numbers
  const calculations = calculateAllLifePathNumbers(
    firstName,
    motherName,
    fatherName,
    birthDate
  );

  const {
    lifePathNumber,
    soulUrgeNumber,
    personalityNumber,
    destinyNumber,
    cyclePosition,
    currentAge,
    currentStation
  } = calculations;

  // Get meanings
  const lifePathMeaning = LIFE_PATH_MEANINGS[lifePathNumber as keyof typeof LIFE_PATH_MEANINGS]
    || MASTER_NUMBERS[lifePathNumber as keyof typeof MASTER_NUMBERS];
  
  const soulUrgeMeaning = LIFE_PATH_MEANINGS[soulUrgeNumber as keyof typeof LIFE_PATH_MEANINGS]
    || MASTER_NUMBERS[soulUrgeNumber as keyof typeof MASTER_NUMBERS];
  
  const personalityMeaning = LIFE_PATH_MEANINGS[personalityNumber as keyof typeof LIFE_PATH_MEANINGS]
    || MASTER_NUMBERS[personalityNumber as keyof typeof MASTER_NUMBERS];
  
  const destinyMeaning = LIFE_PATH_MEANINGS[destinyNumber as keyof typeof LIFE_PATH_MEANINGS]
    || MASTER_NUMBERS[destinyNumber as keyof typeof MASTER_NUMBERS];

  // Get cycle information
  const cycle = LIFE_CYCLES[cyclePosition as keyof typeof LIFE_CYCLES];
  const station = SPIRITUAL_STATIONS[cyclePosition as keyof typeof SPIRITUAL_STATIONS];

  const numberCards: NumberCard[] = [
    {
      title: isArabic ? 'رقم مسار الحياة' : 'Life Path Number',
      value: lifePathNumber,
      description: isArabic
        ? lifePathMeaning?.nameArabic || ''
        : lifePathMeaning?.name || '',
      icon: <Zap className="w-5 h-5" />,
      color: getColorForNumber(lifePathNumber),
      isMaster: isMasterNumber(lifePathNumber)
    },
    {
      title: isArabic ? 'رقم رغبة الروح' : 'Soul Urge Number',
      value: soulUrgeNumber,
      description: isArabic
        ? soulUrgeMeaning?.nameArabic || ''
        : soulUrgeMeaning?.name || '',
      icon: <Heart className="w-5 h-5" />,
      color: getColorForNumber(soulUrgeNumber),
      isMaster: isMasterNumber(soulUrgeNumber)
    },
    {
      title: isArabic ? 'رقم الشخصية' : 'Personality Number',
      value: personalityNumber,
      description: isArabic
        ? personalityMeaning?.nameArabic || ''
        : personalityMeaning?.name || '',
      icon: <Shield className="w-5 h-5" />,
      color: getColorForNumber(personalityNumber),
      isMaster: isMasterNumber(personalityNumber)
    },
    {
      title: isArabic ? 'رقم المصير' : 'Destiny Number',
      value: destinyNumber,
      description: isArabic
        ? destinyMeaning?.nameArabic || ''
        : destinyMeaning?.name || '',
      icon: <Sparkles className="w-5 h-5" />,
      color: getColorForNumber(destinyNumber),
      isMaster: isMasterNumber(destinyNumber)
    }
  ];

  return (
    <div className="w-full space-y-6 p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg">
      {/* Header */}
      <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-4">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {isArabic ? 'تحليل مسار الحياة المحسّن' : 'Enhanced Life Path Analysis'}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {isArabic
            ? `تاريخ الميلاد: ${birthDate.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')} | العمر: ${currentAge}`
            : `Birth Date: ${birthDate.toLocaleDateString('en-US')} | Age: ${currentAge}`}
        </p>
      </div>

      {/* Core Numbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {numberCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4"
            style={{ borderLeftColor: card.color }}
          >
            {/* Icon and Number */}
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${card.color}20` }}>
                {React.cloneElement(card.icon as React.ReactElement, {
                  style: { color: card.color }
                })}
              </div>
              <div className="text-right">
                <div
                  className="text-3xl font-bold"
                  style={{ color: card.color }}
                >
                  {formatNumberDisplay(card.value)}
                </div>
                {card.isMaster && (
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {isArabic ? 'رقم رئيسي' : 'Master'}
                  </span>
                )}
              </div>
            </div>

            {/* Title and Description */}
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
              {card.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              {card.description}
            </p>

            {/* Quick stat */}
            <div className="text-xs bg-slate-50 dark:bg-slate-700 p-2 rounded">
              <span className="text-slate-700 dark:text-slate-300">
                {isArabic ? 'العنصر: ' : 'Element: '}
              </span>
              <span style={{ color: card.color }} className="font-semibold">
                {getElementForNumber(card.value)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Life Path Interpretation */}
      {lifePathMeaning && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5" style={{ color: getColorForNumber(lifePathNumber) }} />
            {isArabic ? 'تفسير مسار الحياة' : 'Life Path Interpretation'}
          </h4>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Qualities */}
              <div>
                <h5 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
                  {isArabic ? 'الصفات الإيجابية' : 'Positive Qualities'}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {(isArabic ? lifePathMeaning.qualitiesArabic : lifePathMeaning.qualities).map(
                    (quality: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
                      >
                        {quality}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Challenges */}
              <div>
                <h5 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
                  {isArabic ? 'التحديات' : 'Challenges'}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {(isArabic ? lifePathMeaning.challengesArabic : lifePathMeaning.challenges).map(
                    (challenge: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-xs font-medium"
                      >
                        {challenge}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 text-sm">
              {/* Life Purpose */}
              <div>
                <h5 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {isArabic ? 'الغرض من الحياة' : 'Life Purpose'}
                </h5>
                <p className="text-slate-700 dark:text-slate-300 italic">
                  {isArabic ? lifePathMeaning.lifePurposeArabic : lifePathMeaning.lifePurpose}
                </p>
              </div>

              {/* Deepest Desire */}
              <div>
                <h5 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {isArabic ? 'الرغبة الأعمق' : 'Deepest Desire'}
                </h5>
                <p className="text-slate-700 dark:text-slate-300 italic">
                  {isArabic ? lifePathMeaning.deepestDesireArabic : lifePathMeaning.deepestDesire}
                </p>
              </div>

              {/* Quranic Resonance */}
              <div>
                <h5 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {isArabic ? 'الرنين القرآني' : 'Quranic Resonance'}
                </h5>
                <p className="text-slate-700 dark:text-slate-300 italic text-xs">
                  {isArabic
                    ? lifePathMeaning.quranResonanceArabic
                    : lifePathMeaning.quranResonance}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Life Cycle */}
      {cycle && typeof cycle !== 'number' && 'cycle' in cycle && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded-lg p-4 shadow-md">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <CircleDot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            {isArabic ? 'دورة الحياة الحالية' : 'Current Life Cycle'}
          </h4>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {isArabic ? 'السنة في الدورة' : 'Cycle Year'}
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {cyclePosition}/9
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {isArabic ? 'محطة روحية' : 'Spiritual Station'}
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {isArabic ? station?.arabic : station?.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {station?.meaning}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {isArabic ? 'مرحلة الحياة' : 'Life Phase'}
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {isArabic ? cycle.stageArabic : cycle.stage}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {cycle.ageRange}
              </p>
            </div>
          </div>

          {/* Cycle Description */}
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {cycle.description}
            </p>
          </div>
        </div>
      )}

      {/* Synthesis */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 rounded-lg p-4 shadow-md">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          {isArabic ? 'التركيب و التفاعل' : 'Synthesis & Integration'}
        </h4>
        
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
          {isArabic
            ? `رقم مسار الحياة (${formatNumberDisplay(lifePathNumber)}) يمثل جوهرك الروحي، بينما رقم رغبة الروح (${formatNumberDisplay(soulUrgeNumber)}) يكشف عن رغباتك الأعمق. يعكس رقم الشخصية (${formatNumberDisplay(personalityNumber)}) كيفية إدراك الآخرين لك، ورقم المصير (${formatNumberDisplay(destinyNumber)}) يرشدك نحو غرض حياتك الأسمى.`
            : `Your Life Path (${formatNumberDisplay(lifePathNumber)}) represents your spiritual essence, while your Soul Urge (${formatNumberDisplay(soulUrgeNumber)}) reveals your deepest desires. Your Personality (${formatNumberDisplay(personalityNumber)}) shows how others perceive you, and your Destiny (${formatNumberDisplay(destinyNumber)}) guides you toward your higher purpose.`}
        </p>

        {cycle && typeof cycle !== 'number' && 'cycle' in cycle && (
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {isArabic
              ? `أنت حالياً في السنة ${cyclePosition} من دورة التسع سنوات، في مرحلة ${station?.name} الروحية.`
              : `You are currently in Year ${cyclePosition} of your nine-year cycle, in the spiritual phase of ${station?.name}.`}
          </p>
        )}
      </div>
    </div>
  );
};

export default EnhancedLifePathDisplay;
