'use client';

import { useLanguage } from '../../../contexts/LanguageContext';
import { Sparkles, Book } from 'lucide-react';
import { useState } from 'react';

interface DivineNameCardProps {
  planetName: string;
  divineNameData: {
    number: number;
    arabic: string;
    transliteration: string;
    meaningEn: string;
    meaningFr: string;
    spiritualQuality: string;
    spiritualQualityFr: string;
    dhikrCount: number;
    significance: string;
    significanceFr: string;
  };
  secondaryNames?: Array<{
    number: number;
    arabic: string;
    transliteration: string;
    meaningEn: string;
    meaningFr: string;
  }>;
  onOpenDhikr?: () => void;
}

export function DivineNameCard({
  planetName,
  divineNameData,
  secondaryNames,
  onOpenDhikr
}: DivineNameCardProps) {
  const { t, language } = useLanguage();
  const isFr = language === 'fr';
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-violet-950/30 border border-purple-200 dark:border-purple-800/50 p-6">
      {/* Islamic Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)',
          color: 'currentColor'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-200">
              {isFr ? 'Nom Divin' : 'Divine Name'}
            </span>
          </div>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
            #{divineNameData.number}
          </span>
        </div>

        {/* Arabic Name - Large and Beautiful */}
        <div className="text-center mb-4">
          <div 
            className="text-5xl md:text-6xl font-arabic text-purple-900 dark:text-purple-100 mb-2 leading-relaxed"
            style={{ fontFamily: 'Amiri, Scheherazade, serif' }}
          >
            {divineNameData.arabic}
          </div>
          <div className="text-xl md:text-2xl text-purple-700 dark:text-purple-300 font-medium mb-1">
            {divineNameData.transliteration}
          </div>
          <div className="text-lg text-purple-600 dark:text-purple-400">
            {isFr ? divineNameData.meaningFr : divineNameData.meaningEn}
          </div>
        </div>

        {/* Spiritual Quality */}
        <div className="mb-4 p-3 bg-white/50 dark:bg-slate-900/30 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
          <div className="text-sm text-purple-900 dark:text-purple-100 text-center">
            ✨ {isFr ? divineNameData.spiritualQualityFr : divineNameData.spiritualQuality}
          </div>
        </div>

        {/* Dhikr Count Suggestion */}
        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-purple-700 dark:text-purple-300">
          <Book className="w-4 h-4" />
          <span>
            {isFr ? 'Récitation recommandée' : 'Recommended recitation'}: {divineNameData.dhikrCount}x
          </span>
        </div>

        {/* Significance - Expandable */}
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center justify-center gap-1 mb-2"
          >
            <span>{showDetails ? '▼' : '▶'}</span>
            <span>{isFr ? 'Signification spirituelle' : 'Spiritual Significance'}</span>
          </button>
          
          {showDetails && (
            <div className="mt-3 p-4 bg-white/60 dark:bg-slate-900/40 rounded-lg border border-purple-200/50 dark:border-purple-800/30 text-sm text-purple-800 dark:text-purple-200 leading-relaxed animate-fade-in">
              {isFr ? divineNameData.significanceFr : divineNameData.significance}
              
              {/* Secondary Names */}
              {secondaryNames && secondaryNames.length > 0 && (
                <div className="mt-4 pt-4 border-t border-purple-200/50 dark:border-purple-800/30">
                  <div className="text-xs text-purple-600 dark:text-purple-400 mb-2 font-medium">
                    {isFr ? 'Noms associés:' : 'Related Names:'}
                  </div>
                  <div className="space-y-1">
                    {secondaryNames.map((name) => (
                      <div key={name.number} className="flex items-center gap-2 text-xs">
                        <span className="font-arabic text-base">{name.arabic}</span>
                        <span>({name.transliteration} - {isFr ? name.meaningFr : name.meaningEn})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        {onOpenDhikr && (
          <button
            onClick={onOpenDhikr}
            className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            📿 {isFr ? 'Commencer le Dhikr' : 'Begin Dhikr'}
          </button>
        )}
      </div>
    </div>
  );
}
