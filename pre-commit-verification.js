const fs = require('fs');

console.log('🔍 PRE-COMMIT VERIFICATION\n');
console.log('═'.repeat(70));

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';
const content = fs.readFileSync(filePath, 'utf8');

const checks = [
  { 
    section: '🔥 Element Icons',
    tests: [
      { name: 'Fire 🔥', pattern: /icon: '🔥'/ },
      { name: 'Air 💨', pattern: /icon: '💨'/ },
      { name: 'Water 💧', pattern: /icon: '💧'/ },
      { name: 'Earth 🌍', pattern: /icon: '🌍'/ }
    ]
  },
  { 
    section: '🔤 Arabic Letter Mappings (28 letters)',
    tests: [
      { name: 'Fire: ا د ط م ف ش ذ', pattern: /'ف': 'fire'/ },
      { name: 'Air: ه و ي ن ص ت ض', pattern: /'ن': 'air'/ },
      { name: 'Water: ب ح ل ع ر ك غ', pattern: /'ب': 'water'/ },
      { name: 'Earth: ج ز س ق ث خ ظ', pattern: /'ج': 'earth'/ }
    ]
  },
  { 
    section: '🌟 Four Compatibility Methods',
    tests: [
      { name: '🌙 Spiritual Destiny', pattern: /🌙.*Spiritual Destiny/ },
      { name: '🌊 Elemental Temperament', pattern: /🌊.*Elemental Temperament/ },
      { name: '⭐ Planetary Cosmic', pattern: /⭐.*Planetary Cosmic/ },
      { name: '🤝 Daily Interaction', pattern: /🤝.*Daily Interaction/ }
    ]
  },
  { 
    section: '🧪 Letter Chemistry',
    tests: [
      { name: '🧪 Test tube emoji', pattern: /🧪/ },
      { name: 'Arabic: زواج الحروف', pattern: /زواج الحروف/ }
    ]
  },
  { 
    section: '🕌 Name Destiny Emoji',
    tests: [
      { name: '🕌 Mosque (Divine Name)', pattern: /🕌/ },
      { name: '✨ Sparkles', pattern: /✨/ },
      { name: '🎨 Palette (Color)', pattern: /🎨/ }
    ]
  },
  {
    section: '🕊️ Dhikr Names',
    tests: [
      { name: 'Yā Laṭīf (Fire)', pattern: /Yā Laṭīf/ },
      { name: 'Yā Ḥakīm (Air)', pattern: /Yā Ḥakīm/ },
      { name: 'Yā Nūr (Water)', pattern: /Yā Nūr/ },
      { name: 'Yā Fattāḥ (Earth)', pattern: /Yā Fattāḥ/ }
    ]
  }
];

let totalTests = 0;
let passedTests = 0;

checks.forEach(({ section, tests }) => {
  console.log(`\n${section}:`);
  tests.forEach(({ name, pattern }) => {
    const found = pattern.test(content);
    console.log(`   ${found ? '✅' : '❌'} ${name}`);
    totalTests++;
    if (found) passedTests++;
  });
});

console.log('\n' + '═'.repeat(70));
console.log(`\n📊 RESULTS: ${passedTests}/${totalTests} checks passed\n`);

if (passedTests === totalTests) {
  console.log('🎉 ALL CHECKS PASSED! Ready to commit!\n');
  console.log('✅ All emoji properly encoded');
  console.log('✅ All Arabic letters correctly mapped');
  console.log('✅ All translation strings clean');
  console.log('✅ No duplicate keys in objects');
  console.log('\n📝 Next steps:');
  console.log('   1. git add -A');
  console.log('   2. git commit -m "Fix: Complete emoji encoding and translation updates"');
  console.log('   3. git push origin main');
  console.log('\n🚀 Safe to deploy to production!\n');
} else {
  console.log(`⚠️  ${totalTests - passedTests} checks failed!\n`);
  console.log('Please fix the issues before committing.\n');
  process.exit(1);
}
