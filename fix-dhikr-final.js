const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Fixing Balancing Dhikr section (corrected line numbers)...\n');

let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Fix DHIKR_NAMES (lines 158-161, zero-indexed 157-160)
lines[158] = "  fire: { name: 'Yā Laṭīf (يا لطيف)', nameFr: 'Yā Laṭīf (يا لطيف)', nameAr: 'يا لطيف' },";
lines[159] = "  air: { name: 'Yā Ḥakīm (يا حكيم)', nameFr: 'Yā Ḥakīm (يا حكيم)', nameAr: 'يا حكيم' },";
lines[160] = "  water: { name: 'Yā Nūr (يا نور)', nameFr: 'Yā Nūr (يا نور)', nameAr: 'يا نور' },";
lines[161] = "  earth: { name: 'Yā Fattāḥ (يا فتاح)', nameFr: 'Yā Fattāḥ (يا فتاح)', nameAr: 'يا فتاح' }";

console.log('✅ Fixed DHIKR_NAMES (lines 158-161):');
console.log('   🔥 Fire: Yā Laṭīf (يا لطيف)');
console.log('   💨 Air: Yā Ḥakīm (يا حكيم)');
console.log('   💧 Water: Yā Nūr (يا نور)');
console.log('   🌍 Earth: Yā Fattāḥ (يا فتاح)');

// Fix Balancing Dhikr icon (line 3922, zero-indexed 3921)
lines[3921] = '            <span>🕊️</span>';
console.log('\n✅ Fixed Balancing Dhikr header icon (line 3922): 🕊️');

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('\n✨ All Balancing Dhikr fixes applied!');
