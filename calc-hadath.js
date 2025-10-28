const abjad = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80,
  'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600,
  'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000
};

function digitalRoot(n) {
  if (n === 0) return 0;
  return 1 + ((n - 1) % 9);
}

function getHadath(name) {
  let sum = 0;
  for (const char of name) {
    sum += abjad[char] || 0;
  }
  const kabir = digitalRoot(sum);
  const hadath = kabir % 4;
  const elements = { 0: 'Earth', 1: 'Fire', 2: 'Water', 3: 'Air' };
  console.log(`${name}: sum=${sum}, kabir=${kabir}, hadath=${hadath} → ${elements[hadath]}`);
  return hadath;
}

getHadath('محمد');
getHadath('علي');
getHadath('فاطمة');
getHadath('أحمد');
getHadath('زيد');
getHadath('ليلى');
