'use client';

import React, { useState } from 'react';

interface GlossaryTerm {
  arabic: string;
  transliteration: string;
  category: 'planet' | 'element' | 'divine' | 'concept' | 'practice';
  definition: {
    en: string;
    fr: string;
  };
  related?: string[];
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Planets
  {
    arabic: 'الشمس',
    transliteration: 'Ash-Shams',
    category: 'planet',
    definition: {
      en: 'The Sun - Represents divine light, leadership, and consciousness. Associated with the Divine Name An-Nūr (The Light).',
      fr: 'Le Soleil - Représente la lumière divine, le leadership et la conscience. Associé au Nom Divin An-Nūr (La Lumière).',
    },
    related: ['An-Nūr', 'Yawm al-Aḥad'],
  },
  {
    arabic: 'القمر',
    transliteration: 'Al-Qamar',
    category: 'planet',
    definition: {
      en: 'The Moon - Represents divine mercy, intuition, and emotional wisdom. Associated with the Divine Name Al-Laṭīf (The Subtle).',
      fr: 'La Lune - Représente la miséricorde divine, l\'intuition et la sagesse émotionnelle. Associée au Nom Divin Al-Laṭīf (Le Subtil).',
    },
    related: ['Al-Laṭīf', 'Manāzil al-Qamar'],
  },
  {
    arabic: 'عطارد',
    transliteration: '\'Uṭārid',
    category: 'planet',
    definition: {
      en: 'Mercury - Represents divine knowledge, communication, and mental clarity. Associated with the Divine Name Al-\'Alīm (The All-Knowing).',
      fr: 'Mercure - Représente la connaissance divine, la communication et la clarté mentale. Associé au Nom Divin Al-\'Alīm (L\'Omniscient).',
    },
    related: ['Al-\'Alīm', '\'Ilm'],
  },
  {
    arabic: 'الزهرة',
    transliteration: 'Az-Zuhrah',
    category: 'planet',
    definition: {
      en: 'Venus - Represents divine love, beauty, and harmony. Associated with the Divine Name Al-Wadūd (The Loving).',
      fr: 'Vénus - Représente l\'amour divin, la beauté et l\'harmonie. Associée au Nom Divin Al-Wadūd (L\'Aimant).',
    },
    related: ['Al-Wadūd', 'Jamāl'],
  },
  {
    arabic: 'المريخ',
    transliteration: 'Al-Mirrīkh',
    category: 'planet',
    definition: {
      en: 'Mars - Represents divine strength, courage, and action. Associated with the Divine Name Al-Qawiyy (The Strong).',
      fr: 'Mars - Représente la force divine, le courage et l\'action. Associé au Nom Divin Al-Qawiyy (Le Fort).',
    },
    related: ['Al-Qawiyy', 'Jihād'],
  },
  {
    arabic: 'المشتري',
    transliteration: 'Al-Mushtarī',
    category: 'planet',
    definition: {
      en: 'Jupiter - Represents divine expansion, generosity, and wisdom. Associated with the Divine Name Al-Wāsi\' (The All-Encompassing).',
      fr: 'Jupiter - Représente l\'expansion divine, la générosité et la sagesse. Associé au Nom Divin Al-Wāsi\' (Le Vaste).',
    },
    related: ['Al-Wāsi\'', 'Barakah'],
  },
  {
    arabic: 'زحل',
    transliteration: 'Zuḥal',
    category: 'planet',
    definition: {
      en: 'Saturn - Represents divine wisdom, patience, and structure. Associated with the Divine Name Al-Ḥakīm (The Wise).',
      fr: 'Saturne - Représente la sagesse divine, la patience et la structure. Associé au Nom Divin Al-Ḥakīm (Le Sage).',
    },
    related: ['Al-Ḥakīm', 'Ṣabr'],
  },

  // Elements
  {
    arabic: 'نار',
    transliteration: 'Nār',
    category: 'element',
    definition: {
      en: 'Fire Element - Represents energy, passion, and transformation. Associated with Sun and Mars.',
      fr: 'Élément Feu - Représente l\'énergie, la passion et la transformation. Associé au Soleil et à Mars.',
    },
    related: ['Ash-Shams', 'Al-Mirrīkh'],
  },
  {
    arabic: 'ماء',
    transliteration: 'Māʾ',
    category: 'element',
    definition: {
      en: 'Water Element - Represents emotions, intuition, and purification. Associated with the Moon.',
      fr: 'Élément Eau - Représente les émotions, l\'intuition et la purification. Associé à la Lune.',
    },
    related: ['Al-Qamar'],
  },
  {
    arabic: 'هواء',
    transliteration: 'Hawāʾ',
    category: 'element',
    definition: {
      en: 'Air Element - Represents thought, communication, and spirituality. Associated with Mercury and Jupiter.',
      fr: 'Élément Air - Représente la pensée, la communication et la spiritualité. Associé à Mercure et Jupiter.',
    },
    related: ['\'Uṭārid', 'Al-Mushtarī'],
  },
  {
    arabic: 'تراب',
    transliteration: 'Turāb',
    category: 'element',
    definition: {
      en: 'Earth Element - Represents stability, manifestation, and practicality. Associated with Venus and Saturn.',
      fr: 'Élément Terre - Représente la stabilité, la manifestation et la praticité. Associé à Vénus et Saturne.',
    },
    related: ['Az-Zuhrah', 'Zuḥal'],
  },

  // Divine Names (selection)
  {
    arabic: 'النُّور',
    transliteration: 'An-Nūr',
    category: 'divine',
    definition: {
      en: 'The Light - One of the 99 Names of Allah. The source of all illumination and guidance. Associated with the Sun.',
      fr: 'La Lumière - Un des 99 Noms d\'Allah. La source de toute illumination et guidance. Associé au Soleil.',
    },
    related: ['Ash-Shams'],
  },
  {
    arabic: 'اللطيف',
    transliteration: 'Al-Laṭīf',
    category: 'divine',
    definition: {
      en: 'The Subtle - One of the 99 Names of Allah. The Gentle, Kind, and All-Perceiving. Associated with the Moon.',
      fr: 'Le Subtil - Un des 99 Noms d\'Allah. Le Doux, Bienveillant et Omniscient. Associé à la Lune.',
    },
    related: ['Al-Qamar'],
  },

  // Key Concepts
  {
    arabic: 'الساعات الفلكية',
    transliteration: 'As-Sāʿāt al-Falakiyya',
    category: 'concept',
    definition: {
      en: 'Planetary Hours - The ancient system of dividing day and night into 24 unequal hours, each ruled by a classical planet.',
      fr: 'Heures Planétaires - Le système ancien de division du jour et de la nuit en 24 heures inégales, chacune gouvernée par une planète classique.',
    },
  },
  {
    arabic: 'منازل القمر',
    transliteration: 'Manāzil al-Qamar',
    category: 'concept',
    definition: {
      en: 'Lunar Mansions - The 28 stations of the Moon through its monthly cycle. Each has specific spiritual significance and favorable/unfavorable activities.',
      fr: 'Maisons Lunaires - Les 28 stations de la Lune à travers son cycle mensuel. Chacune a une signification spirituelle spécifique et des activités favorables/défavorables.',
    },
    related: ['Al-Qamar'],
  },
  {
    arabic: 'علم',
    transliteration: '\'Ilm',
    category: 'concept',
    definition: {
      en: 'Knowledge - Especially divine and sacred knowledge. A central concept in Islam emphasizing the pursuit of both worldly and spiritual understanding.',
      fr: 'Connaissance - Spécialement la connaissance divine et sacrée. Un concept central en Islam mettant l\'accent sur la poursuite de la compréhension mondaine et spirituelle.',
    },
    related: ['Al-\'Alīm'],
  },
  {
    arabic: 'حكمة',
    transliteration: 'Ḥikmah',
    category: 'concept',
    definition: {
      en: 'Wisdom - Deep understanding combined with right action. The ability to apply knowledge appropriately.',
      fr: 'Sagesse - Compréhension profonde combinée avec l\'action juste. La capacité d\'appliquer la connaissance de manière appropriée.',
    },
    related: ['Al-Ḥakīm'],
  },
  {
    arabic: 'بركة',
    transliteration: 'Barakah',
    category: 'concept',
    definition: {
      en: 'Divine Blessing - Spiritual abundance and grace that comes from Allah. Increase in goodness beyond material measure.',
      fr: 'Bénédiction Divine - Abondance spirituelle et grâce qui vient d\'Allah. Augmentation du bien au-delà de la mesure matérielle.',
    },
  },
  {
    arabic: 'صبر',
    transliteration: 'Ṣabr',
    category: 'concept',
    definition: {
      en: 'Patience - Endurance and perseverance in face of difficulty. A fundamental virtue in Islam, especially associated with Saturn.',
      fr: 'Patience - Endurance et persévérance face aux difficultés. Une vertu fondamentale en Islam, spécialement associée à Saturne.',
    },
    related: ['Zuḥal', 'Aṣ-Ṣabūr'],
  },
  {
    arabic: 'جمال',
    transliteration: 'Jamāl',
    category: 'concept',
    definition: {
      en: 'Beauty - Divine beauty and grace. One of the two primary aspects of Allah\'s attributes (Jamāl and Jalāl).',
      fr: 'Beauté - Beauté et grâce divines. L\'un des deux aspects principaux des attributs d\'Allah (Jamāl et Jalāl).',
    },
    related: ['Az-Zuhrah', 'Al-Jamīl'],
  },

  // Spiritual Practices
  {
    arabic: 'ذكر',
    transliteration: 'Dhikr',
    category: 'practice',
    definition: {
      en: 'Remembrance - The practice of remembering and invoking Allah, often through repetition of Divine Names or Quranic phrases.',
      fr: 'Remembrance - La pratique de se souvenir et invoquer Allah, souvent par la répétition des Noms Divins ou phrases coraniques.',
    },
  },
  {
    arabic: 'دعاء',
    transliteration: 'Duʿāʾ',
    category: 'practice',
    definition: {
      en: 'Supplication - Personal prayer and petition to Allah. Can be optimized by choosing appropriate planetary hours.',
      fr: 'Supplication - Prière personnelle et pétition à Allah. Peut être optimisée en choisissant les heures planétaires appropriées.',
    },
  },
  {
    arabic: 'توكل',
    transliteration: 'Tawakkul',
    category: 'practice',
    definition: {
      en: 'Reliance on Allah - Complete trust and dependence on Allah while taking appropriate worldly action.',
      fr: 'Confiance en Allah - Confiance et dépendance complètes en Allah tout en prenant l\'action mondaine appropriée.',
    },
  },
  {
    arabic: 'نية',
    transliteration: 'Niyyah',
    category: 'practice',
    definition: {
      en: 'Intention - The sincere intention behind an action. In Islam, actions are judged by intentions.',
      fr: 'Intention - L\'intention sincère derrière une action. En Islam, les actions sont jugées par les intentions.',
    },
  },
];

interface GlossaryProps {
  currentLanguage: 'en' | 'fr';
}

export default function Glossary({ currentLanguage = 'en' }: GlossaryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const lang = currentLanguage;

  const categories = [
    { id: 'all', label: { en: 'All Terms', fr: 'Tous les Termes' }, icon: '📚' },
    { id: 'planet', label: { en: 'Planets', fr: 'Planètes' }, icon: '🪐' },
    { id: 'element', label: { en: 'Elements', fr: 'Éléments' }, icon: '🔥' },
    { id: 'divine', label: { en: 'Divine Names', fr: 'Noms Divins' }, icon: '✨' },
    { id: 'concept', label: { en: 'Concepts', fr: 'Concepts' }, icon: '💡' },
    { id: 'practice', label: { en: 'Practices', fr: 'Pratiques' }, icon: '🙏' },
  ];

  const filteredTerms = GLOSSARY_TERMS.filter((term) => {
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      term.arabic.includes(searchTerm) ||
      term.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition[lang].toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      planet: 'from-purple-500 to-indigo-500',
      element: 'from-orange-500 to-red-500',
      divine: 'from-yellow-500 to-amber-500',
      concept: 'from-blue-500 to-cyan-500',
      practice: 'from-green-500 to-emerald-500',
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {lang === 'en' ? 'Spiritual Glossary' : 'Glossaire Spirituel'}
        </h1>
        <div className="text-2xl text-indigo-600 dark:text-indigo-400 mb-1">قاموس روحاني</div>
        <div className="text-lg text-gray-600 dark:text-gray-400 italic">Qāmūs Rūḥānī</div>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          {lang === 'en'
            ? 'Key Arabic terms and concepts with transliterations and explanations'
            : 'Termes arabes clés et concepts avec translittérations et explications'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'en' ? 'Search terms...' : 'Rechercher des termes...'}
            className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label[lang]}</span>
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-center text-gray-600 dark:text-gray-400">
        {lang === 'en' ? 'Showing' : 'Affichage de'} <span className="font-bold text-indigo-600 dark:text-indigo-400">{filteredTerms.length}</span> {lang === 'en' ? 'terms' : 'termes'}
      </div>

      {/* Glossary Terms */}
      <div className="grid gap-4">
        {filteredTerms.map((term, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-3xl mb-2">{term.arabic}</div>
                <div className="text-xl text-indigo-600 dark:text-indigo-400 mb-1">
                  {term.transliteration}
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(
                  term.category
                )} text-white text-sm font-semibold`}
              >
                {categories.find((c) => c.id === term.category)?.label[lang]}
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {term.definition[lang]}
            </p>

            {term.related && term.related.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {lang === 'en' ? 'Related:' : 'Associé:'}
                </span>
                {term.related.map((related, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {related}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <div className="text-6xl mb-4">📖</div>
          <p className="text-xl">
            {lang === 'en' ? 'No terms found matching your search.' : 'Aucun terme trouvé correspondant à votre recherche.'}
          </p>
        </div>
      )}
    </div>
  );
}
