# Weekly Guidance View Toggle - Visual Guide

## Before Integration
```
Weekly Guidance Results
├── WeeklyResults Component (only view)
    ├── Week Summary
    ├── Best Days Section
    ├── Optimal Sequence
    └── Daily Details
```

## After Integration
```
Weekly Guidance Results
├── View Toggle Bar (NEW!)
│   ├── [Classic View] ←─ Green when selected
│   └── [Advanced View] ←─ Green when selected
│
├── Classic View (when selected)
│   └── WeeklyResults Component
│       ├── Week Summary
│       ├── Best Days Section
│       ├── Optimal Sequence
│       └── Daily Details
│
└── Advanced View (when selected)
    └── WeeklyGuidance Component (NEW!)
        ├── Header (Weekly Guidance)
        ├── Quick Stats Dashboard
        │   ├── 3 Best Days count
        │   ├── 2 Rest Days count
        │   └── 2 Moderate Days count
        ├── Today's Tip Highlight
        ├── View Mode Toggle
        │   ├── [Week Overview]
        │   └── [Detailed View]
        ├── Week Overview Grid (7 days)
        │   ├── Monday Card (harmony-based color)
        │   ├── Tuesday Card
        │   ├── Wednesday Card
        │   ├── Thursday Card
        │   ├── Friday Card
        │   ├── Saturday Card
        │   └── Sunday Card
        ├── OR Detailed Day Cards (expandable)
        │   ├── Card 1 (collapsed/expanded)
        │   ├── Card 2 (collapsed/expanded)
        │   └── ...
        ├── Weekly Insights Panel
        │   ├── Best Days for Action
        │   ├── Rest Days Notice
        │   └── Planning Strategy
        └── Energy Flow Chart
            └── Bar chart visualization
```

## UI Flow

### User Journey
1. User enters Arabic name
2. Clicks "Generate Weekly Guidance"
3. Sees results with NEW view toggle at top
4. Can choose between:
   - **Classic View** (original detailed analysis)
   - **Advanced View** (new visual friendly interface)

### Toggle Interaction
```
┌──────────────────────────────────────────────┐
│  ┌─────────────┐  ┌──────────────┐          │
│  │ Classic View │  │Advanced View │  ← Buttons│
│  └─────────────┘  └──────────────┘          │
└──────────────────────────────────────────────┘
      Active: Green bg, white text, scale-105
   Inactive: Gray bg, gray text, hover effect
```

### Visual States

#### Classic View Active
```
┌──────────────────────────────────────────────┐
│  [Classic View]✓  [Advanced View]            │ ← Toggle
├──────────────────────────────────────────────┤
│                                              │
│  📊 Week Summary                             │
│  ⭐ Best Days Section                        │
│  📝 Optimal Sequence                         │
│  📅 Daily Details                            │
│                                              │
└──────────────────────────────────────────────┘
```

#### Advanced View Active
```
┌──────────────────────────────────────────────┐
│  [Classic View]  [Advanced View]✓            │ ← Toggle
├──────────────────────────────────────────────┤
│  🌟 Weekly Guidance                          │
│  ┌──────────────────────────────────────┐   │
│  │ 3 Best Days | 2 Rest Days | 2 OK     │   │ ← Stats
│  └──────────────────────────────────────┘   │
│  💡 Today's Tip: [Highlighted guidance]     │
│  ┌──────────────────────────────────────┐   │
│  │ [Week Overview]  [Detailed View]     │   │ ← Sub-toggle
│  └──────────────────────────────────────┘   │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┐     │
│  │ MON │ TUE │ WED │ THU │ FRI │ SAT │     │ ← Week Grid
│  │  8  │  6  │  9  │  3  │  7  │  2  │     │   (harmony)
│  └─────┴─────┴─────┴─────┴─────┴─────┘     │
│  📊 Weekly Insights                          │
│  📈 Energy Flow Chart                        │
└──────────────────────────────────────────────┘
```

## Color Coding

### Harmony Score Colors
- **9-10**: 🟢 Green (Best Days) - `bg-green-100`
- **7-8**: 🟡 Yellow (Good Days) - `bg-yellow-100`
- **4-6**: 🟠 Orange (Moderate) - `bg-orange-100`
- **0-3**: 🔴 Red (Rest Days) - `bg-red-100`

### Button States
- **Active**: `bg-green-500 text-white shadow-lg scale-105`
- **Inactive**: `bg-gray-100 text-gray-600 hover:bg-gray-200`

## Responsive Behavior

### Desktop (1024px+)
```
┌──────────────────────────────────────────────┐
│              Full View Toggle                │
│  [📅 Classic View]  [✨ Advanced View]      │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │          Week Grid (7 columns)         │ │
│  └────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌─────────────────────┐
│   View Toggle       │
│ [Classic] [Advanced]│
│                     │
│ ┌─────────────────┐ │
│ │ Week Grid       │ │
│ │ (2 columns)     │ │
│ │ Stack vertically│ │
│ └─────────────────┘ │
└─────────────────────┘
```

## Integration Points

### Data Flow
```
IlmHurufPanel.generateWeeklyGuidance()
    ↓
results = {
    profile: UserProfile
    weeklySummary: WeeklySummaryType
    harmonyType: HarmonyType
    dominantForce: DominantForceType
}
    ↓
View Toggle Selection
    ↓
┌─────────────────┬──────────────────┐
│  Classic View   │  Advanced View   │
│  WeeklyResults  │  WeeklyGuidance  │
├─────────────────┼──────────────────┤
│ results (full)  │ weekDays         │
│ selectedDay     │ userElement      │
│ setSelectedDay  │ userPlanet       │
└─────────────────┴──────────────────┘
```

### State Management
```typescript
// Added to IlmHurufPanel
const [weeklyView, setWeeklyView] = useState<'classic' | 'advanced'>('classic');

// Usage in render
{weeklyView === 'classic' ? (
  <WeeklyResults ... />
) : (
  <WeeklyGuidance 
    weekDays={results.weeklySummary.days}
    userElement={results.profile.element}
    userPlanet={results.profile.kawkab}
  />
)}
```

## Component Props

### WeeklyResults (Existing)
```typescript
{
  results: {
    profile: UserProfile;
    weeklySummary: WeeklySummaryType;
    harmonyType: HarmonyType;
    dominantForce: DominantForceType;
  };
  selectedDay: string | null;
  setSelectedDay: (day: string | null) => void;
}
```

### WeeklyGuidance (New)
```typescript
{
  weekDays: DailyReading[];  // 7-day array from weeklySummary.days
  userElement: string;        // From profile.element (Fire/Water/Air/Earth)
  userPlanet: string;         // From profile.kawkab (Sun/Moon/Mars/etc.)
}
```

## Translation Support

### Button Labels
- **English**: "Classic View" / "Advanced View"
- **French**: "Vue Classique" / "Vue Avancée"

### Dynamic Based on Language
```typescript
{language === 'fr' ? 'Vue Classique' : 'Classic View'}
```

## Accessibility

### Keyboard Navigation
- ✅ Tab through toggle buttons
- ✅ Enter/Space to activate
- ✅ Focus visible states

### Screen Readers
- ✅ Semantic HTML (buttons, sections)
- ✅ ARIA labels on interactive elements
- ✅ Descriptive text for data visualizations

### Color Contrast
- ✅ WCAG AA compliant
- ✅ Dark mode support
- ✅ High contrast ratio (4.5:1+)

---

**Status**: ✅ Integration Complete
**Compatibility**: Desktop, Tablet, Mobile
**Browsers**: Chrome, Firefox, Safari, Edge (modern versions)
