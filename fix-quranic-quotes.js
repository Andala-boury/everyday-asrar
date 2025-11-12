/**
 * Fix all single quotes in Quranic connections to use template literals
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'utils', 'enhancedLifePath.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Find and replace the QURANIC_CONNECTIONS section
// Look for unescaped apostrophes in French strings and fix them

const lines = content.split('\n');
const fixedLines = [];
let inQuranicSection = false;
let inStringValue = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if we're in the QURANIC_CONNECTIONS section
  if (line.includes('const QURANIC_CONNECTIONS')) {
    inQuranicSection = true;
  }
  
  // Check if we're leaving the section
  if (inQuranicSection && line.includes('// Export getter function for Quranic')) {
    inQuranicSection = false;
  }
  
  // If in section, fix apostrophes in strings
  if (inQuranicSection && (line.includes("en: '") || line.includes("fr: '") || line.includes("arabic: '"))) {
    // Replace single quotes with template literals
    const fixed = line
      .replace(/en: '(.+)'(,?)$/, "en: `$1`$2")
      .replace(/fr: '(.+)'(,?)$/, "fr: `$1`$2")
      .replace(/arabic: '(.+)'(,?)$/, "arabic: `$1`$2");
    
    fixedLines.push(fixed);
  } else {
    fixedLines.push(line);
  }
}

fs.writeFileSync(filePath, fixedLines.join('\n'), 'utf8');
console.log('✅ Fixed all quotes in QURANIC_CONNECTIONS');
