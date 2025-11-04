/**
 * West African Name Transliterations
 * Mapping between Latin (English/French) and Arabic script names
 * Common names from Gambia, Senegal, and West African Islamic communities
 */

export interface NameTransliteration {
  arabic: string;
  latin: string;
  /** Additional alternative spellings */
  alternatives?: string[];
}

export const nameTransliterations: NameTransliteration[] = [
  {
    arabic: "لمي",
    latin: "lamin",
    alternatives: ["lamine"]
  },
  {
    arabic: "سيك",
    latin: "saikou"
  },
  {
    arabic: "كم",
    latin: "kamo"
  },
  {
    arabic: "موس",
    latin: "musa",
    alternatives: ["moussa"]
  },
  {
    arabic: "مود",
    latin: "modou"
  },
  {
    arabic: "بكل",
    latin: "bakari"
  },
  {
    arabic: "إللاج",
    latin: "elhag"
  },
  {
    arabic: "الحاج",
    latin: "alhagie",
    alternatives: ["alhagi"]
  },
  {
    arabic: "ابرام",
    latin: "ibrama"
  },
  {
    arabic: "إبراهيم",
    latin: "ibrahima",
    alternatives: ["ebrahima"]
  },
  {
    arabic: "ابدالله",
    latin: "abdalah",
    alternatives: ["abdala", "abdoulie"]
  },
  {
    arabic: "عبد الله",
    latin: "abdullah",
    alternatives: ["abdallah", "abdoulie"]
  },
  {
    arabic: "عثمان",
    latin: "ousman"
  },
  {
    arabic: "اسمان",
    latin: "osmane"
  },
  {
    arabic: "باكر",
    latin: "bakary"
  },
  {
    arabic: "بك",
    latin: "baka"
  },
  {
    arabic: "كيبا",
    latin: "kebba",
    alternatives: ["keba"]
  },
  {
    arabic: "سليمان",
    latin: "sulayman"
  },
  {
    arabic: "جات",
    latin: "fatou",
    alternatives: ["fatu"]
  },
  {
    arabic: "فاطمة",
    latin: "fatima",
    alternatives: ["fatimah", "fatimatou"]
  },
  {
    arabic: "أج",
    latin: "aji",
    alternatives: ["adjie"]
  },
  {
    arabic: "إيسة",
    latin: "isatou",
    alternatives: ["aissatou"]
  },
  {
    arabic: "نم",
    latin: "nyima"
  },
  {
    arabic: "سر",
    latin: "sira"
  },
  {
    arabic: "فنت",
    latin: "fanta"
  },
  {
    arabic: "خد",
    latin: "haddy"
  },
  {
    arabic: "كمب",
    latin: "kumba",
    alternatives: ["coumba"]
  },
  {
    arabic: "او",
    latin: "awa"
  },
  {
    arabic: "بنت",
    latin: "binta",
    alternatives: ["bintou"]
  },
  {
    arabic: "امنة",
    latin: "aminata",
    alternatives: ["amminata"]
  },
  {
    arabic: "حواء",
    latin: "hawa"
  },
  {
    arabic: "شيخ",
    latin: "saihou"
  },
  {
    arabic: "باي",
    latin: "bai",
    alternatives: ["baye"]
  },
  {
    arabic: "شرن",
    latin: "seringe",
    alternatives: ["serigne"]
  },
  {
    arabic: "بب",
    latin: "pap"
  },
  {
    arabic: "فل",
    latin: "fallu",
    alternatives: ["fallou"]
  },
  {
    arabic: "مومود",
    latin: "momodou",
    alternatives: ["momodu"]
  },
  {
    arabic: "فان",
    latin: "fana"
  },
  {
    arabic: "مالك",
    latin: "malick",
    alternatives: ["malic", "malik"]
  },
  {
    arabic: "بابكر",
    latin: "babacar",
    alternatives: ["babakar", "babukar", "babucarr", "babacarr"]
  },
  {
    arabic: "بوبكر",
    latin: "bubakar",
    alternatives: ["boubakar"]
  },
  {
    arabic: "ابو بكر",
    latin: "abubakar",
    alternatives: ["aboubacarr"]
  },
  {
    arabic: "ابالكر",
    latin: "ababacar",
    alternatives: ["ababakar"]
  },
  {
    arabic: "كرا",
    latin: "kara"
  },
  {
    arabic: "م مد",
    latin: "mamadu",
    alternatives: ["mamadou"]
  },
  {
    arabic: "حد",
    latin: "haddy",
    alternatives: ["hady"]
  },
  {
    arabic: "باب",
    latin: "pape"
  },
  {
    arabic: "بوكر",
    latin: "boukar",
    alternatives: ["boucar"]
  },
  {
    arabic: "محمد",
    latin: "muhammadu",
    alternatives: ["muhammadou"]
  },
  {
    arabic: "كد",
    latin: "kady",
    alternatives: ["kadi"]
  },
  {
    arabic: "سكن",
    latin: "sohna",
    alternatives: ["sokhna"]
  },
  {
    arabic: "رقي",
    latin: "rokhya"
  },
  {
    arabic: "رجي",
    latin: "rohya"
  },
  {
    arabic: "رغ",
    latin: "rugi"
  },
  {
    arabic: "رغية",
    latin: "rugiatou"
  },
  {
    arabic: "ادم",
    latin: "adama",
    alternatives: ["adam"]
  },
  {
    arabic: "مريم",
    latin: "mariam"
  },
  {
    arabic: "ابي",
    latin: "abbi",
    alternatives: ["abi"]
  },
  {
    arabic: "حبي",
    latin: "habbi",
    alternatives: ["habi", "habby"]
  },
  {
    arabic: "حبيبة",
    latin: "habibatou"
  },
  {
    arabic: "أنس",
    latin: "ansu"
  },
  {
    arabic: "امد",
    latin: "amadou",
    alternatives: ["amadu"]
  },
  {
    arabic: "سمب",
    latin: "samba"
  },
  {
    arabic: "الفا",
    latin: "alpha"
  },
  {
    arabic: "سيرن",
    latin: "cherno"
  },
  {
    arabic: "سيد",
    latin: "saidou",
    alternatives: ["saidu"]
  },
  {
    arabic: "ابيبة",
    latin: "abibatou"
  },
  {
    arabic: "امد",
    latin: "amadi"
  },
  {
    arabic: "اب",
    latin: "ebu",
    alternatives: ["ebou", "ibu"]
  },
  {
    arabic: "أم  ر",
    latin: "omar",
    alternatives: ["umar"]
  },
  {
    arabic: "أبدل",
    latin: "abdul",
    alternatives: ["abdoul"]
  },
  {
    arabic: "حمد",
    latin: "hamadi"
  },
  {
    arabic: "داد",
    latin: "dawda"
  },
  {
    arabic: "را  مة",
    latin: "ramata"
  },
  {
    arabic: "رمة",
    latin: "ramatu"
  },
  {
    arabic: "ميمون",
    latin: "maimouna"
  },
  {
    arabic: "ميمن",
    latin: "maimuna"
  },
  {
    arabic: "أبس",
    latin: "ansu"
  },
  {
    arabic: "كلف",
    latin: "kalifa"
  },
  {
    arabic: "لندغ",
    latin: "landing"
  },
  {
    arabic: "جلف",
    latin: "khalifa"
  }
];

/**
 * Search for Arabic name matches based on Latin input
 * Case-insensitive fuzzy matching
 */
export function searchNameTransliterations(query: string): NameTransliteration[] {
  if (!query || query.trim().length === 0) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // Find exact and partial matches
  const matches = nameTransliterations.filter(item => {
    const latinMatch = item.latin.toLowerCase().includes(normalizedQuery);
    const altMatch = item.alternatives?.some(alt => alt.toLowerCase().includes(normalizedQuery));
    return latinMatch || altMatch;
  });
  
  // Sort by relevance: exact matches first, then starts-with, then contains
  return matches.sort((a, b) => {
    const aLatin = a.latin.toLowerCase();
    const bLatin = b.latin.toLowerCase();
    
    // Exact match
    if (aLatin === normalizedQuery) return -1;
    if (bLatin === normalizedQuery) return 1;
    
    // Starts with
    const aStarts = aLatin.startsWith(normalizedQuery);
    const bStarts = bLatin.startsWith(normalizedQuery);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    
    // Alphabetical for remaining
    return aLatin.localeCompare(bLatin);
  });
}

/**
 * Get display label for a name with alternatives
 */
export function getNameDisplayLabel(item: NameTransliteration): string {
  if (!item.alternatives || item.alternatives.length === 0) {
    return item.latin;
  }
  return `${item.latin} (${item.alternatives.join(', ')})`;
}
