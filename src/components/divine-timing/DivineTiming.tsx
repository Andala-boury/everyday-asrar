'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { calculateAccuratePlanetaryHours, getCurrentPlanetaryHour } from '../../utils/planetaryHours';
import { AccuratePlanetaryHour, Element } from '../../types/planetary';
import { EnergyCard } from './EnergyCard';
import { PurposeSelector } from './PurposeSelector';
import { TimelineView } from './TimelineView';
import { DhikrCard } from './DhikrCard';
import { RestDayView } from './RestDayView';
import { DivineNameCard } from './spiritual/DivineNameCard';
import { QuranicVerseDisplay } from './spiritual/QuranicVerseDisplay';
import { DisclaimerModal } from './DisclaimerModal';
import { getPlanetarySpirituality } from '../../constants/planetarySpirituality';
import { MapPin, RefreshCw, Loader2 } from 'lucide-react';
// Phase 2: Prayer, Lunar Mansions, Personal Alignment
import PrayerTimeIntegration from './prayer/PrayerTimeIntegration';
import LunarMansionDisplay from './lunar/LunarMansionDisplay';
import AlignmentScoreDisplay from './alignment/AlignmentScoreDisplay';
import { calculatePersonalHadad } from '../../lib/hadadAlignment';
// Phase 3: Educational Content
import LearningCenter from './education/LearningCenter';
import PlanetGuidePanel from './education/PlanetGuidePanel';
import Glossary from './education/Glossary';
import EnergyFlowChart from './education/EnergyFlowChart';

interface DivinTimingProps {
  userElement: Element;
  userName?: string;
  birthDate?: string;
  nameTotal?: number; // Hadad Kabir for alignment calculations
}

interface UserLocation {
  latitude: number;
  longitude: number;
  cityName?: string;
  isAccurate: boolean;
}

export function DivineTiming({ userElement, userName, birthDate, nameTotal }: DivinTimingProps) {
  const { t, language } = useLanguage();
  const isFr = language === 'fr';
  
  console.log('DivineTiming rendered with:', { userElement, userName, birthDate, nameTotal });
  
  // State management
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [planetaryHours, setPlanetaryHours] = useState<AccuratePlanetaryHour[]>([]);
  const [currentHour, setCurrentHour] = useState<AccuratePlanetaryHour | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showDhikr, setShowDhikr] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRestDay, setIsRestDay] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  // Phase 3: Educational content navigation
  const [educationView, setEducationView] = useState<'none' | 'learning' | 'planets' | 'glossary' | 'energy'>('none');

  // Check if disclaimer has been accepted before
  useEffect(() => {
    const accepted = localStorage.getItem('divineTimingDisclaimerAccepted');
    if (accepted === 'true') {
      setDisclaimerAccepted(true);
    } else {
      setShowDisclaimer(true);
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('divineTimingDisclaimerAccepted', 'true');
    setDisclaimerAccepted(true);
    setShowDisclaimer(false);
  };

  // Request user location with friendly messaging
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError(isFr ? 'Géolocalisation non disponible' : 'Location not available');
      useFallbackLocation();
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLocation: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isAccurate: true,
        };
        
        // Fetch city name from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );
          const data = await response.json();
          if (data.address) {
            newLocation.cityName = data.address.city || 
                                   data.address.town || 
                                   data.address.village || 
                                   data.address.state || 
                                   data.address.country || 
                                   (isFr ? 'Position actuelle' : 'Current location');
          }
        } catch (error) {
          console.error('Error fetching city name:', error);
          // Continue without city name
        }
        
        setLocation(newLocation);
        localStorage.setItem('userLocation', JSON.stringify(newLocation));
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Location error:', error);
        setLocationError(
          isFr 
            ? 'Impossible d\'obtenir votre position. Utilisation de Makkah par défaut.' 
            : 'Unable to get your location. Using Makkah as default.'
        );
        useFallbackLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, [isFr]);

  // Fallback to Makkah coordinates
  const useFallbackLocation = () => {
    const makkahLocation: UserLocation = {
      latitude: 21.4225,
      longitude: 39.8262,
      cityName: 'Makkah',
      isAccurate: false,
    };
    setLocation(makkahLocation);
    setIsLoadingLocation(false);
  };

  // Load saved location or request new one
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed);
        setIsLoadingLocation(false);
      } catch {
        requestLocation();
      }
    } else {
      requestLocation();
    }
  }, [requestLocation]);

  // Calculate planetary hours when location changes
  useEffect(() => {
    if (!location) return;

    const updatePlanetaryHours = () => {
      const now = new Date();
      const hours = calculateAccuratePlanetaryHours(
        now,
        location.latitude,
        location.longitude
      );
      setPlanetaryHours(hours);
      
      const current = getCurrentPlanetaryHour(hours);
      setCurrentHour(current);
      setCurrentTime(now);

      // Disable rest day detection for now - show full interface
      // Check if it's a rest day (>70% weak alignment hours)
      // if (hours.length > 0) {
      //   const weakHours = hours.filter(h => {
      //     const alignment = calculateAlignment(userElement, h.planet.element);
      //     return alignment.quality === 'weak' || alignment.quality === 'neutral';
      //   });
      //   setIsRestDay(weakHours.length / hours.length > 0.7);
      // }
      setIsRestDay(false); // Always show main interface
    };

    updatePlanetaryHours();

    // Auto-refresh every minute
    const interval = setInterval(updatePlanetaryHours, 60000);
    return () => clearInterval(interval);
  }, [location, userElement]);

  // Calculate element alignment
  const calculateAlignment = (userEl: Element, hourEl: string) => {
    const elementMap: Record<string, Element> = {
      'Fire': 'fire',
      'Air': 'air', 
      'Water': 'water',
      'Earth': 'earth',
    };
    
    const mappedHourEl = elementMap[hourEl] || 'Air';
    
    // Strong compatibility
    if (userEl === mappedHourEl) {
      return {
        quality: 'strong' as const,
        qualityArabic: 'قوي',
        harmonyScore: 90,
        color: '#10b981', // green
        description: isFr ? 'Énergie forte' : 'Strong Energy',
      };
    }
    
    // Compatible pairs (Fire-Air, Water-Earth)
    if (
      (userEl === 'fire' && mappedHourEl === 'air') ||
      (userEl === 'air' && mappedHourEl === 'fire') ||
      (userEl === 'water' && mappedHourEl === 'earth') ||
      (userEl === 'earth' && mappedHourEl === 'water')
    ) {
      return {
        quality: 'moderate' as const,
        qualityArabic: 'متوسط',
        harmonyScore: 70,
        color: '#3b82f6', // blue
        description: isFr ? 'Énergie modérée' : 'Moderate Energy',
      };
    }
    
    // Neutral
    if (
      (userEl === 'fire' && mappedHourEl === 'earth') ||
      (userEl === 'earth' && mappedHourEl === 'fire') ||
      (userEl === 'air' && mappedHourEl === 'water') ||
      (userEl === 'water' && mappedHourEl === 'air')
    ) {
      return {
        quality: 'neutral' as const,
        qualityArabic: 'محايد',
        harmonyScore: 50,
        color: '#eab308', // yellow
        description: isFr ? 'Énergie neutre' : 'Neutral Energy',
      };
    }
    
    // Weak (opposing elements: Fire-Water, Air-Earth)
    return {
      quality: 'weak' as const,
      qualityArabic: 'ضعيف',
      harmonyScore: 30,
      color: '#f97316', // orange
      description: isFr ? 'Énergie faible' : 'Low Energy',
    };
  };

  // Loading state
  if (isLoadingLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-lg text-slate-700 dark:text-slate-300">
          {isFr ? 'Obtention de votre position...' : 'Getting your location...'}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          {isFr 
            ? 'Cela nous aide à calculer les heures planétaires précises' 
            : 'This helps us calculate accurate planetary hours'}
        </p>
      </div>
    );
  }

  // Rest day special view
  if (isRestDay) {
    return (
      <RestDayView
        userElement={userElement}
        hours={planetaryHours}
        nextGoodHour={planetaryHours.find(h => {
          const alignment = calculateAlignment(userElement, h.planet.element);
          return alignment.harmonyScore >= 70;
        }) || null}
      />
    );
  }

  // Timeline modal overlay
  if (showTimeline) {
    return (
      <TimelineView
        hours={planetaryHours}
        userElement={userElement}
        currentHour={currentHour}
        onClose={() => setShowTimeline(false)}
      />
    );
  }

  // Dhikr modal overlay
  if (showDhikr && currentHour) {
    return (
      <DhikrCard
        planetName={currentHour.planet.name}
        planetElement={currentHour.planet.element}
        planetNameArabic={currentHour.planet.nameArabic}
        onClose={() => setShowDhikr(false)}
      />
    );
  }

  // Phase 3: Educational Content Views
  if (educationView === 'learning') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          <button
            onClick={() => setEducationView('none')}
            className="mb-6 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">{isFr ? 'Retour au Moment Divin' : 'Back to Divine Timing'}</span>
          </button>
          <LearningCenter currentLanguage={language} />
        </div>
      </div>
    );
  }

  if (educationView === 'planets') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          <button
            onClick={() => setEducationView('none')}
            className="mb-6 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">{isFr ? 'Retour au Moment Divin' : 'Back to Divine Timing'}</span>
          </button>
          <PlanetGuidePanel
            selectedPlanet={currentHour?.planet.name || 'Sun'}
            currentLanguage={language}
          />
        </div>
      </div>
    );
  }

  if (educationView === 'glossary') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          <button
            onClick={() => setEducationView('none')}
            className="mb-6 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">{isFr ? 'Retour au Moment Divin' : 'Back to Divine Timing'}</span>
          </button>
          <Glossary currentLanguage={language} />
        </div>
      </div>
    );
  }

  if (educationView === 'energy') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          <button
            onClick={() => setEducationView('none')}
            className="mb-6 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">{isFr ? 'Retour au Moment Divin' : 'Back to Divine Timing'}</span>
          </button>
          <EnergyFlowChart
            hours={planetaryHours}
            userElement={userElement}
            currentHour={currentHour?.planet.name}
            onSelectHour={(index) => {
              const selectedHour = planetaryHours[index];
              if (selectedHour) {
                setCurrentHour(selectedHour);
                setEducationView('none');
              }
            }}
          />
        </div>
      </div>
    );
  }

  const alignment = currentHour ? calculateAlignment(userElement, currentHour.planet.element) : null;
  const spiritualInfo = currentHour ? getPlanetarySpirituality(currentHour.planet.name) : null;

  // Calculate personal Hadad alignment (Phase 2)
  const personalHadad = nameTotal && birthDate 
    ? calculatePersonalHadad(nameTotal, new Date(birthDate))
    : null;

  // Show disclaimer modal if not accepted
  if (showDisclaimer && !disclaimerAccepted) {
    return <DisclaimerModal onAccept={handleAcceptDisclaimer} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="text-xl">←</span>
          <span className="font-medium">{isFr ? 'Retour à l\'Accueil' : 'Back to Home'}</span>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isFr ? '🌙 Moment Divin' : '🌙 Divine Timing'}
        </h2>
      </div>

      {/* Location indicator */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {location?.cityName || (isFr ? 'Position actuelle' : 'Current location')}
              {!location?.isAccurate && (
                <span className="ml-2 text-xs font-normal text-amber-600 dark:text-amber-400">
                  ({isFr ? 'Défaut: Makkah' : 'Default: Makkah'})
                </span>
              )}
            </div>
            {location && (
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
              </div>
            )}
          </div>
        </div>
        <button
          onClick={requestLocation}
          disabled={isLoadingLocation}
          className="flex items-center gap-2 px-3 py-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-lg transition-colors disabled:opacity-50"
          title={isFr ? 'Actualiser la position' : 'Refresh location'}
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingLocation ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">{isFr ? 'Actualiser' : 'Refresh'}</span>
        </button>
      </div>

      {locationError && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-200">
          {locationError}
        </div>
      )}

      {/* Main energy card */}
      {currentHour && alignment && (
        <EnergyCard
          currentHour={currentHour}
          alignment={alignment}
          userElement={userElement}
          onViewTimeline={() => setShowTimeline(true)}
          onOpenDhikr={() => setShowDhikr(true)}
          currentTime={currentTime}
        />
      )}

      {/* Spiritual Components - Divine Name & Quranic Verse */}
      {currentHour && spiritualInfo && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Divine Name Card */}
          <DivineNameCard
            planetName={currentHour.planet.name}
            divineNameData={spiritualInfo.divineNames.primary}
            secondaryNames={spiritualInfo.divineNames.secondary}
            onOpenDhikr={() => setShowDhikr(true)}
          />

          {/* Quranic Verse Display */}
          <QuranicVerseDisplay
            verse={spiritualInfo.quranConnection.primaryVerse}
            reflectionPrompt={spiritualInfo.quranConnection.reflectionPrompt}
            reflectionPromptFr={spiritualInfo.quranConnection.reflectionPromptFr}
          />
        </div>
      )}

      {/* PHASE 2: Prayer Times & Lunar Mansions */}
      {currentHour && location && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Prayer Time Integration */}
          <PrayerTimeIntegration
            currentPlanet={currentHour.planet.name}
            userCoordinates={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />

          {/* Lunar Mansion Display */}
          <LunarMansionDisplay
            currentPlanet={currentHour.planet.name}
          />
        </div>
      )}

      {/* PHASE 2: Personal Alignment Score */}
      {personalHadad && currentHour && (
        <AlignmentScoreDisplay
          personalHadad={personalHadad}
          currentPlanet={currentHour.planet.name}
        />
      )}

      {/* Purpose selector */}
      <PurposeSelector
        currentHour={currentHour}
        alignment={alignment}
        selectedPurpose={selectedPurpose}
        onSelectPurpose={setSelectedPurpose}
      />

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowTimeline(true)}
          className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:shadow-lg transition-all"
        >
          <div className="text-2xl mb-2">📅</div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">
            {isFr ? 'Voir la Timeline' : 'View Timeline'}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {isFr ? 'Toute la journée' : 'Full day view'}
          </div>
        </button>

        <button
          onClick={() => setShowDhikr(true)}
          className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:shadow-lg transition-all"
        >
          <div className="text-2xl mb-2">📿</div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">
            {isFr ? 'Dhikr Recommandé' : 'Recommended Dhikr'}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {isFr ? 'Pratique spirituelle' : 'Spiritual practice'}
          </div>
        </button>
      </div>

      {/* Phase 3: Educational Resources Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isFr ? '📚 Ressources Éducatives' : '📚 Educational Resources'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {isFr
              ? 'Approfondissez votre compréhension des heures planétaires'
              : 'Deepen your understanding of planetary hours'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Learning Center */}
          <button
            onClick={() => setEducationView('learning')}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📚</div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">
              {isFr ? 'Centre d\'Apprentissage' : 'Learning Center'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isFr
                ? 'Introduction complète aux heures planétaires islamiques'
                : 'Complete introduction to Islamic planetary hours'}
            </p>
          </button>

          {/* Planet Guides */}
          <button
            onClick={() => setEducationView('planets')}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🪐</div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">
              {isFr ? 'Guides Planétaires' : 'Planet Guides'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isFr
                ? 'Explorez les 7 planètes avec contexte islamique'
                : 'Explore all 7 planets with Islamic context'}
            </p>
          </button>

          {/* Glossary */}
          <button
            onClick={() => setEducationView('glossary')}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📖</div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">
              {isFr ? 'Glossaire' : 'Glossary'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isFr
                ? 'Termes arabes et concepts spirituels'
                : 'Arabic terms and spiritual concepts'}
            </p>
          </button>

          {/* Energy Flow */}
          <button
            onClick={() => setEducationView('energy')}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">
              {isFr ? 'Flux d\'Énergie' : 'Energy Flow'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isFr
                ? 'Visualisez l\'énergie quotidienne'
                : 'Visualize daily energy patterns'}
            </p>
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-600 dark:text-slate-400 text-center">
        {isFr 
          ? '🌙 Les heures planétaires sont calculées selon les traditions islamiques classiques. Utilisez ce guide avec votre propre discernement.'
          : '🌙 Planetary hours are calculated according to classical Islamic traditions. Use this guidance with your own discernment.'}
      </div>
    </div>
  );
}
