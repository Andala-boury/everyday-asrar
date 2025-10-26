'use client';

import React, { useState, useEffect } from 'react';
import { Element, UserLocation, AccuratePlanetaryHour } from '../types/planetary';
import { getUserLocation, saveLocation, loadLocation } from '../utils/location';
import { 
  calculateAccuratePlanetaryHours, 
  getCurrentPlanetaryHour 
} from '../utils/planetaryHours';
import { MapPin, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface ActNowButtonsProps {
  userElement: Element;
}

export function ActNowButtons({ userElement }: ActNowButtonsProps) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [planetaryHours, setPlanetaryHours] = useState<AccuratePlanetaryHour[]>([]);
  const [currentHour, setCurrentHour] = useState<AccuratePlanetaryHour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize location and calculate hours
  useEffect(() => {
    async function initialize() {
      setIsLoading(true);
      
      // Try to load saved location
      let loc = loadLocation();
      
      // If no saved location, request it
      if (!loc) {
        loc = await getUserLocation();
        saveLocation(loc);
      }
      
      setLocation(loc);
      
      // Calculate planetary hours
      const hours = calculateAccuratePlanetaryHours(
        new Date(),
        loc.latitude,
        loc.longitude
      );
      setPlanetaryHours(hours);
      
      // Get current hour
      const current = getCurrentPlanetaryHour(hours);
      setCurrentHour(current);
      
      setIsLoading(false);
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
    }, 60000); // Every 60 seconds
    
    return () => clearInterval(interval);
  }, [location]);
  
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
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!location || !currentHour) {
    return (
      <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="text-amber-900 dark:text-amber-100">
          Unable to calculate planetary hours. Please try again.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Location Section */}
      <LocationSection 
        location={location}
        onRequestUpdate={requestLocationUpdate}
      />
      
      {/* Current Hour Display */}
      <CurrentHourDisplay 
        currentHour={currentHour}
        userElement={userElement}
        location={location}
      />
      
      {/* Debug: Show all hours (remove this later) */}
      <DebugHoursDisplay hours={planetaryHours} />
      
      {/* Placeholder for next parts */}
      <div className="p-6 bg-green-50 dark:bg-green-900/30 rounded-lg border-2 border-green-500">
        <p className="text-green-900 dark:text-green-100 font-bold text-lg">
          ✅ Part 2 Complete: Planetary hours calculating!
        </p>
        <p className="text-base text-green-800 dark:text-green-200 mt-2">
          Next: Implement Part 3 (Element Alignment & Action Buttons)
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

// Current Hour Display - SOLID BACKGROUND VERSION
function CurrentHourDisplay({ 
  currentHour,
  userElement,
  location
}: { 
  currentHour: AccuratePlanetaryHour;
  userElement: Element;
  location: UserLocation;
}) {
  const elementEmoji = {
    fire: '🔥',
    water: '💧',
    air: '💨',
    earth: '🌍'
  };
  
  const timeStr = currentHour.startTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }) + ' - ' + currentHour.endTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return (
    <div className="p-6 bg-indigo-600 dark:bg-indigo-700 rounded-xl shadow-lg border-2 border-indigo-500">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-6 w-6 text-white" />
        <h3 className="text-xl font-bold text-white">Current Planetary Hour</h3>
      </div>
      
      <div className="space-y-2">
        <p className="text-lg text-white">
          <strong>{currentHour.planet.name}</strong> ({currentHour.planet.nameArabic})
        </p>
        <p className="text-sm text-white">
          {timeStr} • {currentHour.durationMinutes} minutes
        </p>
        <p className="text-base text-white">
          Element: {elementEmoji[currentHour.planet.element]} {currentHour.planet.element.charAt(0).toUpperCase() + currentHour.planet.element.slice(1)} ({currentHour.planet.elementArabic})
        </p>
        <p className="text-sm text-white">
          {currentHour.isDayHour ? '☀️ Day Hour' : '🌙 Night Hour'}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t-2 border-indigo-400">
        <p className="text-sm text-white">
          Your Element: {elementEmoji[userElement]} {userElement.charAt(0).toUpperCase() + userElement.slice(1)}
        </p>
        <p className="text-xs text-white mt-1">
          {location.isAccurate ? '✅ Using accurate location-based calculation' : '⚠️ Using approximate timing'}
        </p>
      </div>
    </div>
  );
}

// Debug Display - BETTER CONTRAST
function DebugHoursDisplay({ hours }: { hours: AccuratePlanetaryHour[] }) {
  return (
    <details className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow">
      <summary className="cursor-pointer text-base font-semibold text-gray-900 dark:text-white">
        🔍 Debug: View All 24 Hours (Click to expand)
      </summary>
      <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
        {hours.map((hour, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg text-sm font-medium border-2 ${
              hour.isCurrent 
                ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-600 text-gray-900 dark:text-white' 
                : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <strong>{hour.planet.name}</strong> ({hour.planet.element})
              </div>
              <div>
                {hour.isDayHour ? '☀️ Day' : '🌙 Night'}
                {hour.isCurrent && ' ← NOW'}
              </div>
            </div>
            <div className="text-xs mt-1 opacity-75">
              {hour.startTime.toLocaleTimeString()} - {hour.endTime.toLocaleTimeString()} • {hour.durationMinutes} min
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}