const fs = require('fs');

console.log('🔍 Scanning for remaining corrupted emoji...\n');

const fixes = [
  {
    file: './src/features/ilm-huruf/IlmHurufPanel.tsx',
    replacements: [
      { from: /œ×/g, to: '✗' },  // Warning X symbol
      { from: /€ ‰viter/g, to: 'À Éviter' }  // French "Avoid"
    ]
  },
  {
    file: './src/utils/fourLayerCompatibility.ts',
    replacements: [
      { from: /letters×use/g, to: 'letters, use' },
      { from: /aloud×trust/g, to: 'aloud. Trust' },
      { from: /amour×utilisez/g, to: 'amour, utilisez' },
      { from: /haute×faites/g, to: 'haute. Faites' },
      { from: /garden×growth/g, to: 'garden—growth' },
      { from: /jardin×la/g, to: 'jardin—la' },
      { from: /change×try/g, to: 'change. Try' },
      { from: /doux×essayez/g, to: 'doux. Essayez' }
    ]
  }
];

let totalFixed = 0;

fixes.forEach(({ file, replacements }) => {
  if (!fs.existsSync(file)) {
    console.log(`⚠️  ${file} not found, skipping...`);
    return;
  }

  let content = fs.readFileSync(file, 'utf8');
  const before = content;
  let fileFixed = 0;

  replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      fileFixed += matches.length;
      content = content.replace(from, to);
    }
  });

  if (content !== before) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ ${file}: Fixed ${fileFixed} issues`);
    totalFixed += fileFixed;
  }
});

console.log(`\n🎉 Total fixes: ${totalFixed}`);
console.log('\n📋 Summary of what was fixed:');
console.log('   - Warning symbols (œ× → ✗)');
console.log('   - French text (€ ‰viter → À Éviter)');
console.log('   - Corrupted punctuation (× → proper punctuation)');
