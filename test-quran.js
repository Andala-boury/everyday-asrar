// Quick test of Quran calculation
const hadad = 22;
const surahNum = hadad % 114 || 114;
console.log(`Hadad: ${hadad}`);
console.log(`Surah: ${surahNum}`);
console.log(`Expected: Surah 22 (Al-Hajj)`);

// Test with other values
const testValues = [22, 131, 285, 1, 114, 115];
testValues.forEach(h => {
  const s = h % 114 || 114;
  console.log(`Hadad ${h} → Surah ${s}`);
});
