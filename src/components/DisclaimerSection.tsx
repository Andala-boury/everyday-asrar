'use client';

import React, { useState } from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { MoreInfoModal } from './MoreInfoModal';

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
