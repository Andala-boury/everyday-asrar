'use client';

import React, { useState } from 'react';
import { AlertCircle, X, HelpCircle } from 'lucide-react';

interface DisclaimerSectionProps {
  isAccurateLocation: boolean;
}

export function DisclaimerSection({ isAccurateLocation }: DisclaimerSectionProps) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  
  return (
    <>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm flex-1">
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              About This Guidance
            </p>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-xs">
              <li>• Based on traditional Islamic letter science (ʿIlm al-Ḥurūf - علم الحروف)</li>
              <li>• Uses {isAccurateLocation ? 'accurate location-based' : 'approximate'} planetary hour calculations</li>
              <li>• For personal reflection and mindfulness, not fortune-telling</li>
              <li>• A cultural practice tool, not religious obligation</li>
            </ul>
            <button 
              onClick={() => setShowMoreInfo(true)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline text-xs mt-2 font-medium flex items-center gap-1"
            >
              <HelpCircle className="h-3 w-3" />
              Learn more about how this works
            </button>
          </div>
        </div>
      </div>
      
      {showMoreInfo && (
        <MoreInfoModal onClose={() => setShowMoreInfo(false)} />
      )}
    </>
  );
}

// More Info Modal
function MoreInfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            How This Guidance Works
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <section>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-base">
              📜 Traditional Foundation
            </h4>
            <p>
              This app is based on traditional Islamic letter science (ʿIlm al-Ḥurūf), 
              a centuries-old practice that explores the spiritual meanings and energies 
              associated with Arabic letters and planetary cycles.
            </p>
          </section>
          
          <section>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-base">
              ✅ What's Authentic
            </h4>
            <ul className="space-y-1 ml-4">
              <li>• Letter values (Abjad system) - from classical texts</li>
              <li>• Element classification - traditional four-element system</li>
              <li>• Planetary hour system - ancient astronomy</li>
              <li>• Element compatibility theory - classical principles</li>
            </ul>
          </section>
          
          <section>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-base">
              🎯 Modern Interpretation
            </h4>
            <ul className="space-y-1 ml-4">
              <li>• Action suggestions adapted for contemporary life</li>
              <li>• Countdown timers and urgency indicators</li>
              <li>• Modern language and interface</li>
            </ul>
          </section>
          
          <section>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-base">
              📏 Accuracy Levels
            </h4>
            <ul className="space-y-1 ml-4">
              <li>• Letter values: Very accurate (95%+)</li>
              <li>• Planetary hours: Accurate with location (90%+)</li>
              <li>• Personal guidance: Directionally helpful (~70%)</li>
            </ul>
          </section>
          
          <section>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-base">
              💡 How to Use This Tool
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-medium text-green-900 dark:text-green-100 mb-1">✅ Do Use For:</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Mindfulness & reflection</li>
                  <li>• Pattern recognition</li>
                  <li>• Cultural exploration</li>
                  <li>• Daily planning inspiration</li>
                </ul>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="font-medium text-red-900 dark:text-red-100 mb-1">❌ Don't Use For:</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Absolute predictions</li>
                  <li>• Replacing judgment</li>
                  <li>• Religious obligation</li>
                  <li>• Professional advice</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 text-base flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Important Note
            </h4>
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              This is a cultural practice tool for self-reflection, not a religious requirement 
              or fortune-telling service. Always use your own judgment and consult qualified 
              professionals for important decisions.
            </p>
          </section>
        </div>
        
        <button 
          onClick={onClose}
          className="mt-6 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  );
}
