/**
 * Cycle Timeline Visualization
 * Interactive 9-year cycle timeline showing current position and themes
 * Based on Divine Timing's EnergyFlowChart.tsx structure
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Circle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface CycleYear {
  year: number;
  theme: { en: string; fr: string; ar: string };
  focus: { en: string[]; fr: string[]; ar: string[] };
  phase: 'foundation' | 'growth' | 'completion';
  description: { en: string; fr: string; ar: string };
}

const CYCLE_YEARS: CycleYear[] = [
  {
    year: 1,
    theme: { en: 'New Beginnings', fr: 'Nouveaux Commencements', ar: 'بدايات جديدة' },
    focus: { en: ['Start projects', 'Set intentions', 'Plant seeds'], fr: ['Démarrer des projets', 'Fixer des intentions', 'Planter des graines'], ar: ['ابدأ المشاريع', 'حدد النوايا', 'ازرع البذور'] },
    phase: 'foundation',
    description: { en: 'Time for fresh starts, new initiatives, and planting seeds for the future. Bold action and independent thinking are favored.', fr: 'Temps pour les nouveaux départs, nouvelles initiatives et semer des graines pour l\'avenir. L\'action audacieuse et la pensée indépendante sont favorisées.', ar: 'وقت البدايات الجديدة والمبادرات الجديدة وزرع بذور المستقبل. العمل الجريء والتفكير المستقل مفضل.' }
  },
  {
    year: 2,
    theme: { en: 'Cooperation & Balance', fr: 'Coopération & Équilibre', ar: 'التعاون والتوازن' },
    focus: { en: ['Build relationships', 'Practice patience', 'Nurture connections'], fr: ['Construire des relations', 'Pratiquer la patience', 'Nourrir les connexions'], ar: ['بناء العلاقات', 'ممارسة الصبر', 'رعاية الاتصالات'] },
    phase: 'foundation',
    description: { en: 'Year of partnerships, diplomacy, and sensitivity. Focus on cooperation, building alliances, and emotional intelligence.', fr: 'Année de partenariats, diplomatie et sensibilité. Accent sur la coopération, construction d\'alliances et intelligence émotionnelle.', ar: 'سنة الشراكات والدبلوماسية والحساسية. التركيز على التعاون وبناء التحالفات والذكاء العاطفي.' }
  },
  {
    year: 3,
    theme: { en: 'Creative Expression', fr: 'Expression Créative', ar: 'التعبير الإبداعي' },
    focus: { en: ['Express yourself', 'Communicate ideas', 'Enjoy life'], fr: ['S\'exprimer', 'Communiquer des idées', 'Profiter de la vie'], ar: ['عبر عن نفسك', 'تواصل الأفكار', 'استمتع بالحياة'] },
    phase: 'foundation',
    description: { en: 'Time for creative projects, self-expression, and social activities. Communication, joy, and artistic pursuits are highlighted.', fr: 'Temps pour les projets créatifs, l\'auto-expression et les activités sociales. Communication, joie et poursuites artistiques sont mis en valeur.', ar: 'وقت المشاريع الإبداعية والتعبير عن الذات والأنشطة الاجتماعية. التواصل والفرح والمساعي الفنية مميزة.' }
  },
  {
    year: 4,
    theme: { en: 'Building Foundations', fr: 'Construction des Fondations', ar: 'بناء الأسس' },
    focus: { en: ['Work hard', 'Organize', 'Create structure'], fr: ['Travailler dur', 'Organiser', 'Créer une structure'], ar: ['اعمل بجد', 'نظم', 'أنشئ الهيكل'] },
    phase: 'growth',
    description: { en: 'Year of discipline, hard work, and building solid foundations. Focus on practical matters, organization, and long-term planning.', fr: 'Année de discipline, travail acharné et construction de fondations solides. Accent sur les questions pratiques, organisation et planification à long terme.', ar: 'سنة الانضباط والعمل الجاد وبناء أسس صلبة. التركيز على المسائل العملية والتنظيم والتخطيط طويل الأجل.' }
  },
  {
    year: 5,
    theme: { en: 'Change & Freedom', fr: 'Changement & Liberté', ar: 'التغيير والحرية' },
    focus: { en: ['Embrace change', 'Explore', 'Take adventures'], fr: ['Accepter le changement', 'Explorer', 'Prendre des aventures'], ar: ['احتضن التغيير', 'استكشف', 'خذ المغامرات'] },
    phase: 'growth',
    description: { en: 'Time for changes, travel, new experiences, and personal freedom. Adaptability and flexibility are key. Expect the unexpected.', fr: 'Temps pour les changements, voyages, nouvelles expériences et liberté personnelle. Adaptabilité et flexibilité sont essentielles. Attendez-vous à l\'inattendu.', ar: 'وقت التغييرات والسفر والتجارب الجديدة والحرية الشخصية. القدرة على التكيف والمرونة أساسية. توقع ما هو غير متوقع.' }
  },
  {
    year: 6,
    theme: { en: 'Love & Responsibility', fr: 'Amour & Responsabilité', ar: 'الحب والمسؤولية' },
    focus: { en: ['Nurture others', 'Create harmony', 'Serve community'], fr: ['Nourrir les autres', 'Créer l\'harmonie', 'Servir la communauté'], ar: ['اعتن بالآخرين', 'خلق الانسجام', 'خدمة المجتمع'] },
    phase: 'growth',
    description: { en: 'Year of family, home, service, and relationships. Focus on responsibility, nurturing, and creating harmonious environments.', fr: 'Année de famille, foyer, service et relations. Accent sur la responsabilité, le soin et la création d\'environnements harmonieux.', ar: 'سنة العائلة والمنزل والخدمة والعلاقات. التركيز على المسؤولية والرعاية وخلق بيئات منسجمة.' }
  },
  {
    year: 7,
    theme: { en: 'Inner Wisdom', fr: 'Sagesse Intérieure', ar: 'الحكمة الداخلية' },
    focus: { en: ['Reflect deeply', 'Study spirituality', 'Seek truth'], fr: ['Réfléchir profondément', 'Étudier la spiritualité', 'Chercher la vérité'], ar: ['تأمل بعمق', 'ادرس الروحانية', 'ابحث عن الحقيقة'] },
    phase: 'completion',
    description: { en: 'Time for introspection, spiritual growth, and inner development. Retreat, study, and deepen your connection with the Divine.', fr: 'Temps pour l\'introspection, croissance spirituelle et développement intérieur. Retraite, étude et approfondissement de votre connexion avec le Divin.', ar: 'وقت الاستبطان والنمو الروحي والتطور الداخلي. الخلوة والدراسة وتعميق اتصالك بالله.' }
  },
  {
    year: 8,
    theme: { en: 'Achievement & Power', fr: 'Réalisation & Pouvoir', ar: 'الإنجاز والقوة' },
    focus: { en: ['Manifest goals', 'Build wealth', 'Exercise leadership'], fr: ['Manifester des objectifs', 'Construire la richesse', 'Exercer le leadership'], ar: ['حقق الأهداف', 'ابن الثروة', 'مارس القيادة'] },
    phase: 'completion',
    description: { en: 'Year of manifestation, material success, and personal power. Reap rewards from past efforts. Financial and career achievements are highlighted.', fr: 'Année de manifestation, succès matériel et pouvoir personnel. Récolter les récompenses des efforts passés. Réalisations financières et professionnelles mises en valeur.', ar: 'سنة التجسيد والنجاح المادي والقوة الشخصية. احصد ثمار الجهود السابقة. الإنجازات المالية والمهنية مميزة.' }
  },
  {
    year: 9,
    theme: { en: 'Completion & Release', fr: 'Achèvement & Libération', ar: 'الإكمال والإطلاق' },
    focus: { en: ['Let go', 'Forgive', 'Serve humanity'], fr: ['Lâcher prise', 'Pardonner', 'Servir l\'humanité'], ar: ['اترك', 'اغفر', 'اخدم الإنسانية'] },
    phase: 'completion',
    description: { en: 'Time for endings, completion, and preparation for new beginnings. Release what no longer serves. Humanitarian service and universal love are emphasized.', fr: 'Temps pour les fins, achèvement et préparation pour de nouveaux commencements. Libérer ce qui ne sert plus. Service humanitaire et amour universel sont soulignés.', ar: 'وقت النهايات والإكمال والتحضير لبدايات جديدة. أطلق ما لم يعد يخدمك. الخدمة الإنسانية والحب العالمي مؤكدة.' }
  }
];

interface CycleTimelineProps {
  currentYear?: number;
  birthDate?: Date;
}

export const CycleTimeline: React.FC<CycleTimelineProps> = ({ currentYear, birthDate }) => {
  const { language, t } = useLanguage();
  // Arabic not yet supported in language context
  const isArabic = false;
  const isFrench = language === 'fr';
  
  const [selectedYear, setSelectedYear] = useState<number>(currentYear || 1);
  const selectedCycle = CYCLE_YEARS[selectedYear - 1];

  const getPhaseColor = (phase: 'foundation' | 'growth' | 'completion') => {
    switch (phase) {
      case 'foundation': return 'from-green-400 to-emerald-600';
      case 'growth': return 'from-blue-400 to-indigo-600';
      case 'completion': return 'from-purple-400 to-pink-600';
    }
  };

  const getPhaseLabel = (phase: 'foundation' | 'growth' | 'completion') => {
    if (isArabic) {
      return phase === 'foundation' ? 'التأسيس' : phase === 'growth' ? 'النمو' : 'الإكمال';
    } else if (isFrench) {
      return phase === 'foundation' ? 'Fondation' : phase === 'growth' ? 'Croissance' : 'Achèvement';
    } else {
      return phase === 'foundation' ? 'Foundation' : phase === 'growth' ? 'Growth' : 'Completion';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          {isArabic ? 'دورة التسع سنوات' : isFrench ? 'Cycle de 9 Ans' : '9-Year Life Cycle'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          {isArabic 
            ? 'تتحرك الحياة في دورات، كل سنة تحمل موضوعاً ودروساً فريدة' 
            : isFrench 
            ? 'La vie se déroule en cycles, chaque année portant un thème et des leçons uniques' 
            : 'Life moves in cycles, each year carrying a unique theme and lessons'}
        </p>
      </div>

      {/* Phase Indicators */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className={`bg-gradient-to-br ${getPhaseColor('foundation')} text-slate-50 rounded-xl p-6 shadow-lg`}>
          <div className="text-sm font-semibold opacity-95 mb-2">
            {isArabic ? 'السنوات 1-3' : isFrench ? 'Années 1-3' : 'Years 1-3'}
          </div>
          <div className="text-2xl font-bold mb-2">{getPhaseLabel('foundation')}</div>
          <p className="text-sm opacity-95">
            {isArabic ? 'بناء الأساس وزرع البذور' : isFrench ? 'Construire la fondation et planter des graines' : 'Building foundation and planting seeds'}
          </p>
        </div>
        <div className={`bg-gradient-to-br ${getPhaseColor('growth')} text-slate-50 rounded-xl p-6 shadow-lg`}>
          <div className="text-sm font-semibold opacity-95 mb-2">
            {isArabic ? 'السنوات 4-6' : isFrench ? 'Années 4-6' : 'Years 4-6'}
          </div>
          <div className="text-2xl font-bold mb-2">{getPhaseLabel('growth')}</div>
          <p className="text-sm opacity-95">
            {isArabic ? 'التوسع والتطور' : isFrench ? 'Expansion et développement' : 'Expansion and development'}
          </p>
        </div>
        <div className={`bg-gradient-to-br ${getPhaseColor('completion')} text-slate-50 rounded-xl p-6 shadow-lg`}>
          <div className="text-sm font-semibold opacity-95 mb-2">
            {isArabic ? 'السنوات 7-9' : isFrench ? 'Années 7-9' : 'Years 7-9'}
          </div>
          <div className="text-2xl font-bold mb-2">{getPhaseLabel('completion')}</div>
          <p className="text-sm opacity-95">
            {isArabic ? 'الحصاد والإطلاق' : isFrench ? 'Récolte et libération' : 'Harvest and release'}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 md:p-8">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            {isArabic ? 'الجدول الزمني للدورة' : isFrench ? 'Chronologie du Cycle' : 'Cycle Timeline'}
          </h3>
          
          {/* Year Circles - Horizontal Scrollable Container */}
          <div className="relative overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {/* Scroll indicator hint for mobile */}
            <div className="md:hidden text-center text-xs text-slate-500 dark:text-slate-400 mb-4">
              {isArabic ? '← مرر لرؤية جميع السنوات التسع →' : isFrench ? '← Faites défiler pour voir les 9 années →' : '← Scroll to see all 9 years →'}
            </div>
            
            {/* Progress Line */}
            <div className="absolute top-[40px] left-8 right-8 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
            {currentYear && (
              <div 
                className="absolute top-[40px] left-8 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `calc(((100% - 4rem) / 8) * ${currentYear - 1})` }}
              />
            )}
            
            {/* Year Markers - Minimum width on mobile */}
            <div className="relative flex justify-between items-center min-w-[640px] md:min-w-0 gap-2">
              {CYCLE_YEARS.map((cycle) => {
                const isSelected = selectedYear === cycle.year;
                const isCurrent = currentYear === cycle.year;
                const isPast = currentYear && cycle.year < currentYear;
                
                return (
                  <button
                    key={cycle.year}
                    onClick={() => setSelectedYear(cycle.year)}
                    className="flex flex-col items-center gap-2 group flex-shrink-0"
                  >
                    <div className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-base md:text-lg transition-all ${
                      isSelected
                        ? `bg-gradient-to-br ${getPhaseColor(cycle.phase)} text-slate-50 shadow-lg scale-110 md:scale-125`
                        : isCurrent
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-2 md:border-4 border-purple-500'
                        : isPast
                        ? 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600'
                    }`}>
                      {cycle.year}
                      {isPast && !isCurrent && (
                        <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400 fill-current" />
                      )}
                      {isCurrent && (
                        <div className="absolute -inset-1 bg-purple-500 rounded-full animate-ping opacity-25" />
                      )}
                    </div>
                    <div className={`text-xs font-medium transition-opacity text-center max-w-[60px] ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      {isArabic ? cycle.theme.ar : isFrench ? cycle.theme.fr : cycle.theme.en}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Year Details */}
        {selectedCycle && (
          <div className="mt-8 md:mt-12 space-y-6">
            {/* Year Header */}
            <div className={`bg-gradient-to-br ${getPhaseColor(selectedCycle.phase)} text-slate-50 rounded-xl p-6 md:p-8 text-center`}>
              <div className="text-5xl md:text-6xl font-bold mb-3 md:mb-4">{selectedCycle.year}</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {isArabic ? selectedCycle.theme.ar : isFrench ? selectedCycle.theme.fr : selectedCycle.theme.en}
              </h3>
              <div className="text-xs md:text-sm opacity-90 uppercase tracking-wider">
                {getPhaseLabel(selectedCycle.phase)} {isArabic ? 'مرحلة' : isFrench ? 'Phase' : 'Phase'}
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 md:p-6">
              <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                {isArabic ? selectedCycle.description.ar : isFrench ? selectedCycle.description.fr : selectedCycle.description.en}
              </p>
            </div>

            {/* Focus Areas */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-base md:text-lg">
                {isArabic ? 'مجالات التركيز:' : isFrench ? 'Domaines de Focus:' : 'Focus Areas:'}
              </h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(isArabic ? selectedCycle.focus.ar : isFrench ? selectedCycle.focus.fr : selectedCycle.focus.en).map((focus, index) => (
                  <div key={index} className="flex items-center gap-2 md:gap-3 bg-white dark:bg-slate-800 rounded-lg p-3 md:p-4 border border-slate-200 dark:border-slate-700">
                    <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${selectedCycle.phase === 'foundation' ? 'text-green-600' : selectedCycle.phase === 'growth' ? 'text-blue-600' : 'text-purple-600'}`} />
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-sm md:text-base">{focus}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700 gap-4">
              <button
                onClick={() => setSelectedYear(selectedYear > 1 ? selectedYear - 1 : 9)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors text-sm md:text-base"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">{isArabic ? 'السنة السابقة' : isFrench ? 'Année Précédente' : 'Previous Year'}</span>
                <span className="sm:hidden">{isArabic ? 'السابق' : isFrench ? 'Préc.' : 'Prev'}</span>
              </button>
              <button
                onClick={() => setSelectedYear(selectedYear < 9 ? selectedYear + 1 : 1)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors text-sm md:text-base"
              >
                <span className="hidden sm:inline">{isArabic ? 'السنة التالية' : isFrench ? 'Année Suivante' : 'Next Year'}</span>
                <span className="sm:hidden">{isArabic ? 'التالي' : isFrench ? 'Suiv.' : 'Next'}</span>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-center">
        <p className="text-sm text-amber-900 dark:text-amber-100">
          {isArabic
            ? 'تذكر: الدورات أدوات للتأمل والتخطيط، وليست قدراً ثابتاً. الله وحده يعلم الغيب.'
            : isFrench
            ? 'Rappelez-vous: Les cycles sont des outils de réflexion et de planification, pas un destin fixe. Seul Allah connaît l\'invisible.'
            : 'Remember: Cycles are tools for reflection and planning, not fixed destiny. Only Allah knows the unseen.'}
        </p>
      </div>
    </div>
  );
};

export default CycleTimeline;
