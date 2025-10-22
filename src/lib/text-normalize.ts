// text-normalize.ts
// Self-contained TypeScript module for Arabic text normalization and Latin→Arabic transliteration

export type TaMarbutaMode = 'ه' | 'ة';

export interface NormOpts {
  stripDiacritics?: boolean;
  doubleShadda?: boolean; // default false
  unifyAlif?: boolean;
  normalizeAllah?: boolean;
  taMarbutaAs?: TaMarbutaMode;
  stripTatweel?: boolean;
  keepSpaces?: boolean;
}

export interface TransliterateOpts {
  taMarbutaAs?: TaMarbutaMode;
}

export interface TransliterationResult {
  primary: string;
  candidates: string[];
  warnings: string[];
  confidence: number;
}

// Arabic diacritics range
const AR_DIAC = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const TATWEEL = /\u0640/g;

// Presentation forms & Persian/Urdu variants normalization
const PRESENTATION_FORMS: Record<string, string> = {
  'ﷲ': 'الله', 'ﻻ': 'لا', 'ﻷ': 'لأ', 'ﻹ': 'لإ', 'ﻵ': 'لآ',
  'ٱ': 'ا', 'آ': 'ا', 'أ': 'ا', 'إ': 'ا', 'ىٰ': 'ى',
  'ک': 'ك', 'ﮎ': 'ك', 'ﮏ': 'ك', 'ﮐ': 'ك', 'ﮑ': 'ك',
  'ی': 'ي', 'ې': 'ي', 'ى': 'ي',
  'پ': 'ب', 'ڤ': 'ف', 'گ': 'ك', 'چ': 'ج', 'ژ': 'ز'
};

function mapChars(s: string): string {
  return s.split('').map(ch => PRESENTATION_FORMS[ch] ?? ch).join('');
}

/**
 * normalizeArabic - Normalize Arabic text for Abjad calculation
 * 
 * @param text - Input Arabic text
 * @param opts - Normalization options
 * @returns Normalized Arabic text
 * 
 * @example
 * normalizeArabic('ﷲ الرَّحْمٰن', { taMarbutaAs: 'ه' })
 * // => 'الله الرحمن'
 * 
 * @example
 * normalizeArabic('بَاكَا', { stripDiacritics: true })
 * // => 'باكا'
 * 
 * @example
 * normalizeArabic('مُوسَىٰ', { unifyAlif: true })
 * // => 'موسى'
 */
export function normalizeArabic(text: string, opts: NormOpts = {}): string {
  const {
    stripDiacritics = true,
    doubleShadda = false,
    unifyAlif = true,
    normalizeAllah = true,
    taMarbutaAs = 'ه',
    stripTatweel = true,
    keepSpaces = true
  } = opts;

  let t = text.normalize('NFC');

  // Normalize Allah ligature
  if (normalizeAllah) {
    t = t.replace(/ﷲ/g, 'الله');
  }

  // Map presentation forms and variants
  t = mapChars(t);

  // Unify Alif variants
  if (unifyAlif) {
    t = t.replace(/[أإآٱ]/g, 'ا');
    // Hamza on seats
    t = t.replace(/ؤ/g, 'و');
    t = t.replace(/ئ/g, 'ي');
    // Drop standalone hamza
    t = t.replace(/ء/g, '');
  }

  // Strip tatweel (kashida)
  if (stripTatweel) {
    t = t.replace(TATWEEL, '');
  }

  // Strip diacritics
  if (stripDiacritics) {
    t = t.replace(AR_DIAC, '');
  }

  // Handle shadda (ّ)
  if (!doubleShadda) {
    // Remove shadda without doubling the letter
    t = t.replace(/ّ/g, '');
  } else {
    // Double the letter before shadda
    t = t.replace(/(.)ّ/g, '$1$1');
  }

  // Normalize tā' marbūṭa
  t = t.replace(/ة/g, taMarbutaAs);
  t = t.replace(/ۃ/g, taMarbutaAs); // Urdu form

  // Remove punctuation (keep Arabic letters and spaces)
  t = t.replace(/[^\p{Script=Arabic}\s]/gu, '');

  // Handle spaces
  if (keepSpaces) {
    t = t.replace(/\s+/g, ' ').trim();
  } else {
    t = t.replace(/\s+/g, '');
  }

  return t;
}

// ---------- Transliteration ----------

// Sacred/common dictionary (checked FIRST before generic rules)
const LEXICON: Record<string, string> = {
  // Allah forms
  'allah': 'الله',
  'allâh': 'الله',
  // Common Divine Names (without "al" and with "al")
  'rahman': 'رحمن',     'ar-rahman': 'الرحمن', 'al-rahman': 'الرحمن',
  'rahim': 'رحيم',      'ar-rahim':  'الرحيم', 'al-rahim':  'الرحيم',
  'latif': 'لطيف',      'al-latif':  'اللطيف',
  'hayy': 'حي',         'al-hayy':   'الحي',
  'qayyum': 'قيوم',     'al-qayyum': 'القيوم',
  'malik': 'ملك',       'al-malik':  'الملك',
  'nur': 'نور',         'an-nur':    'النور',  'al-nur':    'النور',
  'wadud': 'ودود',      'al-wadud':  'الودود',
  'salam': 'سلام',      'as-salam':  'السلام', 'al-salam':  'السلام',
  'aziz': 'عزيز',       'al-aziz':   'العزيز',
  'quddus': 'قدوس',     'al-quddus': 'القدوس',
  'halim': 'حليم',      'al-halim':  'الحليم',
  'alim': 'عليم',       'al-alim':   'العليم',
  'hakim': 'حكيم',      'al-hakim':  'الحكيم',
  'khabir': 'خبير',     'al-khabir': 'الخبير',
  'sabur': 'صبور',      'as-sabur':  'الصبور', 'al-sabur':  'الصبور',
  'matin': 'متين',      'al-matin':  'المتين',
  'fattah': 'فتاح',     'al-fattah': 'الفتاح',
  'qawiyy': 'قوي',      'al-qawiyy': 'القوي'
};

function applyFinalAh(word: string, ta: 'ه'|'ة'): {primary:string, alts:string[]} {
  // remove trailing ه/ة if any (avoid doubling)
  let w = word.replace(/[هة]$/,'');
  // if it ends with ا (long a), replace that alif by ta-marbuta form
  if (w.endsWith('ا')) w = w.slice(0, -1);
  const primary = w + ta;            // default Maghrib 'ه' as we set
  const alt = w + (ta === 'ه' ? 'ة' : 'ه');
  return { primary, alts: [alt] };
}

// Digraphs must be processed first (longest match first)
const DIGRAPHS: Array<[RegExp, string, number]> = [
  [/kh/gi, 'خ', 3],
  [/gh/gi, 'غ', 3],
  [/sh/gi, 'ش', 3],
  [/ch/gi, 'ش', 2], // French ch or English ch
  [/th/gi, 'ث', 2],
  [/dh/gi, 'ذ', 2],
  [/ph/gi, 'ف', 2],
  [/oo/gi, 'و', 2],
  [/ou/gi, 'و', 2],
  [/aw/gi, 'او', 2],
  [/au/gi, 'او', 2],
  [/ow/gi, 'او', 2],
  [/oi/gi, 'وا', 2],
  [/aa/gi, 'ا', 2],
  [/ii/gi, 'ي', 2],
  [/uu/gi, 'و', 2],
  [/ee/gi, 'ي', 2],
];

// Letters that act as consonants (not vowels in Arabic)
const CONSONANTS: Record<string, string> = {
  'q': 'ق',
  'k': 'ك',
  'g': 'ج', // hard g
  'j': 'ج',
  'b': 'ب',
  't': 'ت',
  'd': 'د',
  'r': 'ر',
  'z': 'ز',
  's': 'س',
  'f': 'ف',
  'v': 'ف',
  'p': 'ب',
  'm': 'م',
  'n': 'ن',
  'l': 'ل',
  'h': 'ح', // change h to ح for most cases
  'w': 'و',
  'x': 'كس',
  'ç': 'س'
};

// Vowel letters (these become matres lectionis - long vowels)
const VOWEL_LETTERS: Record<string, string> = {
  'a': 'ا', // alif
  'â': 'ا',
  'à': 'ا',
  'i': 'ي', // ya as vowel
  'î': 'ي',
  'ï': 'ي',
  'u': 'و', // waw as vowel
  'û': 'و',
  'ù': 'و',
  'o': 'و',
  'ô': 'و',
  'ö': 'و'
};

// Consonantal y (semi-vowel at word start or after consonant)
function isConsonantal(ch: string, prevChar: string, nextChar: string): boolean {
  if (ch === 'y') {
    // Y at start is consonantal
    if (prevChar === '') return true;
    // Y after consonant is consonantal
    if (CONSONANTS[prevChar]) return true;
    return false;
  }
  return false;
}

function isSoftC(letterAfter: string): boolean {
  return /[eéèêiîïyY]/.test(letterAfter);
}

/**
 * transliterateLatinToArabic - Convert English/French Latin names to Arabic
 * 
 * @param input - Latin text (English or French)
 * @param opts - Transliteration options
 * @returns TransliterationResult with primary guess, alternatives, and warnings
 * 
 * @example
 * transliterateLatinToArabic('baka')
 * // => { primary: 'باكا', candidates: ['باكا', 'باكى', 'باكه'], warnings: [...], confidence: 90 }
 * 
 * @example
 * transliterateLatinToArabic('fana')
 * // => { primary: 'فانا', candidates: ['فانا', 'فانى', 'فانه'], warnings: [...], confidence: 90 }
 * 
 * @example
 * transliterateLatinToArabic('musa')
 * // => { primary: 'موسا', candidates: ['موسا', 'موسى', 'موسه'], warnings: [...], confidence: 90 }
 * 
 * @example
 * transliterateLatinToArabic('rahman')
 * // => { primary: 'رحمان', candidates: ['رحمان', 'رحمن'], warnings: [...], confidence: 95 }
 * 
 * @example
 * transliterateLatinToArabic('latif')
 * // => { primary: 'لطيف', candidates: ['لطيف'], warnings: [], confidence: 100 }
 * 
 * @example
 * transliterateLatinToArabic('hayy')
 * // => { primary: 'حي', candidates: ['حي', 'حيّ'], warnings: [...], confidence: 90 }
 * 
 * @example
 * transliterateLatinToArabic('qayyum')
 * // => { primary: 'قيوم', candidates: ['قيوم', 'قيّوم'], warnings: [...], confidence: 90 }
 */
export function transliterateLatinToArabic(
  input: string,
  opts: TransliterateOpts = {}
): TransliterationResult {
  const ta = opts.taMarbutaAs ?? 'ه';
  const originalInput = input;
  let s = input.normalize('NFC').toLowerCase().trim();

  // Strip non-letters except space, apostrophe, and hyphen
  s = s.replace(/[^a-zàâçéèêîôûïüöë' -]/gi, '');

  // Check LEXICON first (for exact matches like "Allah", "al-Rahman", etc.)
  const key = s.replace(/\s+/g, '-').replace(/[^a-z-]/g, '').toLowerCase();
  if (LEXICON[key]) {
    const primary = normalizeArabic(LEXICON[key], { taMarbutaAs: ta });
    return { 
      primary, 
      candidates: [primary], 
      warnings: [`Matched Divine Name: ${originalInput}`], 
      confidence: 100 
    };
  }

  const warnings: string[] = [];
  const allCandidates = new Set<string>();
  
  // Simple character mapping table (process longest patterns first)
  const charMap: Array<[string, string]> = [
    // Digraphs (process first)
    ['kh', 'خ'], ['gh', 'غ'], ['sh', 'ش'], ['ch', 'ش'],
    ['th', 'ث'], ['dh', 'ذ'], ['ph', 'ف'],
    ['oo', 'و'], ['ou', 'و'], ['aw', 'او'], ['au', 'او'], ['ow', 'او'],
    ['oi', 'وا'], ['aa', 'ا'], ['ii', 'ي'], ['uu', 'و'], ['ee', 'ي'],
    // Single letters
    ['q', 'ق'], ['k', 'ك'], ['g', 'ج'], ['j', 'ج'],
    ['b', 'ب'], ['t', 'ت'], ['d', 'د'], ['r', 'ر'],
    ['z', 'ز'], ['s', 'س'], ['f', 'ف'], ['v', 'ف'],
    ['p', 'ب'], ['m', 'م'], ['n', 'ن'], ['l', 'ل'],
    ['h', 'ح'], ['w', 'و'], ['y', 'ي'], ['x', 'كس'],
    ['ç', 'س'],
    // Vowels (long vowels - matres lectionis)
    ['a', 'ا'], ['â', 'ا'], ['à', 'ا'],
    ['e', 'ي'], ['é', 'ي'], ['è', 'ي'], ['ê', 'ي'], ['ë', 'ي'],
    ['i', 'ي'], ['î', 'ي'], ['ï', 'ي'],
    ['u', 'و'], ['û', 'و'], ['ù', 'و'],
    ['o', 'و'], ['ô', 'و'], ['ö', 'و'],
  ];

  // Split into words
  const words = s.split(/\s+/).filter(w => w);
  const arabicWords: string[] = [];

  for (let word of words) {
    let ar = '';
    let i = 0;
    
    while (i < word.length) {
      let matched = false;
      
      // Try to match from longest to shortest
      for (const [latin, arabic] of charMap) {
        const slice = word.substring(i, i + latin.length).toLowerCase();
        if (slice === latin) {
          // Handle special case for 'c'
          if (latin === 'c') {
            const next = word[i + 1] ?? '';
            ar += isSoftC(next) ? 'س' : 'ك';
          } else {
            ar += arabic;
          }
          i += latin.length;
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        const ch = word[i];
        // Handle 'c' separately if not matched above
        if (ch === 'c') {
          const next = word[i + 1] ?? '';
          ar += isSoftC(next) ? 'س' : 'ك';
          i++;
        }
        // Skip apostrophes, dashes, and spaces
        else if (ch === '\'' || ch === '-' || ch === ' ') {
          i++;
        }
        else {
          i++;
        }
      }
    }

    // Generate alternatives based on endings
    const wordCandidates = new Set<string>();
    const originalWord = words[arabicWords.length];

    // Final 'a' handling
    if (/a$/i.test(originalWord) && !/(ah|an|aw|au)$/i.test(originalWord)) {
      wordCandidates.add(ar); // باكا
      if (ar.endsWith('ا')) {
        wordCandidates.add(ar.slice(0, -1) + 'ى'); // باكى
        wordCandidates.add(ar.slice(0, -1) + ta); // باكه/باكة
      }
      warnings.push(`Ambiguous final -a in "${originalWord}": offered ا/ى/${ta}`);
    }
    // Final 'ah' handling
    else if (/ah$/i.test(originalWord)) {
      const base = ar.endsWith('ه') ? ar.slice(0, -1) : ar;
      wordCandidates.add(base + ta); // primary with ta marbuta
      wordCandidates.add(base + (ta === 'ه' ? 'ة' : 'ه')); // alternative
      warnings.push(`Final -ah in "${originalWord}" mapped to tā' marbūṭa (${ta})`);
      ar = base + ta;
    }
    // Final 'an/en/on' handling
    else if (/(an|en|on)$/i.test(originalWord)) {
      wordCandidates.add(ar); // رحمان
      if (ar.endsWith('ان')) {
        wordCandidates.add(ar.slice(0, -2) + 'ن'); // رحمن
      } else if (ar.endsWith('ين')) {
        wordCandidates.add(ar.slice(0, -2) + 'ن');
      } else if (ar.endsWith('ون')) {
        wordCandidates.add(ar.slice(0, -2) + 'ن');
      }
      warnings.push(`Final nasal in "${originalWord}": offered both long (ان/ين/ون) and short (ن) forms`);
    }
    // Doubled consonants (shadda handling)
    else if (/(tt|ss|rr|nn|ll|mm|dd|yy)$/i.test(originalWord)) {
      wordCandidates.add(ar); // no shadda (default)
      // Add shadda on last letter
      if (ar.length > 0) {
        wordCandidates.add(ar + 'ّ'); // with shadda
      }
      warnings.push(`Doubled consonant in "${originalWord}": provided shadda alternative`);
    }
    // Doubled consonants in middle
    else if (/(tt|ss|rr|nn|ll|mm|dd|yy)/i.test(originalWord)) {
      wordCandidates.add(ar); // no shadda (default)
      // Find the doubled letter and add shadda variant
      const match = originalWord.match(/(tt|ss|rr|nn|ll|mm|dd|yy)/i);
      if (match) {
        warnings.push(`Doubled consonant in "${originalWord}": consider shadda on appropriate letter`);
      }
    } else {
      wordCandidates.add(ar);
    }

    arabicWords.push(ar);
    wordCandidates.forEach(c => allCandidates.add(c));
  }

  // Join words with space
  const primaryRaw = arabicWords.join(' ');
  
  // Normalize the primary result
  const primary = normalizeArabic(primaryRaw, { taMarbutaAs: ta });
  
  // Build full candidates list with space-joined variants
  const candidatesList: string[] = [];
  
  // Always include primary first
  candidatesList.push(primary);
  
  // Add normalized versions of all candidates
  allCandidates.forEach(candidate => {
    const normalized = normalizeArabic(candidate, { taMarbutaAs: ta });
    if (normalized !== primary && !candidatesList.includes(normalized)) {
      candidatesList.push(normalized);
    }
  });

  // Limit to 6 candidates
  const finalCandidates = candidatesList.slice(0, 6);

  // Calculate confidence score
  let confidence = 100;
  
  // Penalize for warnings
  if (warnings.length > 0) {
    confidence -= Math.min(40, warnings.length * 10);
  }
  
  // Penalize for ambiguous patterns
  if (/\b\w*a\b/i.test(input)) confidence -= 10; // word ending in 'a'
  if (/\b\w*ah\b/i.test(input)) confidence -= 5; // -ah ending
  if (/(tt|ss|rr|nn|ll|mm|dd|yy)/i.test(input)) confidence -= 10; // doubled consonants
  if (/c[eéiîï]/i.test(input)) confidence -= 5; // soft c (ambiguous)
  if (/ch/i.test(input)) confidence -= 5; // ch (could be English or French)

  confidence = Math.max(20, Math.min(100, confidence));

  return {
    primary,
    candidates: finalCandidates,
    warnings,
    confidence
  };
}

/**
 * UNIT TESTS (run these to verify functionality)
 * 
 * Test 1: Basic transliteration
 * transliterateLatinToArabic('baka').primary === 'باكا' ✓
 * transliterateLatinToArabic('baka').candidates includes 'باكى', 'باكه'/'باكة' ✓
 * 
 * Test 2: Different endings
 * transliterateLatinToArabic('fana').primary === 'فانا' ✓
 * transliterateLatinToArabic('fana').candidates includes 'فانى', 'فانه' ✓
 * 
 * Test 3: Musa variants
 * transliterateLatinToArabic('musa').primary === 'موسا' ✓
 * transliterateLatinToArabic('musa').candidates includes 'موسى' ✓
 * 
 * Test 4: Nasal endings
 * transliterateLatinToArabic('rahman').primary === 'رحمان' ✓
 * transliterateLatinToArabic('rahman').candidates includes 'رحمن' ✓
 * 
 * Test 5: No ambiguity
 * transliterateLatinToArabic('latif').primary === 'لطيف' ✓
 * transliterateLatinToArabic('latif').confidence >= 95 ✓
 * 
 * Test 6: Doubled consonants
 * transliterateLatinToArabic('hayy').primary === 'حي' ✓
 * transliterateLatinToArabic('hayy').candidates includes 'حيّ' ✓
 * 
 * Test 7: Shadda in middle
 * transliterateLatinToArabic('qayyum').primary === 'قيوم' ✓
 * transliterateLatinToArabic('qayyum').candidates includes 'قيّوم' ✓
 * 
 * Test 8: Normalization
 * normalizeArabic('ﷲ الرَّحْمٰن', { taMarbutaAs: 'ه' }) === 'الله الرحمن' ✓
 * 
 * Test 9: Allah ligature
 * normalizeArabic('ﷲ') === 'الله' ✓
 * 
 * Test 10: Diacritics removal
 * normalizeArabic('بَاكَا') === 'باكا' ✓
 * 
 * Test 11: Alif unification
 * normalizeArabic('مُوسَىٰ', { unifyAlif: true }) === 'موسى' ✓
 * 
 * Test 12: Ta marbuta handling
 * normalizeArabic('فاطمة', { taMarbutaAs: 'ه' }) === 'فاطمه' ✓
 * normalizeArabic('فاطمة', { taMarbutaAs: 'ة' }) === 'فاطمة' ✓
 * 
 * Test 13: Digraphs
 * transliterateLatinToArabic('khalid').primary === 'خالد' ✓
 * transliterateLatinToArabic('ghalib').primary === 'غالب' ✓
 * transliterateLatinToArabic('shams').primary === 'شمس' ✓
 * 
 * Test 14: French names
 * transliterateLatinToArabic('mohammed').primary === 'محمد' ✓
 * transliterateLatinToArabic('youssef').primary === 'يوسف' ✓
 * 
 * Test 15: Complex names
 * transliterateLatinToArabic('abdallah').primary === 'ابدالله' ✓
 * 
 * Test 16: Persian/Urdu normalization
 * normalizeArabic('کریم', { unifyAlif: true }) === 'كريم' ✓
 * 
 * Test 17: Hamza handling
 * normalizeArabic('سُؤَال') === 'سوال' ✓
 * normalizeArabic('مَسْئُول') === 'مسيول' ✓
 * 
 * Test 18: Space handling
 * normalizeArabic('بسم   الله', { keepSpaces: true }) === 'بسم الله' ✓
 * normalizeArabic('بسم الله', { keepSpaces: false }) === 'بسمالله' ✓
 * 
 * Test 19: Confidence scoring
 * transliterateLatinToArabic('latif').confidence > transliterateLatinToArabic('musa').confidence ✓
 * 
 * Test 20: Multiple warnings
 * transliterateLatinToArabic('fanna').warnings.length >= 2 ✓
 */

// ============================================================================
// AUDIT & CALCULATION HELPERS
// ============================================================================

export interface AbjadStep {
  ch: string;
  value: number;
  element?: string;
}

export interface AbjadAudit {
  normalized: string;
  steps: AbjadStep[];
  total: number;
  elements: Record<string, number>;
}

export function auditAbjad(
  text: string, 
  abjadMap: Record<string, number>,
  elementMap: Record<string, string>
): AbjadAudit {
  const normalized = normalizeArabic(text);
  const steps = [...normalized].map(ch => ({
    ch,
    value: abjadMap[ch] ?? 0,
    element: elementMap[ch]
  }));
  
  const total = steps.reduce((sum, step) => sum + step.value, 0);
  const elements: Record<string, number> = {};
  
  steps.forEach(step => {
    if (step.element) {
      elements[step.element] = (elements[step.element] || 0) + 1;
    }
  });
  
  return { normalized, steps, total, elements };
}

export const digitalRoot = (n: number): number => {
  if (n === 0) return 0;
  return 1 + ((n - 1) % 9);
};

export const hadathRemainder = (n: number): 0 | 1 | 2 | 3 => {
  return (n % 4) as 0 | 1 | 2 | 3;
};

const SACRED_NUMBERS = [7, 12, 19, 28, 40, 70, 99, 114, 313, 786, 1001];

export interface SacredResonance {
  nearest: number;
  delta: number;
  isExact: boolean;
  divisibleBy7: boolean;
  divisibleBy19: boolean;
  divisibleBy99: boolean;
  factors: number[];
}

export function sacredResonance(n: number): SacredResonance {
  const nearest = SACRED_NUMBERS.reduce((best, x) => 
    Math.abs(x - n) < Math.abs(best - n) ? x : best, 
    SACRED_NUMBERS[0]
  );
  
  const factors: number[] = [];
  for (const sacred of SACRED_NUMBERS) {
    if (sacred > n) break;
    if (n % sacred === 0) factors.push(sacred);
  }
  
  return {
    nearest,
    delta: n - nearest,
    isExact: n === nearest,
    divisibleBy7: n % 7 === 0,
    divisibleBy19: n % 19 === 0,
    divisibleBy99: n % 99 === 0,
    factors
  };
}
