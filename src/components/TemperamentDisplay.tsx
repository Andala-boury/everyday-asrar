/**
 * Enhanced Temperament Display Component
 * Shows psychological traits + career guidance for Fire/Water/Air/Earth
 * Bilingual (EN/FR) - Modern, non-deterministic tone
 */

'use client';

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTemperamentProfile } from '../data/temperamentProfiles';
import type { TemperamentElement } from '../types/temperament';
import { Flame, Droplet, Wind, Mountain, Brain, Briefcase, AlertCircle, Lightbulb } from 'lucide-react';

interface TemperamentDisplayProps {
  element: TemperamentElement;
  compact?: boolean;
  showCareer?: boolean;
  showPsychology?: boolean;
}

export function TemperamentDisplay({
  element,
  compact = false,
  showCareer = true,
  showPsychology = true
}: TemperamentDisplayProps) {
  const { language, t } = useLanguage();
  const profile = getTemperamentProfile(element);
  
  const isFrench = language === 'fr';
  
  // Element icons
  const elementIcons = {
    fire: Flame,
    water: Droplet,
    air: Wind,
    earth: Mountain
  };
  
  const ElementIcon = elementIcons[element];
  
  // Element colors
  const elementColors = {
    fire: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    water: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    air: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    earth: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  };

  if (compact) {
    return (
      <div className={`p-4 rounded-lg border ${elementColors[element]}`}>
        <div className="flex items-center gap-2 mb-2">
          <ElementIcon className="w-5 h-5" />
          <h3 className="font-semibold">
            {isFrench ? profile.nameFr : profile.name} {t.temperament.title}
          </h3>
        </div>
        <p className="text-sm opacity-80">
          {isFrench ? profile.qualityFr : profile.quality}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-4 rounded-lg border ${elementColors[element]}`}>
        <div className="flex items-center gap-3 mb-2">
          <ElementIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold">
            {isFrench ? profile.nameFr : profile.name} {profile.icon}
          </h2>
        </div>
        <p className="text-sm opacity-80">
          {isFrench ? profile.qualityFr : profile.quality}
        </p>
      </div>

      {/* Psychological Profile */}
      {showPsychology && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <h3 className="text-lg font-semibold">{t.temperament.psychologyTitle}</h3>
          </div>

          {/* Core Traits */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <span className="text-sm">✨</span>
              {t.temperament.traits}
            </h4>
            <ul className="space-y-1 text-sm">
              {(isFrench ? profile.psychology.traitsFr : profile.psychology.traits).map((trait, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="opacity-50">•</span>
                  <span>{trait}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strengths */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <span className="text-sm">💪</span>
              {t.temperament.strengths}
            </h4>
            <ul className="space-y-1 text-sm">
              {(isFrench ? profile.psychology.strengthsFr : profile.psychology.strengths).map((strength, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="opacity-50">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Watch Outs */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {t.temperament.watchOuts}
            </h4>
            <ul className="space-y-1 text-sm opacity-90">
              {(isFrench ? profile.psychology.watchOutsFr : profile.psychology.watchOuts).map((watchOut, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="opacity-50">•</span>
                  <span>{watchOut}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Balance Tips */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {t.temperament.balanceTips}
            </h4>
            <ul className="space-y-1 text-sm">
              {(isFrench ? profile.psychology.balanceTipsFr : profile.psychology.balanceTips).map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="opacity-50">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Career Guidance */}
      {showCareer && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            <h3 className="text-lg font-semibold">{t.temperament.careerTitle}</h3>
          </div>

          {/* Career Rationale */}
          <p className="text-sm opacity-90 italic">
            {isFrench ? profile.career.rationaleFr : profile.career.rationale}
          </p>

          {/* Good Fits */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <span className="text-sm">✅</span>
              {t.temperament.careerGoodFits}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {(isFrench ? profile.career.goodFitsFr : profile.career.goodFits).map((fit, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded bg-white/5">
                  <span className="opacity-50">•</span>
                  <span>{fit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Areas to Avoid */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              {t.temperament.careerAvoid}
            </h4>
            <ul className="space-y-1 text-sm opacity-80">
              {(isFrench ? profile.career.avoidFr : profile.career.avoid).map((avoid, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="opacity-50">•</span>
                  <span>{avoid}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs opacity-70">
        <p>
          {isFrench 
            ? "Ces profils sont des tendances générales, pas des règles absolues. Vos expériences, compétences et choix façonnent votre parcours unique." 
            : "These profiles are general tendencies, not absolute rules. Your experiences, skills, and choices shape your unique path."}
        </p>
      </div>
    </div>
  );
}

/**
 * Compact temperament badge for inline display
 */
export function TemperamentBadge({ element }: { element: TemperamentElement }) {
  const { language } = useLanguage();
  const profile = getTemperamentProfile(element);
  const isFrench = language === 'fr';
  
  const elementIcons = {
    fire: Flame,
    water: Droplet,
    air: Wind,
    earth: Mountain
  };
  
  const elementColors = {
    fire: 'text-orange-500 bg-orange-500/10',
    water: 'text-blue-500 bg-blue-500/10',
    air: 'text-cyan-500 bg-cyan-500/10',
    earth: 'text-emerald-500 bg-emerald-500/10'
  };
  
  const ElementIcon = elementIcons[element];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${elementColors[element]}`}>
      <ElementIcon className="w-4 h-4" />
      <span>{isFrench ? profile.nameFr : profile.name}</span>
    </span>
  );
}
