'use client';

import React, { useState } from 'react';
import { Moon, Star, Heart, BookOpen, Coffee, Sparkles, Wind, Droplets } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Element, AccuratePlanetaryHour } from '../../types/planetary';

interface RestDayViewProps {
  userElement: Element;
  hours: AccuratePlanetaryHour[];
  nextGoodHour: AccuratePlanetaryHour | null;
}

interface RestPractice {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  emoji: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  durationEn: string;
  durationFr: string;
}

const REST_PRACTICES: RestPractice[] = [
  {
    id: 'silence',
    icon: Moon,
    emoji: '🌙',
    nameEn: 'Sacred Silence',
    nameFr: 'Silence Sacré',
    descriptionEn: 'Sit in stillness, breathe deeply, and simply be',
    descriptionFr: 'Asseyez-vous dans le calme, respirez profondément et soyez simplement',
    durationEn: '20 minutes',
    durationFr: '20 minutes'
  },
  {
    id: 'quran',
    icon: BookOpen,
    emoji: '📖',
    nameEn: 'Gentle Quran Reading',
    nameFr: 'Lecture Douce du Coran',
    descriptionEn: 'Read slowly for comfort, not quantity',
    descriptionFr: 'Lisez lentement pour le réconfort, pas la quantité',
    durationEn: '15-30 minutes',
    durationFr: '15-30 minutes'
  },
  {
    id: 'dhikr',
    icon: Heart,
    emoji: '🤲',
    nameEn: 'Soft Dhikr',
    nameFr: 'Dhikr Doux',
    descriptionEn: 'SubhanAllah, Alhamdulillah, Allahu Akbar - whispered gently',
    descriptionFr: 'SubhanAllah, Alhamdulillah, Allahu Akbar - murmuré doucement',
    durationEn: '33 each',
    durationFr: '33 chacun'
  },
  {
    id: 'nature',
    icon: Wind,
    emoji: '🌿',
    nameEn: 'Connect with Nature',
    nameFr: 'Connexion avec la Nature',
    descriptionEn: 'Gentle walk, feel the breeze, observe creation',
    descriptionFr: 'Marche douce, sentez la brise, observez la création',
    durationEn: '30 minutes',
    durationFr: '30 minutes'
  },
  {
    id: 'tea',
    icon: Coffee,
    emoji: '☕',
    nameEn: 'Mindful Tea',
    nameFr: 'Thé en Pleine Conscience',
    descriptionEn: 'Slowly sip tea while reflecting on blessings',
    descriptionFr: 'Sirotez lentement du thé en réfléchissant aux bénédictions',
    durationEn: '15 minutes',
    durationFr: '15 minutes'
  },
  {
    id: 'gratitude',
    icon: Sparkles,
    emoji: '✨',
    nameEn: 'Gratitude Journal',
    nameFr: 'Journal de Gratitude',
    descriptionEn: 'Write 3 things you\'re grateful for today',
    descriptionFr: 'Écrivez 3 choses pour lesquelles vous êtes reconnaissant aujourd\'hui',
    durationEn: '10 minutes',
    durationFr: '10 minutes'
  }
];

const SACRED_QUOTES = [
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    transliteration: 'Inna maʿa al-ʿusri yusrā',
    meaningEn: 'Indeed, with hardship comes ease',
    meaningFr: 'En vérité, avec la difficulté vient la facilité',
    reference: 'Quran 94:6'
  },
  {
    arabic: 'وَفِي السَّمَاءِ رِزْقُكُمْ وَمَا تُوعَدُونَ',
    transliteration: 'Wa fī as-samāʾi rizqukum wa mā tūʿadūn',
    meaningEn: 'And in the sky is your provision and whatever you are promised',
    meaningFr: 'Et dans le ciel est votre subsistance et tout ce qui vous est promis',
    reference: 'Quran 51:22'
  },
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    transliteration: 'Fadhkurūnī adhkurkum',
    meaningEn: 'So remember Me; I will remember you',
    meaningFr: 'Alors souvenez-vous de Moi; Je me souviendrai de vous',
    reference: 'Quran 2:152'
  }
];

export function RestDayView({ userElement, hours, nextGoodHour }: RestDayViewProps) {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [quoteIndex] = useState(Math.floor(Math.random() * SACRED_QUOTES.length));

  const quote = SACRED_QUOTES[quoteIndex];

  // Calculate when energy improves
  const now = new Date();
  const nextGoodTime = nextGoodHour ? new Date(nextGoodHour.startTime) : null;
  const hoursUntilGood = nextGoodTime 
    ? Math.round((nextGoodTime.getTime() - now.getTime()) / (1000 * 60 * 60))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <Moon className="w-16 h-16 md:w-20 md:h-20 text-indigo-300 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isFr ? '🌙 Jour de Repos' : '🌙 Rest Day'}
          </h1>
          <p className="text-xl md:text-2xl text-indigo-200 mb-6">
            {isFr 
              ? 'Aujourd\'hui est un jour pour la paix intérieure'
              : 'Today is a day for inner peace'}
          </p>
          <div className="max-w-2xl mx-auto">
            <p className="text-base md:text-lg text-indigo-100 leading-relaxed">
              {isFr 
                ? 'L\'énergie planétaire d\'aujourd\'hui invite au repos et à la réflexion. Ce n\'est pas un jour de faiblesse, mais un jour sacré pour recharger votre âme.'
                : 'Today\'s planetary energy invites rest and reflection. This is not a day of weakness, but a sacred day to recharge your soul.'}
            </p>
          </div>
        </div>

        {/* Sacred Quote Card */}
        <div className="mb-12 p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
          <div className="text-center">
            <div className="text-3xl md:text-4xl text-indigo-200 mb-4 font-arabic" style={{ fontFamily: 'Noto Naskh Arabic, Amiri, serif', lineHeight: 1.8 }}>
              {quote.arabic}
            </div>
            <div className="text-lg md:text-xl text-indigo-300 mb-3 italic">
              "{quote.transliteration}"
            </div>
            <div className="text-base md:text-lg text-white font-semibold mb-2">
              {isFr ? quote.meaningFr : quote.meaningEn}
            </div>
            <div className="text-sm text-indigo-400">
              — {quote.reference}
            </div>
          </div>
        </div>

        {/* Energy Timeline Info */}
        {nextGoodHour && hoursUntilGood !== null && (
          <div className="mb-12 p-6 bg-indigo-800/30 backdrop-blur-sm rounded-xl border border-indigo-600/30">
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">
                {isFr ? '⏰ Quand l\'énergie s\'améliore:' : '⏰ When Energy Improves:'}
              </h3>
            </div>
            <p className="text-indigo-200">
              {isFr 
                ? `Dans environ ${hoursUntilGood} heure${hoursUntilGood > 1 ? 's' : ''}, l'heure de ${nextGoodHour.planet.nameArabic} (${nextGoodHour.planet.name}) apportera une meilleure harmonie.`
                : `In about ${hoursUntilGood} hour${hoursUntilGood > 1 ? 's' : ''}, the hour of ${nextGoodHour.planet.nameArabic} (${nextGoodHour.planet.name}) will bring better harmony.`}
            </p>
            <p className="text-sm text-indigo-300 mt-2">
              {isFr 
                ? '💡 Utilisez ce temps pour vous préparer intérieurement'
                : '💡 Use this time to prepare yourself inwardly'}
            </p>
          </div>
        )}

        {/* Rest Practices Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            {isFr ? '🕊️ Pratiques Recommandées' : '🕊️ Recommended Practices'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REST_PRACTICES.map((practice) => {
              const Icon = practice.icon;
              const isSelected = selectedPractice === practice.id;
              
              return (
                <button
                  key={practice.id}
                  onClick={() => setSelectedPractice(isSelected ? null : practice.id)}
                  className={`group p-6 rounded-xl transition-all duration-300 text-left
                    ${isSelected 
                      ? 'bg-white/20 border-2 border-white/40 shadow-xl scale-105' 
                      : 'bg-white/10 border border-white/20 hover:bg-white/15 hover:scale-102'
                    } backdrop-blur-sm`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">{practice.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-1">
                        {isFr ? practice.nameFr : practice.nameEn}
                      </h4>
                      <p className="text-xs text-indigo-300">
                        {isFr ? practice.durationFr : practice.durationEn}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-indigo-100">
                    {isFr ? practice.descriptionFr : practice.descriptionEn}
                  </p>
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-xs text-white font-semibold">
                        ✓ {isFr ? 'Sélectionné - Commencez quand vous êtes prêt' : 'Selected - Begin when ready'}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gentle Reminder */}
        <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl border border-purple-400/30 text-center">
          <Droplets className="w-8 h-8 text-purple-300 mx-auto mb-3" />
          <p className="text-lg text-white mb-2">
            {isFr 
              ? '🌸 Le repos n\'est pas une faiblesse'
              : '🌸 Rest is not weakness'}
          </p>
          <p className="text-sm text-purple-100">
            {isFr 
              ? 'Même les plus grands arbres ont besoin de périodes de repos pour grandir plus fort. Honorez ce moment sacré.'
              : 'Even the mightiest trees need periods of rest to grow stronger. Honor this sacred time.'}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-indigo-400">
            {isFr 
              ? '💫 Faites confiance au timing divin. Tout arrive en son temps parfait.'
              : '💫 Trust in divine timing. Everything comes in its perfect time.'}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 3s infinite;
        }
      `}</style>
    </div>
  );
}
