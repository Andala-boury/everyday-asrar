// Verification test for Maghribi element system
// Test the 4 names from the requirements

const MAGHRIBI_ELEMENTS = {
  // Fire - 7 letters
  'ا': 'fire', 'ه': 'fire', 'ط': 'fire', 'م': 'fire', 'ف': 'fire', 'ش': 'fire', 'ذ': 'fire',
  // Air - 7 letters
  'ب': 'air', 'و': 'air', 'ي': 'air', 'ن': 'air', 'ض': 'air', 'ظ': 'air', 'غ': 'air',
  // Water - 7 letters
  'ج': 'water', 'ز': 'water', 'ك': 'water', 'س': 'water', 'ق': 'water', 'ث': 'water', 'خ': 'water',
  // Earth - 7 letters
  'د': 'earth', 'ح': 'earth', 'ل': 'earth', 'ع': 'earth', 'ر': 'earth', 'ص': 'earth', 'ت': 'earth',
  // Special forms
  'ة': 'earth' // Tā' marbūṭa = same as ت
};

function testName(name, testNumber) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Test ${testNumber}: ${name}`);
  console.log('='.repeat(60));
  
  const letters = [...name];
  const elements = { fire: 0, air: 0, water: 0, earth: 0 };
  
  console.log('\nLetter Analysis:');
  letters.forEach((letter, index) => {
    const element = MAGHRIBI_ELEMENTS[letter];
    if (element) {
      elements[element]++;
      console.log(`  ${letter} = ${element.toUpperCase()}`);
    } else {
      console.log(`  ${letter} = UNMAPPED (${letter.charCodeAt(0).toString(16)})`);
    }
  });
  
  const total = Object.values(elements).reduce((a, b) => a + b, 0);
  
  console.log('\nElemental Balance:');
  if (total === 0) {
    console.log('  ERROR: No letters mapped!');
  } else {
    Object.entries(elements).forEach(([element, count]) => {
      if (count > 0) {
        const percentage = Math.round((count / total) * 100);
        console.log(`  ${percentage}% ${element.toUpperCase()}`);
      }
    });
  }
  
  return elements;
}

// Test 1: محمد (Muhammad)
testName('محمد', 1);
// Expected: م=Fire, ح=Earth, م=Fire, د=Earth → 50% Fire, 50% Earth

// Test 2: فاطمة (Fatima)
testName('فاطمة', 2);
// Expected: ف=Fire, ا=Fire, ط=Fire, م=Fire, ة(ت)=Earth → 80% Fire, 20% Earth

// Test 3: ابراهيم (Ibrahim)
testName('ابراهيم', 3);
// Expected: ا=Fire, ب=Air, ر=Earth, ا=Fire, ه=Fire, ي=Air, م=Fire → 57% Fire, 29% Air, 14% Earth

// Test 4: بك (from PDF example)
testName('بك', 4);
// Expected: ب=Air, ك=Water → 50% Air, 50% Water

console.log('\n' + '='.repeat(60));
console.log('✅ All tests completed!');
console.log('='.repeat(60));
