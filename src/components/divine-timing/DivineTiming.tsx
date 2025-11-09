'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Clock, 
  Calendar, 
  Sparkles, 
  Moon, 
  Sun,
  ChevronRight,
  Heart,
  Briefcase,
  BookOpen,
  MessageCircle,
  DollarSign,
  Brain
} from 'lucide-react';
import type { Element, AccuratePlanetaryHour, ElementAlignment } from '../../types/planetary';
import { getUserLocation, saveLocation, loadLocation } from '../../utils/location';
import { calculateAccuratePlanetaryHours, getCurrentPlanetaryHour } from '../../utils/planetaryHours';
import { analyzeAlignment } from '../../utils/alignment';

// Import sub-components  
import { EnergyCard } from './EnergyCard';
import { TimelineView } from './TimelineView';
import { PurposeSelector } from './PurposeSelector';
import { DhikrCard } from './DhikrCard';
import { RestDayView } from './RestDayView';

interface DivineTimingProps {
  userElement: Element;
}

export type UserPurpose = 
  | 'work' 
  | 'prayer' 
  | 'conversation' 
  | 'learning' 
  | 'finance' 
  | 'relationships'
  | null;

export function DivineTiming({ userElement }: DivineTimingProps) {
  const { t, language } = useLanguage();
  
  // State management
  const [location, setLocation] = useState<any>(null);
  const [planetaryHours, setPlanetaryHours] = useState<AccuratePlanetaryHour[]>([]);
  const [currentHour, setCurrentHour] = useState<AccuratePlanetaryHour | null>(null);
  const [alignment, setAlignment] = useState<ElementAlignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPurpose, setSelectedPurpose] = useState<UserPurpose>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Initialize and load data
  useEffect(() => {
    async function initialize() {
      setIsLoading(true);
      
      try {
        // Try to load saved location
        let loc = loadLocation();
        
        // If no saved location, request it
        if (!loc) {
          loc = await getUserLocation();
          if (loc) {
            saveLocation(loc);
          }
        }
        
        if (!loc) {
          // Fallback to Mecca
          loc = {
            latitude: 21.4225,
            longitude: 39.8262,
            cityName: 'Mecca (Fallback)',
            isAccurate: false
          };
        }
        
        setLocation(loc);
        
        // Calculate planetary hours
        const hours = calculateAccuratePlanetaryHours(
          new Date(),
          loc.latitude,
          loc.longitude
        );
        
        if (!hours || hours.length === 0) {
          throw new Error('Failed to calculate planetary hours');
        }
        
        setPlanetaryHours(hours);
        
        // Get current hour
        const current = getCurrentPlanetaryHour(hours);
        if (!current) {
          throw new Error('Unable to determine current planetary hour');
        }
        
        setCurrentHour(current);
        
        // Calculate alignment
        const align = analyzeAlignment(userElement, current.planet.element);
        setAlignment(align);
        
        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (err) {
        console.error('Initialization error:', err);
        setIsLoading(false);
      }
    }
    
    initialize();
  }, [userElement]);

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (!location || planetaryHours.length === 0) return;
      
      const current = getCurrentPlanetaryHour(planetaryHours);
      setCurrentHour(current);
      
      if (current) {
        const align = analyzeAlignment(userElement, current.planet.element);
        setAlignment(align);
      }
      
      setLastUpdated(new Date());
    }, 60000); // Every 60 seconds
    
    return () => clearInterval(interval);
  }, [location, userElement, planetaryHours]);

  // Check if it's a rest day (low harmony across most hours)
  const isRestDay = React.useMemo(() => {
    if (!planetaryHours.length) return false;
    
    const alignments = planetaryHours.map(hour => 
      analyzeAlignment(userElement, hour.planet.element)
    );
    
    const lowEnergyCount = alignments.filter(a => 
      a.quality === 'weak' || a.quality === 'opposing'
    ).length;
    
    return lowEnergyCount > planetaryHours.length * 0.7; // 70% low energy = rest day
  }, [planetaryHours, userElement]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 dark:border-purple-900 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-purple-600 dark:border-purple-400 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            {language === 'fr' ? 'Calcul du moment sacré...' : 'Calculating sacred moment...'}
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (!currentHour || !alignment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">🌙</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {language === 'fr' ? 'Moment indisponible' : 'Moment Unavailable'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {language === 'fr' 
              ? 'Impossible de calculer le moment actuel. Veuillez réessayer.'
              : 'Unable to calculate current moment. Please try again.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            {language === 'fr' ? 'Réessayer' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  // Rest Day View
  if (isRestDay) {
    return (
      <RestDayView 
        userElement={userElement}
        planetaryHours={planetaryHours}
        currentHour={currentHour}
        onShowTimeline={() => setShowTimeline(true)}
      />
    );
  }

  // Main Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3 pt-4 pb-2">
          <div className="flex items-center justify-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
              {language === 'fr' ? 'Guidage Divin' : 'Divine Timing'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {language === 'fr' ? 'En Ce Moment' : 'Right Now'}
          </h1>
          {location && (
            <p className="text-sm font-medium text-slate-700 flex items-center justify-center gap-1">
              <span className="text-lg">📍</span> {location.cityName}
            </p>
          )}
        </div>

        {/* Main Energy Card */}
        <EnergyCard 
          currentHour={currentHour}
          alignment={alignment}
          userElement={userElement}
        />

        {/* Purpose Selector */}
        {!selectedPurpose && (
          <PurposeSelector onSelectPurpose={setSelectedPurpose} />
        )}

        {/* Contextual Guidance (shown after purpose selection) */}
        {selectedPurpose && (
          <div className="space-y-4">
            <ContextualGuidance 
              purpose={selectedPurpose}
              alignment={alignment}
              currentHour={currentHour}
              userElement={userElement}
              onChangePurpose={() => setSelectedPurpose(null)}
            />
          </div>
        )}

        {/* Timeline Toggle */}
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="w-full p-5 bg-white rounded-2xl shadow-lg border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800">
              {language === 'fr' ? 'Voir la journée complète' : 'View Full Day Timeline'}
            </span>
          </div>
          <ChevronRight className={`w-6 h-6 text-indigo-600 transition-transform ${showTimeline ? 'rotate-90' : ''}`} />
        </button>

        {/* Timeline View */}
        {showTimeline && (
          <TimelineView 
            planetaryHours={planetaryHours}
            currentHour={currentHour}
            userElement={userElement}
          />
        )}

        {/* Dhikr Recommendation */}
        <DhikrCard currentHour={currentHour} />

        {/* Last Updated */}
        <div className="text-center text-sm font-medium text-slate-600 pb-4">
          {language === 'fr' ? 'Dernière mise à jour' : 'Last updated'}: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

// Contextual Guidance Component
function ContextualGuidance({ 
  purpose, 
  alignment, 
  currentHour,
  userElement,
  onChangePurpose 
}: {
  purpose: UserPurpose;
  alignment: ElementAlignment;
  currentHour: AccuratePlanetaryHour;
  userElement: Element;
  onChangePurpose: () => void;
}) {
  const { t, language } = useLanguage();
  
  const getPurposeGuidance = () => {
    const isGoodTime = alignment.quality === 'perfect' || alignment.quality === 'strong';
    
    // This would be much more sophisticated in the full implementation
    const guidance = {
      work: {
        icon: <Briefcase className="w-6 h-6" />,
        title: language === 'fr' ? 'Travail & Projets' : 'Work & Projects',
        good: isGoodTime,
        advice: isGoodTime 
          ? (language === 'fr' 
            ? ['Lancez des tâches importantes', 'Prenez des décisions', 'Contactez des clients']
            : ['Start important tasks', 'Make decisions', 'Contact clients'])
          : (language === 'fr'
            ? ['Travail de routine uniquement', 'Évitez les nouvelles initiatives', 'Préparez pour plus tard']
            : ['Routine work only', 'Avoid new initiatives', 'Prepare for later'])
      },
      prayer: {
        icon: <Moon className="w-6 h-6" />,
        title: language === 'fr' ? 'Réflexion & Prière' : 'Reflection & Prayer',
        good: true, // Always good for prayer
        advice: language === 'fr'
          ? ['Moment propice à la méditation', 'Dhikr recommandé ci-dessous', 'Réflexion tranquille']
          : ['Good time for meditation', 'Recommended dhikr below', 'Quiet reflection']
      },
      conversation: {
        icon: <MessageCircle className="w-6 h-6" />,
        title: language === 'fr' ? 'Conversations Importantes' : 'Important Conversations',
        good: isGoodTime,
        advice: isGoodTime
          ? (language === 'fr'
            ? ['Bon moment pour discuter', 'L\'énergie soutient la communication', 'Soyez direct et honnête']
            : ['Good time to talk', 'Energy supports communication', 'Be direct and honest'])
          : (language === 'fr'
            ? ['Attendez un meilleur moment', 'Les émotions peuvent troubler', 'Préparez vos points clés']
            : ['Wait for better timing', 'Emotions may cloud things', 'Prepare your key points'])
      },
      learning: {
        icon: <BookOpen className="w-6 h-6" />,
        title: language === 'fr' ? 'Apprentissage & Étude' : 'Learning & Study',
        good: alignment.quality !== 'opposing',
        advice: alignment.quality !== 'opposing'
          ? (language === 'fr'
            ? ['Bon pour apprendre', 'Concentration possible', 'Prenez des notes']
            : ['Good for learning', 'Focus is possible', 'Take notes'])
          : (language === 'fr'
            ? ['Énergie faible pour étudier', 'Révisez ce que vous connaissez', 'Organisez vos matériaux']
            : ['Low energy for study', 'Review what you know', 'Organize materials'])
      },
      finance: {
        icon: <DollarSign className="w-6 h-6" />,
        title: language === 'fr' ? 'Décisions Financières' : 'Financial Decisions',
        good: isGoodTime && currentHour.planet.element === 'earth',
        advice: (isGoodTime && currentHour.planet.element === 'earth')
          ? (language === 'fr'
            ? ['Excellent moment', 'L\'énergie soutient la stabilité', 'Faites vos calculs']
            : ['Excellent timing', 'Energy supports stability', 'Do your calculations'])
          : (language === 'fr'
            ? ['Attendez un moment Terre', 'Préparez votre analyse', 'Pas de décisions hâtives']
            : ['Wait for Earth hour', 'Prepare your analysis', 'No hasty decisions'])
      },
      relationships: {
        icon: <Heart className="w-6 h-6" />,
        title: language === 'fr' ? 'Relations' : 'Relationships',
        good: alignment.quality === 'perfect' || currentHour.planet.element === 'water',
        advice: (alignment.quality === 'perfect' || currentHour.planet.element === 'water')
          ? (language === 'fr'
            ? ['Bon moment pour se connecter', 'Les émotions sont équilibrées', 'Exprimez votre cœur']
            : ['Good time to connect', 'Emotions are balanced', 'Express your heart'])
          : (language === 'fr'
            ? ['Moment neutre', 'Soyez patient', 'Écoutez plus que vous ne parlez']
            : ['Neutral timing', 'Be patient', 'Listen more than speak'])
      }
    };
    
    return guidance[purpose as keyof typeof guidance];
  };
  
  const purposeData = getPurposeGuidance();
  
  return (
    <div className={`p-6 rounded-xl shadow-lg border-2 ${
      purposeData.good 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
        : 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${
            purposeData.good 
              ? 'bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300'
              : 'bg-orange-100 dark:bg-orange-800/50 text-orange-700 dark:text-orange-300'
          }`}>
            {purposeData.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              {purposeData.title}
            </h3>
            <p className={`text-sm font-semibold ${
              purposeData.good 
                ? 'text-green-700 dark:text-green-300'
                : 'text-orange-700 dark:text-orange-300'
            }`}>
              {purposeData.good 
                ? (language === 'fr' ? '✓ Bon moment' : '✓ Good timing')
                : (language === 'fr' ? '⚠ Moment neutre' : '⚠ Neutral timing')}
            </p>
          </div>
        </div>
        <button 
          onClick={onChangePurpose}
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 underline"
        >
          {language === 'fr' ? 'Changer' : 'Change'}
        </button>
      </div>
      
      <ul className="space-y-2">
        {purposeData.advice.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
            <span className="mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
