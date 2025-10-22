import { transliterateLatinToArabic, normalizeArabic } from './text-normalize-v2';

console.log('\n🧪 Testing Updated Transliteration with Lexicon Support\n');

const tests = [
  // Lexicon tests - must be exact
  { input: 'Allah', expected: 'الله', desc: 'Allah (lexicon)' },
  { input: 'al-Rahman', expected: 'الرحمن', desc: 'al-Rahman (lexicon)' },
  { input: 'Rahman', expected: 'رحمن', desc: 'Rahman (lexicon)' },
  { input: 'al-Rahim', expected: 'الرحيم', desc: 'al-Rahim (lexicon)' },
  { input: 'Rahim', expected: 'رحيم', desc: 'Rahim (lexicon)' },
  { input: 'al-Latif', expected: 'اللطيف', desc: 'al-Latif (lexicon)' },
  { input: 'Latif', expected: 'لطيف', desc: 'Latif (lexicon)' },
  { input: 'Hayy', expected: 'حي', desc: 'Hayy (lexicon)' },
  { input: 'al-Hayy', expected: 'الحي', desc: 'al-Hayy (lexicon)' },
  { input: 'Qayyum', expected: 'قيوم', desc: 'Qayyum (lexicon)' },
  { input: 'al-Qayyum', expected: 'القيوم', desc: 'al-Qayyum (lexicon)' },
  
  // Generic transliteration
  { input: 'Baka', expected: 'باكا', desc: 'Baka (generic with -a ending)' },
  { input: 'Fana', expected: 'فانا', desc: 'Fana (generic with -a ending)' },
  { input: 'Musa', expected: 'موسا', desc: 'Musa (generic with -a ending)' },
];

tests.forEach(test => {
  const result = transliterateLatinToArabic(test.input, { taMarbutaAs: 'ه' });
  const match = result.primary === test.expected;
  const icon = match ? '✅' : '❌';
  
  console.log(`${icon} ${test.desc}`);
  console.log(`   Input:    ${test.input}`);
  console.log(`   Expected: ${test.expected}`);
  console.log(`   Got:      ${result.primary}`);
  console.log(`   Confidence: ${result.confidence}%`);
  if (result.candidates.length > 1) {
    console.log(`   Alternates: ${result.candidates.slice(1).join(', ')}`);
  }
  if (result.warnings.length > 0) {
    console.log(`   Warnings: ${result.warnings.join('; ')}`);
  }
  console.log('');
});

// Test normalization
console.log('\n🧪 Testing Normalization\n');
const norm1 = normalizeArabic('ﷲ الرَّحْمٰن', { taMarbutaAs: 'ه' });
console.log(`✓ normalizeArabic('ﷲ الرَّحْمٰن') => '${norm1}'`);
console.log(`  Expected: 'الله الرحمن'`);
console.log(`  Match: ${norm1 === 'الله الرحمن' ? '✅' : '❌'}\n`);
