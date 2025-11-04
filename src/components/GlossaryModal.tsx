'use client';

import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Islamic Numerology & ʿIlm al-Ḥurūf Glossary
 * Comprehensive definitions of key terms used in the application
 */

interface GlossaryTerm {
  term: string;
  arabic: string;
  meaning: string;
  definition: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Abjad',
    arabic: 'أبجد',
    meaning: 'Letter Numerical System',
    definition: 'The system of assigning numerical values to Arabic letters. Each letter from ا to غ has a specific number. Two main systems exist: Maghribi (North African) and Mashriqi (Eastern).'
  },
  {
    term: 'Kabīr',
    arabic: 'كبير',
    meaning: 'Grand Total',
    definition: 'The sum of all numerical values of letters in a name. The starting point for all other calculations. Never reduced; used as-is for analysis.'
  },
  {
    term: 'Ṣaghīr',
    arabic: 'صغير',
    meaning: 'Small/Reduced',
    definition: 'The digital root of Kabir, reduced to a single digit (1-9). Represents the soul essence and core character. Calculated by repeatedly summing digits until one remains.'
  },
  {
    term: 'Digital Root',
    arabic: 'الجذر الرقمي',
    meaning: 'Sum Reduction Method',
    definition: 'A mathematical process of repeatedly adding digits until a single digit (1-9) remains. Formula: 1 + ((n - 1) % 9). Essential for calculating Saghir and Soul Urge.'
  },
  {
    term: 'Ḥadath',
    arabic: 'حدث',
    meaning: 'Elemental Event/Classification',
    definition: 'The element (Fire, Water, Air, or Earth) assigned to a name based on Kabir mod 4. Determines personality and energy type: 0=Earth, 1=Fire, 2=Water, 3=Air.'
  },
  {
    term: 'Kawkab',
    arabic: 'كوكب',
    meaning: 'Planet/Luminary',
    definition: 'The planetary ruler of the first letter in a name. Seven classical planets govern different letters: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn. Each brings unique qualities.'
  },
  {
    term: 'Rūḥ',
    arabic: 'روح',
    meaning: 'Spirit/Soul',
    definition: 'The spiritual essence number, calculated the same as Saghir (1-9). Represents your inner spiritual nature and soul purpose. Also called "Soul Urge Number".'
  },
  {
    term: 'Soul Urge',
    arabic: 'دافع الروح',
    meaning: 'Inner Desires & Motivations',
    definition: 'Calculated from vowels only (ا, و, ي) in your name. Reveals your deepest desires, emotional nature, and what truly motivates you at a spiritual level.'
  },
  {
    term: 'Personality Number',
    arabic: 'رقم الشخصية',
    meaning: 'Outer Expression',
    definition: 'Calculated from consonants only. Shows how others perceive you and your outward personality. The mask you present to the world.'
  },
  {
    term: 'Destiny Number',
    arabic: 'رقم القدر',
    meaning: 'Life Path & Purpose',
    definition: 'Same as Saghir; your life path number. Represents your natural talents, life lessons, and overall purpose. What the universe calls you to become.'
  },
  {
    term: 'Personal Year',
    arabic: 'السنة الشخصية',
    meaning: 'Annual Cycle Number',
    definition: 'Calculated from birth date + current year. Changes annually (usually on birthday). Shows the theme and focus of the current year cycle. Ranges 1-9.'
  },
  {
    term: 'Elemental Type',
    arabic: 'النوع العنصري',
    meaning: 'Four Element Classification',
    definition: 'All names fall into one of four elements with distinct qualities: Fire (active, passionate), Water (emotional, intuitive), Air (intellectual, communicative), Earth (practical, grounded).'
  },
  {
    term: 'Harmony Score',
    arabic: 'درجة التوافق',
    meaning: 'Relationship Compatibility',
    definition: 'A modern interpretation (not classical) rating compatibility between two names on a 0-100 scale. Based on destiny similarity, soul urge alignment, and special pairings.'
  },
  {
    term: 'Rest Day',
    arabic: 'يوم الراحة',
    meaning: 'Recovery Day',
    definition: 'Days when your personal energy is low and recovery is needed. Important for maintaining balance. Recommended for rest, reflection, and avoiding major initiatives.'
  },
  {
    term: 'Quranic Resonance',
    arabic: 'الرنين القرآني',
    meaning: 'Connection to Quranic Wisdom',
    definition: 'A suggested Quranic verse based on your name\'s numerical value. Intended for spiritual reflection and gaining insight. Not a prediction or guarantee.'
  },
  {
    term: 'ʿIlm al-Ḥurūf',
    arabic: 'علم الحروف',
    meaning: 'Science of Letters',
    definition: 'An Islamic mystical and numerical science studying the properties and meanings of Arabic letters. Combines orthography, numerology, and spiritual philosophy developed over centuries.'
  },
  {
    term: 'Shams al-Maʿārif',
    arabic: 'شمس المعارف',
    meaning: 'Sun of Knowledge',
    definition: 'A classical Islamic text by Al-Būnī (13th century) documenting the science of letters, numerical correspondences, and their spiritual applications. A primary reference for Abjad systems.'
  },
  {
    term: 'Digital Root (Formula)',
    arabic: 'صيغة الجذر الرقمي',
    meaning: 'Mathematical Calculation',
    definition: 'Formula: digitalRoot(n) = 1 + ((n - 1) % 9). Special case: if result is 0, use 9 instead. Converts any number to its essence (1-9).'
  },
  {
    term: 'Modulo 4',
    arabic: 'القسمة على 4',
    meaning: 'Remainder Division',
    definition: 'Mathematical operation that divides by 4 and returns the remainder (0-3). Used in Hadath calculation: Kabir mod 4 determines element type. Example: 92 mod 4 = 0 (Earth).'
  },
  {
    term: 'Compatibility Factors',
    arabic: 'عوامل التوافق',
    meaning: 'Relationship Elements',
    definition: 'In relationship analysis: destiny compatibility (life path alignment), soul urge compatibility (emotional resonance), and special pairings (unique numerological combinations).'
  }
];

export function GlossaryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  const filteredTerms = GLOSSARY_TERMS.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        title={t?.glossary?.openTitle || "Open Islamic Numerology Glossary"}
      >
        <BookOpen className="w-4 h-4" />
        <span>Glossary</span>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-4 md:inset-12 bg-white rounded-lg shadow-xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-slate-700" />
              <h2 className="text-2xl font-bold text-slate-900">Islamic Numerology Glossary</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label={t?.glossary?.closeLabel || "Close glossary"}
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          {/* Search */}
          <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
            <input
              type="text"
              placeholder={t?.glossary?.searchPlaceholder || "Search terms... (e.g., 'Saghir', 'element', 'destiny')"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
            <p className="text-xs text-slate-600 mt-2">
              {filteredTerms.length} of {GLOSSARY_TERMS.length} terms
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              {filteredTerms.length > 0 ? (
                filteredTerms.map((term, index) => (
                  <div key={index} className="border-b border-slate-200 pb-6 last:border-b-0">
                    <div className="flex items-baseline gap-4 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{term.term}</h3>
                      <span className="text-sm text-slate-600 italic">({term.arabic})</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">{term.meaning}</p>
                    <p className="text-slate-700 leading-relaxed">{term.definition}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600">{t?.glossary?.noResults || "No terms found matching"} "{searchTerm}"</p>
                  <p className="text-sm text-slate-500 mt-2">Try searching for different keywords</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
