/**
 * Name Destiny Glossary
 * Definitions of key terms in ʿIlm al-Ḥurūf
 */

import React from 'react';
import { BookOpen } from 'lucide-react';

interface GlossaryProps {
  language?: 'en' | 'fr';
}

export default function NameDestinyGlossary({ language = 'en' }: GlossaryProps) {
  const isFrench = language === 'fr';

  const terms = [
    {
      term: "ʿIlm al-Ḥurūf",
      arabic: "علم الحروف",
      definition: isFrench 
        ? "La Science des Lettres - discipline islamique traditionnelle étudiant la signification spirituelle et numérique des lettres arabes"
        : "The Science of Letters - traditional Islamic discipline studying the spiritual and numerical significance of Arabic letters"
    },
    {
      term: "Abjad",
      arabic: "أبجد",
      definition: isFrench
        ? "Système de valeurs numériques pour les lettres arabes, utilisé depuis l'époque préislamique"
        : "Numerical value system for Arabic letters, used since pre-Islamic times"
    },
    {
      term: "Kabīr",
      arabic: "الكبير",
      definition: isFrench
        ? "Grand Total - la somme de toutes les valeurs des lettres dans un nom"
        : "Grand Total - the sum of all letter values in a name"
    },
    {
      term: "Ṣaghīr",
      arabic: "الصغير",
      definition: isFrench
        ? "Racine Réduite - le Kabīr réduit à un seul chiffre (1-9), révélant la station spirituelle"
        : "Reduced Root - the Kabīr reduced to a single digit (1-9), revealing the spiritual station"
    },
    {
      term: "Ḥadath",
      arabic: "الحدث",
      definition: isFrench
        ? "Valeur Élémentale - nombre réduit modulo 9 déterminant l'élément et le tempérament principal"
        : "Elemental Value - number reduced modulo 9 determining primary element and temperament"
    },
    {
      term: "Maghribi",
      arabic: "مغربي",
      definition: isFrench
        ? "Tradition d'Afrique du Nord/Ouest qui classe 28 lettres en 4 éléments (7 par élément)"
        : "North/West African tradition that classifies 28 letters into 4 elements (7 per element)"
    },
    {
      term: "Al-Ḥurūf al-Muqaṭṭaʿa",
      arabic: "الحروف المقطعة",
      definition: isFrench
        ? "Lettres mystérieuses au début de certaines sourates coraniques (comme Alif-Lām-Mīm)"
        : "Mysterious letters at the beginning of certain Qur'anic surahs (like Alif-Lām-Mīm)"
    },
    {
      term: "Temperament",
      arabic: "المزاج",
      definition: isFrench
        ? "Nature personnelle déterminée par l'équilibre des quatre éléments (Feu, Terre, Air, Eau)"
        : "Personal nature determined by the balance of four elements (Fire, Earth, Air, Water)"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          {isFrench ? "Glossaire de ʿIlm al-Ḥurūf" : "ʿIlm al-Ḥurūf Glossary"}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {isFrench 
            ? "Termes clés de la Science des Lettres" 
            : "Key terms in the Science of Letters"}
        </p>
      </div>

      <div className="grid gap-4">
        {terms.map((item, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {item.term}
                  <span className="text-purple-600 dark:text-purple-400 font-arabic ml-3 text-lg">
                    {item.arabic}
                  </span>
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {item.definition}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-700">
        <p className="text-sm text-blue-900 dark:text-blue-100 text-center">
          {isFrench
            ? "Ces termes sont utilisés tout au long de votre analyse de destinée nominale"
            : "These terms are used throughout your name destiny analysis"}
        </p>
      </div>
    </div>
  );
}
