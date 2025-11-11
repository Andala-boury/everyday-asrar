const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Fixing all remaining corrupted emoji in Name Destiny sections...\n');

let content = fs.readFileSync(filePath, 'utf8');
const before = content;

// Color Resonance Section (lines ~2817, 2832, 2847)
content = content.replace(/œ… {t\.nameDestiny\.colorResonance\.bestColors}/g, '✅ {t.nameDestiny.colorResonance.bestColors}');
content = content.replace(/š ï¸ {t\.nameDestiny\.colorResonance\.avoidColors}/g, '⚠️ {t.nameDestiny.colorResonance.avoidColors}');
content = content.replace(/<span>'¡<\/span>/g, '<span>💡</span>');

// Mother Analysis Section (line ~3024)
content = content.replace(/€¢/g, '•');

// Mother Element Comparison (line ~3049)
content = content.replace(/†"/g, '↔');

// Geometry Section (line ~3251)  
content = content.replace(/GEOMETRY_KEYWORDS\.angular\.join\(' €¢ '\)/g, "GEOMETRY_KEYWORDS.angular.join(' • ')");
content = content.replace(/GEOMETRY_KEYWORDS\.round\.join\(' €¢ '\)/g, "GEOMETRY_KEYWORDS.round.join(' • ')");
content = content.replace(/GEOMETRY_KEYWORDS\.flat\.join\(' €¢ '\)/g, "GEOMETRY_KEYWORDS.flat.join(' • ')");
content = content.replace(/GEOMETRY_KEYWORDS\.vertical\.join\(' €¢ '\)/g, "GEOMETRY_KEYWORDS.vertical.join(' • ')");

// Life Guidance Section (lines ~3346, 3371, 3384, 3399, 3410)
content = content.replace(/œ¨ {t\.nameDestiny\.guidance\.yourPath}/g, '🧭 {t.nameDestiny.guidance.yourPath}');
content = content.replace(/•Š {t\.nameDestiny\.guidance\.spiritualPractice}/g, '🕌 {t.nameDestiny.guidance.spiritualPractice}');
content = content.replace(/"– {t\.nameDestiny\.guidance\.quranicGuidance}/g, '📖 {t.nameDestiny.guidance.quranicGuidance}');
content = content.replace(/§⭐ {t\.nameDestiny\.guidance\.practicalAction}/g, '🛠️ {t.nameDestiny.guidance.practicalAction}');
content = content.replace(/š ï¸ {t\.nameDestiny\.guidance\.shadowToWatch}/g, '⚠️ {t.nameDestiny.guidance.shadowToWatch}');

// Fix any remaining French text corruption
content = content.replace(/Votre destin de vie.*?¢me aspire/gs, function(match) {
  return match.replace(/¢me/g, 'âme');
});

const changes = content !== before;

if (changes) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Fixed all Name Destiny section emoji:');
  console.log('\n📊 Color Resonance:');
  console.log('   - ✅ Best colors');
  console.log('   - ⚠️  Colors to avoid');
  console.log('   - 💡 Tip');
  console.log('\n👤 Life Guidance:');
  console.log('   - 🧭 Your Path');
  console.log('   - 🕌 Spiritual Practice');
  console.log('   - 📖 Quranic Guidance');
  console.log('   - 🛠️  Practical Action');
  console.log('   - ⚠️  Shadow to Watch');
  console.log('\n🔗 Other Sections:');
  console.log('   - • Bullet points');
  console.log('   - ↔ Element comparison arrows');
  console.log('\n✨ All sections will now display correctly!');
} else {
  console.log('⚠️  No corrupted emoji found');
}
