/**
 * Enhanced Life Path Calculator
 * Implements 10 core numerology calculations based on Abjad system
 * Based on classical ʿIlm al-Ḥurūf traditions (Al-Būnī, Ibn ʿArabī)
 */

// ============================================================================
// ABJAD VALUES (Mashriqi - Eastern System)
// ============================================================================

const ABJAD_MASHRIQI: Record<string, number> = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
  'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000
};

// ============================================================================
// HELPER: Get Abjad Value for Character
// ============================================================================

function getAbjadValue(char: string): number {
  return ABJAD_MASHRIQI[char] || 0;
}

// ============================================================================
// HELPER: Calculate Total Abjad Value for String
// ============================================================================

export function calculateAbjadTotal(text: string): number {
  let total = 0;
  for (const char of text) {
    total += getAbjadValue(char);
  }
  return total;
}

// ============================================================================
// HELPER: Reduce to Single Digit (with Master Number preservation)
// ============================================================================

function reduceToSingleDigit(total: number, preserveMasterNumbers: boolean = true): number {
  // Preserve master numbers 11, 22, 33
  if (preserveMasterNumbers && (total === 11 || total === 22 || total === 33)) {
    return total;
  }
  
  // Keep reducing until single digit
  while (total > 9) {
    const digits = total.toString().split('').map(Number);
    total = digits.reduce((sum, digit) => sum + digit, 0);
    
    // Check again for master numbers during reduction
    if (preserveMasterNumbers && (total === 11 || total === 22 || total === 33)) {
      return total;
    }
  }
  
  return total;
}

// ============================================================================
// METHOD 1: Life Path Number (Tarīq al-Ḥayāh)
// ============================================================================

export function calculateLifePathNumber(arabicName: string): number {
  const total = calculateAbjadTotal(arabicName);
  return reduceToSingleDigit(total, true);
}

// ============================================================================
// METHOD 2: Soul Urge Number (Dāfiʿ al-Rūḥ)
// ============================================================================

export function calculateSoulUrgeNumber(arabicName: string): number {
  // Vowels in Arabic: ا (alif), و (waw), ي (ya)
  const vowels = ['ا', 'و', 'ي'];
  
  let vowelSum = 0;
  for (const char of arabicName) {
    if (vowels.includes(char)) {
      vowelSum += getAbjadValue(char);
    }
  }
  
  return vowelSum === 0 ? 0 : reduceToSingleDigit(vowelSum, true);
}

// ============================================================================
// METHOD 3: Personality Number (Ẓāhir)
// ============================================================================

export function calculatePersonalityNumber(arabicName: string): number {
  const vowels = ['ا', 'و', 'ي'];
  
  let consonantSum = 0;
  for (const char of arabicName) {
    if (!vowels.includes(char) && char !== ' ') {
      consonantSum += getAbjadValue(char);
    }
  }
  
  return consonantSum === 0 ? 0 : reduceToSingleDigit(consonantSum, true);
}

// ============================================================================
// METHOD 4: Destiny Number (Qadar)
// ============================================================================

/**
 * Calculate Destiny Number - CORE LIFE PURPOSE
 * 
 * IMPORTANT: Uses personal name + optional father name ONLY.
 * Mother's name is NOT included as this represents core identity (WHO you are),
 * not external influences (WHAT surrounds you).
 * 
 * Authentic Ḥurūfī Tradition:
 * - Personal Name = Your soul's mission
 * - Father Name (optional) = Family lineage influence
 * - Mother's Name = NOT used for core destiny (see calculateMaternalInfluence instead)
 */
export function calculateDestinyNumber(
  givenName: string,
  fatherName?: string
): number {
  let fullName = givenName;
  if (fatherName) fullName += ' ' + fatherName;
  // ✅ Mother's name deliberately excluded from core destiny calculation
  
  const total = calculateAbjadTotal(fullName);
  return reduceToSingleDigit(total, true);
}

/**
 * Calculate Maternal Influence Number - EXTERNAL CONDITIONS
 * 
 * This represents how your mother's energy affects your external path,
 * obstacles, protection, and inherited emotional patterns.
 * 
 * This is separate from core destiny and should be displayed in a
 * different section labeled "Inherited Influences" or "External Conditions".
 */
export function calculateMaternalInfluence(
  givenName: string,
  motherName: string
): number {
  const combined = givenName + ' ' + motherName;
  const total = calculateAbjadTotal(combined);
  return reduceToSingleDigit(total, true);
}

// ============================================================================
// METHOD 5: Life Cycle Analysis (Dawr al-ʿUmr)
// ============================================================================

export interface LifeCycleAnalysis {
  cycleNumber: number;
  cycleStage: string;
  cycleStageArabic: string;
  positionInCycle: number;
  yearNumber: number;
  yearTheme: string;
  yearThemeArabic: string;
  focus: string[];
  focusArabic: string[];
  age: number;
}

export function calculateLifeCycle(birthDate: Date, currentDate: Date = new Date()): LifeCycleAnalysis {
  // Calculate age
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const hadBirthdayThisYear = 
    currentDate.getMonth() > birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());
  const actualAge = hadBirthdayThisYear ? age : age - 1;
  
  // Calculate which 9-year cycle and position within it
  const cycleNumber = Math.floor(actualAge / 9) + 1;
  const positionInCycle = (actualAge % 9) + 1;
  
  // Define cycle stages
  const cycleStages = [
    { stage: 'Foundation', arabic: 'التأسيس' },
    { stage: 'Growth', arabic: 'النمو' },
    { stage: 'Mastery', arabic: 'الإتقان' },
    { stage: 'Wisdom', arabic: 'الحكمة' },
    { stage: 'Service', arabic: 'الخدمة' },
    { stage: 'Teaching', arabic: 'التعليم' },
    { stage: 'Legacy', arabic: 'التراث' },
    { stage: 'Completion', arabic: 'الإتمام' },
    { stage: 'Eternal Wisdom', arabic: 'الحكمة الباقية' }
  ];
  
  const currentStage = cycleStages[Math.min(cycleNumber - 1, 8)];
  
  // Year themes based on position (1-9)
  const yearThemes = [
    { theme: 'New Beginnings', arabic: 'بدايات جديدة', focus: ['Start fresh', 'Plant seeds', 'Be independent'], focusArabic: ['ابدأ من جديد', 'ازرع البذور', 'كن مستقلاً'] },
    { theme: 'Cooperation', arabic: 'التعاون', focus: ['Build partnerships', 'Listen deeply', 'Find balance'], focusArabic: ['بناء الشراكات', 'استمع بعمق', 'ابحث عن التوازن'] },
    { theme: 'Creative Expression', arabic: 'التعبير الإبداعي', focus: ['Share your gifts', 'Communicate', 'Enjoy life'], focusArabic: ['شارك مواهبك', 'تواصل', 'استمتع بالحياة'] },
    { theme: 'Building Foundation', arabic: 'بناء الأساس', focus: ['Work hard', 'Create structure', 'Be disciplined'], focusArabic: ['اعمل بجد', 'أنشئ هيكلاً', 'كن منضبطاً'] },
    { theme: 'Change & Freedom', arabic: 'التغيير والحرية', focus: ['Embrace change', 'Explore', 'Be adventurous'], focusArabic: ['اقبل التغيير', 'استكشف', 'كن مغامراً'] },
    { theme: 'Responsibility', arabic: 'المسؤولية', focus: ['Nurture others', 'Create harmony', 'Serve family'], focusArabic: ['اعتن بالآخرين', 'أنشئ الانسجام', 'خدم العائلة'] },
    { theme: 'Spiritual Growth', arabic: 'النمو الروحاني', focus: ['Seek wisdom', 'Meditate', 'Study deeply'], focusArabic: ['اطلب الحكمة', 'تأمل', 'ادرس بعمق'] },
    { theme: 'Manifestation', arabic: 'التجسيد', focus: ['Achieve goals', 'Build wealth', 'Lead powerfully'], focusArabic: ['حقق الأهداف', 'ابن الثروة', 'قد بقوة'] },
    { theme: 'Completion & Release', arabic: 'الإتمام والإطلاق', focus: ['Let go', 'Forgive', 'Serve humanity'], focusArabic: ['اترك', 'اغفر', 'خدم الإنسانية'] }
  ];
  
  const currentYearTheme = yearThemes[positionInCycle - 1];
  
  return {
    cycleNumber,
    cycleStage: currentStage.stage,
    cycleStageArabic: currentStage.arabic,
    positionInCycle,
    yearNumber: positionInCycle,
    yearTheme: currentYearTheme.theme,
    yearThemeArabic: currentYearTheme.arabic,
    focus: currentYearTheme.focus,
    focusArabic: currentYearTheme.focusArabic,
    age: actualAge
  };
}

// ============================================================================
// METHOD 6: Personal Year Number
// ============================================================================

export function calculatePersonalYear(birthDate: Date, currentYear: number = new Date().getFullYear()): number {
  const birthMonth = birthDate.getMonth() + 1; // 1-12
  const birthDay = birthDate.getDate();
  
  // Formula: Birth Month + Birth Day + Current Year
  const sum = birthMonth + birthDay + currentYear;
  return reduceToSingleDigit(sum, false);
}

// ============================================================================
// METHOD 7: Personal Month Number
// ============================================================================

export function calculatePersonalMonth(
  birthDate: Date,
  currentMonth: number = new Date().getMonth() + 1
): number {
  const personalYear = calculatePersonalYear(birthDate);
  return reduceToSingleDigit(personalYear + currentMonth, false);
}

// ============================================================================
// METHOD 8: Karmic Debt Detection
// ============================================================================

export function detectKarmicDebts(arabicName: string, birthDate?: Date): number[] {
  const karmicDebts: number[] = [];
  const total = calculateAbjadTotal(arabicName);
  
  // Check for karmic debt numbers: 13, 14, 16, 19
  if ([13, 14, 16, 19].includes(total)) {
    karmicDebts.push(total);
  }
  
  // Check intermediate sums during reduction
  let checkNum = total;
  while (checkNum > 9) {
    const digits = checkNum.toString().split('').map(Number);
    checkNum = digits.reduce((a, b) => a + b, 0);
    
    if ([13, 14, 16, 19].includes(checkNum)) {
      karmicDebts.push(checkNum);
    }
  }
  
  // Birth date karmic debts
  if (birthDate) {
    const day = birthDate.getDate();
    if ([13, 14, 16, 19].includes(day)) {
      karmicDebts.push(day);
    }
  }
  
  return [...new Set(karmicDebts)]; // Remove duplicates
}

// ============================================================================
// METHOD 9: Sacred Number Detection
// ============================================================================

export function detectSacredNumbers(arabicName: string): number[] {
  const total = calculateAbjadTotal(arabicName);
  const sacredNumbers: number[] = [];
  
  const sacredValues = [
    7,    // Days of creation
    12,   // Months, Imams
    19,   // Quranic miracle number
    40,   // Testing period
    70,   // Nations, completion
    99,   // Names of Allah
    111,  // Surah Al-Ikhlas value
    313,  // Badr warriors
    786,  // Bismillah value
    1000  // Symbolic perfection
  ];
  
  for (const sacred of sacredValues) {
    if (total === sacred || total % sacred === 0) {
      sacredNumbers.push(sacred);
    }
  }
  
  return sacredNumbers;
}

// ============================================================================
// METHOD 10: Pinnacle & Challenge Numbers
// ============================================================================

export interface PinnacleChallenge {
  pinnacle1: number;
  pinnacle2: number;
  pinnacle3: number;
  pinnacle4: number;
  challenge1: number;
  challenge2: number;
  challenge3: number;
  challenge4: number;
  currentPinnacle: number;
  currentChallenge: number;
}

export function calculatePinnaclesAndChallenges(birthDate: Date, currentAge: number): PinnacleChallenge {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const year = birthDate.getFullYear();
  
  // Reduce each component
  const m = reduceToSingleDigit(month, false);
  const d = reduceToSingleDigit(day, false);
  const y = reduceToSingleDigit(year, false);
  
  // Calculate Pinnacles
  const pinnacle1 = reduceToSingleDigit(m + d, false);
  const pinnacle2 = reduceToSingleDigit(d + y, false);
  const pinnacle3 = reduceToSingleDigit(pinnacle1 + pinnacle2, false);
  const pinnacle4 = reduceToSingleDigit(m + y, false);
  
  // Calculate Challenges
  const challenge1 = Math.abs(m - d);
  const challenge2 = Math.abs(d - y);
  const challenge3 = Math.abs(challenge1 - challenge2);
  const challenge4 = Math.abs(m - y);
  
  // Determine current pinnacle/challenge based on age
  const lifePathNumber = reduceToSingleDigit(m + d + y, false);
  const firstCycleEnd = 36 - lifePathNumber;
  const secondCycleEnd = firstCycleEnd + 9;
  const thirdCycleEnd = secondCycleEnd + 9;
  
  let currentPinnacle: number;
  let currentChallenge: number;
  
  if (currentAge <= firstCycleEnd) {
    currentPinnacle = pinnacle1;
    currentChallenge = challenge1;
  } else if (currentAge <= secondCycleEnd) {
    currentPinnacle = pinnacle2;
    currentChallenge = challenge2;
  } else if (currentAge <= thirdCycleEnd) {
    currentPinnacle = pinnacle3;
    currentChallenge = challenge3;
  } else {
    currentPinnacle = pinnacle4;
    currentChallenge = challenge4;
  }
  
  return {
    pinnacle1,
    pinnacle2,
    pinnacle3,
    pinnacle4,
    challenge1,
    challenge2,
    challenge3,
    challenge4,
    currentPinnacle,
    currentChallenge
  };
}

// ============================================================================
// MASTER FUNCTION: Calculate All Life Path Numbers at Once
// ============================================================================

export interface EnhancedLifePathResult {
  // Core Numbers (from personal name only)
  lifePathNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  destinyNumber: number;
  
  // Birth Info
  birthDate: Date;
  
  // Timing
  personalYear: number;
  personalMonth: number;
  
  // Cycle Info
  cycle: LifeCycleAnalysis;
  
  // Special Numbers
  karmicDebts: number[];
  sacredNumbers: number[];
  
  // External Influences (optional - only if mother's name provided)
  maternalInfluence?: number;
  
  // Advanced
  pinnaclesAndChallenges: PinnacleChallenge;
}

// ============================================================================
// KARMIC DEBT INTERPRETATIONS
// ============================================================================

export interface KarmicDebtDetails {
  number: number;
  name: string;
  nameArabic: string;
  lesson: string;
  lessonArabic: string;
  manifestations: string[];
  manifestationsArabic: string[];
  remedy: string;
  remedyArabic: string;
  spiritualWork: string[];
  spiritualWorkArabic: string[];
}

export const KARMIC_DEBT_INTERPRETATIONS: Record<number, KarmicDebtDetails> = {
  13: {
    number: 13,
    name: 'Laziness & Negative Thinking',
    nameArabic: 'الكسل والتفكير السلبي',
    lesson: 'Learning discipline, hard work, and positive focus through obstacles.',
    lessonArabic: 'تعلم الانضباط والعمل الجاد والتركيز الإيجابي من خلال العقبات.',
    manifestations: [
      'Repeated setbacks requiring perseverance',
      'Tendency toward shortcuts',
      'Difficulty completing tasks',
      'Negative thought patterns',
      'Struggles with discipline'
    ],
    manifestationsArabic: [
      'انتكاسات متكررة تتطلب المثابرة',
      'ميل نحو الاختصارات',
      'صعوبة في إكمال المهام',
      'أنماط التفكير السلبية',
      'صراعات مع الانضباط'
    ],
    remedy: 'Embrace hard work with a joyful heart. Transform obstacles into opportunities for growth.',
    remedyArabic: 'احتضن العمل الجاد بقلب مبهج. حوّل العقبات إلى فرص للنمو.',
    spiritualWork: [
      'Daily gratitude practice',
      'Dhikr for perseverance (Ya Sabūr)',
      'Complete small tasks fully',
      'Reframe challenges positively',
      'Build consistent routines'
    ],
    spiritualWorkArabic: [
      'ممارسة الامتنان اليومي',
      'ذكر للمثابرة (يا صبور)',
      'أكمل المهام الصغيرة بالكامل',
      'أعد صياغة التحديات بإيجابية',
      'ابنِ روتيناً متسقاً'
    ]
  },

  14: {
    number: 14,
    name: 'Abuse of Freedom',
    nameArabic: 'إساءة استخدام الحرية',
    lesson: 'Learning to use freedom responsibly through moderation and balance.',
    lessonArabic: 'تعلم استخدام الحرية بمسؤولية من خلال الاعتدال والتوازن.',
    manifestations: [
      'Addiction patterns',
      'Excessive indulgence',
      'Unstable relationships',
      'Difficulty with commitment',
      'Seeking escape through substances or behaviors'
    ],
    manifestationsArabic: [
      'أنماط الإدمان',
      'الإفراط في التساهل',
      'علاقات غير مستقرة',
      'صعوبة في الالتزام',
      'البحث عن الهروب من خلال المواد أو السلوكيات'
    ],
    remedy: 'Practice moderation in all things. True freedom comes through self-discipline.',
    remedyArabic: 'مارس الاعتدال في كل شيء. الحرية الحقيقية تأتي من خلال الانضباط الذاتي.',
    spiritualWork: [
      'Fasting and abstinence practices',
      'Dhikr for self-control (Ya Qabid)',
      'Set healthy boundaries',
      'Mindful consumption',
      'Commit to one path deeply'
    ],
    spiritualWorkArabic: [
      'ممارسات الصيام والامتناع',
      'ذكر للسيطرة على النفس (يا قابض)',
      'ضع حدوداً صحية',
      'الاستهلاك الواعي',
      'التزم بمسار واحد بعمق'
    ]
  },

  16: {
    number: 16,
    name: 'Abuse of Love',
    nameArabic: 'إساءة استخدام الحب',
    lesson: 'Learning humility and proper use of power in relationships through ego dissolution.',
    lessonArabic: 'تعلم التواضع والاستخدام السليم للقوة في العلاقات من خلال حل الأنا.',
    manifestations: [
      'Sudden relationship endings',
      'Dramatic life changes',
      'Ego-driven decisions backfire',
      'Betrayals or abandonments',
      'Loss of status or position'
    ],
    manifestationsArabic: [
      'نهايات علاقات مفاجئة',
      'تغيرات حياتية درامية',
      'القرارات المدفوعة بالأنا تنقلب',
      'خيانات أو هجر',
      'فقدان المكانة أو الموقع'
    ],
    remedy: 'Surrender the ego. Love selflessly. Build on spiritual foundation, not ego.',
    remedyArabic: 'استسلم للأنا. أحب بنكران ذات. ابنِ على أساس روحاني وليس على الأنا.',
    spiritualWork: [
      'Practice humility daily',
      'Dhikr for divine love (Ya Wadud)',
      'Serve without expectation',
      'Meditate on impermanence',
      'Forgive deeply and often'
    ],
    spiritualWorkArabic: [
      'مارس التواضع يومياً',
      'ذكر للحب الإلهي (يا ودود)',
      'اخدم دون توقعات',
      'تأمل في الفناء',
      'اغفر بعمق وكثيراً'
    ]
  },

  19: {
    number: 19,
    name: 'Abuse of Power',
    nameArabic: 'إساءة استخدام القوة',
    lesson: 'Learning to give rather than take, serve rather than dominate.',
    lessonArabic: 'تعلم العطاء بدلاً من الأخذ، والخدمة بدلاً من الهيمنة.',
    manifestations: [
      'Difficulty asking for help',
      'Loneliness despite achievements',
      'Fear of dependency',
      'Power struggles',
      'Isolation from community'
    ],
    manifestationsArabic: [
      'صعوبة في طلب المساعدة',
      'الوحدة رغم الإنجازات',
      'خوف من الاعتمادية',
      'صراعات على السلطة',
      'عزلة عن المجتمع'
    ],
    remedy: 'Learn to receive. Serve humbly. Recognize interdependence as divine design.',
    remedyArabic: 'تعلم الاستقبال. اخدم بتواضع. اعترف بالاعتماد المتبادل كتصميم إلهي.',
    spiritualWork: [
      'Practice asking for help',
      'Dhikr for unity (Ya Wahid, Ya Ahad)',
      'Join community service',
      'Share power willingly',
      'Acknowledge others\' contributions'
    ],
    spiritualWorkArabic: [
      'تدرب على طلب المساعدة',
      'ذكر للوحدة (يا واحد، يا أحد)',
      'انضم إلى خدمة المجتمع',
      'شارك السلطة طوعاً',
      'اعترف بمساهمات الآخرين'
    ]
  }
};

// ============================================================================
// SACRED NUMBER INTERPRETATIONS
// ============================================================================

export interface SacredNumberDetails {
  number: number;
  significance: string;
  significanceArabic: string;
  quranConnection: string;
  spiritualMeaning: string;
  spiritualMeaningArabic: string;
}

export const SACRED_NUMBER_INTERPRETATIONS: Record<number, SacredNumberDetails> = {
  7: {
    number: 7,
    significance: 'Days of Creation, Completion',
    significanceArabic: 'أيام الخلق، الإتمام',
    quranConnection: 'Seven heavens, seven earths',
    spiritualMeaning: 'Divine perfection and wholeness. Your name carries the frequency of completion.',
    spiritualMeaningArabic: 'الكمال الإلهي والشمولية. اسمك يحمل تردد الإتمام.'
  },
  12: {
    number: 12,
    significance: 'Months, Tribes, Imams',
    significanceArabic: 'الأشهر، القبائل، الأئمة',
    quranConnection: 'Twelve months, twelve springs',
    spiritualMeaning: 'Cosmic order and leadership. Your path involves guiding others.',
    spiritualMeaningArabic: 'النظام الكوني والقيادة. طريقك يتضمن إرشاد الآخرين.'
  },
  19: {
    number: 19,
    significance: 'Quranic Miracle Number',
    significanceArabic: 'رقم المعجزة القرآنية',
    quranConnection: 'Mathematical pattern in Quran',
    spiritualMeaning: 'Divine signature. Your soul carries a special message for humanity.',
    spiritualMeaningArabic: 'التوقيع الإلهي. روحك تحمل رسالة خاصة للإنسانية.'
  },
  40: {
    number: 40,
    significance: 'Testing & Purification Period',
    significanceArabic: 'فترة الاختبار والتنقية',
    quranConnection: 'Moses\' forty nights, forty days of trials',
    spiritualMeaning: 'Transformation through trial. Your journey involves deep purification.',
    spiritualMeaningArabic: 'التحول من خلال التجربة. رحلتك تتضمن تطهيراً عميقاً.'
  },
  70: {
    number: 70,
    significance: 'Nations, Elders, Completion',
    significanceArabic: 'الأمم، الشيوخ، الإتمام',
    quranConnection: 'Seventy elders of Moses',
    spiritualMeaning: 'Wisdom keeper. You are meant to gather and share ancient knowledge.',
    spiritualMeaningArabic: 'حارس الحكمة. أنت مخصص لجمع ومشاركة المعرفة القديمة.'
  },
  99: {
    number: 99,
    significance: 'Names of Allah',
    significanceArabic: 'أسماء الله',
    quranConnection: 'Asmā\' al-Ḥusnā',
    spiritualMeaning: 'Divine attributes. Your soul reflects the Beautiful Names.',
    spiritualMeaningArabic: 'الصفات الإلهية. روحك تعكس الأسماء الحسنى.'
  },
  111: {
    number: 111,
    significance: 'Surah Al-Ikhlas Value',
    significanceArabic: 'قيمة سورة الإخلاص',
    quranConnection: 'The Chapter of Sincerity',
    spiritualMeaning: 'Pure monotheism. Your essence is aligned with divine unity.',
    spiritualMeaningArabic: 'التوحيد الخالص. جوهرك متوافق مع الوحدة الإلهية.'
  },
  313: {
    number: 313,
    significance: 'Warriors of Badr',
    significanceArabic: 'محاربو بدر',
    quranConnection: 'The decisive battle',
    spiritualMeaning: 'Spiritual warrior. You are here to stand for truth.',
    spiritualMeaningArabic: 'المحارب الروحاني. أنت هنا للدفاع عن الحق.'
  },
  786: {
    number: 786,
    significance: 'Bismillah al-Rahman al-Rahim',
    significanceArabic: 'بسم الله الرحمن الرحيم',
    quranConnection: 'Opening verse of Quran',
    spiritualMeaning: 'Begin with grace. Your every action should start with divine remembrance.',
    spiritualMeaningArabic: 'ابدأ بالنعمة. يجب أن يبدأ كل عمل بذكر الله.'
  },
  1000: {
    number: 1000,
    significance: 'Symbolic Perfection',
    significanceArabic: 'الكمال الرمزي',
    quranConnection: 'Night of Qadr better than 1000 months',
    spiritualMeaning: 'Mastery incarnate. You are here to demonstrate perfection of soul.',
    spiritualMeaningArabic: 'الإتقان المتجسد. أنت هنا لإظهار كمال الروح.'
  }
};

// ============================================================================
// PHASE 1 ENHANCEMENTS: Elemental Balance, Career, Tips, Shadow Work
// ============================================================================

// Map each number (1-9, 11, 22, 33) to its element
const NUMBER_TO_ELEMENT: Record<number, 'fire' | 'earth' | 'air' | 'water'> = {
  1: 'fire',    // Leader - initiative
  2: 'water',   // Peacemaker - emotion
  3: 'air',     // Creator - communication
  4: 'earth',   // Builder - stability
  5: 'air',     // Explorer - ideas
  6: 'water',   // Caregiver - emotion
  7: 'air',     // Thinker - intellect
  8: 'earth',   // Achiever - manifestation
  9: 'water',   // Humanitarian - compassion
  11: 'fire',   // Visionary - spiritual drive
  22: 'earth',  // Master Builder - material mastery
  33: 'water'   // Master Teacher - universal love
};

export interface ElementalBalance {
  fire: number;
  earth: number;
  air: number;
  water: number;
  dominant: 'fire' | 'earth' | 'air' | 'water';
}

export function calculateElementalBalance(
  lifePathNumber: number,
  soulUrgeNumber: number,
  personalityNumber: number,
  destinyNumber: number
): ElementalBalance {
  const elements = { fire: 0, earth: 0, air: 0, water: 0 };
  
  // Count elements from all 4 numbers
  const numbers = [lifePathNumber, soulUrgeNumber, personalityNumber, destinyNumber];
  numbers.forEach(num => {
    const element = NUMBER_TO_ELEMENT[num];
    if (element) elements[element]++;
  });
  
  // Calculate percentages
  const total = 4;
  const percentages = {
    fire: Math.round((elements.fire / total) * 100),
    earth: Math.round((elements.earth / total) * 100),
    air: Math.round((elements.air / total) * 100),
    water: Math.round((elements.water / total) * 100)
  };
  
  // Find dominant element
  let dominant: 'fire' | 'earth' | 'air' | 'water' = 'fire';
  let maxCount = elements.fire;
  (['earth', 'air', 'water'] as const).forEach(el => {
    if (elements[el] > maxCount) {
      maxCount = elements[el];
      dominant = el;
    }
  });
  
  return { ...percentages, dominant };
}

// Career Guidance Data (EN/FR)
interface CareerData {
  idealCareers: { en: string[]; fr: string[] };
  avoid: { en: string[]; fr: string[] };
  why: { en: string; fr: string };
}

const CAREER_GUIDANCE: Record<number, CareerData> = {
  1: {
    idealCareers: {
      en: ['Entrepreneur', 'CEO', 'Military Leader', 'Architect', 'Innovator', 'Director', 'Manager', 'Inventor', 'Pioneer in Tech'],
      fr: ['Entrepreneur', 'PDG', 'Chef Militaire', 'Architecte', 'Innovateur', 'Directeur', 'Manager', 'Inventeur', 'Pionnier en Tech']
    },
    avoid: {
      en: ['Subordinate roles', 'Repetitive tasks', 'Group work without autonomy'],
      fr: ['Rôles subordonnés', 'Tâches répétitives', 'Travail en groupe sans autonomie']
    },
    why: {
      en: "You're a natural leader who thrives when you can make independent decisions and pioneer new paths.",
      fr: "Vous êtes un leader naturel qui prospère lorsque vous pouvez prendre des décisions indépendantes et ouvrir de nouvelles voies."
    }
  },
  2: {
    idealCareers: {
      en: ['Mediator', 'Counselor', 'Diplomat', 'Social Worker', 'HR Professional', 'Therapist', 'Team Coordinator', 'Peacekeeper'],
      fr: ['Médiateur', 'Conseiller', 'Diplomate', 'Travailleur Social', 'Professionnel RH', 'Thérapeute', 'Coordinateur d\'Équipe', 'Gardien de la Paix']
    },
    avoid: {
      en: ['High-pressure competition', 'Isolated work', 'Conflict-heavy environments'],
      fr: ['Compétition à haute pression', 'Travail isolé', 'Environnements conflictuels']
    },
    why: {
      en: "You excel at bringing people together and creating harmony in teams and relationships.",
      fr: "Vous excellez à rassembler les gens et à créer l'harmonie dans les équipes et les relations."
    }
  },
  3: {
    idealCareers: {
      en: ['Writer', 'Artist', 'Public Speaker', 'Entertainer', 'Marketing Specialist', 'Designer', 'Teacher', 'Comedian', 'Content Creator'],
      fr: ['Écrivain', 'Artiste', 'Orateur Public', 'Artiste de Spectacle', 'Spécialiste Marketing', 'Designer', 'Enseignant', 'Comédien', 'Créateur de Contenu']
    },
    avoid: {
      en: ['Silent, monotonous work', 'Strict corporate settings', 'Environments that suppress creativity'],
      fr: ['Travail silencieux et monotone', 'Cadres corporatifs stricts', 'Environnements qui suppriment la créativité']
    },
    why: {
      en: "You're naturally expressive and thrive when you can communicate, create, and inspire others.",
      fr: "Vous êtes naturellement expressif et prospérez lorsque vous pouvez communiquer, créer et inspirer les autres."
    }
  },
  4: {
    idealCareers: {
      en: ['Engineer', 'Accountant', 'Project Manager', 'Builder', 'Analyst', 'Administrator', 'Planner', 'Quality Control', 'Systems Designer'],
      fr: ['Ingénieur', 'Comptable', 'Chef de Projet', 'Constructeur', 'Analyste', 'Administrateur', 'Planificateur', 'Contrôle Qualité', 'Concepteur de Systèmes']
    },
    avoid: {
      en: ['Chaotic, unstructured environments', 'Frequent travel', 'Jobs without clear processes'],
      fr: ['Environnements chaotiques et non structurés', 'Voyages fréquents', 'Emplois sans processus clairs']
    },
    why: {
      en: "You're reliable and practical, excelling at building systems and creating stable foundations.",
      fr: "Vous êtes fiable et pratique, excellant dans la construction de systèmes et la création de fondations stables."
    }
  },
  5: {
    idealCareers: {
      en: ['Travel Guide', 'Sales', 'Journalist', 'Event Planner', 'PR Specialist', 'Flight Attendant', 'Freelancer', 'Adventurer', 'Consultant'],
      fr: ['Guide Touristique', 'Ventes', 'Journaliste', 'Planificateur d\'Événements', 'Spécialiste RP', 'Hôtesse de l\'Air', 'Freelance', 'Aventurier', 'Consultant']
    },
    avoid: {
      en: ['Routine desk jobs', 'Micromanaged environments', 'Highly restrictive roles'],
      fr: ['Emplois de bureau routiniers', 'Environnements micro-gérés', 'Rôles très restrictifs']
    },
    why: {
      en: "You love variety and freedom, thriving in dynamic environments where you can explore and adapt.",
      fr: "Vous aimez la variété et la liberté, prospérant dans des environnements dynamiques où vous pouvez explorer et vous adapter."
    }
  },
  6: {
    idealCareers: {
      en: ['Nurse', 'Teacher', 'Caregiver', 'Chef', 'Interior Designer', 'Counselor', 'Community Organizer', 'Family Therapist', 'Hospitality Manager'],
      fr: ['Infirmière', 'Enseignant', 'Soignant', 'Chef', 'Décorateur d\'Intérieur', 'Conseiller', 'Organisateur Communautaire', 'Thérapeute Familial', 'Manager Hôtellerie']
    },
    avoid: {
      en: ['Cut-throat competition', 'Work without human connection', 'Highly individualistic roles'],
      fr: ['Compétition acharnée', 'Travail sans connexion humaine', 'Rôles très individualistes']
    },
    why: {
      en: "You're naturally nurturing and responsible, finding fulfillment when you serve and care for others.",
      fr: "Vous êtes naturellement nourricier et responsable, trouvant l'épanouissement lorsque vous servez et prenez soin des autres."
    }
  },
  7: {
    idealCareers: {
      en: ['Researcher', 'Scientist', 'Philosopher', 'Analyst', 'Spiritual Guide', 'Programmer', 'Investigator', 'Data Scientist', 'Scholar'],
      fr: ['Chercheur', 'Scientifique', 'Philosophe', 'Analyste', 'Guide Spirituel', 'Programmeur', 'Enquêteur', 'Data Scientist', 'Érudit']
    },
    avoid: {
      en: ['Superficial sales roles', 'Overly social environments', 'Jobs without intellectual depth'],
      fr: ['Rôles de vente superficiels', 'Environnements trop sociaux', 'Emplois sans profondeur intellectuelle']
    },
    why: {
      en: "You're analytical and introspective, excelling when you can dive deep into knowledge and mysteries.",
      fr: "Vous êtes analytique et introspectif, excellant lorsque vous pouvez plonger profondément dans la connaissance et les mystères."
    }
  },
  8: {
    idealCareers: {
      en: ['Executive', 'Finance Manager', 'Real Estate Developer', 'Business Owner', 'Investment Banker', 'CEO', 'Attorney', 'Producer', 'Director'],
      fr: ['Exécutif', 'Gestionnaire Financier', 'Promoteur Immobilier', 'Propriétaire d\'Entreprise', 'Banquier d\'Investissement', 'PDG', 'Avocat', 'Producteur', 'Directeur']
    },
    avoid: {
      en: ['Low-responsibility roles', 'Jobs without growth potential', 'Work without measurable results'],
      fr: ['Rôles à faible responsabilité', 'Emplois sans potentiel de croissance', 'Travail sans résultats mesurables']
    },
    why: {
      en: "You're ambitious and results-driven, excelling at managing resources and achieving material success.",
      fr: "Vous êtes ambitieux et axé sur les résultats, excellant dans la gestion des ressources et l'atteinte du succès matériel."
    }
  },
  9: {
    idealCareers: {
      en: ['Humanitarian Worker', 'Non-Profit Leader', 'Artist', 'Healer', 'Global Advocate', 'Philanthropist', 'Environmentalist', 'Life Coach', 'Spiritual Teacher'],
      fr: ['Travailleur Humanitaire', 'Leader d\'ONG', 'Artiste', 'Guérisseur', 'Défenseur Mondial', 'Philanthrope', 'Écologiste', 'Coach de Vie', 'Enseignant Spirituel']
    },
    avoid: {
      en: ['Narrow, self-serving work', 'Materialistic environments', 'Jobs lacking purpose'],
      fr: ['Travail étroit et égoïste', 'Environnements matérialistes', 'Emplois sans but']
    },
    why: {
      en: "You're compassionate and globally-minded, finding fulfillment when you serve humanity and create positive change.",
      fr: "Vous êtes compatissant et à l'esprit mondial, trouvant l'épanouissement lorsque vous servez l'humanité et créez un changement positif."
    }
  },
  11: {
    idealCareers: {
      en: ['Spiritual Leader', 'Motivational Speaker', 'Visionary Leader', 'Healer', 'Intuitive Coach', 'Inventor', 'Psychic', 'Inspirational Writer', 'Light Worker'],
      fr: ['Leader Spirituel', 'Orateur Motivationnel', 'Leader Visionnaire', 'Guérisseur', 'Coach Intuitif', 'Inventeur', 'Voyant', 'Écrivain Inspirationnel', 'Travailleur de Lumière']
    },
    avoid: {
      en: ['Mundane, routine work', 'Materially-focused jobs', 'Environments that suppress intuition'],
      fr: ['Travail mondain et routinier', 'Emplois axés sur le matériel', 'Environnements qui suppriment l\'intuition']
    },
    why: {
      en: "You're a spiritual visionary who inspires others and carries messages from higher realms.",
      fr: "Vous êtes un visionnaire spirituel qui inspire les autres et porte des messages des royaumes supérieurs."
    }
  },
  22: {
    idealCareers: {
      en: ['Master Builder', 'Architect', 'Social Entrepreneur', 'Large-Scale Developer', 'Visionary CEO', 'Urban Planner', 'International Leader', 'Founder of Institutions'],
      fr: ['Maître Bâtisseur', 'Architecte', 'Entrepreneur Social', 'Développeur à Grande Échelle', 'PDG Visionnaire', 'Urbaniste', 'Leader International', 'Fondateur d\'Institutions']
    },
    avoid: {
      en: ['Small-scale projects only', 'Jobs without global impact', 'Work without legacy potential'],
      fr: ['Projets à petite échelle uniquement', 'Emplois sans impact mondial', 'Travail sans potentiel d\'héritage']
    },
    why: {
      en: "You're a master manifestor who builds lasting structures and turns grand visions into reality.",
      fr: "Vous êtes un maître manifesteur qui construit des structures durables et transforme de grandes visions en réalité."
    }
  },
  33: {
    idealCareers: {
      en: ['Master Teacher', 'Healer', 'Spiritual Guide', 'Humanitarian Leader', 'Universal Counselor', 'Transformational Coach', 'Compassionate Leader', 'Global Educator'],
      fr: ['Maître Enseignant', 'Guérisseur', 'Guide Spirituel', 'Leader Humanitaire', 'Conseiller Universel', 'Coach Transformationnel', 'Leader Compatissant', 'Éducateur Mondial']
    },
    avoid: {
      en: ['Selfish, competitive environments', 'Work lacking compassion', 'Roles without service element'],
      fr: ['Environnements égoïstes et compétitifs', 'Travail manquant de compassion', 'Rôles sans élément de service']
    },
    why: {
      en: "You're a master teacher who guides humanity with unconditional love and profound wisdom.",
      fr: "Vous êtes un maître enseignant qui guide l'humanité avec un amour inconditionnel et une sagesse profonde."
    }
  }
};

// Balance Tips Data (EN/FR)
interface BalanceTips {
  en: string[];
  fr: string[];
}

const BALANCE_TIPS: Record<number, BalanceTips> = {
  1: {
    en: [
      'Practice patience - not everything needs to be done right now',
      'Ask for help instead of doing everything alone',
      'Take time to listen to others\' ideas before deciding',
      'Balance independence with collaboration',
      'Schedule regular breaks to avoid burnout'
    ],
    fr: [
      'Pratiquez la patience - tout ne doit pas être fait immédiatement',
      'Demandez de l\'aide au lieu de tout faire seul',
      'Prenez le temps d\'écouter les idées des autres avant de décider',
      'Équilibrez l\'indépendance avec la collaboration',
      'Planifiez des pauses régulières pour éviter l\'épuisement'
    ]
  },
  2: {
    en: [
      'Set clear boundaries - it\'s okay to say no',
      'Practice self-care daily, not just when depleted',
      'Speak up for your own needs, not just others\'',
      'Build confidence in your own opinions',
      'Spend time alone to reconnect with yourself'
    ],
    fr: [
      'Établissez des limites claires - il est normal de dire non',
      'Pratiquez l\'auto-soin quotidiennement, pas seulement quand épuisé',
      'Exprimez vos propres besoins, pas seulement ceux des autres',
      'Développez la confiance en vos propres opinions',
      'Passez du temps seul pour vous reconnecter avec vous-même'
    ]
  },
  3: {
    en: [
      'Finish projects before starting new ones',
      'Practice focused work without distractions',
      'Don\'t scatter your energy - choose priorities',
      'Balance socializing with quiet reflection time',
      'Use your creativity with discipline and structure'
    ],
    fr: [
      'Terminez les projets avant d\'en commencer de nouveaux',
      'Pratiquez le travail concentré sans distractions',
      'Ne dispersez pas votre énergie - choisissez des priorités',
      'Équilibrez la socialisation avec du temps de réflexion tranquille',
      'Utilisez votre créativité avec discipline et structure'
    ]
  },
  4: {
    en: [
      'Allow room for spontaneity and flexibility',
      'Don\'t let perfectionism paralyze you',
      'Take calculated risks instead of always playing safe',
      'Balance work with play and rest',
      'Trust the process even when you can\'t control everything'
    ],
    fr: [
      'Laissez place à la spontanéité et à la flexibilité',
      'Ne laissez pas le perfectionnisme vous paralyser',
      'Prenez des risques calculés au lieu de toujours jouer la sécurité',
      'Équilibrez le travail avec le jeu et le repos',
      'Faites confiance au processus même quand vous ne pouvez pas tout contrôler'
    ]
  },
  5: {
    en: [
      'Commit to one thing at a time instead of juggling many',
      'Create healthy routines for stability',
      'Practice finishing what you start',
      'Balance freedom with responsibility',
      'Ground yourself daily through meditation or nature'
    ],
    fr: [
      'Engagez-vous à une chose à la fois au lieu de jongler avec plusieurs',
      'Créez des routines saines pour la stabilité',
      'Pratiquez terminer ce que vous commencez',
      'Équilibrez la liberté avec la responsabilité',
      'Ancrez-vous quotidiennement par la méditation ou la nature'
    ]
  },
  6: {
    en: [
      'Give to yourself as much as you give to others',
      'Release perfectionism - good enough is enough',
      'Let others solve their own problems sometimes',
      'Don\'t take on responsibilities that aren\'t yours',
      'Practice receiving help graciously'
    ],
    fr: [
      'Donnez-vous autant que vous donnez aux autres',
      'Libérez le perfectionnisme - assez bon suffit',
      'Laissez les autres résoudre leurs propres problèmes parfois',
      'Ne prenez pas de responsabilités qui ne sont pas les vôtres',
      'Pratiquez recevoir de l\'aide avec grâce'
    ]
  },
  7: {
    en: [
      'Balance alone time with meaningful social connection',
      'Share your knowledge - don\'t keep it all inside',
      'Trust your intuition, not just analysis',
      'Practice being present instead of overthinking',
      'Connect with your body through movement or nature'
    ],
    fr: [
      'Équilibrez le temps seul avec une connexion sociale significative',
      'Partagez vos connaissances - ne gardez pas tout à l\'intérieur',
      'Faites confiance à votre intuition, pas seulement à l\'analyse',
      'Pratiquez être présent au lieu de trop penser',
      'Connectez-vous avec votre corps par le mouvement ou la nature'
    ]
  },
  8: {
    en: [
      'Remember that rest is productive too',
      'Balance material success with spiritual growth',
      'Lead with compassion, not just authority',
      'Don\'t sacrifice relationships for achievement',
      'Practice gratitude for what you have, not just what you want'
    ],
    fr: [
      'Rappelez-vous que le repos est aussi productif',
      'Équilibrez le succès matériel avec la croissance spirituelle',
      'Dirigez avec compassion, pas seulement autorité',
      'Ne sacrifiez pas les relations pour la réussite',
      'Pratiquez la gratitude pour ce que vous avez, pas seulement ce que vous voulez'
    ]
  },
  9: {
    en: [
      'Set healthy boundaries - you can\'t save everyone',
      'Ground yourself in practical daily tasks',
      'Take care of your own needs before serving others',
      'Release attachment to outcomes - let go when needed',
      'Balance giving with receiving'
    ],
    fr: [
      'Établissez des limites saines - vous ne pouvez pas sauver tout le monde',
      'Ancrez-vous dans des tâches quotidiennes pratiques',
      'Prenez soin de vos propres besoins avant de servir les autres',
      'Libérez l\'attachement aux résultats - lâchez prise quand nécessaire',
      'Équilibrez donner avec recevoir'
    ]
  },
  11: {
    en: [
      'Ground your visions in practical action',
      'Don\'t expect others to understand everything you see',
      'Balance spiritual work with physical self-care',
      'Protect your energy - not everyone deserves access',
      'Trust divine timing - you don\'t have to rush'
    ],
    fr: [
      'Ancrez vos visions dans l\'action pratique',
      'N\'attendez pas que les autres comprennent tout ce que vous voyez',
      'Équilibrez le travail spirituel avec l\'auto-soin physique',
      'Protégez votre énergie - tout le monde ne mérite pas l\'accès',
      'Faites confiance au timing divin - vous n\'avez pas besoin de vous précipiter'
    ]
  },
  22: {
    en: [
      'Start small - you don\'t have to build Rome in a day',
      'Delegate instead of doing everything yourself',
      'Balance grand vision with attention to details',
      'Rest regularly - even master builders need recovery',
      'Don\'t let the scale of your vision overwhelm you'
    ],
    fr: [
      'Commencez petit - vous n\'avez pas à construire Rome en un jour',
      'Déléguez au lieu de tout faire vous-même',
      'Équilibrez la grande vision avec l\'attention aux détails',
      'Reposez-vous régulièrement - même les maîtres bâtisseurs ont besoin de récupération',
      'Ne laissez pas l\'ampleur de votre vision vous submerger'
    ]
  },
  33: {
    en: [
      'You can\'t carry the world - release what\'s not yours',
      'Teach without sacrificing your own wellbeing',
      'Balance universal love with self-love',
      'Set clear boundaries even while serving',
      'Remember you\'re human too - rest and restore'
    ],
    fr: [
      'Vous ne pouvez pas porter le monde - libérez ce qui n\'est pas à vous',
      'Enseignez sans sacrifier votre propre bien-être',
      'Équilibrez l\'amour universel avec l\'amour de soi',
      'Établissez des limites claires même en servant',
      'Rappelez-vous que vous êtes aussi humain - reposez-vous et restaurez-vous'
    ]
  }
};

// Shadow Work Data (EN/FR)
interface ShadowWork {
  en: string[];
  fr: string[];
}

const SHADOW_WORK: Record<number, ShadowWork> = {
  1: {
    en: [
      'Can become domineering or overly controlling',
      'May struggle with collaboration or listening to others',
      'Risk of arrogance or ego inflation',
      'Tendency to burn out from doing everything alone',
      'May come across as aggressive or insensitive'
    ],
    fr: [
      'Peut devenir dominateur ou trop contrôlant',
      'Peut avoir du mal avec la collaboration ou l\'écoute des autres',
      'Risque d\'arrogance ou d\'inflation de l\'ego',
      'Tendance à s\'épuiser en faisant tout seul',
      'Peut paraître agressif ou insensible'
    ]
  },
  2: {
    en: [
      'Can become overly dependent on others\' approval',
      'May avoid conflict to the point of self-betrayal',
      'Risk of being too passive or indecisive',
      'Tendency to lose yourself in relationships',
      'May struggle with standing up for yourself'
    ],
    fr: [
      'Peut devenir trop dépendant de l\'approbation des autres',
      'Peut éviter les conflits au point de se trahir soi-même',
      'Risque d\'être trop passif ou indécis',
      'Tendance à se perdre dans les relations',
      'Peut avoir du mal à vous défendre'
    ]
  },
  3: {
    en: [
      'Can scatter energy across too many projects',
      'May use humor or charm to avoid depth',
      'Risk of being superficial or lacking follow-through',
      'Tendency to talk more than listen',
      'May struggle with discipline or commitment'
    ],
    fr: [
      'Peut disperser l\'énergie sur trop de projets',
      'Peut utiliser l\'humour ou le charme pour éviter la profondeur',
      'Risque d\'être superficiel ou de manquer de suivi',
      'Tendance à parler plus qu\'à écouter',
      'Peut avoir du mal avec la discipline ou l\'engagement'
    ]
  },
  4: {
    en: [
      'Can become rigid or resistant to change',
      'May get stuck in routines and miss opportunities',
      'Risk of being overly critical or perfectionistic',
      'Tendency to overwork and neglect play',
      'May struggle with spontaneity or flexibility'
    ],
    fr: [
      'Peut devenir rigide ou résistant au changement',
      'Peut se coincer dans des routines et manquer des opportunités',
      'Risque d\'être trop critique ou perfectionniste',
      'Tendance à trop travailler et négliger le jeu',
      'Peut avoir du mal avec la spontanéité ou la flexibilité'
    ]
  },
  5: {
    en: [
      'Can become restless or commitment-phobic',
      'May avoid responsibility in pursuit of freedom',
      'Risk of being impulsive or reckless',
      'Tendency to jump from one thing to another',
      'May struggle with stability or follow-through'
    ],
    fr: [
      'Peut devenir agité ou phobique de l\'engagement',
      'Peut éviter la responsabilité en quête de liberté',
      'Risque d\'être impulsif ou imprudent',
      'Tendance à sauter d\'une chose à l\'autre',
      'Peut avoir du mal avec la stabilité ou le suivi'
    ]
  },
  6: {
    en: [
      'Can become a martyr or overly self-sacrificing',
      'May interfere or try to control others "for their good"',
      'Risk of perfectionism in home or relationships',
      'Tendency to feel unappreciated or resentful',
      'May struggle with receiving or asking for help'
    ],
    fr: [
      'Peut devenir un martyr ou trop sacrificiel',
      'Peut interférer ou essayer de contrôler les autres "pour leur bien"',
      'Risque de perfectionnisme à la maison ou dans les relations',
      'Tendance à se sentir non apprécié ou rancunier',
      'Peut avoir du mal à recevoir ou demander de l\'aide'
    ]
  },
  7: {
    en: [
      'Can become isolated or emotionally distant',
      'May overthink to the point of paralysis',
      'Risk of being skeptical or distrustful',
      'Tendency to intellectualize emotions instead of feeling them',
      'May struggle with vulnerability or intimacy'
    ],
    fr: [
      'Peut devenir isolé ou émotionnellement distant',
      'Peut trop penser au point de la paralysie',
      'Risque d\'être sceptique ou méfiant',
      'Tendance à intellectualiser les émotions au lieu de les ressentir',
      'Peut avoir du mal avec la vulnérabilité ou l\'intimité'
    ]
  },
  8: {
    en: [
      'Can become power-hungry or materialistic',
      'May use people as stepping stones',
      'Risk of workaholism or neglecting relationships',
      'Tendency to equate worth with success or money',
      'May struggle with softness or vulnerability'
    ],
    fr: [
      'Peut devenir avide de pouvoir ou matérialiste',
      'Peut utiliser les gens comme tremplins',
      'Risque de workaholisme ou de négliger les relations',
      'Tendance à équivaloir la valeur au succès ou à l\'argent',
      'Peut avoir du mal avec la douceur ou la vulnérabilité'
    ]
  },
  9: {
    en: [
      'Can become overly idealistic or impractical',
      'May struggle with boundaries and self-care',
      'Risk of emotional overwhelm from world\'s pain',
      'Tendency to give until depleted',
      'May struggle with letting go or completion'
    ],
    fr: [
      'Peut devenir trop idéaliste ou peu pratique',
      'Peut avoir du mal avec les limites et l\'auto-soin',
      'Risque de submersion émotionnelle par la douleur du monde',
      'Tendance à donner jusqu\'à épuisement',
      'Peut avoir du mal à lâcher prise ou à terminer'
    ]
  },
  11: {
    en: [
      'Can feel misunderstood or alienated',
      'May struggle to ground visions into reality',
      'Risk of spiritual bypassing or escapism',
      'Tendency to feel overwhelmed by sensitivity',
      'May struggle with practical, mundane tasks'
    ],
    fr: [
      'Peut se sentir incompris ou aliéné',
      'Peut avoir du mal à ancrer les visions dans la réalité',
      'Risque de contournement spirituel ou d\'évasion',
      'Tendance à se sentir submergé par la sensibilité',
      'Peut avoir du mal avec les tâches pratiques et mondaines'
    ]
  },
  22: {
    en: [
      'Can feel crushed by the weight of your vision',
      'May struggle with patience for long-term building',
      'Risk of burnout from massive ambitions',
      'Tendency to be disappointed by others\' limitations',
      'May struggle with starting small or being content'
    ],
    fr: [
      'Peut se sentir écrasé par le poids de votre vision',
      'Peut avoir du mal avec la patience pour la construction à long terme',
      'Risque d\'épuisement par des ambitions massives',
      'Tendance à être déçu par les limitations des autres',
      'Peut avoir du mal à commencer petit ou à être content'
    ]
  },
  33: {
    en: [
      'Can become overwhelmed by responsibility to humanity',
      'May struggle with boundaries and self-sacrifice',
      'Risk of spiritual exhaustion from constant giving',
      'Tendency to hold yourself to impossible standards',
      'May struggle with accepting human limitations'
    ],
    fr: [
      'Peut devenir submergé par la responsabilité envers l\'humanité',
      'Peut avoir du mal avec les limites et le sacrifice de soi',
      'Risque d\'épuisement spirituel par le don constant',
      'Tendance à se tenir à des standards impossibles',
      'Peut avoir du mal à accepter les limitations humaines'
    ]
  }
};

// Practical Guidance Data (EN/FR)
interface PracticalGuidance {
  summary: { en: string; fr: string };
  spiritualPractice: { en: string; fr: string };
  weeklyActions: { en: string[]; fr: string[] };
  shadowToAvoid: { en: string; fr: string };
}

const PRACTICAL_GUIDANCE: Record<number, PracticalGuidance> = {
  1: {
    summary: {
      en: 'You are here to lead, innovate, and pioneer new paths with courage and independence.',
      fr: 'Vous êtes ici pour diriger, innover et ouvrir de nouveaux chemins avec courage et indépendance.'
    },
    spiritualPractice: {
      en: 'Daily affirmation: "I lead with courage and humility." Practice meditation to balance assertiveness with inner peace.',
      fr: 'Affirmation quotidienne : "Je dirige avec courage et humilité." Pratiquez la méditation pour équilibrer l\'affirmation de soi avec la paix intérieure.'
    },
    weeklyActions: {
      en: [
        'Start one new initiative or project',
        'Practice listening to someone else\'s idea fully',
        'Take decisive action on something you\'ve been delaying',
        'Ask for help with one task instead of doing it alone',
        'Reflect on how your leadership impacts others'
      ],
      fr: [
        'Lancez une nouvelle initiative ou projet',
        'Pratiquez écouter l\'idée de quelqu\'un d\'autre complètement',
        'Prenez une action décisive sur quelque chose que vous avez reporté',
        'Demandez de l\'aide pour une tâche au lieu de la faire seul',
        'Réfléchissez à comment votre leadership impacte les autres'
      ]
    },
    shadowToAvoid: {
      en: 'Avoid becoming domineering or refusing to collaborate. Balance independence with teamwork.',
      fr: 'Évitez de devenir dominateur ou de refuser de collaborer. Équilibrez l\'indépendance avec le travail d\'équipe.'
    }
  },
  2: {
    summary: {
      en: 'You are here to create harmony, build partnerships, and bring people together with sensitivity and grace.',
      fr: 'Vous êtes ici pour créer l\'harmonie, construire des partenariats et rassembler les gens avec sensibilité et grâce.'
    },
    spiritualPractice: {
      en: 'Daily affirmation: "I honor my own needs while serving others." Practice boundary-setting as spiritual discipline.',
      fr: 'Affirmation quotidienne : "J\'honore mes propres besoins en servant les autres." Pratiquez l\'établissement de limites comme discipline spirituelle.'
    },
    weeklyActions: {
      en: [
        'Say "no" to one request that doesn\'t serve you',
        'Express your opinion even if it differs from the group',
        'Meditate to reconnect with your own feelings',
        'Do something kind for yourself, not just others',
        'Practice making a decision without seeking approval'
      ],
      fr: [
        'Dites "non" à une demande qui ne vous sert pas',
        'Exprimez votre opinion même si elle diffère du groupe',
        'Méditez pour vous reconnecter avec vos propres sentiments',
        'Faites quelque chose de gentil pour vous, pas seulement pour les autres',
        'Pratiquez prendre une décision sans chercher l\'approbation'
      ]
    },
    shadowToAvoid: {
      en: 'Avoid losing yourself in pleasing others. Your needs matter as much as anyone else\'s.',
      fr: 'Évitez de vous perdre en plaisant aux autres. Vos besoins comptent autant que ceux des autres.'
    }
  },
  3: {
    summary: {
      en: 'You are here to create, communicate, and bring joy to the world through your expressive gifts.',
      fr: 'Vous êtes ici pour créer, communiquer et apporter de la joie au monde à travers vos dons expressifs.'
    },
    spiritualPractice: {
      en: 'Daily affirmation: "I express my truth with joy and discipline." Practice focused creativity sessions.',
      fr: 'Affirmation quotidienne : "J\'exprime ma vérité avec joie et discipline." Pratiquez des sessions de créativité concentrée.'
    },
    weeklyActions: {
      en: [
        'Finish one creative project before starting another',
        'Practice 30 minutes of focused work without distractions',
        'Share your creative work with others',
        'Balance social time with quiet reflection',
        'Commit to one priority this week and see it through'
      ],
      fr: [
        'Terminez un projet créatif avant d\'en commencer un autre',
        'Pratiquez 30 minutes de travail concentré sans distractions',
        'Partagez votre travail créatif avec les autres',
        'Équilibrez le temps social avec la réflexion tranquille',
        'Engagez-vous à une priorité cette semaine et menez-la à terme'
      ]
    },
    shadowToAvoid: {
      en: 'Avoid scattering your energy or using charm to escape depth. Focus brings power.',
      fr: 'Évitez de disperser votre énergie ou d\'utiliser le charme pour échapper à la profondeur. La concentration apporte le pouvoir.'
    }
  },
  4: {
    summary: {
      en: 'You are here to build solid foundations, create order, and manifest stability through hard work.',
      fr: 'Vous êtes ici pour construire des fondations solides, créer l\'ordre et manifester la stabilité par le travail acharné.'
    },
    spiritualPractice: {
      en: 'Daily affirmation: "I build with patience and trust the process." Practice yoga or grounding exercises.',
      fr: 'Affirmation quotidienne : "Je construis avec patience et fais confiance au processus." Pratiquez le yoga ou des exercices d\'ancrage.'
    },
    weeklyActions: {
      en: [
        'Try one new approach or break one routine',
        'Take a small risk outside your comfort zone',
        'Delegate one task instead of controlling everything',
        'Schedule time for play or spontaneity',
        'Practice saying "good enough" instead of perfect'
      ],
      fr: [
        'Essayez une nouvelle approche ou cassez une routine',
        'Prenez un petit risque hors de votre zone de confort',
        'Déléguez une tâche au lieu de tout contrôler',
        'Planifiez du temps pour le jeu ou la spontanéité',
        'Pratiquez dire "assez bon" au lieu de parfait'
      ]
    },
    shadowToAvoid: {
      en: 'Avoid rigidity or perfectionism that paralyzes progress. Flexibility brings resilience.',
      fr: 'Évitez la rigidité ou le perfectionnisme qui paralyse le progrès. La flexibilité apporte la résilience.'
    }
  },
  5: {
    summary: {
      en: 'You are here to explore, experience variety, and teach others the value of freedom and adaptability.',
      fr: 'Vous êtes ici pour explorer, expérimenter la variété et enseigner aux autres la valeur de la liberté et de l\'adaptabilité.'
    },
    spiritualPractice: {
      en: 'Daily affirmation: "I am free and grounded." Practice grounding meditation or nature walks.',
      fr: 'Affirmation quotidienne : "Je suis libre et ancré." Pratiquez la méditation d\'ancrage ou les promenades dans la nature.'
    },
    weeklyActions: {
      en: [
        'Commit to one thing and see it through this week',
        'Create one simple daily routine for stability',
        'Finish something you started months ago',
        'Practice being present in one moment without planning next move',
        'Ground yourself through physical exercise or gardening'
      ],
      fr: [
        'Engagez-vous à une chose et menez-la à terme cette semaine',
        'Créez une routine quotidienne simple pour la stabilité',
        'Terminez quelque chose que vous avez commencé il y a des mois',
        'Pratiquez être présent dans un moment sans planifier le prochain mouvement',
        'Ancrez-vous par l\'exercice physique ou le jardinage'
      ]
    },
    shadowToAvoid: {
      en: 'Avoid restlessness or commitment-phobia. True freedom comes from mastering discipline.',
      fr: 'Évitez l\'agitation ou la phobie de l\'engagement. La vraie liberté vient de la maîtrise de la discipline.'
    }
  },
  6: {
    summary: {
      en: 'You are here to nurture, create harmony, and serve your community with responsibility and love.',
      fr: 'Vous êtes ici pour nourrir, créer l\'harmonie et servir votre communauté avec responsabilité et amour.'
    },
    spiritualPractice: {
      en: 'Daily affirmation: "I give and receive with balance." Practice self-care rituals as spiritual practice.',
      fr: 'Affirmation quotidienne : "Je donne et reçois avec équilibre." Pratiquez des rituels d\'auto-soin comme pratique spirituelle.'
    },
    weeklyActions: {
      en: [
        'Do something nurturing for yourself, not others',
        'Let someone solve their own problem this week',
        'Say no to one responsibility that isn\'t yours',
        'Accept help from someone graciously',
        'Practice "good enough" instead of perfect in one area'
      ],
      fr: [
        'Faites quelque chose de nourrissant pour vous, pas pour les autres',
        'Laissez quelqu\'un résoudre son propre problème cette semaine',
        'Dites non à une responsabilité qui n\'est pas la vôtre',
        'Acceptez l\'aide de quelqu\'un avec grâce',
        'Pratiquez "assez bon" au lieu de parfait dans un domaine'
      ]
    },
    shadowToAvoid: {
      en: 'Avoid martyrdom or controlling others "for their good." Let people have their own journey.',
      fr: 'Évitez le martyre ou le contrôle des autres "pour leur bien." Laissez les gens avoir leur propre parcours.'
    }
  },
  7: {
    summary: {
      en: 'You are here to seek truth, develop wisdom, and share deep knowledge with the world.',
      fr: 'Vous êtes ici pour chercher la vérité, développer la sagesse et partager des connaissances profondes avec le monde.'
    },
    spiritualPractice: {
      en: 'Daily affirmation: "I trust my inner knowing." Practice contemplative prayer or silent meditation.',
      fr: 'Affirmation quotidienne : "Je fais confiance à mon savoir intérieur." Pratiquez la prière contemplative ou la méditation silencieuse.'
    },
    weeklyActions: {
      en: [
        'Share one insight or teaching with someone',
        'Schedule social time with meaningful people',
        'Practice feeling an emotion instead of analyzing it',
        'Move your body - dance, walk, or exercise',
        'Be vulnerable with one person you trust'
      ],
      fr: [
        'Partagez une idée ou un enseignement avec quelqu\'un',
        'Planifiez du temps social avec des personnes significatives',
        'Pratiquez ressentir une émotion au lieu de l\'analyser',
        'Bougez votre corps - dansez, marchez ou faites de l\'exercice',
        'Soyez vulnérable avec une personne de confiance'
      ]
    },
    shadowToAvoid: {
      en: 'Avoid isolation or emotional detachment. Connection is part of wisdom.',
      fr: 'Évitez l\'isolement ou le détachement émotionnel. La connexion fait partie de la sagesse.'
    }
  },
  8: {
    summary: {
      en: 'You are here to achieve, manifest abundance, and lead with power and integrity.',
      fr: 'Vous êtes ici pour réaliser, manifester l\'abondance et diriger avec pouvoir et intégrité.'
    },
    spiritualPractice: {
      en: 'Daily affirmation: "I use power wisely and serve the highest good." Practice gratitude meditation.',
      fr: 'Affirmation quotidienne : "J\'utilise le pouvoir sagement et sers le bien suprême." Pratiquez la méditation de gratitude.'
    },
    weeklyActions: {
      en: [
        'Schedule rest time as seriously as work time',
        'Do one act of kindness without expecting return',
        'Spend quality time with loved ones',
        'Practice gratitude for what you have',
        'Lead with compassion in one situation this week'
      ],
      fr: [
        'Planifiez du temps de repos aussi sérieusement que le temps de travail',
        'Faites un acte de gentillesse sans attendre de retour',
        'Passez du temps de qualité avec vos proches',
        'Pratiquez la gratitude pour ce que vous avez',
        'Dirigez avec compassion dans une situation cette semaine'
      ]
    },
    shadowToAvoid: {
      en: 'Avoid workaholism or equating worth with achievement. You are enough as you are.',
      fr: 'Évitez le workaholisme ou l\'équivalence de la valeur avec la réussite. Vous êtes assez tel que vous êtes.'
    }
  },
  9: {
    summary: {
      en: 'You are here to serve humanity, inspire compassion, and create positive global change.',
      fr: 'Vous êtes ici pour servir l\'humanité, inspirer la compassion et créer un changement mondial positif.'
    },
    spiritualPractice: {
      en: 'Daily affirmation: "I serve with wisdom and boundaries." Practice loving-kindness meditation.',
      fr: 'Affirmation quotidienne : "Je sers avec sagesse et limites." Pratiquez la méditation de bienveillance.'
    },
    weeklyActions: {
      en: [
        'Set one clear boundary around your giving',
        'Do one practical, grounded task',
        'Take care of your own needs before helping others once',
        'Let go of one thing you can\'t control',
        'Practice receiving as well as giving'
      ],
      fr: [
        'Établissez une limite claire autour de votre don',
        'Faites une tâche pratique et ancrée',
        'Prenez soin de vos propres besoins avant d\'aider les autres une fois',
        'Lâchez prise sur une chose que vous ne pouvez pas contrôler',
        'Pratiquez recevoir aussi bien que donner'
      ]
    },
    shadowToAvoid: {
      en: 'Avoid depletion from over-giving. You can\'t pour from an empty cup.',
      fr: 'Évitez l\'épuisement par le don excessif. Vous ne pouvez pas verser d\'une tasse vide.'
    }
  },
  11: {
    summary: {
      en: 'You are here to inspire, illuminate, and bring spiritual messages to humanity.',
      fr: 'Vous êtes ici pour inspirer, illuminer et apporter des messages spirituels à l\'humanité.'
    },
    spiritualPractice: {
      en: 'Daily affirmation: "I am a vessel of light grounded in reality." Practice visualization and grounding.',
      fr: 'Affirmation quotidienne : "Je suis un vaisseau de lumière ancré dans la réalité." Pratiquez la visualisation et l\'ancrage.'
    },
    weeklyActions: {
      en: [
        'Take one spiritual vision and create a practical first step',
        'Ground yourself through nature or physical activity',
        'Protect your energy - say no to energy vampires',
        'Share your insights with those ready to hear them',
        'Trust divine timing instead of rushing'
      ],
      fr: [
        'Prenez une vision spirituelle et créez une première étape pratique',
        'Ancrez-vous par la nature ou l\'activité physique',
        'Protégez votre énergie - dites non aux vampires énergétiques',
        'Partagez vos idées avec ceux prêts à les entendre',
        'Faites confiance au timing divin au lieu de vous précipiter'
      ]
    },
    shadowToAvoid: {
      en: 'Avoid spiritual escapism or feeling alienated. Ground your light in practical service.',
      fr: 'Évitez l\'évasion spirituelle ou le sentiment d\'aliénation. Ancrez votre lumière dans le service pratique.'
    }
  },
  22: {
    summary: {
      en: 'You are here to build lasting structures and turn grand visions into tangible reality.',
      fr: 'Vous êtes ici pour construire des structures durables et transformer de grandes visions en réalité tangible.'
    },
    spiritualPractice: {
      en: 'Daily affirmation: "I build step by step with patience." Practice mindful breathing when overwhelmed.',
      fr: 'Affirmation quotidienne : "Je construis étape par étape avec patience." Pratiquez la respiration consciente quand submergé.'
    },
    weeklyActions: {
      en: [
        'Break one big goal into three small steps',
        'Delegate one task to someone else',
        'Rest when you need to - recovery fuels creation',
        'Celebrate small progress, not just big wins',
        'Be patient with the process - Rome wasn\'t built in a day'
      ],
      fr: [
        'Divisez un grand objectif en trois petites étapes',
        'Déléguez une tâche à quelqu\'un d\'autre',
        'Reposez-vous quand vous en avez besoin - la récupération alimente la création',
        'Célébrez les petits progrès, pas seulement les grandes victoires',
        'Soyez patient avec le processus - Rome ne s\'est pas construite en un jour'
      ]
    },
    shadowToAvoid: {
      en: 'Avoid overwhelm from the scale of your vision. Trust the process and start where you are.',
      fr: 'Évitez la submersion par l\'ampleur de votre vision. Faites confiance au processus et commencez où vous êtes.'
    }
  },
  33: {
    summary: {
      en: 'You are here to teach, heal, and guide humanity with unconditional love and wisdom.',
      fr: 'Vous êtes ici pour enseigner, guérir et guider l\'humanité avec un amour inconditionnel et une sagesse.'
    },
    spiritualPractice: {
      en: 'Daily affirmation: "I teach from fullness, not depletion." Practice self-compassion meditation.',
      fr: 'Affirmation quotidienne : "J\'enseigne depuis la plénitude, pas l\'épuisement." Pratiquez la méditation d\'auto-compassion.'
    },
    weeklyActions: {
      en: [
        'Release one responsibility that isn\'t yours to carry',
        'Teach or guide while maintaining clear boundaries',
        'Practice self-love with the same intensity you love others',
        'Rest deeply - you need it more than most',
        'Remember you\'re human - be gentle with yourself'
      ],
      fr: [
        'Libérez une responsabilité qui n\'est pas la vôtre à porter',
        'Enseignez ou guidez en maintenant des limites claires',
        'Pratiquez l\'amour de soi avec la même intensité que vous aimez les autres',
        'Reposez-vous profondément - vous en avez plus besoin que la plupart',
        'Rappelez-vous que vous êtes humain - soyez doux avec vous-même'
      ]
    },
    shadowToAvoid: {
      en: 'Avoid carrying the world on your shoulders. Even master teachers need rest and support.',
      fr: 'Évitez de porter le monde sur vos épaules. Même les maîtres enseignants ont besoin de repos et de soutien.'
    }
  }
};

// Export getter functions for use in components
export function getCareerGuidance(lifePathNumber: number, lang: 'en' | 'fr' = 'en') {
  const data = CAREER_GUIDANCE[lifePathNumber];
  if (!data) return null;
  
  return {
    idealCareers: data.idealCareers[lang],
    avoid: data.avoid[lang],
    why: data.why[lang]
  };
}

export function getBalanceTips(lifePathNumber: number, lang: 'en' | 'fr' = 'en') {
  const data = BALANCE_TIPS[lifePathNumber];
  return data ? data[lang] : [];
}

export function getShadowWork(lifePathNumber: number, lang: 'en' | 'fr' = 'en') {
  const data = SHADOW_WORK[lifePathNumber];
  return data ? data[lang] : [];
}

export function getPracticalGuidance(lifePathNumber: number, lang: 'en' | 'fr' = 'en') {
  const data = PRACTICAL_GUIDANCE[lifePathNumber];
  if (!data) return null;
  
  return {
    summary: data.summary[lang],
    spiritualPractice: data.spiritualPractice[lang],
    weeklyActions: data.weeklyActions[lang],
    shadowToAvoid: data.shadowToAvoid[lang]
  };
}

export function calculateEnhancedLifePath(
  arabicName: string,
  birthDate: Date,
  fatherName?: string,
  motherName?: string
): EnhancedLifePathResult {
  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthDate.getFullYear() -
    (currentDate.getMonth() < birthDate.getMonth() ||
     (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) ? 1 : 0);
  
  return {
    birthDate,
    lifePathNumber: calculateLifePathNumber(arabicName),
    soulUrgeNumber: calculateSoulUrgeNumber(arabicName),
    personalityNumber: calculatePersonalityNumber(arabicName),
    destinyNumber: calculateDestinyNumber(arabicName, fatherName), // ✅ Fixed: No mother's name
    personalYear: calculatePersonalYear(birthDate),
    personalMonth: calculatePersonalMonth(birthDate),
    cycle: calculateLifeCycle(birthDate, currentDate),
    karmicDebts: detectKarmicDebts(arabicName, birthDate),
    sacredNumbers: detectSacredNumbers(arabicName),
    pinnaclesAndChallenges: calculatePinnaclesAndChallenges(birthDate, age),
    // Add maternal influence as separate field (optional)
    maternalInfluence: motherName ? calculateMaternalInfluence(arabicName, motherName) : undefined
  };
}
