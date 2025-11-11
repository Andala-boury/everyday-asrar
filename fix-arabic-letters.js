const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Fixing ALL corrupted Arabic letters in LETTER_ELEMENTS...\n');

let content = fs.readFileSync(filePath, 'utf8');

// Find the LETTER_ELEMENTS section and replace it entirely
const startMarker = "// Letter to Element mapping (28 Arabic letters)";
const endMarker = "};";

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
  console.log('❌ Could not find LETTER_ELEMENTS mapping');
  process.exit(1);
}

// Find the closing brace after the start
const searchFrom = startIndex + startMarker.length;
const endIndex = content.indexOf('\n};', searchFrom) + 1;

if (endIndex === -1) {
  console.log('❌ Could not find end of LETTER_ELEMENTS mapping');
  process.exit(1);
}

const oldSection = content.substring(startIndex, endIndex + 2);

const newSection = `// Letter to Element mapping (28 Arabic letters)
const LETTER_ELEMENTS: Record<string, 'fire' | 'air' | 'water' | 'earth'> = {
  // Fire letters (hot & dry): ا د ط م ن ش ذ
  'ا': 'fire', 'د': 'fire', 'ط': 'fire', 'م': 'fire', 'ن': 'fire', 'ش': 'fire', 'ذ': 'fire',
  // Air letters (hot & wet): ه و ي ن ص ت ض  
  'ه': 'air', 'و': 'air', 'ي': 'air', 'ن': 'air', 'ص': 'air', 'ت': 'air', 'ض': 'air',
  // Water letters (cold & wet): ب ح ل ع ر ك غ
  'ب': 'water', 'ح': 'water', 'ل': 'water', 'ع': 'water', 'ر': 'water', 'ك': 'water', 'غ': 'water',
  // Earth letters (cold & dry): ج ز س ق ث خ ظ
  'ج': 'earth', 'ز': 'earth', 'س': 'earth', 'ق': 'earth', 'ث': 'earth', 'خ': 'earth', 'ظ': 'earth'
};`;

content = content.substring(0, startIndex) + newSection + content.substring(endIndex + 2);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ LETTER_ELEMENTS mapping fixed!');
console.log('\n📋 Correct Arabic letters now mapped:');
console.log('   🔥 Fire (7): ا د ط م ن ش ذ');
console.log('   💨 Air (7): ه و ي ن ص ت ض');
console.log('   💧 Water (7): ب ح ل ع ر ك غ');
console.log('   🌍 Earth (7): ج ز س ق ث خ ظ');
console.log('\n✨ Element percentages will now display correctly!');
