const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Direct line-by-line DHIKR fix...\n');

let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Line 157 (zero-indexed 156) = comment
// Line 158 (zero-indexed 157) = const DHIKR_NAMES
// Line 159 (zero-indexed 158) = corrupted fire - DELETE THIS
// Line 160 (zero-indexed 159) = good fire - KEEP
// Line 161 (zero-indexed 160) = air - KEEP
// Line 162 (zero-indexed 161) = water - KEEP
// Line 163 (zero-indexed 162) = earth - KEEP
// Line 164 (zero-indexed 163) = closing } - but missing, need to add

// Delete the corrupted fire line (zero-indexed 158)
console.log('Removing corrupted line 159 (fire)...');
lines.splice(158, 1);

// Verify and add closing brace if needed
const earthLineIndex = lines.findIndex((line, idx) => idx > 155 && idx < 165 && line.includes('earth:'));
if (earthLineIndex !== -1) {
  // Check if next line has closing brace
  if (!lines[earthLineIndex + 1] || !lines[earthLineIndex + 1].includes('};')) {
    console.log('Adding missing closing brace...');
    lines.splice(earthLineIndex + 1, 0, '};');
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');

console.log('\n✅ Removed duplicate corrupted fire entry');
console.log('✅ DHIKR_NAMES object structure fixed');
console.log('\n🔥 Fire: Yā Laṭīf (يا لطيف)');
console.log('💨 Air: Yā Ḥakīm (يا حكيم)');  
console.log('💧 Water: Yā Nūr (يا نور)');
console.log('🌍 Earth: Yā Fattāḥ (يا فتاح)');
console.log('\n✨ Done!');
