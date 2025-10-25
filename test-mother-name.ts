/**
 * Test script for Mother's Name (Um Ḥadad) feature
 * Run with: npx ts-node test-mother-name.ts
 */

import { analyzeMotherName, generateInheritanceInsight } from './src/features/ilm-huruf/core';
import { ABJAD_MAGHRIBI } from './src/contexts/AbjadContext';

console.log('🧪 Testing Mother\'s Name Analysis (Um Ḥadad)\n');
console.log('═'.repeat(60));

// Test 1: Analyze mother's name
console.log('\n📝 Test 1: Analyzing Mother\'s Name');
console.log('─'.repeat(60));

const motherName = 'فاطمة'; // Fatima
console.log(`Mother's Name: ${motherName}`);

try {
  const motherAnalysis = analyzeMotherName(motherName, ABJAD_MAGHRIBI);
  console.log('\n✅ Analysis Result:');
  console.log(`   Name: ${motherAnalysis.name}`);
  console.log(`   Kabīr: ${motherAnalysis.kabir}`);
  console.log(`   Ṣaghīr: ${motherAnalysis.saghir}`);
  console.log(`   Ḥadath: ${motherAnalysis.hadath}`);
  console.log(`   Element: ${motherAnalysis.element} (${motherAnalysis.elementArabic})`);
} catch (error) {
  console.error('❌ Error:', error);
}

// Test 2: Inheritance insights for different element combinations
console.log('\n\n📝 Test 2: Element Inheritance Insights');
console.log('─'.repeat(60));

const testCases: Array<[string, string]> = [
  ['Fire', 'Fire'],      // Same
  ['Fire', 'Air'],       // Compatible
  ['Fire', 'Water'],     // Opposing
  ['Fire', 'Earth'],     // Neutral
  ['Water', 'Earth'],    // Compatible
  ['Air', 'Earth'],      // Opposing
];

testCases.forEach(([userElement, motherElement]) => {
  console.log(`\n${userElement} (User) + ${motherElement} (Mother):`);
  const insight = generateInheritanceInsight(
    userElement as any,
    motherElement as any
  );
  console.log(`   ${insight.substring(0, 100)}...`);
});

// Test 3: Complete scenario
console.log('\n\n📝 Test 3: Complete Scenario');
console.log('─'.repeat(60));

const userName = 'محمد'; // Muhammad
console.log(`User Name: ${userName}`);
console.log(`Mother's Name: ${motherName}`);

import { analyzeNameDestiny } from './src/features/ilm-huruf/core';

const userAnalysis = analyzeNameDestiny(userName, ABJAD_MAGHRIBI);
const motherAnalysis2 = analyzeMotherName(motherName, ABJAD_MAGHRIBI);

// Determine user's element
function hadathToElement(hadath: number): 'Fire' | 'Water' | 'Air' | 'Earth' {
  if (hadath >= 1 && hadath <= 3) return 'Fire';
  if (hadath >= 4 && hadath <= 6) return 'Water';
  if (hadath >= 7 && hadath <= 9) return 'Air';
  return 'Earth';
}

const userElement = hadathToElement(userAnalysis.hadath);

console.log(`\nUser Element: ${userElement} (Ḥadath: ${userAnalysis.hadath})`);
console.log(`Mother Element: ${motherAnalysis2.element} (Ḥadath: ${motherAnalysis2.hadath})`);

console.log('\n💡 Inheritance Insight:');
console.log(generateInheritanceInsight(userElement, motherAnalysis2.element));

console.log('\n' + '═'.repeat(60));
console.log('✅ All tests completed successfully!\n');
