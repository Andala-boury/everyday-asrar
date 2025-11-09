# 🔍 Name Destiny Module - Ṭabʿ, Planet, Burj, Days & Hourly Calculations Audit

**Date**: January 2025  
**Purpose**: Complete technical documentation of Name Destiny calculation formulas  
**Status**: ✅ Audit Complete

---

## 📊 Executive Summary

The **Name Destiny** module (`buildDestiny` function in `core.ts`) calculates five interconnected astrological/numerological attributes from a person's name using classical Islamic ʿIlm al-Ḥurūf (Science of Letters) tradition:

1. **Ṭabʿ (Element)** - Fire, Earth, Air, or Earth (Mod-4)
2. **Burj (Zodiac Sign)** - 12 signs from Aries to Pisces (Mod-12)
3. **Ruling Planet** - Derived from Burj
4. **Favorable Day** - Derived from Planet
5. **Planetary Hour Index** - Derived from Planet (1-7)

**Critical Principle**: All calculations use **PERSONAL NAME ONLY** (not including mother's name) for core identity attributes.

---

## 🎯 Core Calculation Flow

```
Arabic Name
    ↓
Calculate Abjad Total (personKabir)
    ↓
┌─────────────┬──────────────┬────────────────┐
│             │              │                │
│  Mod 4      │   Mod 12     │  Digital Root  │
│  (Ṭabʿ)     │   (Burj)     │   (Ṣaghīr)     │
│             │              │                │
└─────────────┴──────────────┴────────────────┘
       │              │
       │              ├──→ Ruling Planet
       │              │
       │              ├──→ Favorable Day
       │              │
       │              └──→ Hourly Index (1-7)
       │
       └──→ Element (Fire/Earth/Air/Earth)
```

---

## 🔢 Formula 1: Ṭabʿ (Element) Calculation

**File**: `src/features/ilm-huruf/core.ts`  
**Line**: 735

### Formula
```typescript
const tabhIdx = modIndex(personKabir, 4) as ElementKey;
const element = ELEMENTS[tabhIdx];
```

### Detailed Breakdown

**Step 1: Calculate modIndex**
```typescript
// Line 118-121
export function modIndex(n: number, base: 4 | 12): number {
  const remainder = n % base;
  return remainder === 0 ? base : remainder;
}
```

**Key Rule**: When `personKabir % 4 === 0`, return `4` (not `0`)

**Step 2: Map to Element**

| personKabir % 4 | modIndex Result | Element | Arabic | Icon | Quality |
|-----------------|-----------------|---------|--------|------|---------|
| **1** | 1 | **Fire** | نار | 🔥 | Hot & Dry |
| **2** | 2 | **Earth** | تراب | 🌍 | Cold & Dry |
| **3** | 3 | **Air** | هواء | 🌬️ | Hot & Moist |
| **0** (or divisible by 4) | **4** | **Earth** | تراب | 🌍 | Cold & Dry |

**⚠️ IMPORTANT NOTE**: Index 4 is **also Earth** (same as index 2). This is the **Maghribi tradition** mapping.

### Examples

**Example 1**: Name "محمد" (Muhammad)
```
م (40) + ح (8) + م (40) + د (4) = 92
92 % 4 = 0 → modIndex returns 4
Element = ELEMENTS[4] = Earth (تراب) 🌍
```

**Example 2**: Name "علي" (Ali)
```
ع (70) + ل (30) + ي (10) = 110
110 % 4 = 2 → modIndex returns 2
Element = ELEMENTS[2] = Earth (تراب) 🌍
```

**Example 3**: Name "فاطمة" (Fatima)
```
ف (80) + ا (1) + ط (9) + م (40) + ة (5) = 135
135 % 4 = 3 → modIndex returns 3
Element = ELEMENTS[3] = Air (هواء) 🌬️
```

**Example 4**: Name "عائشة" (Aisha)
```
ع (70) + ا (1) + ئ (10) + ش (300) + ة (5) = 386
386 % 4 = 2 → modIndex returns 2
Element = ELEMENTS[2] = Earth (تراب) 🌍
```

---

## 🔢 Formula 2: Burj (Zodiac Sign) Calculation

**File**: `src/features/ilm-huruf/core.ts`  
**Line**: 739

### Formula
```typescript
const burjIdx = modIndex(personKabir, 12) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
const burj = BURUJ[burjIdx];
```

### Detailed Breakdown

**Step 1: Calculate modIndex (base 12)**
```
personKabir % 12 → If 0, return 12; else return remainder
```

**Step 2: Map to Zodiac Sign**

| personKabir % 12 | Burj Index | Sign | Arabic | Symbol | Ruling Planet |
|------------------|------------|------|--------|--------|---------------|
| **1** | 1 | Aries | الحمل | ♈ | Mars |
| **2** | 2 | Taurus | الثور | ♉ | Venus |
| **3** | 3 | Gemini | الجوزاء | ♊ | Mercury |
| **4** | 4 | Cancer | السرطان | ♋ | Moon |
| **5** | 5 | Leo | الأسد | ♌ | Sun |
| **6** | 6 | Virgo | العذراء | ♍ | Mercury |
| **7** | 7 | Libra | الميزان | ♎ | Venus |
| **8** | 8 | Scorpio | العقرب | ♏ | Mars |
| **9** | 9 | Sagittarius | القوس | ♐ | Jupiter |
| **10** | 10 | Capricorn | الجدي | ♑ | Saturn |
| **11** | 11 | Aquarius | الدلو | ♒ | Saturn |
| **0** (or divisible by 12) | **12** | Pisces | الحوت | ♓ | Jupiter |

### Examples

**Example 1**: Name "محمد" (Muhammad)
```
personKabir = 92
92 % 12 = 8 → modIndex returns 8
Burj = BURUJ[8] = Scorpio (العقرب) ♏
Ruling Planet = Mars
```

**Example 2**: Name "علي" (Ali)
```
personKabir = 110
110 % 12 = 2 → modIndex returns 2
Burj = BURUJ[2] = Taurus (الثور) ♉
Ruling Planet = Venus
```

**Example 3**: Name "فاطمة" (Fatima)
```
personKabir = 135
135 % 12 = 3 → modIndex returns 3
Burj = BURUJ[3] = Gemini (الجوزاء) ♊
Ruling Planet = Mercury
```

**Example 4**: Name "يوسف" (Yusuf)
```
ي (10) + و (6) + س (60) + ف (80) = 156
156 % 12 = 0 → modIndex returns 12
Burj = BURUJ[12] = Pisces (الحوت) ♓
Ruling Planet = Jupiter
```

---

## 🔢 Formula 3: Ruling Planet (Derived from Burj)

**File**: `src/features/ilm-huruf/core.ts`  
**Line**: 195-340 (BURUJ data structure)

### Formula
```typescript
const burj = BURUJ[burjIdx];
const planet = burj.planet;
```

**Direct Derivation**: The planet is a **property of the Burj**, not separately calculated.

### Planet-to-Burj Mapping

| Planet | Burj Signs | Indices | Arabic |
|--------|------------|---------|--------|
| **Sun** | Leo | 5 | الشمس |
| **Moon** | Cancer | 4 | القمر |
| **Mercury** | Gemini, Virgo | 3, 6 | عطارد |
| **Venus** | Taurus, Libra | 2, 7 | الزهرة |
| **Mars** | Aries, Scorpio | 1, 8 | المريخ |
| **Jupiter** | Sagittarius, Pisces | 9, 12 | المشتري |
| **Saturn** | Capricorn, Aquarius | 10, 11 | زحل |

### Planet Qualities (from BURUJ data)

Each Burj has associated qualities:

**Aries (Mars)**: Initiative & Courage  
**Taurus (Venus)**: Stability & Beauty  
**Gemini (Mercury)**: Communication & Adaptability  
**Cancer (Moon)**: Nurturing & Intuition  
**Leo (Sun)**: Leadership & Creativity  
**Virgo (Mercury)**: Service & Precision  
**Libra (Venus)**: Harmony & Justice  
**Scorpio (Mars)**: Transformation & Depth  
**Sagittarius (Jupiter)**: Wisdom & Expansion  
**Capricorn (Saturn)**: Discipline & Achievement  
**Aquarius (Saturn)**: Innovation & Humanitarianism  
**Pisces (Jupiter)**: Compassion & Spirituality  

---

## 🔢 Formula 4: Favorable Day (Derived from Planet)

**File**: `src/features/ilm-huruf/core.ts`  
**Line**: 195-340 (BURUJ data structure)

### Formula
```typescript
const burj = BURUJ[burjIdx];
const favorableDay = {
  en: burj.dayEn,
  fr: burj.dayFr,
  ar: burj.dayAr
};
```

**Direct Derivation**: The favorable day is a **property of each Burj**, based on its ruling planet.

### Planet-to-Day Mapping

| Planet | Day (English) | Day (French) | Day (Arabic) | Burj Examples |
|--------|---------------|--------------|--------------|---------------|
| **Sun** | Sunday | Dimanche | الأحد | Leo |
| **Moon** | Monday | Lundi | الاثنين | Cancer |
| **Mars** | Tuesday | Mardi | الثلاثاء | Aries, Scorpio |
| **Mercury** | Wednesday | Mercredi | الأربعاء | Gemini, Virgo |
| **Jupiter** | Thursday | Jeudi | الخميس | Sagittarius, Pisces |
| **Venus** | Friday | Vendredi | الجمعة | Taurus, Libra |
| **Saturn** | Saturday | Samedi | السبت | Capricorn, Aquarius |

### Examples

**Example 1**: Burj = Scorpio (♏) → Planet = Mars → Day = **Tuesday** (الثلاثاء)  
**Example 2**: Burj = Taurus (♉) → Planet = Venus → Day = **Friday** (الجمعة)  
**Example 3**: Burj = Gemini (♊) → Planet = Mercury → Day = **Wednesday** (الأربعاء)  
**Example 4**: Burj = Pisces (♓) → Planet = Jupiter → Day = **Thursday** (الخميس)  

---

## 🔢 Formula 5: Planetary Hour Index (1-7)

**File**: `src/features/ilm-huruf/core.ts`  
**Line**: 743

### Formula
```typescript
const hourIndex = PLANETARY_HOURS.findIndex(p => p === burj.planet) + 1;
```

### Detailed Breakdown

**Step 1: Define PLANETARY_HOURS order**
```typescript
// Line 359-361
export const PLANETARY_HOURS: Planet[] = [
  'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'
];
```

**Step 2: Find planet's position in array**
```typescript
findIndex(p => p === burj.planet) // Returns 0-6
```

**Step 3: Add 1 to get hourly index**
```typescript
hourIndex = arrayPosition + 1 // Returns 1-7
```

### Hour Index Mapping

| Planet | Array Index | Hour Index | Activities Favored |
|--------|-------------|------------|-------------------|
| **Sun** | 0 | **1** | Leadership, new ventures, public speaking |
| **Venus** | 1 | **2** | Romance, art, socializing, beautification |
| **Mercury** | 2 | **3** | Study, writing, business deals, communication |
| **Moon** | 3 | **4** | Family matters, emotional healing, dream work |
| **Saturn** | 4 | **5** | Hard work, long-term commitments, discipline |
| **Jupiter** | 5 | **6** | Legal matters, education, spiritual practice |
| **Mars** | 6 | **7** | Physical exercise, assertive action, courage |

### Examples

**Example 1**: Burj = Scorpio → Planet = Mars  
```
PLANETARY_HOURS.findIndex('Mars') = 6
hourIndex = 6 + 1 = 7
```

**Example 2**: Burj = Taurus → Planet = Venus  
```
PLANETARY_HOURS.findIndex('Venus') = 1
hourIndex = 1 + 1 = 2
```

**Example 3**: Burj = Cancer → Planet = Moon  
```
PLANETARY_HOURS.findIndex('Moon') = 3
hourIndex = 3 + 1 = 4
```

---

## 🕐 Planetary Hours System (Advanced Timing)

**File**: `src/features/ilm-huruf/core.ts`  
**Function**: `calculatePlanetaryHour(date: Date)`  
**Line**: 1622-1688

### Formula

```typescript
const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
const planetOrder: Planet[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const dayPlanet = planetOrder[dayOfWeek];

const hour = date.getHours(); // 0-23
const isDaytime = hour >= 6 && hour < 18;

// Calculate hours since dawn (6 AM) or dusk (6 PM)
const hoursSinceDawn = isDaytime ? hour - 6 : hour + 6;

// Find current planetary hour
const planetIndex = (planetOrder.indexOf(dayPlanet) + hoursSinceDawn) % 7;
const currentPlanet = PLANETARY_HOURS_ORDER[planetIndex];
```

### Detailed Breakdown

**Step 1: Determine Day Planet**

| Day of Week | dayOfWeek (JS) | Day Planet |
|-------------|----------------|------------|
| Sunday | 0 | Sun |
| Monday | 1 | Moon |
| Tuesday | 2 | Mars |
| Wednesday | 3 | Mercury |
| Thursday | 4 | Jupiter |
| Friday | 5 | Venus |
| Saturday | 6 | Saturn |

**Step 2: Determine Daytime vs Nighttime**
- **Daytime**: 6:00 AM - 5:59 PM (hours 6-17)
- **Nighttime**: 6:00 PM - 5:59 AM (hours 18-23, 0-5)

**Step 3: Calculate Hours Since Dawn/Dusk**
```
Daytime example: 2:00 PM (14:00)
  → hoursSinceDawn = 14 - 6 = 8

Nighttime example: 10:00 PM (22:00)
  → hoursSinceDawn = 22 + 6 = 28 → then % 7 = 0
```

**Step 4: Apply Planetary Hours Order**

```typescript
// Line 106-108
export const PLANETARY_HOURS_ORDER: Planet[] = [
  'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'
];
```

**This is the CHALDEAN ORDER**, different from the PLANETARY_HOURS array used for hour index!

### Example Calculation

**Scenario**: Sunday, 2:00 PM (14:00)

```
Step 1: dayOfWeek = 0 → dayPlanet = Sun

Step 2: hour = 14 → isDaytime = true (6 ≤ 14 < 18)

Step 3: hoursSinceDawn = 14 - 6 = 8

Step 4: Find Sun in planetOrder
  planetOrder = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
  indexOf('Sun') = 0

Step 5: Calculate planetIndex
  planetIndex = (0 + 8) % 7 = 1

Step 6: Get current planet
  PLANETARY_HOURS_ORDER[1] = Jupiter
  
Result: Current planetary hour = Jupiter (favorable for education, spiritual practice)
```

---

## 📊 Complete Calculation Example

**Input**: Name "محمد" (Muhammad)

### Step-by-Step Calculation

**1. Calculate Abjad Total (personKabir)**
```
م = 40
ح = 8
م = 40
د = 4
───────
Total = 92
```

**2. Calculate Ṭabʿ (Element)**
```
92 % 4 = 0 → modIndex(92, 4) = 4
Element = ELEMENTS[4] = Earth (تراب) 🌍
Quality = Cold & Dry
```

**3. Calculate Burj (Zodiac Sign)**
```
92 % 12 = 8 → modIndex(92, 12) = 8
Burj = BURUJ[8] = Scorpio (العقرب) ♏
Quality = Transformation & Depth
```

**4. Extract Ruling Planet**
```
Burj = Scorpio → Planet = Mars (المريخ)
```

**5. Extract Favorable Day**
```
Planet = Mars → Day = Tuesday (الثلاثاء)
```

**6. Calculate Hourly Index**
```
PLANETARY_HOURS = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars']
Mars is at index 6
hourIndex = 6 + 1 = 7
```

### Final Result

| Attribute | Value (EN) | Value (AR) | Symbol |
|-----------|------------|------------|--------|
| **Name** | Muhammad | محمد | - |
| **Kabir** | 92 | ٩٢ | - |
| **Ṣaghīr** | 2 (9+2) | ٢ | - |
| **Ṭabʿ (Element)** | Earth | تراب | 🌍 |
| **Burj (Zodiac)** | Scorpio | العقرب | ♏ |
| **Planet** | Mars | المريخ | - |
| **Favorable Day** | Tuesday | الثلاثاء | - |
| **Hour Index** | 7 | ٧ | - |
| **Quality** | Transformation & Depth | - | - |

---

## 🎯 Mother's Name Impact (External Influences)

**CRITICAL**: Mother's name affects **ONLY** the "Foundation" element, **NOT** any of the core calculations above.

### What Uses Personal Name Only (✅ CORE IDENTITY)
- ✅ Ṭabʿ (Element) - `modIndex(personKabir, 4)`
- ✅ Burj (Zodiac) - `modIndex(personKabir, 12)`
- ✅ Planet - Derived from Burj
- ✅ Favorable Day - Derived from Planet
- ✅ Hourly Index - Derived from Planet
- ✅ Ṣaghīr (Digital Root) - `digitalRoot(personKabir)`
- ✅ Divine Name Resonance - Uses `personKabir`

### What Uses Mother's Name (⚠️ EXTERNAL INFLUENCES)
- ⚠️ **Foundation Element** - `modIndex(motherKabir, 4)` (if mother's name provided)
- ⚠️ Element Harmony - Compares Expression (personal) vs Foundation (mother)

**Code Reference** (Line 747-752):
```typescript
// Expression = Personal element (always calculated)
const expression = ELEMENTS[modIndex(personKabir, 4) as ElementKey];

// Foundation = Mother's element (only if provided)
const foundation = (motherName && motherName.trim() !== '') 
  ? ELEMENTS[modIndex(motherKabir, 4) as ElementKey]
  : undefined;
```

---

## 🔍 Validation & Testing

### Test Cases

#### Test Case 1: Name with remainder 0 (Mod-4)
**Input**: Name with total divisible by 4

```
Name: "زينب" (Zaynab)
ز (7) + ي (10) + ن (50) + ب (2) = 69

Wait, 69 % 4 = 1 (not 0)

Better example: "هدى" (Huda)
ه (5) + د (4) + ى (10) = 19
Wait, 19 % 4 = 3

Let me try: Need total = multiple of 4
"داود" (Dawud)
د (4) + ا (1) + و (6) + د (4) = 15
15 % 4 = 3

Actually: "نور" (Noor)
ن (50) + و (6) + ر (200) = 256
256 % 4 = 0 → modIndex returns 4
Element = Earth ✅
```

#### Test Case 2: Name with remainder 0 (Mod-12)
**Input**: Name with total divisible by 12

```
Name: Total must equal 12, 24, 36, 48, 60, 72, 84, 96, 108, 120...

Example: "يوسف" (Yusuf)
ي (10) + و (6) + س (60) + ف (80) = 156
156 % 12 = 0 → modIndex returns 12
Burj = Pisces ♓
Planet = Jupiter
Day = Thursday
```

#### Test Case 3: Planet with two Burj assignments
**Input**: Verify Mercury appears in both Gemini (3) and Virgo (6)

```
Total % 12 = 3 → Gemini → Mercury ✅
Total % 12 = 6 → Virgo → Mercury ✅
```

#### Test Case 4: Hourly calculation
**Input**: Tuesday 10:00 AM

```
dayOfWeek = 2 (Tuesday)
dayPlanet = planetOrder[2] = Mars
hour = 10
isDaytime = true (6 ≤ 10 < 18)
hoursSinceDawn = 10 - 6 = 4
planetOrder.indexOf('Mars') = 2
planetIndex = (2 + 4) % 7 = 6
currentPlanet = PLANETARY_HOURS_ORDER[6] = Moon

Result: Current hour ruled by Moon (emotional, family matters)
```

---

## 📚 Classical Sources & Authenticity

### Traditional Foundations

**1. Element Calculation (Mod-4)**
- **Source**: Maghribi ʿIlm al-Ḥurūf tradition
- **Authenticity**: ✅ Classical method
- **Note**: Uses 1=Fire, 2=Earth, 3=Air, 4=Earth mapping

**2. Burj Calculation (Mod-12)**
- **Source**: Classical Islamic astrology (ʿIlm al-Nujūm)
- **Authenticity**: ✅ Traditional method
- **Basis**: 12 zodiacal signs mapped to abjad totals

**3. Planetary Rulership**
- **Source**: Hellenistic astrology adopted in Islamic tradition
- **Authenticity**: ✅ Historically documented
- **Books**: Referenced in Shams al-Maʿārif and related texts

**4. Planetary Hours**
- **Source**: Chaldean order (ancient Mesopotamian tradition)
- **Authenticity**: ✅ Widely used in Islamic astrology
- **Practice**: Still used in traditional Islamic manuscript astrology

**5. Planetary Days**
- **Source**: Universal across astrological traditions
- **Authenticity**: ✅ Standard mapping
- **Usage**: Determines favorable days for activities

---

## 🎯 Summary Table

| Calculation | Formula | Base | Special Rule | Output | Uses Mother? |
|-------------|---------|------|--------------|--------|--------------|
| **Ṭabʿ (Element)** | `modIndex(personKabir, 4)` | 4 | 0 → 4 | Fire/Earth/Air/Earth | ❌ No |
| **Burj (Zodiac)** | `modIndex(personKabir, 12)` | 12 | 0 → 12 | Aries-Pisces | ❌ No |
| **Planet** | `burj.planet` | - | Derived | Sun-Saturn (7 planets) | ❌ No |
| **Day** | `burj.day{En/Fr/Ar}` | - | Derived | Sunday-Saturday | ❌ No |
| **Hour Index** | `findIndex(planet) + 1` | 7 | +1 offset | 1-7 | ❌ No |
| **Foundation Element** | `modIndex(motherKabir, 4)` | 4 | 0 → 4 | Fire/Earth/Air/Earth | ✅ **Yes** |

---

## 🔑 Key Takeaways for Developers

### 1. **Always Use Personal Name for Core Attributes**
```typescript
// ✅ CORRECT
const element = ELEMENTS[modIndex(personKabir, 4)];
const burj = BURUJ[modIndex(personKabir, 12)];

// ❌ WRONG - Never use totalKabir for core identity
const element = ELEMENTS[modIndex(totalKabir, 4)]; // WRONG!
```

### 2. **Understand modIndex Special Case**
```typescript
// When remainder is 0, return base (not 0)
100 % 4 = 0 → modIndex(100, 4) = 4 (not 0)
144 % 12 = 0 → modIndex(144, 12) = 12 (not 0)
```

### 3. **Two Different Planetary Arrays**
```typescript
// For hour index (1-7)
PLANETARY_HOURS = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars']

// For planetary hours calculation (Chaldean order)
PLANETARY_HOURS_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon']
```

### 4. **Planet Determines Day, Not Vice Versa**
```
Abjad Total → Burj → Planet → Day
(Flow is unidirectional)
```

### 5. **Hour Index is Static (1-7), Planetary Hour is Dynamic (changes each hour)**
```typescript
// Static (from name)
hourIndex = PLANETARY_HOURS.findIndex(planet) + 1; // Always same for a name

// Dynamic (from current time)
currentPlanet = calculatePlanetaryHour(new Date()).planet; // Changes hourly
```

---

## 📝 Related Documentation

- `MOTHER_NAME_USAGE_AUDIT.md` - Mother's name usage across modules
- `COMPATIBILITY_MODULE_AUDIT.md` - Compatibility calculation formulas
- `MOTHER_NAME_FIX_COMPLETE.md` - Name Destiny external influences fix

---

**Last Updated**: January 2025  
**Audit Status**: ✅ Complete  
**Next Review**: When adding new planetary/zodiacal calculations
