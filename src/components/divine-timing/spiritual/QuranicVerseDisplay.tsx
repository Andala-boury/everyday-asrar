'use client';

import { useLanguage } from '../../../contexts/LanguageContext';
import { BookOpen, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface QuranicVerseDisplayProps {
  verse: {
    surah: number;
    ayah: number;
    textArabic: string;
    translationEn: string;
    translationFr: string;
    reference: string;
    relevance: string;
    relevanceFr: string;
  };
  reflectionPrompt: string;
  reflectionPromptFr: string;
}

export function QuranicVerseDisplay({
  verse,
  reflectionPrompt,
  reflectionPromptFr
}: QuranicVerseDisplayProps) {
  const { t, language } = useLanguage();
  const isFr = language === 'fr';
  const [showRelevance, setShowRelevance] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 border border-emerald-200 dark:border-emerald-800/50 p-6">
      {/* Decorative Border Pattern */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-emerald-900 dark:text-emerald-200">
            {isFr ? 'Verset Coranique' : 'Quranic Verse'}
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-auto">
            {verse.reference}
          </span>
        </div>

        {/* Arabic Text - Large and Beautiful */}
        <div className="mb-4 p-4 bg-white/60 dark:bg-slate-900/40 rounded-xl">
          <div 
            className="text-3xl md:text-4xl font-arabic text-emerald-900 dark:text-emerald-100 text-center leading-loose mb-4"
            style={{ fontFamily: 'Amiri, Scheherazade, serif' }}
            dir="rtl"
          >
            {verse.textArabic}
          </div>
          
          {/* Translation */}
          <div className="text-base md:text-lg text-emerald-800 dark:text-emerald-200 text-center leading-relaxed italic">
            "{isFr ? verse.translationFr : verse.translationEn}"
          </div>
        </div>

        {/* Relevance - Expandable */}
        <div className="mb-4">
          <button
            onClick={() => setShowRelevance(!showRelevance)}
            className="w-full text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center justify-center gap-1"
          >
            <span>{showRelevance ? '▼' : '▶'}</span>
            <span>{isFr ? 'Pertinence pour cette heure' : 'Relevance to this hour'}</span>
          </button>
          
          {showRelevance && (
            <div className="mt-3 p-4 bg-white/60 dark:bg-slate-900/40 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30 text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed animate-fade-in">
              {isFr ? verse.relevanceFr : verse.relevance}
            </div>
          )}
        </div>

        {/* Reflection Prompt */}
        <div className="p-4 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg border border-emerald-300/50 dark:border-emerald-700/30">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium mb-1">
                {isFr ? 'Réflexion' : 'Reflection'}
              </div>
              <div className="text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed">
                {isFr ? reflectionPromptFr : reflectionPrompt}
              </div>
            </div>
          </div>
        </div>

        {/* Bismillah Reminder */}
        <div className="mt-4 text-center">
          <div 
            className="text-2xl font-arabic text-emerald-700 dark:text-emerald-300 mb-1"
            style={{ fontFamily: 'Amiri, Scheherazade, serif' }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400">
            {isFr ? 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux' : 'In the name of Allah, the Most Gracious, the Most Merciful'}
          </div>
        </div>
      </div>
    </div>
  );
}
