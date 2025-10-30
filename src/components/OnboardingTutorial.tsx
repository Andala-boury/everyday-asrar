'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles, Calculator, BookOpen, Lightbulb } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    id: 1,
    title: "Welcome to Asrār Everyday! 🌙",
    description: "Explore the beautiful tradition of ʿIlm al-Ḥurūf (Science of Letters) - an Islamic science that reveals numerical values and elemental associations in Arabic text.",
    icon: Sparkles,
    highlight: null
  },
  {
    id: 2,
    title: "Enter Your Text",
    description: "Type in English/French (like 'Rahim' or 'Fatou') and we'll transliterate to Arabic. Or use the Arabic keyboard for direct input. Always verify the Arabic spelling for accuracy!",
    icon: Calculator,
    highlight: "input-section"
  },
  {
    id: 3,
    title: "Understanding Your Analysis",
    description: "• Kabīr (الكبير): Total numerical value of all letters\n• Ṣaghīr (الصغير): Digital root (reduced to 1-9)\n• Elements: Fire 🔥 Water 💧 Air 🌬 Earth 🌍 associations\n• Ḥadath: Remainder pattern revealing elemental influence",
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
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'Escape') handleSkip();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, isOpen, isLastStep, isFirstStep]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={handleSkip}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="w-6 h-6 text-white" />
              <span className="text-sm font-medium text-white/80">Step {currentStep + 1} of {TUTORIAL_STEPS.length}</span>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close tutorial"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {step.title}
              </h2>
            </div>

            {/* Description */}
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {step.description}
            </p>

            {/* Last step: Don't show again checkbox */}
            {isLastStep && (
              <label className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Don't show this tutorial again
                </span>
              </label>
            )}

            {/* Progress Indicator */}
            <div className="flex gap-2">
              {TUTORIAL_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    index <= currentStep
                      ? 'bg-indigo-600'
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50">
            {/* Left: Previous button */}
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isFirstStep
                  ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Right: Next/Done button */}
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105"
              aria-label={isLastStep ? 'Complete tutorial' : 'Next step'}
            >
              {isLastStep ? "Let's Begin!" : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingTutorial;
