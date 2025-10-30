# SEO Implementation Guide for Asrār Everyday

## Overview

This document describes the comprehensive SEO implementation for the Asrār Everyday Next.js 14 application, including metadata, Open Graph tags, Twitter cards, and structured data.

## Current Implementation

### 1. Root Layout Metadata (`app/layout.tsx`)

The root layout contains all global SEO metadata that applies to the entire application:

**Key Features:**
- ✅ Complete title and description with keywords
- ✅ Open Graph (OG) tags for social sharing
- ✅ Twitter Card support for beautiful Twitter previews
- ✅ Viewport and theme color configuration for mobile
- ✅ Robots meta tags for search engine indexing
- ✅ Canonical URL configuration
- ✅ Multi-language alternate links (en, fr, ar)
- ✅ Structured data support through JSON-LD

**Metadata Includes:**
- Title: "Asrār Everyday - ʿIlm al-Ḥurūf & ʿIlm al-ʿAdad Calculator"
- Description: Comprehensive description with educational disclaimers
- Keywords: 20+ targeted keywords including abjad, ilm al huruf, sufism, etc.
- Theme colors: #4f46e5 (light), #312e81 (dark)
- Robots: Configured for optimal Google indexing
- Language alternates: English, French, Arabic

### 2. Home Page Metadata (`app/page.tsx`)

Page-specific metadata for the home page that complements root layout metadata:

**Features:**
- Page-specific Open Graph tags
- Twitter card configuration
- Disclaimer text in description
- Beautiful social preview images

### 3. SEO Configuration File (`src/lib/seoConfig.ts`)

Centralized configuration for SEO settings with reusable helpers:

**Includes:**
- Site configuration (name, description, URL)
- Keyword lists
- Disclaimer text
- Theme colors
- Social media configuration
- Helper methods for JSON-LD structured data

## Environment Configuration

Create a `.env.local` file based on `.env.example`:

```bash
# For production (Vercel)
NEXT_PUBLIC_BASE_URL=https://asrar-everyday.vercel.app

# For development (local)
# NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## What's Included

### ✅ Essential SEO Tags

1. **Meta Title & Description**
   - Optimized for search engines
   - Clear, keyword-rich content
   - Includes educational disclaimer

2. **Keywords**
   - 20+ relevant keywords
   - Covers: abjad, ilm al huruf, islamic numerology, sufism, tijani, etc.
   - Includes related terms: gematria, jafr, islamic sciences

3. **Open Graph (OG) Tags**
   - OG:title, OG:description, OG:type, OG:url
   - OG:locale with language alternates (en_US, fr_FR, ar_SA)
   - OG:image (1200x630 px recommended)
   - Site name and article metadata

4. **Twitter Cards**
   - Card type: summary_large_image
   - Title, description, image
   - Beautiful preview on Twitter/X

5. **Mobile & Viewport**
   - Device-width responsive design
   - Initial-scale and maximum-scale settings
   - Theme colors for browser chrome (light & dark)

6. **Robots & Indexing**
   - Standard robots: index, follow
   - Google Bot specific configuration
   - Image and video preview settings

7. **Canonical URLs**
   - Prevents duplicate content issues
   - Proper language alternate links (hreflang)

8. **Character Set**
   - UTF-8 encoding for proper Arabic/Unicode support

## Next Steps & Additional Resources

### 1. Create OG Image
You need to create an image file at `/public/og-image.png`:
- **Dimensions:** 1200x630 pixels
- **Format:** PNG or JPG
- **Content:** Application logo/branding with title
- **Design Tip:** Use indigo colors (#4f46e5) with Arabic/English text

Tools to create OG images:
- Canva (free templates)
- Figma
- Manual tools like GIMP or Photoshop

### 2. Add Favicon
Create favicon files in `/public`:
- `favicon.ico` - 32x32 or 64x64
- `icon.png` - 192x192 (Android Chrome)
- `apple-touch-icon.png` - 180x180 (iOS)

### 3. Create robots.txt (`/public/robots.txt`)

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

# Allow Google-specific crawling
User-agent: Googlebot
Allow: /

# Sitemap location (if you create one)
Sitemap: https://asrar-everyday.vercel.app/sitemap.xml
```

### 4. Add Structured Data (JSON-LD)

Consider adding in future versions:

```typescript
// In a new file: app/layout.tsx (in head)
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(seoConfig.getSchemaOrganization()) }}
/>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(seoConfig.getSchemaWebSite()) }}
/>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(seoConfig.getSchemaEducationalResource()) }}
/>
```

### 5. Create sitemap.xml

Generate dynamic sitemap for better SEO:

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://asrar-everyday.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
```

### 6. Multilingual Support

For multilingual routes (French, Arabic):

```typescript
// Create app/[locale]/page.tsx structure
// Update language alternates in metadata
// Use locale parameter in layout

export const metadata: Metadata = {
  alternates: {
    languages: {
      'en-US': '/en',
      'fr-FR': '/fr',
      'ar-SA': '/ar',
    },
  },
}
```

### 7. Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: https://asrar-everyday.vercel.app
3. Verify ownership via:
   - HTML file upload
   - Meta tag in HTML head
   - Google Analytics
   - Google Tag Manager
4. Submit sitemap.xml

### 8. Schema.org Structured Data

The `seoConfig.ts` file includes helper methods for JSON-LD structured data:

- `getSchemaOrganization()` - Organization schema
- `getSchemaWebSite()` - WebSite schema with search action
- `getSchemaEducationalResource()` - Educational content schema

These help search engines better understand your content.

## SEO Best Practices Implemented

✅ **Semantic HTML** - Proper heading hierarchy and semantic tags  
✅ **Mobile Responsive** - Viewport configuration for all devices  
✅ **Performance** - Next.js 14 optimizations included  
✅ **Accessibility** - Semantic markup and alt text  
✅ **Social Sharing** - OG and Twitter cards configured  
✅ **International** - Language alternates and hreflang support  
✅ **Content** - Educational disclaimers and accurate descriptions  
✅ **Technical SEO** - Canonical URLs, robots config, charset  

## Monitoring & Analytics

Recommended tools:
- **Google Search Console** - Monitor search performance
- **Google Analytics 4** - Track user behavior
- **Lighthouse** - Performance and SEO audits
- **Semrush or Ahrefs** - Competitor analysis and keyword tracking

## Testing Your SEO

### 1. Test Meta Tags
- Use browser DevTools → Elements → `<head>`
- Visit [metatags.io](https://metatags.io) and enter your URL
- Check Open Graph tags render correctly

### 2. Test Social Cards
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 3. Google Search Console
- Check indexation status
- Monitor search performance
- Review crawl errors

### 4. Lighthouse Audit
```bash
npm run build
npm run start
# Then use Chrome DevTools → Lighthouse
```

## Important Notes

### Educational Disclaimer
All metadata includes clear disclaimers that this is an educational tool:
- "Educational and cultural exploration tool only"
- "Not for fortune-telling, divination, or religious rulings"
- "Consult qualified Islamic scholars (ʿUlamāʾ) for religious guidance"

### Unicode/Arabic Support
- Charset: UTF-8 (supports Arabic, French, English)
- Metadata includes Arabic diacritics: ʿIlm al-Ḥurūf (ʿ = ع, ̄ = macron)
- All keywords include proper transliterations

### Performance Impact
- Metadata configuration is zero-runtime overhead
- Generated at build time by Next.js
- No client-side performance impact

## Troubleshooting

### OG Image Not Showing
1. Ensure `/public/og-image.png` exists
2. Image must be at least 1200x630 px
3. Clear cache and re-test on [metatags.io](https://metatags.io)

### Language Alternates Not Working
1. Verify `.env.local` has correct `NEXT_PUBLIC_BASE_URL`
2. Check alternate routes exist (if using i18n routing)
3. Use [SEO Yoast](https://yoast.com/seo-tools/) to validate

### Google Not Indexing
1. Submit to Google Search Console
2. Check robots.txt allows crawling
3. Verify no `noindex` tags in metadata
4. Wait 24-48 hours for initial indexing

## File Locations

```
c:\hadad\
├── app/
│   ├── layout.tsx          ✅ Root metadata
│   └── page.tsx            ✅ Home page metadata
├── src/
│   └── lib/
│       └── seoConfig.ts    ✅ Centralized SEO config
├── .env.example            ✅ Environment template
└── /public/
    ├── og-image.png        ⏳ TODO: Create this
    ├── favicon.ico         ⏳ TODO: Create this
    ├── icon.png            ⏳ TODO: Create this
    └── robots.txt          ⏳ TODO: Create this
```

## References

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Web.dev SEO Guide](https://web.dev/lighthouse-seo/)

---

**Last Updated:** October 30, 2025  
**Next.js Version:** 14.x  
**App Router:** Yes (using `'use client'` for interactive components)

