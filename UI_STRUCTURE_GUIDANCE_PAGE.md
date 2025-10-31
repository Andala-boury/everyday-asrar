# UI File Structure - Life Guidance Page

## Overview
When you click the **"Life Guidance"** button on the main page, it shows a new interface with 5 different guidance modes.

---

## File Hierarchy

### 1. **Entry Point** → `app/page.tsx`
```tsx
- Renders: <AsrarEveryday />
- Note: This just wraps the main app component
```

### 2. **Main Application Component** → `asrar-everyday-app.tsx` (Root)
```tsx
- State: viewMode = 'calculator' | 'guidance'
- Button at line 1231: onClick={() => setViewMode('guidance')}
- Line 1239: Shows "Life Guidance" button text
- Line 1245: Conditional render:
  {viewMode === 'guidance' ? (
    <IlmHurufPanel />
  ) : (
    // ... calculator UI
  )}
```

### 3. **Guidance Panel Component** → `src/features/ilm-huruf/IlmHurufPanel.tsx` ✨
**THIS IS THE FILE RESPONSIBLE FOR THE UI YOU SEE IN THE IMAGE**

---

## IlmHurufPanel.tsx Structure

### Location
```
src/
└── features/
    └── ilm-huruf/
        └── IlmHurufPanel.tsx  (3048 lines)
```

### What It Renders (Lines 315+)

#### Header Section (Lines 317-322)
```tsx
<h2>ʿIlm al-Ḥurūf - Practical Life Guidance</h2>
<p>Reflective guidance to plan your week</p>
```

#### Mode Selection Buttons (Lines 325-383)
5 interactive mode buttons in a grid:

1. **Week at a Glance** 📅
   - Button trigger: `setMode('weekly')`
   - Icon: Calendar (green)
   - Shows weekly guidance

2. **Name Destiny** 🎯
   - Button trigger: `setMode('destiny')`
   - Icon: Target (purple)
   - Analyzes name meanings

3. **Compatibility** 👥
   - Button trigger: `setMode('compatibility')`
   - Icon: Users (pink)
   - Relationship analysis

4. **Life Path** 🧭
   - Button trigger: `setMode('life-path')`
   - Icon: Compass (blue)
   - Life path numerology

5. **Divine Timing** ⏰
   - Button trigger: `setMode('timing')`
   - Icon: Clock (amber)
   - Planetary hours calculation

#### Input Section (Lines 386+)
Dynamic input fields based on selected mode:
- **Weekly**: Date input
- **Destiny**: Name input field
- **Compatibility**: Two name inputs
- **Life Path**: Birth date
- **Timing**: Auto-calculates current planetary hour

---

## Related Components Used

The IlmHurufPanel imports and uses:

| Component | Purpose |
|-----------|---------|
| `BalanceMeter` | Shows elemental balance visualization |
| `HarmonyTooltip` | Displays harmony breakdown details |
| `ActNowButtons` | Action recommendation buttons |
| `DailyColorGuidanceCard` | Daily color guidance card |
| `EnhancedLifePathView` | Life path number visualization |
| `ArabicKeyboard` | Arabic text input helper |
| `CompatibilityGauge` | Compatibility score display |

---

## Core Logic Import
```tsx
import {
  analyzeNameDestiny,
  analyzeCompatibility,
  calculateLifePath,
  calculatePersonalYear,
  calculatePlanetaryHour,
  // ... and more
} from './core';
```

All the calculation logic is in: `src/features/ilm-huruf/core.ts`

---

## File Summary

**To modify the Life Guidance UI, edit:**

| What | File | Lines |
|------|------|-------|
| Overall layout & structure | `IlmHurufPanel.tsx` | 315-400 |
| Mode selection buttons | `IlmHurufPanel.tsx` | 325-383 |
| Input fields | `IlmHurufPanel.tsx` | 386+ |
| Calculation logic | `core.ts` | Various |
| Display components | `components/` | Various |

**Direct navigation:**
```
asrar-everyday-app.tsx (line 1245)
    ↓
    <IlmHurufPanel />
    ↓
src/features/ilm-huruf/IlmHurufPanel.tsx (line 315 main return)
```

---

## Quick Reference

- **Show/Hide Logic**: Line 1245 in `asrar-everyday-app.tsx`
  ```tsx
  {viewMode === 'guidance' ? (
    <IlmHurufPanel />
  ) : (
    // calculator view
  )}
  ```

- **Mode Selector**: Lines 325-383 in `IlmHurufPanel.tsx`
- **Current Selected Mode State**: `const [mode, setMode] = useState('weekly')`
- **Header Title**: Line 320 (change text here)
- **Button Styles**: Each mode button uses conditional styling (green/purple/pink/blue/amber)
