export type Element = 'fire' | 'water' | 'air' | 'earth';

export interface UserLocation {
  latitude: number;
  longitude: number;
  cityName?: string;
  isAccurate: boolean; // true if GPS, false if default
}

export interface PlanetInfo {
  name: string;
  nameArabic: string;
  element: Element;
  elementArabic: string;
}

export interface AccuratePlanetaryHour {
  planet: PlanetInfo;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  isCurrent: boolean;
  isDayHour: boolean;
}

export type AlignmentQuality = 'perfect' | 'strong' | 'moderate' | 'weak' | 'opposing';

export interface ElementAlignment {
  userElement: Element;
  hourElement: Element;
  quality: AlignmentQuality;
  qualityArabic: string;
  qualityDescription: string;
  harmonyScore: number;
  color: string;
}

export interface TimeWindow {
  closesIn: string;
  closesInMs: number;
  closesInMinutes: number;
  nextOptimalWindow: AccuratePlanetaryHour | null;
  nextWindowIn: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface ActionButton {
  icon: string;
  label: string;
  action: 'start' | 'schedule' | 'rest' | 'plan' | 'wait';
  priority: 'primary' | 'secondary' | 'tertiary';
}
