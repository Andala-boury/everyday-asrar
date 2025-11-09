'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Sparkles, TrendingUp, Minus, TrendingDown } from 'lucide-react';
import type { AccuratePlanetaryHour, ElementAlignment, Element } from '../../types/planetary';

interface EnergyCardProps {
  currentHour: AccuratePlanetaryHour;
  alignment: ElementAlignment;
  userElement: Element;
}

export function EnergyCard({ currentHour, alignment, userElement }: EnergyCardProps) {
  const { t, language } = useLanguage();
  
  // Get energy level description
  const getEnergyLevel = () => {
    switch (alignment.quality) {
      case 'perfect':
        return {
          level: language === 'fr' ? 'Énergie Parfaite' : 'Perfect Energy',
          icon: <Sparkles className="w-6 h-6" />,
          color: 'from-green-500 to-emerald-600',
          textColor: 'text-white',
          emoji: '✨',
          description: language === 'fr' 
            ? 'Moment idéal pour agir avec confiance'
            : 'Perfect time to act with confidence'
        };
      case 'strong':
        return {
          level: language === 'fr' ? 'Forte Énergie' : 'Strong Energy',
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'from-blue-500 to-indigo-600',
          textColor: 'text-white',
          emoji: '💫',
          description: language === 'fr'
            ? 'Excellente période pour progresser'
            : 'Excellent time to make progress'
        };
      case 'moderate':
        return {
          level: language === 'fr' ? 'Énergie Modérée' : 'Moderate Energy',
          icon: <Minus className="w-6 h-6" />,
          color: 'from-yellow-400 to-orange-500',
          textColor: 'text-slate-900',
          emoji: '📊',
          description: language === 'fr'
            ? 'Bon pour le travail constant et régulier'
            : 'Good for steady, consistent work'
        };
      default:
        return {
          level: language === 'fr' ? 'Repos Recommandé' : 'Rest Recommended',
          icon: <TrendingDown className="w-6 h-6" />,
          color: 'from-gray-400 to-gray-500',
          textColor: 'text-white',
          emoji: '🌙',
          description: language === 'fr'
            ? 'Temps de réflexion et de repos'
            : 'Time for reflection and rest'
        };
    }
  };
  
  const energyInfo = getEnergyLevel();
  
  // Get simple planet meaning
  const getPlanetMeaning = (planetName: string) => {
    const meanings: Record<string, { en: string; fr: string }> = {
      'Sun': { en: 'Vitality & Leadership', fr: 'Vitalité & Leadership' },
      'Moon': { en: 'Emotion & Intuition', fr: 'Émotion & Intuition' },
      'Mars': { en: 'Action & Courage', fr: 'Action & Courage' },
      'Mercury': { en: 'Communication & Learning', fr: 'Communication & Apprentissage' },
      'Jupiter': { en: 'Growth & Expansion', fr: 'Croissance & Expansion' },
      'Venus': { en: 'Love & Harmony', fr: 'Amour & Harmonie' },
      'Saturn': { en: 'Structure & Discipline', fr: 'Structure & Discipline' }
    };
    
    return language === 'fr' 
      ? meanings[planetName]?.fr || planetName
      : meanings[planetName]?.en || planetName;
  };
  
  // Calculate time remaining
  const getTimeRemaining = () => {
    const now = new Date();
    const end = currentHour.endTime;
    const diff = end.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return language === 'fr' 
        ? `${hours}h ${mins}min`
        : `${hours}h ${mins}min`;
    }
    return language === 'fr' ? `${mins} min` : `${mins} min`;
  };
  
  // Get element icon
  const getElementIcon = (element: Element) => {
    const icons = {
      fire: '🔥',
      water: '💧',
      air: '💨',
      earth: '🌍'
    };
    return icons[element];
  };
  
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br ${energyInfo.color} p-6 md:p-8`}>
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-24 -mb-24"></div>
      
      {/* Content */}
      <div className="relative z-10 space-y-6">
        
        {/* Energy Level Header */}
        <div className="text-center space-y-3">
          <div className={`flex items-center justify-center gap-3 ${energyInfo.textColor}`}>
            {energyInfo.icon}
            <span className="text-base md:text-lg font-extrabold uppercase tracking-wider">
              {energyInfo.level}
            </span>
          </div>
          <h2 className={`text-3xl md:text-4xl font-extrabold ${energyInfo.textColor} leading-tight`}>
            {energyInfo.description}
          </h2>
        </div>
        
        {/* Planet Info */}
        <div className={`p-5 rounded-xl bg-white/25 backdrop-blur-sm border-2 border-white/40 shadow-lg ${energyInfo.textColor}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{energyInfo.emoji}</span>
              <div>
                <p className="text-xs font-semibold opacity-80 uppercase tracking-wide">
                  {language === 'fr' ? 'Heure Planétaire Actuelle' : 'Current Planetary Hour'}
                </p>
                <p className="text-2xl md:text-3xl font-extrabold">
                  {currentHour.planet.name}
                </p>
                <p className="text-xl font-bold opacity-95 font-arabic">
                  {currentHour.planet.nameArabic}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold opacity-80 uppercase tracking-wide">
                {language === 'fr' ? 'Temps Restant' : 'Time Left'}
              </p>
              <p className="text-3xl font-extrabold">
                {getTimeRemaining()}
              </p>
            </div>
          </div>
          
          <div className="text-base font-semibold opacity-95">
            {getPlanetMeaning(currentHour.planet.name)}
          </div>
        </div>
        
        {/* Element Compatibility */}
        <div className={`flex items-center justify-between p-3 rounded-lg bg-white/10 ${energyInfo.textColor}`}>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-75">
              {language === 'fr' ? 'Vous' : 'You'}:
            </span>
            <span className="font-semibold">
              {getElementIcon(userElement)} {userElement.charAt(0).toUpperCase() + userElement.slice(1)}
            </span>
          </div>
          <div className="text-xl opacity-50">+</div>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-75">
              {language === 'fr' ? 'Heure' : 'Hour'}:
            </span>
            <span className="font-semibold">
              {getElementIcon(currentHour.planet.element)} {currentHour.planet.element.charAt(0).toUpperCase() + currentHour.planet.element.slice(1)}
            </span>
          </div>
          <div className="text-xl opacity-50">=</div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">
              {alignment.harmonyScore}%
            </span>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className={`space-y-3 ${energyInfo.textColor}`}>
          <p className="text-base font-bold opacity-90 uppercase tracking-wide">
            {language === 'fr' ? 'Recommandé maintenant :' : 'Recommended now:'}
          </p>
          <ul className="space-y-2">
            {getQuickActions(alignment.quality, language).map((action, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1 text-lg">•</span>
                <span className="text-base md:text-lg font-medium opacity-95 leading-snug">{action}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Time Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs opacity-75">
            <span>
              {currentHour.startTime.toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', { 
                hour: 'numeric', 
                minute: '2-digit' 
              })}
            </span>
            <span>
              {currentHour.endTime.toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', { 
                hour: 'numeric', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/50 rounded-full transition-all duration-1000"
              style={{ 
                width: `${getProgressPercentage(currentHour)}%` 
              }}
            ></div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

// Helper functions
function getQuickActions(quality: string, language: string): string[] {
  const actions = {
    perfect: {
      en: [
        'Start important projects',
        'Make key decisions',
        'Have crucial conversations',
        'Take bold action'
      ],
      fr: [
        'Lancer des projets importants',
        'Prendre des décisions clés',
        'Avoir des conversations cruciales',
        'Prendre des actions audacieuses'
      ]
    },
    strong: {
      en: [
        'Push forward on goals',
        'Tackle challenging tasks',
        'Communicate clearly',
        'Build momentum'
      ],
      fr: [
        'Progresser sur vos objectifs',
        'S\'attaquer aux tâches difficiles',
        'Communiquer clairement',
        'Créer de l\'élan'
      ]
    },
    moderate: {
      en: [
        'Handle routine tasks',
        'Continue ongoing work',
        'Prepare and organize',
        'Low-stakes activities'
      ],
      fr: [
        'Gérer les tâches routinières',
        'Continuer le travail en cours',
        'Préparer et organiser',
        'Activités à faible enjeu'
      ]
    },
    default: {
      en: [
        'Rest and reflect',
        'Plan for later',
        'Gentle activities',
        'Spiritual practice'
      ],
      fr: [
        'Se reposer et réfléchir',
        'Planifier pour plus tard',
        'Activités douces',
        'Pratique spirituelle'
      ]
    }
  };
  
  const key = (quality === 'weak' || quality === 'opposing') ? 'default' : quality;
  return language === 'fr' 
    ? actions[key as keyof typeof actions]?.fr || actions.default.fr
    : actions[key as keyof typeof actions]?.en || actions.default.en;
}

function getProgressPercentage(hour: AccuratePlanetaryHour): number {
  const now = new Date().getTime();
  const start = hour.startTime.getTime();
  const end = hour.endTime.getTime();
  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}
