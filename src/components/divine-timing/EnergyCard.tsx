'use client';

import { useLanguage } from '../../contexts/LanguageContext';
import { AccuratePlanetaryHour, Element } from '../../types/planetary';
import { Clock, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Alignment {
  quality: 'strong' | 'moderate' | 'neutral' | 'weak';
  qualityArabic: string;
  harmonyScore: number;
  color: string;
  description: string;
}

interface EnergyCardProps {
  currentHour: AccuratePlanetaryHour;
  alignment: Alignment;
  userElement: Element;
  onViewTimeline: () => void;
  onOpenDhikr: () => void;
  currentTime: Date;
}

const PLANET_EMOJIS: Record<string, string> = {
  Sun: '☀️',
  Moon: '🌙',
  Mars: '♂️',
  Mercury: '☿️',
  Jupiter: '♃',
  Venus: '♀️',
  Saturn: '♄',
};

const ELEMENT_EMOJIS: Record<Element, string> = {
  fire: '🔥',
  air: '💨',
  water: '💧',
  earth: '🌍',
};

export function EnergyCard({
  currentHour,
  alignment,
  userElement,
  onViewTimeline,
  onOpenDhikr,
  currentTime,
}: EnergyCardProps) {
  const { t, language } = useLanguage();
  const isFr = language === 'fr';
  const [timeRemaining, setTimeRemaining] = useState('');
  const [progress, setProgress] = useState(0);

  // Calculate time remaining and progress
  useEffect(() => {
    const updateProgress = () => {
      const now = Date.now();
      const start = currentHour.startTime.getTime();
      const end = currentHour.endTime.getTime();
      const total = end - start;
      const elapsed = now - start;
      const remaining = end - now;

      if (remaining <= 0) {
        setTimeRemaining(isFr ? 'Terminé' : 'Ended');
        setProgress(100);
        return;
      }

      // Calculate progress percentage
      const progressPercent = Math.min(100, (elapsed / total) * 100);
      setProgress(progressPercent);

      // Format remaining time
      const minutes = Math.floor(remaining / 60000);
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      if (hours > 0) {
        setTimeRemaining(
          isFr 
            ? `${hours}h ${mins}min restantes`
            : `${hours}h ${mins}min remaining`
        );
      } else {
        setTimeRemaining(
          isFr 
            ? `${mins} minutes restantes`
            : `${mins} minutes remaining`
        );
      }
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [currentHour, isFr]);

  // Get gradient based on alignment quality
  const getGradient = () => {
    switch (alignment.quality) {
      case 'strong':
        return 'from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/40 dark:via-green-950/40 dark:to-teal-950/40';
      case 'moderate':
        return 'from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40';
      case 'neutral':
        return 'from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950/40 dark:via-amber-950/40 dark:to-orange-950/40';
      case 'weak':
        return 'from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/40 dark:via-red-950/40 dark:to-pink-950/40';
    }
  };

  // Get simple, friendly guidance
  const getGuidanceText = () => {
    const quality = alignment.quality;
    
    if (quality === 'strong') {
      return isFr
        ? '✨ Moment parfait pour agir avec confiance'
        : '✨ Perfect time to act with confidence';
    } else if (quality === 'moderate') {
      return isFr
        ? '💫 Bon moment pour progresser doucement'
        : '💫 Good time to make steady progress';
    } else if (quality === 'neutral') {
      return isFr
        ? '🌟 Énergie équilibrée - avancez avec prudence'
        : '🌟 Balanced energy - proceed thoughtfully';
    } else {
      return isFr
        ? '🌙 Moment pour se reposer et réfléchir'
        : '🌙 Time to rest and reflect';
    }
  };

  // Get action recommendations based on planet and quality
  const getActionRecommendations = () => {
    const planet = currentHour.planet.name;
    const quality = alignment.quality;
    
    const actions: Record<string, { strong: string[], moderate: string[], weak: string[] }> = {
      Sun: {
        strong: isFr 
          ? ['Prendre des décisions importantes', 'Diriger et inspirer', 'Commencer de nouveaux projets']
          : ['Make important decisions', 'Lead and inspire others', 'Start new projects'],
        moderate: isFr
          ? ['Travailler sur des tâches importantes', 'Rencontrer des personnes influentes']
          : ['Work on important tasks', 'Meet influential people'],
        weak: isFr
          ? ['Éviter les confrontations', 'Se reposer et récupérer']
          : ['Avoid confrontations', 'Rest and recharge'],
      },
      Moon: {
        strong: isFr
          ? ['Méditer et prier', 'Passer du temps en famille', 'Écouter votre intuition']
          : ['Meditate and pray', 'Spend time with family', 'Trust your intuition'],
        moderate: isFr
          ? ['Activités créatives', 'Conversations émotionnelles']
          : ['Creative activities', 'Emotional conversations'],
        weak: isFr
          ? ['Éviter les décisions émotionnelles', 'Prendre du recul']
          : ['Avoid emotional decisions', 'Take a step back'],
      },
      Mercury: {
        strong: isFr
          ? ['Étudier et apprendre', 'Écrire et communiquer', 'Négocier et planifier']
          : ['Study and learn', 'Write and communicate', 'Negotiate and plan'],
        moderate: isFr
          ? ['Lire et rechercher', 'Envoyer des messages importants']
          : ['Read and research', 'Send important messages'],
        weak: isFr
          ? ['Éviter les malentendus', 'Relire avant d\'envoyer']
          : ['Avoid misunderstandings', 'Double-check messages'],
      },
      Venus: {
        strong: isFr
          ? ['Profiter de l\'amour et de la beauté', 'Créer de l\'art', 'Socialiser']
          : ['Enjoy love and beauty', 'Create art', 'Socialize'],
        moderate: isFr
          ? ['Activités agréables', 'Améliorer les relations']
          : ['Pleasant activities', 'Improve relationships'],
        weak: isFr
          ? ['Éviter les dépenses excessives', 'Reporter les décisions romantiques']
          : ['Avoid excessive spending', 'Postpone romantic decisions'],
      },
      Mars: {
        strong: isFr
          ? ['Exercice physique intense', 'Défendre vos positions', 'Agir avec courage']
          : ['Intense physical exercise', 'Stand your ground', 'Act with courage'],
        moderate: isFr
          ? ['Tâches nécessitant de l\'énergie', 'Prendre des initiatives']
          : ['Tasks requiring energy', 'Take initiative'],
        weak: isFr
          ? ['Éviter les conflits', 'Canaliser l\'énergie positivement']
          : ['Avoid conflicts', 'Channel energy positively'],
      },
      Jupiter: {
        strong: isFr
          ? ['Étudier les textes sacrés', 'Planifier l\'avenir', 'Actes de générosité']
          : ['Study sacred texts', 'Plan for future', 'Acts of generosity'],
        moderate: isFr
          ? ['Apprendre et enseigner', 'Voyager et explorer']
          : ['Learn and teach', 'Travel and explore'],
        weak: isFr
          ? ['Éviter la surconfiance', 'Être modeste']
          : ['Avoid overconfidence', 'Practice modesty'],
      },
      Saturn: {
        strong: isFr
          ? ['Travail discipliné', 'Établir des limites', 'Engagement à long terme']
          : ['Disciplined work', 'Set boundaries', 'Long-term commitments'],
        moderate: isFr
          ? ['Tâches structurées', 'Résoudre des problèmes']
          : ['Structured tasks', 'Problem-solving'],
        weak: isFr
          ? ['Éviter la rigidité', 'Prendre soin de soi']
          : ['Avoid rigidity', 'Practice self-care'],
      },
    };

    const planetActions = actions[planet] || actions.Sun;
    return quality === 'strong' || quality === 'moderate'
      ? planetActions[quality]
      : planetActions.weak;
  };

  const recommendations = getActionRecommendations();

  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br ${getGradient()} p-6 md:p-8 shadow-xl`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{PLANET_EMOJIS[currentHour.planet.name]}</span>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {currentHour.planet.name}
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {currentHour.planet.nameArabic}
              </p>
            </div>
          </div>
          <p className="text-base font-medium text-slate-700 dark:text-slate-300">
            {getGuidanceText()}
          </p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{ELEMENT_EMOJIS[currentHour.planet.element as Element]}</span>
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {currentHour.planet.element}
            </span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {currentHour.planet.elementArabic}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{timeRemaining}</span>
          </div>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Alignment indicator */}
      <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/30 rounded-xl mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{ELEMENT_EMOJIS[userElement]}</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {isFr ? 'Votre' : 'Your'} {userElement}
            </span>
          </div>
          <span className="text-slate-400">×</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{ELEMENT_EMOJIS[currentHour.planet.element as Element]}</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {currentHour.planet.element}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold" style={{ color: alignment.color }}>
            {alignment.description}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {alignment.qualityArabic}
          </div>
        </div>
      </div>

      {/* Action recommendations */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          {isFr ? 'Recommandations' : 'Recommendations'}
        </h4>
        <ul className="space-y-2">
          {recommendations.map((action, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
