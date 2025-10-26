'use client';

import React from 'react';
import { useAbjad } from '../contexts/AbjadContext';
import { Globe2 } from 'lucide-react';

export function AbjadSystemSelector({ compact = false }: { compact?: boolean } = {}) {
  const { system, setSystem } = useAbjad();

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
        <button
          onClick={() => setSystem('Maghribi')}
          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
            system === 'Maghribi'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          Maghribi
        </button>
        <button
          onClick={() => setSystem('Mashriqi')}
          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
            system === 'Mashriqi'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          Mashriqi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Globe2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              Abjad System
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Current Mode: <span className="font-medium text-indigo-600 dark:text-indigo-400">{system}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSystem('Maghribi')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              system === 'Maghribi'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-indigo-400'
            }`}
          >
            Maghribi
            <div className="text-xs opacity-75">Western</div>
          </button>
          <button
            onClick={() => setSystem('Mashriqi')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              system === 'Mashriqi'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-indigo-400'
            }`}
          >
            Mashriqi
            <div className="text-xs opacity-75">Eastern</div>
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          {system === 'Maghribi' ? (
            <>
              <span className="font-medium">Maghribi System:</span> Traditional North African method (ش=1000, غ=300)
            </>
          ) : (
            <>
              <span className="font-medium">Mashriqi System:</span> Standard Eastern method (ش=300, غ=1000)
            </>
          )}
        </div>
      </div>
    </div>
  );
}
