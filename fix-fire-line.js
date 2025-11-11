const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Final DHIKR fix - replacing line 158 directly...\n');

let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Replace line 158 (zero-indexed 157) - the fire line
lines[158] = "  fire: { name: 'Yā Laṭīf (يا لطيف)', nameFr: 'Yā Laṭīf (يا لطيف)', nameAr: 'يا لطيف' },";

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');

console.log('✅ Replaced fire dhikr line 158');
console.log('🔥 Fire: Yā Laṭīf (يا لطيف) - The Gentle\n');
console.log('✨ Balancing Dhikr section is now complete!');
console.log('\n📱 Hard refresh browser (Ctrl+Shift+R) to see:');
console.log('   • 🕊️ Balancing Dhikr header icon');
console.log('   • Proper Arabic divine names for each element');
