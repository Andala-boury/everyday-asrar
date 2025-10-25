'use client';

import React, { useState, useEffect } from 'react';
import { Element, UserLocation } from '../types/planetary';
import { getUserLocation, saveLocation, loadLocation } from '../utils/location';
import { MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

interface ActNowButtonsProps {
  userElement: Element;
}

export function ActNowButtons({ userElement }: ActNowButtonsProps) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize location
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
      setIsLoading(false);
    }
    
    initialize();
  }, []);
  
  // Request new location
  async function requestLocationUpdate() {
    setIsLoading(true);
    const loc = await getUserLocation();
    saveLocation(loc);
    setLocation(loc);
    setIsLoading(false);
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!location) {
    return (
      <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
        <p className="text-amber-900 dark:text-amber-100">
          Unable to detect location. Please try again.
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
      
      {/* Placeholder for next parts */}
      <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-700 dark:text-gray-300">
          ✅ Part 1 Complete: Location detection working!
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Next: Implement Part 2 (Planetary Hour Calculation)
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
