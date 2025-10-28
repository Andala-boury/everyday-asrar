// All 28 Arabic letters used in Abjad
const allLetters = ['ا', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ'];

console.log(`Total letters defined: ${allLetters.length}`);
console.log('Letters:', allLetters.join(' '));

// Check LETTER_ELEMENTS
const LETTER_ELEMENTS = {
  // Fire (6 letters)
  'ا': 'Fire', 'ه': 'Fire', 'ط': 'Fire', 'م': 'Fire', 'ف': 'Fire', 'ص': 'Fire',
  // Water (5 letters)
  'ب': 'Water', 'و': 'Water', 'ي': 'Water', 'ن': 'Water', 'ق': 'Water',
  // Air (5 letters)
  'ج': 'Air', 'ز': 'Air', 'ك': 'Air', 'س': 'Air', 'ش': 'Air',
  // Earth (12 letters)
  'د': 'Earth', 'ل': 'Earth', 'ع': 'Earth', 'ر': 'Earth', 'ت': 'Earth', 
  'ث': 'Earth', 'خ': 'Earth', 'ذ': 'Earth', 'ض': 'Earth', 'ظ': 'Earth', 'غ': 'Earth'
};

const covered = Object.keys(LETTER_ELEMENTS);
console.log(`\nLetters in LETTER_ELEMENTS: ${covered.length}`);

const missing = allLetters.filter(l => !LETTER_ELEMENTS[l]);
console.log(`Missing letters: ${missing.length}`);
if (missing.length > 0) {
  console.log('Missing:', missing.join(' '));
}

// Count distribution
const dist = { Fire: 0, Water: 0, Air: 0, Earth: 0 };
for (const letter of allLetters) {
  const elem = LETTER_ELEMENTS[letter];
  if (elem) dist[elem]++;
}

console.log(`\nDistribution:`);
console.log(`Fire: ${dist.Fire}`);
console.log(`Water: ${dist.Water}`);
console.log(`Air: ${dist.Air}`);
console.log(`Earth: ${dist.Earth}`);
console.log(`Total: ${dist.Fire + dist.Water + dist.Air + dist.Earth}`);
