const fs = require('fs');

const filePath = 'src/features/ilm-huruf/IlmHurufPanel.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix corrupted emojis and symbols
content = content.replace(/ðŸŒ™/g, '🌙');  // Moon
content = content.replace(/ðŸŒŠ/g, '🌊');  // Ocean wave
content = content.replace(/ðŸ¤/g, '🤝');   // Handshake
content = content.replace(/â­/g, '⭐');     // Star
content = content.replace(/âœ¨/g, '✨');   // Sparkles
content = content.replace(/Ã—/g, '×');     // Multiplication sign
content = content.replace(/â€¢/g, '•');    // Bullet
content = content.replace(/PlanÃ©taire/g, 'Planétaire');
content = content.replace(/­/g, '⭐');     // Another star variant
content = content.replace(/¤/g, '🤝');     // Another handshake variant
content = content.replace(/©/g, 'é');      // e with acute
content = content.replace(/—/g, '×');      // Another multiplication variant

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed encoding issues!');
