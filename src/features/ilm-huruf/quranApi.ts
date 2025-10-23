/**
 * Quran API Integration
 * Fetches verse text from Quran.com API
 */

export type VerseText = {
  arabic: string;
  translation: string;
  translationName: string;
};

/**
 * Fetch a specific verse from the Quran
 * Uses the Quran.com API (https://api.quran.com)
 * 
 * @param surahNumber - The surah number (1-114)
 * @param ayahNumber - The ayah number
 * @returns Promise with verse text in Arabic and English translation
 */
export async function fetchQuranVerse(
  surahNumber: number,
  ayahNumber: number
): Promise<VerseText | null> {
  try {
    // Fetch Arabic text
    const arabicResponse = await fetch(
      `https://api.quran.com/api/v4/verses/by_key/${surahNumber}:${ayahNumber}?fields=text_uthmani`
    );
    
    if (!arabicResponse.ok) {
      console.error('Failed to fetch Arabic verse');
      return null;
    }
    
    const arabicData = await arabicResponse.json();
    
    // Fetch English translation (using Dr. Mustafa Khattab's translation - ID: 131)
    const translationResponse = await fetch(
      `https://api.quran.com/api/v4/verses/by_key/${surahNumber}:${ayahNumber}?translations=131`
    );
    
    if (!translationResponse.ok) {
      console.error('Failed to fetch translation');
      return null;
    }
    
    const translationData = await translationResponse.json();
    
    return {
      arabic: arabicData.verse?.text_uthmani || '',
      translation: translationData.verse?.translations?.[0]?.text || '',
      translationName: "The Clear Quran, Dr. Mustafa Khattab"
    };
  } catch (error) {
    console.error('Error fetching Quran verse:', error);
    return null;
  }
}
