'use client';

import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface AccuracyIndicatorProps {
  isAccurateLocation: boolean;
  onRequestUpdate?: () => void;
}

export function AccuracyIndicator({ isAccurateLocation, onRequestUpdate }: AccuracyIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {isAccurateLocation ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">
            Using precise planetary hours (location-based)
          </span>
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">
            Using approximate timing
          </span>
          {onRequestUpdate && (
            <button 
              onClick={onRequestUpdate}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline ml-auto font-medium text-xs"
            >
              Enable location →
            </button>
          )}
        </>
      )}
    </div>
  );
}
