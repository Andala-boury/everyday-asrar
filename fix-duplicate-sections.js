const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'features', 'ilm-huruf', 'IlmHurufPanel.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the line with the first occurrence of duplicate sections
// We need to remove lines between "</div>" after Daily Interaction and before "Letter Chemistry - Your Personality Balance"

// Split into lines
const lines = content.split('\n');

// Find indices
let startRemoveIndex = -1;
let endRemoveIndex = -1;

for (let i = 0; i < lines.length; i++) {
  // Look for the marker after Daily Interaction section closes
  if (lines[i].includes('Daily Interaction') && lines[i].includes('Interaction Quotidienne')) {
    // Find the closing div after this section
    let divCount = 0;
    for (let j = i; j < Math.min(i + 50, lines.length); j++) {
      if (lines[j].includes('</div>')) {
        divCount++;
        if (divCount >= 3) {
          // Check if next line starts duplicate section
          if (j + 2 < lines.length && lines[j + 2].includes('Letter Chemistry - Enhanced')) {
            startRemoveIndex = j + 2;
            break;
          }
        }
      }
    }
  }
  
  // Find where real "Letter Chemistry - Your Personality Balance" starts
  if (lines[i].includes('Letter Chemistry - Your Personality Balance')) {
    endRemoveIndex = i;
    break;
  }
}

console.log('Start remove:', startRemoveIndex);
console.log('End remove:', endRemoveIndex);

if (startRemoveIndex > 0 && endRemoveIndex > 0 && startRemoveIndex < endRemoveIndex) {
  // Remove the duplicate lines
  const before = lines.slice(0, startRemoveIndex);
  const after = lines.slice(endRemoveIndex);
  
  const newLines = [...before, ...after];
  const newContent = newLines.join('\n');
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('✅ Removed duplicate sections from line', startRemoveIndex, 'to', endRemoveIndex);
  console.log('✅ Removed', endRemoveIndex - startRemoveIndex, 'lines');
} else {
  console.log('❌ Could not find duplicate sections to remove');
  console.log('Searching for pattern manually...');
  
  // Alternative approach: find the exact broken section
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '{/* Letter Chemistry - Enhanced */}') {
      console.log(`Found "Letter Chemistry - Enhanced" at line ${i + 1}`);
      // Check if next line is broken
      if (i + 1 < lines.length && lines[i + 1].includes('label="Overall Compatibility"')) {
        console.log('This is the broken section! Need to remove from here.');
        startRemoveIndex = i;
      }
    }
    if (lines[i].includes('Letter Chemistry - Your Personality Balance')) {
      console.log(`Found "Letter Chemistry - Your Personality Balance" at line ${i + 1}`);
      if (startRemoveIndex > 0) {
        endRemoveIndex = i;
      }
    }
  }
  
  if (startRemoveIndex > 0 && endRemoveIndex > 0) {
    const before = lines.slice(0, startRemoveIndex);
    const after = lines.slice(endRemoveIndex);
    
    const newLines = [...before, ...after];
    const newContent = newLines.join('\n');
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('✅ Removed duplicate sections (alternative method)');
  }
}
