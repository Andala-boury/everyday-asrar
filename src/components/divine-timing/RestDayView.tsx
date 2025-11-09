'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Moon, Calendar, Sparkles, Heart } from 'lucide-react';
import type { AccuratePlanetaryHour, Element } from '../../types/planetary';

interface RestDayViewProps {
  userElement: Element;
  planetaryHours: AccuratePlanetaryHour[];
  currentHour: AccuratePlanetaryHour;
  onShowTimeline: () => void;
}

export function RestDayView({ 
  userElement, 
  planetaryHours, 
  currentHour,
  onShowTimeline 
}: RestDayViewProps) {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      
      {/* Animated background stars */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-full">
            <Moon className="w-16 h-16 text-purple-200 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {language === 'fr' ? 'Jour de Repos' : 'Rest Day'}
          </h1>
          <p className="text-lg text-purple-200">
            {language === 'fr' 
              ? 'Aujourd\'hui, l\'harmonie cosmique suggère de ralentir'
              : 'Today, cosmic harmony suggests slowing down'}
          </p>
        </div>
        
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl space-y-6">
          
          {/* Quote */}
          <div className="text-center space-y-3 pb-6 border-b border-white/20">
            <p className="text-2xl font-arabic text-purple-200">
              السكون قبل الحركة
            </p>
            <p className="text-lg italic text-white">
              "Al-sukūn qabl al-ḥaraka"
            </p>
            <p className="text-purple-200">
              {language === 'fr'
                ? 'Le calme avant le mouvement apporte une action bénie'
                : 'Stillness before movement brings blessed action'}
            </p>
          </div>
          
          {/* Explanation */}
          <div className="space-y-4 text-purple-100">
            <p className="text-lg leading-relaxed">
              {language === 'fr'
                ? `Votre élément ${userElement} trouve peu d'harmonie avec les énergies planétaires d'aujourd'hui. Plutôt qu'une période difficile, considérez cela comme une invitation sacrée au repos.`
                : `Your ${userElement} element finds little harmony with today's planetary energies. Rather than a difficult period, consider this a sacred invitation to rest.`}
            </p>
          </div>
          
          {/* Recommended Practices */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {language === 'fr' ? 'Recommandé Aujourd\'hui' : 'Recommended Today'}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {getRestPractices(language).map((practice, index) => (
                <div 
                  key={index}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="text-2xl mb-2">{practice.emoji}</div>
                  <h4 className="font-semibold text-white mb-1">{practice.title}</h4>
                  <p className="text-sm text-purple-200">{practice.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Better Days Preview */}
          <div className="pt-6 border-t border-white/20 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {language === 'fr' ? 'Meilleurs Jours à Venir' : 'Better Days Ahead'}
            </h3>
            <p className="text-purple-200">
              {language === 'fr'
                ? 'Les énergies changent constamment. Utilisez aujourd\'hui pour vous préparer aux opportunités de demain.'
                : 'Energies are constantly shifting. Use today to prepare for tomorrow\'s opportunities.'}
            </p>
            <button
              onClick={onShowTimeline}
              className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg transition-all"
            >
              {language === 'fr' ? 'Voir la Semaine Complète' : 'View Full Week'}
            </button>
          </div>
        </div>
        
        {/* Current Hour Info (smaller) */}
        <div className="text-center space-y-2 opacity-75">
          <p className="text-sm text-purple-200">
            {language === 'fr' ? 'Heure actuelle' : 'Current hour'}: {currentHour.planet.name} ({currentHour.planet.nameArabic})
          </p>
          <p className="text-xs text-purple-300">
            {currentHour.startTime.toLocaleTimeString()} - {currentHour.endTime.toLocaleTimeString()}
          </p>
        </div>
        
        {/* Sacred Reminder */}
        <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <Heart className="w-8 h-8 text-pink-300 mx-auto mb-3" />
          <p className="text-purple-100 italic">
            {language === 'fr'
              ? '"Pas de temps n\'est jamais perdu dans la présence du Divin"'
              : '"No time is ever lost in the Divine\'s presence"'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function for rest practices
function getRestPractices(language: string) {
  const practices = {
    en: [
      {
        emoji: '🧘',
        title: '20min Silence',
        description: 'Sit in quiet meditation or dhikr away from screens'
      },
      {
        emoji: '🌿',
        title: 'Nature Walk',
        description: 'Gentle movement outdoors without goal or agenda'
      },
      {
        emoji: '📔',
        title: 'Journal Freely',
        description: 'Write thoughts without forcing solutions'
      },
      {
        emoji: '📖',
        title: 'Read Sacred Texts',
        description: 'Qur\'an, hadith, or spiritual poetry'
      },
      {
        emoji: '🫖',
        title: 'Mindful Tea',
        description: 'Prepare and drink tea with full presence'
      },
      {
        emoji: '🌙',
        title: 'Early Sleep',
        description: 'Honor your body\'s need for restoration'
      }
    ],
    fr: [
      {
        emoji: '🧘',
        title: '20min de Silence',
        description: 'Méditation ou dhikr tranquille loin des écrans'
      },
      {
        emoji: '🌿',
        title: 'Promenade Nature',
        description: 'Mouvement doux en plein air sans but précis'
      },
      {
        emoji: '📔',
        title: 'Journal Libre',
        description: 'Écrire sans forcer de solutions'
      },
      {
        emoji: '📖',
        title: 'Textes Sacrés',
        description: 'Coran, hadith, ou poésie spirituelle'
      },
      {
        emoji: '🫖',
        title: 'Thé Conscient',
        description: 'Préparer et boire du thé en pleine présence'
      },
      {
        emoji: '🌙',
        title: 'Sommeil Tôt',
        description: 'Honorer le besoin de restauration du corps'
      }
    ]
  };
  
  return language === 'fr' ? practices.fr : practices.en;
}
