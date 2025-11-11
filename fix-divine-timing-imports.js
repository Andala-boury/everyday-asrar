const fs = require('fs');
const path = require('path');

const files = [
  'src/components/divine-timing/DivineTiming.tsx',
  'src/components/divine-timing/EnergyCard.tsx',
  'src/components/divine-timing/TimelineView.tsx',
  'src/components/divine-timing/DhikrCard.tsx',
  'src/components/divine-timing/RestDayView.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace @ imports with relative imports
  content = content.replace(/@\/contexts\/LanguageContext/g, '../../contexts/LanguageContext');
  content = content.replace(/@\/utils\/planetaryHours/g, '../../utils/planetaryHours');
  content = content.replace(/@\/types\/planetary/g, '../../types/planetary');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Fixed: ${file}`);
});

console.log('\n✨ All imports fixed!');
