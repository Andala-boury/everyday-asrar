/**
 * SEO Configuration for Asrār Everyday
 * Centralized metadata and SEO settings for the application
 */

import { translations } from './translations';

type Language = 'en' | 'fr';

/**
 * Get SEO configuration with language-specific titles
 * @param language - The current language ('en' or 'fr')
 */
export const getSeoConfig = (language: Language = 'en') => {
  const t = translations[language];
  
  return {
    // Site configuration
    siteName: 'Asrār Everyday',
    siteDescription:
      language === 'en'
        ? 'Explore the Islamic sciences of Letter Numerology (ʿIlm al-Ḥurūf) and Number Science (ʿIlm al-ʿAdad). Calculate Abjad values, discover elemental associations, and receive traditional spiritual guidance based on classical sources.'
        : 'Explorez les sciences islamiques de la Numérologie des Lettres (ʿIlm al-Ḥurūf) et de la Science des Nombres (ʿIlm al-ʿAdad). Calculez les valeurs Abjad, découvrez les associations élémentaires et recevez des conseils spirituels traditionnels basés sur des sources classiques.',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://asrar-everyday.vercel.app',
    locale: language === 'en' ? 'en_US' : 'fr_FR',
    supportedLocales: ['en_US', 'fr_FR', 'ar_SA'],

    // Title configuration - using translations
    title: t.seo.siteTitle,
    titleTemplate: t.seo.titleTemplate,

  // Keywords
  keywords: [
    'abjad',
    'ilm al huruf',
    'ilm al adad',
    'islamic numerology',
    'arabic letters',
    'huruf',
    'adad',
    'islamic sciences',
    'sufism',
    'tijani',
    'west african islam',
    'islamic esotericism',
    'gematria',
    'abjad calculator',
    'jafr',
    'letter science',
    'number science',
    'islamic culture',
    'traditional islamic learning',
  ],

  // Disclaimers
  disclaimers: {
    main: 'Educational and cultural exploration tool only - not for fortune-telling, divination, or religious rulings.',
    consultation:
      'Consult qualified Islamic scholars (ʿUlamāʾ) for religious guidance and fatwas.',
    accuracy:
      'Results based on classical calculations; use for educational and cultural study only.',
  },

  // Branding colors
  theme: {
    light: '#4f46e5', // indigo-600
    dark: '#312e81', // indigo-900
  },

  // Social media
  socialMedia: {
    twitterHandle: '@AsrarEveryday', // Update with actual handle
    ogImage: '/og-image.png',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },

  // Creator/Organization info
  creator: {
    name: 'Asrār Everyday',
    url: 'https://asrar-everyday.vercel.app',
  },

  // Categories
  category: 'Education',
  classification: 'Islamic Sciences',

  // Robots configuration
  robotsConfig: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },

  // Structured data helpers
  getSchemaOrganization() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.siteName,
      url: this.baseUrl,
      logo: `${this.baseUrl}/logo.png`,
      description: this.siteDescription,
      sameAs: [
        // Add social media URLs here
      ],
    };
  },

  getSchemaWebSite() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      url: this.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };
  },

  getSchemaEducationalResource() {
    return {
      '@context': 'https://schema.org',
      '@type': 'EducationalResource',
      name: this.title,
      description: this.siteDescription,
      url: this.baseUrl,
      author: {
        '@type': 'Organization',
        name: this.siteName,
      },
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
      },
      inLanguage: ['en', 'fr', 'ar'],
      teaches: {
        '@type': 'DefinedTerm',
        name: 'Islamic Letter Science and Number Science',
      },
    };
  },
  };
};

// Default export for English (backward compatibility)
export const seoConfig = getSeoConfig('en');

export default seoConfig;
