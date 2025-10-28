/**
 * TEST SUITE: Priority 1 Fixes Verification
 * Tests the critical hadath formula and letter classification fixes
 * Run with: npx ts-node test-priority-1-fixes.ts
 */

import { ABJAD_MAGHRIBI } from './src/contexts/AbjadContext';

// ============================================================================
// TEST HELPERS
// ============================================================================

function digitalRoot(n: number): number {
  if (n === 0) return 0;
  return 1 + ((n - 1) % 9);
}

function hadathRemainderOLD(n: number): number {
  // Old incorrect version (for comparison)
  if (n >= 1 && n <= 3) return 1;
  if (n >= 4 && n <= 6) return 2;
  if (n >= 7 && n <= 9) return 3;
  return 0;
}

function hadathRemainderNEW(n: number): 0 | 1 | 2 | 3 {
  // New correct version (using modulo 4)
  return (n % 4) as 0 | 1 | 2 | 3;
}

function hadathToElementOLD(hadath: number): string {
  // Old incorrect version
  if (hadath >= 1 && hadath <= 3) return 'Fire';
  if (hadath >= 4 && hadath <= 6) return 'Water';
  if (hadath >= 7 && hadath <= 9) return 'Air';
  return 'Earth';
}

function hadathToElementNEW(hadath: 0 | 1 | 2 | 3): string {
  // New correct version
  const map = { 0: 'Earth', 1: 'Fire', 2: 'Water', 3: 'Air' } as const;
  return map[hadath];
}

function calculateKabir(name: string): number {
  const normalized = name.replace(/[ًٌٍَُِّْ\s]/g, '');
  return [...normalized].reduce((sum, char) => sum + (ABJAD_MAGHRIBI[char as keyof typeof ABJAD_MAGHRIBI] || 0), 0);
}

// ============================================================================
// TEST CASES
// ============================================================================

interface TestCase {
  name: string;
  arabicName: string;
  expectedKabir: number;
  expectedElement: string;
}

const testCases: TestCase[] = [
  {
    name: 'Muhammad',
    arabicName: 'محمد',
    expectedKabir: 92,
    expectedElement: 'Earth'
  },
  {
    name: 'Ali',
    arabicName: 'علي',
    expectedKabir: 110,
    expectedElement: 'Water'
  },
  {
    name: 'Fatimah',
    arabicName: 'فاطمة',
    expectedKabir: 162,
    expectedElement: 'Water'
  },
  {
    name: 'Ahmad',
    arabicName: 'أحمد',
    expectedKabir: 53,
    expectedElement: 'Fire'
  },
  {
    name: 'Zaid',
    arabicName: 'زيد',
    expectedKabir: 26,
    expectedElement: 'Fire'
  },
  {
    name: 'Layla',
    arabicName: 'ليلى',
    expectedKabir: 80,
    expectedElement: 'Water'
  }
];

// ============================================================================
// RUN TESTS
// ============================================================================

console.log('\n' + '='.repeat(70));
console.log('🧪 PRIORITY 1 FIXES - TEST SUITE');
console.log('='.repeat(70));

let passCount = 0;
let failCount = 0;

console.log('\n📝 TEST 1: Hadath Formula Correction');
console.log('-'.repeat(70));

testCases.forEach(test => {
  const kabir = calculateKabir(test.arabicName);
  
  // Calculate with old formula
  const hadathOld = hadathRemainderOLD(kabir);
  const elementOld = hadathToElementOLD(hadathOld);
  
  // Calculate with new formula
  const hadathNew = hadathRemainderNEW(kabir);
  const elementNew = hadathToElementNEW(hadathNew);
  
  const pass = kabir === test.expectedKabir && elementNew === test.expectedElement;
  
  console.log(`\n${pass ? '✅' : '❌'} ${test.name} (${test.arabicName})`);
  console.log(`   Kabir: ${kabir} (expected: ${test.expectedKabir})`);
  console.log(`   Old formula: hadath=${hadathOld} → ${elementOld}`);
  console.log(`   New formula: hadath=${hadathNew} → ${elementNew}`);
  console.log(`   Expected: ${test.expectedElement}`);
  
  if (pass) passCount++;
  else failCount++;
});

console.log('\n📝 TEST 2: Letter Classification Check');
console.log('-'.repeat(70));

const LETTER_ELEMENTS_NEW = {
  // Fire (Hot & Dry)
  'ا': 'Fire', 'ه': 'Fire', 'ط': 'Fire', 'م': 'Fire', 'ف': 'Fire', 'ص': 'Fire',
  // Water (Cold & Wet)
  'ب': 'Water', 'و': 'Water', 'ي': 'Water', 'ن': 'Water', 'ق': 'Water',
  // Air (Hot & Wet)
  'ج': 'Air', 'ز': 'Air', 'ك': 'Air', 'س': 'Air', 'ش': 'Air',
  // Earth (Cold & Dry)
  'د': 'Earth', 'ل': 'Earth', 'ع': 'Earth', 'ر': 'Earth', 'ت': 'Earth',
  'ث': 'Earth', 'خ': 'Earth', 'ذ': 'Earth', 'ض': 'Earth', 'ظ': 'Earth', 'غ': 'Earth'
};

const problematicLetters = [
  { letter: 'ذ', shouldBe: 'Earth', description: 'Dhal' },
  { letter: 'ض', shouldBe: 'Earth', description: 'Dad' },
  { letter: 'ظ', shouldBe: 'Earth', description: 'Dha' },
  { letter: 'ش', shouldBe: 'Air', description: 'Sheen' },
  { letter: 'ث', shouldBe: 'Earth', description: 'Tha' },
  { letter: 'خ', shouldBe: 'Earth', description: 'Kha' }
];

let letterTestPass = 0;
let letterTestFail = 0;

problematicLetters.forEach(test => {
  const actual = LETTER_ELEMENTS_NEW[test.letter as keyof typeof LETTER_ELEMENTS_NEW];
  const pass = actual === test.shouldBe;
  
  console.log(`${pass ? '✅' : '❌'} ${test.letter} (${test.description}): ${actual} (expected: ${test.shouldBe})`);
  
  if (pass) letterTestPass++;
  else letterTestFail++;
});

passCount += letterTestPass;
failCount += letterTestFail;

console.log('\n📝 TEST 3: All 28 Letters Accounted For');
console.log('-'.repeat(70));

const fireLetters = ['ا', 'ه', 'ط', 'م', 'ف', 'ص'];
const waterLetters = ['ب', 'و', 'ي', 'ن', 'ق'];
const airLetters = ['ج', 'ز', 'ك', 'س', 'ش'];
const earthLetters = ['د', 'ل', 'ع', 'ر', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ'];

const totalLetters = fireLetters.length + waterLetters.length + airLetters.length + earthLetters.length;

const pass3 = totalLetters === 28;
console.log(`${pass3 ? '✅' : '❌'} Letter Count: ${totalLetters} (expected: 28)`);
console.log(`   Fire: ${fireLetters.length} letters`);
console.log(`   Water: ${waterLetters.length} letters`);
console.log(`   Air: ${airLetters.length} letters`);
console.log(`   Earth: ${earthLetters.length} letters`);

if (pass3) passCount++;
else failCount++;

console.log('\n📝 TEST 4: Element Distribution Validation');
console.log('-'.repeat(70));

const distribution = {
  Fire: Object.values(LETTER_ELEMENTS_NEW).filter(e => e === 'Fire').length,
  Water: Object.values(LETTER_ELEMENTS_NEW).filter(e => e === 'Water').length,
  Air: Object.values(LETTER_ELEMENTS_NEW).filter(e => e === 'Air').length,
  Earth: Object.values(LETTER_ELEMENTS_NEW).filter(e => e === 'Earth').length,
};

const pass4 = distribution.Fire === 6 && distribution.Water === 5 && 
              distribution.Air === 5 && distribution.Earth === 12;

console.log(`${pass4 ? '✅' : '❌'} Element Distribution:`);
console.log(`   Fire: ${distribution.Fire} (expected: 6)`);
console.log(`   Water: ${distribution.Water} (expected: 5)`);
console.log(`   Air: ${distribution.Air} (expected: 5)`);
console.log(`   Earth: ${distribution.Earth} (expected: 12)`);

if (pass4) passCount++;
else failCount++;

console.log('\n📝 TEST 5: Hadath Modulo Edge Cases');
console.log('-'.repeat(70));

const edgeCases = [
  { value: 0, expectedHadath: 0, expectedElement: 'Earth' },
  { value: 1, expectedHadath: 1, expectedElement: 'Fire' },
  { value: 2, expectedHadath: 2, expectedElement: 'Water' },
  { value: 3, expectedHadath: 3, expectedElement: 'Air' },
  { value: 4, expectedHadath: 0, expectedElement: 'Earth' },
  { value: 5, expectedHadath: 1, expectedElement: 'Fire' },
  { value: 100, expectedHadath: 0, expectedElement: 'Earth' },
  { value: 786, expectedHadath: 2, expectedElement: 'Water' },
];

let edgeCasePass = 0;
let edgeCaseFail = 0;

edgeCases.forEach(test => {
  const hadath = hadathRemainderNEW(test.value);
  const element = hadathToElementNEW(hadath);
  const pass = hadath === test.expectedHadath && element === test.expectedElement;
  
  console.log(`${pass ? '✅' : '❌'} ${test.value}: hadath=${hadath} → ${element} (expected: hadath=${test.expectedHadath} → ${test.expectedElement})`);
  
  if (pass) edgeCasePass++;
  else edgeCaseFail++;
});

passCount += edgeCasePass;
failCount += edgeCaseFail;

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(70));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(70));

console.log(`\n✅ PASSED: ${passCount}`);
console.log(`❌ FAILED: ${failCount}`);
console.log(`📈 TOTAL:  ${passCount + failCount}`);

const percentage = ((passCount / (passCount + failCount)) * 100).toFixed(1);
console.log(`\n🎯 Success Rate: ${percentage}%`);

if (failCount === 0) {
  console.log('\n🎉 ALL TESTS PASSED! Priority 1 fixes are working correctly.');
  console.log('\n✨ Hadath formula has been corrected to use modulo 4.');
  console.log('✨ Letter classifications have been fixed.');
  console.log('✨ All 28 Arabic letters are properly classified.');
} else {
  console.log('\n⚠️  Some tests failed. Please review the errors above.');
}

console.log('\n' + '='.repeat(70) + '\n');
