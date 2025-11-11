const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Fixing remaining corrupted emoji with byte-level replacement...\n');

let content = fs.readFileSync(filePath, 'utf8');

// Read the file and find the exact corrupted sequences
const divineNameSection = content.substring(
  content.indexOf('Divine Name Resonance') - 100,
  content.indexOf('Divine Name Resonance') + 500
);

console.log('Found section:', divineNameSection.substring(0, 200));

// Replace with regex that matches any character between the span tags
content = content.replace(
  /<span className="text-3xl">[^<]+<\/span>\s*<h4 className="text-xl font-bold text-purple-900 dark:text-purple-200">\s*{t\.nameDestiny\.divineNameResonance\.title}/g,
  '<span className="text-3xl">🕌</span>\n                <h4 className="text-xl font-bold text-purple-900 dark:text-purple-200">\n                  {t.nameDestiny.divineNameResonance.title}'
);

// Fix sparkles emoji - look for span with corrupted content before spiritualInfluence
content = content.replace(
  /<span>[^<]*<\/span> {t\.nameDestiny\.divineNameResonance\.spiritualInfluence}/g,
  '<span>✨</span> {t.nameDestiny.divineNameResonance.spiritualInfluence}'
);

content = content.replace(
  /<span>[^<]*<\/span> {t\.nameDestiny\.divineNameResonance\.reflection}/g,
  '<span>✨</span> {t.nameDestiny.divineNameResonance.reflection}'
);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed Divine Name Resonance emoji!');
console.log('   - 🕌 Mosque icon');
console.log('   - ✨ Sparkles icons');
