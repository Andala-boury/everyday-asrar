import React, { useState } from 'react';
import { RelationshipCompatibility } from '../types/compatibility';
import { CompatibilityGauge } from './CompatibilityGauge';
import { Heart, Users, Sparkles, Info, ChevronDown, ChevronUp, BookOpen, Compass, BookMarked } from 'lucide-react';
import { COMPATIBILITY_TERMS, getScoreRange } from '../constants/compatibilitySimpleLanguage';
import { InfoTooltip } from './InfoTooltip';
import { CompatibilityLearningCenter } from './CompatibilityLearningCenter';
import { MethodGuidePanel } from './MethodGuidePanel';
import { CompatibilityGlossary } from './CompatibilityGlossary';

interface RelationshipCompatibilityViewProps {
  compatibility: RelationshipCompatibility;
  language?: 'en' | 'fr' | 'ar';
}

export function RelationshipCompatibilityView({ 
  compatibility, 
  language = 'en' 
}: RelationshipCompatibilityViewProps) {
  
  const [showMethodDetails, setShowMethodDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'learning' | 'methods' | 'glossary'>('results');
  
  const { person1, person2, methods, overallScore, overallQuality, summary, summaryArabic, recommendations, recommendationsFrench, recommendationsArabic } = compatibility;
  
  const terms = COMPATIBILITY_TERMS[language];
  const scoreRange = getScoreRange(overallScore, language);
  
  // Quality badge colors
  const qualityColors: Record<typeof overallQuality, string> = {
    'excellent': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    'very-good': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    'good': 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800',
    'moderate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    'challenging': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800'
  };
  
  // Select recommendations based on language
  const displayRecommendations = language === 'ar' ? recommendationsArabic : (language === 'fr' ? recommendationsFrench : recommendations);
  
  const tabs = {
    en: {
      results: 'Results',
      learning: 'Learning Center',
      methods: 'Method Guide',
      glossary: 'Glossary'
    },
    fr: {
      results: 'Résultats',
      learning: "Centre d'Apprentissage",
      methods: 'Guide des Méthodes',
      glossary: 'Glossaire'
    }
  };
  
  const tabLabels = language === 'fr' ? tabs.fr : tabs.en;
  
  return (
    <div className="space-y-6">
      
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex gap-2 p-2 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'results'
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className="w-5 h-5" />
            {tabLabels.results}
          </button>
          
          <button
            onClick={() => setActiveTab('learning')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'learning'
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            {tabLabels.learning}
          </button>
          
          <button
            onClick={() => setActiveTab('methods')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'methods'
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-5 h-5" />
            {tabLabels.methods}
          </button>
          
          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'glossary'
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookMarked className="w-5 h-5" />
            {tabLabels.glossary}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'learning' && (
        <CompatibilityLearningCenter language={language} />
      )}
      
      {activeTab === 'methods' && (
        <MethodGuidePanel language={language} />
      )}
      
      {activeTab === 'glossary' && (
        <CompatibilityGlossary language={language} />
      )}
      
      {activeTab === 'results' && (
    <div className="space-y-8 p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Heart className="w-10 h-10 text-rose-500" />
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            {terms.mainTitle.simple}
            <InfoTooltip content={terms.mainTitle.tooltip} />
          </h2>
        </div>
        
        {/* Names */}
        <div className="flex items-center justify-center gap-4 text-2xl font-semibold">
          <span className="text-indigo-600 dark:text-indigo-400">{person1.name}</span>
          <Users className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          <span className="text-purple-600 dark:text-purple-400">{person2.name}</span>
        </div>
      </div>
      
      {/* Overall Score - Large Gauge */}
      <div className="flex flex-col items-center py-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {terms.overallScore.simple}
          </h3>
          <InfoTooltip content={terms.overallScore.tooltip} />
        </div>
        
        <CompatibilityGauge 
          score={overallScore} 
          size="lg"
        />
        
        <div className={`mt-5 px-6 py-3 rounded-full font-bold text-lg border-2 ${qualityColors[overallQuality]}`}>
          {scoreRange.icon} {scoreRange.label}
        </div>
        
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 text-center max-w-md">
          {scoreRange.description}
        </p>
      </div>
      
      {/* Summary */}
      <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-50 mb-2 text-lg flex items-center gap-2">
              {terms.summary.title}
              <InfoTooltip content={terms.summary.tooltip} />
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
              {language === 'ar' ? summaryArabic : summary}
            </p>
          </div>
        </div>
      </div>
      
      {/* Three Methods - Collapsible */}
      <div className="space-y-5">
        <button
          onClick={() => setShowMethodDetails(!showMethodDetails)}
          className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {terms.methods.title}
            </h3>
            <InfoTooltip content={terms.methods.tooltip} />
          </div>
          {showMethodDetails ? (
            <ChevronUp className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-50 transition-colors" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-50 transition-colors" />
          )}
        </button>
        
        <div 
          className={`transition-all duration-300 overflow-hidden ${
            showMethodDetails ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Spiritual-Destiny → Soul Connection */}
          <div className="p-6 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 space-y-4">
            <div className="flex items-center justify-center">
              <CompatibilityGauge 
                score={methods.spiritualDestiny.score}
                size="md"
                color={methods.spiritualDestiny.color === 'green' ? '#10b981' : 
                       methods.spiritualDestiny.color === 'blue' ? '#3b82f6' :
                       methods.spiritualDestiny.color === 'yellow' ? '#eab308' :
                       methods.spiritualDestiny.color === 'purple' ? '#a855f7' : '#f97316'}
              />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-slate-900 dark:text-slate-50 text-lg mb-1 flex items-center justify-center gap-2">
                {terms.spiritualDestiny.emoji} {terms.spiritualDestiny.simple}
                <InfoTooltip content={terms.spiritualDestiny.tooltip} />
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
              </p>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {language === 'ar' ? methods.spiritualDestiny.descriptionArabic : methods.spiritualDestiny.description}
            </p>
          </div>
          
          {/* Elemental-Temperament → Personality Balance */}
          <div className="p-6 bg-cyan-50 dark:bg-cyan-950/30 rounded-xl border border-cyan-200 dark:border-cyan-800 space-y-4">
            <div className="flex items-center justify-center">
              <CompatibilityGauge 
                score={methods.elementalTemperament.score}
                size="md"
                color={methods.elementalTemperament.color === 'red' ? '#ef4444' :
                       methods.elementalTemperament.color === 'blue' ? '#3b82f6' :
                       methods.elementalTemperament.color === 'cyan' ? '#06b6d4' : '#10b981'}
              />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-slate-900 dark:text-slate-50 text-lg mb-1 flex items-center justify-center gap-2">
                {terms.elementalTemperament.emoji} {terms.elementalTemperament.simple}
                <InfoTooltip content={terms.elementalTemperament.tooltip} />
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {language === 'ar' ? `${methods.elementalTemperament.sharedElementArabic}` : terms.elements[methods.elementalTemperament.sharedElement].emoji + ' ' + terms.elements[methods.elementalTemperament.sharedElement].name}
              </p>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {language === 'ar' ? methods.elementalTemperament.descriptionArabic : methods.elementalTemperament.description}
            </p>
          </div>
          
          {/* Planetary-Cosmic → Cosmic Harmony */}
          <div className="p-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-4">
            <div className="flex items-center justify-center">
              <CompatibilityGauge 
                score={methods.planetaryCosmic.score}
                size="md"
                color={methods.planetaryCosmic.color === 'green' ? '#10b981' :
                       methods.planetaryCosmic.color === 'blue' ? '#3b82f6' :
                       methods.planetaryCosmic.color === 'yellow' ? '#eab308' : '#f97316'}
              />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-slate-900 dark:text-slate-50 text-lg mb-1 flex items-center justify-center gap-2">
                {terms.planetaryCosmic.emoji} {terms.planetaryCosmic.simple}
                <InfoTooltip content={terms.planetaryCosmic.tooltip} />
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {language === 'ar' 
                  ? `${methods.planetaryCosmic.person1Planet.nameArabic} × ${methods.planetaryCosmic.person2Planet.nameArabic}`
                  : `${methods.planetaryCosmic.person1Planet.name} × ${methods.planetaryCosmic.person2Planet.name}`
                }
              </p>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {language === 'ar' ? methods.planetaryCosmic.descriptionArabic : methods.planetaryCosmic.description}
            </p>
          </div>
          
        </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            {terms.recommendations.title}
            <InfoTooltip content={terms.recommendations.tooltip} />
          </h3>
        </div>
        
        <ul className="space-y-3">
          {displayRecommendations.map((rec, idx) => (
            <li 
              key={idx}
              className="flex items-start gap-3 p-5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800"
            >
              <span className="text-amber-600 dark:text-amber-400 font-bold text-lg flex-shrink-0">•</span>
              <span className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
      
    </div>
      )}
    </div>
  );
}
