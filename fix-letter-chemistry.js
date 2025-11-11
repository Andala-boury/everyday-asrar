const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'features', 'ilm-huruf', 'IlmHurufPanel.tsx');

console.log('Fixing Letter Chemistry section...\n');

// Read the file
let content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

// Fix line 3724 (index 3724) - corrupted emoji
const line3724Index = 3724;
if (lines[line3724Index].includes('œ¨')) {
  console.log(`Line ${line3724Index + 1} BEFORE: ${lines[line3724Index]}`);
  lines[line3724Index] = "                {language === 'fr' ? '🧪 Chimie des Lettres' : '🧪 Letter Chemistry'}";
  console.log(`Line ${line3724Index + 1} AFTER:  ${lines[line3724Index]}\n`);
} else {
  console.log(`Line ${line3724Index + 1}: Already fixed or different content`);
}

// Fix line 3728 (index 3728) - corrupted Arabic text
const line3728Index = 3728;
if (lines[line3728Index].includes('Ø²ÙˆØ§Ø¬') || lines[line3728Index].includes('Ø')) {
  console.log(`Line ${line3728Index + 1} BEFORE: ${lines[line3728Index]}`);
  lines[line3728Index] = "                ({t.compatibilityResults.letterChemistryArabic} • زواج الحروف)";
  console.log(`Line ${line3728Index + 1} AFTER:  ${lines[line3728Index]}\n`);
} else {
  console.log(`Line ${line3728Index + 1}: Already fixed or different content`);
}

// Write back to file
fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');

console.log('✅ Letter Chemistry section fixed!');
console.log('Fixed emoji: 🧪 (test tube for chemistry)');
console.log('Fixed Arabic: زواج الحروف (Zawāj al-Ḥurūf - Marriage of Letters)');
