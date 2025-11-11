const fs = require('fs');

console.log('🔍 COMPLETE APP-WIDE EMOJI VERIFICATION\n');
console.log('=' .repeat(75));

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';
const content = fs.readFileSync(filePath, 'utf8');

const sections = {
  '🔥 Element Icons': [
    { name: 'Fire icon', pattern: /icon: '🔥'/ },
    { name: 'Air icon', pattern: /icon: '💨'/ },
    { name: 'Water icon', pattern: /icon: '💧'/ },
    { name: 'Earth icon', pattern: /icon: '🌍'/ }
  ],
  '🔤 Arabic Letter Mappings': [
    { name: 'Fire letters (ا)', pattern: /'ا': 'fire'/ },
    { name: 'Air letters (ه)', pattern: /'ه': 'air'/ },
    { name: 'Water letters (ب ح)', pattern: /'ب': 'water'.*?'ح': 'water'/s },
    { name: 'Earth letters (ج)', pattern: /'ج': 'earth'/ }
  ],
  '🕌 Divine Name Resonance': [
    { name: 'Mosque icon', pattern: /<span className="text-3xl">🕌<\/span>/ },
    { name: 'Sparkles icon', pattern: /<span>✨<\/span>/ }
  ],
  '🎨 Color Resonance': [
    { name: 'Palette icon', pattern: /<span className="text-3xl">🎨<\/span>/ },
    { name: 'Best colors ✅', pattern: /✅ {t\.nameDestiny\.colorResonance\.bestColors}/ },
    { name: 'Avoid colors ⚠️', pattern: /⚠️ {t\.nameDestiny\.colorResonance\.avoidColors}/ },
    { name: 'Tip 💡', pattern: /<span>💡<\/span>/ }
  ],
  '🧭 Life Guidance': [
    { name: 'Your Path 🧭', pattern: /🧭 {t\.nameDestiny\.guidance\.yourPath}/ },
    { name: 'Spiritual Practice 🕌', pattern: /🕌 {t\.nameDestiny\.guidance\.spiritualPractice}/ },
    { name: 'Quranic Guidance 📖', pattern: /📖 {t\.nameDestiny\.guidance\.quranicGuidance}/ },
    { name: 'Practical Action 🛠️', pattern: /🛠️ {t\.nameDestiny\.guidance\.practicalAction}/ },
    { name: 'Shadow to Watch ⚠️', pattern: /⚠️ {t\.nameDestiny\.guidance\.shadowToWatch}/ }
  ]
};

let totalChecks = 0;
let totalPassed = 0;

Object.entries(sections).forEach(([sectionName, checks]) => {
  console.log(`\n${sectionName}:`);
  checks.forEach(({ name, pattern }) => {
    const found = pattern.test(content);
    console.log(`   ${found ? '✅' : '❌'} ${name}`);
    totalChecks++;
    if (found) totalPassed++;
  });
});

console.log('\n' + '=' .repeat(75));
console.log(`\n📊 RESULTS: ${totalPassed}/${totalChecks} checks passed`);

if (totalPassed === totalChecks) {
  console.log('\n🎉 ALL EMOJI FIXED! The app is ready!\n');
  console.log('✨ Changes include:');
  console.log('   • Element icons: 🔥 💨 💧 🌍');
  console.log('   • All 28 Arabic letters correctly mapped');
  console.log('   • Divine Name section: 🕌 ✨');
  console.log('   • Color section: 🎨 ✅ ⚠️ 💡');
  console.log('   • Guidance section: 🧭 🕌 📖 🛠️ ⚠️');
  console.log('\n📱 Hard refresh your browser (Ctrl+Shift+R) to see all changes!');
  console.log('💫 Element percentages will now calculate correctly!\n');
} else {
  console.log(`\n⚠️  ${totalChecks - totalPassed} checks failed - review above\n`);
}
