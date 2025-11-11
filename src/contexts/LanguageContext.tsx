'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKeys } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Detect browser language and return 'en' or 'fr'
 * French-speaking countries/regions supported:
 * - France, Belgium, Switzerland, Canada (Quebec)
 * - Senegal, Ivory Coast, Cameroon, Mali, Burkina Faso
 * - Niger, Chad, Guinea, Benin, Togo, Rwanda, Burundi
 * - Haiti, Madagascar, Monaco, Luxembourg, and more
 */
function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  // Get browser language (e.g., 'fr-FR', 'fr-SN', 'en-US', 'ar-MA')
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
  
  // Check if it starts with 'fr' (covers fr-FR, fr-SN, fr-CA, etc.)
  if (browserLang.toLowerCase().startsWith('fr')) {
    return 'fr';
  }

  // Default to English for all other languages
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Check if user has manually selected a language before
    const saved = localStorage.getItem('preferred-language') as Language | null;
    
    if (saved === 'en' || saved === 'fr') {
      // User has previously chosen a language - respect their choice
      setLanguage(saved);
    } else {
      // First time visitor - auto-detect from browser
      const detected = detectBrowserLanguage();
      setLanguage(detected);
      // Don't save to localStorage yet - only save when user manually changes
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    // Save user's manual preference
    localStorage.setItem('preferred-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
