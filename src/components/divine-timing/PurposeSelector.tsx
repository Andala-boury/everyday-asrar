'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Briefcase, 
  Moon, 
  MessageCircle, 
  BookOpen, 
  DollarSign, 
  Heart,
  LucideIcon
} from 'lucide-react';
import type { UserPurpose } from './DivineTiming';

interface PurposeSelectorProps {
  onSelectPurpose: (purpose: UserPurpose) => void;
}

export function PurposeSelector({ onSelectPurpose }: PurposeSelectorProps) {
  const { language } = useLanguage();
  
  const purposes: Array<{
    id: UserPurpose;
    icon: LucideIcon;
    titleEn: string;
    titleFr: string;
    emoji: string;
    color: string;
  }> = [
    {
      id: 'work',
      icon: Briefcase,
      titleEn: 'Work & Projects',
      titleFr: 'Travail & Projets',
      emoji: '💼',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'prayer',
      icon: Moon,
      titleEn: 'Reflection & Prayer',
      titleFr: 'Réflexion & Prière',
      emoji: '🌙',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'conversation',
      icon: MessageCircle,
      titleEn: 'Important Conversations',
      titleFr: 'Conversations Importantes',
      emoji: '💬',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'learning',
      icon: BookOpen,
      titleEn: 'Learning & Study',
      titleFr: 'Apprentissage & Étude',
      emoji: '📚',
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'finance',
      icon: DollarSign,
      titleEn: 'Financial Decisions',
      titleFr: 'Décisions Financières',
      emoji: '💰',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'relationships',
      icon: Heart,
      titleEn: 'Relationships',
      titleFr: 'Relations',
      emoji: '❤️',
      color: 'from-rose-500 to-pink-600'
    }
  ];
  
  // Helper function to get gradient colors
  const getGradientColors = (id: UserPurpose): { from: string; to: string } => {
    const colorMap: Record<UserPurpose, { from: string; to: string }> = {
      work: { from: '#3b82f6', to: '#4f46e5' },          // blue-500 to indigo-600
      prayer: { from: '#a855f7', to: '#ec4899' },        // purple-500 to pink-600
      conversation: { from: '#22c55e', to: '#059669' },  // green-500 to emerald-600
      learning: { from: '#f59e0b', to: '#ea580c' },      // amber-500 to orange-600
      finance: { from: '#10b981', to: '#0d9488' },       // emerald-500 to teal-600
      relationships: { from: '#f43f5e', to: '#ec4899' }  // rose-500 to pink-600
    };
    return colorMap[id];
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          {language === 'fr' 
            ? 'Sur quoi avez-vous besoin de guidage ?'
            : 'What do you need guidance on?'}
        </h2>
        <p className="text-base font-medium text-slate-700">
          {language === 'fr'
            ? 'Sélectionnez un domaine pour des conseils personnalisés'
            : 'Select an area for personalized advice'}
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {purposes.map((purpose) => {
          const Icon = purpose.icon;
          return (
            <button
              key={purpose.id}
              onClick={() => onSelectPurpose(purpose.id)}
              className="group relative overflow-hidden rounded-2xl p-6 md:p-8 bg-white border-2 border-slate-200 hover:border-indigo-400 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              {/* Gradient background on hover only */}
              <div className={`absolute inset-0 bg-gradient-to-br ${purpose.color} opacity-0 group-hover:opacity-15 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-center">
                  <div 
                    className="p-4 rounded-xl shadow-xl group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(to bottom right, ${getGradientColors(purpose.id).from}, ${getGradientColors(purpose.id).to})`
                    }}
                  >
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-bold text-base md:text-lg text-slate-900 leading-tight">
                    {language === 'fr' ? purpose.titleFr : purpose.titleEn}
                  </p>
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>
          );
        })}
      </div>
      
      {/* Optional: Skip button */}
      <div className="text-center pt-2">
        <button 
          onClick={() => onSelectPurpose(null)}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 underline decoration-2 underline-offset-4 hover:decoration-indigo-500 transition-colors"
        >
          {language === 'fr' ? 'Passer pour le moment' : 'Skip for now'}
        </button>
      </div>
    </div>
  );
}
