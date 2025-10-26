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
import { MapPin, CheckCircle, AlertTriangle, Clock, Calendar } from 'lucide-react';

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
  
  // Initialize location and calculate hours
  useEffect(() => {
    async function initialize() {
      setIsLoading(true);
      try {
        // Try to load saved location
        let loc = loadLocation();
        
        // If no saved location, request it
        if (!loc) {
          console.log('No saved location, requesting from browser...');
          loc = await getUserLocation();
          console.log('Got location:', loc);
          if (loc) {
            saveLocation(loc);
          }
        }
        
        if (!loc) {
          console.error('Failed to get location');
          // Use Mecca as ultimate fallback
          loc = {
            latitude: 21.4225,
            longitude: 39.8262,
            cityName: 'Mecca (Fallback)',
            isAccurate: false
          };
        }
        
        setLocation(loc);
        
        // Calculate planetary hours
        console.log('Calculating hours with location:', loc);
        const hours = calculateAccuratePlanetaryHours(
          new Date(),
          loc.latitude,
          loc.longitude
        );
        console.log('Calculated hours:', hours);
        setPlanetaryHours(hours);
        
        // Get current hour
        const current = getCurrentPlanetaryHour(hours);
        console.log('Current hour:', current);
        setCurrentHour(current);
        
        // Calculate alignment if we have current hour
        if (current) {
          const align = analyzeAlignment(userElement, current.planet.element);
          setAlignment(align);
          
          const window = calculateTimeWindow(current, userElement, hours);
          setTimeWindow(window);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error in initialize:', error);
        // Use Mecca as fallback
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
        setPlanetaryHours(hours);
        setCurrentHour(getCurrentPlanetaryHour(hours));
        
        const current = getCurrentPlanetaryHour(hours);
        if (current) {
          const align = analyzeAlignment(userElement, current.planet.element);
          setAlignment(align);
          
          const window = calculateTimeWindow(current, userElement, hours);
          setTimeWindow(window);
        }
        
        setIsLoading(false);
      }
    }
    
    initialize();
  }, []);
  
  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (!location) return;
      
      const hours = calculateAccuratePlanetaryHours(
        new Date(),
        location.latitude,
        location.longitude
      );
      setPlanetaryHours(hours);
      
      const current = getCurrentPlanetaryHour(hours);
      setCurrentHour(current);
      
      if (current) {
        const align = analyzeAlignment(userElement, current.planet.element);
        setAlignment(align);
        
        const window = calculateTimeWindow(current, userElement, hours);
        setTimeWindow(window);
      }
    }, 60000); // Every 60 seconds
    
    return () => clearInterval(interval);
  }, [location, userElement]);
  
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
        <p className="text-sm text-gray-600">Loading planetary hours...</p>
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
        <DebugHoursDisplay hours={planetaryHours} />
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
  
  const actionButtons = generateActionButtons(alignment, timeWindow, userElement);
  const guidance = getGuidanceForAlignment(alignment, userElement, currentHour.planet.element);
  
  return (
    <div className="space-y-6">
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
      
      {/* Debug: Show all hours */}
      <DebugHoursDisplay hours={planetaryHours} />
      
      {/* Success Message */}
      <div className="p-6 bg-green-50 dark:bg-green-900/30 rounded-lg border-2 border-green-500">
        <p className="text-green-900 dark:text-green-100 font-bold text-lg">
          ✅ Part 3 Complete: Action buttons working!
        </p>
        <p className="text-base text-green-800 dark:text-green-200 mt-2">
          Next: Part 4 (Disclaimers & Polish)
        </p>
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
    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-blue-900 dark:text-blue-100">
          Location: {location.cityName}
        </span>
        {location.isAccurate && (
          <CheckCircle className="h-4 w-4 text-green-500" />
        )}
        {!location.isAccurate && (
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        )}
      </div>
      <button 
        onClick={onRequestUpdate}
        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
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
  userElement 
}: { 
  alignment: ElementAlignment;
  currentHour: AccuratePlanetaryHour;
  userElement: Element;
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
    <div className={`${bgGradient} rounded-xl p-6 text-white shadow-lg`}>
      <h2 className="text-2xl font-bold mb-4">{statusMessage}</h2>
      
      <div className="space-y-2 text-white">
        <p className="text-sm">
          <strong>Your Element:</strong> {elementEmoji[userElement]} {userElement.charAt(0).toUpperCase() + userElement.slice(1)}
        </p>
        <p className="text-sm">
          <strong>Current Hour Element:</strong> {elementEmoji[currentHour.planet.element]} {currentHour.planet.element.charAt(0).toUpperCase() + currentHour.planet.element.slice(1)}
        </p>
        <p className="text-base font-semibold mt-3">
          = {alignment.qualityDescription} ({alignment.qualityArabic})
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
  const { urgency, closesIn } = timeWindow;
  
  const urgencyColors = {
    high: 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-100',
    medium: 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-900 dark:text-orange-100',
    low: 'bg-gray-50 dark:bg-gray-800/20 border-gray-300 text-gray-900 dark:text-gray-100'
  };
  
  const showWarning = urgency === 'high' && (alignment.quality === 'perfect' || alignment.quality === 'strong');
  
  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${urgencyColors[urgency]}`}>
      <Clock className={`h-5 w-5 ${urgency === 'high' ? 'animate-pulse' : ''}`} />
      <div className="flex-1">
        <p className="font-medium">
          {urgency === 'high' && '⚠️ '} 
          Window closes in: <span className="text-lg font-bold">{closesIn}</span>
        </p>
        {showWarning && (
          <p className="text-sm font-semibold mt-1">
            ACT NOW! Optimal time ending soon.
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
    <div className="space-y-3">
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
  const isPrimary = button.priority === 'primary';
  const isHighAlignment = alignment.quality === 'perfect' || alignment.quality === 'strong';
  
  let buttonClass = '';
  
  if (isPrimary && isHighAlignment) {
    buttonClass = 'w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200';
  } else if (isPrimary) {
    buttonClass = 'w-full py-4 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-all duration-200';
  } else if (button.priority === 'secondary') {
    buttonClass = 'w-full py-3 px-5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 font-medium rounded-lg shadow hover:shadow-md transition-all duration-200';
  } else {
    buttonClass = 'w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-normal text-sm rounded-lg transition-all duration-200';
  }
  
  return (
    <button className={`${buttonClass} flex items-center justify-center gap-3`}>
      <span className="text-2xl">{button.icon}</span>
      <span>{button.label}</span>
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
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-500">
      <div className="flex items-start gap-3">
        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
            📍 Next {elementEmoji[userElement]} {userElement.charAt(0).toUpperCase() + userElement.slice(1)} window:
          </p>
          <p className="text-base font-bold text-blue-800 dark:text-blue-200">
            {nextWindow.planet.name} Hour • {timeStr}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
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
  const isHighAlignment = alignment.quality === 'perfect' || alignment.quality === 'strong';
  
  return (
    <div className={`p-4 rounded-lg border-2 ${
      isHighAlignment 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
        : 'bg-gray-50 dark:bg-gray-800/20 border-gray-300'
    }`}>
      <p className={`font-semibold mb-3 ${
        isHighAlignment 
          ? 'text-green-900 dark:text-green-100'
          : 'text-gray-900 dark:text-gray-100'
      }`}>
        💡 {isHighAlignment ? 'Best for right now:' : 'Use this time for:'}
      </p>
      <ul className={`space-y-1 text-sm ${
        isHighAlignment 
          ? 'text-green-800 dark:text-green-200'
          : 'text-gray-700 dark:text-gray-300'
      }`}>
        {guidance.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Debug Display - FIXED COLORS
function DebugHoursDisplay({ hours }: { hours: AccuratePlanetaryHour[] }) {
  return (
    <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <summary className="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100">
        🔍 Debug: View All 24 Hours
      </summary>
      <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
        {hours.map((hour, index) => (
          <div 
            key={index}
            className={`p-2 rounded text-xs ${
              hour.isCurrent 
                ? 'bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-500 text-gray-900 dark:text-gray-100' 
                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}
          >
            <strong>{hour.planet.name}</strong> ({hour.planet.element}) • 
            {hour.startTime.toLocaleTimeString()} - {hour.endTime.toLocaleTimeString()} • 
            {hour.durationMinutes} min • 
            {hour.isDayHour ? '☀️' : '🌙'}
            {hour.isCurrent && ' ← CURRENT'}
          </div>
        ))}
      </div>
    </details>
  );
}