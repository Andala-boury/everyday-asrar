const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Fixing corrupted emoji in Name Destiny section...\n');

let content = fs.readFileSync(filePath, 'utf8');
const before = content;

// Fix Divine Name Resonance section emoji
content = content.replace(/<span className="text-3xl">•Šï¸<\/span>/g, '<span className="text-3xl">🕌</span>');
content = content.replace(/<span>"¹<\/span>/g, '<span>✨</span>');

// Fix Color Resonance section emoji  
content = content.replace(/<span className="text-3xl">Ž¨<\/span>/g, '<span className="text-3xl">🎨</span>');
content = content.replace(/Ž¨ {t\.nameDestiny\.colorResonance\.primary}/g, '🎨 {t.nameDestiny.colorResonance.primary}');
content = content.replace(/Ž¨ {t\.nameDestiny\.colorResonance\.secondary}/g, '🎨 {t.nameDestiny.colorResonance.secondary}');

// Fix any remaining corrupted emoji patterns
content = content.replace(/"œ/g, '✓');  // Checkmark
content = content.replace(/"ï/g, '⚠');  // Warning

const changes = content !== before;

if (changes) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Fixed Name Destiny section emoji:');
  console.log('   - 🕌 Mosque (Divine Name Resonance)');
  console.log('   - ✨ Sparkles (Spiritual Influence)');
  console.log('   - 🎨 Artist Palette (Color Resonance)');
  console.log('\n✨ Name Destiny section will now display correctly!');
} else {
  console.log('⚠️  No corrupted emoji found to fix');
}
