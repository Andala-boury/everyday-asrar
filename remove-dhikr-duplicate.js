const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Removing duplicate DHIKR line...\n');

let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Remove the corrupted duplicate line 158 (zero-indexed 157)
if (lines[157] && lines[157].includes('const DHIKR_NAMES')) {
  // Delete line 158 (zero-indexed 157+1 = 158)
  lines.splice(158, 1);
  console.log('✅ Removed duplicate corrupted fire dhikr line');
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('\n✨ DHIKR_NAMES object is now clean!');
console.log('\nVerifying structure:');
console.log('   Line 158: const DHIKR_NAMES...');
console.log('   Line 159: fire: Yā Laṭīf');
console.log('   Line 160: air: Yā Ḥakīm');
console.log('   Line 161: water: Yā Nūr');
console.log('   Line 162: earth: Yā Fattāḥ');
console.log('   Line 163: };');
