'use client';

import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface ArabicKeyboardProps {
  onKeyPress: (char: string) => void;
  onClose?: () => void;
}

const ARABIC_KEYS = [
  // Row 1
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  // Row 2
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  // Row 3
  ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'],
  // Row 4 - Special characters and diacritics
  ['ذ', 'ـ', 'َ', 'ِ', 'ُ', 'ّ', 'ْ', 'ً', 'ٍ', 'ٌ', ' ']
];

const KEY_LABELS: Record<string, string> = {
  ' ': 'Space',
  'َ': 'Fatha',
  'ِ': 'Kasra',
  'ُ': 'Damma',
  'ّ': 'Shadda',
  'ْ': 'Sukun',
  'ً': 'Tanwin F',
  'ٍ': 'Tanwin K',
  'ٌ': 'Tanwin D',
  'ـ': 'Tatweel'
};

export function ArabicKeyboard({ onKeyPress, onClose }: ArabicKeyboardProps) {
  return (
    <div className="bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-slate-300 dark:border-slate-600 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Keyboard className="w-4 h-4" />
          <span className="text-sm font-medium">Arabic Keyboard</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
            aria-label="Close keyboard"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {ARABIC_KEYS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`
                  min-w-[2.5rem] h-10 px-2 rounded font-arabic text-lg
                  bg-white dark:bg-slate-800 
                  border border-slate-300 dark:border-slate-600
                  hover:bg-slate-50 dark:hover:bg-slate-700
                  active:bg-slate-200 dark:active:bg-slate-600
                  transition-colors
                  ${key === ' ' ? 'flex-grow' : ''}
                `}
                title={KEY_LABELS[key] || key}
              >
                <span className="block">
                  {KEY_LABELS[key] === 'Space' ? '␣' : key}
                </span>
                {KEY_LABELS[key] && KEY_LABELS[key] !== 'Space' && (
                  <span className="block text-[0.6rem] text-slate-500 dark:text-slate-400 leading-none">
                    {KEY_LABELS[key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
        
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onKeyPress('⌫')}
            className="flex-1 h-10 px-4 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-medium transition-colors"
          >
            ⌫ Backspace
          </button>
          <button
            onClick={() => onKeyPress('⎵')}
            className="flex-1 h-10 px-4 rounded bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium transition-colors"
          >
            ⎵ Space
          </button>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
        Click letters to type • Includes diacritics (tashkeel)
      </p>
    </div>
  );
}
