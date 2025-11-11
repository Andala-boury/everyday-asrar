const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Fixing final 4 corrupted emoji...\n');

let content = fs.readFileSync(filePath, 'utf8');

// Fix by searching for the exact corrupted patterns
content = content.replace(/š ï¸ {t\.nameDestiny\.colorResonance\.avoidColors}/g, '⚠️ {t.nameDestiny.colorResonance.avoidColors}');
content = content.replace(/<span>'¡<\/span> {t\.nameDestiny\.colorResonance\.tip}/g, '<span>💡</span> {t.nameDestiny.colorResonance.tip}');
content = content.replace(/"– {t\.nameDestiny\.guidance\.quranicGuidance}/g, '📖 {t.nameDestiny.guidance.quranicGuidance}');
content = content.replace(/š ï¸ {t\.nameDestiny\.guidance\.shadowToWatch}/g, '⚠️ {t.nameDestiny.guidance.shadowToWatch}');

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed final 4 emoji:');
console.log('   - ⚠️ Colors to avoid');
console.log('   - 💡 Color tip');
console.log('   - 📖 Quranic guidance');
console.log('   - ⚠️ Shadow to watch');
console.log('\n✨ All emoji are now fixed!');
