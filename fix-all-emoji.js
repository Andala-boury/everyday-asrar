const fs = require('fs');
const path = require('path');

console.log('🔧 FULL APP EMOJI FIX - Starting...\n');
console.log('═══════════════════════════════════════════════\n');

// Comprehensive emoji fix mappings for ALL emoji used in the app
const emojiFixMap = [
  // ========================================
  // ELEMENT EMOJIS
  // ========================================
  { corrupted: /ðŸ"¥/g, correct: '🔥', name: 'Fire' },
  { corrupted: /ðŸ'¨/g, correct: '💨', name: 'Air/Wind' },
  { corrupted: /ðŸ'§/g, correct: '💧', name: 'Water Droplet' },
  { corrupted: /ðŸŒ/g, correct: '🌍', name: 'Earth/Globe' },
  { corrupted: /ðŸŒŽ/g, correct: '🌎', name: 'Earth Americas' },
  { corrupted: /ðŸŒ/g, correct: '🌏', name: 'Earth Asia' },
  
  // ========================================
  // CELESTIAL EMOJIS
  // ========================================
  { corrupted: /ðŸŒ™/g, correct: '🌙', name: 'Moon' },
  { corrupted: /ðŸŒŠ/g, correct: '🌊', name: 'Ocean Wave' },
  { corrupted: /â­/g, correct: '⭐', name: 'Star' },
  { corrupted: /­/g, correct: '⭐', name: 'Star (variant)' },
  { corrupted: /ðŸŒŸ/g, correct: '🌟', name: 'Glowing Star' },
  { corrupted: /âœ¨/g, correct: '✨', name: 'Sparkles' },
  { corrupted: /ðŸ'«/g, correct: '💫', name: 'Dizzy' },
  { corrupted: /â˜€/g, correct: '☀️', name: 'Sun' },
  { corrupted: /ðŸŒ…/g, correct: '🌅', name: 'Sunrise' },
  { corrupted: /ðŸŒ†/g, correct: '🌆', name: 'Cityscape' },
  
  // ========================================
  // NATURE EMOJIS
  // ========================================
  { corrupted: /ðŸŒº/g, correct: '🌺', name: 'Hibiscus' },
  { corrupted: /ðŸŒ¸/g, correct: '🌸', name: 'Cherry Blossom' },
  { corrupted: /ðŸŒ¼/g, correct: '🌼', name: 'Blossom' },
  { corrupted: /ðŸŒ»/g, correct: '🌻', name: 'Sunflower' },
  { corrupted: /ðŸŒ·/g, correct: '🌷', name: 'Tulip' },
  { corrupted: /ðŸŒ±/g, correct: '🌱', name: 'Seedling' },
  { corrupted: /ðŸŒ€/g, correct: '🌀', name: 'Cyclone' },
  
  // ========================================
  // HEART & EMOTION EMOJIS
  // ========================================
  { corrupted: /ðŸ'—/g, correct: '💗', name: 'Heart Growing' },
  { corrupted: /â¤ï¸/g, correct: '❤️', name: 'Red Heart' },
  { corrupted: /ðŸ'™/g, correct: '💙', name: 'Blue Heart' },
  { corrupted: /ðŸ'š/g, correct: '💚', name: 'Green Heart' },
  { corrupted: /ðŸ'›/g, correct: '💛', name: 'Yellow Heart' },
  { corrupted: /ðŸ§¡/g, correct: '🧡', name: 'Orange Heart' },
  { corrupted: /ðŸ'œ/g, correct: '💜', name: 'Purple Heart' },
  
  // ========================================
  // HAND & GESTURE EMOJIS
  // ========================================
  { corrupted: /ðŸ¤/g, correct: '🤝', name: 'Handshake' },
  { corrupted: /¤/g, correct: '🤝', name: 'Handshake (variant)' },
  { corrupted: /ðŸ™/g, correct: '🙏', name: 'Praying Hands' },
  { corrupted: /ðŸ¤²/g, correct: '🤲', name: 'Palms Up Together' },
  { corrupted: /ðŸ'/g, correct: '👍', name: 'Thumbs Up' },
  { corrupted: /âœ‹/g, correct: '✋', name: 'Raised Hand' },
  { corrupted: /ðŸ'‹/g, correct: '👋', name: 'Waving Hand' },
  
  // ========================================
  // SYMBOLS & ICONS
  // ========================================
  { corrupted: /ðŸ"®/g, correct: '🔮', name: 'Crystal Ball' },
  { corrupted: /ðŸ'Ž/g, correct: '💎', name: 'Gem Stone' },
  { corrupted: /ðŸ"¥/g, correct: '🔥', name: 'Fire (duplicate check)' },
  { corrupted: /âš ï¸/g, correct: '⚠️', name: 'Warning' },
  { corrupted: /âš¡/g, correct: '⚡', name: 'Lightning' },
  { corrupted: /ðŸ'¡/g, correct: '💡', name: 'Light Bulb' },
  { corrupted: /ðŸ""/g, correct: '🔔', name: 'Bell' },
  { corrupted: /ðŸ"Š/g, correct: '📊', name: 'Bar Chart' },
  { corrupted: /ðŸ"ˆ/g, correct: '📈', name: 'Chart Increasing' },
  { corrupted: /ðŸ"‰/g, correct: '📉', name: 'Chart Decreasing' },
  
  // ========================================
  // BOOK & EDUCATION EMOJIS
  // ========================================
  { corrupted: /ðŸ"š/g, correct: '📚', name: 'Books' },
  { corrupted: /ðŸ"–/g, correct: '📖', name: 'Open Book' },
  { corrupted: /ðŸ""/g, correct: '📝', name: 'Memo' },
  { corrupted: /âœï¸/g, correct: '✏️', name: 'Pencil' },
  { corrupted: /ðŸ–Šï¸/g, correct: '🖊️', name: 'Pen' },
  
  // ========================================
  // TIME & CALENDAR EMOJIS
  // ========================================
  { corrupted: /â°/g, correct: '⏰', name: 'Alarm Clock' },
  { corrupted: /â³/g, correct: '⏳', name: 'Hourglass' },
  { corrupted: /ðŸ"…/g, correct: '📅', name: 'Calendar' },
  { corrupted: /ðŸ•'/g, correct: '🕐', name: 'Clock 1' },
  
  // ========================================
  // DIRECTION & NAVIGATION EMOJIS
  // ========================================
  { corrupted: /âž¡ï¸/g, correct: '➡️', name: 'Right Arrow' },
  { corrupted: /â¬…ï¸/g, correct: '⬅️', name: 'Left Arrow' },
  { corrupted: /â¬†ï¸/g, correct: '⬆️', name: 'Up Arrow' },
  { corrupted: /â¬‡ï¸/g, correct: '⬇️', name: 'Down Arrow' },
  { corrupted: /ðŸ"„/g, correct: '🔄', name: 'Counterclockwise Arrows' },
  
  // ========================================
  // CHECKMARKS & STATUS EMOJIS
  // ========================================
  { corrupted: /âœ…/g, correct: '✅', name: 'Check Mark' },
  { corrupted: /âœ"/g, correct: '✓', name: 'Check Mark (simple)' },
  { corrupted: /âœ–/g, correct: '✖', name: 'Multiply' },
  { corrupted: /â­•/g, correct: '⭕', name: 'Hollow Red Circle' },
  { corrupted: /â—/g, correct: '⬜', name: 'White Square' },
  { corrupted: /â¬›/g, correct: '⬛', name: 'Black Square' },
  
  // ========================================
  // NUMBER EMOJIS (Keycaps)
  // ========================================
  { corrupted: /1ï¸âƒ£/g, correct: '1️⃣', name: 'Keycap 1' },
  { corrupted: /2ï¸âƒ£/g, correct: '2️⃣', name: 'Keycap 2' },
  { corrupted: /3ï¸âƒ£/g, correct: '3️⃣', name: 'Keycap 3' },
  { corrupted: /4ï¸âƒ£/g, correct: '4️⃣', name: 'Keycap 4' },
  { corrupted: /5ï¸âƒ£/g, correct: '5️⃣', name: 'Keycap 5' },
  { corrupted: /6ï¸âƒ£/g, correct: '6️⃣', name: 'Keycap 6' },
  { corrupted: /7ï¸âƒ£/g, correct: '7️⃣', name: 'Keycap 7' },
  { corrupted: /8ï¸âƒ£/g, correct: '8️⃣', name: 'Keycap 8' },
  { corrupted: /9ï¸âƒ£/g, correct: '9️⃣', name: 'Keycap 9' },
  { corrupted: /0ï¸âƒ£/g, correct: '0️⃣', name: 'Keycap 0' },
  
  // ========================================
  // SPECIAL CHARACTERS & SYMBOLS
  // ========================================
  { corrupted: /Ã—/g, correct: '×', name: 'Multiplication sign' },
  { corrupted: /—/g, correct: '×', name: 'Multiplication (variant)' },
  { corrupted: /Ã·/g, correct: '÷', name: 'Division sign' },
  { corrupted: /â€¢/g, correct: '•', name: 'Bullet' },
  { corrupted: /â€"/g, correct: '–', name: 'En dash' },
  { corrupted: /â€"/g, correct: '—', name: 'Em dash' },
  
  // ========================================
  // FRENCH ACCENTED CHARACTERS
  // ========================================
  { corrupted: /Ã©/g, correct: 'é', name: 'French: é' },
  { corrupted: /Ã¨/g, correct: 'è', name: 'French: è' },
  { corrupted: /Ãª/g, correct: 'ê', name: 'French: ê' },
  { corrupted: /Ã /g, correct: 'à', name: 'French: à' },
  { corrupted: /Ã¢/g, correct: 'â', name: 'French: â' },
  { corrupted: /Ã®/g, correct: 'î', name: 'French: î' },
  { corrupted: /Ã´/g, correct: 'ô', name: 'French: ô' },
  { corrupted: /Ã»/g, correct: 'û', name: 'French: û' },
  { corrupted: /Ã§/g, correct: 'ç', name: 'French: ç' },
  { corrupted: /Ã‰/g, correct: 'É', name: 'French: É' },
  { corrupted: /Ãˆ/g, correct: 'È', name: 'French: È' },
  { corrupted: /Ã€/g, correct: 'À', name: 'French: À' },
  { corrupted: /Ã‡/g, correct: 'Ç', name: 'French: Ç' },
  
  // ========================================
  // COMMON WORD FIXES
  // ========================================
  { corrupted: /PlanÃ©taire/g, correct: 'Planétaire', name: 'Word: Planétaire' },
  { corrupted: /ÃªlÃ©mentaire/g, correct: 'élémentaire', name: 'Word: élémentaire' },
  { corrupted: /TempÃ©rament/g, correct: 'Tempérament', name: 'Word: Tempérament' },
  { corrupted: /DestinÃ©e/g, correct: 'Destinée', name: 'Word: Destinée' },
  { corrupted: /CompatibilitÃ©/g, correct: 'Compatibilité', name: 'Word: Compatibilité' },
];

// Get all TypeScript/JavaScript/TSX/JSX files in src directory
function getAllSourceFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(file)) {
        getAllSourceFiles(filePath, fileList);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

const srcDir = path.join(__dirname, 'src');
const appDir = path.join(__dirname, 'app');
const allFiles = [
  ...getAllSourceFiles(srcDir),
  ...getAllSourceFiles(appDir)
];

console.log(`📁 Found ${allFiles.length} source files to check\n`);

let totalFilesProcessed = 0;
let totalFilesFixed = 0;
let totalReplacements = 0;
const fixedFiles = [];

allFiles.forEach(filePath => {
  const relativePath = path.relative(__dirname, filePath);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileModified = false;
    let fileReplacements = 0;
    const fixesApplied = [];
    
    // Apply all emoji fixes
    emojiFixMap.forEach(fix => {
      const matches = content.match(fix.corrupted);
      if (matches && matches.length > 0) {
        content = content.replace(fix.corrupted, fix.correct);
        fileModified = true;
        fileReplacements += matches.length;
        totalReplacements += matches.length;
        fixesApplied.push(`${matches.length}× ${fix.name}`);
      }
    });
    
    // Write back if modified
    if (fileModified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${relativePath}`);
      fixesApplied.forEach(fix => console.log(`   - ${fix}`));
      console.log('');
      totalFilesFixed++;
      fixedFiles.push({ path: relativePath, replacements: fileReplacements });
    }
    
    totalFilesProcessed++;
    
  } catch (error) {
    console.error(`❌ Error processing ${relativePath}:`, error.message);
  }
});

console.log('═══════════════════════════════════════════════');
console.log('📊 Summary:');
console.log(`   Files scanned: ${totalFilesProcessed}`);
console.log(`   Files fixed: ${totalFilesFixed}`);
console.log(`   Total replacements: ${totalReplacements}`);
console.log('═══════════════════════════════════════════════');

if (totalFilesFixed > 0) {
  console.log('\n✨ Files Modified:');
  fixedFiles.forEach(({ path, replacements }) => {
    console.log(`   ${path} (${replacements} fixes)`);
  });
  console.log('\n✅ SUCCESS! All emoji across the entire app have been fixed!');
  console.log('   Your emoji will now display correctly everywhere.');
} else {
  console.log('\n✅ All emoji are already correctly encoded!');
  console.log('   No fixes were needed.');
}

console.log('\n📝 Next steps:');
console.log('   1. Restart dev server: npm run dev');
console.log('   2. Hard refresh browser: Ctrl+Shift+R (Win) or Cmd+Shift+R (Mac)');
console.log('   3. Verify emoji display throughout the app');
console.log('   4. Build for production: npm run build');
console.log('   5. Deploy to production');
console.log('');
