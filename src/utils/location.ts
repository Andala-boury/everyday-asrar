import { UserLocation } from '../types/planetary';

export async function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      // Fallback to Mecca (Qibla direction)
      resolve({
        latitude: 21.4225,
        longitude: 39.8262,
        cityName: 'Mecca (Default)',
        isAccurate: false
      });
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Optional: Reverse geocode to get city name
        let cityName = 'Your Location';
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          cityName = data.address?.city || data.address?.town || data.address?.village || 'Your Location';
        } catch (error) {
          console.warn('Could not fetch city name');
        }
        
        resolve({
          latitude,
          longitude,
          cityName,
          isAccurate: true
        });
      },
      (error) => {
        console.warn('Location permission denied:', error);
        // Fallback to Mecca
        resolve({
          latitude: 21.4225,
          longitude: 39.8262,
          cityName: 'Mecca (Default)',
          isAccurate: false
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  });
}

export function saveLocation(location: UserLocation): void {
  localStorage.setItem('userLocation', JSON.stringify(location));
}

export function loadLocation(): UserLocation | null {
  try {
    const stored = localStorage.getItem('userLocation');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading location:', error);
    return null;
  }
}
