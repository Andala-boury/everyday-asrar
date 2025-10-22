# Asrār Everyday - Islamic Numerology & Life Guidance App

A modern web application for exploring ʿIlm al-Ḥurūf (Science of Letters) and Abjad numerology, following the tradition of Imam al-Būnī and classical Islamic scholarship.

## ✨ Features

### 🔢 Traditional Abjad Calculator
- **Kabīr (Grand Total)**: Sum of all letter values using classical Maghrib rules
- **Ṣaghīr (Rūḥ)**: Digital root (1-9) representing soul essence
- **Ḥadath**: Elemental classification (Fire/Water/Air/Earth)
- **Letter-by-letter breakdown**: See individual values and elements
- **Transliteration support**: Enter names in English/French, auto-convert to Arabic
- **Divine Names LEXICON**: Special handling for Allah, Rahman, Rahim, etc.

### 📊 Ḥadad Summary Analysis
- **Complete Abjad Analysis**: Kabīr, Ṣaghīr, Ḥadath, Rūḥ Ḥadad, Um Ḥadad
- **Sacred Number Resonance**: Connection to mystical numbers (7, 12, 19, 40, etc.)
- **Element Distribution**: Visual breakdown of Fire, Water, Air, Earth letters
- **Geometry Analysis**: Vertical, round, flat, angular letter patterns
- **Quranic Verses**: Relevant ayat based on numerical patterns
- **Divine Names (Asmā')**: Suggested names for dhikr practice

### 📅 Weekly Life Guidance (Al-Būnī Tradition)
- **Week at a Glance**: 7-bar interactive calendar with daily harmony scores (0-10)
- **Personal Profile**: Rūḥ number, Element, Kawkab (planet)
- **Harmony Analysis**: Complete/Partial/Conflict energies
- **Dominant Force Detection**: Soul (Rūḥ), Temperament (Element), or Timing (Kawkab)
- **Daily Micro-Tips**: 3 actionable tips per day for focus, rest, communication
- **Smart Badges**: Best Day, Gentle Day, Focus Day
- **Planetary Influences**: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn

### 🔮 Name Destiny & Spiritual Stations
- **Life Destiny**: Your soul's purpose based on Ṣaghīr
- **Soul Urge**: Inner desires (from vowels)
- **Outer Personality**: How you appear (from consonants)
- **9 Spiritual Stations**: Tawḥīd, Muʿāwana, Ibdāʿ, Istiqrār, Taḥawwul, Khidma, Ḥikma, Qudra, Kamāl
- **Practical Guidance**: Actionable advice for each station
- **Quranic References**: Verses aligned with each station

### 💞 Compatibility Analysis
- **Two-Person Comparison**: Analyze harmony between names
- **Harmony Score**: 0-100 compatibility rating
- **Relationship Dynamics**: Leader & Supporter, Twin Mystics, etc.
- **Strengths & Challenges**: Practical relationship insights
- **Element Compatibility**: Fire/Water/Air/Earth interactions

### ⏰ Divine Timing
- **Planetary Hours**: Current hour's ruling planet
- **Favorable Activities**: What to do now (study, business, rest, etc.)
- **Activities to Avoid**: Timing-sensitive warnings
- **Personal Year Cycle**: Your current 1-9 year theme

### 📜 History & Favorites
- **Persistent Storage**: All calculations saved locally
- **Star Favorites**: Quick access to important names
- **Comparison Mode**: Side-by-side analysis of two names
- **Daily Reflection**: Rotating wisdom quotes

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.33 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage

## 📁 Project Structure

```
c:\hadad\
├── app/
│   ├── page.tsx              # Main entry point
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── src/
│   ├── lib/
│   │   └── text-normalize.ts # Arabic normalization & transliteration
│   ├── components/
│   │   └── hadad-summary/    # Comprehensive Abjad analysis
│   │       ├── HadadSummaryPanel.tsx
│   │       ├── hadad-core.ts
│   │       └── types.ts
│   └── features/
│       └── ilm-huruf/        # Life Guidance (Al-Būnī)
│           ├── IlmHurufPanel.tsx
│           ├── core.ts
│           └── index.ts
├── asrar-everyday-app.tsx    # Main application component
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hadad
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

## 📖 Usage Guide

### Basic Name Analysis
1. Enter Arabic name (e.g., محمد) or use Latin text with transliteration
2. Click "Calculate" to see full analysis
3. View Kabīr, Ṣaghīr, Ḥadath, and element breakdown

### Weekly Forecast
1. Go to "Life Guidance (Al Buni)" tab
2. Click "Week at a Glance"
3. Enter your Arabic name
4. Optionally add birth date for personal cycles
5. Click "Generate Week"
6. View 7-day forecast with scores and tips
7. Click any day bar to see detailed guidance

### Compatibility Check
1. Select "Compatibility" mode
2. Enter two Arabic names
3. View harmony score and relationship dynamics

## 🎯 Core Calculations

### Maghrib Abjad Rules (Used Throughout)
- **No Shadda Doubling**: شَدَّة counted once
- **Tāʾ Marbūṭa as Hāʾ**: ة = 5 (not 400)
- **Alif Variations Unified**: ا = أ = إ = آ = 1
- **Diacritics Removed**: Only base letters counted

### Abjad Letter Values
```
ا=1   ب=2   ج=3   د=4   ه=5   و=6   ز=7   ح=8   ط=9
ي=10  ك=20  ل=30  م=40  ن=50  س=60  ع=70  ف=80  ص=90
ق=100 ر=200 ش=300 ت=400 ث=500 خ=600 ذ=700 ض=800 ظ=900 غ=1000
```

### Digital Root (Ṣaghīr)
Repeatedly sum digits until 1-9:
- 116 → 1+1+6 = 8
- 25 → 2+5 = 7

### Ḥadath (Element)
Kabīr ÷ 12, remainder determines element:
- 1-3: Fire
- 4-6: Water
- 7-9: Air
- 10-12: Earth

### Harmony Score (0-10)
- **A)** Day planet vs user element (0-3)
- **B)** Day planet vs user Kawkab (0-3)
- **C)** Rūḥ phase synergy (0-4)
- **Bands**: High (8-10), Moderate (5-7), Low (0-4)

## 🌙 Islamic Context

This app is built for **educational and cultural exploration** of traditional Islamic numerology (ʿIlm al-Ḥurūf). It follows the methodology found in classical texts like:

- **Shams al-Maʿārif** by Imam al-Būnī
- Traditional Abjad numerology
- Letter science (ʿIlm al-Ḥurūf wa al-Awfāq)

### ⚠️ Important Disclaimer

This tool is for **reflective guidance and planning** only. It is:
- ✅ A rhythm and planning helper
- ✅ Based on historical Islamic scholarship
- ✅ For self-knowledge and spiritual reflection

It is **NOT**:
- ❌ A prediction or fortune-telling tool
- ❌ Medical, legal, or financial advice
- ❌ A replacement for consulting qualified Islamic scholars
- ❌ Superstition or prohibited divination (kahanah)

Always use your own judgment and consult qualified scholars for religious guidance.

## 🎨 Design Philosophy

- **Mobile-First**: Responsive design for all devices
- **Clean & Minimal**: Focus on content, not clutter
- **Accessible**: WCAG-compliant colors and typography
- **Dark Mode**: Full support for light/dark themes
- **Reflective Tone**: Guidance, not prediction
- **Privacy-First**: All calculations done locally (no server required)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Classical Islamic scholars of ʿIlm al-Ḥurūf
- Imam al-Būnī's *Shams al-Maʿārif*
- The tradition of Maghrib Abjad calculation
- All contributors and users

## 📧 Contact

For questions, suggestions, or scholarly discussions, please open an issue on GitHub.

---

**Built with ❤️ for spiritual seekers and students of traditional Islamic sciences**

*"Know thyself to know thy Lord" - Islamic wisdom*
