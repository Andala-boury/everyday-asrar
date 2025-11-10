// HadadSummaryPanel.tsx - Main React component

import React from 'react';
import { HadadSummaryProps, AuditStep, ElementType } from './types';
import {
  digitalRoot,
  hadathRemainder,
  hadathToElement,
  signatureReduce,
  ruhHadad,
  withMother,
  nearestSacred,
  sacredSignificance,
  ELEMENT_INFO,
  ASMA_LIST,
  VERSES_BY_ELEMENT,
  getGuidanceText,
  generateMagicGrid
} from './hadad-core';

export const HadadSummaryPanel: React.FC<HadadSummaryProps> = ({
  audit,
  motherAudit,
  taMarbutaMode = 'ه',
  showGrid = true,
  showResonance = true,
  onCopyJson
}) => {
  // Calculate all derived values
  const kabir = audit.total;
  const saghir = digitalRoot(kabir);
  const hadath = hadathRemainder(kabir);
  const hadathElement = hadathToElement(hadath);
  const signature = signatureReduce(audit.steps);
  const ruh = ruhHadad(kabir);
  const umHadad = motherAudit ? withMother(kabir, motherAudit.total) : null;
  const sacred = showResonance ? nearestSacred(kabir) : null;
  
  // Element distribution
  const elementCounts: Record<ElementType, number> = {
    Fire: 0,
    Water: 0,
    Air: 0,
    Earth: 0
  };
  
  audit.steps.forEach(step => {
    elementCounts[step.element]++;
  });
  
  const sortedElements = (Object.entries(elementCounts) as [ElementType, number][])
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);
  
  const dominantElement = sortedElements[0]?.[0] || 'Earth';
  const secondaryElement = sortedElements[1]?.[0];
  
  // Get celestial info
  const elementInfo = ELEMENT_INFO[dominantElement];
  
  // Get relevant Asma'
  const primaryNames = ASMA_LIST.filter(n => n.element === dominantElement).slice(0, 2);
  const balanceElement = dominantElement === 'Fire' ? 'Water' : dominantElement === 'Water' ? 'Fire' : 'Air';
  const balanceNames = ASMA_LIST.filter(n => n.element === balanceElement).slice(0, 1);
  
  // Suggested counts
  const suggestedCounts = [33, 66, 99, kabir % 99 || 99].filter((v, i, a) => a.indexOf(v) === i);
  
  // Copy JSON handler
  const handleCopyJson = () => {
    const payload = {
      audit,
      motherAudit,
      calculations: {
        kabir,
        saghir,
        hadath,
        hadathElement,
        signature,
        ruh,
        umHadad,
        sacred,
        elementCounts,
        dominantElement,
        secondaryElement
      },
      taMarbutaMode,
      timestamp: new Date().toISOString()
    };
    
    if (onCopyJson) {
      onCopyJson(payload);
    } else {
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    }
  };
  
  const magicGrid = showGrid ? generateMagicGrid(kabir) : null;
  
  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs text-amber-900 dark:text-amber-100">
        <strong>Educational & Traditional:</strong> This analysis is for cultural exploration and reflection only. 
        Not for predictions, rulings, medical, or financial decisions. Always consult qualified scholars for religious guidance.
      </div>
      
      {/* Calculation Breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Calculation Breakdown</h3>
          <button
            onClick={handleCopyJson}
            className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
          >
            Copy JSON
          </button>
        </div>
        
        {/* Audit chips */}
        <div className="mb-4">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Per-Letter Values:</div>
          <div className="flex flex-wrap gap-2" dir="rtl">
            {audit.steps.map((step, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg border ${ELEMENT_INFO[step.element].bg} ${ELEMENT_INFO[step.element].color} border-current/20`}
                title={`${step.element} element`}
              >
                <span className="font-arabic text-lg">{step.ch}</span>
                <span className="mx-1">:</span>
                <span className="font-bold">{step.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Total equation */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 mb-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total (Kabīr):</div>
          <div className="font-mono text-slate-900 dark:text-slate-100">
            {audit.steps.map(s => s.value).join(' + ')} = <strong className="text-indigo-600 dark:text-indigo-400">{kabir}</strong>
          </div>
        </div>
        
        {/* Signature line */}
        <div className="mb-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Signature Sequence (Digital Roots):</div>
          <div className="font-mono text-slate-900 dark:text-slate-100">
            {signature.join(' – ')}
          </div>
        </div>
        
        {/* Element counts */}
        <div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Element Distribution:</div>
          <div className="flex flex-wrap gap-2">
            {sortedElements.map(([element, count]) => (
              <div
                key={element}
                className={`px-3 py-1 rounded-lg ${ELEMENT_INFO[element].bg} ${ELEMENT_INFO[element].color} text-sm`}
              >
                {ELEMENT_INFO[element].icon} {element} ×{count}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">Kabīr (Full Sum)</div>
          <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">{kabir}</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Ṣaghīr (Root)</div>
          <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{saghir}</div>
        </div>
        
        <div className={`bg-gradient-to-br rounded-xl p-4 border ${ELEMENT_INFO[hadathElement].bg} ${ELEMENT_INFO[hadathElement].color} border-current/20`}>
          <div className="text-xs font-medium mb-1 opacity-80">Ḥadath (÷4)</div>
          <div className="text-2xl font-bold">{hadath} → {hadathElement}</div>
          <div className="text-xs opacity-60">{ELEMENT_INFO[hadathElement].icon}</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Rūḥ Ḥadad</div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{ruh.value}</div>
          <div className="text-xs text-purple-700 dark:text-purple-300">Root: {ruh.root} • {ruh.element}</div>
        </div>
      </div>
      
      {/* Um Hadad (if present) */}
      {umHadad && (
        <div className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-rose-200 dark:border-rose-800">
          <h4 className="text-sm font-bold text-rose-900 dark:text-rose-100 mb-2">
            Um Ḥadad (Combined with Mother)
          </h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-rose-600 dark:text-rose-400">Total</div>
              <div className="text-xl font-bold text-rose-900 dark:text-rose-100">{umHadad.total}</div>
            </div>
            <div>
              <div className="text-xs text-rose-600 dark:text-rose-400">Root</div>
              <div className="text-xl font-bold text-rose-900 dark:text-rose-100">{umHadad.root}</div>
            </div>
            <div>
              <div className="text-xs text-rose-600 dark:text-rose-400">Element</div>
              <div className="text-lg font-bold text-rose-900 dark:text-rose-100">{umHadad.hadath}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Sacred Resonance */}
      {sacred && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-3">Sacred Number Resonance</h4>
          
          {sacred.delta === 0 ? (
            <div className="text-lg text-amber-900 dark:text-amber-100">
              ✨ <strong>Exact match: {sacred.nearest}</strong> × {sacredSignificance[sacred.nearest]}
            </div>
          ) : (
            <div className="text-sm text-amber-800 dark:text-amber-200">
              Nearest sacred: <strong>{sacred.nearest}</strong> (Δ {sacred.delta > 0 ? '+' : ''}{sacred.delta})
              <div className="text-xs mt-1">{sacredSignificance[sacred.nearest]}</div>
            </div>
          )}
          
          <div className="flex gap-3 mt-3 text-xs">
            <div className={`px-2 py-1 rounded ${sacred.div7 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
              ÷7: {sacred.div7 ? '✓' : '✗'}
            </div>
            <div className={`px-2 py-1 rounded ${sacred.div19 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
              ÷19: {sacred.div19 ? '✓' : '✗'}
            </div>
            <div className={`px-2 py-1 rounded ${sacred.div99 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
              ÷99: {sacred.div99 ? '✓' : '✗'}
            </div>
          </div>
        </div>
      )}
      
      {/* Celestial Signature */}
      <div className={`rounded-xl p-4 border ${elementInfo.bg} ${elementInfo.color} border-current/20`}>
        <h4 className="text-sm font-bold mb-3 opacity-90">Celestial Signature</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs opacity-60">Planet</div>
            <div className="font-bold">{elementInfo.planet}</div>
          </div>
          <div>
            <div className="text-xs opacity-60">Day</div>
            <div className="font-bold">{elementInfo.day}</div>
          </div>
          <div>
            <div className="text-xs opacity-60">Best Hours</div>
            <div className="font-bold">{elementInfo.hours.join(', ')}</div>
          </div>
        </div>
      </div>
      
      {/* Guidance */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Reflections & Guidance</h4>
        <p className="text-sm text-slate-700 dark:text-slate-300 italic">
          {getGuidanceText(dominantElement, saghir)}
        </p>
      </div>
      
      {/* Related Verses */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Related Quranic Verses</h4>
        <div className="space-y-2">
          {VERSES_BY_ELEMENT[dominantElement].map((verse, i) => (
            <div key={i} className="text-sm bg-slate-50 dark:bg-slate-900 rounded p-2">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{verse.ref}</div>
              <div className="mb-1">{verse.text}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{verse.context}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Asma' Suggestions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Asmā' al-Ḥusnā Suggestions</h4>
        
        <div className="mb-4">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">Suggested Counts:</div>
          <div className="flex gap-2 flex-wrap">
            {suggestedCounts.map(count => (
              <div key={count} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-sm font-bold">
                {count}×
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Based on: 33 (base), 66 (double), 99 (Ḥusnā), {kabir % 99 || 99} (Kabīr mod 99)
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Primary Support ({dominantElement}):</div>
            {primaryNames.map((name, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded p-3 mb-2">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-lg font-arabic" dir="rtl">{name.ar}</span>
                  <span className="text-xs text-slate-500">{name.transliteration}</span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">{name.en}</div>
                <div className="text-xs text-slate-500">Counts: {name.counts.join(', ')}</div>
              </div>
            ))}
          </div>
          
          {balanceNames.length > 0 && (
            <div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">For Balance ({balanceElement}):</div>
              {balanceNames.map((name, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded p-3">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-lg font-arabic" dir="rtl">{name.ar}</span>
                    <span className="text-xs text-slate-500">{name.transliteration}</span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">{name.en}</div>
                  <div className="text-xs text-slate-500">Counts: {name.counts.join(', ')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Magic Grid */}
      {magicGrid && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Magic Grid</h4>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 italic">
            Educational display only × Sequential grid starting from Kabīr ({kabir})
          </div>
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {magicGrid.map((row, i) => (
              row.map((num, j) => (
                <div
                  key={`${i}-${j}`}
                  className="aspect-square flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded font-bold text-slate-700 dark:text-slate-300"
                >
                  {num}
                </div>
              ))
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HadadSummaryPanel;
