# OG Image Creation Guide

## Quick Reference

**Required Image:**
- Filename: `/public/og-image.png`
- Dimensions: **1200 × 630 pixels** (exact)
- Format: PNG or JPG (PNG recommended for transparency)
- Purpose: Social media preview when link is shared on Twitter, Facebook, LinkedIn, etc.

---

## Option 1: Quick & Free (Canva)

### Steps:
1. Go to [canva.com](https://www.canva.com)
2. Create free account
3. Search for template: "Open Graph Image" or "Social Media Image"
4. Create custom design with 1200x630 dimensions
5. Add elements:
   - **Background**: Use indigo gradient (#4f46e5 to #312e81)
   - **Text**: "Asrār Everyday - ʿIlm al-Ḥurūf & ʿIlm al-ʿAdad Calculator"
   - **Subtitle**: "Explore Islamic Letter & Number Science"
   - **Logo**: Add your app logo if available
   - **Colors**: Use theme indigo (#4f46e5) and complementary colors
6. Download as PNG
7. Place in `/public/og-image.png`

---

## Option 2: Code-Generated (Node.js with Sharp)

If you prefer to generate it programmatically:

```bash
npm install sharp
```

Create `scripts/generate-og-image.js`:

```javascript
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../public');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const width = 1200;
const height = 630;

// Create SVG with gradients
const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#312e81;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#grad1)"/>
  
  <!-- Decorative circles -->
  <circle cx="200" cy="100" r="80" fill="#818cf8" opacity="0.2"/>
  <circle cx="1000" cy="500" r="120" fill="#c7d2fe" opacity="0.1"/>
  
  <!-- Main title -->
  <text x="60" y="200" font-size="56" font-weight="bold" fill="white" font-family="Arial, sans-serif">
    Asrār Everyday
  </text>
  
  <!-- Subtitle -->
  <text x="60" y="320" font-size="42" fill="#c7d2fe" font-family="Arial, sans-serif">
    ʿIlm al-Ḥurūf &amp; ʿIlm al-ʿAdad
  </text>
  
  <!-- Descriptive text -->
  <text x="60" y="420" font-size="28" fill="#dbeafe" font-family="Arial, sans-serif">
    Islamic Letter &amp; Number Science Explorer
  </text>
  
  <!-- Website URL -->
  <text x="60" y="550" font-size="24" fill="#a5b4fc" font-family="Arial, sans-serif">
    asrar-everyday.vercel.app
  </text>
</svg>
`;

// Convert SVG to PNG
sharp(Buffer.from(svg))
  .png()
  .toFile(path.join(outputDir, 'og-image.png'), (err, info) => {
    if (err) {
      console.error('Error generating OG image:', err);
      process.exit(1);
    }
    console.log('✅ OG image generated successfully:', info);
  });
```

Run it:
```bash
node scripts/generate-og-image.js
```

---

## Option 3: Use Figma (Professional Design)

### Steps:
1. Go to [figma.com](https://www.figma.com) (free account)
2. Create new file
3. Canvas size: 1200 × 630
4. Design elements:
   - Background: Indigo gradient (use color picker: #4f46e5 → #312e81)
   - Text layers with app name and description
   - Optional: Add geometric shapes or patterns
5. Export as PNG: File → Export → Download PNG
6. Place in `/public/og-image.png`

**Figma OG Image Templates:**
- Search Community: "Open Graph Image 1200x630"
- Many free templates available

---

## Option 4: Design in Photoshop/GIMP (Advanced)

1. Create new image: 1200 × 630 pixels @ 72 DPI
2. Add gradient background using theme colors
3. Add text layers with title and subtitle
4. Export as PNG

---

## Design Best Practices

### Colors to Use:
- **Primary**: #4f46e5 (indigo-600)
- **Dark**: #312e81 (indigo-900)
- **Light**: #c7d2fe (indigo-200)
- **Accent**: #818cf8 (indigo-400)

### Layout Suggestions:
```
+--------------------------------------------------+
|                                                  |
|  [Logo/Icon]                                     |
|                                                  |
|  ASRĀR EVERYDAY                                 |
|                                                  |
|  ʿIlm al-Ḥurūf & ʿIlm al-ʿAdad                 |
|                                                  |
|  Islamic Letter & Number Science Explorer       |
|                                                  |
|  asrar-everyday.vercel.app                      |
|                                                  |
+--------------------------------------------------+
  1200px ← → 630px height
```

### Typography:
- **Main Title**: Large, bold, white (48-56pt)
- **Subtitle**: Medium, colored (32-42pt)
- **Description**: Smaller (24-28pt)
- **URL**: Small, subtle (20-24pt)

### Common Mistakes to Avoid:
- ❌ Text too small (hard to read on mobile)
- ❌ Image too complex/busy
- ❌ Poor color contrast (text must be readable)
- ❌ Dimensions not exactly 1200×630
- ❌ Text too close to edges (safe margin: 60px)

---

## Testing Your OG Image

After creating the image:

### 1. Place file in correct location:
```
c:\hadad\
└── public/
    └── og-image.png  ✅
```

### 2. Test locally:
```bash
npm run build
npm run start
# Visit http://localhost:3000
```

### 3. Validate with tools:
- **metatags.io**: https://metatags.io
  - Enter: http://localhost:3000
  - Scroll down to see preview

- **Open Graph Checker**: https://www.opengraphchecker.com/
  - Enter your production URL once deployed

- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
  - More detailed metadata analysis

- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
  - Specific to Twitter/X cards

### 4. Production testing:
After deploying to Vercel:
```bash
# Test on production URL
https://asrar-everyday.vercel.app
```

Then share the link on:
- Twitter (check preview before posting)
- Facebook (see how it renders)
- LinkedIn
- Discord
- Telegram

---

## Sample SVG Template

If you want to generate via SVG programmatically, here's a ready-to-use template:

```svg
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5" />
      <stop offset="100%" style="stop-color:#312e81" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#grad)"/>
  
  <!-- Decorative elements -->
  <circle cx="200" cy="100" r="80" fill="#818cf8" opacity="0.2"/>
  <circle cx="1000" cy="500" r="120" fill="#c7d2fe" opacity="0.1"/>
  <polygon points="100,630 200,500 0,500" fill="#4f7ce5" opacity="0.1"/>
  
  <!-- Title -->
  <text x="60" y="200" font-size="56" font-weight="bold" fill="white" font-family="system-ui, -apple-system, sans-serif">
    Asrār Everyday
  </text>
  
  <!-- Subtitle -->
  <text x="60" y="320" font-size="42" fill="#c7d2fe" font-family="system-ui, -apple-system, sans-serif">
    Islamic Sciences Explorer
  </text>
  
  <!-- Description -->
  <text x="60" y="420" font-size="28" fill="#dbeafe" font-family="system-ui, -apple-system, sans-serif">
    Letter Numerology • Number Science
  </text>
  
  <!-- URL -->
  <text x="60" y="550" font-size="20" fill="#a5b4fc" font-family="system-ui, -apple-system, sans-serif">
    asrar-everyday.vercel.app
  </text>
</svg>
```

---

## File Naming Notes

The metadata in your `app/layout.tsx` references:
```typescript
images: [
  {
    url: '/og-image.png',  // This path is relative to /public
    width: 1200,
    height: 630,
    alt: 'Asrār Everyday - Islamic Sciences Calculator',
    type: 'image/png',
  },
]
```

So your file must be named exactly: **`og-image.png`** (lowercase, in `/public/`)

---

## Troubleshooting

### Image not showing on social media?
1. ✅ File exists at `/public/og-image.png`
2. ✅ Dimensions are exactly 1200×630
3. ✅ File size < 5MB (usually auto-optimized)
4. ✅ Clear browser cache
5. ✅ Verify on metatags.io before deploying

### Image looks pixelated?
- Ensure you're saving at 1200×630 (not scaled from smaller size)
- Use PNG format (better quality than JPG for this size)
- Minimum resolution: 1200×630

### Metadata not updating on social platforms?
- Social platforms cache OG images
- Use debuggers to force refresh:
  - Facebook: https://developers.facebook.com/tools/debug/
  - Twitter: https://cards-dev.twitter.com/validator
  - LinkedIn: https://www.linkedin.com/post-inspector/

---

## Quick Deployment Checklist

- [ ] Image created: `/public/og-image.png` (1200×630)
- [ ] File format: PNG
- [ ] Metadata in `app/layout.tsx` points to correct path
- [ ] Tested locally with metatags.io
- [ ] Deployed to Vercel
- [ ] Tested on production URL
- [ ] Shared on social media to verify preview

---

**Recommended:** Use Canva (Option 1) for quickest results. Takes ~15 minutes total.

**Alternative:** Use the SVG generator script (Option 2) if you prefer code-based solution.

For professional design, use Figma (Option 3) with community templates.
