const fs = require('fs');

const filePath = './src/features/ilm-huruf/IlmHurufPanel.tsx';

console.log('🔍 Fixing emoji by line-level replacement...\n');

let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Line 2832: Colors to avoid
if (lines[2831] && lines[2831].includes('avoidColors')) {
  lines[2831] = '                  ⚠️ {t.nameDestiny.colorResonance.avoidColors}';
  console.log('✅ Fixed line 2832: Colors to avoid');
}

// Line 2846: Tip
if (lines[2845] && lines[2845].includes('colorResonance.tip')) {
  lines[2845] = '                  <span>💡</span> {t.nameDestiny.colorResonance.tip}';
  console.log('✅ Fixed line 2846: Color tip');
}

// Line 3389: Quranic Guidance  
if (lines[3388] && lines[3388].includes('quranicGuidance')) {
  lines[3388] = '              📖 {t.nameDestiny.guidance.quranicGuidance}';
  console.log('✅ Fixed line 3389: Quranic guidance');
}

// Line 3413: Shadow to Watch
if (lines[3412] && lines[3412].includes('shadowToWatch')) {
  lines[3412] = '              ⚠️ {t.nameDestiny.guidance.shadowToWatch}';
  console.log('✅ Fixed line 3413: Shadow to watch');
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('\n✨ All 4 emoji fixed by direct line replacement!');
