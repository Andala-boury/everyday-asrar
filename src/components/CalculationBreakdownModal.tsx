'use client';

import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PersonCalculation {
  name: string;
  arabicName: string;
  abjadTotal: number;
  hadath: number;
  element: string;
  elementArabic: string;
  elementFrench: string;
  letterBreakdown?: Array<{ letter: string; value: number }>;
}

interface CalculationBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  person1: PersonCalculation;
  person2: PersonCalculation;
  person1Mother?: PersonCalculation;
  person2Mother?: PersonCalculation;
  layers: {
    layer1?: { percentage: number; score: number };
    layer2?: { percentage: number; score: number };
    layer3?: { percentage: number; score: number };
    layer4?: { percentage: number; score: number };
  };
  overallScore: number;
}

export function CalculationBreakdownModal({
  isOpen,
  onClose,
  person1,
  person2,
  person1Mother,
  person2Mother,
  layers,
  overallScore
}: CalculationBreakdownModalProps) {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  const PersonCard = ({ person, title }: { person: PersonCalculation; title: string }) => (
    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-700">
      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3">{title}</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            {language === 'fr' ? 'Nom:' : 'Name:'}
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {person.name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            {language === 'fr' ? 'Nom arabe:' : 'Arabic Name:'}
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100 font-arabic">
            {person.arabicName}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
          <span className="text-gray-600 dark:text-gray-400">
            {language === 'fr' ? 'Total Abjad (Ḥadath):' : 'Abjad Total (Ḥadath):'}
          </span>
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {person.abjadTotal}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            {language === 'fr' ? 'Ḥadath ÷ 4 =':'Ḥadath ÷ 4 ='}
          </span>
          <span className="font-mono text-gray-900 dark:text-gray-100">
            {person.abjadTotal} ÷ 4 = {Math.floor(person.abjadTotal / 4)} <span className="text-purple-600 dark:text-purple-400 font-bold">r{person.hadath}</span>
          </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-purple-50 dark:bg-purple-950/30 rounded">
          <span className="text-gray-600 dark:text-gray-400">
            {language === 'fr' ? 'Élément:' : 'Element:'}
          </span>
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {language === 'fr' ? person.elementFrench : person.element}
            <span className="ml-2 text-purple-600 dark:text-purple-400 font-arabic">
              {person.elementArabic}
            </span>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {t.fourLayerCompatibility.calculationBreakdown}
              </h2>
              <p className="text-indigo-100 text-sm">
                {t.fourLayerCompatibility.calculationBreakdownArabic}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close calculation details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)] space-y-6">
          
          {/* Step 1: Person Calculations */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold">1</span>
              {language === 'fr' ? t.fourLayerCompatibility.step1 : t.fourLayerCompatibility.step1}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PersonCard 
                person={person1} 
                title={`${person1.name} ${language === 'fr' ? '(Personne 1)' : '(Person 1)'}`}
              />
              <PersonCard 
                person={person2} 
                title={`${person2.name} ${language === 'fr' ? '(Personne 2)' : '(Person 2)'}`}
              />
            </div>
          </div>

          {/* Step 2: Mother Calculations (if available) */}
          {(person1Mother || person2Mother) && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white text-sm font-bold">2</span>
                {language === 'fr' ? 'Calculs des mères (Tempérament Cosmique)' : "Mothers' Calculations (Cosmic Temperament)"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {person1Mother && (
                  <PersonCard 
                    person={person1Mother} 
                    title={`${language === 'fr' ? 'Mère de' : 'Mother of'} ${person1.name}`}
                  />
                )}
                {person2Mother && (
                  <PersonCard 
                    person={person2Mother} 
                    title={`${language === 'fr' ? 'Mère de' : 'Mother of'} ${person2.name}`}
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 3: Layer Scores */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-600 text-white text-sm font-bold">3</span>
              {language === 'fr' ? 'Calcul des couches de compatibilité' : 'Layer Compatibility Calculations'}
            </h3>
            <div className="space-y-3">
              {layers.layer1 && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border-l-4 border-indigo-600">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {language === 'fr' ? 'Couche 1: Vie quotidienne' : 'Layer 1: Daily Life'}
                    </span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {layers.layer1.percentage}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {language === 'fr' ? 'Poids: 30%' : 'Weight: 30%'}
                  </p>
                </div>
              )}
              {layers.layer2 && (
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-l-4 border-purple-600">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {language === 'fr' ? 'Couche 2: Fondation émotionnelle' : 'Layer 2: Emotional Foundation'}
                    </span>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {layers.layer2.percentage}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {language === 'fr' ? 'Poids: 40% (LE PLUS IMPORTANT)' : 'Weight: 40% (MOST IMPORTANT)'}
                  </p>
                </div>
              )}
              {layers.layer3 && (
                <div className="p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border-l-4 border-cyan-600">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {language === 'fr' ? 'Couche 3: Dynamique croisée' : 'Layer 3: Cross Dynamic'}
                    </span>
                    <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                      {layers.layer3.percentage}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {language === 'fr' ? 'Poids: 15%' : 'Weight: 15%'}
                  </p>
                </div>
              )}
              {layers.layer4 && (
                <div className="p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg border-l-4 border-teal-600">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {language === 'fr' ? 'Couche 4: Dynamique croisée' : 'Layer 4: Cross Dynamic'}
                    </span>
                    <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                      {layers.layer4.percentage}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {language === 'fr' ? 'Poids: 15%' : 'Weight: 15%'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step 4: Overall Score Formula */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white text-sm font-bold">4</span>
              {language === 'fr' ? 'Score global pondéré' : 'Weighted Overall Score'}
            </h3>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border-2 border-green-300 dark:border-green-700">
              <div className="font-mono text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-3">
                {layers.layer1 && <div>L1 ({layers.layer1.percentage}%) × 0.30 = {(layers.layer1.percentage * 0.30).toFixed(1)}</div>}
                {layers.layer2 && <div>L2 ({layers.layer2.percentage}%) × 0.40 = {(layers.layer2.percentage * 0.40).toFixed(1)}</div>}
                {layers.layer3 && <div>L3 ({layers.layer3.percentage}%) × 0.15 = {(layers.layer3.percentage * 0.15).toFixed(1)}</div>}
                {layers.layer4 && <div>L4 ({layers.layer4.percentage}%) × 0.15 = {(layers.layer4.percentage * 0.15).toFixed(1)}</div>}
                <div className="pt-2 border-t-2 border-green-400 dark:border-green-600 font-bold text-base">
                  {language === 'fr' ? 'Score Total' : 'Total Score'} = {overallScore}%
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t.fourLayerCompatibility.weightingExplanation}
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-100 dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors"
          >
            {language === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
