const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'features', 'ilm-huruf', 'IlmHurufPanel.tsx');

console.log('Fixing Letter Chemistry Arabic text...\n');

// Read the file
let content = fs.readFileSync(filePath, 'utf-8');

// Find and replace the corrupted Arabic text
const corruptedPattern = /\({t\.compatibilityResults\.letterChemistryArabic} • [^)]+\)/g;
const fixedText = "({t.compatibilityResults.letterChemistryArabic} • زواج الحروف)";

const matches = content.match(corruptedPattern);
if (matches) {
  console.log('Found corrupted text:');
  matches.forEach((match, i) => {
    console.log(`  ${i + 1}. ${match}`);
  });
  
  content = content.replace(corruptedPattern, fixedText);
  fs.writeFileSync(filePath, content, 'utf-8');
  
  console.log(`\n✅ Fixed to: ${fixedText}`);
  console.log('Arabic text: زواج الحروف (Zawāj al-Ḥurūf - Marriage of Letters)');
} else {
  console.log('No corrupted text found (might already be fixed)');
}
