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

export function calculateDestinyNumber(
  givenName: string,
  fatherName?: string,
  motherName?: string
): number {
  let fullName = givenName;
  if (fatherName) fullName += ' ' + fatherName;
  if (motherName) fullName += ' ' + motherName;
  
  const total = calculateAbjadTotal(fullName);
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
  // Core Numbers
  lifePathNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  destinyNumber: number;
  
  // Timing
  personalYear: number;
  personalMonth: number;
  
  // Cycle Info
  cycle: LifeCycleAnalysis;
  
  // Special Numbers
  karmicDebts: number[];
  sacredNumbers: number[];
  
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
    lifePathNumber: calculateLifePathNumber(arabicName),
    soulUrgeNumber: calculateSoulUrgeNumber(arabicName),
    personalityNumber: calculatePersonalityNumber(arabicName),
    destinyNumber: calculateDestinyNumber(arabicName, fatherName, motherName),
    personalYear: calculatePersonalYear(birthDate),
    personalMonth: calculatePersonalMonth(birthDate),
    cycle: calculateLifeCycle(birthDate, currentDate),
    karmicDebts: detectKarmicDebts(arabicName, birthDate),
    sacredNumbers: detectSacredNumbers(arabicName),
    pinnaclesAndChallenges: calculatePinnaclesAndChallenges(birthDate, age)
  };
}
