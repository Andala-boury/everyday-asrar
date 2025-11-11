'use client';

import React, { useState } from 'react';
import { getPlanetGuide, getAllPlanetNames } from '../../../data/planetGuides';

interface PlanetGuidePanelProps {
  selectedPlanet?: string;
  currentLanguage: 'en' | 'fr';
}

export default function PlanetGuidePanel({
  selectedPlanet = 'Sun',
  currentLanguage = 'en',
}: PlanetGuidePanelProps) {
  const [activePlanet, setActivePlanet] = useState(selectedPlanet);
  const [activeTab, setActiveTab] = useState<'overview' | 'spiritual' | 'practical' | 'sources'>('overview');
  
  const planetNames = getAllPlanetNames();
  const guide = getPlanetGuide(activePlanet);

  if (!guide) return null;

  const lang = currentLanguage;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Planet Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {planetNames.map((planetName) => (
          <button
            key={planetName}
            onClick={() => setActivePlanet(planetName)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activePlanet === planetName
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {planetName}
          </button>
        ))}
      </div>

      {/* Planet Header */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {guide.name}
            </h1>
            <div className="text-3xl text-indigo-600 dark:text-indigo-400 mb-1">
              {guide.nameArabic}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400 italic">
              {guide.nameTransliteration}
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'en' ? 'Element:' : 'Élément:'}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full text-sm font-semibold">
                {guide.element}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'en' ? 'Day:' : 'Jour:'}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full text-sm font-semibold">
                {guide.day}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'en' ? 'Metal:' : 'Métal:'}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full text-sm font-semibold">
                {guide.metal}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'overview', label: lang === 'en' ? 'Overview' : 'Aperçu' },
          { id: 'spiritual', label: lang === 'en' ? 'Spiritual Wisdom' : 'Sagesse Spirituelle' },
          { id: 'practical', label: lang === 'en' ? 'Practical Guide' : 'Guide Pratique' },
          { id: 'sources', label: lang === 'en' ? 'Classical Sources' : 'Sources Classiques' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === tab.id
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Divine Names Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {lang === 'en' ? 'Primary Divine Name' : 'Nom Divin Principal'}
              </h2>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6">
                <div className="text-4xl text-center mb-2">{guide.divineNames.primary.arabic}</div>
                <div className="text-xl text-center text-indigo-600 dark:text-indigo-400 mb-3">
                  {guide.divineNames.primary.transliteration}
                </div>
                <div className="text-center text-gray-700 dark:text-gray-300 mb-4">
                  {guide.divineNames.primary.meaning[lang]}
                </div>
                <div className="flex justify-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {lang === 'en' ? 'Position:' : 'Position:'}
                    </span>
                    <span className="ml-2 font-semibold">#{guide.divineNames.primary.number}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {lang === 'en' ? 'Recommended Dhikr:' : 'Dhikr Recommandé:'}
                    </span>
                    <span className="ml-2 font-semibold">{guide.divineNames.primary.dhikrCount}x</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Divine Names */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {lang === 'en' ? 'Related Divine Names' : 'Noms Divins Associés'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {guide.divineNames.secondary.map((name, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl mb-1">{name.arabic}</div>
                    <div className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">
                      {name.transliteration}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {name.meaning[lang]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Islamic History */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {lang === 'en' ? 'Islamic Historical Context' : 'Contexte Historique Islamique'}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {guide.islamicHistory[lang]}
              </p>
            </div>
          </div>
        )}

        {/* Spiritual Tab */}
        {activeTab === 'spiritual' && (
          <div className="space-y-8">
            {/* Spiritual Qualities */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {lang === 'en' ? 'Spiritual Qualities' : 'Qualités Spirituelles'}
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {guide.spiritualQualities[lang].map((quality, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span className="text-gray-900 dark:text-white font-medium">{quality}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Concepts */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {lang === 'en' ? 'Related Spiritual Concepts' : 'Concepts Spirituels Associés'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {guide.relatedConcepts[lang].map((concept, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Examples */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {lang === 'en' ? 'Spiritual Examples' : 'Exemples Spirituels'}
              </h3>
              <div className="space-y-3">
                {guide.examples[lang].map((example, index) => (
                  <div key={index} className="flex gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="text-indigo-600 dark:text-indigo-400 font-bold">{index + 1}.</div>
                    <p className="text-gray-700 dark:text-gray-300">{example}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Practical Tab */}
        {activeTab === 'practical' && (
          <div className="space-y-8">
            {/* Favorable Activities */}
            <div>
              <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">
                ✓ {lang === 'en' ? 'Favorable Activities' : 'Activités Favorables'}
              </h2>
              <div className="space-y-2">
                {guide.favorableFor[lang].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-4"
                  >
                    <div className="text-green-600 dark:text-green-400 text-xl">✓</div>
                    <span className="text-gray-900 dark:text-white">{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unfavorable Activities */}
            <div>
              <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-4">
                ✗ {lang === 'en' ? 'Activities to Avoid' : 'Activités à Éviter'}
              </h2>
              <div className="space-y-2">
                {guide.unfavorableFor[lang].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4"
                  >
                    <div className="text-orange-600 dark:text-orange-400 text-xl">✗</div>
                    <span className="text-gray-900 dark:text-white">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sources Tab */}
        {activeTab === 'sources' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {lang === 'en' ? 'Classical Teachings' : 'Enseignements Classiques'}
            </h2>
            {guide.classicalTeachings.map((teaching, index) => (
              <div key={index} className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-6 py-4">
                <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-3">
                  "{teaching.quote}"
                </blockquote>
                <div className="space-y-1 text-sm">
                  <div className="text-gray-900 dark:text-white font-semibold">
                    — {teaching.scholar}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {lang === 'en' ? 'Source:' : 'Source:'} {teaching.source}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mt-2">
                    {teaching.context[lang]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
