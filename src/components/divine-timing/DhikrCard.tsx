'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, Info } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Element } from '../../types/planetary';

interface DhikrCardProps {
  planetName: string;
  planetElement: Element;
  planetNameArabic: string;
  onClose?: () => void;
}

// Traditional planetary dhikr recommendations based on classical Islamic mysticism
const PLANETARY_DHIKR: Record<string, {
  name: string;
  arabic: string;
  transliteration: string;
  count: number;
  meaning: string;
  meaningFr: string;
  benefit: string;
  benefitFr: string;
}> = {
  Sun: {
    name: 'Ya Nūr',
    arabic: 'يَا نُور',
    transliteration: 'Yā Nūr',
    count: 99,
    meaning: 'O Light',
    meaningFr: 'Ô Lumière',
    benefit: 'Illuminates the heart and brings clarity to your path',
    benefitFr: 'Illumine le cœur et apporte de la clarté à votre chemin'
  },
  Moon: {
    name: 'Ya Latīf',
    arabic: 'يَا لَطِيف',
    transliteration: 'Yā Laṭīf',
    count: 129,
    meaning: 'O Most Gentle',
    meaningFr: 'Ô Le Plus Doux',
    benefit: 'Soothes difficulties and opens doors gently',
    benefitFr: 'Apaise les difficultés et ouvre les portes doucement'
  },
  Mars: {
    name: 'Ya Qawiyy',
    arabic: 'يَا قَوِيّ',
    transliteration: 'Yā Qawiyy',
    count: 116,
    meaning: 'O Most Strong',
    meaningFr: 'Ô Le Plus Fort',
    benefit: 'Grants courage, strength, and ability to overcome challenges',
    benefitFr: 'Accorde courage, force et capacité à surmonter les défis'
  },
  Mercury: {
    name: 'Ya Hakīm',
    arabic: 'يَا حَكِيم',
    transliteration: 'Yā Ḥakīm',
    count: 78,
    meaning: 'O Most Wise',
    meaningFr: 'Ô Le Plus Sage',
    benefit: 'Increases wisdom, understanding, and clear communication',
    benefitFr: 'Augmente la sagesse, la compréhension et la communication claire'
  },
  Jupiter: {
    name: 'Ya Karīm',
    arabic: 'يَا كَرِيم',
    transliteration: 'Yā Karīm',
    count: 270,
    meaning: 'O Most Generous',
    meaningFr: 'Ô Le Plus Généreux',
    benefit: 'Opens doors of provision and brings abundance',
    benefitFr: 'Ouvre les portes de la provision et apporte l\'abondance'
  },
  Venus: {
    name: 'Ya Wadūd',
    arabic: 'يَا وَدُود',
    transliteration: 'Yā Wadūd',
    count: 20,
    meaning: 'O Most Loving',
    meaningFr: 'Ô Le Plus Aimant',
    benefit: 'Attracts love, harmony, and beautiful relationships',
    benefitFr: 'Attire l\'amour, l\'harmonie et de belles relations'
  },
  Saturn: {
    name: 'Ya Sabūr',
    arabic: 'يَا صَبُور',
    transliteration: 'Yā Ṣabūr',
    count: 298,
    meaning: 'O Most Patient',
    meaningFr: 'Ô Le Plus Patient',
    benefit: 'Develops patience, discipline, and steady perseverance',
    benefitFr: 'Développe la patience, la discipline et la persévérance constante'
  }
};

export function DhikrCard({ planetName, planetElement, planetNameArabic, onClose }: DhikrCardProps) {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  
  const dhikr = PLANETARY_DHIKR[planetName] || PLANETARY_DHIKR.Sun;
  const [count, setCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Save count to localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`dhikr_count_${planetName}`);
    if (saved) {
      setCount(parseInt(saved, 10));
    }
  }, [planetName]);

  useEffect(() => {
    localStorage.setItem(`dhikr_count_${planetName}`, count.toString());
  }, [count, planetName]);

  const increment = () => {
    setIsAnimating(true);
    setCount(prev => (prev + 1) % (dhikr.count + 1));
    setTimeout(() => setIsAnimating(false), 200);
  };

  const decrement = () => {
    setCount(prev => (prev - 1 + dhikr.count + 1) % (dhikr.count + 1));
  };

  const reset = () => {
    setCount(0);
  };

  const progress = (count / dhikr.count) * 100;
  const isComplete = count === dhikr.count;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 
      rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800 p-6 md:p-8">
      
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            🤲 {isFr ? 'Pratique du Dhikr' : 'Dhikr Practice'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {isFr ? 'Pour cette heure planétaire' : 'For this planetary hour'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            aria-label={isFr ? 'Information' : 'Information'}
          >
            <Info className={`w-5 h-5 ${showInfo ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 
                rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">←</span>
              <span>{isFr ? 'Retour' : 'Back'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="mb-6 p-4 bg-white dark:bg-slate-900/50 rounded-lg border border-purple-200 dark:border-purple-800 space-y-2 animate-slide-down">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold">{isFr ? 'Pourquoi ce dhikr?' : 'Why this dhikr?'}</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isFr 
              ? `Traditionnellement, l'heure de ${planetNameArabic} (${planetName}) résonne avec les qualités divines de "${dhikr.name}". Ce dhikr amplifie l'énergie positive de cette heure.`
              : `Traditionally, the hour of ${planetNameArabic} (${planetName}) resonates with the divine qualities of "${dhikr.name}". This dhikr amplifies the positive energy of this hour.`}
          </p>
          <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              {isFr 
                ? '💡 Conseil: Récitez avec présence et sincérité. La qualité compte plus que la quantité.'
                : '💡 Tip: Recite with presence and sincerity. Quality matters more than quantity.'}
            </p>
          </div>
        </div>
      )}

      {/* Arabic Calligraphy - Large and Beautiful */}
      <div className="text-center mb-6">
        <div className={`text-6xl md:text-7xl lg:text-8xl font-arabic text-purple-700 dark:text-purple-300 mb-4 
          transition-transform duration-200 ${isAnimating ? 'scale-110' : 'scale-100'}`}
          style={{ fontFamily: 'Noto Naskh Arabic, Amiri, serif', lineHeight: 1.5 }}
        >
          {dhikr.arabic}
        </div>
        <div className="text-xl md:text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-2">
          {dhikr.transliteration}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {isFr ? dhikr.meaningFr : dhikr.meaning}
        </div>
      </div>

      {/* Counter Display */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <div className="text-5xl md:text-6xl font-bold text-purple-700 dark:text-purple-300">
            {count}
            <span className="text-2xl md:text-3xl text-slate-400 dark:text-slate-500">
              {' '}/ {dhikr.count}
            </span>
          </div>
          {isComplete && (
            <div className="mt-2 text-green-600 dark:text-green-400 font-semibold animate-pulse">
              ✨ {isFr ? 'Complet! Maasha Allah!' : 'Complete! Maasha Allah!'} ✨
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-slate-600 dark:text-slate-400">
          {Math.round(progress)}% {isFr ? 'complété' : 'completed'}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* Decrement */}
        <button
          onClick={decrement}
          disabled={count === 0}
          className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white dark:bg-slate-800 
            border-2 border-purple-200 dark:border-purple-800 text-slate-700 dark:text-slate-300
            hover:bg-purple-50 dark:hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed
            transition-all active:scale-95"
        >
          <Minus className="w-5 h-5" />
          <span className="font-semibold text-sm">{isFr ? 'Retirer' : 'Remove'}</span>
        </button>

        {/* Increment - Primary Action */}
        <button
          onClick={increment}
          className="flex items-center justify-center gap-2 py-4 rounded-xl 
            bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold
            hover:from-purple-700 hover:to-pink-700 transition-all active:scale-95
            shadow-lg hover:shadow-xl"
        >
          <Plus className="w-6 h-6" />
          <span>{isFr ? 'Ajouter' : 'Add'}</span>
        </button>

        {/* Reset */}
        <button
          onClick={reset}
          disabled={count === 0}
          className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white dark:bg-slate-800 
            border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300
            hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed
            transition-all active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="font-semibold text-sm">{isFr ? 'Réinitialiser' : 'Reset'}</span>
        </button>
      </div>

      {/* Benefit Description */}
      <div className="p-4 bg-white dark:bg-slate-900/50 rounded-lg border border-purple-200 dark:border-purple-800">
        <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-1">
          {isFr ? '🌟 Bienfait Spirituel:' : '🌟 Spiritual Benefit:'}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {isFr ? dhikr.benefitFr : dhikr.benefit}
        </p>
      </div>

      {/* Keyboard Hint */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isFr 
            ? '💡 Astuce: Utilisez les boutons ou comptez sur vos doigts pour une pratique traditionnelle'
            : '💡 Tip: Use buttons or count on your fingers for traditional practice'}
        </p>
      </div>
    </div>
  );
}
