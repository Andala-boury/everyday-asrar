# Advanced Divine Timing Module

## Overview

The Advanced Divine Timing Module is a complete redesign of the planetary hours interface for Asrār Everyday. It transforms technical astronomical data into an intuitive, narrative-driven spiritual guidance system while preserving all calculations and Islamic traditional authenticity.

## 🎯 Core Features

### 1. **Narrative-Driven Interface**
- Beautiful, gradient energy cards that show the current moment's spiritual significance
- Simple language: "Perfect time to act with confidence" instead of "Moderate Connection (اتصال متوسط)"
- Color-coded energy levels (Green=Perfect, Blue=Strong, Yellow=Moderate, Gray=Rest)

### 2. **Purpose-Based Guidance**
Users can select what they need help with:
- 📱 Work & Projects
- 🌙 Reflection & Prayer
- 💬 Important Conversations
- 📚 Learning & Study
- 💰 Financial Decisions
- ❤️ Relationships

The interface then tailors recommendations to their specific purpose.

### 3. **Interactive Timeline**
- Horizontal scrollable view of all 24 planetary hours
- Color-coded energy compatibility
- Tap any hour to see detailed guidance
- "You are here" indicator
- Day/Night visual distinction

### 4. **Enhanced Dhikr Component**
- Large, beautiful Arabic calligraphy
- Interactive counter with progress bar
- Transliteration and meaning
- "Why this dhikr for this hour?" educational section
- Traditional numerological counts

### 5. **Rest Day Special View**
- Beautiful starry night interface when harmony is low (>70% weak/opposing hours)
- Sacred quotes in Arabic with translation
- Recommended rest practices (meditation, nature walk, journaling, etc.)
- Reframes low energy as spiritual invitation, not a problem

## 📁 Component Structure

```
src/components/divine-timing/
├── DivineTiming.tsx       # Main orchestrator component
├── EnergyCard.tsx         # Current moment energy display
├── PurposeSelector.tsx    # "What do you need guidance on?" cards
├── TimelineView.tsx       # 24-hour planetary timeline
├── DhikrCard.tsx          # Interactive dhikr counter
├── RestDayView.tsx        # Special view for low-energy days
└── index.ts               # Exports
```

## 🎨 Design Principles

### Visual Hierarchy
1. **Hero Card** (Energy Card) - Immediate answer to "What should I do now?"
2. **Purpose Selection** - Optional contextual guidance
3. **Timeline** - Expandable for power users
4. **Dhikr** - Spiritual practice integration

### Color Psychology
- **Green gradients**: Perfect/Strong energy (positive action)
- **Blue gradients**: Strong energy (progress)
- **Yellow/Orange gradients**: Moderate energy (steady work)
- **Gray gradients**: Low energy (rest)
- **Purple/Pink accents**: Spiritual elements (dhikr, sacred quotes)

### Mobile-First
- All components responsive
- Touch-friendly buttons (min 44px hit area)
- Swipeable timeline
- Modal dialogs for selected hours on small screens

## 🔧 Integration

### Basic Usage

```tsx
import { DivineTiming } from '@/components/divine-timing';

export default function DivineTimingPage() {
  // Get user's element from their name/birthday calculation
  const userElement: Element = 'water'; // or 'fire', 'air', 'earth'
  
  return <DivineTiming userElement={userElement} />;
}
```

### With Existing User Data

```tsx
'use client';

import { DivineTiming } from '@/components/divine-timing';
import { calculateUserElement } from '@/utils/calculations';
import { useState, useEffect } from 'react';

export default function DivineTimingWithUserData() {
  const [userElement, setUserElement] = useState<Element | null>(null);
  
  useEffect(() => {
    // Get from localStorage, database, or context
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      const element = calculateUserElement(savedName);
      setUserElement(element);
    }
  }, []);
  
  if (!userElement) {
    return <div>Please enter your name first...</div>;
  }
  
  return <DivineTiming userElement={userElement} />;
}
```

## 🌍 Bilingual Support

All components use the `useLanguage()` hook and support:
- English (en)
- French (fr)

Text automatically switches based on user's language preference.

### Adding New Translations

Update `src/lib/translations.ts`:

```typescript
export const translations = {
  en: {
    divineTiming: {
      rightNow: "Right Now",
      perfectEnergy: "Perfect Energy",
      // ... more keys
    }
  },
  fr: {
    divineTiming: {
      rightNow: "En Ce Moment",
      perfectEnergy: "Énergie Parfaite",
      // ... more keys
    }
  }
};
```

## 📱 User Flow

### First Visit
1. User sees beautiful Energy Card showing current moment
2. "What do you need guidance on?" purpose selector appears
3. User selects purpose (or skips)
4. Contextualized guidance appears
5. Can optionally expand timeline, see dhikr

### Rest Day
1. Special calming interface loads automatically
2. Sacred quote and explanation
3. 6 recommended rest practices
4. Option to view full week

### Power User
1. Opens timeline immediately
2. Reviews entire day at a glance
3. Taps specific hours for details
4. Plans important activities for optimal windows

## 🎯 Accessibility

- **Semantic HTML**: Proper heading structure, ARIA labels
- **Keyboard Navigation**: All interactive elements keyboard-accessible
- **Color Contrast**: WCAG AA compliant
- **Screen Readers**: Descriptive labels for icons and states
- **Reading Levels**: Simple language (8th grade reading level or lower)

## 🔮 Traditional Foundations

### Preserved Elements
- ✅ Accurate planetary hour calculations
- ✅ Arabic terminology (with transliterations)
- ✅ Traditional dhikr recommendations
- ✅ Elemental analysis (Fire, Water, Air, Earth)
- ✅ Planetary correspondences
- ✅ Sacred quotes from classical texts

### Educational Approach
- "Learn More" expandable sections
- "Why this dhikr?" explanations
- Disclaimers about consulting qualified scholars
- Contextual teaching moments

## ⚡ Performance

- **Lazy Loading**: Timeline only rendered when requested
- **Auto-refresh**: Updates every 60 seconds
- **Local Caching**: Location saved to localStorage
- **Optimized Calculations**: Planetary hours calculated once, reused
- **Progressive Enhancement**: Works with JavaScript disabled (shows message)

## 🧪 Testing Scenarios

### 1. Perfect Energy Day
- User element: Fire
- Many Fire hours during day
- Should show enthusiastic, action-oriented guidance

### 2. Rest Day
- User element: Water
- Most hours are Fire/Air (opposing)
- Should trigger Rest Day view automatically

### 3. Purpose Selection
- Select "Work & Projects" during strong energy → "Good timing" message
- Select "Work & Projects" during low energy → "Neutral timing, routine only"

### 4. Dhikr Counter
- Count to recommended number → Completion animation
- Reset → Counter returns to 0
- Expand "Why this dhikr?" → Educational content

### 5. Timeline Navigation
- Scroll through 24 hours
- Current hour highlighted with "NOW" badge
- Tap hour → Detailed modal (mobile) or inline expansion (desktop)

## 🚀 Future Enhancements

- [ ] Save favorite dhikr counts
- [ ] Share guidance cards as images
- [ ] Weekly energy forecast
- [ ] Personalized recommendations based on user history
- [ ] Notification when optimal energy window approaches
- [ ] Voice-guided dhikr counter
- [ ] Integration with calendar for event planning

## 📄 License & Attribution

This module uses traditional Islamic sciences ('Ilm al-Ḥurūf) in an educational, respectful manner. Always encourage users to:
- Consult qualified scholars for religious questions
- Use as one tool among many
- Trust their own judgment and spiritual intuition

## 🤝 Contributing

When adding features:
1. Preserve bilingual support (EN/FR)
2. Keep mobile-first approach
3. Maintain accessibility standards
4. Test with various user elements
5. Document changes
6. Preserve educational disclaimer language

---

**Built with ❤️ for the Asrār Everyday community**
