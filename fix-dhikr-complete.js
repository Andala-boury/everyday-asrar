const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Fixing DHIKR_NAMES object completely...\n');

let content = fs.readFileSync(filePath, 'utf8');

// Replace the entire corrupted DHIKR_NAMES object
// Find from the comment to the closing brace
const oldPattern = /\/\/ Divine Names for each element[\s\S]*?const DHIKR_NAMES: Record<'fire'[\s\S]*?earth: { name: '[^']*'[^}]*}\s*}/m;

const newDhikr = `// Divine Names for each element (these are proper names, don't translate)
const DHIKR_NAMES: Record<'fire' | 'air' | 'water' | 'earth', { name: string; nameFr: string; nameAr: string }> = {
  fire: { name: 'Yā Laṭīf (يا لطيف)', nameFr: 'Yā Laṭīf (يا لطيف)', nameAr: 'يا لطيف' },
  air: { name: 'Yā Ḥakīm (يا حكيم)', nameFr: 'Yā Ḥakīm (يا حكيم)', nameAr: 'يا حكيم' },
  water: { name: 'Yā Nūr (يا نور)', nameFr: 'Yā Nūr (يا نور)', nameAr: 'يا نور' },
  earth: { name: 'Yā Fattāḥ (يا فتاح)', nameFr: 'Yā Fattāḥ (يا فتاح)', nameAr: 'يا فتاح' }
}`;

content = content.replace(oldPattern, newDhikr);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed DHIKR_NAMES object:');
console.log('   🔥 Fire: Yā Laṭīf (يا لطيف) - The Gentle');
console.log('   💨 Air: Yā Ḥakīm (يا حكيم) - The Wise');
console.log('   💧 Water: Yā Nūr (يا نور) - The Light');
console.log('   🌍 Earth: Yā Fattāḥ (يا فتاح) - The Opener');
console.log('\n✨ Balancing Dhikr section fully fixed!');
