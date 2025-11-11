const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Fixing Balancing Dhikr section...\n');

let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Fix line 158-161: DHIKR_NAMES with proper transliterations
if (lines[157] && lines[157].includes('const DHIKR_NAMES')) {
  lines[158] = "  fire: { name: 'Yā Laṭīf (يا لطيف)', nameFr: 'Yā Laṭīf (يا لطيف)', nameAr: 'يا لطيف' },";
  lines[159] = "  air: { name: 'Yā Ḥakīm (يا حكيم)', nameFr: 'Yā Ḥakīm (يا حكيم)', nameAr: 'يا حكيم' },";
  lines[160] = "  water: { name: 'Yā Nūr (يا نور)', nameFr: 'Yā Nūr (يا نور)', nameAr: 'يا نور' },";
  lines[161] = "  earth: { name: 'Yā Fattāḥ (يا فتاح)', nameFr: 'Yā Fattāḥ (يا فتاح)', nameAr: 'يا فتاح' }";
  console.log('✅ Fixed DHIKR_NAMES:');
  console.log('   - Fire: Yā Laṭīf (يا لطيف)');
  console.log('   - Air: Yā Ḥakīm (يا حكيم)');
  console.log('   - Water: Yā Nūr (يا نور)');
  console.log('   - Earth: Yā Fattāḥ (يا فتاح)');
}

// Fix line 3922: Balancing Dhikr emoji
if (lines[3921] && lines[3921].includes('balancingDhikr')) {
  lines[3921] = '            <span>🕊️</span>';
  console.log('\n✅ Fixed Balancing Dhikr icon: 🕊️ (dove/peace)');
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('\n✨ Balancing Dhikr section fixed!');
