const fs = require('fs');

// Fix DivineTiming.tsx
let content = fs.readFileSync('src/components/divine-timing/DivineTiming.tsx', 'utf-8');

// Replace all capitalized element references with lowercase
content = content.replace(/: 'Fire'/g, ": 'fire'");
content = content.replace(/: 'Air'/g, ": 'air'");
content = content.replace(/: 'Water'/g, ": 'water'");
content = content.replace(/: 'Earth'/g, ": 'earth'");
content = content.replace(/=== 'Fire'/g, "=== 'fire'");
content = content.replace(/=== 'Air'/g, "=== 'air'");
content = content.replace(/=== 'Water'/g, "=== 'water'");
content = content.replace(/=== 'Earth'/g, "=== 'earth'");

// Fix RestDayView props
content = content.replace(/onViewTimeline=\{[^}]+\}\s*/g, '');
content = content.replace(/onClose=\{[^}]+\}\s*/g, '');

fs.writeFileSync('src/components/divine-timing/DivineTiming.tsx', content, 'utf-8');
console.log('✅ Fixed DivineTiming.tsx element cases');

// Fix TimelineView.tsx
let timeline = fs.readFileSync('src/components/divine-timing/TimelineView.tsx', 'utf-8');
timeline = timeline.replace(/Fire: \{ Fire: /g, "fire: { fire: ");
timeline = timeline.replace(/, Air: /g, ", air: ");
timeline = timeline.replace(/, Earth: /g, ", earth: ");
timeline = timeline.replace(/, Water: /g, ", water: ");
timeline = timeline.replace(/Air: \{ Air: /g, "air: { air: ");
timeline = timeline.replace(/Water: \{ Water: /g, "water: { water: ");
timeline = timeline.replace(/Earth: \{ Earth: /g, "earth: { earth: ");

fs.writeFileSync('src/components/divine-timing/TimelineView.tsx', timeline, 'utf-8');
console.log('✅ Fixed TimelineView.tsx element cases');

console.log('\n✨ All element cases fixed!');
