/**
 * Quran API Integration
 * Fetches verse text from Quran.com API
 * Includes validation to prevent invalid surah/ayah lookups
 */

export type VerseText = {
  arabic: string;
  translation: string;
  translationName: string;
};

/**
 * Number of ayahs in each surah of the Quran
 * Total: 6236 verses across 114 surahs
 */
export const AYAH_COUNTS: Record<number, number> = {
  1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129, 10: 109,
  11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111, 18: 110, 19: 98, 20: 135,
  21: 112, 22: 78, 23: 118, 24: 64, 25: 77, 26: 227, 27: 93, 28: 88, 29: 69, 30: 60,
  31: 34, 32: 30, 33: 73, 34: 54, 35: 45, 36: 83, 37: 182, 38: 88, 39: 75, 40: 85,
  41: 54, 42: 53, 43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18, 50: 45,
  51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29, 58: 22, 59: 24, 60: 13,
  61: 14, 62: 11, 63: 11, 64: 18, 65: 12, 66: 12, 67: 30, 68: 52, 69: 52, 70: 44,
  71: 28, 72: 28, 73: 20, 74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46, 80: 42,
  81: 29, 82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30, 90: 20,
  91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8, 100: 11,
  101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3,
  111: 5, 112: 4, 113: 5, 114: 6
};

/**
 * Validate if a surah and ayah combination is valid
 * @param surah - Surah number (1-114)
 * @param ayah - Ayah number
 * @returns true if valid, false otherwise
 */
export function validateVerseReference(surah: number, ayah: number): boolean {
  // Check surah range
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) {
    return false;
  }
  
  // Check ayah range for this surah
  const maxAyah = AYAH_COUNTS[surah];
  if (!Number.isInteger(ayah) || ayah < 1 || ayah > maxAyah) {
    return false;
  }
  
  return true;
}

/**
 * Fetch a specific verse from the Quran
 * Uses the Quran.com API (https://api.quran.com)
 * Includes validation to prevent invalid requests
 * Has fallback support for multiple API endpoints
 * 
 * @param surahNumber - The surah number (1-114)
 * @param ayahNumber - The ayah number
 * @returns Promise with verse text in Arabic and English translation, or null if not found
 */
export async function fetchQuranVerse(
  surahNumber: number,
  ayahNumber: number
): Promise<VerseText | null> {
  // Validate the verse reference first
  if (!validateVerseReference(surahNumber, ayahNumber)) {
    console.error(
      `Invalid verse reference: Surah ${surahNumber}, Ayah ${ayahNumber}. ` +
      `Valid range: Surah 1-114, Ayah 1-${AYAH_COUNTS[surahNumber] || 'N/A'}`
    );
    return null;
  }
  
  try {
    // Try primary endpoint first
    console.log(`Fetching verse: ${surahNumber}:${ayahNumber}`);
    
    // Fetch Arabic text
    const arabicResponse = await fetch(
      `https://api.quran.com/api/v4/verses/by_key/${surahNumber}:${ayahNumber}?fields=text_uthmani`,
      { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!arabicResponse.ok) {
      console.error(`Failed to fetch Arabic verse: ${surahNumber}:${ayahNumber} (Status: ${arabicResponse.status})`);
      return tryAlternativeAPI(surahNumber, ayahNumber);
    }
    
    const arabicData = await arabicResponse.json();
    console.log(`Arabic data received:`, arabicData);
    
    // Fetch English translation (using Dr. Mustafa Khattab's translation - ID: 131)
    const translationResponse = await fetch(
      `https://api.quran.com/api/v4/verses/by_key/${surahNumber}:${ayahNumber}?translations=131`,
      { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!translationResponse.ok) {
      console.error(`Failed to fetch translation for ${surahNumber}:${ayahNumber} (Status: ${translationResponse.status})`);
      // If translation fails, still show Arabic
      if (arabicData.verse?.text_uthmani) {
        return {
          arabic: arabicData.verse.text_uthmani,
          translation: "Translation not available. Please visit Quran.com for the full translation.",
          translationName: "Quran.com API"
        };
      }
      return null;
    }
    
    const translationData = await translationResponse.json();
    console.log(`Translation data received:`, translationData);
    
    const verse: VerseText = {
      arabic: arabicData.verse?.text_uthmani || '',
      translation: translationData.verse?.translations?.[0]?.text || '',
      translationName: translationData.verse?.translations?.[0]?.translation_name || "The Clear Quran, Dr. Mustafa Khattab"
    };
    
    // Validate that we got actual content
    if (!verse.arabic) {
      console.error(`Verse data incomplete for ${surahNumber}:${ayahNumber}`);
      return null;
    }
    
    console.log(`Successfully fetched verse ${surahNumber}:${ayahNumber}`);
    return verse;
  } catch (error) {
    console.error(`Error fetching Quran verse ${surahNumber}:${ayahNumber}:`, error);
    return tryAlternativeAPI(surahNumber, ayahNumber);
  }
}

/**
 * Try alternative API endpoint (alquran.cloud) as fallback
 */
async function tryAlternativeAPI(surahNumber: number, ayahNumber: number): Promise<VerseText | null> {
  try {
    console.log(`Trying alternative API for ${surahNumber}:${ayahNumber}`);
    
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/quran-uthmani,en.sahih`,
      { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      console.error(`Alternative API also failed (Status: ${response.status})`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.data && Array.isArray(data.data) && data.data.length >= 2) {
      const verse: VerseText = {
        arabic: data.data[0].text || '',
        translation: data.data[1].text || '',
        translationName: "Sahih International"
      };
      
      if (verse.arabic) {
        console.log(`Successfully fetched from alternative API`);
        return verse;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Alternative API error:`, error);
    return null;
  }
}
