# Hadad Summary Panel

A reusable React component for displaying comprehensive ḥadad (Abjad numerology) analysis following Maghrib traditions.

## Features

- ✅ **Deterministic calculations** using Maghrib Abjad values
- 📊 **Complete breakdown**: Kabīr, Ṣaghīr, Ḥadath, Rūḥ, Um Ḥadad
- 🔥 **Element analysis** with Fire, Water, Air, Earth distribution
- 🌟 **Sacred number resonance** detection
- 🕌 **Asmā' al-Ḥusnā suggestions** by element
- 📖 **Related Quranic verses** for each element
- 🪐 **Celestial signature** (planet, day, hours)
- 🔢 **Magic grid** (educational display)
- 📋 **Export to JSON**
- 🌙 **RTL-friendly** with Arabic text support
- 🎨 **Dark mode** compatible

## Installation

Copy the entire `hadad-summary/` directory into your project:

```
src/components/hadad-summary/
├── HadadSummaryPanel.tsx
├── hadad-core.ts
├── types.ts
├── index.ts
└── README.md
```

No external dependencies required (React only).

## Usage

### Basic Example

```tsx
import { HadadSummaryPanel } from '@/components/hadad-summary';
import { AbjadAudit } from '@/components/hadad-summary/types';

// Create an audit for "الله"
const allahAudit: AbjadAudit = {
  original: 'الله',
  normalized: 'الله',
  steps: [
    { ch: 'ا', value: 1, element: 'Fire' },
    { ch: 'ل', value: 30, element: 'Earth' },
    { ch: 'ل', value: 30, element: 'Earth' },
    { ch: 'ه', value: 5, element: 'Fire' }
  ],
  total: 66
};

function App() {
  return (
    <HadadSummaryPanel
      audit={allahAudit}
      showGrid={true}
      showResonance={true}
    />
  );
}
```

### With Mother's Name

```tsx
const nameAudit = createAudit('محمد');
const motherAudit = createAudit('فاطمة');

<HadadSummaryPanel
  audit={nameAudit}
  motherAudit={motherAudit}
  taMarbutaMode="ه"
/>
```

### Creating Audits

```tsx
import { ABJAD, LETTER_ELEMENTS } from '@/components/hadad-summary/hadad-core';
import { normalizeArabic } from '@/lib/text-normalize';
import { AbjadAudit, AuditStep } from '@/components/hadad-summary/types';

function createAudit(arabicText: string, taMarbutaMode: 'ه' | 'ة' = 'ه'): AbjadAudit {
  const original = arabicText;
  const normalized = normalizeArabic(arabicText, { taMarbutaAs: taMarbutaMode });
  
  const steps: AuditStep[] = [...normalized].map(ch => ({
    ch,
    value: ABJAD[ch] || 0,
    element: LETTER_ELEMENTS[ch] || 'Earth'
  }));
  
  const total = steps.reduce((sum, step) => sum + step.value, 0);
  
  return { original, normalized, steps, total };
}
```

### Copy JSON Callback

```tsx
<HadadSummaryPanel
  audit={audit}
  onCopyJson={(payload) => {
    console.log('Exported:', payload);
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    alert('Copied to clipboard!');
  }}
/>
```

## Props

### `HadadSummaryProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `audit` | `AbjadAudit` | **Required** | The main name/text audit |
| `motherAudit` | `AbjadAudit?` | `undefined` | Optional mother's name for Um Ḥadad |
| `taMarbutaMode` | `'ه' \| 'ة'` | `'ه'` | Tā' marbūṭa rendering preference |
| `showGrid` | `boolean` | `true` | Display the magic grid |
| `showResonance` | `boolean` | `true` | Show sacred number analysis |
| `onCopyJson` | `(payload: any) => void` | `undefined` | Custom JSON export handler |

## Core Calculations

### Numbers Calculated

- **Kabīr** (Great Number): Sum of all letter values
- **Ṣaghīr** (Small Number): Digital root (1–9)
- **Ḥadath** (Nature): `total % 4` → Element mapping
  - `0` → Earth
  - `1` → Fire
  - `2` → Water
  - `3` → Air
- **Rūḥ Ḥadad**: `⌊(Kabīr + Ṣaghīr) / 2⌋`
- **Um Ḥadad**: Combined total with mother's name

### Element Mapping (Maghrib)

```typescript
Fire:  ا ه ط م ف ص
Water: ب و ي ن
Air:   ج ز ك س ق ش
Earth: د ل ع ر ت ث خ ذ ض ظ غ
```

### Sacred Numbers

Detects resonance with: `7, 12, 19, 70, 99, 114, 313, 786`

## Output Sections

1. **Disclaimer** - Educational usage notice
2. **Calculation Breakdown** - Per-letter chips with values
3. **Main Results** - Kabīr, Ṣaghīr, Ḥadath, Rūḥ
4. **Um Ḥadad** - If `motherAudit` provided
5. **Sacred Resonance** - Nearest sacred number + divisibility
6. **Celestial Signature** - Planet, day, hours by element
7. **Guidance** - Contextual advice by element + root
8. **Related Verses** - 3 Quranic verses per element
9. **Asmā' Suggestions** - Divine Names + counts
10. **Magic Grid** - 3×3 sequential grid (if enabled)

## Acceptance Tests

```typescript
// Test: الله → 66
const allah = createAudit('الله');
expect(allah.total).toBe(66);
expect(digitalRoot(allah.total)).toBe(3);
expect(hadathToElement(hadathRemainder(allah.total))).toBe('Water');

// Test: يس → 70
const yasin = createAudit('يس');
expect(yasin.total).toBe(70);

// Test: بسم الله (short) → 786
// (normalize removes diacritics, spaces)
```

## Styling

Uses Tailwind CSS utility classes. Compatible with:
- Light mode
- Dark mode (via `dark:` variants)
- RTL layouts (via `dir="rtl"`)

Custom color scheme:
- Fire: `orange-500`
- Water: `blue-500`
- Air: `cyan-500`
- Earth: `emerald-500`

## Safety & Educational Use

**Important:** This component displays:

> "Educational & Traditional: This analysis is for cultural exploration and reflection only. 
> Not for predictions, rulings, medical, or financial decisions."

Always consult qualified scholars for religious guidance.

## API Reference

### Core Functions

```typescript
// From hadad-core.ts
digitalRoot(n: number): number
hadathRemainder(n: number): 0 | 1 | 2 | 3
hadathToElement(r: 0 | 1 | 2 | 3): ElementType
ruhHadad(total: number): RuhHadad
withMother(total: number, motherTotal: number): UmHadad
nearestSacred(n: number): SacredResonance
generateMagicGrid(seed: number): number[][]
```

### Constants

```typescript
ABJAD: Record<string, number>           // Arabic letter values
LETTER_ELEMENTS: Record<string, ElementType>  // Letter→Element map
ELEMENT_INFO: Record<ElementType, ElementInfo>  // Element metadata
ASMA_LIST: AsmaName[]                  // Built-in Divine Names
VERSES_BY_ELEMENT: Record<ElementType, Verse[]>  // Quranic verses
```

## License

Free to use for educational and personal projects. Attribution appreciated.

## Version

Normalization: **Maghrib v1.0** (deterministic, no shadda doubling)

---

**Built for Asrār Everyday** • Educational Islamic Numerology Explorer
