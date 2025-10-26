import { Element, ElementAlignment, TimeWindow, AccuratePlanetaryHour } from '../types/planetary';

export function analyzeAlignment(
  userElement: Element,
  hourElement: Element
): ElementAlignment {
  
  // Perfect - Same element
  if (userElement === hourElement) {
    return {
      userElement,
      hourElement,
      quality: 'perfect',
      qualityArabic: 'اتصال تام',
      qualityDescription: 'Perfect Alignment',
      harmonyScore: 100,
      color: 'green'
    };
  }
  
  // Strong - Compatible elements
  const compatiblePairs: Record<Element, Element> = {
    fire: 'air',
    air: 'fire',
    water: 'earth',
    earth: 'water'
  };
  
  if (compatiblePairs[userElement] === hourElement) {
    return {
      userElement,
      hourElement,
      quality: 'strong',
      qualityArabic: 'اتصال قوي',
      qualityDescription: 'Strong Connection',
      harmonyScore: 75,
      color: 'blue'
    };
  }
  
  // Opposing - Conflicting elements
  const opposingPairs: Record<Element, Element> = {
    fire: 'water',
    water: 'fire',
    air: 'earth',
    earth: 'air'
  };
  
  if (opposingPairs[userElement] === hourElement) {
    return {
      userElement,
      hourElement,
      quality: 'opposing',
      qualityArabic: 'اتصال ضعيف',
      qualityDescription: 'Opposing Energy',
      harmonyScore: 25,
      color: 'gray'
    };
  }
  
  // Moderate - Neutral
  return {
    userElement,
    hourElement,
    quality: 'moderate',
    qualityArabic: 'اتصال متوسط',
    qualityDescription: 'Moderate Connection',
    harmonyScore: 50,
    color: 'yellow'
  };
}

export function calculateTimeWindow(
  currentHour: AccuratePlanetaryHour,
  userElement: Element,
  allHours: AccuratePlanetaryHour[]
): TimeWindow {
  
  const now = Date.now();
  const closesInMs = currentHour.endTime.getTime() - now;
  const closesInMinutes = Math.floor(closesInMs / 60000);
  
  // Format closing time
  let closesIn: string;
  if (closesInMinutes < 1) {
    closesIn = 'Less than 1 minute';
  } else if (closesInMinutes === 1) {
    closesIn = '1 minute';
  } else if (closesInMinutes < 60) {
    closesIn = `${closesInMinutes} minutes`;
  } else {
    const hours = Math.floor(closesInMinutes / 60);
    const mins = closesInMinutes % 60;
    closesIn = mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  // Find next optimal window (same or compatible element)
  const currentIndex = allHours.findIndex(h => h.isCurrent);
  let nextOptimalWindow: AccuratePlanetaryHour | null = null;
  
  for (let i = currentIndex + 1; i < allHours.length; i++) {
    const hour = allHours[i];
    const alignment = analyzeAlignment(userElement, hour.planet.element);
    
    if (alignment.quality === 'perfect' || alignment.quality === 'strong') {
      nextOptimalWindow = hour;
      break;
    }
  }
  
  // Format next window time
  let nextWindowIn = 'Tomorrow';
  if (nextOptimalWindow) {
    const nextWindowMs = nextOptimalWindow.startTime.getTime() - now;
    const nextWindowMinutes = Math.floor(nextWindowMs / 60000);
    
    if (nextWindowMinutes < 60) {
      nextWindowIn = `${nextWindowMinutes} minutes`;
    } else if (nextWindowMinutes < 1440) {
      const hours = Math.floor(nextWindowMinutes / 60);
      nextWindowIn = `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      const timeStr = nextOptimalWindow.startTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      nextWindowIn = `Tomorrow at ${timeStr}`;
    }
  }
  
  // Determine urgency
  let urgency: 'high' | 'medium' | 'low';
  if (closesInMinutes <= 15) {
    urgency = 'high';
  } else if (closesInMinutes <= 45) {
    urgency = 'medium';
  } else {
    urgency = 'low';
  }
  
  return {
    closesIn,
    closesInMs,
    closesInMinutes,
    nextOptimalWindow,
    nextWindowIn,
    urgency
  };
}
