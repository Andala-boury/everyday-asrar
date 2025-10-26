import { 
  SpiritualDestinyResult, 
  ElementalTemperamentResult, 
  PlanetaryCosmicResult,
  RelationshipCompatibility
} from '../types/compatibility';
import { PLANETARY_RULERS, PLANETARY_RELATIONSHIPS } from '../constants/compatibility';

// ============================================================================
// 1️⃣ SPIRITUAL-DESTINY METHOD (Mod-9)
// ============================================================================

export function calculateSpiritualDestiny(
  abjadTotal1: number,
  abjadTotal2: number
): SpiritualDestinyResult {
  
  // Formula: (Total1 + Total2 + 7) mod 9
  const sum = abjadTotal1 + abjadTotal2 + 7;
  const remainder = sum % 9 === 0 ? 9 : sum % 9; // Treat 0 as 9
  
  // Score mapping based on classical interpretations
  const scoreMap: Record<number, { score: number; quality: SpiritualDestinyResult['quality']; qualityArabic: string }> = {
    1: { score: 65, quality: 'moderate', qualityArabic: 'متوسط' },
    2: { score: 70, quality: 'good', qualityArabic: 'جيد' },
    3: { score: 75, quality: 'good', qualityArabic: 'جيد' },
    4: { score: 70, quality: 'good', qualityArabic: 'جيد' },
    5: { score: 60, quality: 'moderate', qualityArabic: 'متوسط' },
    6: { score: 55, quality: 'challenging', qualityArabic: 'تحدي' },
    7: { score: 95, quality: 'excellent', qualityArabic: 'ممتاز' },
    8: { score: 90, quality: 'excellent', qualityArabic: 'ممتاز جداً' },
    9: { score: 50, quality: 'completion', qualityArabic: 'إتمام دورة' }
  };
  
  const result = scoreMap[remainder];
  
  // Descriptions based on remainder
  const descriptions: Record<number, { en: string; ar: string }> = {
    1: {
      en: 'New beginnings and fresh energy. This pairing initiates new chapters together.',
      ar: 'بدايات جديدة وطاقة متجددة. هذا الزوج يبدأ فصولاً جديدة معاً.'
    },
    2: {
      en: 'Balance and duality. Both individuals complement each other through cooperation.',
      ar: 'توازن وثنائية. كلا الطرفين يكمل الآخر من خلال التعاون.'
    },
    3: {
      en: 'Creative expression and growth. This combination fosters creativity and expansion.',
      ar: 'تعبير إبداعي ونمو. هذا المزيج يعزز الإبداع والتوسع.'
    },
    4: {
      en: 'Stability and structure. A grounded partnership built on solid foundations.',
      ar: 'استقرار وبنية. شراكة متأصلة مبنية على أسس صلبة.'
    },
    5: {
      en: 'Dynamic change and adaptability. This pairing thrives on variety and movement.',
      ar: 'تغيير ديناميكي وقابلية للتكيف. هذا الزوج يزدهر بالتنوع والحركة.'
    },
    6: {
      en: 'Responsibility and service. May require effort but builds strong commitment.',
      ar: 'مسؤولية وخدمة. قد يتطلب جهداً لكن يبني التزاماً قوياً.'
    },
    7: {
      en: 'Spiritual harmony and wisdom. An ideal match with deep understanding.',
      ar: 'انسجام روحاني وحكمة. توافق مثالي مع فهم عميق.'
    },
    8: {
      en: 'Abundance and manifestation. This pair has strong potential for achievement.',
      ar: 'وفرة وتجسيد. هذا الثنائي لديه إمكانات قوية للإنجاز.'
    },
    9: {
      en: 'Completion and transformation. A karmic connection bringing cycles to close.',
      ar: 'إتمام وتحول. ارتباط كارمي يجلب الدورات إلى نهايتها.'
    }
  };
  
  const desc = descriptions[remainder];
  const colors = {
    excellent: 'green',
    good: 'blue',
    moderate: 'yellow',
    challenging: 'orange',
    completion: 'purple'
  };
  
  return {
    method: 'spiritual-destiny',
    methodArabic: 'الطريقة الروحانية',
    remainder,
    score: result.score,
    quality: result.quality,
    qualityArabic: result.qualityArabic,
    description: desc.en,
    descriptionArabic: desc.ar,
    color: colors[result.quality]
  };
}

// ============================================================================
// 2️⃣ ELEMENTAL-TEMPERAMENT METHOD (Mod-4)
// ============================================================================

export function calculateElementalTemperament(
  abjadTotal1: number,
  abjadTotal2: number
): ElementalTemperamentResult {
  
  // Formula: (Total1 + Total2) mod 4
  const sum = abjadTotal1 + abjadTotal2;
  const remainder = sum % 4 === 0 ? 4 : sum % 4; // Treat 0 as 4
  
  // Map remainder to elements
  const elementMap: Record<number, { 
    element: 'fire' | 'water' | 'air' | 'earth';
    elementArabic: string;
    score: number;
    quality: ElementalTemperamentResult['quality'];
    qualityArabic: string;
  }> = {
    1: {
      element: 'fire',
      elementArabic: 'نار',
      score: 85,
      quality: 'dynamic',
      qualityArabic: 'ديناميكي'
    },
    2: {
      element: 'water',
      elementArabic: 'ماء',
      score: 80,
      quality: 'harmonious',
      qualityArabic: 'متناغم'
    },
    3: {
      element: 'air',
      elementArabic: 'هواء',
      score: 75,
      quality: 'balanced',
      qualityArabic: 'متوازن'
    },
    4: {
      element: 'earth',
      elementArabic: 'تراب',
      score: 90,
      quality: 'complementary',
      qualityArabic: 'تكميلي'
    }
  };
  
  const result = elementMap[remainder];
  
  // Descriptions based on shared element
  const descriptions: Record<typeof result.element, { en: string; ar: string }> = {
    fire: {
      en: 'Passionate and energetic chemistry. Both partners bring enthusiasm and drive.',
      ar: 'كيمياء عاطفية ونشطة. كلا الشريكين يجلبان الحماس والدافع.'
    },
    water: {
      en: 'Emotional depth and intuitive connection. A nurturing and empathetic bond.',
      ar: 'عمق عاطفي واتصال حدسي. رابطة راعية ومتعاطفة.'
    },
    air: {
      en: 'Intellectual stimulation and clear communication. Mental compatibility is strong.',
      ar: 'تحفيز فكري وتواصل واضح. التوافق العقلي قوي.'
    },
    earth: {
      en: 'Practical stability and reliable support. A grounded, lasting partnership.',
      ar: 'استقرار عملي ودعم موثوق. شراكة متأصلة ودائمة.'
    }
  };
  
  const desc = descriptions[result.element];
  const colors = {
    fire: 'red',
    water: 'blue',
    air: 'cyan',
    earth: 'green'
  };
  
  return {
    method: 'elemental-temperament',
    methodArabic: 'طريقة الطبائع الأربع',
    remainder,
    sharedElement: result.element,
    sharedElementArabic: result.elementArabic,
    score: result.score,
    quality: result.quality,
    qualityArabic: result.qualityArabic,
    description: desc.en,
    descriptionArabic: desc.ar,
    color: colors[result.element]
  };
}

// ============================================================================
// 3️⃣ PLANETARY-COSMIC METHOD
// ============================================================================

export function calculatePlanetaryCosmic(
  abjadTotal1: number,
  abjadTotal2: number
): PlanetaryCosmicResult {
  
  // Assign ruling planets based on mod 7
  const planet1Index = abjadTotal1 % 7;
  const planet2Index = abjadTotal2 % 7;
  
  const planet1 = PLANETARY_RULERS[planet1Index as keyof typeof PLANETARY_RULERS];
  const planet2 = PLANETARY_RULERS[planet2Index as keyof typeof PLANETARY_RULERS];
  
  // Determine relationship between planets
  let relationship: 'friendly' | 'neutral' | 'opposing';
  let relationshipArabic: string;
  let score: number;
  let quality: PlanetaryCosmicResult['quality'];
  let qualityArabic: string;
  
  const planetRelations = PLANETARY_RELATIONSHIPS[planet1.name];
  
  if (planet1.name === planet2.name) {
    relationship = 'friendly';
    relationshipArabic = 'صديق';
    score = 100;
    quality = 'excellent';
    qualityArabic = 'ممتاز';
  } else if (planetRelations.friendly.includes(planet2.name)) {
    relationship = 'friendly';
    relationshipArabic = 'صديق';
    score = 85;
    quality = 'excellent';
    qualityArabic = 'ممتاز';
  } else if (planetRelations.neutral.includes(planet2.name)) {
    relationship = 'neutral';
    relationshipArabic = 'محايد';
    score = 65;
    quality = 'good';
    qualityArabic = 'جيد';
  } else {
    relationship = 'opposing';
    relationshipArabic = 'متعارض';
    score = 45;
    quality = 'challenging';
    qualityArabic = 'تحدي';
  }
  
  // Generate descriptions
  const descriptions: Record<typeof relationship, { en: string; ar: string }> = {
    friendly: {
      en: `${planet1.name} and ${planet2.name} are harmonious celestial allies. Their cosmic energies flow smoothly together.`,
      ar: `${planet1.nameArabic} و ${planet2.nameArabic} حلفاء سماويون متناغمون. طاقاتهم الكونية تتدفق بسلاسة معاً.`
    },
    neutral: {
      en: `${planet1.name} and ${planet2.name} maintain balanced cosmic positions. Requires conscious effort for alignment.`,
      ar: `${planet1.nameArabic} و ${planet2.nameArabic} يحافظان على مواقع كونية متوازنة. يتطلب جهداً واعياً للتوافق.`
    },
    opposing: {
      en: `${planet1.name} and ${planet2.name} have challenging cosmic aspects. Growth comes through navigating differences.`,
      ar: `${planet1.nameArabic} و ${planet2.nameArabic} لديهما جوانب كونية صعبة. النمو يأتي من خلال التعامل مع الاختلافات.`
    }
  };
  
  const desc = descriptions[relationship];
  const colors = {
    excellent: 'green',
    good: 'blue',
    moderate: 'yellow',
    challenging: 'orange'
  };
  
  return {
    method: 'planetary-cosmic',
    methodArabic: 'الطريقة الكوكبية',
    person1Planet: planet1,
    person2Planet: planet2,
    relationship,
    relationshipArabic,
    score,
    quality,
    qualityArabic,
    description: desc.en,
    descriptionArabic: desc.ar,
    color: colors[quality]
  };
}

// ============================================================================
// COMBINED RELATIONSHIP COMPATIBILITY ANALYSIS
// ============================================================================

export function analyzeRelationshipCompatibility(
  person1Name: string,
  person1Arabic: string,
  person1AbjadTotal: number,
  person1Element: 'fire' | 'water' | 'air' | 'earth',
  person2Name: string,
  person2Arabic: string,
  person2AbjadTotal: number,
  person2Element: 'fire' | 'water' | 'air' | 'earth'
): RelationshipCompatibility {
  
  // Calculate using all three methods
  const spiritualDestiny = calculateSpiritualDestiny(person1AbjadTotal, person2AbjadTotal);
  const elementalTemperament = calculateElementalTemperament(person1AbjadTotal, person2AbjadTotal);
  const planetaryCosmic = calculatePlanetaryCosmic(person1AbjadTotal, person2AbjadTotal);
  
  // Calculate overall score (weighted average)
  // Spiritual-Destiny: 35%, Elemental-Temperament: 35%, Planetary-Cosmic: 30%
  const overallScore = Math.round(
    (spiritualDestiny.score * 0.35) + 
    (elementalTemperament.score * 0.35) + 
    (planetaryCosmic.score * 0.30)
  );
  
  // Determine overall quality
  let overallQuality: RelationshipCompatibility['overallQuality'];
  let overallQualityArabic: string;
  
  if (overallScore >= 85) {
    overallQuality = 'excellent';
    overallQualityArabic = 'ممتاز';
  } else if (overallScore >= 75) {
    overallQuality = 'very-good';
    overallQualityArabic = 'جيد جداً';
  } else if (overallScore >= 65) {
    overallQuality = 'good';
    overallQualityArabic = 'جيد';
  } else if (overallScore >= 50) {
    overallQuality = 'moderate';
    overallQualityArabic = 'متوسط';
  } else {
    overallQuality = 'challenging';
    overallQualityArabic = 'تحدي';
  }
  
  // Generate summary
  const summaries: Record<typeof overallQuality, { en: string; ar: string }> = {
    'excellent': {
      en: `${person1Name} and ${person2Name} share exceptional compatibility across spiritual, elemental, and cosmic dimensions. This pairing has strong potential for harmony and mutual growth.`,
      ar: `${person1Name} و ${person2Name} يتشاركان توافقاً استثنائياً عبر الأبعاد الروحانية والعنصرية والكونية. هذا الثنائي لديه إمكانات قوية للانسجام والنمو المتبادل.`
    },
    'very-good': {
      en: `${person1Name} and ${person2Name} demonstrate strong compatibility with excellent alignment in most areas. Minor differences can be easily harmonized.`,
      ar: `${person1Name} و ${person2Name} يظهران توافقاً قوياً مع انسجام ممتاز في معظم المجالات. الاختلافات البسيطة يمكن تنسيقها بسهولة.`
    },
    'good': {
      en: `${person1Name} and ${person2Name} have good compatibility with balanced energies. With understanding and effort, this connection can flourish.`,
      ar: `${person1Name} و ${person2Name} لديهما توافق جيد مع طاقات متوازنة. مع الفهم والجهد، يمكن أن تزدهر هذه العلاقة.`
    },
    'moderate': {
      en: `${person1Name} and ${person2Name} show moderate compatibility with both strengths and challenges. Conscious communication is key to success.`,
      ar: `${person1Name} و ${person2Name} يظهران توافقاً متوسطاً مع نقاط قوة وتحديات. التواصل الواعي هو مفتاح النجاح.`
    },
    'challenging': {
      en: `${person1Name} and ${person2Name} face notable differences that require patience and mutual respect. Growth comes through embracing complementary perspectives.`,
      ar: `${person1Name} و ${person2Name} يواجهان اختلافات ملحوظة تتطلب الصبر والاحترام المتبادل. النمو يأتي من خلال تبني وجهات نظر تكميلية.`
    }
  };
  
  const summary = summaries[overallQuality];
  
  // Generate recommendations based on scores
  const recommendations: string[] = [];
  const recommendationsArabic: string[] = [];
  
  // Spiritual-Destiny recommendations
  if (spiritualDestiny.score >= 85) {
    recommendations.push('Your spiritual alignment is exceptional. Continue deepening your shared understanding through meditation or reflection together.');
    recommendationsArabic.push('توافقكما الروحاني استثنائي. استمرا في تعميق فهمكما المشترك من خلال التأمل أو التفكير معاً.');
  } else if (spiritualDestiny.score < 60) {
    recommendations.push('Your spiritual paths may differ. Respect each other\'s journey and find common ground in shared values.');
    recommendationsArabic.push('مساراتكما الروحانية قد تختلف. احترما رحلة كل منكما وابحثا عن أرضية مشتركة في القيم المشتركة.');
  }
  
  // Elemental-Temperament recommendations
  if (elementalTemperament.sharedElement === 'fire' || elementalTemperament.sharedElement === 'air') {
    recommendations.push(`Your ${elementalTemperament.sharedElement} energy creates dynamic interaction. Channel this into creative projects or shared adventures.`);
    recommendationsArabic.push(`طاقة ${elementalTemperament.sharedElementArabic} تخلق تفاعلاً ديناميكياً. وجها هذا نحو مشاريع إبداعية أو مغامرات مشتركة.`);
  } else {
    recommendations.push(`Your ${elementalTemperament.sharedElement} connection provides stability. Build a strong foundation through consistent routines.`);
    recommendationsArabic.push(`اتصال ${elementalTemperament.sharedElementArabic} يوفر الاستقرار. ابنيا أساساً قوياً من خلال روتين ثابت.`);
  }
  
  // Planetary-Cosmic recommendations
  if (planetaryCosmic.relationship === 'friendly') {
    recommendations.push(`${planetaryCosmic.person1Planet.name} and ${planetaryCosmic.person2Planet.name} support each other naturally. Trust your intuitive connection.`);
    recommendationsArabic.push(`${planetaryCosmic.person1Planet.nameArabic} و ${planetaryCosmic.person2Planet.nameArabic} يدعمان بعضهما بشكل طبيعي. ثقا في اتصالكما الحدسي.`);
  } else if (planetaryCosmic.relationship === 'opposing') {
    recommendations.push(`${planetaryCosmic.person1Planet.name} and ${planetaryCosmic.person2Planet.name} create tension. Use this as an opportunity to learn from different perspectives.`);
    recommendationsArabic.push(`${planetaryCosmic.person1Planet.nameArabic} و ${planetaryCosmic.person2Planet.nameArabic} يخلقان توتراً. استخدما هذا كفرصة للتعلم من وجهات نظر مختلفة.`);
  }
  
  // Universal recommendation
  recommendations.push('Practice patience, kindness, and open communication to nurture your connection.');
  recommendationsArabic.push('مارسا الصبر واللطف والتواصل المفتوح لرعاية علاقتكما.');
  
  return {
    mode: 'relationship',
    person1: {
      name: person1Name,
      arabicName: person1Arabic,
      abjadTotal: person1AbjadTotal,
      element: person1Element
    },
    person2: {
      name: person2Name,
      arabicName: person2Arabic,
      abjadTotal: person2AbjadTotal,
      element: person2Element
    },
    methods: {
      spiritualDestiny,
      elementalTemperament,
      planetaryCosmic
    },
    overallScore,
    overallQuality,
    overallQualityArabic,
    summary: summary.en,
    summaryArabic: summary.ar,
    recommendations,
    recommendationsArabic
  };
}

// ============================================================================
// HELPER: Determine Element from Abjad Total
// ============================================================================

export function getElementFromAbjadTotal(abjadTotal: number): 'fire' | 'water' | 'air' | 'earth' {
  // Use Hadath (mod 4) to determine element
  const hadath = abjadTotal % 4 === 0 ? 4 : abjadTotal % 4;
  
  const elementMap: Record<number, 'fire' | 'water' | 'air' | 'earth'> = {
    1: 'fire',   // ناري
    2: 'earth',  // ترابي
    3: 'air',    // هوائي
    4: 'water'   // مائي
  };
  
  return elementMap[hadath];
}
