'use client';

import React, { useState } from 'react';
import { BookOpen, Sparkles, Calculator, HelpCircle, ChevronRight } from 'lucide-react';

interface LearningCenterProps {
  currentLanguage?: 'en' | 'fr';
}

export function NameDestinyLearningCenter({ currentLanguage = 'en' }: LearningCenterProps) {
  const [activeTab, setActiveTab] = useState<'intro' | 'islamic' | 'calculations' | 'faq'>('intro');
  const lang = currentLanguage;
  const isFrench = lang === 'fr';

  const tabs = [
    { id: 'intro' as const, icon: BookOpen, label: { en: 'Introduction', fr: 'Introduction' } },
    { id: 'islamic' as const, icon: Sparkles, label: { en: 'Islamic Context', fr: 'Contexte Islamique' } },
    { id: 'calculations' as const, icon: Calculator, label: { en: 'Calculations', fr: 'Calculs' } },
    { id: 'faq' as const, icon: HelpCircle, label: { en: 'FAQ', fr: 'FAQ' } }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          {isFrench ? "Centre d'Apprentissage: Science des Lettres" : 'Name Destiny Learning Center'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          {isFrench 
            ? "Découvrez la sagesse spirituelle encodée dans les lettres arabes" 
            : 'Discover the spiritual wisdom encoded in Arabic letters'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label[lang]}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        {activeTab === 'intro' && <IntroductionTab isFrench={isFrench} />}
        {activeTab === 'islamic' && <IslamicContextTab isFrench={isFrench} />}
        {activeTab === 'calculations' && <CalculationsTab isFrench={isFrench} />}
        {activeTab === 'faq' && <FAQTab isFrench={isFrench} />}
      </div>
    </div>
  );
}

// ============================================================================
// INTRODUCTION TAB
// ============================================================================

function IntroductionTab({ isFrench }: { isFrench: boolean }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          {isFrench ? "Qu'est-ce que ʿIlm al-Ḥurūf?" : 'What is ʿIlm al-Ḥurūf?'}
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          {isFrench 
            ? "ʿIlm al-Ḥurūf (علم الحروف), ou la «Science des Lettres», est une discipline traditionnelle islamique qui étudie la signification spirituelle et numérique des lettres arabes. Chaque lettre de l'alphabet arabe porte non seulement un son, mais aussi une valeur numérique (système Abjad) et des qualités élémentales."
            : "ʿIlm al-Ḥurūf (علم الحروف), or the 'Science of Letters', is a traditional Islamic discipline that studies the spiritual and numerical significance of Arabic letters. Each letter of the Arabic alphabet carries not only a sound, but also a numerical value (Abjad system) and elemental qualities."}
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {isFrench
            ? "Cette science a été développée par des érudits islamiques au fil des siècles, notamment Ibn al-ʿArabī, al-Būnī et al-Ghazālī. Elle est utilisée pour la contemplation spirituelle, l'analyse des noms et la compréhension des significations cachées dans le texte coranique."
            : "This science was developed by Islamic scholars over centuries, including Ibn al-ʿArabī, al-Būnī, and al-Ghazālī. It's used for spiritual contemplation, name analysis, and understanding hidden meanings in the Qur'anic text."}
        </p>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-5 border border-purple-200 dark:border-purple-700">
        <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
          <span className="text-2xl">✨</span>
          {isFrench ? 'Principes Fondamentaux' : 'Core Principles'}
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
            <span className="text-slate-700 dark:text-slate-300">
              {isFrench 
                ? "Chaque lettre arabe a une valeur numérique unique (Abjad)"
                : "Each Arabic letter has a unique numerical value (Abjad)"}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
            <span className="text-slate-700 dark:text-slate-300">
              {isFrench
                ? "Les lettres sont associées aux quatre éléments (Feu, Terre, Air, Eau)"
                : "Letters are associated with the four elements (Fire, Earth, Air, Water)"}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
            <span className="text-slate-700 dark:text-slate-300">
              {isFrench
                ? "Les noms révèlent des schémas spirituels et des qualités personnelles"
                : "Names reveal spiritual patterns and personal qualities"}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
            <span className="text-slate-700 dark:text-slate-300">
              {isFrench
                ? "Cette science est utilisée pour la réflexion, non la divination"
                : "This science is used for reflection, not fortune-telling"}
            </span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-700">
        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
          <span className="text-2xl">📚</span>
          {isFrench ? 'Histoire et Tradition' : 'History & Tradition'}
        </h3>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {isFrench
            ? "Le système Abjad est antérieur à l'Islam et était utilisé dans tout le monde sémitique. Les érudits musulmans l'ont développé en une discipline spirituelle sophistiquée. La tradition maghrébine (Afrique du Nord/Ouest) a développé sa propre classification élémentale unique de 28 lettres."
            : "The Abjad system predates Islam and was used throughout the Semitic world. Muslim scholars developed it into a sophisticated spiritual discipline. The Maghribi (North/West African) tradition developed its own unique elemental classification of the 28 letters."}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// ISLAMIC CONTEXT TAB
// ============================================================================

function IslamicContextTab({ isFrench }: { isFrench: boolean }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          {isFrench ? 'Les Lettres dans la Tradition Islamique' : 'Letters in Islamic Tradition'}
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          {isFrench
            ? "Dans la tradition islamique, les lettres sont considérées comme porteuses de significations spirituelles profondes. Le Coran lui-même commence plusieurs sourates avec des lettres mystérieuses (al-Ḥurūf al-Muqaṭṭaʿa) comme Alif-Lām-Mīm (الم), dont les significations ont été contemplées par les érudits pendant des siècles."
            : "In Islamic tradition, letters are seen as carriers of deep spiritual meanings. The Qur'an itself begins several surahs with mysterious letters (al-Ḥurūf al-Muqaṭṭaʿa) like Alif-Lām-Mīm (الم), whose meanings have been contemplated by scholars for centuries."}
        </p>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-5 border border-emerald-200 dark:border-emerald-700">
        <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
          <span className="text-2xl">🕌</span>
          {isFrench ? 'Érudits Clés' : 'Key Scholars'}
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Ibn al-ʿArabī (1165-1240)</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {isFrench
                ? "Le grand mystique soufi a écrit abondamment sur la signification spirituelle des lettres dans des œuvres comme al-Futūḥāt al-Makkiyya."
                : "The great Sufi mystic wrote extensively on the spiritual significance of letters in works like al-Futūḥāt al-Makkiyya."}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Al-Būnī (d. 1225)</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {isFrench
                ? "Auteur de Shams al-Maʿārif, un texte majeur sur la science des lettres et leurs applications spirituelles."
                : "Author of Shams al-Maʿārif, a major text on the science of letters and their spiritual applications."}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Al-Ghazālī (1058-1111)</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {isFrench
                ? "A exploré les dimensions spirituelles du langage et de l'écriture dans son œuvre théologique."
                : "Explored the spiritual dimensions of language and writing in his theological work."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-5 border border-amber-200 dark:border-amber-700">
        <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
          <span className="text-2xl">⚖️</span>
          {isFrench ? 'Perspective Spirituelle' : 'Spiritual Perspective'}
        </h3>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          {isFrench
            ? "ʿIlm al-Ḥurūf est considéré comme un outil de contemplation et de réflexion personnelle, et non comme un moyen de prédire l'avenir. Il aide à:"
            : "ʿIlm al-Ḥurūf is seen as a tool for contemplation and self-reflection, not a means of predicting the future. It helps to:"}
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
            <span className="text-slate-700 dark:text-slate-300">
              {isFrench 
                ? "Comprendre les qualités spirituelles encodées dans votre nom"
                : "Understand the spiritual qualities encoded in your name"}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
            <span className="text-slate-700 dark:text-slate-300">
              {isFrench
                ? "Contempler votre nature élémentale et votre tempérament"
                : "Contemplate your elemental nature and temperament"}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
            <span className="text-slate-700 dark:text-slate-300">
              {isFrench
                ? "Découvrir les résonances avec les Noms Divins"
                : "Discover resonances with Divine Names"}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
            <span className="text-slate-700 dark:text-slate-300">
              {isFrench
                ? "Réfléchir sur votre chemin spirituel unique"
                : "Reflect on your unique spiritual path"}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// CALCULATIONS TAB
// ============================================================================

function CalculationsTab({ isFrench }: { isFrench: boolean }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          {isFrench ? 'Comment Fonctionnent les Calculs' : 'How Calculations Work'}
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {isFrench
            ? "Le système Abjad attribue une valeur numérique unique à chaque lettre arabe. Ces valeurs sont utilisées pour calculer plusieurs nombres clés."
            : "The Abjad system assigns a unique numerical value to each Arabic letter. These values are used to calculate several key numbers."}
        </p>
      </div>

      {/* Abjad System */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-5 border border-purple-200 dark:border-purple-700">
        <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
          <span className="text-2xl">🔢</span>
          {isFrench ? 'Système Abjad' : 'Abjad System'}
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          {isFrench
            ? "Valeurs des lettres de 1 à 1000:"
            : "Letter values from 1 to 1000:"}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <div className="bg-white dark:bg-slate-800 p-2 rounded">ا=1, ب=2, ج=3, د=4, ه=5</div>
          <div className="bg-white dark:bg-slate-800 p-2 rounded">و=6, ز=7, ح=8, ط=9</div>
          <div className="bg-white dark:bg-slate-800 p-2 rounded">ي=10, ك=20, ل=30, م=40</div>
          <div className="bg-white dark:bg-slate-800 p-2 rounded">ن=50, س=60, ع=70, ف=80</div>
          <div className="bg-white dark:bg-slate-800 p-2 rounded">ص=90, ق=100, ر=200, ش=300</div>
          <div className="bg-white dark:bg-slate-800 p-2 rounded">ت=400, ث=500, خ=600, ذ=700</div>
          <div className="bg-white dark:bg-slate-800 p-2 rounded">ض=800, ظ=900, غ=1000</div>
        </div>
      </div>

      {/* Key Calculations */}
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-700">
          <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
            {isFrench ? '1. Kabīr (Grand Total - الكبير)' : '1. Kabīr (Grand Total - الكبير)'}
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {isFrench
              ? "La somme de toutes les valeurs des lettres dans votre nom. Représente votre potentiel spirituel total."
              : "The sum of all letter values in your name. Represents your total spiritual potential."}
          </p>
          <div className="mt-2 bg-blue-100 dark:bg-blue-900/50 p-3 rounded text-sm">
            <strong>{isFrench ? 'Exemple:' : 'Example:'}</strong> محمد = م(40) + ح(8) + م(40) + د(4) = 92
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">
            {isFrench ? '2. Ṣaghīr (Racine Réduite - الصغير)' : '2. Ṣaghīr (Reduced Root - الصغير)'}
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {isFrench
              ? "Le Kabīr réduit à un seul chiffre (1-9). Révèle votre station spirituelle et votre chemin de destinée."
              : "The Kabīr reduced to a single digit (1-9). Reveals your spiritual station and destiny path."}
          </p>
          <div className="mt-2 bg-green-100 dark:bg-green-900/50 p-3 rounded text-sm">
            <strong>{isFrench ? 'Exemple:' : 'Example:'}</strong> 92 → 9+2 = 11 → 1+1 = 2
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-5 border border-amber-200 dark:border-amber-700">
          <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-2">
            {isFrench ? '3. Ḥadath (Valeur Élémentale - الحدث)' : '3. Ḥadath (Elemental Value - الحدث)'}
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {isFrench
              ? "Réduit modulo 9 (1-9). Détermine votre élément principal et votre tempérament."
              : "Reduced modulo 9 (1-9). Determines your primary element and temperament."}
          </p>
          <div className="mt-2 bg-amber-100 dark:bg-amber-900/50 p-3 rounded text-sm space-y-1">
            <div><strong>{isFrench ? 'Système Maghrébin:' : 'Maghribi System:'}</strong></div>
            <div>1 = 🔥 {isFrench ? 'Feu' : 'Fire'}, 2 = 🌍 {isFrench ? 'Terre' : 'Earth'}</div>
            <div>3 = 💨 {isFrench ? 'Air' : 'Air'}, 4 = 💧 {isFrench ? 'Eau' : 'Water'}</div>
          </div>
        </div>

        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-5 border border-pink-200 dark:border-pink-700">
          <h4 className="font-bold text-pink-900 dark:text-pink-100 mb-2">
            {isFrench ? '4. Distribution Élémentale des Lettres' : '4. Elemental Letter Distribution'}
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
            {isFrench
              ? "Tradition Maghrébine: 28 lettres divisées également en 4 éléments (7 par élément)"
              : "Maghribi tradition: 28 letters divided equally into 4 elements (7 per element)"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
              🔥 <strong>{isFrench ? 'Feu:' : 'Fire:'}</strong> ا ه ط م ف ش ذ
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">
              💨 <strong>{isFrench ? 'Air:' : 'Air:'}</strong> ب و ي ن ض ظ غ
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
              💧 <strong>{isFrench ? 'Eau:' : 'Water:'}</strong> ج ز ك س ق ث خ
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
              🌍 <strong>{isFrench ? 'Terre:' : 'Earth:'}</strong> د ح ل ع ر ص ت
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FAQ TAB
// ============================================================================

function FAQTab({ isFrench }: { isFrench: boolean }) {
  const faqs = [
    {
      q: isFrench ? "Est-ce de la divination?" : "Is this fortune-telling?",
      a: isFrench
        ? "Non. ʿIlm al-Ḥurūf est un outil de contemplation et de réflexion personnelle, pas de prédiction de l'avenir. C'est un moyen de comprendre les qualités spirituelles et les schémas encodés dans votre nom."
        : "No. ʿIlm al-Ḥurūf is a tool for contemplation and self-reflection, not predicting the future. It's a way to understand the spiritual qualities and patterns encoded in your name."
    },
    {
      q: isFrench ? "En quoi est-ce différent de la numérologie occidentale?" : "How is this different from Western numerology?",
      a: isFrench
        ? "ʿIlm al-Ḥurūf est enraciné dans la tradition islamique et utilise le système Abjad arabe avec 28 lettres. La numérologie occidentale utilise le système pythagoricien avec 26 lettres latines. Les approches philosophiques et spirituelles sont également différentes."
        : "ʿIlm al-Ḥurūf is rooted in Islamic tradition and uses the Arabic Abjad system with 28 letters. Western numerology uses the Pythagorean system with 26 Latin letters. The philosophical and spiritual approaches are also different."
    },
    {
      q: isFrench ? "Qu'est-ce que la tradition maghrébine?" : "What is the Maghribi tradition?",
      a: isFrench
        ? "La tradition maghrébine (Afrique du Nord/Ouest - Sénégal, Gambie, Mali, Mauritanie) a développé un système unique de classification des 28 lettres arabes en 4 éléments, avec exactement 7 lettres par élément. Ce système équilibré est basé sur les qualités thermiques et d'humidité."
        : "The Maghribi tradition (North/West Africa - Senegal, Gambia, Mali, Mauritania) developed a unique system of classifying the 28 Arabic letters into 4 elements, with exactly 7 letters per element. This balanced system is based on thermal and moisture qualities."
    },
    {
      q: isFrench ? "Que signifient les éléments?" : "What do the elements mean?",
      a: isFrench
        ? "Les quatre éléments représentent des tempéraments fondamentaux: Feu (chaud et sec) = passionné, énergique; Terre (froid et sec) = stable, pratique; Air (chaud et humide) = intellectuel, communicatif; Eau (froid et humide) = émotionnel, intuitif."
        : "The four elements represent fundamental temperaments: Fire (hot & dry) = passionate, energetic; Earth (cold & dry) = stable, practical; Air (hot & moist) = intellectual, communicative; Water (cold & moist) = emotional, intuitive."
    },
    {
      q: isFrench ? "Pourquoi mon nom a-t-il un nombre?" : "Why does my name have a number?",
      a: isFrench
        ? "Dans le système Abjad, chaque lettre arabe a une valeur numérique. Votre nom, écrit en arabe, peut être converti en nombres. Ces nombres révèlent des schémas spirituels et des qualités encodées dans votre nom."
        : "In the Abjad system, each Arabic letter has a numerical value. Your name, written in Arabic, can be converted to numbers. These numbers reveal spiritual patterns and qualities encoded in your name."
    },
    {
      q: isFrench ? "Puis-je utiliser n'importe quel nom?" : "Can I use any name?",
      a: isFrench
        ? "Oui, mais pour des résultats les plus significatifs, utilisez votre nom complet tel qu'il apparaît sur votre certificat de naissance, écrit en arabe. Vous pouvez également analyser le nom de votre mère pour voir l'influence maternelle."
        : "Yes, but for the most meaningful results, use your full name as it appears on your birth certificate, written in Arabic. You can also analyze your mother's name to see maternal influence."
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
        {isFrench ? 'Questions Fréquemment Posées' : 'Frequently Asked Questions'}
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 flex-shrink-0">Q{index + 1}:</span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-slate-700 dark:text-slate-300 pl-8">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-700">
        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          {isFrench ? 'Rappel Important' : 'Important Reminder'}
        </h3>
        <p className="text-slate-700 dark:text-slate-300">
          {isFrench
            ? "ʿIlm al-Ḥurūf est un outil de réflexion spirituelle et de contemplation personnelle. Il ne remplace pas la prière, la consultation d'érudits, ou la prise de décisions pratiques. Utilisez-le comme guide pour mieux vous comprendre."
            : "ʿIlm al-Ḥurūf is a tool for spiritual reflection and personal contemplation. It doesn't replace prayer, consulting scholars, or making practical decisions. Use it as a guide to better understand yourself."}
        </p>
      </div>
    </div>
  );
}
