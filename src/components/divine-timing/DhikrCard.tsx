'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookOpen, Plus, Minus, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import type { AccuratePlanetaryHour } from '../../types/planetary';

interface DhikrCardProps {
  currentHour: AccuratePlanetaryHour;
}

// Planetary dhikr recommendations (from traditional 'Ilm al-Huruf)
const PLANETARY_DHIKR = {
  Sun: { name: 'Ya Nūr', arabic: 'يَا نُورُ', count: 66, meaning: 'The Light' },
  Moon: { name: 'Ya Laṭīf', arabic: 'يَا لَطِيفُ', count: 129, meaning: 'The Subtle One' },
  Mercury: { name: 'Ya ʿAlīm', arabic: 'يَا عَلِيمُ', count: 150, meaning: 'The All-Knowing' },
  Venus: { name: 'Ya Wadūd', arabic: 'يَا وَدُودُ', count: 20, meaning: 'The Loving' },
  Mars: { name: 'Ya Qawiyy', arabic: 'يَا قَوِيُّ', count: 116, meaning: 'The Strong' },
  Jupiter: { name: 'Ya Karīm', arabic: 'يَا كَرِيمُ', count: 270, meaning: 'The Generous' },
  Saturn: { name: 'Ya Ḥakīm', arabic: 'يَا حَكِيمُ', count: 78, meaning: 'The Wise' }
};

export function DhikrCard({ currentHour }: DhikrCardProps) {
  const { language } = useLanguage();
  const [count, setCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  const dhikr = PLANETARY_DHIKR[currentHour.planet.name as keyof typeof PLANETARY_DHIKR];
  
  if (!dhikr) return null;
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(Math.max(0, count - 1));
  const reset = () => setCount(0);
  
  const progress = (count / dhikr.count) * 100;
  
  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-800 dark:via-purple-900/20 dark:to-slate-800 rounded-xl shadow-lg border border-purple-200 dark:border-purple-800 overflow-hidden">
      
      {/* Header */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
            <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {language === 'fr' ? 'Dhikr Recommandé' : 'Recommended Dhikr'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {language === 'fr' 
                ? `Pour l'heure ${currentHour.planet.name}`
                : `For ${currentHour.planet.name} hour`}
            </p>
          </div>
        </div>
        
        {/* Arabic Text - Beautiful & Large */}
        <div className="text-center py-6">
          <div className="text-5xl md:text-6xl font-arabic text-purple-900 dark:text-purple-200 mb-3">
            {dhikr.arabic}
          </div>
          <div className="space-y-1">
            <p className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              {dhikr.name}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {language === 'fr' ? 'Sens' : 'Meaning'}: {dhikr.meaning}
            </p>
          </div>
        </div>
        
        {/* Counter Section */}
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                {language === 'fr' ? 'Progression' : 'Progress'}
              </span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {count} / {dhikr.count}
              </span>
            </div>
            <div className="h-3 bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, progress)}%` }}
              ></div>
            </div>
            {count >= dhikr.count && (
              <div className="text-center">
                <p className="text-green-600 dark:text-green-400 font-semibold text-sm animate-pulse">
                  ✓ {language === 'fr' ? 'Complété !' : 'Completed!'}
                </p>
              </div>
            )}
          </div>
          
          {/* Counter Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={decrement}
              className="p-3 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border-2 border-slate-200 dark:border-slate-600 rounded-lg shadow-md transition-all active:scale-95"
            >
              <Minus className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
            
            <button
              onClick={increment}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-lg shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-6 h-6 inline-block mr-2" />
              {language === 'fr' ? 'Compter' : 'Count'}
            </button>
            
            <button
              onClick={reset}
              className="p-3 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border-2 border-slate-200 dark:border-slate-600 rounded-lg shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        </div>
        
        {/* Learn More Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full p-3 text-sm font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors flex items-center justify-between"
        >
          <span>{language === 'fr' ? 'Pourquoi ce dhikr ?' : 'Why this dhikr?'}</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {/* Expandable Details */}
        {showDetails && (
          <div className="p-4 bg-white/50 dark:bg-slate-700/50 rounded-lg space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p>
              <span className="font-semibold">
                {language === 'fr' ? 'Tradition :' : 'Tradition:'}
              </span>{' '}
              {language === 'fr'
                ? `Dans 'Ilm al-Ḥurūf, chaque planète a des noms divins associés qui résonnent avec son énergie spirituelle.`
                : `In 'Ilm al-Ḥurūf, each planet has associated divine names that resonate with its spiritual energy.`}
            </p>
            <p>
              <span className="font-semibold">
                {language === 'fr' ? 'Cette heure :' : 'This hour:'}
              </span>{' '}
              {language === 'fr'
                ? `L'heure de ${currentHour.planet.name} harmonise avec "${dhikr.meaning}" (${dhikr.name}).`
                : `The ${currentHour.planet.name} hour harmonizes with "${dhikr.meaning}" (${dhikr.name}).`}
            </p>
            <p>
              <span className="font-semibold">
                {language === 'fr' ? 'Nombre recommandé :' : 'Recommended count:'}
              </span>{' '}
              {language === 'fr'
                ? `${dhikr.count} fois, basé sur la valeur numérologique traditionnelle.`
                : `${dhikr.count} times, based on traditional numerological value.`}
            </p>
            <p className="text-xs italic text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-600">
              {language === 'fr'
                ? '💡 Conseil : Récitez avec intention et présence. La qualité prime sur la quantité.'
                : '💡 Tip: Recite with intention and presence. Quality over quantity.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
