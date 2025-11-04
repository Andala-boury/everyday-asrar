# Translation Progress & Next Steps

## ✅ Already Translated

### Core Navigation
- [x] Letter Calculator tab
- [x] Life Guidance tab  
- [x] Advanced tab
- [x] Language toggle buttons

### Calculator Section
- [x] "Calculate Letter Values" heading
- [x] "Latin Text (English/French)" label
- [x] "Arabic Text" label
- [x] Auto-transliteration help text

---

## 📝 Ready to Translate Next

### High Priority (Most Visible)

#### 1. Calculator Results Display
**File:** `asrar-everyday-app.tsx` (lines ~1400-1600)
**Strings:**
- Kabīr panel title, subtitle, description
- Ṣaghīr panel title, subtitle, description  
- Ḥadath panel title, subtitle, description
- Rūḥ Ḥadad panel title, subtitle, description

**Add to translations.ts:**
```typescript
calculator: {
  // ... existing
  results: {
    kabir: "Kabīr (الكبير)",
    kabirSubtitle: "Grand Total",
    kabirDesc: "The total energetic signature",
    // etc.
  }
}
```

#### 2. Calculate Button
**File:** `asrar-everyday-app.tsx`
**Current:** "Calculate Abjad Value"
**Use:** `t.calculator.calculateButton` or `t.common.calculate`

#### 3. Element Cards
**File:** Wherever element info is displayed
**Strings:**
- Fire, Water, Air, Earth labels
- Element descriptions
- Element qualities

**Already in translations.ts:**
```typescript
t.elements.fire // "Fire" / "Feu"
t.elements.fireDesc // Description
```

---

### Medium Priority

#### 4. History Panel
**Strings:**
- "History" heading
- "Favorites" section
- "Clear All" button
- Date/time formatting
- Empty state messages

#### 5. Comparison Feature
**Strings:**
- Modal title
- "Person 1" / "Person 2" labels
- "Compare" button
- Results headings

#### 6. Compatibility Feature  
**Strings:**
- Modal title
- Compatibility score labels
- Rating descriptions (Excellent, Good, etc.)

**Already in translations.ts:**
```typescript
t.compatibility.title
t.compatibility.person1
t.compatibility.ratings.excellent
```

#### 7. Element Guidance Suggestions
**File:** ELEMENT_SUGGESTIONS constant
**Strings:**
- Affirmations
- Optimal times
- Section headings ("Related Quranic Verses", etc.)

**Note:** Keep Quranic verses in original Arabic

---

### Low Priority (Less Visible)

#### 8. Onboarding Tutorial
**Component:** `OnboardingTutorial.tsx`
**Strings:** All tutorial step text

#### 9. Mobile Menu
**Component:** `MobileMenu.tsx`
**Strings:** Menu items, section headings

#### 10. Disclaimers & Modals
**Components:**
- DisclaimerBanner
- MoreInfoModal
- GlossaryModal

---

## 🔧 Implementation Pattern

### Step 1: Add translations
```typescript
// src/lib/translations.ts
export const translations = {
  en: {
    results: {
      kabir: {
        title: "Kabīr (الكبير)",
        subtitle: "Grand Total",
        description: "The total energetic signature of your name"
      }
    }
  },
  fr: {
    results: {
      kabir: {
        title: "Kabīr (الكبير)",
        subtitle: "Total Grand",
        description: "La signature énergétique totale de votre nom"
      }
    }
  }
}
```

### Step 2: Use in component
```tsx
// Before
<h3 className="...">Kabīr (الكبير)</h3>
<p>Grand Total</p>

// After
const { t } = useLanguage();
<h3 className="...">{t.results.kabir.title}</h3>
<p>{t.results.kabir.subtitle}</p>
```

---

## 🎯 Quick Wins (Easy to Add)

### Buttons
```typescript
common: {
  calculate: "Calculate" / "Calculer",
  clear: "Clear" / "Effacer",
  close: "Close" / "Fermer",
  save: "Save" / "Enregistrer",
  delete: "Delete" / "Supprimer",
  copy: "Copy" / "Copier",
  compare: "Compare" / "Comparer",
}
```

### Status Messages
```typescript
messages: {
  calculating: "Calculating..." / "Calcul en cours...",
  saved: "Saved successfully" / "Enregistré avec succès",
  copied: "Copied to clipboard" / "Copié dans le presse-papiers",
  error: "An error occurred" / "Une erreur s'est produite",
}
```

### Form Labels
```typescript
form: {
  required: "Required" / "Requis",
  optional: "Optional" / "Optionnel",
  placeholder: "Enter text" / "Entrez le texte",
}
```

---

## 📋 Translation Priority List

1. ⭐⭐⭐ **Calculate button** (most used)
2. ⭐⭐⭐ **Result panels** (Kabīr, Ṣaghīr, etc.)
3. ⭐⭐ **Element displays**
4. ⭐⭐ **History panel**
5. ⭐ **Comparison feature**
6. ⭐ **Compatibility feature**
7. ⭐ **Mobile menu**
8. ⭐ **Modals & dialogs**

---

## 🔍 Finding Strings to Translate

### Method 1: Search for hardcoded text
```bash
# In VS Code, search for common patterns:
"Calculate"
"Total"
"Element"
"History"
```

### Method 2: Check component files
```bash
src/components/
src/features/
asrar-everyday-app.tsx
```

### Method 3: Visual inspection
- Run app: `npm run dev`
- Toggle language
- Note any strings that don't change

---

## 🌍 Adding Arabic (Future)

### 1. Add RTL Support
```tsx
// app/layout.tsx
<html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>
```

### 2. Add Arabic Translations
```typescript
export const translations = {
  en: { ... },
  fr: { ... },
  ar: {
    nav: {
      home: "الرئيسية",
      calculator: "الآلة الحاسبة",
      // etc.
    }
  }
}
```

### 3. Update Language Type
```typescript
export type Language = 'en' | 'fr' | 'ar';
```

### 4. Add Toggle Button
```tsx
<button onClick={() => setLanguage('ar')}>
  🇸🇦 AR
</button>
```

---

## 📊 Current Coverage

| Section | Coverage | Priority |
|---------|----------|----------|
| Navigation | 100% ✅ | High |
| Calculator Input | 100% ✅ | High |
| Calculator Results | 0% ❌ | **High** |
| Element Info | 100% ✅ | Medium |
| History | 0% ❌ | Medium |
| Compatibility | 50% 🟡 | Medium |
| Modals | 0% ❌ | Low |
| Tutorial | 0% ❌ | Low |

**Overall: ~20% Complete**

---

## ⚡ Quick Commands

```bash
# Start dev server
npm run dev

# Check for TypeScript errors
npm run build

# Search for hardcoded strings
grep -r "Calculate" src/
```

---

**Next Task:** Translate calculator result panels (Kabīr, Ṣaghīr, Ḥadath, Rūḥ)
