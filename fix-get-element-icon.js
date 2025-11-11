const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Fixing getElementIcon() function...\n');

let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Line 204: Fix the icons object
if (lines[203] && lines[203].includes('const icons')) {
  lines[203] = "  const icons = { fire: '🔥', air: '💨', water: '💧', earth: '🌍' };";
  console.log('✅ Fixed line 204: getElementIcon() function');
  console.log('   - 🔥 Fire');
  console.log('   - 💨 Air');
  console.log('   - 💧 Water');
  console.log('   - 🌍 Earth');
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('\n✨ Compatibility module element icons fixed!');
