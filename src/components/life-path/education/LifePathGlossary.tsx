/**
 * Life Path Glossary
 * Interactive reference for numerology terms
 * Based on Divine Timing Glossary.tsx structure
 */

import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

type TermCategory = 'core' | 'master' | 'karmic' | 'cycles' | 'elements';

interface GlossaryTerm {
  id: string;
  arabic: string;
  transliteration: string;
  category: TermCategory;
  definition: {
    en: string;
    fr: string;
    ar: string;
  };
  relatedTerms?: string[];
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  // CORE NUMBERS
  {
    id: 'life-path',
    arabic: 'رقم مسار الحياة',
    transliteration: 'Raqm Masār al-Ḥayāh',
    category: 'core',
    definition: {
      en: 'The most important number in numerology, calculated from your birth date. It represents your spiritual essence, life mission, and the lessons you came to learn.',
      fr: 'Le nombre le plus important en numérologie, calculé à partir de votre date de naissance. Il représente votre essence spirituelle, mission de vie et les leçons que vous êtes venu apprendre.',
      ar: 'الرقم الأكثر أهمية في علم الأرقام، يُحسب من تاريخ ميلادك. يمثل جوهرك الروحي ورسالة حياتك والدروس التي جئت لتتعلمها.'
    },
    relatedTerms: ['soul-urge', 'personality', 'destiny']
  },
  {
    id: 'soul-urge',
    arabic: 'رقم رغبة الروح',
    transliteration: 'Raqm Raghbat ar-Rūḥ',
    category: 'core',
    definition: {
      en: 'Calculated from the vowels in your name, this number reveals your heart\'s deepest desires, what motivates you at a soul level, and what truly fulfills you spiritually.',
      fr: 'Calculé à partir des voyelles de votre nom, ce nombre révèle les désirs les plus profonds de votre cœur, ce qui vous motive au niveau de l\'âme et ce qui vous épanouit vraiment spirituellement.',
      ar: 'يُحسب من حروف العلة في اسمك، يكشف هذا الرقم عن أعمق رغبات قلبك، وما يحفزك على مستوى الروح، وما يحققك روحياً.'
    },
    relatedTerms: ['life-path', 'personality']
  },
  {
    id: 'personality',
    arabic: 'رقم الشخصية',
    transliteration: 'Raqm ash-Shakhṣiyya',
    category: 'core',
    definition: {
      en: 'Calculated from the consonants in your name, this number represents how others perceive you, your outer personality, and the first impression you make.',
      fr: 'Calculé à partir des consonnes de votre nom, ce nombre représente comment les autres vous perçoivent, votre personnalité extérieure et la première impression que vous faites.',
      ar: 'يُحسب من الحروف الساكنة في اسمك، يمثل هذا الرقم كيف يراك الآخرون، وشخصيتك الخارجية، والانطباع الأول الذي تتركه.'
    },
    relatedTerms: ['soul-urge', 'destiny']
  },
  {
    id: 'destiny',
    arabic: 'رقم المصير',
    transliteration: 'Raqm al-Maṣīr',
    category: 'core',
    definition: {
      en: 'Calculated from all letters in your full name, this number reveals your life\'s purpose, the work you came to accomplish, and your overarching spiritual mission.',
      fr: 'Calculé à partir de toutes les lettres de votre nom complet, ce nombre révèle le but de votre vie, le travail que vous êtes venu accomplir et votre mission spirituelle globale.',
      ar: 'يُحسب من جميع الحروف في اسمك الكامل، يكشف هذا الرقم عن هدف حياتك، والعمل الذي جئت لإنجازه، ورسالتك الروحية الشاملة.'
    },
    relatedTerms: ['life-path', 'soul-urge']
  },

  // MASTER NUMBERS
  {
    id: 'master-11',
    arabic: 'الرقم الرئيسي ١١',
    transliteration: 'Ar-Raqm ar-Raʾīsī 11',
    category: 'master',
    definition: {
      en: 'The Illuminator - A master number carrying heightened spiritual energy. Represents intuition, spiritual insight, and the ability to inspire others through visionary leadership.',
      fr: 'L\'Illuminateur - Un nombre maître portant une énergie spirituelle accrue. Représente l\'intuition, la perspicacité spirituelle et la capacité d\'inspirer les autres par un leadership visionnaire.',
      ar: 'المنير - رقم رئيسي يحمل طاقة روحية متزايدة. يمثل الحدس والبصيرة الروحية والقدرة على إلهام الآخرين من خلال القيادة الرؤيوية.'
    },
    relatedTerms: ['master-22', 'master-33']
  },
  {
    id: 'master-22',
    arabic: 'الرقم الرئيسي ٢٢',
    transliteration: 'Ar-Raqm ar-Raʾīsī 22',
    category: 'master',
    definition: {
      en: 'The Master Builder - Combines spiritual vision with practical manifestation. Represents the ability to turn dreams into reality and build lasting spiritual legacies.',
      fr: 'Le Bâtisseur Maître - Combine vision spirituelle et manifestation pratique. Représente la capacité de transformer les rêves en réalité et de construire des héritages spirituels durables.',
      ar: 'البناء الرئيسي - يجمع بين الرؤية الروحية والتجسيد العملي. يمثل القدرة على تحويل الأحلام إلى واقع وبناء إرث روحي دائم.'
    },
    relatedTerms: ['master-11', 'master-33']
  },
  {
    id: 'master-33',
    arabic: 'الرقم الرئيسي ٣٣',
    transliteration: 'Ar-Raqm ar-Raʾīsī 33',
    category: 'master',
    definition: {
      en: 'The Master Teacher - The highest master number, representing universal love, compassion, and the ability to heal and guide humanity toward spiritual unity.',
      fr: 'Le Maître Enseignant - Le nombre maître le plus élevé, représentant l\'amour universel, la compassion et la capacité de guérir et guider l\'humanité vers l\'unité spirituelle.',
      ar: 'المعلم الرئيسي - أعلى رقم رئيسي، يمثل الحب العالمي والرحمة والقدرة على شفاء وإرشاد الإنسانية نحو الوحدة الروحية.'
    },
    relatedTerms: ['master-11', 'master-22']
  },

  // KARMIC DEBTS
  {
    id: 'karmic-13',
    arabic: 'الدين الكرمي ١٣',
    transliteration: 'Ad-Dayn al-Karmī 13',
    category: 'karmic',
    definition: {
      en: 'Represents laziness and negativity from past patterns. The lesson is to transform through hard work, discipline, and positive focus. Overcome through perseverance.',
      fr: 'Représente la paresse et la négativité des modèles passés. La leçon est de se transformer par le travail acharné, la discipline et la concentration positive. Surmonter par la persévérance.',
      ar: 'يمثل الكسل والسلبية من الأنماط الماضية. الدرس هو التحول من خلال العمل الجاد والانضباط والتركيز الإيجابي. التغلب من خلال المثابرة.'
    },
    relatedTerms: ['karmic-14', 'karmic-16', 'karmic-19']
  },
  {
    id: 'karmic-14',
    arabic: 'الدين الكرمي ١٤',
    transliteration: 'Ad-Dayn al-Karmī 14',
    category: 'karmic',
    definition: {
      en: 'Abuse of freedom - teaching moderation and balance. The lesson is to use freedom responsibly, avoid excess, and find spiritual grounding through discipline.',
      fr: 'Abus de liberté - enseignant la modération et l\'équilibre. La leçon est d\'utiliser la liberté de manière responsable, éviter l\'excès et trouver un ancrage spirituel par la discipline.',
      ar: 'إساءة استخدام الحرية - تعليم الاعتدال والتوازن. الدرس هو استخدام الحرية بمسؤولية، تجنب الإفراط، وإيجاد الأساس الروحي من خلال الانضباط.'
    },
    relatedTerms: ['karmic-13', 'karmic-16']
  },
  {
    id: 'karmic-16',
    arabic: 'الدين الكرمي ١٦',
    transliteration: 'Ad-Dayn al-Karmī 16',
    category: 'karmic',
    definition: {
      en: 'Abuse of love - teaching humility and ego dissolution. The lesson is to love selflessly, release ego attachments, and serve with pure intentions.',
      fr: 'Abus d\'amour - enseignant l\'humilité et la dissolution de l\'ego. La leçon est d\'aimer de manière désintéressée, libérer les attachements de l\'ego et servir avec des intentions pures.',
      ar: 'إساءة استخدام الحب - تعليم التواضع وحل الأنا. الدرس هو الحب بنكران الذات، وإطلاق ارتباطات الأنا، والخدمة بنوايا نقية.'
    },
    relatedTerms: ['karmic-14', 'karmic-19']
  },
  {
    id: 'karmic-19',
    arabic: 'الدين الكرمي ١٩',
    transliteration: 'Ad-Dayn al-Karmī 19',
    category: 'karmic',
    definition: {
      en: 'Abuse of power - teaching independence without arrogance. The lesson is to stand alone spiritually while serving others, balancing power with compassion.',
      fr: 'Abus de pouvoir - enseignant l\'indépendance sans arrogance. La leçon est de se tenir seul spirituellement tout en servant les autres, équilibrant le pouvoir avec la compassion.',
      ar: 'إساءة استخدام القوة - تعليم الاستقلالية بدون غطرسة. الدرس هو الوقوف بمفردك روحياً بينما تخدم الآخرين، موازنة القوة بالرحمة.'
    },
    relatedTerms: ['karmic-13', 'karmic-16']
  },

  // CYCLES
  {
    id: 'personal-year',
    arabic: 'السنة الشخصية',
    transliteration: 'As-Sanah ash-Shakhṣiyya',
    category: 'cycles',
    definition: {
      en: 'A number from 1-9 calculated for each calendar year, indicating the theme and energy of that year in your personal 9-year cycle. Changes annually.',
      fr: 'Un nombre de 1 à 9 calculé pour chaque année civile, indiquant le thème et l\'énergie de cette année dans votre cycle personnel de 9 ans. Change annuellement.',
      ar: 'رقم من 1-9 يُحسب لكل سنة تقويمية، يشير إلى موضوع وطاقة تلك السنة في دورتك الشخصية التسعية. يتغير سنوياً.'
    },
    relatedTerms: ['personal-month', 'nine-year-cycle']
  },
  {
    id: 'personal-month',
    arabic: 'الشهر الشخصي',
    transliteration: 'Ash-Shahr ash-Shakhṣī',
    category: 'cycles',
    definition: {
      en: 'A monthly refinement of your personal year energy, calculated by adding your personal year to the calendar month. Provides monthly guidance.',
      fr: 'Un raffinement mensuel de votre énergie d\'année personnelle, calculé en ajoutant votre année personnelle au mois calendaire. Fournit des conseils mensuels.',
      ar: 'تحسين شهري لطاقة سنتك الشخصية، يُحسب بإضافة سنتك الشخصية إلى الشهر التقويمي. يوفر التوجيه الشهري.'
    },
    relatedTerms: ['personal-year', 'nine-year-cycle']
  },
  {
    id: 'nine-year-cycle',
    arabic: 'دورة التسع سنوات',
    transliteration: 'Dawrat at-Tisʿ Sanawāt',
    category: 'cycles',
    definition: {
      en: 'Life moves in repeating 9-year cycles. Each year (1-9) has a unique theme: 1=Beginning, 5=Change, 9=Completion. After 9, a new cycle begins.',
      fr: 'La vie se déroule en cycles répétés de 9 ans. Chaque année (1-9) a un thème unique: 1=Commencement, 5=Changement, 9=Achèvement. Après 9, un nouveau cycle commence.',
      ar: 'تتحرك الحياة في دورات متكررة مدتها 9 سنوات. كل سنة (1-9) لها موضوع فريد: 1=البداية، 5=التغيير، 9=الإكمال. بعد 9، تبدأ دورة جديدة.'
    },
    relatedTerms: ['personal-year', 'pinnacle']
  },
  {
    id: 'pinnacle',
    arabic: 'رقم القمة',
    transliteration: 'Raqm al-Qimmah',
    category: 'cycles',
    definition: {
      en: 'Major life periods (4 in total) representing peak experiences and opportunities. Each pinnacle brings specific energies and lessons spanning years or decades.',
      fr: 'Périodes de vie majeures (4 au total) représentant des expériences et opportunités culminantes. Chaque sommet apporte des énergies et leçons spécifiques sur des années ou décennies.',
      ar: 'فترات حياة رئيسية (4 إجمالاً) تمثل تجارب وفرص ذروة. كل قمة تجلب طاقات ودروس محددة تمتد لسنوات أو عقود.'
    },
    relatedTerms: ['challenge-number', 'nine-year-cycle']
  },
  {
    id: 'challenge-number',
    arabic: 'رقم التحدي',
    transliteration: 'Raqm at-Taḥaddī',
    category: 'cycles',
    definition: {
      en: 'Obstacles and lessons corresponding to each pinnacle period. Challenges are opportunities for growth, teaching resilience and spiritual development.',
      fr: 'Obstacles et leçons correspondant à chaque période de sommet. Les défis sont des opportunités de croissance, enseignant la résilience et le développement spirituel.',
      ar: 'العقبات والدروس المقابلة لكل فترة قمة. التحديات هي فرص للنمو، تعليم المرونة والتطور الروحي.'
    },
    relatedTerms: ['pinnacle', 'karmic-13']
  },

  // ELEMENTS
  {
    id: 'element-fire',
    arabic: 'عنصر النار',
    transliteration: 'ʿUnṣur an-Nār',
    category: 'elements',
    definition: {
      en: 'Associated with numbers 1, 3, 9 - represents passion, creativity, inspiration, leadership, and spiritual drive. Fire element brings transformative energy.',
      fr: 'Associé aux nombres 1, 3, 9 - représente la passion, la créativité, l\'inspiration, le leadership et l\'élan spirituel. L\'élément feu apporte une énergie transformatrice.',
      ar: 'مرتبط بالأرقام 1، 3، 9 - يمثل الشغف والإبداع والإلهام والقيادة والدافع الروحي. عنصر النار يجلب الطاقة التحويلية.'
    },
    relatedTerms: ['element-water', 'element-air', 'element-earth']
  },
  {
    id: 'element-water',
    arabic: 'عنصر الماء',
    transliteration: 'ʿUnṣur al-Māʾ',
    category: 'elements',
    definition: {
      en: 'Associated with numbers 2, 5 - represents emotions, intuition, healing, adaptability, and spiritual flow. Water element brings emotional depth.',
      fr: 'Associé aux nombres 2, 5 - représente les émotions, l\'intuition, la guérison, l\'adaptabilité et le flux spirituel. L\'élément eau apporte la profondeur émotionnelle.',
      ar: 'مرتبط بالأرقام 2، 5 - يمثل المشاعر والحدس والشفاء والقدرة على التكيف والتدفق الروحي. عنصر الماء يجلب العمق العاطفي.'
    },
    relatedTerms: ['element-fire', 'element-air', 'element-earth']
  },
  {
    id: 'element-air',
    arabic: 'عنصر الهواء',
    transliteration: 'ʿUnṣur al-Hawāʾ',
    category: 'elements',
    definition: {
      en: 'Associated with numbers 3, 5, 7 - represents intellect, communication, freedom, wisdom, and spiritual insight. Air element brings mental clarity.',
      fr: 'Associé aux nombres 3, 5, 7 - représente l\'intellect, la communication, la liberté, la sagesse et la perspicacité spirituelle. L\'élément air apporte la clarté mentale.',
      ar: 'مرتبط بالأرقام 3، 5، 7 - يمثل الفكر والتواصل والحرية والحكمة والبصيرة الروحية. عنصر الهواء يجلب الوضوح العقلي.'
    },
    relatedTerms: ['element-fire', 'element-water', 'element-earth']
  },
  {
    id: 'element-earth',
    arabic: 'عنصر الأرض',
    transliteration: 'ʿUnṣur al-Arḍ',
    category: 'elements',
    definition: {
      en: 'Associated with numbers 4, 6, 8 - represents stability, practicality, material manifestation, grounding, and physical reality. Earth element brings structure.',
      fr: 'Associé aux nombres 4, 6, 8 - représente la stabilité, la praticité, la manifestation matérielle, l\'ancrage et la réalité physique. L\'élément terre apporte la structure.',
      ar: 'مرتبط بالأرقام 4، 6، 8 - يمثل الاستقرار والعملية والتجسيد المادي والتأريض والواقع المادي. عنصر الأرض يجلب الهيكل.'
    },
    relatedTerms: ['element-fire', 'element-water', 'element-air']
  },

  // ADDITIONAL IMPORTANT TERMS
  {
    id: 'abjad',
    arabic: 'الأبجد',
    transliteration: 'Al-Abjad',
    category: 'core',
    definition: {
      en: 'Arabic alphabetical system where each letter has a numerical value (Alif=1, Ba=2, etc.). Used to calculate the spiritual value of names and words.',
      fr: 'Système alphabétique arabe où chaque lettre a une valeur numérique (Alif=1, Ba=2, etc.). Utilisé pour calculer la valeur spirituelle des noms et mots.',
      ar: 'النظام الأبجدي العربي حيث لكل حرف قيمة عددية (ألف=1، باء=2، إلخ). يُستخدم لحساب القيمة الروحية للأسماء والكلمات.'
    },
    relatedTerms: ['life-path', 'destiny']
  },
  {
    id: 'ilm-huruf',
    arabic: 'علم الحروف',
    transliteration: 'ʿIlm al-Ḥurūf',
    category: 'core',
    definition: {
      en: 'The Islamic science of letters and numbers, connecting numerical values to spiritual truths. Studied by classical scholars like al-Būnī and Ibn ʿArabī.',
      fr: 'La science islamique des lettres et nombres, reliant les valeurs numériques aux vérités spirituelles. Étudiée par des savants classiques comme al-Būnī et Ibn ʿArabī.',
      ar: 'العلم الإسلامي للحروف والأرقام، يربط القيم العددية بالحقائق الروحية. درسه علماء كلاسيكيون مثل البوني وابن عربي.'
    },
    relatedTerms: ['abjad', 'maqam']
  },
  {
    id: 'maqam',
    arabic: 'المقام',
    transliteration: 'Al-Maqām',
    category: 'cycles',
    definition: {
      en: 'Spiritual station in Sufi tradition. Each life path number corresponds to a maqām representing a stage on the journey to Allah (e.g., Tawbah, Sabr, Maḥabbah).',
      fr: 'Station spirituelle dans la tradition soufie. Chaque nombre de chemin de vie correspond à un maqām représentant une étape sur le chemin vers Allah (ex: Tawbah, Sabr, Maḥabbah).',
      ar: 'المحطة الروحية في التقليد الصوفي. كل رقم مسار حياة يتوافق مع مقام يمثل مرحلة في الرحلة إلى الله (مثل: التوبة، الصبر، المحبة).'
    },
    relatedTerms: ['life-path', 'ilm-huruf']
  },
  {
    id: 'digital-root',
    arabic: 'الجذر الرقمي',
    transliteration: 'Al-Jadhr ar-Raqmī',
    category: 'core',
    definition: {
      en: 'The process of reducing multi-digit numbers to a single digit by adding digits together repeatedly (e.g., 28 → 2+8=10 → 1+0=1). Except master numbers 11, 22, 33.',
      fr: 'Le processus de réduction des nombres à plusieurs chiffres à un seul chiffre en additionnant les chiffres à plusieurs reprises (ex: 28 → 2+8=10 → 1+0=1). Sauf nombres maîtres 11, 22, 33.',
      ar: 'عملية تقليل الأرقام المتعددة الأرقام إلى رقم واحد بإضافة الأرقام معاً بشكل متكرر (مثال: 28 → 2+8=10 → 1+0=1). باستثناء الأرقام الرئيسية 11، 22، 33.'
    },
    relatedTerms: ['master-11', 'life-path']
  }
];

export const LifePathGlossary: React.FC = () => {
  const { language, t } = useLanguage();
  // Arabic not yet supported in language context
  const isArabic = false;
  const isFrench = language === 'fr';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TermCategory | 'all'>('all');

  const categories: Array<{ id: TermCategory | 'all'; label: { en: string; fr: string; ar: string }; color: string }> = [
    { id: 'all', label: { en: 'All Terms', fr: 'Tous les Termes', ar: 'كل المصطلحات' }, color: 'bg-slate-600' },
    { id: 'core', label: { en: 'Core Numbers', fr: 'Nombres Fondamentaux', ar: 'الأرقام الأساسية' }, color: 'bg-blue-600' },
    { id: 'master', label: { en: 'Master Numbers', fr: 'Nombres Maîtres', ar: 'الأرقام الرئيسية' }, color: 'bg-amber-600' },
    { id: 'karmic', label: { en: 'Karmic Debts', fr: 'Dettes Karmiques', ar: 'الديون الكرمية' }, color: 'bg-red-600' },
    { id: 'cycles', label: { en: 'Cycles & Timing', fr: 'Cycles & Timing', ar: 'الدورات والتوقيت' }, color: 'bg-purple-600' },
    { id: 'elements', label: { en: 'Elements', fr: 'Éléments', ar: 'العناصر' }, color: 'bg-emerald-600' }
  ];

  // Filter terms
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(term => {
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      const matchesSearch = searchQuery === '' ||
        term.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.ar.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          {isArabic ? 'مسرد المصطلحات' : isFrench ? 'Glossaire' : 'Life Path Glossary'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          {isArabic 
            ? 'قاموس شامل لمصطلحات علم الأرقام' 
            : isFrench 
            ? 'Dictionnaire complet des termes de numérologie' 
            : 'Comprehensive dictionary of numerology terms'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={isArabic ? 'ابحث عن مصطلح...' : isFrench ? 'Rechercher un terme...' : 'Search for a term...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedCategory === cat.id
                  ? `${cat.color} text-white shadow-lg`
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {isArabic ? cat.label.ar : isFrench ? cat.label.fr : cat.label.en}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {isArabic 
            ? `${filteredTerms.length} مصطلح` 
            : isFrench 
            ? `${filteredTerms.length} terme${filteredTerms.length !== 1 ? 's' : ''}` 
            : `${filteredTerms.length} term${filteredTerms.length !== 1 ? 's' : ''}`}
        </div>
      </div>

      {/* Terms List */}
      <div className="space-y-4">
        {filteredTerms.length > 0 ? (
          filteredTerms.map(term => (
            <GlossaryTermCard
              key={term.id}
              term={term}
              isArabic={isArabic}
              isFrench={isFrench}
              categories={categories}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {isArabic ? 'لم يتم العثور على مصطلحات' : isFrench ? 'Aucun terme trouvé' : 'No terms found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// GLOSSARY TERM CARD
// ============================================================================

const GlossaryTermCard: React.FC<{
  term: GlossaryTerm;
  isArabic: boolean;
  isFrench: boolean;
  categories: Array<{ id: TermCategory | 'all'; label: { en: string; fr: string; ar: string }; color: string }>;
}> = ({ term, isArabic, isFrench, categories }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const categoryInfo = categories.find(c => c.id === term.category);
  const categoryLabel = categoryInfo
    ? (isArabic ? categoryInfo.label.ar : isFrench ? categoryInfo.label.fr : categoryInfo.label.en)
    : term.category;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Arabic Term */}
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-arabic">
              {term.arabic}
            </div>
            
            {/* Transliteration */}
            <div className="text-sm text-slate-600 dark:text-slate-400 italic mb-3">
              {term.transliteration}
            </div>
            
            {/* Category Badge */}
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${categoryInfo?.color || 'bg-slate-600'}`}>
              {categoryLabel}
            </span>
          </div>
          
          <ChevronRight className={`w-6 h-6 text-slate-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-700 pt-4">
          {/* Definition */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
              {isArabic ? 'التعريف:' : isFrench ? 'Définition:' : 'Definition:'}
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {isArabic ? term.definition.ar : isFrench ? term.definition.fr : term.definition.en}
            </p>
          </div>

          {/* Related Terms */}
          {term.relatedTerms && term.relatedTerms.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
                {isArabic ? 'مصطلحات ذات صلة:' : isFrench ? 'Termes Connexes:' : 'Related Terms:'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {term.relatedTerms.map(relatedId => {
                  const relatedTerm = GLOSSARY_TERMS.find(t => t.id === relatedId);
                  return relatedTerm ? (
                    <span
                      key={relatedId}
                      className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {relatedTerm.transliteration}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LifePathGlossary;
