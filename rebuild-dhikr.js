const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Complete DHIKR object reconstruction...\n');

let content = fs.readFileSync(filePath, 'utf8');

// Find and replace between the comment and the helper function
const startMarker = '// Divine Names for each element (these are proper names, don\'t translate)';
const endMarker = '// Helper function to calculate element distribution from Arabic text';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.log('❌ Could not find markers');
  process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

const newDhikrSection = `// Divine Names for each element (these are proper names, don't translate)
const DHIKR_NAMES: Record<'fire' | 'air' | 'water' | 'earth', { name: string; nameFr: string; nameAr: string }> = {
  fire: { name: 'Yā Laṭīf (يا لطيف)', nameFr: 'Yā Laṭīf (يا لطيف)', nameAr: 'يا لطيف' },
  air: { name: 'Yā Ḥakīm (يا حكيم)', nameFr: 'Yā Ḥakīm (يا حكيم)', nameAr: 'يا حكيم' },
  water: { name: 'Yā Nūr (يا نور)', nameFr: 'Yā Nūr (يا نور)', nameAr: 'يا نور' },
  earth: { name: 'Yā Fattāḥ (يا فتاح)', nameFr: 'Yā Fattāḥ (يا فتاح)', nameAr: 'يا فتاح' }
};

`;

const newContent = before + newDhikrSection + after;

fs.writeFileSync(filePath, newContent, 'utf8');

console.log('✅ DHIKR_NAMES completely reconstructed:');
console.log('   🔥 Fire: Yā Laṭīf (يا لطيف)');
console.log('   💨 Air: Yā Ḥakīm (يا حكيم)');
console.log('   💧 Water: Yā Nūr (يا نور)');
console.log('   🌍 Earth: Yā Fattāḥ (يا فتاح)');
console.log('\n✨ All elements present with correct names!');
