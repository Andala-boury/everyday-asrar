import React, { useState } from 'react';
import { Users, Calculator } from 'lucide-react';

interface RelationshipInputFormProps {
  onCalculate: (
    person1Name: string,
    person1Arabic: string,
    person2Name: string,
    person2Arabic: string
  ) => void;
  language?: 'en' | 'fr' | 'ar';
}

export function RelationshipInputForm({ onCalculate, language = 'en' }: RelationshipInputFormProps) {
  const isFrench = language === 'fr';
  const [person1Name, setPerson1Name] = useState('');
  const [person1Arabic, setPerson1Arabic] = useState('');
  const [person2Name, setPerson2Name] = useState('');
  const [person2Arabic, setPerson2Arabic] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!person1Arabic.trim() || !person2Arabic.trim()) {
      alert(isFrench 
        ? 'Veuillez entrer les noms arabes pour les deux personnes' 
        : 'Please enter Arabic names for both people');
      return;
    }
    
    onCalculate(
      person1Name || person1Arabic,
      person1Arabic,
      person2Name || person2Arabic,
      person2Arabic
    );
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg">
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Users className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isFrench ? 'Entrez Deux Noms' : 'Enter Two Names'}
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isFrench 
            ? 'Calculez la compatibilité en utilisant la numérologie islamique traditionnelle'
            : 'Calculate compatibility using traditional Islamic numerology'}
        </p>
      </div>
      
      {/* Person 1 */}
      <div className="space-y-3 p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
        <h4 className="font-semibold text-indigo-900 dark:text-indigo-300">
          {isFrench ? 'Personne 1' : 'Person 1'}
        </h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isFrench ? "Nom d'Affichage (Optionnel)" : 'Display Name (Optional)'}
          </label>
          <input
            type="text"
            value={person1Name}
            onChange={(e) => setPerson1Name(e.target.value)}
            placeholder={isFrench ? 'ex: Ahmed' : 'e.g., Ahmed'}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isFrench ? 'Nom Arabe (Requis)' : 'Arabic Name (Required)'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={person1Arabic}
            onChange={(e) => setPerson1Arabic(e.target.value)}
            placeholder="أحمد"
            dir="rtl"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      {/* Person 2 */}
      <div className="space-y-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
        <h4 className="font-semibold text-purple-900 dark:text-purple-300">
          {isFrench ? 'Personne 2' : 'Person 2'}
        </h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isFrench ? "Nom d'Affichage (Optionnel)" : 'Display Name (Optional)'}
          </label>
          <input
            type="text"
            value={person2Name}
            onChange={(e) => setPerson2Name(e.target.value)}
            placeholder={isFrench ? 'ex: Fatima' : 'e.g., Fatima'}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isFrench ? 'Nom Arabe (Requis)' : 'Arabic Name (Required)'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={person2Arabic}
            onChange={(e) => setPerson2Arabic(e.target.value)}
            placeholder="فاطمة"
            dir="rtl"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      
      {/* Calculate Button */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all"
      >
        <Calculator className="w-5 h-5" />
        {isFrench ? 'Calculer la Compatibilité' : 'Calculate Compatibility'}
      </button>
      
    </form>
  );
}
