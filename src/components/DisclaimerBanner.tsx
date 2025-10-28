'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

/**
 * Disclaimer Banner Component
 * Displays important legal/ethical notice about the app's purpose and limitations
 */
export function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed disclaimer before
    const dismissed = localStorage.getItem('disclaimerDismissed');
    if (!dismissed) {
      setIsVisible(true);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('disclaimerDismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-50 border-b-2 border-amber-200 shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
          
          <div className="flex-1 text-sm text-amber-900">
            <p className="font-bold mb-2">📖 Important Notice About This Application</p>
            
            <p className="mb-2">
              <strong>Spiritual Reflection Tool Only:</strong> This application provides guidance based on classical 
              <em> ʿIlm al-Ḥurūf</em> (Islamic Science of Letters) traditions. It is designed for <strong>spiritual 
              reflection and understanding</strong>, not for divination, prediction, or guaranteeing outcomes.
            </p>

            <p className="mb-2">
              <strong>Key Limitations:</strong>
            </p>
            <ul className="list-disc list-inside mb-2 ml-2 space-y-1">
              <li>These calculations <strong>do not predict the future</strong> or guarantee specific results</li>
              <li>This is <strong>not divination, fortune-telling, or Islamic legal guidance</strong> (fatwa)</li>
              <li>Your <strong>free will and personal choices</strong> remain your own responsibility</li>
              <li>The Divine alone controls all outcomes (<em>Qadr</em>)</li>
              <li>Use this for <strong>self-reflection and timing</strong>, not as substitute for professional advice</li>
            </ul>

            <p className="mb-2">
              <strong>Always:</strong> Consult qualified Islamic scholars for religious guidance and professional 
              advisors for important personal/financial decisions. This tool should complement, not replace, 
              practical wisdom and professional counsel.
            </p>

            <p className="text-xs italic text-amber-800">
              May this knowledge bring you closer to understanding the divine wisdom woven into creation. 
              <em> Wa 'alaikum assalaam wa rahmatullahi wa barakatuh</em> ✨
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-amber-600 hover:text-amber-800 transition-colors"
            aria-label="Dismiss disclaimer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
