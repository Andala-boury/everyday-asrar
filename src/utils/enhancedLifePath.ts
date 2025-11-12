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

// ============================================================================
// PHASE 2: Quranic Connections
// ============================================================================

interface QuranicConnection {
  verse: { en: string; fr: string; arabic: string };
  reference: string;
  divineAttribute: { en: string; fr: string; arabic: string };
  spiritualMeaning: { en: string; fr: string };
  dailyPractice: { en: string; fr: string };
}

const QURANIC_CONNECTIONS: Record<number, QuranicConnection> = {
  1: {
    verse: {
      en: `Say: He is Allah, the One and Only`,
      fr: `Dis: Il est Allah, l'Unique`,
      arabic: `قُلْ هُوَ اللَّهُ أَحَدٌ`
    },
    reference: "Surah Al-Ikhlas 112:1",
    divineAttribute: {
      en: "Al-Ahad (The One)",
      fr: "Al-Ahad (L'Unique)",
      arabic: "الأحد"
    },
    spiritualMeaning: {
      en: `Life Path 1 embodies divine unity and singularity. Like Allah being Al-Ahad, you're called to stand independently in your truth and lead with authentic individuality.`,
      fr: `Le Chemin de Vie 1 incarne l'unité et la singularité divines. Comme Allah étant Al-Ahad, vous êtes appelé à vous tenir indépendamment dans votre vérité et à diriger avec une individualité authentique.`
    },
    dailyPractice: {
      en: `Recite Surah Al-Ikhlas 3 times after Fajr prayer to strengthen your connection to divine oneness and individual purpose.`,
      fr: `Récitez la Sourate Al-Ikhlas 3 fois après la prière du Fajr pour renforcer votre connexion à l'unicité divine et votre but individuel.`
    }
  },
  2: {
    verse: {
      en: `And We have enjoined upon man goodness to his parents`,
      fr: `Et Nous avons enjoint à l'homme la bonté envers ses parents`,
      arabic: `وَوَصَّيْنَا الْإِنسَانَ بِوَالِدَيْهِ إِحْسَانًا`
    },
    reference: "Surah Al-Ahqaf 46:15",
    divineAttribute: {
      en: "Al-Latif (The Subtle, The Kind)",
      fr: "Al-Latif (Le Subtil, Le Bienveillant)",
      arabic: "اللطيف"
    },
    spiritualMeaning: {
      en: `Life Path 2 reflects divine gentleness and relational harmony. Like Al-Latif, you work through subtle kindness, diplomacy, and nurturing connections between people.`,
      fr: `Le Chemin de Vie 2 reflète la douceur divine et l'harmonie relationnelle. Comme Al-Latif, vous travaillez à travers la gentillesse subtile, la diplomatie et l'entretien des connexions entre les gens.`
    },
    dailyPractice: {
      en: `Recite "Ya Latif" 129 times after Asr prayer to cultivate divine gentleness in your relationships and mediation work.`,
      fr: `Récitez "Ya Latif" 129 fois après la prière d'Asr pour cultiver la douceur divine dans vos relations et votre travail de médiation.`
    }
  },
  3: {
    verse: {
      en: `So relate the stories, perhaps they will reflect`,
      fr: `Raconte donc les récits, peut-être réfléchiront-ils`,
      arabic: `فَاقْصُصِ الْقَصَصَ لَعَلَّهُمْ يَتَفَكَّرُونَ`
    },
    reference: "Surah Al-A'raf 7:176",
    divineAttribute: {
      en: "Al-Khabir (The All-Aware, The Well-Informed)",
      fr: "Al-Khabir (Le Parfaitement Connaisseur)",
      arabic: "الخبير"
    },
    spiritualMeaning: {
      en: `Life Path 3 channels divine expression through creative communication. Like Al-Khabir, you're gifted with awareness that must be shared through stories, art, and joyful expression.`,
      fr: `Le Chemin de Vie 3 canalise l'expression divine à travers la communication créative. Comme Al-Khabir, vous êtes doté d'une conscience qui doit être partagée à travers des histoires, l'art et l'expression joyeuse.`
    },
    dailyPractice: {
      en: `After Maghrib, reflect on one story from the Quran and how it relates to your creative expression today.`,
      fr: `Après le Maghrib, réfléchissez à une histoire du Coran et comment elle se rapporte à votre expression créative aujourd'hui.`
    }
  },
  4: {
    verse: {
      en: `And We have made the heaven a guarded canopy`,
      fr: `Et Nous avons fait du ciel un toit protégé`,
      arabic: `وَجَعَلْنَا السَّمَاءَ سَقْفًا مَّحْفُوظًا`
    },
    reference: "Surah Al-Anbiya 21:32",
    divineAttribute: {
      en: "Al-Hafiz (The Preserver, The Guardian)",
      fr: "Al-Hafiz (Le Préservateur, Le Gardien)",
      arabic: "الحفيظ"
    },
    spiritualMeaning: {
      en: `Life Path 4 embodies divine structure and preservation. Like Al-Hafiz, you build stable foundations, create order, and guard what is sacred through disciplined work.`,
      fr: `Le Chemin de Vie 4 incarne la structure divine et la préservation. Comme Al-Hafiz, vous construisez des fondations stables, créez de l'ordre et gardez ce qui est sacré par un travail discipliné.`
    },
    dailyPractice: {
      en: `Perform your 5 daily prayers at their exact times to embody divine order and structure in your spiritual practice.`,
      fr: `Effectuez vos 5 prières quotidiennes à leurs heures exactes pour incarner l'ordre divin et la structure dans votre pratique spirituelle.`
    }
  },
  5: {
    verse: {
      en: `And We have created you in pairs`,
      fr: `Et Nous vous avons créés en couples`,
      arabic: `وَخَلَقْنَاكُمْ أَزْوَاجًا`
    },
    reference: "Surah An-Naba 78:8",
    divineAttribute: {
      en: "Al-Musawwir (The Fashioner, The Shaper)",
      fr: "Al-Musawwir (Le Façonneur, Le Formateur)",
      arabic: "المصور"
    },
    spiritualMeaning: {
      en: `Life Path 5 reflects divine creativity and adaptability. Like Al-Musawwir, you shape-shift through experiences, exploring the diverse forms of creation with freedom and curiosity.`,
      fr: `Le Chemin de Vie 5 reflète la créativité divine et l'adaptabilité. Comme Al-Musawwir, vous vous transformez à travers les expériences, explorant les formes diverses de la création avec liberté et curiosité.`
    },
    dailyPractice: {
      en: `Before traveling or starting new experiences, recite "Bismillah" 5 times to invoke divine guidance through change.`,
      fr: `Avant de voyager ou de commencer de nouvelles expériences, récitez "Bismillah" 5 fois pour invoquer la guidance divine à travers le changement.`
    }
  },
  6: {
    verse: {
      en: `And lower to them the wing of humility out of mercy`,
      fr: `Et abaisse pour eux l'aile de l'humilité par miséricorde`,
      arabic: `وَاخْفِضْ لَهُمَا جَنَاحَ الذُّلِّ مِنَ الرَّحْمَةِ`
    },
    reference: "Surah Al-Isra 17:24",
    divineAttribute: {
      en: "Ar-Rahman (The Most Merciful)",
      fr: "Ar-Rahman (Le Tout Miséricordieux)",
      arabic: "الرحمن"
    },
    spiritualMeaning: {
      en: `Life Path 6 embodies divine mercy and nurturing. Like Ar-Rahman, you extend unconditional compassion to family, community, and all who seek healing and harmony.`,
      fr: `Le Chemin de Vie 6 incarne la miséricorde divine et le soin. Comme Ar-Rahman, vous étendez une compassion inconditionnelle à la famille, la communauté et tous ceux qui cherchent la guérison et l'harmonie.`
    },
    dailyPractice: {
      en: `Begin each day by reciting "Bismillah Ar-Rahman Ar-Rahim" and setting an intention to serve your family or community with mercy.`,
      fr: `Commencez chaque jour en récitant "Bismillah Ar-Rahman Ar-Rahim" et en définissant une intention de servir votre famille ou communauté avec miséricorde.`
    }
  },
  7: {
    verse: {
      en: `Indeed, in the creation of the heavens and earth are signs for those of understanding`,
      fr: `Certes, dans la création des cieux et de la terre, il y a des signes pour les gens doués d'intelligence`,
      arabic: `إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ لَآيَاتٍ لِّأُولِي الْأَلْبَابِ`
    },
    reference: "Surah Ali 'Imran 3:190",
    divineAttribute: {
      en: "Al-Hakim (The Wise)",
      fr: "Al-Hakim (Le Sage)",
      arabic: "الحكيم"
    },
    spiritualMeaning: {
      en: `Life Path 7 seeks divine wisdom through contemplation. Like Al-Hakim, you're called to study the signs, dive deep into mysteries, and uncover sacred knowledge through spiritual inquiry.`,
      fr: `Le Chemin de Vie 7 cherche la sagesse divine à travers la contemplation. Comme Al-Hakim, vous êtes appelé à étudier les signes, plonger dans les mystères et découvrir la connaissance sacrée par l'enquête spirituelle.`
    },
    dailyPractice: {
      en: `Spend 7 minutes after Fajr in silent contemplation (muraqaba) reflecting on the signs of Allah in creation.`,
      fr: `Passez 7 minutes après le Fajr en contemplation silencieuse (muraqaba) réfléchissant sur les signes d'Allah dans la création.`
    }
  },
  8: {
    verse: {
      en: `And to Allah belongs the dominion of the heavens and the earth`,
      fr: `Et à Allah appartient le royaume des cieux et de la terre`,
      arabic: `وَلِلَّهِ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ`
    },
    reference: "Surah Ali 'Imran 3:189",
    divineAttribute: {
      en: "Al-Malik (The Sovereign, The King)",
      fr: "Al-Malik (Le Souverain, Le Roi)",
      arabic: "الملك"
    },
    spiritualMeaning: {
      en: `Life Path 8 manifests divine authority and abundance. Like Al-Malik, you're entrusted with power, resources, and leadership to establish justice and prosperity in the material realm.`,
      fr: `Le Chemin de Vie 8 manifeste l'autorité divine et l'abondance. Comme Al-Malik, vous êtes investi de pouvoir, de ressources et de leadership pour établir la justice et la prospérité dans le domaine matériel.`
    },
    dailyPractice: {
      en: `Recite "Ya Malik" 90 times on Fridays to align your material success with divine sovereignty and ethical leadership.`,
      fr: `Récitez "Ya Malik" 90 fois le vendredi pour aligner votre succès matériel avec la souveraineté divine et le leadership éthique.`
    }
  },
  9: {
    verse: {
      en: `And spend in the way of Allah and do not throw yourselves into destruction`,
      fr: `Et dépensez dans le chemin d'Allah et ne vous jetez pas de vos propres mains dans la destruction`,
      arabic: `وَأَنفِقُوا فِي سَبِيلِ اللَّهِ وَلَا تُلْقُوا بِأَيْدِيكُمْ إِلَى التَّهْلُكَةِ`
    },
    reference: "Surah Al-Baqarah 2:195",
    divineAttribute: {
      en: "Al-Karim (The Generous, The Bountiful)",
      fr: "Al-Karim (Le Généreux, Le Noble)",
      arabic: "الكريم"
    },
    spiritualMeaning: {
      en: `Life Path 9 embodies divine generosity and completion. Like Al-Karim, you're called to give selflessly, serve humanity, and complete karmic cycles through compassionate service.`,
      fr: `Le Chemin de Vie 9 incarne la générosité divine et l'achèvement. Comme Al-Karim, vous êtes appelé à donner sans ego, servir l'humanité et compléter les cycles karmiques par un service compatissant.`
    },
    dailyPractice: {
      en: `Give charity (sadaqah) every day, even if small, and recite "Alhamdulillah" 9 times to embody divine generosity.`,
      fr: `Donnez la charité (sadaqah) chaque jour, même petite, et récitez "Alhamdulillah" 9 fois pour incarner la générosité divine.`
    }
  },
  11: {
    verse: {
      en: `Allah is the Light of the heavens and the earth`,
      fr: `Allah est la Lumière des cieux et de la terre`,
      arabic: `اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ`
    },
    reference: "Surah An-Nur 24:35",
    divineAttribute: {
      en: "An-Nur (The Light)",
      fr: "An-Nur (La Lumière)",
      arabic: "النور"
    },
    spiritualMeaning: {
      en: `Master Number 11 channels divine illumination. Like An-Nur, you're a spiritual lighthouse meant to inspire, uplift, and guide others toward enlightenment through your heightened intuition.`,
      fr: `Le Nombre Maître 11 canalise l'illumination divine. Comme An-Nur, vous êtes un phare spirituel destiné à inspirer, élever et guider les autres vers l'illumination par votre intuition élevée.`
    },
    dailyPractice: {
      en: `Recite Ayat an-Nur (24:35) during Tahajjud prayer to strengthen your connection to divine light and spiritual vision.`,
      fr: `Récitez Ayat an-Nur (24:35) pendant la prière de Tahajjud pour renforcer votre connexion à la lumière divine et la vision spirituelle.`
    }
  },
  22: {
    verse: {
      en: `And We made from water every living thing`,
      fr: `Et Nous avons fait de l'eau toute chose vivante`,
      arabic: `وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ`
    },
    reference: "Surah Al-Anbiya 21:30",
    divineAttribute: {
      en: "Al-Bani (The Builder, The Architect)",
      fr: "Al-Bani (Le Constructeur, L'Architecte)",
      arabic: "الباني"
    },
    spiritualMeaning: {
      en: `Master Number 22 builds divine vision into material reality. Like Al-Bani, you're the master architect capable of constructing systems, institutions, and legacies that serve humanity for generations.`,
      fr: `Le Nombre Maître 22 construit la vision divine dans la réalité matérielle. Comme Al-Bani, vous êtes l'architecte maître capable de construire des systèmes, institutions et héritages qui servent l'humanité pour des générations.`
    },
    dailyPractice: {
      en: `Before major projects, perform 2 rakat Salat al-Istikhara asking Allah to guide your building and manifestation work.`,
      fr: `Avant les grands projets, effectuez 2 rakat Salat al-Istikhara demandant à Allah de guider votre travail de construction et de manifestation.`
    }
  },
  33: {
    verse: {
      en: `Indeed, Allah is with those who are patient`,
      fr: `Certes, Allah est avec les endurants`,
      arabic: `إِنَّ اللَّهَ مَعَ الصَّابِرِينَ`
    },
    reference: "Surah Al-Baqarah 2:153",
    divineAttribute: {
      en: "As-Sabur (The Patient, The Timeless)",
      fr: "As-Sabur (Le Patient, L'Intemporel)",
      arabic: "الصبور"
    },
    spiritualMeaning: {
      en: `Master Number 33 embodies divine compassion and mastery through sacrifice. Like As-Sabur, you're called to serve as a spiritual teacher and healer, patiently uplifting all beings with universal love.`,
      fr: `Le Nombre Maître 33 incarne la compassion divine et la maîtrise par le sacrifice. Comme As-Sabur, vous êtes appelé à servir comme enseignant spirituel et guérisseur, élevant patiemment tous les êtres avec amour universel.`
    },
    dailyPractice: {
      en: `Practice sabr (patience) consciously in 3 situations daily, and recite "Ya Sabur" 33 times after Isha to embody divine patience in your teaching.`,
      fr: `Pratiquez le sabr (patience) consciemment dans 3 situations quotidiennes, et récitez "Ya Sabur" 33 fois après l'Isha pour incarner la patience divine dans votre enseignement.`
    }
  }
};

export function getQuranicConnection(lifePathNumber: number, lang: 'en' | 'fr' = 'en') {
  const data = QURANIC_CONNECTIONS[lifePathNumber];
  if (!data) return null;
  
  return {
    verse: data.verse[lang],
    verseArabic: data.verse.arabic,
    reference: data.reference,
    divineAttribute: data.divineAttribute[lang],
    divineAttributeArabic: data.divineAttribute.arabic,
    spiritualMeaning: data.spiritualMeaning[lang],
    dailyPractice: data.dailyPractice[lang]
  };
}

// ============================================================================
// PHASE 2: Personal Year & Month Guidance
// ============================================================================

interface PersonalYearGuidance {
  theme: { en: string; fr: string };
  description: { en: string; fr: string };
  focusAreas: { en: string[]; fr: string[] };
  monthlyThemes: Record<number, { en: string; fr: string }>;
  actionSteps: { en: string[]; fr: string[] };
}

const PERSONAL_YEAR_GUIDANCE: Record<number, PersonalYearGuidance> = {
  1: {
    theme: {
      en: "New Beginnings & Independence",
      fr: "Nouveaux Départs et Indépendance"
    },
    description: {
      en: "This is your year to start fresh, plant seeds, and initiate new projects. Take the lead and trust your instincts.",
      fr: "C'est votre année pour recommencer à zéro, planter des graines et initier de nouveaux projets. Prenez les devants et faites confiance à vos instincts."
    },
    focusAreas: {
      en: ["Leadership", "Self-reliance", "New ventures", "Personal goals", "Independence"],
      fr: ["Leadership", "Autonomie", "Nouvelles entreprises", "Objectifs personnels", "Indépendance"]
    },
    monthlyThemes: {
      1: { en: "Plant the seeds", fr: "Plantez les graines" },
      2: { en: "Build support", fr: "Construisez le soutien" },
      3: { en: "Express your vision", fr: "Exprimez votre vision" },
      4: { en: "Create structure", fr: "Créez la structure" },
      5: { en: "Adapt and explore", fr: "Adaptez-vous et explorez" },
      6: { en: "Nurture growth", fr: "Nourrissez la croissance" },
      7: { en: "Reflect and refine", fr: "Réfléchissez et affinez" },
      8: { en: "Take action", fr: "Passez à l'action" },
      9: { en: "Release what doesn't serve", fr: "Libérez ce qui ne sert pas" }
    },
    actionSteps: {
      en: [
        "Start that project you've been delaying",
        "Make a bold decision",
        "Step into a leadership role",
        "Define clear personal goals",
        "Trust yourself and take the first step"
      ],
      fr: [
        "Commencez ce projet que vous avez reporté",
        "Prenez une décision audacieuse",
        "Assumez un rôle de leader",
        "Définissez des objectifs personnels clairs",
        "Faites-vous confiance et faites le premier pas"
      ]
    }
  },
  2: {
    theme: {
      en: "Partnerships & Cooperation",
      fr: "Partenariats et Coopération"
    },
    description: {
      en: "This year emphasizes relationships, teamwork, and patience. Focus on building bridges and creating harmony.",
      fr: "Cette année met l'accent sur les relations, le travail d'équipe et la patience. Concentrez-vous sur la construction de ponts et la création d'harmonie."
    },
    focusAreas: {
      en: ["Relationships", "Collaboration", "Patience", "Diplomacy", "Balance"],
      fr: ["Relations", "Collaboration", "Patience", "Diplomatie", "Équilibre"]
    },
    monthlyThemes: {
      1: { en: "Connect with others", fr: "Connectez-vous avec les autres" },
      2: { en: "Deepen partnerships", fr: "Approfondissez les partenariats" },
      3: { en: "Communicate harmoniously", fr: "Communiquez harmonieusement" },
      4: { en: "Build together", fr: "Construisez ensemble" },
      5: { en: "Adapt as a team", fr: "Adaptez-vous en équipe" },
      6: { en: "Serve relationships", fr: "Servez les relations" },
      7: { en: "Understand deeply", fr: "Comprenez profondément" },
      8: { en: "Manifest through unity", fr: "Manifestez par l'unité" },
      9: { en: "Complete collaborations", fr: "Complétez les collaborations" }
    },
    actionSteps: {
      en: [
        "Strengthen existing relationships",
        "Seek win-win solutions",
        "Practice active listening",
        "Join a partnership or team",
        "Be patient with timing"
      ],
      fr: [
        "Renforcez les relations existantes",
        "Recherchez des solutions gagnant-gagnant",
        "Pratiquez l'écoute active",
        "Rejoignez un partenariat ou une équipe",
        "Soyez patient avec le timing"
      ]
    }
  },
  3: {
    theme: {
      en: "Creativity & Self-Expression",
      fr: "Créativité et Expression de Soi"
    },
    description: {
      en: "This year invites you to create, communicate, and enjoy life. Share your gifts and let your personality shine.",
      fr: "Cette année vous invite à créer, communiquer et profiter de la vie. Partagez vos dons et laissez briller votre personnalité."
    },
    focusAreas: {
      en: ["Creativity", "Communication", "Joy", "Social life", "Artistic expression"],
      fr: ["Créativité", "Communication", "Joie", "Vie sociale", "Expression artistique"]
    },
    monthlyThemes: {
      1: { en: "Create something new", fr: "Créez quelque chose de nouveau" },
      2: { en: "Share your ideas", fr: "Partagez vos idées" },
      3: { en: "Express fully", fr: "Exprimez-vous pleinement" },
      4: { en: "Build creative foundations", fr: "Construisez des bases créatives" },
      5: { en: "Explore diverse expressions", fr: "Explorez diverses expressions" },
      6: { en: "Create for others", fr: "Créez pour les autres" },
      7: { en: "Refine your craft", fr: "Affinez votre art" },
      8: { en: "Manifest creations", fr: "Manifestez les créations" },
      9: { en: "Complete creative projects", fr: "Complétez les projets créatifs" }
    },
    actionSteps: {
      en: [
        "Start a creative project",
        "Speak your truth",
        "Attend social events",
        "Take a class in the arts",
        "Share your work publicly"
      ],
      fr: [
        "Commencez un projet créatif",
        "Dites votre vérité",
        "Assistez à des événements sociaux",
        "Suivez un cours dans les arts",
        "Partagez votre travail publiquement"
      ]
    }
  },
  4: {
    theme: {
      en: "Building & Discipline",
      fr: "Construction et Discipline"
    },
    description: {
      en: "This year is about hard work, creating solid foundations, and establishing security. Focus on practical progress.",
      fr: "Cette année concerne le travail acharné, la création de fondations solides et l'établissement de la sécurité. Concentrez-vous sur le progrès pratique."
    },
    focusAreas: {
      en: ["Work", "Organization", "Foundation", "Security", "Discipline"],
      fr: ["Travail", "Organisation", "Fondation", "Sécurité", "Discipline"]
    },
    monthlyThemes: {
      1: { en: "Lay the groundwork", fr: "Posez les bases" },
      2: { en: "Collaborate on systems", fr: "Collaborez sur les systèmes" },
      3: { en: "Communicate plans", fr: "Communiquez les plans" },
      4: { en: "Build methodically", fr: "Construisez méthodiquement" },
      5: { en: "Adjust your approach", fr: "Ajustez votre approche" },
      6: { en: "Serve through structure", fr: "Servez par la structure" },
      7: { en: "Perfect the details", fr: "Perfectionnez les détails" },
      8: { en: "Harvest results", fr: "Récoltez les résultats" },
      9: { en: "Complete foundations", fr: "Complétez les fondations" }
    },
    actionSteps: {
      en: [
        "Create a detailed plan",
        "Establish routines and systems",
        "Work on long-term goals",
        "Improve health and finances",
        "Stay disciplined and focused"
      ],
      fr: [
        "Créez un plan détaillé",
        "Établissez des routines et des systèmes",
        "Travaillez sur des objectifs à long terme",
        "Améliorez la santé et les finances",
        "Restez discipliné et concentré"
      ]
    }
  },
  5: {
    theme: {
      en: "Freedom & Change",
      fr: "Liberté et Changement"
    },
    description: {
      en: "This year brings unexpected changes, travel, and new experiences. Embrace variety and stay flexible.",
      fr: "Cette année apporte des changements inattendus, des voyages et de nouvelles expériences. Embrassez la variété et restez flexible."
    },
    focusAreas: {
      en: ["Change", "Freedom", "Travel", "Adventure", "Flexibility"],
      fr: ["Changement", "Liberté", "Voyage", "Aventure", "Flexibilité"]
    },
    monthlyThemes: {
      1: { en: "Initiate change", fr: "Initiez le changement" },
      2: { en: "Navigate transitions together", fr: "Naviguez les transitions ensemble" },
      3: { en: "Express your freedom", fr: "Exprimez votre liberté" },
      4: { en: "Create flexible structures", fr: "Créez des structures flexibles" },
      5: { en: "Embrace full freedom", fr: "Embrassez la pleine liberté" },
      6: { en: "Balance freedom with responsibility", fr: "Équilibrez liberté et responsabilité" },
      7: { en: "Understand the changes", fr: "Comprenez les changements" },
      8: { en: "Channel change productively", fr: "Canalisez le changement productivement" },
      9: { en: "Release what's complete", fr: "Libérez ce qui est complet" }
    },
    actionSteps: {
      en: [
        "Try something completely new",
        "Travel or explore",
        "Break old patterns",
        "Meet new people",
        "Stay open to unexpected opportunities"
      ],
      fr: [
        "Essayez quelque chose de complètement nouveau",
        "Voyagez ou explorez",
        "Brisez les anciens schémas",
        "Rencontrez de nouvelles personnes",
        "Restez ouvert aux opportunités inattendues"
      ]
    }
  },
  6: {
    theme: {
      en: "Responsibility & Service",
      fr: "Responsabilité et Service"
    },
    description: {
      en: "This year focuses on family, home, and caring for others. Step into responsibilities with love.",
      fr: "Cette année se concentre sur la famille, la maison et prendre soin des autres. Assumez les responsabilités avec amour."
    },
    focusAreas: {
      en: ["Family", "Home", "Service", "Responsibility", "Love"],
      fr: ["Famille", "Maison", "Service", "Responsabilité", "Amour"]
    },
    monthlyThemes: {
      1: { en: "Start caring initiatives", fr: "Démarrez des initiatives de soin" },
      2: { en: "Harmonize relationships", fr: "Harmonisez les relations" },
      3: { en: "Express love", fr: "Exprimez l'amour" },
      4: { en: "Build a stable home", fr: "Construisez un foyer stable" },
      5: { en: "Balance duty and freedom", fr: "Équilibrez devoir et liberté" },
      6: { en: "Serve fully", fr: "Servez pleinement" },
      7: { en: "Reflect on service", fr: "Réfléchissez sur le service" },
      8: { en: "Manifest through caring", fr: "Manifestez par le soin" },
      9: { en: "Complete family matters", fr: "Complétez les affaires familiales" }
    },
    actionSteps: {
      en: [
        "Strengthen family bonds",
        "Create a nurturing home",
        "Help those in need",
        "Take on more responsibility",
        "Practice unconditional love"
      ],
      fr: [
        "Renforcez les liens familiaux",
        "Créez un foyer nourrissant",
        "Aidez ceux dans le besoin",
        "Assumez plus de responsabilités",
        "Pratiquez l'amour inconditionnel"
      ]
    }
  },
  7: {
    theme: {
      en: "Reflection & Inner Growth",
      fr: "Réflexion et Croissance Intérieure"
    },
    description: {
      en: "This year calls for introspection, study, and spiritual development. Go inward to find answers.",
      fr: "Cette année appelle à l'introspection, à l'étude et au développement spirituel. Allez à l'intérieur pour trouver des réponses."
    },
    focusAreas: {
      en: ["Spirituality", "Study", "Solitude", "Wisdom", "Inner work"],
      fr: ["Spiritualité", "Étude", "Solitude", "Sagesse", "Travail intérieur"]
    },
    monthlyThemes: {
      1: { en: "Begin inner journey", fr: "Commencez le voyage intérieur" },
      2: { en: "Seek deeper connections", fr: "Recherchez des connexions plus profondes" },
      3: { en: "Express your insights", fr: "Exprimez vos idées" },
      4: { en: "Build spiritual practices", fr: "Construisez des pratiques spirituelles" },
      5: { en: "Explore diverse wisdom", fr: "Explorez diverses sagesses" },
      6: { en: "Serve through wisdom", fr: "Servez par la sagesse" },
      7: { en: "Dive deep within", fr: "Plongez profondément" },
      8: { en: "Apply your knowledge", fr: "Appliquez vos connaissances" },
      9: { en: "Release old beliefs", fr: "Libérez les anciennes croyances" }
    },
    actionSteps: {
      en: [
        "Meditate or pray daily",
        "Study a spiritual topic",
        "Spend time in nature alone",
        "Journal your insights",
        "Trust your intuition"
      ],
      fr: [
        "Méditez ou priez quotidiennement",
        "Étudiez un sujet spirituel",
        "Passez du temps seul dans la nature",
        "Tenez un journal de vos idées",
        "Faites confiance à votre intuition"
      ]
    }
  },
  8: {
    theme: {
      en: "Power & Manifestation",
      fr: "Pouvoir et Manifestation"
    },
    description: {
      en: "This year is about achieving goals, building wealth, and stepping into your power. Think big and take action.",
      fr: "Cette année concerne l'atteinte d'objectifs, la construction de richesse et l'appropriation de votre pouvoir. Pensez grand et passez à l'action."
    },
    focusAreas: {
      en: ["Achievement", "Finance", "Power", "Success", "Authority"],
      fr: ["Réussite", "Finance", "Pouvoir", "Succès", "Autorité"]
    },
    monthlyThemes: {
      1: { en: "Initiate big goals", fr: "Initiez de grands objectifs" },
      2: { en: "Build powerful alliances", fr: "Construisez des alliances puissantes" },
      3: { en: "Communicate your vision", fr: "Communiquez votre vision" },
      4: { en: "Create wealth foundations", fr: "Créez des bases de richesse" },
      5: { en: "Adapt your strategy", fr: "Adaptez votre stratégie" },
      6: { en: "Lead with integrity", fr: "Dirigez avec intégrité" },
      7: { en: "Plan strategically", fr: "Planifiez stratégiquement" },
      8: { en: "Manifest abundance", fr: "Manifestez l'abondance" },
      9: { en: "Complete major projects", fr: "Complétez les projets majeurs" }
    },
    actionSteps: {
      en: [
        "Set ambitious financial goals",
        "Invest in yourself or business",
        "Step into leadership",
        "Negotiate for what you deserve",
        "Take calculated risks"
      ],
      fr: [
        "Fixez des objectifs financiers ambitieux",
        "Investissez en vous ou votre entreprise",
        "Assumez le leadership",
        "Négociez ce que vous méritez",
        "Prenez des risques calculés"
      ]
    }
  },
  9: {
    theme: {
      en: "Completion & Humanitarianism",
      fr: "Achèvement et Humanitarisme"
    },
    description: {
      en: "This year brings endings, release, and compassion for all. Let go of what's complete and serve the world.",
      fr: "Cette année apporte des fins, la libération et la compassion pour tous. Lâchez prise sur ce qui est complet et servez le monde."
    },
    focusAreas: {
      en: ["Completion", "Release", "Compassion", "Service", "Forgiveness"],
      fr: ["Achèvement", "Libération", "Compassion", "Service", "Pardon"]
    },
    monthlyThemes: {
      1: { en: "Begin completing cycles", fr: "Commencez à compléter les cycles" },
      2: { en: "Release relationships gently", fr: "Libérez les relations doucement" },
      3: { en: "Express forgiveness", fr: "Exprimez le pardon" },
      4: { en: "Dismantle old structures", fr: "Démanteler les anciennes structures" },
      5: { en: "Let go freely", fr: "Lâchez prise librement" },
      6: { en: "Serve humanity", fr: "Servez l'humanité" },
      7: { en: "Understand endings", fr: "Comprenez les fins" },
      8: { en: "Release attachment", fr: "Libérez l'attachement" },
      9: { en: "Complete and prepare for new", fr: "Complétez et préparez le nouveau" }
    },
    actionSteps: {
      en: [
        "Forgive and let go",
        "Donate or declutter",
        "Serve a cause greater than yourself",
        "Complete unfinished projects",
        "Prepare for a new 9-year cycle"
      ],
      fr: [
        "Pardonnez et lâchez prise",
        "Donnez ou désencombrez",
        "Servez une cause plus grande que vous",
        "Complétez les projets inachevés",
        "Préparez-vous pour un nouveau cycle de 9 ans"
      ]
    }
  }
};

export function getPersonalYearGuidance(personalYearNumber: number, lang: 'en' | 'fr' = 'en') {
  const data = PERSONAL_YEAR_GUIDANCE[personalYearNumber];
  if (!data) return null;
  
  return {
    theme: data.theme[lang],
    description: data.description[lang],
    focusAreas: data.focusAreas[lang],
    monthlyThemes: Object.fromEntries(
      Object.entries(data.monthlyThemes).map(([month, theme]) => [
        month,
        theme[lang]
      ])
    ),
    actionSteps: data.actionSteps[lang]
  };
}

// ============================================================================
// PHASE 2: Karmic Debt Numbers
// ============================================================================

interface KarmicDebtData {
  debtNumber: number;
  reducesTo: number;
  pastLifePattern: { en: string; fr: string };
  thisLifeChallenge: { en: string; fr: string };
  lessonsToLearn: { en: string[]; fr: string[] };
  transformationPath: { en: string; fr: string };
  spiritualPractice: { en: string; fr: string };
  warningSign: { en: string; fr: string };
  masteryGift: { en: string; fr: string };
}

const KARMIC_DEBT_NUMBERS: Record<number, KarmicDebtData> = {
  13: {
    debtNumber: 13,
    reducesTo: 4,
    pastLifePattern: {
      en: `In past lives, you may have been lazy, avoided responsibility, or manipulated others to do your work. You took shortcuts and left projects incomplete.`,
      fr: `Dans les vies passées, vous avez peut-être été paresseux, évité les responsabilités ou manipulé les autres pour faire votre travail. Vous avez pris des raccourcis et laissé des projets inachevés.`
    },
    thisLifeChallenge: {
      en: `Nothing comes easy. You must work harder than others for the same results. Obstacles test your commitment. Laziness or negativity brings immediate consequences.`,
      fr: `Rien ne vient facilement. Vous devez travailler plus dur que les autres pour les mêmes résultats. Les obstacles testent votre engagement. La paresse ou la négativité apporte des conséquences immédiates.`
    },
    lessonsToLearn: {
      en: [
        "Develop unwavering discipline and work ethic",
        "Complete what you start, no matter how long it takes",
        "Take full responsibility without blaming others",
        "Transform obstacles into stepping stones",
        "Maintain optimism through challenges"
      ],
      fr: [
        "Développer une discipline et une éthique de travail inébranlables",
        "Terminer ce que vous commencez, peu importe le temps que cela prend",
        "Assumer l'entière responsabilité sans blâmer les autres",
        "Transformer les obstacles en tremplins",
        "Maintenir l'optimisme à travers les défis"
      ]
    },
    transformationPath: {
      en: `Once mastered, Karmic Debt 13/4 becomes the most resilient builder. Your struggles become your strength. You inspire others by showing that persistence conquers all.`,
      fr: `Une fois maîtrisé, la Dette Karmique 13/4 devient le bâtisseur le plus résilient. Vos luttes deviennent votre force. Vous inspirez les autres en montrant que la persévérance conquiert tout.`
    },
    spiritualPractice: {
      en: `Perform Salat al-Tahajjud (night prayer) regularly. The discipline of waking before dawn mirrors your karmic lesson of self-mastery through consistent effort.`,
      fr: `Effectuez Salat al-Tahajjud (prière de nuit) régulièrement. La discipline de se réveiller avant l'aube reflète votre leçon karmique de maîtrise de soi par l'effort constant.`
    },
    warningSign: {
      en: `When you feel like giving up or cutting corners, remember: this is your karmic test. Push through with integrity.`,
      fr: `Quand vous avez envie d'abandonner ou de prendre des raccourcis, rappelez-vous: c'est votre test karmique. Persévérez avec intégrité.`
    },
    masteryGift: {
      en: `Unshakeable foundation-building. You become the person others turn to when the going gets tough because you've mastered endurance.`,
      fr: `Construction de fondations inébranlables. Vous devenez la personne vers qui les autres se tournent quand les choses deviennent difficiles parce que vous avez maîtrisé l'endurance.`
    }
  },
  14: {
    debtNumber: 14,
    reducesTo: 5,
    pastLifePattern: {
      en: `In previous incarnations, you abused freedom and indulged excessively in physical pleasures, substances, or reckless behavior. You harmed your body and disrespected sacred boundaries.`,
      fr: `Dans les incarnations précédentes, vous avez abusé de la liberté et vous êtes livré excessivement aux plaisirs physiques, aux substances ou au comportement imprudent. Vous avez nui à votre corps et manqué de respect aux limites sacrées.`
    },
    thisLifeChallenge: {
      en: `You're prone to addiction, restlessness, and self-destructive patterns. Freedom becomes chaos without discipline. Your body is more sensitive to toxins and imbalance.`,
      fr: `Vous êtes sujet à la dépendance, à l'agitation et aux schémas autodestructeurs. La liberté devient chaos sans discipline. Votre corps est plus sensible aux toxines et au déséquilibre.`
    },
    lessonsToLearn: {
      en: [
        "Practice moderation in all things",
        "Respect your body as a sacred trust (amanah)",
        "Channel restlessness into constructive exploration",
        "Distinguish true freedom from mere escape",
        "Commit to one path long enough to see results"
      ],
      fr: [
        "Pratiquer la modération en toutes choses",
        "Respecter votre corps comme une confiance sacrée (amanah)",
        "Canaliser l'agitation vers l'exploration constructive",
        "Distinguer la vraie liberté du simple échappatoire",
        "S'engager sur un chemin assez longtemps pour voir les résultats"
      ]
    },
    transformationPath: {
      en: `Mastered 14/5 becomes the adaptable adventurer who finds freedom through discipline. You teach others that true liberation comes from self-control, not indulgence.`,
      fr: `Le 14/5 maîtrisé devient l'aventurier adaptable qui trouve la liberté par la discipline. Vous enseignez aux autres que la vraie libération vient de la maîtrise de soi, pas de l'indulgence.`
    },
    spiritualPractice: {
      en: `Fast regularly (not just Ramadan) to train your body in discipline. Practice mindful eating and make dua before consuming anything, honoring the body as Allah's trust.`,
      fr: `Jeûnez régulièrement (pas seulement Ramadan) pour entraîner votre corps à la discipline. Pratiquez l'alimentation consciente et faites des dua avant de consommer quoi que ce soit, honorant le corps comme la confiance d'Allah.`
    },
    warningSign: {
      en: `Notice when "just one more" becomes a pattern. Any time you justify excess, pause and reconnect with balance.`,
      fr: `Remarquez quand "juste un de plus" devient un modèle. Chaque fois que vous justifiez l'excès, faites une pause et reconnectez-vous avec l'équilibre.`
    },
    masteryGift: {
      en: `Conscious freedom. You show others how to experience life fully without losing themselves, becoming a guide for healthy exploration.`,
      fr: `Liberté consciente. Vous montrez aux autres comment vivre pleinement sans se perdre, devenant un guide pour l'exploration saine.`
    }
  },
  16: {
    debtNumber: 16,
    reducesTo: 7,
    pastLifePattern: {
      en: `In past lives, you may have abused spiritual knowledge, engaged in illicit relationships, or misused intimacy and trust. Pride and ego led to your downfall from a position of power.`,
      fr: `Dans les vies passées, vous avez peut-être abusé de la connaissance spirituelle, vous êtes engagé dans des relations illicites ou avez mal utilisé l'intimité et la confiance. L'orgueil et l'ego ont conduit à votre chute d'une position de pouvoir.`
    },
    thisLifeChallenge: {
      en: `Sudden, unexpected upheavals shatter your illusions. Just when you feel secure, life humbles you. Relationships may involve betrayal or karmic patterns. Your ego must be broken to rebuild on truth.`,
      fr: `Des bouleversements soudains et inattendus brisent vos illusions. Juste quand vous vous sentez en sécurité, la vie vous humilie. Les relations peuvent impliquer la trahison ou des schémas karmiques. Votre ego doit être brisé pour reconstruire sur la vérité.`
    },
    lessonsToLearn: {
      en: [
        "Surrender ego and embrace humility",
        "Welcome sudden changes as spiritual purification",
        "Rebuild on authentic truth, not illusion",
        "Honor sacred boundaries in relationships",
        "Transform pride into divine devotion"
      ],
      fr: [
        "Abandonner l'ego et embrasser l'humilité",
        "Accueillir les changements soudains comme purification spirituelle",
        "Reconstruire sur la vérité authentique, pas l'illusion",
        "Honorer les limites sacrées dans les relations",
        "Transformer l'orgueil en dévotion divine"
      ]
    },
    transformationPath: {
      en: `Mastered 16/7 becomes the enlightened mystic. Your breakdowns become breakthroughs. You gain profound spiritual wisdom through surrender and emerge as a humble spiritual teacher.`,
      fr: `Le 16/7 maîtrisé devient le mystique éclairé. Vos effondrements deviennent des percées. Vous gagnez une profonde sagesse spirituelle par l'abandon et émergez comme un humble enseignant spirituel.`
    },
    spiritualPractice: {
      en: `Perform sujud (prostration) outside of prayer as an act of surrender. Recite "La hawla wa la quwwata illa billah" (There is no power except with Allah) to dissolve ego.`,
      fr: `Effectuez sujud (prosternation) en dehors de la prière comme acte d'abandon. Récitez "La hawla wa la quwwata illa billah" (Il n'y a de pouvoir qu'avec Allah) pour dissoudre l'ego.`
    },
    warningSign: {
      en: `When you feel "too comfortable" or your ego inflates, expect a humbling lesson. Stay grounded in spiritual practice before the tower falls.`,
      fr: `Quand vous vous sentez "trop à l'aise" ou que votre ego gonfle, attendez-vous à une leçon d'humilité. Restez ancré dans la pratique spirituelle avant que la tour ne s'effondre.`
    },
    masteryGift: {
      en: `Divine humility and spiritual depth. You become unshakeable because you've learned that ego is the only thing that can be destroyed, and your true self is eternal.`,
      fr: `Humilité divine et profondeur spirituelle. Vous devenez inébranlable parce que vous avez appris que l'ego est la seule chose qui peut être détruite, et votre vrai soi est éternel.`
    }
  },
  19: {
    debtNumber: 19,
    reducesTo: 1,
    pastLifePattern: {
      en: `In previous lives, you abused power and position. You were likely a tyrant, dictator, or selfish leader who manipulated others for personal gain and showed no compassion for those beneath you.`,
      fr: `Dans les vies précédentes, vous avez abusé du pouvoir et de la position. Vous étiez probablement un tyran, un dictateur ou un leader égoïste qui a manipulé les autres pour un gain personnel et n'a montré aucune compassion pour ceux en dessous de vous.`
    },
    thisLifeChallenge: {
      en: `You resist asking for or accepting help from others. Deep fear of being controlled or dependent. You must learn to lead while also being vulnerable and receiving support.`,
      fr: `Vous résistez à demander ou accepter l'aide des autres. Peur profonde d'être contrôlé ou dépendant. Vous devez apprendre à diriger tout en étant vulnérable et en recevant du soutien.`
    },
    lessonsToLearn: {
      en: [
        "Balance independence with healthy interdependence",
        "Lead with compassion, not dominance",
        "Ask for help without feeling weak",
        "Give others credit and share power",
        "Serve others while honoring your own needs"
      ],
      fr: [
        "Équilibrer l'indépendance avec une interdépendance saine",
        "Diriger avec compassion, pas domination",
        "Demander de l'aide sans se sentir faible",
        "Donner du crédit aux autres et partager le pouvoir",
        "Servir les autres tout en honorant vos propres besoins"
      ]
    },
    transformationPath: {
      en: `Mastered 19/1 becomes the compassionate pioneer. You lead by empowering others, not controlling them. Your strength inspires while your vulnerability connects.`,
      fr: `Le 19/1 maîtrisé devient le pionnier compatissant. Vous dirigez en autonomisant les autres, pas en les contrôlant. Votre force inspire tandis que votre vulnérabilité connecte.`
    },
    spiritualPractice: {
      en: `Practice servant leadership. Volunteer to serve in your community, washing dishes at the mosque or helping elders, to dissolve the ego of superiority.`,
      fr: `Pratiquez le leadership serviteur. Faites du bénévolat pour servir dans votre communauté, laver la vaisselle à la mosquée ou aider les aînés, pour dissoudre l'ego de supériorité.`
    },
    warningSign: {
      en: `When you refuse help or feel superior to others, recognize this as your karmic pattern resurfacing. Consciously choose humility and connection.`,
      fr: `Quand vous refusez l'aide ou vous sentez supérieur aux autres, reconnaissez cela comme votre modèle karmique qui refait surface. Choisissez consciemment l'humilité et la connexion.`
    },
    masteryGift: {
      en: `Empowered leadership through service. You become a leader who lifts others up, understanding that true power comes from empowering, not dominating.`,
      fr: `Leadership autonomisant par le service. Vous devenez un leader qui élève les autres, comprenant que le vrai pouvoir vient de l'autonomisation, pas de la domination.`
    }
  }
};

export function getKarmicDebtData(debtNumber: number, lang: 'en' | 'fr' = 'en') {
  const data = KARMIC_DEBT_NUMBERS[debtNumber];
  if (!data) return null;
  
  return {
    debtNumber: data.debtNumber,
    reducesTo: data.reducesTo,
    pastLifePattern: data.pastLifePattern[lang],
    thisLifeChallenge: data.thisLifeChallenge[lang],
    lessonsToLearn: data.lessonsToLearn[lang],
    transformationPath: data.transformationPath[lang],
    spiritualPractice: data.spiritualPractice[lang],
    warningSign: data.warningSign[lang],
    masteryGift: data.masteryGift[lang]
  };
}

// Helper function to detect if a number has karmic debt
export function hasKarmicDebt(day: number, month: number, year: number): number | null {
  // Check if birth day is a karmic debt number
  if ([13, 14, 16, 19].includes(day)) return day;
  
  // Check each component for karmic debt patterns
  const dayReduced = day > 9 ? String(day).split('').reduce((sum, digit) => sum + parseInt(digit), 0) : day;
  const monthReduced = month > 9 ? String(month).split('').reduce((sum, digit) => sum + parseInt(digit), 0) : month;
  const yearReduced = String(year).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  
  // Check if any stage shows karmic debt
  if ([13, 14, 16, 19].includes(dayReduced)) return dayReduced;
  if ([13, 14, 16, 19].includes(monthReduced)) return monthReduced;
  if ([13, 14, 16, 19].includes(yearReduced)) return yearReduced;
  
  return null;
}

// ============================================================================
// PHASE 2: Life Path Compatibility Matrix
// ============================================================================

type CompatibilityLevel = 'harmonious' | 'challenging' | 'neutral' | 'soulmate' | 'karmic';

interface CompatibilityData {
  level: CompatibilityLevel;
  summary: { en: string; fr: string };
  strengths: { en: string[]; fr: string[] };
  challenges: { en: string[]; fr: string[] };
  advice: { en: string; fr: string };
}

// Compatibility matrix - organized by Life Path number pairs
const LIFE_PATH_COMPATIBILITY: Record<string, CompatibilityData> = {
  // Life Path 1 Compatibilities
  "1-1": {
    level: 'challenging',
    summary: {
      en: "Two strong leaders can clash or inspire each other to greatness.",
      fr: "Deux leaders forts peuvent s'affronter ou s'inspirer mutuellement vers la grandeur."
    },
    strengths: {
      en: ["Mutual respect for independence", "Both driven and ambitious", "Understand need for autonomy"],
      fr: ["Respect mutuel pour l'indépendance", "Tous deux motivés et ambitieux", "Comprennent le besoin d'autonomie"]
    },
    challenges: {
      en: ["Power struggles", "Both want to lead", "Ego clashes"],
      fr: ["Luttes de pouvoir", "Tous deux veulent diriger", "Chocs d'ego"]
    },
    advice: {
      en: "Take turns leading. Collaborate on shared projects where each has their domain of authority.",
      fr: "Alternez pour diriger. Collaborez sur des projets partagés où chacun a son domaine d'autorité."
    }
  },
  "1-2": {
    level: 'harmonious',
    summary: {
      en: "Leader meets diplomat. A natural balance of yin and yang energy.",
      fr: "Le leader rencontre le diplomate. Un équilibre naturel d'énergie yin et yang."
    },
    strengths: {
      en: ["1 leads, 2 supports gracefully", "Complementary strengths", "2 softens 1's edges"],
      fr: ["1 dirige, 2 soutient gracieusement", "Forces complémentaires", "2 adoucit les angles de 1"]
    },
    challenges: {
      en: ["1 may dominate", "2 may feel overshadowed", "1 can be insensitive to 2's needs"],
      fr: ["1 peut dominer", "2 peut se sentir éclipsé", "1 peut être insensible aux besoins de 2"]
    },
    advice: {
      en: "1: Value 2's input and emotional intelligence. 2: Speak up for your needs clearly.",
      fr: "1: Valorisez l'apport et l'intelligence émotionnelle de 2. 2: Exprimez clairement vos besoins."
    }
  },
  "1-3": {
    level: 'harmonious',
    summary: {
      en: "Dynamic duo! 1's drive meets 3's creativity for exciting partnerships.",
      fr: "Duo dynamique! La motivation de 1 rencontre la créativité de 3 pour des partenariats passionnants."
    },
    strengths: {
      en: ["High energy together", "3 brings joy to 1's ambitions", "Great for creative projects"],
      fr: ["Haute énergie ensemble", "3 apporte de la joie aux ambitions de 1", "Excellent pour les projets créatifs"]
    },
    challenges: {
      en: ["3 can be scattered", "1 may find 3 unfocused", "Different work styles"],
      fr: ["3 peut être dispersé", "1 peut trouver 3 peu concentré", "Styles de travail différents"]
    },
    advice: {
      en: "1: Let 3 bring playfulness to your goals. 3: Match 1's focus when it matters.",
      fr: "1: Laissez 3 apporter de la légèreté à vos objectifs. 3: Égalez la concentration de 1 quand c'est important."
    }
  },
  "1-5": {
    level: 'harmonious',
    summary: {
      en: "Adventure partners! Both love freedom and new experiences.",
      fr: "Partenaires d'aventure! Tous deux aiment la liberté et les nouvelles expériences."
    },
    strengths: {
      en: ["Mutual respect for independence", "Exciting and dynamic", "Support each other's growth"],
      fr: ["Respect mutuel de l'indépendance", "Excitant et dynamique", "Soutiennent la croissance de l'autre"]
    },
    challenges: {
      en: ["Both avoid routine", "Can lack stability", "May grow apart"],
      fr: ["Tous deux évitent la routine", "Peut manquer de stabilité", "Peuvent s'éloigner"]
    },
    advice: {
      en: "Create shared adventures while maintaining individual pursuits. Schedule quality time.",
      fr: "Créez des aventures partagées tout en maintenant des poursuites individuelles. Planifiez du temps de qualité."
    }
  },
  "1-9": {
    level: 'challenging',
    summary: {
      en: "Beginning meets ending. 1's self-focus clashes with 9's universal love.",
      fr: "Le début rencontre la fin. L'auto-concentration de 1 s'oppose à l'amour universel de 9."
    },
    strengths: {
      en: ["9's wisdom guides 1's ambition", "Both are leaders", "Can inspire humanitarian projects"],
      fr: ["La sagesse de 9 guide l'ambition de 1", "Tous deux sont des leaders", "Peuvent inspirer des projets humanitaires"]
    },
    challenges: {
      en: ["1 is self-focused, 9 is universal", "Different priorities", "9 may find 1 selfish"],
      fr: ["1 est centré sur soi, 9 est universel", "Priorités différentes", "9 peut trouver 1 égoïste"]
    },
    advice: {
      en: "1: Expand your vision to include service. 9: Allow 1 space for personal ambitions.",
      fr: "1: Élargissez votre vision pour inclure le service. 9: Accordez à 1 de l'espace pour ses ambitions personnelles."
    }
  },
  "2-2": {
    level: 'harmonious',
    summary: {
      en: "Gentle, supportive partnership built on emotional understanding.",
      fr: "Partenariat doux et solidaire construit sur la compréhension émotionnelle."
    },
    strengths: {
      en: ["Deep emotional connection", "Mutual sensitivity", "Peaceful harmony"],
      fr: ["Connexion émotionnelle profonde", "Sensibilité mutuelle", "Harmonie paisible"]
    },
    challenges: {
      en: ["Both avoid conflict", "Lack of direction", "May be too passive"],
      fr: ["Tous deux évitent le conflit", "Manque de direction", "Peuvent être trop passifs"]
    },
    advice: {
      en: "Take turns being the initiator. Practice healthy conflict resolution together.",
      fr: "Alternez pour être l'initiateur. Pratiquez ensemble la résolution saine des conflits."
    }
  },
  "2-8": {
    level: 'soulmate',
    summary: {
      en: "Divine balance of material and emotional. Power couple potential!",
      fr: "Équilibre divin du matériel et de l'émotionnel. Potentiel de couple puissant!"
    },
    strengths: {
      en: ["2 supports 8's ambitions", "8 provides security for 2", "Yin-yang perfection"],
      fr: ["2 soutient les ambitions de 8", "8 fournit la sécurité pour 2", "Perfection yin-yang"]
    },
    challenges: {
      en: ["8 can be domineering", "2 may feel controlled", "Work-life balance needed"],
      fr: ["8 peut être autoritaire", "2 peut se sentir contrôlé", "Équilibre travail-vie nécessaire"]
    },
    advice: {
      en: "8: Honor 2's emotional needs. 2: Trust 8's leadership without losing yourself.",
      fr: "8: Honorez les besoins émotionnels de 2. 2: Faites confiance au leadership de 8 sans vous perdre."
    }
  },
  "3-3": {
    level: 'harmonious',
    summary: {
      en: "Creative explosion! Life is a joyful party with these two.",
      fr: "Explosion créative! La vie est une fête joyeuse avec ces deux-là."
    },
    strengths: {
      en: ["Endless fun and laughter", "Shared creative vision", "Social butterflies together"],
      fr: ["Amusement et rires sans fin", "Vision créative partagée", "Papillons sociaux ensemble"]
    },
    challenges: {
      en: ["Lack of discipline", "Financial irresponsibility", "Too scattered"],
      fr: ["Manque de discipline", "Irresponsabilité financière", "Trop dispersés"]
    },
    advice: {
      en: "Hire a 4 or 8 to handle practical matters. Schedule 'responsibility time' together.",
      fr: "Engagez un 4 ou 8 pour gérer les questions pratiques. Planifiez ensemble du 'temps de responsabilité'."
    }
  },
  "4-4": {
    level: 'neutral',
    summary: {
      en: "Solid, stable, predictable. Security-focused partnership.",
      fr: "Solide, stable, prévisible. Partenariat axé sur la sécurité."
    },
    strengths: {
      en: ["Ultimate stability", "Shared values", "Build empire together"],
      fr: ["Stabilité ultime", "Valeurs partagées", "Construisent un empire ensemble"]
    },
    challenges: {
      en: ["Too much routine", "Lack of spontaneity", "Resistance to change"],
      fr: ["Trop de routine", "Manque de spontanéité", "Résistance au changement"]
    },
    advice: {
      en: "Schedule fun and adventure. Push each other out of comfort zones occasionally.",
      fr: "Planifiez du plaisir et de l'aventure. Poussez-vous mutuellement hors des zones de confort occasionnellement."
    }
  },
  "5-5": {
    level: 'challenging',
    summary: {
      en: "Wild adventure! Exciting but potentially unstable.",
      fr: "Aventure sauvage! Excitant mais potentiellement instable."
    },
    strengths: {
      en: ["Never boring", "Freedom to explore", "Adventurous spirit"],
      fr: ["Jamais ennuyeux", "Liberté d'explorer", "Esprit aventureux"]
    },
    challenges: {
      en: ["No stability", "Commitment issues", "Financial chaos"],
      fr: ["Pas de stabilité", "Problèmes d'engagement", "Chaos financier"]
    },
    advice: {
      en: "Create grounding rituals. Have one stable anchor (home, routine) while exploring freely.",
      fr: "Créez des rituels d'ancrage. Ayez une ancre stable (maison, routine) tout en explorant librement."
    }
  },
  "6-6": {
    level: 'harmonious',
    summary: {
      en: "Nurturing paradise. Home and family are the center of everything.",
      fr: "Paradis nourricier. La maison et la famille sont le centre de tout."
    },
    strengths: {
      en: ["Beautiful home life", "Shared values of service", "Emotionally supportive"],
      fr: ["Belle vie de famille", "Valeurs partagées de service", "Soutien émotionnel"]
    },
    challenges: {
      en: ["Martyrdom tendency", "Neglect personal growth", "Codependency risk"],
      fr: ["Tendance au martyre", "Négligence de la croissance personnelle", "Risque de codépendance"]
    },
    advice: {
      en: "Serve others but also nurture yourselves. Maintain individual identities and hobbies.",
      fr: "Servez les autres mais nourrissez-vous aussi. Maintenez des identités et des loisirs individuels."
    }
  },
  "7-7": {
    level: 'neutral',
    summary: {
      en: "Deep spiritual connection but may lack warmth. Intellectual soulmates.",
      fr: "Connexion spirituelle profonde mais peut manquer de chaleur. Âmes sœurs intellectuelles."
    },
    strengths: {
      en: ["Profound understanding", "Respect for solitude", "Spiritual depth"],
      fr: ["Compréhension profonde", "Respect de la solitude", "Profondeur spirituelle"]
    },
    challenges: {
      en: ["Emotional distance", "Too much alone time", "Isolation from world"],
      fr: ["Distance émotionnelle", "Trop de temps seul", "Isolement du monde"]
    },
    advice: {
      en: "Schedule quality connection time. Balance spiritual pursuits with emotional intimacy.",
      fr: "Planifiez du temps de connexion de qualité. Équilibrez les poursuites spirituelles avec l'intimité émotionnelle."
    }
  },
  "8-8": {
    level: 'challenging',
    summary: {
      en: "Power couple or power struggle. Both want control and success.",
      fr: "Couple puissant ou lutte de pouvoir. Tous deux veulent le contrôle et le succès."
    },
    strengths: {
      en: ["Material abundance", "Shared ambition", "Respect for success"],
      fr: ["Abondance matérielle", "Ambition partagée", "Respect du succès"]
    },
    challenges: {
      en: ["Competition", "Workaholism", "Neglect emotional/spiritual"],
      fr: ["Compétition", "Travail excessif", "Négligence émotionnelle/spirituelle"]
    },
    advice: {
      en: "Collaborate, don't compete. Remember success means nothing without love and spirituality.",
      fr: "Collaborez, ne rivalisez pas. Rappelez-vous que le succès ne signifie rien sans amour et spiritualité."
    }
  },
  "9-9": {
    level: 'harmonious',
    summary: {
      en: "Compassionate healers united in service. Beautiful but can burn out.",
      fr: "Guérisseurs compassionnés unis dans le service. Beau mais peut mener à l'épuisement."
    },
    strengths: {
      en: ["Shared humanitarian vision", "Deep compassion", "Spiritual unity"],
      fr: ["Vision humanitaire partagée", "Compassion profonde", "Unité spirituelle"]
    },
    challenges: {
      en: ["Giving until empty", "Drama and intensity", "Neglecting practical needs"],
      fr: ["Donner jusqu'à l'épuisement", "Drame et intensité", "Négligence des besoins pratiques"]
    },
    advice: {
      en: "Set boundaries. Serve the world but also honor your personal needs and rest.",
      fr: "Définissez des limites. Servez le monde mais honorez aussi vos besoins personnels et reposez-vous."
    }
  },
  "11-11": {
    level: 'soulmate',
    summary: {
      en: "Divine spiritual connection. Twin flames with shared mission.",
      fr: "Connexion spirituelle divine. Flammes jumelles avec mission partagée."
    },
    strengths: {
      en: ["Spiritual telepathy", "Inspire each other", "Shared higher purpose"],
      fr: ["Télépathie spirituelle", "S'inspirent mutuellement", "But supérieur partagé"]
    },
    challenges: {
      en: ["Intensity overload", "Anxiety amplified", "Grounding needed"],
      fr: ["Surcharge d'intensité", "Anxiété amplifiée", "Ancrage nécessaire"]
    },
    advice: {
      en: "Ground together daily. Balance spiritual highs with earthly practices.",
      fr: "Ancrez-vous ensemble quotidiennement. Équilibrez les hauts spirituels avec des pratiques terrestres."
    }
  },
  "22-22": {
    level: 'harmonious',
    summary: {
      en: "Master builders creating legacy together. Practical visionaries.",
      fr: "Maîtres bâtisseurs créant un héritage ensemble. Visionnaires pratiques."
    },
    strengths: {
      en: ["Build empires", "Shared grand vision", "Practical manifestation"],
      fr: ["Construisent des empires", "Vision grandiose partagée", "Manifestation pratique"]
    },
    challenges: {
      en: ["Pressure to achieve", "Stress and burden", "Forget to enjoy life"],
      fr: ["Pression pour réussir", "Stress et fardeau", "Oublient de profiter de la vie"]
    },
    advice: {
      en: "Remember: the journey matters, not just the destination. Celebrate small wins together.",
      fr: "Rappelez-vous: le voyage compte, pas seulement la destination. Célébrez ensemble les petites victoires."
    }
  },
  "33-33": {
    level: 'karmic',
    summary: {
      en: "Ultimate spiritual teachers and healers. Heavy karmic responsibility.",
      fr: "Enseignants spirituels et guérisseurs ultimes. Lourde responsabilité karmique."
    },
    strengths: {
      en: ["Unconditional love", "Transformative healing", "World service"],
      fr: ["Amour inconditionnel", "Guérison transformatrice", "Service mondial"]
    },
    challenges: {
      en: ["Martyr complex", "Overwhelming responsibility", "Self-sacrifice to detriment"],
      fr: ["Complexe de martyr", "Responsabilité écrasante", "Auto-sacrifice au détriment"]
    },
    advice: {
      en: "You can't save everyone. Practice radical self-care to sustain your healing work.",
      fr: "Vous ne pouvez pas sauver tout le monde. Pratiquez un soin de soi radical pour maintenir votre travail de guérison."
    }
  }
};

export function getCompatibility(lifePathNumber1: number, lifePathNumber2: number, lang: 'en' | 'fr' = 'en') {
  // Create a consistent key regardless of order
  const key1 = `${lifePathNumber1}-${lifePathNumber2}`;
  const key2 = `${lifePathNumber2}-${lifePathNumber1}`;
  
  const data = LIFE_PATH_COMPATIBILITY[key1] || LIFE_PATH_COMPATIBILITY[key2];
  
  if (!data) {
    // Return neutral compatibility if not specifically defined
    return {
      level: 'neutral' as CompatibilityLevel,
      summary: lang === 'en' ? 
        "This combination has potential with effort and understanding." :
        "Cette combinaison a du potentiel avec effort et compréhension.",
      strengths: lang === 'en' ? 
        ["Can learn from differences", "Growth through challenge"] :
        ["Peuvent apprendre des différences", "Croissance par le défi"],
      challenges: lang === 'en' ?
        ["Different approaches to life", "Requires compromise"] :
        ["Approches différentes de la vie", "Nécessite des compromis"],
      advice: lang === 'en' ?
        "Focus on communication and finding common ground." :
        "Concentrez-vous sur la communication et trouvez un terrain d'entente."
    };
  }
  
  return {
    level: data.level,
    summary: data.summary[lang],
    strengths: data.strengths[lang],
    challenges: data.challenges[lang],
    advice: data.advice[lang]
  };
}

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
