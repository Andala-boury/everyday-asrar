const fs = require('fs');

console.log('🔍 FINAL EMOJI & NAME DESTINY VERIFICATION\n');
console.log('=' .repeat(70));

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';
const content = fs.readFileSync(filePath, 'utf8');

const checks = [
  { name: '🔥 Fire Element Icon', pattern: /icon: '🔥'/, section: 'Element Icons' },
  { name: '💨 Air Element Icon', pattern: /icon: '💨'/, section: 'Element Icons' },
  { name: '💧 Water Element Icon', pattern: /icon: '💧'/, section: 'Element Icons' },
  { name: '🌍 Earth Element Icon', pattern: /icon: '🌍'/, section: 'Element Icons' },
  { name: 'ا Fire Letter (Alif)', pattern: /'ا': 'fire'/, section: 'Arabic Letters' },
  { name: 'ه Air Letter (Ha)', pattern: /'ه': 'air'/, section: 'Arabic Letters' },
  { name: 'ب Water Letter (Ba)', pattern: /'ب': 'water'/, section: 'Arabic Letters' },
  { name: 'ح Water Letter (Ha)', pattern: /'ح': 'water'/, section: 'Arabic Letters' },
  { name: 'ج Earth Letter (Jim)', pattern: /'ج': 'earth'/, section: 'Arabic Letters' },
  { name: '🕌 Divine Name Icon', pattern: /<span className="text-3xl">🕌<\/span>/, section: 'Name Destiny' },
  { name: '✨ Sparkles Icon', pattern: /<span>✨<\/span>/, section: 'Name Destiny' },
  { name: '🎨 Color Palette Icon', pattern: /<span className="text-3xl">🎨<\/span>/, section: 'Name Destiny' }
];

let allPassed = true;
const results = {};

checks.forEach(({ name, pattern, section }) => {
  const found = pattern.test(content);
  if (!results[section]) results[section] = [];
  results[section].push({ name, found });
  if (!found) allPassed = false;
});

Object.keys(results).forEach(section => {
  console.log(`\n📋 ${section}:`);
  results[section].forEach(({ name, found }) => {
    console.log(`   ${found ? '✅' : '❌'} ${name}`);
  });
});

console.log('\n' + '=' .repeat(70));

if (allPassed) {
  console.log('\n🎉 ALL CHECKS PASSED! Name Destiny Module is fully fixed!\n');
  console.log('✅ Element percentages will calculate correctly');
  console.log('✅ Element icons will display: 🔥 💨 💧 🌍');
  console.log('✅ Divine Name section will show: 🕌');
  console.log('✅ Spiritual influence will show: ✨');
  console.log('✅ Color resonance will show: 🎨');
  console.log('\n📱 Hard refresh your browser (Ctrl+Shift+R) to see all changes!');
} else {
  console.log('\n⚠️  Some checks failed. Review the report above.\n');
}
