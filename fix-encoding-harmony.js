const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'features', 'ilm-huruf', 'IlmHurufPanel.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the problematic characters with proper emojis
content = content.replace(/`"¥ \$\{combined\.fire\}%`/g, '`🔥 ${combined.fire}%`');
content = content.replace(/`'¨ \$\{combined\.air\}%`/g, '`🌬️ ${combined.air}%`');
content = content.replace(/`'§ \$\{combined\.water\}%`/g, '`💧 ${combined.water}%`');
content = content.replace(/` \$\{combined\.earth\}%`/g, '`🌍 ${combined.earth}%`');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed encoding issues in harmony bar!');
