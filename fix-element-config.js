const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('Reading file...');
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the corrupted elementConfig
// We'll search for the pattern and replace it byte by byte
const before = content;

// Replace corrupted fire icon
content = content.replace(/fire:\s*{\s*icon:\s*['""][^'"]*['"],/g, "fire: { icon: '🔥',");

// Replace corrupted air icon  
content = content.replace(/air:\s*{\s*icon:\s*['""][^'"]*['"],/g, "air: { icon: '💨',");

// Replace corrupted water icon
content = content.replace(/water:\s*{\s*icon:\s*['""][^'"]*['"],/g, "water: { icon: '💧',");

// Replace corrupted earth icon  
content = content.replace(/earth:\s*{\s*icon:\s*['""][^'"]*['"],/g, "earth: { icon: '🌍',");

if (content !== before) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Fixed element icons in IlmHurufPanel.tsx');
  console.log('   - Fire: 🔥');
  console.log('   - Air: 💨');
  console.log('   - Water: 💧');
  console.log('   - Earth: 🌍');
} else {
  console.log('⚠️  No changes made - pattern not found');
}
