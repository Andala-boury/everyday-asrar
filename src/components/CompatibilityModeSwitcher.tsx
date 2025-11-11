import React from 'react';
import { Clock, Heart } from 'lucide-react';
import { CompatibilityMode } from '../types/compatibility';

interface CompatibilityModeSwitcherProps {
  currentMode: CompatibilityMode;
  onModeChange: (mode: CompatibilityMode) => void;
  language?: 'en' | 'fr' | 'ar';
}

export function CompatibilityModeSwitcher({ 
  currentMode, 
  onModeChange,
  language = 'en'
}: CompatibilityModeSwitcherProps) {
  const isFrench = language === 'fr';
  
  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-gray-100 dark:bg-slate-800 rounded-lg">
      
      <button
        onClick={() => onModeChange('transit')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
          currentMode === 'transit'
            ? 'bg-indigo-600 text-white shadow-lg scale-105'
            : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
        }`}
      >
        <Clock className="w-5 h-5" />
        <div className="text-left">
          <div className="text-sm">{isFrench ? 'Mode Transit' : 'Transit Mode'}</div>
          <div className="text-xs opacity-80">{isFrench ? 'Heures Planétaires' : 'Planetary Hours'}</div>
        </div>
      </button>
      
      <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
      
      <button
        onClick={() => onModeChange('relationship')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
          currentMode === 'relationship'
            ? 'bg-rose-600 text-white shadow-lg scale-105'
            : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
        }`}
      >
        <Heart className="w-5 h-5" />
        <div className="text-left">
          <div className="text-sm">{isFrench ? 'Mode Relation' : 'Relationship Mode'}</div>
          <div className="text-xs opacity-80">{isFrench ? 'Compatibilité des Noms' : 'Name Compatibility'}</div>
        </div>
      </button>
      
    </div>
  );
}
