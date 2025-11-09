'use client';

import React, { useState, useEffect } from 'react';
import { Element, UserLocation, AccuratePlanetaryHour, ElementAlignment, TimeWindow, ActionButton } from '../types/planetary';
import { getUserLocation, saveLocation, loadLocation } from '../utils/location';
import { 
  calculateAccuratePlanetaryHours, 
  getCurrentPlanetaryHour 
} from '../utils/planetaryHours';
import { analyzeAlignment, calculateTimeWindow } from '../utils/alignment';
import { generateActionButtons, getGuidanceForAlignment } from '../utils/actionButtons';
import { needsRecalculation } from '../utils/timeHelpers';
import { MapPin, CheckCircle, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { DisclaimerSection } from './DisclaimerSection';
import { AccuracyIndicator } from './AccuracyIndicator';
import { useLanguage } from '../contexts/LanguageContext';

interface ActNowButtonsProps {
  userElement: Element;
}

export function ActNowButtons({ userElement }: ActNowButtonsProps) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [planetaryHours, setPlanetaryHours] = useState<AccuratePlanetaryHour[]>([]);
  const [currentHour, setCurrentHour] = useState<AccuratePlanetaryHour | null>(null);
  const [alignment, setAlignment] = useState<ElementAlignment | null>(null);
  const [timeWindow, setTimeWindow] = useState<TimeWindow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [lastCalculation, setLastCalculation] = useState<Date>(new Date());
  
  // Initialize location and calculate hours
  useEffect(() => {
    async function initialize() {
      setIsLoading(true);
      setError(null);
      
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
          throw new Error('Could not determine your location. Using Mecca as fallback.');
        }
        
        setLocation(loc);
        
        // Calculate planetary hours
        const hours = calculateAccuratePlanetaryHours(
          new Date(),
          loc.latitude,
          loc.longitude
        );
        
        if (!hours || hours.length === 0) {
          throw new Error('Failed to calculate planetary hours for your location');
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
        
        // Calculate time window
        const window = calculateTimeWindow(current, userElement, hours);
        setTimeWindow(window);
        
        setLastUpdated(new Date());
        setLastCalculation(new Date());
        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load guidance';
        setError(errorMessage);
        
        // Try fallback to Mecca
        try {
          const fallbackLoc = {
            latitude: 21.4225,
            longitude: 39.8262,
            cityName: 'Mecca (Fallback)',
            isAccurate: false
          };
          setLocation(fallbackLoc);
          
          const hours = calculateAccuratePlanetaryHours(
            new Date(),
            fallbackLoc.latitude,
            fallbackLoc.longitude
          );
          
          if (hours && hours.length > 0) {
            setPlanetaryHours(hours);
            const current = getCurrentPlanetaryHour(hours);
            if (current) {
              setCurrentHour(current);
              const align = analyzeAlignment(userElement, current.planet.element);
              setAlignment(align);
              const window = calculateTimeWindow(current, userElement, hours);
              setTimeWindow(window);
              setError(null); // Clear error if fallback succeeds
            }
          }
        } catch (fallbackErr) {
          // Fallback also failed
        }
        
        setIsLoading(false);
      }
    }
    
    initialize();
  }, [userElement]);
  
  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (!location || planetaryHours.length === 0) return;
      
      // Check if we need full recalculation (date changed or 1+ hour passed)
      if (needsRecalculation(lastCalculation)) {
        const hours = calculateAccuratePlanetaryHours(
          new Date(),
          location.latitude,
          location.longitude
        );
        setPlanetaryHours(hours);
        setLastCalculation(new Date());
      }
      
      // Always update current hour
      const current = getCurrentPlanetaryHour(planetaryHours);
      setCurrentHour(current);
      
      if (current) {
        const align = analyzeAlignment(userElement, current.planet.element);
        setAlignment(align);
        
        const window = calculateTimeWindow(current, userElement, planetaryHours);
        setTimeWindow(window);
      }
      
      setLastUpdated(new Date());
    }, 60000); // Every 60 seconds
    
    return () => clearInterval(interval);
  }, [location, userElement, lastCalculation, planetaryHours]);
  
  // Request new location
  async function requestLocationUpdate() {
    setIsLoading(true);
    const loc = await getUserLocation();
    saveLocation(loc);
    setLocation(loc);
    
    // Recalculate with new location
    const hours = calculateAccuratePlanetaryHours(
      new Date(),
      loc.latitude,
      loc.longitude
    );
    setPlanetaryHours(hours);
    
    const current = getCurrentPlanetaryHour(hours);
    setCurrentHour(current);
    
    setIsLoading(false);
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading planetary hours...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-500">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-100 mb-2">
              Unable to Load Guidance
            </p>
            <p className="text-sm text-red-800 dark:text-red-200 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              aria-label="Reload page to try again"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!location) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-red-900 dark:text-red-100 font-semibold">
          ❌ Location Error
        </p>
        <p className="text-red-800 dark:text-red-200 text-sm mt-2">
          Could not determine your location. Please check your browser's location permissions.
        </p>
      </div>
    );
  }
  
  if (planetaryHours.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-yellow-900 dark:text-yellow-100 font-semibold">
          ⚠️ Calculation Error
        </p>
        <p className="text-yellow-800 dark:text-yellow-200 text-sm mt-2">
          Could not calculate planetary hours. Please check the browser console for details.
        </p>
      </div>
    );
  }
  
  if (!currentHour) {
    return (
      <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="text-amber-900 dark:text-amber-100 font-semibold">
          ⏰ Current Hour Not Found
        </p>
        <p className="text-amber-800 dark:text-amber-200 text-sm mt-2">
          Unable to find current planetary hour. Check console for time range info.
        </p>
      </div>
    );
  }
  
  if (!alignment || !timeWindow) {
    return (
      <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="text-amber-900 dark:text-amber-100">
          Calculating alignment... Please wait.
        </p>
      </div>
    );
  }
  
  // Compute values directly without useMemo
  const actionButtons = generateActionButtons(alignment, timeWindow, userElement);
  const guidance = getGuidanceForAlignment(alignment, userElement, currentHour.planet.element);
  
  return (
    <div className="space-y-6">
      {/* Disclaimer Section - NEW */}
      <DisclaimerSection isAccurateLocation={location.isAccurate} />
      
      {/* Location Section */}
      <LocationSection 
        location={location}
        onRequestUpdate={requestLocationUpdate}
      />
      
      {/* Main Status Banner */}
      <StatusBanner 
        alignment={alignment}
        currentHour={currentHour}
        userElement={userElement}
        location={location}
      />
      
      {/* Countdown Timer */}
      <CountdownTimer 
        timeWindow={timeWindow}
        alignment={alignment}
      />
      
      {/* Action Buttons */}
      <ActionButtonsSection 
        buttons={actionButtons}
        alignment={alignment}
      />
      
      {/* Next Window Info */}
      {timeWindow.nextOptimalWindow && (
        <NextWindowSection 
          nextWindow={timeWindow.nextOptimalWindow}
          timeUntil={timeWindow.nextWindowIn}
          userElement={userElement}
        />
      )}
      
      {/* Element Guidance */}
      <GuidanceSection 
        guidance={guidance}
        alignment={alignment}
      />
      
      {/* Accuracy Indicator at bottom - NEW */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <AccuracyIndicator 
          isAccurateLocation={location.isAccurate} 
          onRequestUpdate={requestLocationUpdate}
        />
      </div>
      
      {/* Final Summary Component */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 transition-all duration-300">
        <p className="text-center text-xs sm:text-sm text-purple-900 dark:text-purple-100">
          ✨ <strong>Act Now</strong> uses traditional wisdom to help you choose the right moment. 
          Trust your judgment and use this as one tool among many.
        </p>
      </div>
      
      {/* Last Updated Timestamp */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
        Last updated: {lastUpdated.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          second: '2-digit',
          hour12: true 
        })}
      </div>
    </div>
  );
}

// Location Section Component
function LocationSection({ 
  location, 
  onRequestUpdate 
}: { 
  location: UserLocation;
  onRequestUpdate: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 transition-all duration-300">
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <span className="text-blue-900 dark:text-blue-100">
          Location: {location.cityName}
        </span>
        {location.isAccurate && (
          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
        )}
        {!location.isAccurate && (
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
        )}
      </div>
      <button 
        onClick={onRequestUpdate}
        className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium whitespace-nowrap"
      >
        📍 {location.isAccurate ? 'Update' : 'Enable'} Location
      </button>
    </div>
  );
}

// Status Banner
function StatusBanner({ 
  alignment, 
  currentHour, 
  userElement,
  location
}: { 
  alignment: ElementAlignment;
  currentHour: AccuratePlanetaryHour;
  userElement: Element;
  location: UserLocation;
}) {
  const gradients = {
    perfect: 'bg-gradient-to-r from-green-500 to-emerald-600',
    strong: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    moderate: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    opposing: 'bg-gradient-to-r from-gray-400 to-gray-500',
    weak: 'bg-gradient-to-r from-gray-400 to-gray-500'
  };
  
  const bgGradient = gradients[alignment.quality];
  
  let statusMessage = '';
  if (alignment.quality === 'perfect') {
    statusMessage = `🔥 YOUR ${userElement.toUpperCase()} ELEMENT IS ACTIVE NOW!`;
  } else if (alignment.quality === 'strong') {
    statusMessage = `💫 STRONG ${userElement.toUpperCase()} ENERGY - EXCELLENT TIME`;
  } else if (alignment.quality === 'moderate') {
    statusMessage = `📊 MODERATE ENERGY - DECENT TIME FOR ROUTINE WORK`;
  } else {
    statusMessage = `⏸️ ${currentHour.planet.element.toUpperCase()} ACTIVE - REST & REFLECT`;
  }
  
  const elementEmoji = { fire: '🔥', water: '💧', air: '💨', earth: '🌍' };
  
  return (
    <div 
      className={`${bgGradient} rounded-xl p-4 sm:p-6 text-black dark:text-white shadow-lg transition-all duration-300`}
      role="alert"
      aria-live="polite"
      aria-label={`Current alignment: ${alignment.qualityDescription}`}
    >
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">{statusMessage}</h2>
      
      <div className="space-y-2 text-black dark:text-white">
        <p className="text-xs sm:text-sm">
          <strong>Current Hour:</strong> {currentHour.planet.name} ({currentHour.planet.nameArabic})
        </p>
        <p className="text-xs sm:text-sm">
          <strong>Your Element:</strong> {elementEmoji[userElement]} {userElement.charAt(0).toUpperCase() + userElement.slice(1)}
        </p>
        <p className="text-xs sm:text-sm">
          <strong>Hour Element:</strong> {elementEmoji[currentHour.planet.element]} {currentHour.planet.element.charAt(0).toUpperCase() + currentHour.planet.element.slice(1)}
        </p>
        <p className="text-sm sm:text-base font-semibold mt-3">
          = {alignment.qualityDescription} ({alignment.qualityArabic})
        </p>
        
        {/* Time info */}
        <p className="text-xs opacity-75 mt-2 pt-2 border-t border-white/20">
          {currentHour.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - 
          {currentHour.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} • 
          {currentHour.durationMinutes} minutes • 
          {currentHour.isDayHour ? '☀️ Day Hour' : '🌙 Night Hour'}
        </p>
      </div>
    </div>
  );
}

// Countdown Timer
function CountdownTimer({ 
  timeWindow, 
  alignment 
}: { 
  timeWindow: TimeWindow;
  alignment: ElementAlignment;
}) {
  const { t } = useLanguage();
  const { urgency, closesIn } = timeWindow;
  
  const urgencyColors = {
    high: 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-100',
    medium: 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-900 dark:text-orange-100',
    low: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 text-blue-900 dark:text-blue-100'
  };
  
  const showWarning = urgency === 'high' && (alignment.quality === 'perfect' || alignment.quality === 'strong');
  
  return (
    <div 
      className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ${urgencyColors[urgency]}`}
      role="timer"
      aria-live="assertive"
      aria-label={`${t.timingResults.windowClosesIn} ${closesIn}`}
    >
      <Clock className={`h-5 sm:h-6 w-5 sm:w-6 flex-shrink-0 ${urgency === 'high' ? 'animate-pulse' : ''}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm sm:text-base">
          {urgency === 'high' && '⚠️ '} 
          {t.timingResults.windowClosesIn} <span className="text-lg sm:text-xl font-bold">{closesIn}</span>
        </p>
        {showWarning && (
          <p className="text-xs sm:text-sm font-semibold mt-1 animate-pulse">
            🔥 {t.timingResults.actNowWarning}
          </p>
        )}
        {urgency === 'low' && (
          <p className="text-xs sm:text-sm mt-1 opacity-75">
            {t.timingResults.plentyOfTime}
          </p>
        )}
      </div>
    </div>
  );
}

// Action Buttons Section
function ActionButtonsSection({ 
  buttons, 
  alignment 
}: { 
  buttons: ActionButton[];
  alignment: ElementAlignment;
}) {
  return (
    <div className="space-y-3 transition-all duration-300">
      {buttons.map((button, index) => (
        <ActionButtonComponent 
          key={index}
          button={button}
          alignment={alignment}
        />
      ))}
    </div>
  );
}

function ActionButtonComponent({ 
  button, 
  alignment 
}: { 
  button: ActionButton;
  alignment: ElementAlignment;
}) {
  const { t } = useLanguage();
  const [isClicked, setIsClicked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPrimary = button.priority === 'primary';
  const isHighAlignment = alignment.quality === 'perfect' || alignment.quality === 'strong';
  
  // Translate button labels
  const translateLabel = (label: string): string => {
    const labelMap: Record<string, string> = {
      'Start Important Task': t.actionButtons.startImportantTask,
      'Make Difficult Call': t.actionButtons.makeDifficultCall,
      'Take Bold Action': t.actionButtons.takeBoldAction,
      'Write or Communicate': t.actionButtons.writeOrCommunicate,
      'Brainstorm Ideas': t.actionButtons.brainstormIdeas,
      'Creative Work': t.actionButtons.creativeWork,
      'Deep Reflection': t.actionButtons.deepReflection,
      'Build or Organize': t.actionButtons.buildOrOrganize,
      'Complete Tasks': t.actionButtons.completeTasks,
      'Schedule for Later': t.actionButtons.scheduleForLater,
      'Rest & Reflect': t.actionButtons.restReflect,
      'Plan & Prepare': t.actionButtons.planPrepare,
      'Handle Routine Tasks': t.actionButtons.handleRoutineTasks,
      'Continue Ongoing Work': t.actionButtons.continueOngoingWork,
      'Wait for Better Timing': t.actionButtons.waitForBetterTiming,
    };
    
    // Handle dynamic "Wait for {element}" labels
    if (label.startsWith('Wait for ')) {
      return label; // Keep as is for now, or implement element translation
    }
    
    return labelMap[label] || label;
  };
  
  let buttonClass = '';
  
  if (isPrimary && isHighAlignment) {
    buttonClass = 'w-full py-3 sm:py-4 px-5 sm:px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200';
  } else if (isPrimary) {
    buttonClass = 'w-full py-3 sm:py-4 px-5 sm:px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold text-base sm:text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-all duration-200';
  } else if (button.priority === 'secondary') {
    buttonClass = 'w-full py-2 sm:py-3 px-4 sm:px-5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 font-medium rounded-lg shadow hover:shadow-md transition-all duration-200';
  } else {
    buttonClass = 'w-full py-2 px-3 sm:px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-normal text-sm rounded-lg transition-all duration-200';
  }
  
  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1000);
  };
  
  return (
    <button 
      className={`${buttonClass} ${isClicked ? 'scale-95' : ''} ${isFocused ? 'ring-4 ring-blue-500 ring-opacity-50' : ''} flex items-center justify-center gap-2 sm:gap-3`}
      onClick={handleClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      aria-label={`${translateLabel(button.label)} - ${button.priority} action`}
    >
      <span className="text-xl sm:text-2xl" aria-hidden="true">{button.icon}</span>
      <span>{translateLabel(button.label)}</span>
      {isClicked && <span className="text-sm" aria-hidden="true">✓</span>}
    </button>
  );
}

// Next Window Section
function NextWindowSection({ 
  nextWindow, 
  timeUntil, 
  userElement 
}: { 
  nextWindow: AccuratePlanetaryHour;
  timeUntil: string;
  userElement: Element;
}) {
  const timeStr = nextWindow.startTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const elementEmoji = { fire: '🔥', water: '💧', air: '💨', earth: '🌍' };
  
  return (
    <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-500 transition-all duration-300">
      <div className="flex items-start gap-2 sm:gap-3">
        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
            📍 Next {elementEmoji[userElement]} {userElement.charAt(0).toUpperCase() + userElement.slice(1)} window:
          </p>
          <p className="text-sm sm:text-base font-bold text-blue-800 dark:text-blue-200">
            {nextWindow.planet.name} Hour • {timeStr}
          </p>
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-1">
            Starting in {timeUntil}
          </p>
        </div>
      </div>
    </div>
  );
}

// Guidance Section
function GuidanceSection({ 
  guidance, 
  alignment 
}: { 
  guidance: string[];
  alignment: ElementAlignment;
}) {
  const { t } = useLanguage();
  const isHighAlignment = alignment.quality === 'perfect' || alignment.quality === 'strong';
  
  // Translate guidance items
  const translateGuidance = (item: string): string => {
    const guidanceMap: Record<string, string> = {
      // Fire guidance
      'Launch new projects': t.elementGuidance.Fire.bestFor[0],
      'Make important decisions': t.elementGuidance.Fire.bestFor[1],
      'Have courage-requiring conversations': t.elementGuidance.Fire.bestFor[2],
      'Taking bold action': t.elementGuidance.Fire.bestFor[3],
      'Lead and inspire others': t.elementGuidance.Fire.bestFor[4],
      // Air guidance
      'Communicate and network': t.elementGuidance.Air.bestFor[0],
      'Learn new concepts': t.elementGuidance.Air.bestFor[1],
      'Brainstorm ideas': t.elementGuidance.Air.bestFor[2],
      'Write and articulate': t.elementGuidance.Air.bestFor[3],
      'Teach and share knowledge': t.elementGuidance.Air.bestFor[4],
      // Water guidance
      'Emotional processing': t.elementGuidance.Water.bestFor[0],
      'Deep reflection': t.elementGuidance.Water.bestFor[1],
      'Healing conversations': t.elementGuidance.Water.bestFor[2],
      'Intuitive work': t.elementGuidance.Water.bestFor[3],
      'Creative flow': t.elementGuidance.Water.bestFor[4],
      // Earth guidance
      'Build and organize': t.elementGuidance.Earth.bestFor[0],
      'Make commitments': t.elementGuidance.Earth.bestFor[1],
      'Complete projects': t.elementGuidance.Earth.bestFor[2],
      'Financial planning': t.elementGuidance.Earth.bestFor[3],
      'Physical work': t.elementGuidance.Earth.bestFor[4],
      // Moderate alignment
      'Handle routine tasks': t.actionButtons.handleRoutineTasks,
      'Continue ongoing projects': t.actionButtons.continueOngoingWork,
      'Low-stakes activities': t.actionButtons.lowStakesActivities,
      'Preparation work': t.actionButtons.preparationWork,
    };
    
    return guidanceMap[item] || item;
  };
  
  return (
    <div className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ${
      isHighAlignment 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
        : 'bg-gray-50 dark:bg-gray-800/20 border-gray-300'
    }`}>
      <p className={`font-semibold mb-3 text-sm sm:text-base ${
        isHighAlignment 
          ? 'text-green-900 dark:text-green-100'
          : 'text-gray-900 dark:text-gray-100'
      }`}>
        💡 {t.timingResults.useThisTimeFor}
      </p>
      <ul className={`space-y-1 text-xs sm:text-sm ${
        isHighAlignment 
          ? 'text-green-800 dark:text-green-200'
          : 'text-gray-700 dark:text-gray-300'
      }`}>
        {guidance.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-0.5 flex-shrink-0">•</span>
            <span>{translateGuidance(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

