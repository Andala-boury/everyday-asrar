'use client';

import React, { useState } from 'react';

interface LearningSectionProps {
  currentLanguage: 'en' | 'fr';
}

export default function LearningCenter({ currentLanguage = 'en' }: LearningSectionProps) {
  const [activeSection, setActiveSection] = useState<'intro' | 'islamic' | 'calculations' | 'faq'>('intro');
  
  const lang = currentLanguage;

  const content = {
    intro: {
      title: {
        en: 'Introduction to Planetary Hours',
        fr: 'Introduction aux Heures Planétaires',
      },
      arabic: 'الساعات الفلكية',
      transliteration: 'As-Sāʿāt al-Falakiyya',
      sections: [
        {
          title: {
            en: 'What Are Planetary Hours?',
            fr: 'Que Sont les Heures Planétaires?',
          },
          content: {
            en: 'Planetary hours are ancient divisions of time based on the classical seven planets (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn). Each hour of the day and night is ruled by one of these planets, cycling in a specific order. This system has been used for centuries in Islamic spiritual traditions to optimize activities according to celestial influences.',
            fr: 'Les heures planétaires sont d\'anciennes divisions du temps basées sur les sept planètes classiques (Soleil, Lune, Mercure, Vénus, Mars, Jupiter, Saturne). Chaque heure du jour et de la nuit est gouvernée par l\'une de ces planètes, cyclant dans un ordre spécifique. Ce système a été utilisé pendant des siècles dans les traditions spirituelles islamiques pour optimiser les activités selon les influences célestes.',
          },
        },
        {
          title: {
            en: 'The Seven Classical Planets',
            fr: 'Les Sept Planètes Classiques',
          },
          content: {
            en: 'In Islamic tradition, the seven classical "planets" include the Sun and Moon (luminaries) along with Mercury, Venus, Mars, Jupiter, and Saturn. Each represents specific divine qualities (reflected in the 99 Names of Allah) and governs particular aspects of life and spiritual practice.',
            fr: 'Dans la tradition islamique, les sept "planètes" classiques incluent le Soleil et la Lune (luminaires) ainsi que Mercure, Vénus, Mars, Jupiter et Saturne. Chacune représente des qualités divines spécifiques (reflétées dans les 99 Noms d\'Allah) et gouverne des aspects particuliers de la vie et de la pratique spirituelle.',
          },
        },
        {
          title: {
            en: 'Purpose and Benefits',
            fr: 'Objectif et Avantages',
          },
          content: {
            en: 'Understanding planetary hours helps align daily activities with cosmic rhythms, enhancing spiritual practices and improving outcomes. This knowledge allows practitioners to choose optimal times for prayer, study, business, healing, and other important activities according to traditional Islamic wisdom.',
            fr: 'Comprendre les heures planétaires aide à aligner les activités quotidiennes avec les rythmes cosmiques, améliorant les pratiques spirituelles et les résultats. Cette connaissance permet aux pratiquants de choisir les moments optimaux pour la prière, l\'étude, les affaires, la guérison et d\'autres activités importantes selon la sagesse islamique traditionnelle.',
          },
        },
      ],
    },
    islamic: {
      title: {
        en: 'Islamic Historical Context',
        fr: 'Contexte Historique Islamique',
      },
      arabic: 'السياق التاريخي الإسلامي',
      transliteration: 'As-Siyāq at-Tārīkhī al-Islāmī',
      sections: [
        {
          title: {
            en: 'Classical Islamic Astronomy',
            fr: 'Astronomie Islamique Classique',
          },
          content: {
            en: 'Islamic scholars made tremendous contributions to astronomy during the Golden Age of Islam (8th-14th centuries). Great astronomers like Al-Battani, Ibn al-Haytham, and Nasir al-Din al-Tusi refined planetary calculations and integrated them with spiritual practice. The concept of planetary hours (Sāʿāt al-Falakiyya) became part of Islamic spiritual science.',
            fr: 'Les savants islamiques ont apporté d\'énormes contributions à l\'astronomie pendant l\'Âge d\'Or de l\'Islam (8e-14e siècles). De grands astronomes comme Al-Battani, Ibn al-Haytham et Nasir al-Din al-Tusi ont affiné les calculs planétaires et les ont intégrés à la pratique spirituelle. Le concept des heures planétaires (Sāʿāt al-Falakiyya) est devenu partie de la science spirituelle islamique.',
          },
        },
        {
          title: {
            en: 'Al-Būnī and Shams al-Maʿārif',
            fr: 'Al-Būnī et Shams al-Maʿārif',
          },
          content: {
            en: 'Ahmad al-Būnī (d. 1225) wrote extensively about the spiritual significance of planetary hours in his famous work "Shams al-Maʿārif" (The Sun of Knowledge). He connected each planet with specific Divine Names and taught methods for spiritual practice aligned with planetary influences. His work remains influential in Islamic esotericism today.',
            fr: 'Ahmad al-Būnī (d. 1225) a beaucoup écrit sur la signification spirituelle des heures planétaires dans son célèbre ouvrage "Shams al-Maʿārif" (Le Soleil de la Connaissance). Il a relié chaque planète à des Noms Divins spécifiques et enseigné des méthodes de pratique spirituelle alignées avec les influences planétaires. Son œuvre reste influente dans l\'ésotérisme islamique aujourd\'hui.',
          },
        },
        {
          title: {
            en: 'Ibn ʿArabī\'s Cosmology',
            fr: 'La Cosmologie d\'Ibn ʿArabī',
          },
          content: {
            en: 'The great Sufi master Ibn ʿArabī (1165-1240) developed a comprehensive cosmology integrating planetary spheres with spiritual stations (maqāmāt). In his "Futūḥāt al-Makkiyya" (Meccan Illuminations), he explained how each planet corresponds to prophetic qualities and Divine Names, creating a bridge between astronomy and spirituality.',
            fr: 'Le grand maître soufi Ibn ʿArabī (1165-1240) a développé une cosmologie complète intégrant les sphères planétaires avec les stations spirituelles (maqāmāt). Dans ses "Futūḥāt al-Makkiyya" (Illuminations Mecquoises), il a expliqué comment chaque planète correspond à des qualités prophétiques et Noms Divins, créant un pont entre astronomie et spiritualité.',
          },
        },
        {
          title: {
            en: 'Traditional Sufi Practice',
            fr: 'Pratique Soufie Traditionnelle',
          },
          content: {
            en: 'Sufi orders have long used planetary hours for spiritual exercises. Different tariqas (spiritual paths) developed specific practices: certain dhikr (remembrance) during particular planetary hours, meditation aligned with celestial rhythms, and timing of spiritual retreats (khalwa) according to planetary influences.',
            fr: 'Les ordres soufis utilisent depuis longtemps les heures planétaires pour les exercices spirituels. Différentes tariqas (voies spirituelles) ont développé des pratiques spécifiques: certains dhikr (remembrance) pendant des heures planétaires particulières, méditation alignée avec les rythmes célestes, et timing des retraites spirituelles (khalwa) selon les influences planétaires.',
          },
        },
      ],
    },
    calculations: {
      title: {
        en: 'How Planetary Hours Work',
        fr: 'Comment Fonctionnent les Heures Planétaires',
      },
      arabic: 'كيف تعمل الساعات الفلكية',
      transliteration: 'Kayfa Taʿmal as-Sāʿāt al-Falakiyya',
      sections: [
        {
          title: {
            en: 'Unequal Hour System',
            fr: 'Système d\'Heures Inégales',
          },
          content: {
            en: 'Planetary hours are "unequal hours" - meaning they vary in length depending on season and location. The daytime is divided into 12 equal parts from sunrise to sunset, and nighttime into 12 equal parts from sunset to sunrise. This means summer day hours are longer than summer night hours, and vice versa in winter.',
            fr: 'Les heures planétaires sont des "heures inégales" - ce qui signifie qu\'elles varient en longueur selon la saison et le lieu. La journée est divisée en 12 parties égales du lever au coucher du soleil, et la nuit en 12 parties égales du coucher au lever du soleil. Cela signifie que les heures de jour d\'été sont plus longues que les heures de nuit d\'été, et vice versa en hiver.',
          },
        },
        {
          title: {
            en: 'Planetary Sequence',
            fr: 'Séquence Planétaire',
          },
          content: {
            en: 'The planets cycle in a specific order called the "Chaldean Order": Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon, then repeating. The first hour after sunrise is ruled by the planet of that day (Sunday = Sun, Monday = Moon, etc.). Each subsequent hour follows the sequence.',
            fr: 'Les planètes suivent un ordre spécifique appelé "Ordre Chaldéen": Saturne → Jupiter → Mars → Soleil → Vénus → Mercure → Lune, puis répétition. La première heure après le lever du soleil est gouvernée par la planète de ce jour (dimanche = Soleil, lundi = Lune, etc.). Chaque heure suivante suit la séquence.',
          },
        },
        {
          title: {
            en: 'Day Rulers',
            fr: 'Gouverneurs des Jours',
          },
          content: {
            en: 'Each day is ruled by a planet: Sunday (Sun), Monday (Moon), Tuesday (Mars), Wednesday (Mercury), Thursday (Jupiter), Friday (Venus), Saturday (Saturn). The first planetary hour of each day matches its ruling planet, creating a harmonic resonance for that day\'s energy.',
            fr: 'Chaque jour est gouverné par une planète: dimanche (Soleil), lundi (Lune), mardi (Mars), mercredi (Mercure), jeudi (Jupiter), vendredi (Vénus), samedi (Saturne). La première heure planétaire de chaque jour correspond à sa planète gouvernante, créant une résonance harmonique pour l\'énergie de ce jour.',
          },
        },
        {
          title: {
            en: 'Calculation Method',
            fr: 'Méthode de Calcul',
          },
          content: {
            en: 'To calculate planetary hours: 1) Determine sunrise and sunset times for your location, 2) Divide daylight into 12 equal parts, 3) Divide nighttime into 12 equal parts, 4) Apply the planetary sequence starting with the day\'s ruler. Our app does this automatically using precise astronomical calculations.',
            fr: 'Pour calculer les heures planétaires: 1) Déterminer les heures de lever et coucher du soleil pour votre localisation, 2) Diviser la lumière du jour en 12 parties égales, 3) Diviser la nuit en 12 parties égales, 4) Appliquer la séquence planétaire en commençant par le gouverneur du jour. Notre application fait cela automatiquement en utilisant des calculs astronomiques précis.',
          },
        },
      ],
    },
    faq: {
      title: {
        en: 'Frequently Asked Questions',
        fr: 'Questions Fréquemment Posées',
      },
      arabic: 'الأسئلة المتكررة',
      transliteration: 'Al-Asʾila al-Mutakarrira',
      questions: [
        {
          q: {
            en: 'Is using planetary hours permissible in Islam?',
            fr: 'L\'utilisation des heures planétaires est-elle permise en Islam?',
          },
          a: {
            en: 'Classical Islamic scholars like Al-Būnī and Ibn ʿArabī integrated planetary knowledge with Islamic spirituality. The key is intention (niyyah): using this knowledge to optimize worship and beneficial activities is acceptable, while believing planets have independent power apart from Allah is prohibited (shirk). Always maintain proper Islamic creed (ʿaqīdah).',
            fr: 'Les savants islamiques classiques comme Al-Būnī et Ibn ʿArabī ont intégré les connaissances planétaires avec la spiritualité islamique. La clé est l\'intention (niyyah): utiliser ces connaissances pour optimiser le culte et les activités bénéfiques est acceptable, tandis que croire que les planètes ont un pouvoir indépendant d\'Allah est interdit (shirk). Maintenez toujours la croyance islamique appropriée (ʿaqīdah).',
          },
        },
        {
          q: {
            en: 'Do I need to follow planetary hours strictly?',
            fr: 'Dois-je suivre strictement les heures planétaires?',
          },
          a: {
            en: 'No. Planetary hours are a spiritual tool, not an obligation. The five daily prayers (salat) are performed at their prescribed times regardless of planetary hours. Use this knowledge as supplementary guidance for optional activities and spiritual practices, not as a rigid requirement.',
            fr: 'Non. Les heures planétaires sont un outil spirituel, pas une obligation. Les cinq prières quotidiennes (salat) sont effectuées à leurs heures prescrites indépendamment des heures planétaires. Utilisez ces connaissances comme guidance supplémentaire pour les activités optionnelles et pratiques spirituelles, pas comme une exigence rigide.',
          },
        },
        {
          q: {
            en: 'What if I can\'t perform activities during "favorable" hours?',
            fr: 'Que faire si je ne peux pas effectuer des activités pendant les heures "favorables"?',
          },
          a: {
            en: 'Don\'t worry! The most important factors are sincere intention, proper action, and trust in Allah (tawakkul). Planetary hours provide optimization, not limitation. If you must act during an "unfavorable" hour, proceed with bismillah (in Allah\'s name) and rely on divine guidance.',
            fr: 'Ne vous inquiétez pas! Les facteurs les plus importants sont l\'intention sincère, l\'action appropriée et la confiance en Allah (tawakkul). Les heures planétaires fournissent une optimisation, pas une limitation. Si vous devez agir pendant une heure "défavorable", procédez avec bismillah (au nom d\'Allah) et comptez sur la guidance divine.',
          },
        },
        {
          q: {
            en: 'How do planetary hours relate to Divine Names?',
            fr: 'Comment les heures planétaires se rapportent-elles aux Noms Divins?',
          },
          a: {
            en: 'Each planet reflects specific attributes of Allah found in His 99 Beautiful Names (Asmāʾ Allāh al-Ḥusnā). For example, the Sun reflects An-Nūr (The Light), and the Moon reflects Al-Laṭīf (The Subtle). Reciting these names during corresponding planetary hours can deepen spiritual connection.',
            fr: 'Chaque planète reflète des attributs spécifiques d\'Allah trouvés dans Ses 99 Beaux Noms (Asmāʾ Allāh al-Ḥusnā). Par exemple, le Soleil reflète An-Nūr (La Lumière), et la Lune reflète Al-Laṭīf (Le Subtil). Réciter ces noms pendant les heures planétaires correspondantes peut approfondir la connexion spirituelle.',
          },
        },
        {
          q: {
            en: 'Are planetary hours the same as clock hours?',
            fr: 'Les heures planétaires sont-elles identiques aux heures d\'horloge?',
          },
          a: {
            en: 'No. Planetary hours are "unequal hours" based on sunrise/sunset, so they vary in length. A summer day hour might be 75 minutes, while a winter day hour might be 45 minutes. Clock hours are always 60 minutes. Our app shows you the exact times for each planetary hour.',
            fr: 'Non. Les heures planétaires sont des "heures inégales" basées sur le lever/coucher du soleil, donc elles varient en longueur. Une heure de jour d\'été peut durer 75 minutes, tandis qu\'une heure de jour d\'hiver peut durer 45 minutes. Les heures d\'horloge sont toujours de 60 minutes. Notre application vous montre les temps exacts pour chaque heure planétaire.',
          },
        },
        {
          q: {
            en: 'Can I combine planetary hours with other Islamic practices?',
            fr: 'Puis-je combiner les heures planétaires avec d\'autres pratiques islamiques?',
          },
          a: {
            en: 'Absolutely! Many traditional practices complement planetary hours: performing specific dhikr during aligned hours, timing optional prayers (nafl), scheduling spiritual retreats, choosing times for Quran study, and planning charitable activities. Integration enhances, not replaces, core Islamic practices.',
            fr: 'Absolument! De nombreuses pratiques traditionnelles complètent les heures planétaires: effectuer un dhikr spécifique pendant les heures alignées, chronométrer les prières optionnelles (nafl), planifier les retraites spirituelles, choisir les moments pour l\'étude du Coran, et planifier les activités charitables. L\'intégration améliore, ne remplace pas, les pratiques islamiques fondamentales.',
          },
        },
      ],
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {lang === 'en' ? 'Learning Center' : 'Centre d\'Apprentissage'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {lang === 'en' 
            ? 'Comprehensive guide to planetary hours in Islamic tradition'
            : 'Guide complet des heures planétaires dans la tradition islamique'}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: 'intro', label: lang === 'en' ? 'Introduction' : 'Introduction', icon: '📚' },
          { id: 'islamic', label: lang === 'en' ? 'Islamic Context' : 'Contexte Islamique', icon: '🕌' },
          { id: 'calculations', label: lang === 'en' ? 'How It Works' : 'Comment Ça Marche', icon: '🌙' },
          { id: 'faq', label: lang === 'en' ? 'FAQ' : 'FAQ', icon: '❓' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeSection === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
        {activeSection !== 'faq' ? (
          <>
            {/* Section Header */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {content[activeSection].title[lang]}
              </h2>
              <div className="text-2xl text-indigo-600 dark:text-indigo-400 mb-1">
                {content[activeSection].arabic}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400 italic">
                {content[activeSection].transliteration}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {content[activeSection].sections.map((section: any, index: number) => (
                <div key={index} className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-6">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    {section.title[lang]}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {section.content[lang]}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* FAQ Section */
          <>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {content.faq.title[lang]}
              </h2>
              <div className="text-2xl text-indigo-600 dark:text-indigo-400 mb-1">
                {content.faq.arabic}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400 italic">
                {content.faq.transliteration}
              </div>
            </div>

            <div className="space-y-6">
              {content.faq.questions.map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-3">
                    Q: {item.q[lang]}
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    <span className="font-semibold">A:</span> {item.a[lang]}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer Note */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-lg p-6">
        <div className="flex gap-3">
          <div className="text-amber-600 dark:text-amber-400 text-2xl">⚠️</div>
          <div>
            <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-2">
              {lang === 'en' ? 'Important Reminder' : 'Rappel Important'}
            </h4>
            <p className="text-amber-800 dark:text-amber-300">
              {lang === 'en'
                ? 'This knowledge is a spiritual tool to optimize beneficial activities. It does not replace core Islamic obligations (fard) or replace reliance on Allah (tawakkul). Always maintain proper Islamic creed (aqīdah) and consult knowledgeable scholars for guidance.'
                : 'Cette connaissance est un outil spirituel pour optimiser les activités bénéfiques. Elle ne remplace pas les obligations islamiques fondamentales (fard) ou la confiance en Allah (tawakkul). Maintenez toujours la croyance islamique appropriée (aqīdah) et consultez des savants compétents pour guidance.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
