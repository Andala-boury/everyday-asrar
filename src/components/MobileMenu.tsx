'use client';

import React, { useState } from 'react';
import { X, HelpCircle, History, Info, BookOpen } from 'lucide-react';
import { AbjadSystemSelector } from './AbjadSystemSelector';
import { useLanguage } from '../contexts/LanguageContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShowTutorial: () => void;
  onShowHistory: () => void;
  historyCount: number;
}

export function MobileMenu({
  isOpen,
  onClose,
  onShowTutorial,
  onShowHistory,
  historyCount
}: MobileMenuProps) {
  const { t } = useLanguage();
  const [expandAbout, setExpandAbout] = useState(false);
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-in Menu */}
      <div
        className={`fixed right-0 top-0 h-screen w-80 max-w-[90vw] bg-white dark:bg-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className="sticky top-0 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between bg-white dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t.nav.menu}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label={t?.controls?.closeMenu || "Close menu"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-4 space-y-6">
          {/* Abjad System Selector - UNIQUE TO MOBILE */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              📿 Abjad System
            </label>
            <AbjadSystemSelector compact={false} />
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-200 dark:bg-slate-700" />

          {/* Help & Tutorial */}
          <button
            onClick={() => {
              onShowTutorial();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 sm:py-4 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors text-slate-900 dark:text-slate-100 min-h-[48px]"
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0 text-blue-500" />
            <span className="font-medium text-base">Help & Tutorial</span>
          </button>

          {/* Divider */}
          <div className="h-px bg-slate-200 dark:bg-slate-700" />

          {/* History */}
          <button
            onClick={() => {
              onShowHistory();
              onClose();
            }}
            className="w-full flex items-center justify-between px-4 py-3 sm:py-4 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors text-slate-900 dark:text-slate-100 min-h-[48px]"
          >
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 flex-shrink-0 text-indigo-500" />
              <span className="font-medium text-base">History</span>
            </div>
            {historyCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full ml-2 flex-shrink-0">
                {historyCount > 99 ? '99+' : historyCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="h-px bg-slate-200 dark:bg-slate-700" />

          {/* About Section - Expandable */}
          <div className="space-y-2">
            <button
              onClick={() => setExpandAbout(!expandAbout)}
              className="w-full flex items-center justify-between px-4 py-3 sm:py-4 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors text-slate-900 dark:text-slate-100 min-h-[48px]"
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 flex-shrink-0 text-amber-500" />
                <span className="font-medium text-base">About This App</span>
              </div>
              <BookOpen className={`w-4 h-4 flex-shrink-0 transition-transform ${expandAbout ? 'rotate-180' : ''}`} />
            </button>

            {/* About Content - Expandable */}
            {expandAbout && (
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-600/30 rounded-lg space-y-3 border border-slate-200 dark:border-slate-600">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Asrār Everyday</strong> is your guide to the Islamic sciences of <strong>ʿIlm al-Ḥurūf</strong> (Science of Letters) and <strong>ʿIlm al-ʿAdad</strong> (Science of Numbers).
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Discover the sacred numerical values and elemental associations within Arabic text, connecting language to the deeper patterns of creation.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 pt-1">
                  Version 1.0 • © 2025
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
