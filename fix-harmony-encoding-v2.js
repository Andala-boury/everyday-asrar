const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'features', 'ilm-huruf', 'IlmHurufPanel.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Looking for problematic characters...');

// Find lines with the issue
const lines = content.split('\n');
let fixedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Fire element
  if (line.includes('combined.fire >= 15')) {
    console.log(`Line ${i + 1} BEFORE: ${line}`);
    lines[i] = line.replace(/`[^`]+combined\.fire\}%`/, '`🔥 ${combined.fire}%`');
    console.log(`Line ${i + 1} AFTER: ${lines[i]}`);
    fixedCount++;
  }
  
  // Air element
  if (line.includes('combined.air >= 15')) {
    console.log(`Line ${i + 1} BEFORE: ${line}`);
    lines[i] = line.replace(/`[^`]+combined\.air\}%`/, '`🌬️ ${combined.air}%`');
    console.log(`Line ${i + 1} AFTER: ${lines[i]}`);
    fixedCount++;
  }
  
  // Water element
  if (line.includes('combined.water >= 15')) {
    console.log(`Line ${i + 1} BEFORE: ${line}`);
    lines[i] = line.replace(/`[^`]+combined\.water\}%`/, '`💧 ${combined.water}%`');
    console.log(`Line ${i + 1} AFTER: ${lines[i]}`);
    fixedCount++;
  }
  
  // Earth element
  if (line.includes('combined.earth >= 15')) {
    console.log(`Line ${i + 1} BEFORE: ${line}`);
    lines[i] = line.replace(/`[^`]+combined\.earth\}%`/, '`🌍 ${combined.earth}%`');
    console.log(`Line ${i + 1} AFTER: ${lines[i]}`);
    fixedCount++;
  }
}

content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf8');
console.log(`\n✅ Fixed ${fixedCount} lines with encoding issues!`);
