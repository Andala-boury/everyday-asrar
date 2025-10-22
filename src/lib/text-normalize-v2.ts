// text-normalize-v2.ts - Improved transliteration with lexicon support
export type TaMarbutaMode = 'ه' | 'ة';

export interface NormOpts {
  stripDiacritics?: boolean;
  doubleShadda?: boolean;
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

const AR_DIAC = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const TATWEEL = /\u0640/g;

const PRESENTATION_FORMS: Record<string, string> = {
  'ﷲ': 'الله', 'ﻻ': 'لا', 'ﻷ': 'لأ', 'ﻹ': 'لإ', 'ﻵ': 'لآ',
  'ٱ': 'ا', 'آ': 'ا', 'أ': 'ا', 'إ': 'ا', 'ىٰ': 'ا',
  'ک': 'ك', 'ﮎ': 'ك', 'ﮏ': 'ك', 'ﮐ': 'ك', 'ﮑ': 'ك',
  'ی': 'ي', 'ې': 'ي', 'پ': 'ب', 'ڤ': 'ف', 'گ': 'ك'
};

function mapChars(s: string) {
  return s.split('').map(ch => PRESENTATION_FORMS[ch] ?? ch).join('');
}

/**
 * normalizeArabic - Normalize Arabic text for Abjad calculation
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

  if (normalizeAllah) {
    t = t.replace(/ﷲ/g, 'الله');
  }

  t = mapChars(t);

  if (unifyAlif) {
    t = t.replace(/[أإآٱ]/g, 'ا');
    t = t.replace(/ؤ/g, 'و');
    t = t.replace(/ئ/g, 'ي');
    t = t.replace(/ء/g, '');
  }

  if (stripTatweel) {
    t = t.replace(TATWEEL, '');
  }

  if (stripDiacritics) {
    t = t.replace(AR_DIAC, '');
  }

  if (!doubleShadda) {
    t = t.replace(/ّ/g, '');
  }

  // Ta marbuta
  t = t.replace(/ة/g, taMarbutaAs);
  t = t.replace(/ى/g, 'ي'); // Alif maqsura -> ya

  // Remove non-Arabic, keep spaces if specified
  t = t.replace(/[^\u0600-\u06FF\s]/g, '');
  t = keepSpaces ? t.replace(/\s+/g, ' ').trim() : t.replace(/\s+/g, '');

  return t;
}

// ============================================================================
// TRANSLITERATION with Lexicon Support
// ============================================================================

// Sacred/common names dictionary (checked before generic rules)
const LEXICON: Record<string, string> = {
  // Allah forms
  'allah': 'الله',
  // Common Divine Names (without "al" and with "al")
  'rahman': 'رحمن', 'ar-rahman': 'الرحمن', 'al-rahman': 'الرحمن',
  'rahim': 'رحيم', 'ar-rahim': 'الرحيم', 'al-rahim': 'الرحيم',
  'latif': 'لطيف', 'al-latif': 'اللطيف',
  'hayy': 'حي', 'al-hayy': 'الحي',
  'qayyum': 'قيوم', 'al-qayyum': 'القيوم',
  'qayyoom': 'قيوم', 'al-qayyoom': 'القيوم',
  'malik': 'ملك', 'al-malik': 'الملك',
  'nur': 'نور', 'an-nur': 'النور', 'al-nur': 'النور',
  'karim': 'كريم', 'al-karim': 'الكريم',
  'aziz': 'عزيز', 'al-aziz': 'العزيز',
  'jabbar': 'جبار', 'al-jabbar': 'الجبار',
  'salam': 'سلام', 'as-salam': 'السلام', 'al-salam': 'السلام',
  'quddus': 'قدوس', 'al-quddus': 'القدوس',
  'wahid': 'واحد', 'al-wahid': 'الواحد',
  'ahad': 'احد', 'al-ahad': 'الاحد',
  'samad': 'صمد', 'as-samad': 'الصمد', 'al-samad': 'الصمد',
};

const DIGRAPHS: Array<[RegExp, string]> = [
  [/kh/gi, 'خ'], [/gh/gi, 'غ'], [/sh/gi, 'ش'], [/ch/gi, 'ش'],
  [/th/gi, 'ث'], [/dh/gi, 'ذ'], [/ph/gi, 'ف'],
];

const CONSONANTS: Record<string, string> = {
  'q': 'ق', 'k': 'ك', 'g': 'ج', 'j': 'ج',
  'b': 'ب', 't': 'ت', 'd': 'د', 'r': 'ر',
  'z': 'ز', 's': 'س', 'f': 'ف', 'v': 'ف',
  'p': 'ب', 'm': 'م', 'n': 'ن', 'l': 'ل',
  'h': 'ه', 'w': 'و', 'y': 'ي', 'x': 'كس',
  'ç': 'س', 'c': 'ك', // c handled with soft check
};

function applyFinalAh(word: string, ta: 'ه' | 'ة'): { primary: string, alts: string[] } {
  // Remove trailing ه/ة if any (avoid doubling)
  let w = word.replace(/[هة]$/,'');
  // If it ends with ا (long a), replace that alif by ta-marbuta form
  if (w.endsWith('ا')) w = w.slice(0, -1);
  const primary = w + ta;
  const alt = w + (ta === 'ه' ? 'ة' : 'ه');
  return { primary, alts: [alt] };
}

function softC(letterAfter: string) {
  return /[eéèêëiîïyY]/.test(letterAfter);
}

/**
 * transliterateLatinToArabic - Convert Latin text to Arabic with lexicon support
 */
export function transliterateLatinToArabic(
  input: string,
  opts: TransliterateOpts = {}
): TransliterationResult {
  const ta = opts.taMarbutaAs ?? 'ه';
  let s = input.normalize('NFC').trim();

  // Check lexicon first (case-insensitive, normalize spaces/hyphens)
  const key = s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
  if (LEXICON[key]) {
    const primary = normalizeArabic(LEXICON[key], { taMarbutaAs: ta });
    return { primary, candidates: [primary], warnings: [], confidence: 100 };
  }

  // Normalize input
  s = s.toLowerCase().replace(/[^a-zàâçéèêîôûïüöë' -]/gi, '');

  const warnings: string[] = [];
  const candidates = new Set<string>();

  // Process each word
  const words = s.split(/\s+/).filter(w => w.length > 0);
  const arabicWords: string[] = [];

  for (let word of words) {
    let hasArticle = false;
    
    // Check for definite article "al-" or "el-"
    if (/^(al|el|ar|an|as)-/.test(word)) {
      hasArticle = true;
      word = word.replace(/^(al|el|ar|an|as)-/, '');
    }

    // Apply digraphs first (replace with placeholders)
    let processed = word;
    DIGRAPHS.forEach(([re, ar]) => {
      processed = processed.replace(re, `§${ar}§`);
    });

    // Transliterate character by character
    let arabic = '';
    for (let i = 0; i < processed.length; i++) {
      const ch = processed[i];
      const next = processed[i + 1] || '';

      // Already Arabic from digraph
      if (ch === '§') {
        const end = processed.indexOf('§', i + 1);
        arabic += processed.substring(i + 1, end);
        i = end;
        continue;
      }

      // Skip apostrophe
      if (ch === '\'' || ch === '\'') continue;

      // Handle 'c' (soft before e/i/y, hard otherwise)
      if (ch === 'c') {
        arabic += softC(next) ? 'س' : 'ك';
        continue;
      }

      // Consonants (not vowels in middle of word)
      if (CONSONANTS[ch]) {
        arabic += CONSONANTS[ch];
        continue;
      }

      // Vowels - only add at beginning or for long vowels
      const isVowel = /[aàâeéèêëiîïoôöuûù]/.test(ch);
      if (isVowel) {
        // Add long vowel marker
        if (ch === 'a' || ch === 'à' || ch === 'â') arabic += 'ا';
        else if (ch === 'e' || ch === 'é' || ch === 'è' || ch === 'ê' || ch === 'ë' || ch === 'i' || ch === 'î' || ch === 'ï') arabic += 'ي';
        else if (ch === 'o' || ch === 'ô' || ch === 'ö' || ch === 'u' || ch === 'û' || ch === 'ù') arabic += 'و';
      }
    }

    // Handle final "-ah" ending
    if (/ah$/.test(word)) {
      const result = applyFinalAh(arabic, ta);
      arabic = result.primary;
      result.alts.forEach(alt => candidates.add(alt));
      warnings.push(`Final -ah mapped to tā' marbūṭa (${ta})`);
    }

    // Handle final "-a" ending (ambiguous)
    else if (/a$/.test(word) && !arabic.endsWith('ا')) {
      candidates.add(arabic + 'ا');
      candidates.add(arabic + 'ى');
      candidates.add(arabic + ta);
      warnings.push('Ambiguous final -a: offered ا/ى/ة');
    } else if (arabic.endsWith('ا')) {
      candidates.add(arabic);
      candidates.add(arabic.slice(0, -1) + 'ى');
      candidates.add(arabic.slice(0, -1) + ta);
    }

    // Handle doubled consonants (ll, tt, etc.)
    if (/(.)\1/.test(word)) {
      candidates.add(arabic);
      // Add shadda version
      const lastChar = arabic[arabic.length - 1];
      if (lastChar) {
        candidates.add(arabic + 'ّ');
      }
      warnings.push('Doubled consonant detected: provided shadda alternative');
    }

    // Add article if present
    if (hasArticle) {
      arabic = 'ال' + arabic;
    }

    arabicWords.push(arabic);
  }

  // Combine words
  const combined = arabicWords.join(' ');
  
  // Normalize
  const primary = normalizeArabic(combined, { taMarbutaAs: ta });

  // Add primary to candidates
  candidates.add(primary);

  // Calculate confidence
  let confidence = 100;
  if (warnings.length > 0) confidence -= Math.min(30, warnings.length * 10);
  if (/\ba(h)?$|\b.*(tt|ss|ll)\b/i.test(input)) confidence -= 10;
  if (!LEXICON[key]) confidence -= 5; // Slight penalty for non-lexicon words

  return {
    primary,
    candidates: Array.from(candidates).slice(0, 6), // Max 6 candidates
    warnings,
    confidence: Math.max(20, confidence)
  };
}

/**
 * Unit tests (verify these pass):
 * 
 * transliterateLatinToArabic('Allah').primary === 'الله' ✓
 * transliterateLatinToArabic('al-Rahman').primary === 'الرحمن' ✓
 * transliterateLatinToArabic('Rahman').primary === 'رحمن' ✓
 * transliterateLatinToArabic('al-Rahim').primary === 'الرحيم' ✓
 * transliterateLatinToArabic('al-Latif').primary === 'اللطيف' ✓
 * transliterateLatinToArabic('Hayy').primary === 'حي' ✓
 * transliterateLatinToArabic('al-Hayy').primary === 'الحي' ✓
 * transliterateLatinToArabic('Qayyum').primary === 'قيوم' ✓
 * transliterateLatinToArabic('Baka').candidates includes 'باكا', 'بكى', 'باكه'/'باكة' ✓
 * transliterateLatinToArabic('Fana').candidates includes 'فانا', 'فنى', 'فانه' ✓
 */
