import { transliterateLatinToArabic, normalizeArabic } from './src/lib/text-normalize';

console.log('\n=== Testing LEXICON-based transliteration ===\n');

const tests = [
  'Allah',
  'al-Rahman',
  'Rahman',
  'al-Rahim',
  'Rahim',
  'al-Latif',
  'Latif',
  'Hayy',
  'al-Hayy',
  'Qayyum',
  'al-Qayyum',
  'Baka',
  'Fana',
  'Musa'
];

tests.forEach(test => {
  const result = transliterateLatinToArabic(test, { taMarbutaAs: 'ه' });
  console.log(`${test.padEnd(15)} → ${result.primary.padEnd(10)} (confidence: ${result.confidence}%)`);
  if (result.candidates.length > 1) {
    console.log(`                  Alternatives: ${result.candidates.slice(1).join(', ')}`);
  }
  if (result.warnings.length > 0) {
    console.log(`                  ℹ ${result.warnings.join('; ')}`);
  }
});

console.log('\n=== Expected Results ===');
console.log('Allah     → الله');
console.log('al-Rahman → الرحمن');
console.log('Rahman    → رحمن');
console.log('al-Rahim  → الرحيم');
console.log('Rahim     → رحيم');
console.log('al-Latif  → اللطيف');
console.log('Latif     → لطيف');
console.log('Hayy      → حي');
console.log('al-Hayy   → الحي');
console.log('Qayyum    → قيوم');
console.log('al-Qayyum → القيوم');
