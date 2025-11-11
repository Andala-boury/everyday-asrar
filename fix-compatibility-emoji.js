const fs = require('fs');
const path = require('path');

// List of all files in the compatibility module that may contain emoji
const compatibilityFiles = [
  'src/utils/fourLayerCompatibility.ts',
  'src/utils/relationshipCompatibility.ts',
  'src/components/RelationshipCompatibilityView.tsx',
  'src/components/CompatibilityGauge.tsx',
  'src/components/CompatibilityModeSwitcher.tsx',
  'src/features/compatibility/CompatibilityPanel.tsx',
  'src/features/ilm-huruf/IlmHurufPanel.tsx',
  'src/lib/translations.ts',
  'src/types/compatibility.ts',
  'src/constants/compatibility.ts'
];

// Comprehensive emoji fix mappings
const emojiFixMap = [
  // Element emojis (used in fourLayerCompatibility.ts)
  { corrupted: /ðŸ"¥/g, correct: '🔥', name: 'Fire' },
  { corrupted: /ðŸ'¨/g, correct: '💨', name: 'Air/Wind' },
  { corrupted: /ðŸ'§/g, correct: '💧', name: 'Water Droplet' },
  { corrupted: /ðŸŒ/g, correct: '🌍', name: 'Earth/Globe' },
  
  // Method emojis (used in RelationshipCompatibilityView.tsx)
  { corrupted: /ðŸŒ™/g, correct: '🌙', name: 'Moon' },
  { corrupted: /ðŸŒŠ/g, correct: '🌊', name: 'Ocean Wave' },
  { corrupted: /â­/g, correct: '⭐', name: 'Star' },
  { corrupted: /­/g, correct: '⭐', name: 'Star (variant)' },
  
  // Other compatibility-related emoji
  { corrupted: /âœ¨/g, correct: '✨', name: 'Sparkles' },
  { corrupted: /ðŸ'—/g, correct: '💗', name: 'Heart' },
  { corrupted: /ðŸ¤/g, correct: '🤝', name: 'Handshake' },
  { corrupted: /¤/g, correct: '🤝', name: 'Handshake (variant)' },
  { corrupted: /ðŸ'«/g, correct: '💫', name: 'Dizzy' },
  { corrupted: /ðŸŒŸ/g, correct: '🌟', name: 'Glowing Star' },
  { corrupted: /ðŸ"®/g, correct: '🔮', name: 'Crystal Ball' },
  { corrupted: /ðŸ'Ž/g, correct: '💎', name: 'Gem' },
  
  // Number emoji (used in comments in relationshipCompatibility.ts)
  { corrupted: /1ï¸âƒ£/g, correct: '1️⃣', name: 'Keycap 1' },
  { corrupted: /2ï¸âƒ£/g, correct: '2️⃣', name: 'Keycap 2' },
  { corrupted: /3ï¸âƒ£/g, correct: '3️⃣', name: 'Keycap 3' },
  { corrupted: /4ï¸âƒ£/g, correct: '4️⃣', name: 'Keycap 4' },
  
  // Special characters
  { corrupted: /Ã—/g, correct: '×', name: 'Multiplication sign' },
  { corrupted: /—/g, correct: '×', name: 'Multiplication (variant)' },
  { corrupted: /â€¢/g, correct: '•', name: 'Bullet' },
  { corrupted: /PlanÃ©taire/g, correct: 'Planétaire', name: 'French: Planétaire' },
  { corrupted: /©/g, correct: 'é', name: 'French: é' },
  { corrupted: /Ã¨/g, correct: 'è', name: 'French: è' },
  { corrupted: /Ã /g, correct: 'à', name: 'French: à' },
  { corrupted: /Ã®/g, correct: 'î', name: 'French: î' },
];

console.log('🔧 Starting Compatibility Module Emoji Fix...\n');

let totalFilesProcessed = 0;
let totalFilesFixed = 0;
let totalReplacements = 0;

compatibilityFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  console.log(`📄 Checking: ${filePath}`);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let fileModified = false;
    let fileReplacements = 0;
    
    // Apply all emoji fixes
    emojiFixMap.forEach(fix => {
      const matches = content.match(fix.corrupted);
      if (matches && matches.length > 0) {
        console.log(`   ✅ Found ${matches.length} corrupted ${fix.name} emoji`);
        content = content.replace(fix.corrupted, fix.correct);
        fileModified = true;
        fileReplacements += matches.length;
        totalReplacements += matches.length;
      }
    });
    
    // Write back if modified
    if (fileModified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`   ✨ Fixed ${fileReplacements} emoji in ${filePath}\n`);
      totalFilesFixed++;
    } else {
      console.log(`   ✓ No corrupted emoji found\n`);
    }
    
    totalFilesProcessed++;
    
  } catch (error) {
    console.error(`   ❌ Error processing ${filePath}:`, error.message);
  }
});

console.log('═══════════════════════════════════════════════');
console.log('📊 Summary:');
console.log(`   Files processed: ${totalFilesProcessed}/${compatibilityFiles.length}`);
console.log(`   Files fixed: ${totalFilesFixed}`);
console.log(`   Total replacements: ${totalReplacements}`);
console.log('═══════════════════════════════════════════════');

if (totalFilesFixed > 0) {
  console.log('\n✅ SUCCESS! All compatibility module emoji have been fixed!');
  console.log('   Your emoji will now display correctly in production.');
} else {
  console.log('\n✅ All compatibility module emoji are already correctly encoded!');
  console.log('   No fixes were needed.');
}

console.log('\n📝 Next steps:');
console.log('   1. Review the changes');
console.log('   2. Test locally with: npm run dev');
console.log('   3. Commit and push to production');
