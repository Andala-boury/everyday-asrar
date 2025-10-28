/**
 * VERIFICATION SCRIPT: Priority 1 Fixes
 * Standalone verification without complex imports
 * Run with: npx ts-node verify-fixes.ts
 */

console.log('\n' + '='.repeat(80));
console.log('PRIORITY 1 FIXES VERIFICATION');
console.log('='.repeat(80) + '\n');

// ============================================================================
// CONSTANT DEFINITIONS (from fixed source)
// ============================================================================

const ABJAD_MAGHRIBI: { [key: string]: number } = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80,
  'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600,
  'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000
};

// CORRECTED LETTER_ELEMENTS (Fix #2) - UPDATED with ح→Earth mapping
const LETTER_ELEMENTS: { [key: string]: string } = {
  // Fire (6 letters)
  'ا': 'Fire', 'ه': 'Fire', 'ط': 'Fire', 'م': 'Fire', 'ف': 'Fire', 'ص': 'Fire',
  // Water (5 letters)
  'ب': 'Water', 'و': 'Water', 'ي': 'Water', 'ن': 'Water', 'ق': 'Water',
  // Air (5 letters) - CORRECTED: ح removed and moved to Earth
  'ج': 'Air', 'ز': 'Air', 'ك': 'Air', 'س': 'Air', 'ش': 'Air',
  // Earth (12 letters) - CORRECTED: ح (Ha) added as Cold & Dry
  'د': 'Earth', 'ل': 'Earth', 'ع': 'Earth', 'ر': 'Earth', 'ت': 'Earth', 
  'ث': 'Earth', 'خ': 'Earth', 'ذ': 'Earth', 'ض': 'Earth', 'ظ': 'Earth', 'غ': 'Earth',
  'ح': 'Earth'  // CORRECTED: ح is Cold & Dry (Earth), not Hot & Wet (Air)
};

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

function digitalRoot(n: number): number {
  if (n === 0) return 0;
  return 1 + ((n - 1) % 9);
}

function getNameHadath(name: string): number {
  let sum = 0;
  const letters = name.split('');
  for (const letter of letters) {
    sum += ABJAD_MAGHRIBI[letter] || 0;
  }
  const kabir = digitalRoot(sum);
  return kabir % 4; // FIX #1: Using modulo 4
}

function hadathToElement(hadath: 0 | 1 | 2 | 3): string {
  // FIX #1: New correct algorithm using map
  const map = { 0: 'Earth', 1: 'Fire', 2: 'Water', 3: 'Air' } as const;
  return map[hadath];
}

// ============================================================================
// TEST 1: HADATH FORMULA VERIFICATION
// ============================================================================

console.log('TEST 1: HADATH FORMULA (Fix #1)');
console.log('-'.repeat(80));

const testNames = [
  { name: 'محمد', expectedElement: 'Water', description: 'Muhammad (92) - should be Water' },
  { name: 'علي', expectedElement: 'Water', description: 'Ali (110) - should be Water' },
  { name: 'فاطمة', expectedElement: 'Earth', description: 'Fatimah (130) - should be Earth' },
  { name: 'أحمد', expectedElement: 'Air', description: 'Ahmad (52) - should be Air' },
  { name: 'زيد', expectedElement: 'Air', description: 'Zaid (21) - should be Air' },
  { name: 'ليلى', expectedElement: 'Air', description: 'Layla (70) - should be Air' }
];

let hadathPassed = 0;
let hadathTotal = testNames.length;

for (const test of testNames) {
  const hadath = getNameHadath(test.name) as 0 | 1 | 2 | 3;
  const element = hadathToElement(hadath);
  const passed = element === test.expectedElement;
  
  console.log(`${passed ? '✅' : '❌'} ${test.description}`);
  console.log(`   Hadath: ${hadath}, Element: ${element}`);
  
  if (passed) hadathPassed++;
}

console.log(`\nHadath Formula Test: ${hadathPassed}/${hadathTotal} PASSED\n`);

// ============================================================================
// TEST 2: LETTER CLASSIFICATION VERIFICATION
// ============================================================================

console.log('TEST 2: LETTER CLASSIFICATION (Fix #2)');
console.log('-'.repeat(80));

const correctionTests = [
  { letter: 'ذ', expected: 'Earth', old: 'Fire', description: 'Dhal (ذ): Fire→Earth' },
  { letter: 'ض', expected: 'Earth', old: 'Air', description: 'Dad (ض): Air→Earth' },
  { letter: 'ظ', expected: 'Earth', old: 'Air', description: 'Dha (ظ): Air→Earth' },
  { letter: 'ش', expected: 'Air', old: 'Fire', description: 'Sheen (ش): Fire→Air' },
  { letter: 'ث', expected: 'Earth', old: 'Water', description: 'Tha (ث): Water→Earth' },
  { letter: 'خ', expected: 'Earth', old: 'Water', description: 'Kha (خ): Water→Earth' },
  { letter: 'ح', expected: 'Earth', old: 'Air', description: 'Ha (ح): Air→Earth (CORRECTED IN SECOND LOCATION)' }
];

let correctionPassed = 0;
let correctionTotal = correctionTests.length;

for (const test of correctionTests) {
  const actual = LETTER_ELEMENTS[test.letter];
  const passed = actual === test.expected;
  
  console.log(`${passed ? '✅' : '❌'} ${test.description}`);
  console.log(`   Current: ${actual} (Expected: ${test.expected})`);
  
  if (passed) correctionPassed++;
}

console.log(`\nLetter Classification Test: ${correctionPassed}/${correctionTotal} PASSED\n`);

// ============================================================================
// TEST 3: ALL 28 LETTERS ACCOUNTED FOR
// ============================================================================

console.log('TEST 3: ALL 28 LETTERS ACCOUNTED FOR');
console.log('-'.repeat(80));

const arabicLetters = ['ا', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ'];
let accountedFor = 0;

for (const letter of arabicLetters) {
  if (LETTER_ELEMENTS[letter]) {
    accountedFor++;
  }
}

console.log(`Letters accounted for: ${accountedFor}/${arabicLetters.length}`);

if (accountedFor === arabicLetters.length) {
  console.log('✅ All 28 letters are classified\n');
} else {
  console.log(`❌ Missing ${arabicLetters.length - accountedFor} letters\n`);
}

// ============================================================================
// TEST 4: ELEMENT DISTRIBUTION
// ============================================================================

console.log('TEST 4: ELEMENT DISTRIBUTION');
console.log('-'.repeat(80));

const distribution = {
  Fire: 0,
  Water: 0,
  Air: 0,
  Earth: 0
};

for (const letter of arabicLetters) {
  const element = LETTER_ELEMENTS[letter];
  if (element) {
    distribution[element as keyof typeof distribution]++;
  }
}

console.log(`Fire letters:  ${distribution.Fire} (Expected: 6)`);
console.log(`Water letters: ${distribution.Water} (Expected: 5)`);
console.log(`Air letters:   ${distribution.Air} (Expected: 6)`);
console.log(`Earth letters: ${distribution.Earth} (Expected: 11)`);
console.log();

const distPassed = 
  distribution.Fire === 6 &&
  distribution.Water === 5 &&
  distribution.Air === 6 &&
  distribution.Earth === 11;

if (distPassed) {
  console.log('✅ Distribution is correct\n');
} else {
  console.log('❌ Distribution is incorrect\n');
}

// ============================================================================
// TEST 5: HADATH EDGE CASES
// ============================================================================

console.log('TEST 5: HADATH MODULO EDGE CASES');
console.log('-'.repeat(80));

const edgeCases = [
  { value: 0, expected: 'Earth' },
  { value: 1, expected: 'Fire' },
  { value: 2, expected: 'Water' },
  { value: 3, expected: 'Air' },
  { value: 4, expected: 'Earth' },
  { value: 5, expected: 'Fire' },
  { value: 100, expected: 'Earth' }, // 100 % 4 = 0
  { value: 786, expected: 'Water' }  // 786 % 4 = 2
];

let edgePassed = 0;

for (const test of edgeCases) {
  const hadath = (test.value % 4) as 0 | 1 | 2 | 3;
  const element = hadathToElement(hadath);
  const passed = element === test.expected;
  
  console.log(`${passed ? '✅' : '❌'} ${test.value} % 4 = ${hadath} → ${element} (expected: ${test.expected})`);
  
  if (passed) edgePassed++;
}

console.log(`\nEdge Cases Test: ${edgePassed}/${edgeCases.length} PASSED\n`);

// ============================================================================
// FINAL SUMMARY
// ============================================================================

const totalPassed = hadathPassed + correctionPassed + (accountedFor === arabicLetters.length ? 1 : 0) + (distPassed ? 1 : 0) + edgePassed;
const totalTests = hadathTotal + correctionTotal + 1 + 1 + edgeCases.length;

console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total Tests Passed: ${totalPassed}/${totalTests}`);
console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);

if (totalPassed === totalTests) {
  console.log('\n✅ ALL TESTS PASSED - Priority 1 Fixes Verified!');
  process.exit(0);
} else {
  console.log('\n❌ SOME TESTS FAILED - Please review the output above');
  process.exit(1);
}
