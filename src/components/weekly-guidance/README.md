# 📅 Advanced Weekly Guidance Module

A user-friendly, bilingual weekly planning interface that transforms technical astrological calculations into actionable daily guidance.

## Overview

The Advanced Weekly Guidance module provides an intuitive way for users to understand their spiritual energy patterns throughout the week and plan accordingly. It's designed to be accessible to everyone, not just advanced practitioners.

## Features

### 🌟 Key Capabilities

1. **Dual View Modes**
   - **Overview Mode**: Week-at-a-glance calendar + insights
   - **Detailed Mode**: Expandable day cards with full guidance

2. **Visual Energy Tracking**
   - Color-coded harmony indicators (green/blue/amber/red)
   - Energy flow chart showing weekly trends
   - Planet-based day identification

3. **Smart Recommendations**
   - Best days for important tasks identified
   - Rest days clearly marked
   - Planning strategies provided
   - Today's quick tip highlighted

4. **Bilingual Support**
   - Full English and French translations
   - Contextual language switching
   - Consistent with app-wide language settings

## Components

### WeeklyGuidance (Main Container)
- Orchestrates all sub-components
- Manages view mode (overview/detailed)
- Displays header with quick stats
- Shows today's tip when available

### WeekOverview
- 7-day calendar grid
- Color-coded harmony scores
- Planet icons for each day
- Badge indicators (Best/Rest/OK/Low)
- Interactive day selection
- Today indicator with pulse animation

### DayCard
- Expandable detailed view for each day
- Shows harmony score, energy band, planet
- Lists daily guidance tips
- Rest day recommendations
- Energy return information
- Auto-expands for today

### WeeklyInsights
- Identifies best action days
- Highlights rest days
- Provides planning strategy
- Week quality summary
- Contextual recommendations

### EnergyFlowChart
- Visual bar chart of harmony scores
- Color-coded by harmony level
- Planet icons above each bar
- Today indicator
- Trend analysis insight

## Usage

### Basic Implementation

```tsx
import { WeeklyGuidance } from '@/components/weekly-guidance';

function MyComponent() {
  const weekDays = generateWeeklyGuidance(profile, startDate);
  
  return (
    <WeeklyGuidance 
      weekDays={weekDays}
      userElement={profile.element}
      userPlanet={profile.kawkab}
    />
  );
}
```

### In IlmHurufPanel

```tsx
// Inside the Weekly Guidance section
{weeklyResults && (
  <WeeklyGuidance 
    weekDays={weeklyResults.days}
    userElement={profile.element}
    userPlanet={profile.kawkab}
  />
)}
```

## Design Philosophy

### User-Friendly Approach

1. **Narrative-Driven**: Explanations use simple, relatable language
2. **Visual Hierarchy**: Important information stands out
3. **Progressive Disclosure**: Details revealed when needed
4. **Actionable Guidance**: Clear next steps provided

### Accessibility

- High contrast color schemes
- Clear visual indicators
- Responsive design (mobile-first)
- Screen reader friendly
- Keyboard navigable

### Consistency

- Matches Divine Timing module design patterns
- Uses app-wide color system
- Follows established UI conventions
- Maintains brand identity

## Color Coding

### Harmony Scores

| Score | Color | Meaning |
|-------|-------|---------|
| 8-10  | Green | Excellent - Best for action |
| 7     | Blue  | Very Good - Favorable |
| 4-6   | Amber | Moderate - Proceed with care |
| 0-3   | Red   | Low - Rest recommended |

### Energy Bands

- **High**: Green badge - Peak energy
- **Moderate**: Amber badge - Steady energy
- **Low**: Red badge - Limited energy

## Translation Support

All user-facing text is fully bilingual:

### English → French
- "Best Days" → "Meilleurs Jours"
- "Rest Days" → "Jours de Repos"
- "Energy Flow" → "Flux d'Énergie"
- Day names (Monday → Lundi)
- Planet names (Sun → Soleil)
- Guidance tips (contextual)

## Classical Sources

Based on authentic Islamic spiritual traditions:

- **ʿIlm al-Ḥurūf**: Science of Letters
- **Planetary Days**: Classical Islamic astrology
- **Mīzān**: Balance and harmony concepts
- **Infisāl**: Rest and disconnection wisdom

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (iOS/Android)
- Dark mode support
- Tablet optimized

## Performance

- Lightweight components
- Minimal re-renders
- Lazy loading ready
- Optimized for mobile

## Future Enhancements

Potential additions:
- Export weekly plan to calendar
- Notification reminders
- Custom task categorization
- Historical trend analysis
- Share weekly overview

---

**Created**: November 2025  
**Status**: Production Ready  
**Maintainer**: Asrār Everyday Team
