import React from 'react';
import { RelationshipCompatibility } from '../types/compatibility';
import { CompatibilityGauge } from './CompatibilityGauge';
import { Heart, Users, Sparkles, Info } from 'lucide-react';

interface RelationshipCompatibilityViewProps {
  compatibility: RelationshipCompatibility;
  language?: 'en' | 'fr' | 'ar';
}

export function RelationshipCompatibilityView({ 
  compatibility, 
  language = 'en' 
}: RelationshipCompatibilityViewProps) {
  
  const { person1, person2, methods, overallScore, overallQuality, summary, summaryArabic, recommendations, recommendationsFrench, recommendationsArabic } = compatibility;
  
  // Quality badge colors
  const qualityColors: Record<typeof overallQuality, string> = {
    'excellent': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'very-good': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'good': 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
    'moderate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'challenging': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
  };
  
  // Select recommendations based on language
  const displayRecommendations = language === 'ar' ? recommendationsArabic : (language === 'fr' ? recommendationsFrench : recommendations);
  
  return (
    <div className="space-y-8 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Heart className="w-8 h-8 text-rose-500" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {language === 'ar' ? 'تحليل التوافق' : 'Compatibility Analysis'}
          </h2>
        </div>
        
        {/* Names */}
        <div className="flex items-center justify-center gap-4 text-xl font-semibold">
          <span className="text-indigo-600 dark:text-indigo-400">{person1.name}</span>
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-purple-600 dark:text-purple-400">{person2.name}</span>
        </div>
      </div>
      
      {/* Overall Score - Large Gauge */}
      <div className="flex flex-col items-center py-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg">
        <CompatibilityGauge 
          score={overallScore} 
          size="lg"
          label={language === 'ar' ? 'التوافق الإجمالي' : 'Overall Compatibility'}
        />
        
        <div className={`mt-4 px-4 py-2 rounded-full font-semibold ${qualityColors[overallQuality]}`}>
          {language === 'ar' ? compatibility.overallQualityArabic : overallQuality.toUpperCase().replace('-', ' ')}
        </div>
      </div>
      
      {/* Summary */}
      <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {language === 'ar' ? summaryArabic : summary}
          </p>
        </div>
      </div>
      
      {/* Three Methods - Side by Side Gauges */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center">
          {language === 'ar' ? 'طرق التحليل الثلاث' : 'Three Analysis Methods'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Spiritual-Destiny */}
          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg space-y-3">
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
            <h4 className="font-bold text-center text-gray-900 dark:text-gray-100">
              {language === 'ar' ? methods.spiritualDestiny.methodArabic : '🌙 Spiritual Destiny'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {language === 'ar' ? `الباقي: ${methods.spiritualDestiny.remainder}` : `Remainder: ${methods.spiritualDestiny.remainder}`}
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              {language === 'ar' ? methods.spiritualDestiny.descriptionArabic : methods.spiritualDestiny.description}
            </p>
          </div>
          
          {/* Elemental-Temperament */}
          <div className="p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg space-y-3">
            <div className="flex items-center justify-center">
              <CompatibilityGauge 
                score={methods.elementalTemperament.score}
                size="md"
                color={methods.elementalTemperament.color === 'red' ? '#ef4444' :
                       methods.elementalTemperament.color === 'blue' ? '#3b82f6' :
                       methods.elementalTemperament.color === 'cyan' ? '#06b6d4' : '#10b981'}
              />
            </div>
            <h4 className="font-bold text-center text-gray-900 dark:text-gray-100">
              {language === 'ar' ? methods.elementalTemperament.methodArabic : '🌊 Elemental Temperament'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {language === 'ar' ? `عنصر: ${methods.elementalTemperament.sharedElementArabic}` : `Element: ${methods.elementalTemperament.sharedElement}`}
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              {language === 'ar' ? methods.elementalTemperament.descriptionArabic : methods.elementalTemperament.description}
            </p>
          </div>
          
          {/* Planetary-Cosmic */}
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg space-y-3">
            <div className="flex items-center justify-center">
              <CompatibilityGauge 
                score={methods.planetaryCosmic.score}
                size="md"
                color={methods.planetaryCosmic.color === 'green' ? '#10b981' :
                       methods.planetaryCosmic.color === 'blue' ? '#3b82f6' :
                       methods.planetaryCosmic.color === 'yellow' ? '#eab308' : '#f97316'}
              />
            </div>
            <h4 className="font-bold text-center text-gray-900 dark:text-gray-100">
              {language === 'ar' ? methods.planetaryCosmic.methodArabic : '⭐ Planetary Cosmic'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {language === 'ar' 
                ? `${methods.planetaryCosmic.person1Planet.nameArabic} × ${methods.planetaryCosmic.person2Planet.nameArabic}`
                : `${methods.planetaryCosmic.person1Planet.name} × ${methods.planetaryCosmic.person2Planet.name}`
              }
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              {language === 'ar' ? methods.planetaryCosmic.descriptionArabic : methods.planetaryCosmic.description}
            </p>
          </div>
          
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {language === 'ar' ? 'توصيات' : language === 'fr' ? 'Recommandations' : 'Recommendations'}
          </h3>
        </div>
        
        <ul className="space-y-2">
          {displayRecommendations.map((rec, idx) => (
            <li 
              key={idx}
              className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg"
            >
              <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
}
