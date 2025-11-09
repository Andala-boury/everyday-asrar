'use client';

import React, { useState, useEffect } from 'react';
import { DivineTiming } from '@/components/divine-timing';
import type { Element } from '@/types/planetary';

/**
 * Example Page: Advanced Divine Timing Module
 * 
 * This page demonstrates how to integrate the new Divine Timing module
 * into your application. It handles user element detection and provides
 * a fallback for users who haven't calculated their element yet.
 */

export default function DivineTimingPage() {
  const [userElement, setUserElement] = useState<Element | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Try to get user element from localStorage or your state management
    const savedElement = localStorage.getItem('userElement') as Element | null;
    
    if (savedElement) {
      setUserElement(savedElement);
    }
    
    setIsLoading(false);
  }, []);
  
  // If we're still checking for saved data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  // If user hasn't calculated their element yet
  if (!userElement) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="text-6xl">🌟</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Discover Your Element
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Calculate your personal element first to receive tailored divine timing guidance.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all shadow-lg"
            >
              Calculate My Element
            </button>
            
            {/* Quick test - remove in production */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 text-center">
                Or try with a sample element:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(['fire', 'water', 'air', 'earth'] as Element[]).map((element) => (
                  <button
                    key={element}
                    onClick={() => {
                      setUserElement(element);
                      localStorage.setItem('userElement', element);
                    }}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors capitalize"
                  >
                    {element === 'fire' && '🔥'} 
                    {element === 'water' && '💧'} 
                    {element === 'air' && '💨'} 
                    {element === 'earth' && '🌍'} 
                    {' '}{element}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Main Divine Timing Interface
  return <DivineTiming userElement={userElement} />;
}
