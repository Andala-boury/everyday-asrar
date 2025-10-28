// Quick test to verify the element mapping fix for ح
import { LETTER_ELEMENTS } from './src/components/hadad-summary/hadad-core';

const testName = 'محمد'; // Muhammad
const letters = ['م', 'ح', 'م', 'د'];
const values = [40, 8, 40, 4];

console.log('═══════════════════════════════════════════════════════════');
console.log('TEST: Muhammad (محمد) Element Distribution Fix');
console.log('═══════════════════════════════════════════════════════════\n');

const elementCounts = { Fire: 0, Water: 0, Air: 0, Earth: 0 };

letters.forEach((letter, idx) => {
  const element = LETTER_ELEMENTS[letter];
  const value = values[idx];
  
  console.log(`Letter: ${letter} (value: ${value}) → Element: ${element}`);
  
  if (element && element in elementCounts) {
    elementCounts[element as keyof typeof elementCounts]++;
  }
});

console.log('\n───────────────────────────────────────────────────────────');
console.log('ELEMENT DISTRIBUTION:');
console.log('───────────────────────────────────────────────────────────');
console.log(`🔥 Fire:   ${elementCounts.Fire} letters`);
console.log(`💧 Water:  ${elementCounts.Water} letters`);
console.log(`🌬️  Air:    ${elementCounts.Air} letters`);
console.log(`🌍 Earth:  ${elementCounts.Earth} letters`);

console.log('\n───────────────────────────────────────────────────────────');
console.log('EXPECTED vs ACTUAL:');
console.log('───────────────────────────────────────────────────────────');

const expected = { Fire: 2, Water: 0, Air: 0, Earth: 2 };
const tests = [
  { element: 'Fire', expected: expected.Fire, actual: elementCounts.Fire },
  { element: 'Water', expected: expected.Water, actual: elementCounts.Water },
  { element: 'Air', expected: expected.Air, actual: elementCounts.Air },
  { element: 'Earth', expected: expected.Earth, actual: elementCounts.Earth },
];

let allPassed = true;
tests.forEach(test => {
  const passed = test.expected === test.actual;
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${test.element}: expected ${test.expected}, got ${test.actual}`);
  if (!passed) allPassed = false;
});

console.log('\n═══════════════════════════════════════════════════════════');
if (allPassed) {
  console.log('✅ ALL TESTS PASSED - Element distribution is now CORRECT!');
} else {
  console.log('❌ TESTS FAILED - There are still issues');
}
console.log('═══════════════════════════════════════════════════════════\n');

// Verify ح mapping specifically
console.log('LETTER MAPPING VERIFICATION:');
console.log(`ح (Ha) is now mapped to: ${LETTER_ELEMENTS['ح']}`);
console.log(`Expected: Earth`);
console.log(`Match: ${LETTER_ELEMENTS['ح'] === 'Earth' ? '✅ YES' : '❌ NO'}\n`);

// Count all letters
console.log('FULL LETTER DISTRIBUTION (All 28 Arabic Letters):');
console.log('───────────────────────────────────────────────────────────');
const allElements = { Fire: 0, Water: 0, Air: 0, Earth: 0 };
const allLetters = Object.entries(LETTER_ELEMENTS);

allLetters.forEach(([letter, element]) => {
  if (element && element in allElements) {
    allElements[element as keyof typeof allElements]++;
  }
});

console.log(`🔥 Fire (Hot & Dry):   ${allElements.Fire} letters`);
console.log(`💧 Water (Cold & Wet): ${allElements.Water} letters`);
console.log(`🌬️  Air (Hot & Wet):    ${allElements.Air} letters`);
console.log(`🌍 Earth (Cold & Dry): ${allElements.Earth} letters`);
console.log(`Total: ${Object.values(allElements).reduce((a, b) => a + b, 0)} letters`);

console.log('\n✅ DISTRIBUTION SHOULD BE: Fire=6, Water=5, Air=5, Earth=12');
const distCorrect = allElements.Fire === 6 && allElements.Water === 5 && allElements.Air === 5 && allElements.Earth === 12;
console.log(`STATUS: ${distCorrect ? '✅ CORRECT' : '❌ WRONG'}\n`);
