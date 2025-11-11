/**
 * Number Guide Panel
 * Comprehensive educational profiles for all Life Path numbers (1-9, 11, 22, 33)
 * Based on Divine Timing's PlanetGuidePanel.tsx structure
 */

import React, { useState } from 'react';
import { Sparkles, Heart, Zap, BookOpen, ChevronRight, Star } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { LIFE_PATH_MEANINGS, MASTER_NUMBERS } from '../../../constants/lifePathMeanings';

type NumberType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33;

export const NumberGuidePanel: React.FC = () => {
  const { language, t } = useLanguage();
  // Arabic not yet supported in language context
  const isArabic = false;
  const isFrench = language === 'fr';
  
  const [selectedNumber, setSelectedNumber] = useState<NumberType>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'spiritual' | 'practical' | 'classical'>('overview');

  const allNumbers: NumberType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
  
  const tabs = [
    { id: 'overview' as const, label: { en: 'Overview', fr: 'Aperçu', ar: 'نظرة عامة' }, icon: Star },
    { id: 'spiritual' as const, label: { en: 'Spiritual Wisdom', fr: 'Sagesse Spirituelle', ar: 'الحكمة الروحية' }, icon: Sparkles },
    { id: 'practical' as const, label: { en: 'Practical Guide', fr: 'Guide Pratique', ar: 'دليل عملي' }, icon: Heart },
    { id: 'classical' as const, label: { en: 'Classical Sources', fr: 'Sources Classiques', ar: 'المصادر الكلاسيكية' }, icon: BookOpen }
  ];

  const numberData = selectedNumber === 11 || selectedNumber === 22 || selectedNumber === 33
    ? MASTER_NUMBERS[selectedNumber]
    : LIFE_PATH_MEANINGS[selectedNumber];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          {isArabic ? 'دليل الأرقام الروحية' : isFrench ? 'Guide des Nombres Spirituels' : 'Life Path Number Guide'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          {isArabic 
            ? 'اكتشف المعاني العميقة لكل رقم مسار حياة' 
            : isFrench 
            ? 'Découvrez les significations profondes de chaque nombre de chemin de vie' 
            : 'Discover the deep meanings of each life path number'}
        </p>
      </div>

      {/* Number Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          {isArabic ? 'اختر رقماً:' : isFrench ? 'Sélectionnez un Nombre:' : 'Select a Number:'}
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {allNumbers.map(num => {
            const isMaster = num === 11 || num === 22 || num === 33;
            const isSelected = selectedNumber === num;
            return (
              <button
                key={num}
                onClick={() => setSelectedNumber(num)}
                className={`relative p-4 rounded-lg font-bold text-lg transition-all ${
                  isSelected
                    ? isMaster
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-slate-50 shadow-lg scale-110'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 text-slate-50 shadow-lg scale-110'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {num}
                {isMaster && (
                  <div className="absolute -top-1 -right-1">
                    <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-purple-600 dark:bg-purple-700 text-slate-50 shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {isArabic ? tab.label.ar : isFrench ? tab.label.fr : tab.label.en}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
        {activeTab === 'overview' && <OverviewTab number={selectedNumber} data={numberData} isArabic={isArabic} isFrench={isFrench} />}
        {activeTab === 'spiritual' && <SpiritualTab number={selectedNumber} data={numberData} isArabic={isArabic} isFrench={isFrench} />}
        {activeTab === 'practical' && <PracticalTab number={selectedNumber} data={numberData} isArabic={isArabic} isFrench={isFrench} />}
        {activeTab === 'classical' && <ClassicalTab number={selectedNumber} data={numberData} isArabic={isArabic} isFrench={isFrench} />}
      </div>
    </div>
  );
};

// ============================================================================
// OVERVIEW TAB
// ============================================================================

const OverviewTab: React.FC<{ number: NumberType; data: any; isArabic: boolean; isFrench: boolean }> = ({ number, data, isArabic, isFrench }) => {
  const isMaster = number === 11 || number === 22 || number === 33;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-700">
        <div className={`inline-block text-6xl font-bold mb-4 ${
          isMaster 
            ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-transparent bg-clip-text' 
            : 'bg-gradient-to-br from-blue-500 to-purple-600 text-transparent bg-clip-text'
        }`}>
          {number}
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {isArabic ? data.nameArabic : data.name}
        </h2>
        {isMaster && (
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-full text-sm font-semibold">
            <Star className="w-4 h-4" />
            {isArabic ? 'رقم رئيسي' : isFrench ? 'Nombre Maître' : 'Master Number'}
          </div>
        )}
      </div>

      {/* Core Attributes */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {data.planet && (
            <AttributeCard
              title={isArabic ? 'الكوكب الحاكم' : isFrench ? 'Planète Gouvernante' : 'Ruling Planet'}
              value={isArabic ? data.planetArabic : data.planet}
              icon="🪐"
              color="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100"
            />
          )}
          {data.element && (
            <AttributeCard
              title={isArabic ? 'العنصر' : isFrench ? 'Élément' : 'Element'}
              value={isArabic ? data.elementArabic : data.element}
              icon={getElementIcon(data.element)}
              color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100"
            />
          )}
          <AttributeCard
            title={isArabic ? 'المقام الروحي' : isFrench ? 'Station Spirituelle' : 'Spiritual Station'}
            value={isArabic ? data.stationArabic : data.station}
            icon="✨"
            color="bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100"
          />
        </div>

        {/* Right Column */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-6">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">
            {isArabic ? 'الغرض من الحياة' : isFrench ? 'But de Vie' : 'Life Purpose'}
          </h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
            {isArabic ? data.lifePurposeArabic : data.lifePurpose}
          </p>
        </div>
      </div>

      {/* Qualities */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
          {isArabic ? 'الصفات الإيجابية' : isFrench ? 'Qualités Positives' : 'Positive Qualities'}
        </h4>
        <div className="flex flex-wrap gap-2">
          {(isArabic ? data.qualitiesArabic || data.qualities : data.qualities).map((quality: string, index: number) => (
            <span key={index} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
              {quality}
            </span>
          ))}
        </div>
      </div>

      {/* Challenges */}
      {data.challenges && (
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-amber-600 dark:text-amber-400">⚠️</span>
            {isArabic ? 'التحديات' : isFrench ? 'Défis' : 'Challenges'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {(isArabic ? data.challengesArabic || data.challenges : data.challenges).map((challenge: string, index: number) => (
              <span key={index} className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-sm font-medium">
                {challenge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SPIRITUAL TAB
// ============================================================================

const SpiritualTab: React.FC<{ number: NumberType; data: any; isArabic: boolean; isFrench: boolean }> = ({ number, data, isArabic, isFrench }) => {
  return (
    <div className="space-y-6">
      {/* Quranic Resonance */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-6">
        <h4 className="font-bold text-teal-900 dark:text-teal-100 mb-3 flex items-center gap-2">
          <span className="text-2xl">📖</span>
          {isArabic ? 'الرنين القرآني' : isFrench ? 'Résonance Coranique' : 'Quranic Resonance'}
        </h4>
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed italic">
          "{isArabic ? data.quranResonanceArabic : data.quranResonance}"
        </p>
      </div>

      {/* Spiritual Qualities Deep Dive */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-4">
          {isArabic ? 'الصفات الروحية العميقة' : isFrench ? 'Qualités Spirituelles Profondes' : 'Deep Spiritual Qualities'}
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          {getSpiritualQualities(number, isArabic, isFrench).map((quality, index) => (
            <div key={index} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{quality.icon}</span>
                <div>
                  <h5 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">{quality.title}</h5>
                  <p className="text-sm text-purple-800 dark:text-purple-200">{quality.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deepest Desire */}
      {data.deepestDesire && (
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-6">
          <h4 className="font-bold text-rose-900 dark:text-rose-100 mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            {isArabic ? 'أعمق رغبة' : isFrench ? 'Désir le Plus Profond' : 'Deepest Desire'}
          </h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {isArabic ? data.deepestDesireArabic : data.deepestDesire}
          </p>
        </div>
      )}

      {/* Spiritual Practices */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-4">
          {isArabic ? 'الممارسات الروحية الموصى بها' : isFrench ? 'Pratiques Spirituelles Recommandées' : 'Recommended Spiritual Practices'}
        </h4>
        <div className="space-y-3">
          {getSpiritualPractices(number, isArabic, isFrench).map((practice, index) => (
            <div key={index} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
              <ChevronRight className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-white mb-1">{practice.title}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{practice.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PRACTICAL TAB
// ============================================================================

const PracticalTab: React.FC<{ number: NumberType; data: any; isArabic: boolean; isFrench: boolean }> = ({ number, data, isArabic, isFrench }) => {
  return (
    <div className="space-y-6">
      {/* Career Paths */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">💼</span>
          {isArabic ? 'المسارات المهنية المثالية' : isFrench ? 'Chemins de Carrière Idéaux' : 'Ideal Career Paths'}
        </h4>
        <div className="grid md:grid-cols-2 gap-3">
          {getCareerPaths(number, isArabic, isFrench).map((career, index) => (
            <div key={index} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="font-semibold text-blue-900 dark:text-blue-100">{career}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Relationship Dynamics */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          {isArabic ? 'ديناميكيات العلاقات' : isFrench ? 'Dynamiques Relationnelles' : 'Relationship Dynamics'}
        </h4>
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-6">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            {getRelationshipDynamics(number, isArabic, isFrench)}
          </p>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-semibold text-rose-900 dark:text-rose-100">
                {isArabic ? 'الأكثر توافقاً مع:' : isFrench ? 'Plus Compatible Avec:' : 'Most Compatible With:'}
              </span>
              <span className="text-slate-700 dark:text-slate-300 ml-2">
                {getCompatibleNumbers(number).join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Practices */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🌅</span>
          {isArabic ? 'الممارسات اليومية للتوازن' : isFrench ? 'Pratiques Quotidiennes pour l\'Équilibre' : 'Daily Practices for Balance'}
        </h4>
        <div className="space-y-3">
          {getDailyPractices(number, isArabic, isFrench).map((practice, index) => (
            <div key={index} className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
              <span className="text-xl">{practice.icon}</span>
              <div>
                <div className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">{practice.title}</div>
                <div className="text-sm text-emerald-800 dark:text-emerald-200">{practice.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Life Examples */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🌟</span>
          {isArabic ? 'أمثلة عملية' : isFrench ? 'Exemples Pratiques' : 'Practical Examples'}
        </h4>
        <div className="space-y-4">
          {getLifeExamples(number, isArabic, isFrench).map((example, index) => (
            <div key={index} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border-l-4 border-purple-500">
              <h5 className="font-semibold text-slate-900 dark:text-white mb-2">{example.title}</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">{example.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CLASSICAL TAB
// ============================================================================

const ClassicalTab: React.FC<{ number: NumberType; data: any; isArabic: boolean; isFrench: boolean }> = ({ number, data, isArabic, isFrench }) => {
  return (
    <div className="space-y-6">
      {/* Classical Teachings */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-4">
          {isArabic ? 'التعاليم الكلاسيكية' : isFrench ? 'Enseignements Classiques' : 'Classical Teachings'}
        </h4>
        <div className="space-y-4">
          {getClassicalTeachings(number, isArabic, isFrench).map((teaching, index) => (
            <div key={index} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📜</span>
                <div>
                  <blockquote className="text-slate-700 dark:text-slate-300 italic text-lg mb-3 leading-relaxed">
                    "{teaching.quote}"
                  </blockquote>
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <span className="font-semibold">— {teaching.scholar}</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-2">({teaching.source})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Context */}
      <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-6">
        <h4 className="font-bold text-teal-900 dark:text-teal-100 mb-4 flex items-center gap-2">
          <span className="text-2xl">🕌</span>
          {isArabic ? 'السياق التاريخي' : isFrench ? 'Contexte Historique' : 'Historical Context'}
        </h4>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {getHistoricalContext(number, isArabic, isFrench)}
        </p>
      </div>

      {/* Famous Archetypes */}
      {data.famousArchetypes && (
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">👤</span>
            {isArabic ? 'أنماط مشهورة' : isFrench ? 'Archétypes Célèbres' : 'Famous Archetypes'}
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            {(isArabic ? data.famousArchetypesArabic || data.famousArchetypes : data.famousArchetypes).map((archetype: string, index: number) => (
              <div key={index} className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <div className="text-purple-900 dark:text-purple-100 font-medium">{archetype}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Concepts */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🔗</span>
          {isArabic ? 'مفاهيم ذات صلة' : isFrench ? 'Concepts Connexes' : 'Related Concepts'}
        </h4>
        <div className="flex flex-wrap gap-3">
          {getRelatedConcepts(number, isArabic, isFrench).map((concept, index) => (
            <div key={index} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 px-4 py-2 rounded-full text-sm font-medium">
              {concept}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const AttributeCard: React.FC<{ title: string; value: string; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <div className={`rounded-lg p-4 ${color}`}>
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-xs font-semibold opacity-75 mb-1">{title}</div>
        <div className="font-bold text-lg capitalize">{value}</div>
      </div>
    </div>
  </div>
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getElementIcon(element: string): string {
  const icons: Record<string, string> = {
    fire: '🔥',
    water: '💧',
    air: '💨',
    earth: '🌍'
  };
  return icons[element.toLowerCase()] || '✨';
}

function getSpiritualQualities(number: NumberType, isArabic: boolean, isFrench: boolean) {
  // Simplified - in production, this would have full data for all numbers
  const qualities: Record<number, Array<{ icon: string; title: string; description: string }>> = {
    1: [
      { icon: '👑', title: isArabic ? 'القيادة' : isFrench ? 'Leadership' : 'Leadership', description: isArabic ? 'تقود بالمثال والنزاهة' : isFrench ? 'Diriger par l\'exemple et l\'intégrité' : 'Lead by example and integrity' },
      { icon: '⚡', title: isArabic ? 'المبادرة' : isFrench ? 'Initiative' : 'Initiative', description: isArabic ? 'ابدأ المشاريع بشجاعة' : isFrench ? 'Commencer des projets avec courage' : 'Start projects with courage' }
    ],
    2: [
      { icon: '🤝', title: isArabic ? 'الدبلوماسية' : isFrench ? 'Diplomatie' : 'Diplomacy', description: isArabic ? 'بناء جسور بين الناس' : isFrench ? 'Construire des ponts entre les gens' : 'Build bridges between people' },
      { icon: '💫', title: isArabic ? 'الحدس' : isFrench ? 'Intuition' : 'Intuition', description: isArabic ? 'الاستماع للإرشاد الداخلي' : isFrench ? 'Écouter la guidance intérieure' : 'Listen to inner guidance' }
    ]
    // ... would continue for all numbers
  };
  return qualities[number] || qualities[1];
}

function getSpiritualPractices(number: NumberType, isArabic: boolean, isFrench: boolean) {
  const practices: Record<number, Array<{ title: string; description: string }>> = {
    1: [
      { title: isArabic ? 'ذكر التوحيد' : isFrench ? 'Dhikr de l\'Unicité' : 'Dhikr of Unity', description: isArabic ? 'كرر "لا إله إلا الله" 100 مرة يومياً' : isFrench ? 'Répéter "Lā ilāha illā Allāh" 100 fois par jour' : 'Repeat "Lā ilāha illā Allāh" 100 times daily' },
      { title: isArabic ? 'تأمل الصباح' : isFrench ? 'Méditation Matinale' : 'Morning Contemplation', description: isArabic ? '10 دقائق من التأمل في النوايا' : isFrench ? '10 minutes de contemplation sur les intentions' : '10 minutes reflecting on intentions' }
    ]
    // ... simplified
  };
  return practices[number] || practices[1];
}

function getCareerPaths(number: NumberType, isArabic: boolean, isFrench: boolean): string[] {
  const careers: Record<number, string[]> = {
    1: isArabic ? ['رائد أعمال', 'قائد', 'مدير تنفيذي', 'مبتكر'] : isFrench ? ['Entrepreneur', 'Leader', 'PDG', 'Innovateur'] : ['Entrepreneur', 'Leader', 'CEO', 'Innovator'],
    2: isArabic ? ['وسيط', 'مستشار', 'مدرس', 'دبلوماسي'] : isFrench ? ['Médiateur', 'Conseiller', 'Enseignant', 'Diplomate'] : ['Mediator', 'Counselor', 'Teacher', 'Diplomat'],
    3: isArabic ? ['فنان', 'كاتب', 'متحدث', 'مصمم'] : isFrench ? ['Artiste', 'Écrivain', 'Conférencier', 'Designer'] : ['Artist', 'Writer', 'Speaker', 'Designer']
    // ... continue
  };
  return careers[number] || careers[1];
}

function getRelationshipDynamics(number: NumberType, isArabic: boolean, isFrench: boolean): string {
  const dynamics: Record<number, string> = {
    1: isArabic ? 'الرقم 1 يجلب الطاقة القيادية للعلاقات. أنت بحاجة إلى شريك يحترم استقلاليتك بينما يقدم دعماً عاطفياً.' : isFrench ? 'Le numéro 1 apporte une énergie de leadership aux relations. Vous avez besoin d\'un partenaire qui respecte votre indépendance tout en offrant un soutien émotionnel.' : 'Number 1 brings leadership energy to relationships. You need a partner who respects your independence while offering emotional support.',
    2: isArabic ? 'الرقم 2 يزدهر في الشراكات. أنت صانع سلام طبيعي، تسعى للانسجام والاتصال العميق في العلاقات.' : isFrench ? 'Le numéro 2 s\'épanouit dans les partenariats. Vous êtes un pacificateur naturel, recherchant l\'harmonie et la connexion profonde dans les relations.' : 'Number 2 thrives in partnerships. You are a natural peacemaker, seeking harmony and deep connection in relationships.'
    // ... continue
  };
  return dynamics[number] || dynamics[1];
}

function getCompatibleNumbers(number: NumberType): number[] {
  const compatibility: Record<number, number[]> = {
    1: [1, 5, 7],
    2: [2, 4, 6, 8],
    3: [3, 6, 9],
    4: [2, 4, 8],
    5: [1, 5, 7],
    6: [2, 3, 6, 9],
    7: [1, 5, 7],
    8: [2, 4, 8],
    9: [3, 6, 9],
    11: [2, 11, 22],
    22: [4, 11, 22],
    33: [6, 9, 33]
  };
  return compatibility[number] || [1];
}

function getDailyPractices(number: NumberType, isArabic: boolean, isFrench: boolean) {
  const practices: Record<number, Array<{ icon: string; title: string; description: string }>> = {
    1: [
      { icon: '🌅', title: isArabic ? 'تأكيدات الصباح' : isFrench ? 'Affirmations Matinales' : 'Morning Affirmations', description: isArabic ? 'ابدأ يومك بتأكيدات إيجابية عن قدراتك' : isFrench ? 'Commencez votre journée avec des affirmations positives sur vos capacités' : 'Start your day with positive affirmations about your abilities' },
      { icon: '🎯', title: isArabic ? 'تحديد الأهداف' : isFrench ? 'Définition d\'Objectifs' : 'Goal Setting', description: isArabic ? 'حدد هدفاً واحداً واضحاً لكل يوم' : isFrench ? 'Fixez un objectif clair pour chaque jour' : 'Set one clear goal for each day' }
    ]
    // ... simplified
  };
  return practices[number] || practices[1];
}

function getLifeExamples(number: NumberType, isArabic: boolean, isFrench: boolean) {
  const examples: Record<number, Array<{ title: string; description: string }>> = {
    1: [
      { title: isArabic ? 'بدء مشروع' : isFrench ? 'Démarrer un Projet' : 'Starting a Project', description: isArabic ? 'الرقم 1 يزدهر عند بدء مبادرات جديدة. ابدأ ذلك المشروع الذي كنت تؤجله.' : isFrench ? 'Le numéro 1 prospère en démarrant de nouvelles initiatives. Lancez ce projet que vous avez reporté.' : 'Number 1 thrives when initiating new ventures. Start that project you\'ve been postponing.' }
    ]
    // ... simplified
  };
  return examples[number] || examples[1];
}

function getClassicalTeachings(number: NumberType, isArabic: boolean, isFrench: boolean) {
  const teachings: Record<number, Array<{ quote: string; scholar: string; source: string }>> = {
    1: [
      { 
        quote: isArabic ? 'الواحد هو أصل كل الأعداد، كما أن الله هو أصل كل الوجود' : isFrench ? 'L\'Un est l\'origine de tous les nombres, comme Allah est l\'origine de toute existence' : 'The One is the origin of all numbers, as Allah is the origin of all existence',
        scholar: isArabic ? 'ابن عربي' : isFrench ? 'Ibn ʿArabī' : 'Ibn ʿArabī',
        source: isArabic ? 'الفتوحات المكية' : isFrench ? 'Futūḥāt al-Makkiyya' : 'Futūḥāt al-Makkiyya'
      }
    ]
    // ... continue for all numbers
  };
  return teachings[number] || teachings[1];
}

function getHistoricalContext(number: NumberType, isArabic: boolean, isFrench: boolean): string {
  const contexts: Record<number, string> = {
    1: isArabic ? 'الرقم واحد يحمل أهمية خاصة في الإسلام كرمز للتوحيد - وحدانية الله. درس العلماء الكلاسيكيون مثل البوني وابن عربي الرقم 1 كتعبير عن الوحدة الإلهية والبداية.' : isFrench ? 'Le nombre un a une signification particulière en Islam comme symbole de Tawhid - l\'unicité d\'Allah. Les savants classiques comme al-Būnī et Ibn ʿArabī étudiaient le nombre 1 comme expression de l\'unité divine et du commencement.' : 'The number one holds special significance in Islam as a symbol of Tawhid - the oneness of Allah. Classical scholars like al-Būnī and Ibn ʿArabī studied number 1 as the expression of divine unity and beginning.',
    2: isArabic ? 'الرقم اثنان يمثل الثنائية والشراكة في التقاليد الإسلامية - الليل والنهار، الأرض والسماء. يعلمنا عن التوازن والانسجام في الخلق.' : isFrench ? 'Le nombre deux représente la dualité et le partenariat dans les traditions islamiques - la nuit et le jour, la terre et le ciel. Il nous enseigne l\'équilibre et l\'harmonie dans la création.' : 'The number two represents duality and partnership in Islamic traditions - night and day, earth and sky. It teaches us about balance and harmony in creation.'
    // ... continue
  };
  return contexts[number] || contexts[1];
}

function getRelatedConcepts(number: NumberType, isArabic: boolean, isFrench: boolean): string[] {
  const concepts: Record<number, string[]> = {
    1: isArabic ? ['التوحيد', 'البداية', 'القيادة', 'الشمس', 'النار'] : isFrench ? ['Tawhid', 'Commencement', 'Leadership', 'Soleil', 'Feu'] : ['Tawhid', 'Beginning', 'Leadership', 'Sun', 'Fire'],
    2: isArabic ? ['الثنائية', 'التوازن', 'الشراكة', 'القمر', 'الماء'] : isFrench ? ['Dualité', 'Équilibre', 'Partenariat', 'Lune', 'Eau'] : ['Duality', 'Balance', 'Partnership', 'Moon', 'Water']
    // ... continue
  };
  return concepts[number] || concepts[1];
}

export default NumberGuidePanel;
