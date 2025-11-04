'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles, Calculator, BookOpen, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const getTutorialSteps = (t: any) => [
  {
    id: 1,
    title: t?.onboarding?.welcome || "Welcome to Asrār Everyday! 🌙",
    description: "Explore the beautiful tradition of ʿIlm al-Ḥurūf (Science of Letters) - an Islamic science that reveals numerical values and elemental associations in Arabic text.",
    icon: Sparkles,
    highlight: null
  },
  {
    id: 2,
    title: t?.onboarding?.enterText || "Enter Your Text",
    description: "Type in English/French (like 'Rahim' or 'Fatou') and we'll transliterate to Arabic. Or use the Arabic keyboard for direct input. Always verify the Arabic spelling for accuracy!",
    icon: Calculator,
    highlight: "input-section"
  },
  {
    id: 3,
    title: t?.onboarding?.understanding || "Understanding Your Analysis",
    description: "• Kabīr (الكبير): Total numerical value\n• Ṣaghīr (الصغير): Digital root (1-9)\n• Elements: Fire 🔥 Water 💧 Air 🌬 Earth 🌍\n• Ḥadath: Elemental influence pattern",
    icon: BookOpen,
    highlight: null
  },
  {
    id: 4,
    title: "Explore Deeper",
    description: "Discover Quranic verses, Divine Names, and spiritual guidance based on your elemental profile. Use History to save calculations, and Comparison mode to explore relationships!",
    icon: Lightbulb,
    highlight: null
  }
];

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingTutorial({ isOpen, onClose }: OnboardingTutorialProps) {
  const { t } = useLanguage();
  const TUTORIAL_STEPS = getTutorialSteps(t);
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const step = TUTORIAL_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      handleClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    if (dontShowAgain || isLastStep) {
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'Escape') handleSkip();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
        onClick={handleSkip}
        aria-hidden="true"
      />

      {/* Modal - RESPONSIVE SIZING */}
      <div className="relative z-10 w-full max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header - RESPONSIVE PADDING */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="text-xs sm:text-sm font-medium text-white/90">
                Step {currentStep + 1} of {TUTORIAL_STEPS.length}
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors touch-manipulation"
              aria-label={t?.onboarding?.closeTutorial || "Close tutorial"}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content - SCROLLABLE + RESPONSIVE */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
            {/* Title - RESPONSIVE TEXT */}
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {step.title}
            </h2>

            {/* Description - RESPONSIVE TEXT + LINE HEIGHT */}
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {step.description}
            </p>

            {/* Last step: Don't show again checkbox */}
            {isLastStep && (
              <label className="flex items-start gap-3 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg cursor-pointer touch-manipulation">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-5 h-5 sm:w-4 sm:h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Don't show this tutorial again
                </span>
              </label>
            )}

            {/* Progress Indicator */}
            <div className="flex gap-2 pt-2">
              {TUTORIAL_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 sm:h-1 flex-1 rounded-full transition-colors ${
                    index <= currentStep
                      ? 'bg-indigo-600'
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Footer - RESPONSIVE BUTTONS + PADDING */}
          <div className="border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-3 bg-slate-50 dark:bg-slate-900/50 flex-shrink-0">
            {/* Previous button - BIGGER TOUCH TARGET */}
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-all min-h-[44px] touch-manipulation ${
                isFirstStep
                  ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95'
              }`}
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm sm:text-base">Previous</span>
            </button>

            {/* Next/Done button - BIGGER + RESPONSIVE TEXT */}
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105 active:scale-95 min-h-[44px] touch-manipulation"
              aria-label={isLastStep ? 'Complete tutorial' : 'Next step'}
            >
              <span className="text-sm sm:text-base">
                {isLastStep ? "Let's Begin!" : 'Next'}
              </span>
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingTutorial;