const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Fixing corrupted Arabic letters in LETTER_ELEMENTS mapping...\n');

let content = fs.readFileSync(filePath, 'utf8');

// The correct 28 Arabic letters mapping:
// Fire (7): ا د ط م ن ش ذ (alif, dal, ta, mim, nun, shin, dhal)
// Air (7): ه و ي ن ص ت ض (ha, waw, ya, nun, sad, ta, dad)  
// Water (7): ب ح ل ع ر ك غ (ba, ha, lam, ayn, ra, kaf, ghayn)
// Earth (7): ج ز س ق ث خ ظ (jim, zay, sin, qaf, tha, kha, dha)

const oldLetterElements = `const LETTER_ELEMENTS: Record<string, 'fire' | 'air' | 'water' | 'earth'> = {
  // Fire letters (hot & dry): Ø§ Ø¯ Ø· Ù… Ù Ø´ Ø°
  'Ø§': 'fire', 'Ø¯': 'fire', 'Ø·': 'fire', 'Ù…': 'fire', 'Ù': 'fire', 'Ø´': 'fire', 'Ø°': 'fire',
  // Air letters (hot & wet): Ù‡ Ùˆ ÙŠ Ù† Øµ Øª Ø¶  
  'Ù‡': 'air', 'Ùˆ': 'air', 'ÙŠ': 'air', 'Ù†': 'air', 'Øµ': 'air', 'Øª': 'air', 'Ø¶': 'air',
  // Water letters (cold & wet): Ø¨ Ø⭐ Ù„ Ø¹ Ø± Ùƒ Øº
  'Ø¨': 'water', 'Ø⭐': 'water', 'Ù„': 'water', 'Ø¹': 'water', 'Ø±': 'water', 'Ùƒ': 'water', 'Øº': 'water',
  // Earth letters (cold & dry): Ø¬ Ø² Ø³ Ù‚ Ø« Ø® Ø¸
  'Ø¬': 'earth', 'Ø²': 'earth', 'Ø³': 'earth', 'Ù‚': 'earth', 'Ø«': 'earth', 'Ø®': 'earth', 'Ø¸': 'earth'
};`;

const newLetterElements = `const LETTER_ELEMENTS: Record<string, 'fire' | 'air' | 'water' | 'earth'> = {
  // Fire letters (hot & dry): ا د ط م ن ش ذ
  'ا': 'fire', 'د': 'fire', 'ط': 'fire', 'م': 'fire', 'ن': 'fire', 'ش': 'fire', 'ذ': 'fire',
  // Air letters (hot & wet): ه و ي ن ص ت ض  
  'ه': 'air', 'و': 'air', 'ي': 'air', 'ن': 'air', 'ص': 'air', 'ت': 'air', 'ض': 'air',
  // Water letters (cold & wet): ب ح ل ع ر ك غ
  'ب': 'water', 'ح': 'water', 'ل': 'water', 'ع': 'water', 'ر': 'water', 'ك': 'water', 'غ': 'water',
  // Earth letters (cold & dry): ج ز س ق ث خ ظ
  'ج': 'earth', 'ز': 'earth', 'س': 'earth', 'ق': 'earth', 'ث': 'earth', 'خ': 'earth', 'ظ': 'earth'
};`;

if (content.includes(oldLetterElements)) {
  content = content.replace(oldLetterElements, newLetterElements);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Fixed LETTER_ELEMENTS mapping!');
  console.log('   - Fire: ا د ط م ن ش ذ (7 letters)');
  console.log('   - Air: ه و ي ن ص ت ض (7 letters)');
  console.log('   - Water: ب ح ل ع ر ك غ (7 letters)');
  console.log('   - Earth: ج ز س ق ث خ ظ (7 letters)');
  console.log('\n✨ Element percentages will now calculate correctly!');
} else {
  console.log('⚠️  Could not find exact match - trying line-by-line fix...');
  
  // Alternative: Fix the specific corrupted letter
  content = content.replace(/'Ø⭐': 'water'/g, "'ح': 'water'");
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Fixed corrupted water letter (ح)');
}
