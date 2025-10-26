/**
 * Life Path Calculator
 * Implements 5 core numerology calculations based on Abjad system
 */

import type { Element } from '../types/planetary';

// Mashriqi (Eastern) Abjad - Standard Abjad Hawwaz order
const ABJAD_MASHRIQI: Record<string, number> = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
  'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000
};

/**
 * Reduce a number to a single digit or Master Number (11, 22, 33)
 * Special handling for sacred numbers in Islamic tradition
 */
export function reduceToSingleDigit(num: number): number {
  // Sacred numbers in Islamic tradition that should not be reduced
  const sacredNumbers = [19, 70, 786]; // 786 = Bismillah
  
  if (sacredNumbers.includes(num)) {
    return num;
  }
  
  // Check for Master Numbers first (before reduction)
  if (num === 11 || num === 22 || num === 33) {
    return num;
  }
  
  // Reduce by summing digits
  while (num >= 10) {
    const digits = String(num).split('').map(Number);
    const sum = digits.reduce((a, b) => a + b, 0);
    
    // If we hit a Master Number, return it
    if (sum === 11 || sum === 22 || sum === 33) {
      return sum;
    }
    
    num = sum;
  }
  
  return num;
}

/**
 * Get Abjad value for a character
 */
function getAbjadValue(char: string): number {
  const normalized = char.toUpperCase();
  return (ABJAD_MASHRIQI as Record<string, number>)[normalized] || 0;
}

/**
 * Check if character is a vowel in Arabic
 * Alif (ا), Waw (و), Ya (ي)
 */
function isVowel(char: string): boolean {
  const vowels = ['A', 'W', 'Y', 'ا', 'و', 'ي'];
  return vowels.includes(char.toUpperCase());
}

/**
 * Check if character is a consonant (non-vowel)
 */
function isConsonant(char: string): boolean {
  const normalized = char.toUpperCase();
  // Check if it's a letter and not a vowel
  return /[A-Z]|[ء-ي]/.test(normalized) && !isVowel(normalized);
}

/**
 * Calculate Life Path Number
 * Sum of all letters in birth name, reduced to single digit
 * 
 * Example: Muhammad
 * م(40) + ح(8) + م(40) + د(4) = 92 → 9+2 = 11 (Master Number)
 */
export function calculateLifePathNumber(name: string): number {
  let total = 0;
  
  for (const char of name) {
    total += getAbjadValue(char);
  }
  
  return reduceToSingleDigit(total);
}

/**
 * Calculate Soul Urge Number (Heart's Desire)
 * Sum of vowels only
 * Represents deepest desires and inner motivations
 * 
 * Example: Ali (علي)
 * ع(70) + ي(10) = 80 → 8+0 = 8
 */
export function calculateSoulUrgeNumber(name: string): number {
  let total = 0;
  
  for (const char of name) {
    if (isVowel(char)) {
      total += getAbjadValue(char);
    }
  }
  
  return total === 0 ? 0 : reduceToSingleDigit(total);
}

/**
 * Calculate Personality Number (Expression)
 * Sum of consonants only
 * How others perceive you; your outer expression
 * 
 * Example: Ali (علي)
 * ع(70) + ل(30) = 100 → 1+0+0 = 1
 */
export function calculatePersonalityNumber(name: string): number {
  let total = 0;
  
  for (const char of name) {
    if (isConsonant(char)) {
      total += getAbjadValue(char);
    }
  }
  
  return total === 0 ? 0 : reduceToSingleDigit(total);
}

/**
 * Calculate Destiny Number
 * Sum of: full birth name + mother's name + father's name
 * Your ultimate life path and mission
 * 
 * This represents the soul's destiny - what you're meant to accomplish
 */
export function calculateDestinyNumber(
  firstName: string,
  motherName: string,
  fatherName: string
): number {
  let total = 0;
  const fullName = `${firstName}${motherName}${fatherName}`;
  
  for (const char of fullName) {
    total += getAbjadValue(char);
  }
  
  return reduceToSingleDigit(total);
}

/**
 * Calculate Life Cycle Position
 * Based on age within the 9-year cycle
 * 
 * Each 9-year cycle represents a phase:
 * 1-9: Initiation Phase
 * 10-18: Development Phase
 * 19-27: Creative Phase
 * 28-36: Manifestation Phase
 * 37-45: Wisdom Phase
 * 46-54: Transformation Phase
 * 55-63: Integration Phase
 * 64-72: Culmination Phase
 * 73+: Transcendence Phase
 */
export function calculateLifeCyclePosition(age: number): number {
  if (age === 0) return 0;
  
  // Get position within 9-year cycle
  const position = ((age - 1) % 9) + 1;
  return position;
}

/**
 * Calculate cycle age based on birth date
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  
  // Adjust if birthday hasn't occurred this year
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--;
  }
  
  return age;
}

/**
 * Get Spiritual Station based on Life Cycle
 * Each 9-year cycle corresponds to a spiritual station (maqāmāt) in Islamic tradition
 */
export function getSpiritualStationForCycle(cyclePosition: number): string {
  const stations = [
    'Tawbah (Repentance)',      // 1
    'Wara\' (Scrupulousness)',  // 2
    'Zuhd (Asceticism)',        // 3
    'Sabr (Patience)',          // 4
    'Tawakkul (Trust)',         // 5
    'Riḍā (Contentment)',       // 6
    'Tafakkur (Contemplation)', // 7
    'Murāqabah (Watchfulness)', // 8
    'Maḥabbah (Divine Love)'    // 9
  ];
  
  return stations[cyclePosition - 1] || 'Unknown';
}

/**
 * Get element for Life Path Number
 */
export function getElementForNumber(num: number): Element {
  const elementMap: Record<number, Element> = {
    1: 'fire',
    2: 'water',
    3: 'air',
    4: 'earth',
    5: 'air',
    6: 'earth',
    7: 'water',
    8: 'fire',
    9: 'fire',
    11: 'fire',
    22: 'earth',
    33: 'fire'
  };
  
  return elementMap[num] || 'air';
}

/**
 * Get planetary ruler for Life Path Number
 */
export function getPlanetForNumber(num: number): string {
  const planetMap: Record<number, string> = {
    1: 'Sun',
    2: 'Moon',
    3: 'Jupiter',
    4: 'Saturn',
    5: 'Mercury',
    6: 'Venus',
    7: 'Neptune',
    8: 'Mars',
    9: 'Mars',
    11: 'Sun',
    22: 'Saturn',
    33: 'Mars'
  };
  
  return planetMap[num] || 'Mercury';
}

/**
 * Check if number is a Master Number
 */
export function isMasterNumber(num: number): boolean {
  return num === 11 || num === 22 || num === 33;
}

/**
 * Format number for display (e.g., "11/2" for Master Number 11)
 */
export function formatNumberDisplay(num: number): string {
  if (num === 11) return '11/2';
  if (num === 22) return '22/4';
  if (num === 33) return '33/6';
  return String(num);
}

/**
 * Get color for number (for UI visualization)
 */
export function getColorForNumber(num: number): string {
  const colorMap: Record<number, string> = {
    1: '#FF6B35',
    2: '#4ECDC4',
    3: '#FFD93D',
    4: '#6B4423',
    5: '#6C5CE7',
    6: '#E84393',
    7: '#0984E3',
    8: '#D63031',
    9: '#27AE60',
    11: '#F1C40F',
    22: '#9B59B6',
    33: '#E74C3C'
  };
  
  return colorMap[num] || '#95A5A6';
}

/**
 * Calculate all 5 life path numbers at once
 */
export function calculateAllLifePathNumbers(
  firstName: string,
  motherName: string,
  fatherName: string,
  birthDate: Date
) {
  const age = calculateAge(birthDate);
  const cyclePosition = calculateLifeCyclePosition(age);
  
  return {
    lifePathNumber: calculateLifePathNumber(firstName),
    soulUrgeNumber: calculateSoulUrgeNumber(firstName),
    personalityNumber: calculatePersonalityNumber(firstName),
    destinyNumber: calculateDestinyNumber(firstName, motherName, fatherName),
    cyclePosition,
    currentAge: age,
    currentStation: getSpiritualStationForCycle(cyclePosition)
  };
}
