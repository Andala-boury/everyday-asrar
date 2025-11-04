/**
 * Translation Verification Script
 * Checks that all previously identified hardcoded strings have been replaced with translation keys
 */

const fs = require('fs');
const path = require('path');

// Define the hardcoded strings we expect to be translated
const EXPECTED_TRANSLATIONS = [
  {
    file: 'src/components/OnboardingTutorial.tsx',
    checks: [
      { pattern: /t\?\.onboarding\?\.welcome/, description: 'Welcome title uses translation' },
      { pattern: /t\?\.onboarding\?\.enterText/, description: 'Enter Text title uses translation' },
      { pattern: /t\?\.onboarding\?\.closeTutorial/, description: 'Close tutorial uses translation' },
    ]
  },
  {
    file: 'src/features/ilm-huruf/IlmHurufPanel.tsx',
    checks: [
      { pattern: /t\?\.errors\?\.analysisError/, description: 'Analysis error uses translation' },
      { pattern: /t\?\.tooltips\?\.umHadad2/, description: 'Um Ḥadad tooltip uses translation' },
      { pattern: /t\?\.errors\?\.verseLoadError/, description: 'Verse load error uses translation' },
    ]
  },
  {
    file: 'src/components/MobileMenu.tsx',
    checks: [
      { pattern: /t\?\.controls\?\.closeMenu/, description: 'Close menu uses translation' },
    ]
  },
  {
    file: 'src/components/ArabicKeyboard.tsx',
    checks: [
      { pattern: /t\?\.controls\?\.closeKeyboard/, description: 'Close keyboard uses translation' },
      { pattern: /useLanguage/, description: 'useLanguage hook imported' },
    ]
  },
  {
    file: 'src/features/ilm-huruf/core.ts',
    checks: [
      { pattern: /t\?\.actionButtons\?\.startImportantTask/, description: 'Start Important Task uses translation' },
      { pattern: /t\?\.actionButtons\?\.sendCriticalEmail/, description: 'Send Critical Email uses translation' },
      { pattern: /t\?\.energyReturn\?\.fast/, description: 'Energy return fast uses translation' },
      { pattern: /t\?\.energyReturn\?\.slow/, description: 'Energy return slow uses translation' },
    ]
  },
  {
    file: 'src/lib/translations.ts',
    checks: [
      { pattern: /onboarding:\s*{/, description: 'onboarding translation keys exist' },
      { pattern: /glossary:\s*{/, description: 'glossary translation keys exist' },
      { pattern: /controls:\s*{/, description: 'controls translation keys exist' },
      { pattern: /tooltips:\s*{/, description: 'tooltips translation keys exist' },
      { pattern: /energyReturn:\s*{/, description: 'energyReturn translation keys exist' },
      { pattern: /errors:\s*{/, description: 'errors translation keys exist' },
    ]
  }
];

// Hardcoded strings that should NOT appear (without translation fallback pattern)
const FORBIDDEN_PATTERNS = [
  {
    file: 'src/components/OnboardingTutorial.tsx',
    patterns: [
      { regex: /aria-label="Close tutorial"(?![^<]*\{)/, string: 'aria-label="Close tutorial"' },
    ]
  },
  {
    file: 'src/components/MobileMenu.tsx',
    patterns: [
      { regex: /aria-label="Close menu"(?![^<]*\{)/, string: 'aria-label="Close menu"' },
    ]
  },
  {
    file: 'src/components/ArabicKeyboard.tsx',
    patterns: [
      { regex: /aria-label="Close keyboard"(?![^<]*\{)/, string: 'aria-label="Close keyboard"' },
    ]
  },
];

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
let warnings = 0;

console.log('\n🔍 Translation Verification Report\n');
console.log('='.repeat(60));

// Check expected translations
EXPECTED_TRANSLATIONS.forEach(({ file, checks }) => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`\n❌ File not found: ${file}`);
    failedChecks += checks.length;
    totalChecks += checks.length;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(`\n📄 ${file}`);
  
  checks.forEach(({ pattern, antiPattern, description }) => {
    totalChecks++;
    
    if (antiPattern) {
      // Anti-pattern check (should NOT match)
      if (antiPattern.test(content)) {
        console.log(`  ❌ ${description}`);
        failedChecks++;
      } else {
        console.log(`  ✅ ${description}`);
        passedChecks++;
      }
    } else {
      // Normal pattern check (should match)
      if (pattern.test(content)) {
        console.log(`  ✅ ${description}`);
        passedChecks++;
      } else {
        console.log(`  ❌ ${description}`);
        failedChecks++;
      }
    }
  });
});

// Check forbidden patterns
console.log('\n' + '='.repeat(60));
console.log('\n🚫 Checking for Untranslated Hardcoded Strings\n');

FORBIDDEN_PATTERNS.forEach(({ file, patterns }) => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`\n⚠️  File not found: ${file}`);
    warnings++;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  console.log(`\n📄 ${file}`);
  
  let foundIssues = false;
  patterns.forEach(({ regex, string }) => {
    const matches = content.match(regex);
    if (matches) {
      foundIssues = true;
      // Find line numbers
      lines.forEach((line, idx) => {
        if (regex.test(line)) {
          console.log(`  ❌ Line ${idx + 1}: Found hardcoded "${string}"`);
          failedChecks++;
        }
      });
    }
  });
  
  if (!foundIssues) {
    console.log(`  ✅ No hardcoded strings found`);
    passedChecks++;
  }
  
  totalChecks++;
});

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 Summary\n');
console.log(`Total Checks:  ${totalChecks}`);
console.log(`✅ Passed:     ${passedChecks} (${Math.round(passedChecks/totalChecks*100)}%)`);
console.log(`❌ Failed:     ${failedChecks}`);
console.log(`⚠️  Warnings:   ${warnings}`);

console.log('\n' + '='.repeat(60));

if (failedChecks === 0) {
  console.log('\n✨ SUCCESS! All translations verified! ✨\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Please review the issues above.\n');
  process.exit(1);
}
