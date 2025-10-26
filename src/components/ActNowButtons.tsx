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
      <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-900 dark:text-gray-100 font-semibold">
          ✅ Part 2 Complete: Planetary hours calculating!
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
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

// Current Hour Display - FIXED COLORS
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
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border-2 border-indigo-400 dark:border-indigo-600 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Current Planetary Hour</h3>
      </div>
      
      <div className="space-y-2">
        <p className="text-lg text-slate-900 dark:text-slate-100">
          <strong>{currentHour.planet.name}</strong> ({currentHour.planet.nameArabic})
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {timeStr} • {currentHour.durationMinutes} minutes
        </p>
        <p className="text-base text-slate-800 dark:text-slate-200">
          Element: {elementEmoji[currentHour.planet.element]} {currentHour.planet.element.charAt(0).toUpperCase() + currentHour.planet.element.slice(1)} ({currentHour.planet.elementArabic})
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-400">
          {currentHour.isDayHour ? '☀️ Day Hour' : '🌙 Night Hour'}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600">
        <p className="text-sm text-slate-800 dark:text-slate-200">
          Your Element: {elementEmoji[userElement]} {userElement.charAt(0).toUpperCase() + userElement.slice(1)}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          {location.isAccurate ? '✅ Using accurate location-based calculation' : '⚠️ Using approximate timing'}
        </p>
      </div>
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