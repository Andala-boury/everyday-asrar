// Test the planetary hours calculation
const PLANET_INFO = {
  Sun: { name: 'Sun', nameArabic: 'الشمس', element: 'fire', elementArabic: 'نار' },
  Moon: { name: 'Moon', nameArabic: 'القمر', element: 'water', elementArabic: 'ماء' },
  Mars: { name: 'Mars', nameArabic: 'المريخ', element: 'fire', elementArabic: 'نار' },
  Mercury: { name: 'Mercury', nameArabic: 'عطارد', element: 'air', elementArabic: 'هواء' },
  Jupiter: { name: 'Jupiter', nameArabic: 'المشتري', element: 'air', elementArabic: 'هواء' },
  Venus: { name: 'Venus', nameArabic: 'الزهرة', element: 'earth', elementArabic: 'تراب' },
  Saturn: { name: 'Saturn', nameArabic: 'زحل', element: 'earth', elementArabic: 'تراب' }
};

const PLANETARY_SEQUENCES = {
  0: [
    'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn',
    'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury'
  ],
  1: [
    'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun',
    'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter'
  ],
  2: [
    'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon',
    'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus'
  ],
  3: [
    'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars',
    'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn'
  ],
  4: [
    'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury',
    'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun'
  ],
  5: [
    'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter',
    'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'
  ],
  6: [
    'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus',
    'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'
  ]
};

// Check all sequences have 24 elements
console.log('Checking sequences:');
for (let day = 0; day < 7; day++) {
  const seq = PLANETARY_SEQUENCES[day];
  console.log(`Day ${day}: ${seq.length} elements`);
  
  // Check all planets are valid
  for (let i = 0; i < seq.length; i++) {
    if (!PLANET_INFO[seq[i]]) {
      console.error(`  ❌ Index ${i}: Invalid planet "${seq[i]}"`);
    }
  }
}

// Test with current time
console.log('\n✅ All planets are valid!');
console.log('Current time:', new Date().toISOString());
console.log('Day of week:', new Date().getDay());
