'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';

interface InfoTooltipProps {
  title?: string;
  content: string | string[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: string;
}

export function InfoTooltip({ 
  title, 
  content, 
  position = 'top',
  maxWidth = '280px' 
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissTimeout, setDismissTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsVisible(true);
    if (dismissTimeout) clearTimeout(dismissTimeout);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleClick = () => {
    setIsVisible(!isVisible);
    
    // Auto-dismiss after 10 seconds on mobile
    if (!isVisible) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      setDismissTimeout(timeout);
    }
  };

  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  // Position classes
  const positionClasses: Record<typeof position, { wrapper: string; arrow: string }> = {
    top: {
      wrapper: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      arrow: 'absolute top-full left-1/2 transform -translate-x-1/2 -mt-[1px] border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800 dark:border-t-slate-700'
    },
    bottom: {
      wrapper: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      arrow: 'absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-[1px] border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-slate-800 dark:border-b-slate-700'
    },
    left: {
      wrapper: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      arrow: 'absolute left-full top-1/2 transform -translate-y-1/2 -ml-[1px] border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-slate-800 dark:border-l-slate-700'
    },
    right: {
      wrapper: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
      arrow: 'absolute right-full top-1/2 transform -translate-y-1/2 -mr-[1px] border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-slate-800 dark:border-r-slate-700'
    }
  };

  const { wrapper, arrow } = positionClasses[position];

  return (
    <div className="relative inline-block ml-1">
      <button
        type="button"
        className="inline-flex items-center justify-center w-4 h-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={isVisible ? 'info-tooltip' : undefined}
        aria-label={title || 'Learn more'}
      >
        <Info className="w-4 h-4" />
      </button>

      {isVisible && (
        <div
          id="info-tooltip"
          role="tooltip"
          className={`absolute z-50 animate-in fade-in duration-150 ${wrapper}`}
          style={{ width: maxWidth }}
        >
          {/* Arrow */}
          <div className={arrow}></div>

          {/* Content */}
          <div className="bg-slate-800 dark:bg-slate-700 text-slate-100 rounded-lg shadow-lg p-3 text-xs leading-relaxed">
            {title && (
              <div className="font-semibold mb-2 pb-2 border-b border-slate-600 dark:border-slate-500">
                {title}
              </div>
            )}
            
            {Array.isArray(content) ? (
              <div className="space-y-2">
                {content.map((text, idx) => (
                  <p key={idx} className="text-slate-200 dark:text-slate-100">
                    {text}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-slate-200 dark:text-slate-100 whitespace-pre-line">
                {content}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
