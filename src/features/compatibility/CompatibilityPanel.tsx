import React, { useState } from 'react';
import { CompatibilityMode, RelationshipCompatibility } from '../../types/compatibility';
import { CompatibilityModeSwitcher } from '../../components/CompatibilityModeSwitcher';
import { RelationshipInputForm } from '../../components/RelationshipInputForm';
import { RelationshipCompatibilityView } from '../../components/RelationshipCompatibilityView';
import { analyzeRelationshipCompatibility, getElementFromAbjadTotal } from '../../utils/relationshipCompatibility';
import { useAbjad } from '../../contexts/AbjadContext';

// Helper to calculate Abjad total from Arabic text
function calculateAbjadTotal(text: string, abjadMap: Record<string, number>): number {
  const normalized = text.replace(/[ًٌٍَُِّْ\s]/g, '');
  return [...normalized].reduce((sum, char) => sum + (abjadMap[char] || 0), 0);
}

interface CompatibilityPanelProps {
  onBack?: () => void;
}

export function CompatibilityPanel({ onBack }: CompatibilityPanelProps) {
  const [mode, setMode] = useState<CompatibilityMode>('relationship');
  const [relationshipResult, setRelationshipResult] = useState<RelationshipCompatibility | null>(null);
  const { abjad } = useAbjad();
  
  const handleRelationshipCalculate = (
    person1Name: string,
    person1Arabic: string,
    person2Name: string,
    person2Arabic: string
  ) => {
    try {
      // Calculate Abjad totals using the context map
      const person1Total = calculateAbjadTotal(person1Arabic, abjad);
      const person2Total = calculateAbjadTotal(person2Arabic, abjad);
      
      // Determine elements
      const person1Element = getElementFromAbjadTotal(person1Total);
      const person2Element = getElementFromAbjadTotal(person2Total);
      
      // Analyze compatibility
      const result = analyzeRelationshipCompatibility(
        person1Name,
        person1Arabic,
        person1Total,
        person1Element,
        person2Name,
        person2Arabic,
        person2Total,
        person2Element
      );
      
      setRelationshipResult(result);
    } catch (error) {
      console.error('Error calculating compatibility:', error);
      alert('Error calculating compatibility. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-2"
          >
            ← Back
          </button>
        )}
        
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            💫 Compatibility Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore relationship harmony through Islamic numerology
          </p>
        </div>
        
        {/* Mode Switcher */}
        <CompatibilityModeSwitcher 
          currentMode={mode}
          onModeChange={(newMode) => {
            setMode(newMode);
            setRelationshipResult(null);
          }}
        />
        
        {/* Relationship Mode - Main Content */}
        <div className="space-y-6">
          
          {/* Input Form */}
          {!relationshipResult && (
            <RelationshipInputForm onCalculate={handleRelationshipCalculate} />
          )}
          
          {/* Results */}
          {relationshipResult && (
            <>
              <RelationshipCompatibilityView 
                compatibility={relationshipResult}
                language="en"
              />
              
              {/* Calculate Again Button */}
              <button
                onClick={() => setRelationshipResult(null)}
                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors"
              >
                Calculate Another Pair
              </button>
            </>
          )}
          
        </div>
        
      </div>
    </div>
  );
}
