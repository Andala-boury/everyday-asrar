'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
          language === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
          language === 'fr'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        🇫🇷 FR
      </button>
    </div>
  );
}
