/**
 * Planetary Spiritual Integration
 * Authentic Islamic spiritual connections for each planet
 * Based on classical ʿIlm al-Ḥurūf and traditional Islamic wisdom
 */

export interface PlanetarySpiritualInfo {
  planet: string;
  planetArabic: string;
  divineNames: {
    primary: {
      number: number;
      arabic: string;
      transliteration: string;
      meaningEn: string;
      meaningFr: string;
      spiritualQuality: string;
      spiritualQualityFr: string;
      dhikrCount: number;
      significance: string;
      significanceFr: string;
    };
    secondary: Array<{
      number: number;
      arabic: string;
      transliteration: string;
      meaningEn: string;
      meaningFr: string;
    }>;
  };
  quranConnection: {
    primaryVerse: {
      surah: number;
      ayah: number;
      textArabic: string;
      translationEn: string;
      translationFr: string;
      reference: string;
      relevance: string;
      relevanceFr: string;
    };
    reflectionPrompt: string;
    reflectionPromptFr: string;
  };
  classicalWisdom: {
    quote: string;
    quoteFr: string;
    source: string;
    scholar: string;
  };
  spiritualGuidance: {
    focus: string;
    focusFr: string;
    practice: string;
    practiceFr: string;
    caution: string;
    cautionFr: string;
  };
}

export const PLANETARY_SPIRITUALITY: Record<string, PlanetarySpiritualInfo> = {
  Sun: {
    planet: 'Sun',
    planetArabic: 'الشمس',
    divineNames: {
      primary: {
        number: 92,
        arabic: 'النُّور',
        transliteration: 'An-Nūr',
        meaningEn: 'The Light',
        meaningFr: 'La Lumière',
        spiritualQuality: 'Divine Illumination, Clarity, Guidance',
        spiritualQualityFr: 'Illumination Divine, Clarté, Guidance',
        dhikrCount: 100,
        significance: 'Reciting An-Nūr brings clarity to the heart and illuminates the path ahead. The Sun hour channels divine light.',
        significanceFr: 'Réciter An-Nūr apporte la clarté au cœur et illumine le chemin. L\'heure du Soleil canalise la lumière divine.'
      },
      secondary: [
        {
          number: 93,
          arabic: 'الهَادِي',
          transliteration: 'Al-Hādī',
          meaningEn: 'The Guide',
          meaningFr: 'Le Guide'
        },
        {
          number: 37,
          arabic: 'الكَبِير',
          transliteration: 'Al-Kabīr',
          meaningEn: 'The Greatest',
          meaningFr: 'Le Grand'
        }
      ]
    },
    quranConnection: {
      primaryVerse: {
        surah: 91,
        ayah: 1,
        textArabic: 'وَالشَّمْسِ وَضُحَاهَا',
        translationEn: 'By the sun and its brightness',
        translationFr: 'Par le soleil et sa clarté',
        reference: 'Surah Ash-Shams 91:1',
        relevance: 'Allah takes an oath by the sun, highlighting its role as a source of divine light and guidance in creation.',
        relevanceFr: 'Allah prête serment par le soleil, soulignant son rôle comme source de lumière divine et de guidance dans la création.'
      },
      reflectionPrompt: 'How can you illuminate the path for others today?',
      reflectionPromptFr: 'Comment pouvez-vous illuminer le chemin des autres aujourd\'hui ?'
    },
    classicalWisdom: {
      quote: 'The Sun represents the divine light of certainty (yaqīn) that dispels all darkness of doubt.',
      quoteFr: 'Le Soleil représente la lumière divine de la certitude (yaqīn) qui dissipe toute obscurité du doute.',
      source: 'Traditional ʿIlm al-Ḥurūf teachings',
      scholar: 'Al-Būnī tradition'
    },
    spiritualGuidance: {
      focus: 'Leadership, clarity, decisive action, inspiring others',
      focusFr: 'Leadership, clarté, action décisive, inspirer les autres',
      practice: 'Recite An-Nūr (100x) seeking clarity. Make important decisions with confidence.',
      practiceFr: 'Récitez An-Nūr (100x) en cherchant la clarté. Prenez des décisions importantes avec confiance.',
      caution: 'Avoid arrogance. True light serves others, not the ego.',
      cautionFr: 'Évitez l\'arrogance. La vraie lumière sert les autres, pas l\'ego.'
    }
  },

  Moon: {
    planet: 'Moon',
    planetArabic: 'القمر',
    divineNames: {
      primary: {
        number: 30,
        arabic: 'اللَّطِيف',
        transliteration: 'Al-Laṭīf',
        meaningEn: 'The Subtle One',
        meaningFr: 'Le Subtil',
        spiritualQuality: 'Gentle Grace, Subtlety, Inner Wisdom',
        spiritualQualityFr: 'Grâce Douce, Subtilité, Sagesse Intérieure',
        dhikrCount: 129,
        significance: 'Al-Laṭīf opens subtle spiritual perception and emotional wisdom. The Moon hour nurtures receptivity.',
        significanceFr: 'Al-Laṭīf ouvre la perception spirituelle subtile et la sagesse émotionnelle. L\'heure de la Lune nourrit la réceptivité.'
      },
      secondary: [
        {
          number: 2,
          arabic: 'الرَّحِيم',
          transliteration: 'Ar-Raḥīm',
          meaningEn: 'The Most Merciful',
          meaningFr: 'Le Très Miséricordieux'
        },
        {
          number: 26,
          arabic: 'السَّمِيع',
          transliteration: 'As-Samīʿ',
          meaningEn: 'The All-Hearing',
          meaningFr: 'L\'Audient'
        }
      ]
    },
    quranConnection: {
      primaryVerse: {
        surah: 36,
        ayah: 39,
        textArabic: 'وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ',
        translationEn: 'And the moon - We have determined for it phases',
        translationFr: 'Et la lune, Nous lui avons déterminé des phases',
        reference: 'Surah Ya-Sin 36:39',
        relevance: 'The lunar phases teach us about divine timing, cycles, and the wisdom of gradual change.',
        relevanceFr: 'Les phases lunaires nous enseignent le timing divin, les cycles et la sagesse du changement graduel.'
      },
      reflectionPrompt: 'What phase of life are you in? What needs to grow or release?',
      reflectionPromptFr: 'Dans quelle phase de vie êtes-vous ? Qu\'est-ce qui doit croître ou être libéré ?'
    },
    classicalWisdom: {
      quote: 'The Moon governs the realm of the soul (nafs) and teaches the wisdom of receptivity and emotional intelligence.',
      quoteFr: 'La Lune gouverne le royaume de l\'âme (nafs) et enseigne la sagesse de la réceptivité et de l\'intelligence émotionnelle.',
      source: 'Futūḥāt al-Makkiyya',
      scholar: 'Ibn ʿArabī'
    },
    spiritualGuidance: {
      focus: 'Emotional healing, intuition, reflection, nurturing relationships',
      focusFr: 'Guérison émotionnelle, intuition, réflexion, nourrir les relations',
      practice: 'Recite Al-Laṭīf (129x) for gentle guidance. Practice deep listening and empathy.',
      practiceFr: 'Récitez Al-Laṭīf (129x) pour une guidance douce. Pratiquez l\'écoute profonde et l\'empathie.',
      caution: 'Avoid emotional overwhelm. Balance feelings with wisdom (ḥikma).',
      cautionFr: 'Évitez le débordement émotionnel. Équilibrez les sentiments avec la sagesse (ḥikma).'
    }
  },

  Mercury: {
    planet: 'Mercury',
    planetArabic: 'عطارد',
    divineNames: {
      primary: {
        number: 19,
        arabic: 'العَلِيم',
        transliteration: 'Al-ʿAlīm',
        meaningEn: 'The All-Knowing',
        meaningFr: 'L\'Omniscient',
        spiritualQuality: 'Divine Knowledge, Communication, Mental Clarity',
        spiritualQualityFr: 'Connaissance Divine, Communication, Clarté Mentale',
        dhikrCount: 150,
        significance: 'Al-ʿAlīm enhances reception of divine knowledge and clear communication. Mercury hour opens the mind.',
        significanceFr: 'Al-ʿAlīm améliore la réception de la connaissance divine et la communication claire. L\'heure de Mercure ouvre l\'esprit.'
      },
      secondary: [
        {
          number: 46,
          arabic: 'الحَكِيم',
          transliteration: 'Al-Ḥakīm',
          meaningEn: 'The Wise',
          meaningFr: 'Le Sage'
        },
        {
          number: 31,
          arabic: 'الخَبِير',
          transliteration: 'Al-Khabīr',
          meaningEn: 'The All-Aware',
          meaningFr: 'Le Bien Informé'
        }
      ]
    },
    quranConnection: {
      primaryVerse: {
        surah: 2,
        ayah: 269,
        textArabic: 'يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ ۚ وَمَن يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا',
        translationEn: 'He gives wisdom to whom He wills, and whoever has been given wisdom has certainly been given much good',
        translationFr: 'Il donne la sagesse à qui Il veut. Et celui à qui la sagesse est donnée, vraiment, c\'est un bien immense qui lui est donné',
        reference: 'Surah Al-Baqarah 2:269',
        relevance: 'Mercury hours are blessed for seeking divine wisdom (ḥikma) through study, communication, and learning.',
        relevanceFr: 'Les heures de Mercure sont bénies pour chercher la sagesse divine (ḥikma) par l\'étude, la communication et l\'apprentissage.'
      },
      reflectionPrompt: 'What knowledge is calling to you? How will you use it for good?',
      reflectionPromptFr: 'Quelle connaissance vous appelle ? Comment l\'utiliserez-vous pour le bien ?'
    },
    classicalWisdom: {
      quote: 'Mercury governs the pen and tongue - the instruments of knowledge transmission. Use them with truth (ḥaqq).',
      quoteFr: 'Mercure gouverne la plume et la langue - les instruments de transmission de la connaissance. Utilisez-les avec vérité (ḥaqq).',
      source: 'Shams al-Maʿārif',
      scholar: 'Al-Būnī'
    },
    spiritualGuidance: {
      focus: 'Learning, teaching, writing, communication, business, contracts',
      focusFr: 'Apprentissage, enseignement, écriture, communication, affaires, contrats',
      practice: 'Recite Al-ʿAlīm (150x) before study. Engage in meaningful dialogue and written reflection.',
      practiceFr: 'Récitez Al-ʿAlīm (150x) avant l\'étude. Engagez-vous dans un dialogue significatif et une réflexion écrite.',
      caution: 'Avoid gossip (ghība) and empty speech. Knowledge without action is burden.',
      cautionFr: 'Évitez la médisance (ghība) et les paroles vides. La connaissance sans action est un fardeau.'
    }
  },

  Venus: {
    planet: 'Venus',
    planetArabic: 'الزهرة',
    divineNames: {
      primary: {
        number: 47,
        arabic: 'الوَدُود',
        transliteration: 'Al-Wadūd',
        meaningEn: 'The Loving',
        meaningFr: 'Le Bien-Aimant',
        spiritualQuality: 'Divine Love, Beauty, Harmony, Abundance',
        spiritualQualityFr: 'Amour Divin, Beauté, Harmonie, Abondance',
        dhikrCount: 20,
        significance: 'Al-Wadūd cultivates divine love and appreciation of beauty. Venus hour opens the heart to harmony.',
        significanceFr: 'Al-Wadūd cultive l\'amour divin et l\'appréciation de la beauté. L\'heure de Vénus ouvre le cœur à l\'harmonie.'
      },
      secondary: [
        {
          number: 17,
          arabic: 'الرَّزَّاق',
          transliteration: 'Ar-Razzāq',
          meaningEn: 'The Provider',
          meaningFr: 'Le Pourvoyeur'
        },
        {
          number: 8,
          arabic: 'العَزِيز',
          transliteration: 'Al-ʿAzīz',
          meaningEn: 'The Almighty',
          meaningFr: 'Le Tout-Puissant'
        }
      ]
    },
    quranConnection: {
      primaryVerse: {
        surah: 85,
        ayah: 14,
        textArabic: 'وَهُوَ الْغَفُورُ الْوَدُودُ',
        translationEn: 'And He is the Forgiving, the Loving',
        translationFr: 'Et c\'est Lui le Pardonneur, le Bien-Aimant',
        reference: 'Surah Al-Buruj 85:14',
        relevance: 'Venus reflects divine love (maḥabba) that forgives, nurtures, and creates beauty in all relationships.',
        relevanceFr: 'Vénus reflète l\'amour divin (maḥabba) qui pardonne, nourrit et crée la beauté dans toutes les relations.'
      },
      reflectionPrompt: 'Who needs your love and kindness today? How can you create beauty?',
      reflectionPromptFr: 'Qui a besoin de votre amour et gentillesse aujourd\'hui ? Comment pouvez-vous créer la beauté ?'
    },
    classicalWisdom: {
      quote: 'Venus teaches that true beauty (jamāl) is inseparable from goodness (iḥsān). Love without righteousness is illusion.',
      quoteFr: 'Vénus enseigne que la vraie beauté (jamāl) est inséparable de la bonté (iḥsān). L\'amour sans droiture est illusion.',
      source: 'Mathnawī',
      scholar: 'Jalāl ad-Dīn Rūmī'
    },
    spiritualGuidance: {
      focus: 'Relationships, art, beauty, creativity, abundance, harmony, marriage',
      focusFr: 'Relations, art, beauté, créativité, abondance, harmonie, mariage',
      practice: 'Recite Al-Wadūd (20x) with a heart full of love. Create beauty and harmony in your surroundings.',
      practiceFr: 'Récitez Al-Wadūd (20x) avec un cœur plein d\'amour. Créez la beauté et l\'harmonie dans votre environnement.',
      caution: 'Avoid vanity and superficiality. True love serves the beloved, not the self.',
      cautionFr: 'Évitez la vanité et la superficialité. Le vrai amour sert l\'être aimé, pas le soi.'
    }
  },

  Mars: {
    planet: 'Mars',
    planetArabic: 'المريخ',
    divineNames: {
      primary: {
        number: 41,
        arabic: 'القَوِيّ',
        transliteration: 'Al-Qawiyy',
        meaningEn: 'The Strong',
        meaningFr: 'Le Fort',
        spiritualQuality: 'Divine Strength, Courage, Decisive Action',
        spiritualQualityFr: 'Force Divine, Courage, Action Décisive',
        dhikrCount: 116,
        significance: 'Al-Qawiyy provides divine strength and courage for righteous action. Mars hour empowers the will.',
        significanceFr: 'Al-Qawiyy fournit la force divine et le courage pour l\'action juste. L\'heure de Mars renforce la volonté.'
      },
      secondary: [
        {
          number: 68,
          arabic: 'القَادِر',
          transliteration: 'Al-Qādir',
          meaningEn: 'The Capable',
          meaningFr: 'Le Capable'
        },
        {
          number: 8,
          arabic: 'العَزِيز',
          transliteration: 'Al-ʿAzīz',
          meaningEn: 'The Almighty',
          meaningFr: 'Le Tout-Puissant'
        }
      ]
    },
    quranConnection: {
      primaryVerse: {
        surah: 8,
        ayah: 66,
        textArabic: 'إِن يَكُن مِّنكُمْ عِشْرُونَ صَابِرُونَ يَغْلِبُوا مِائَتَيْنِ',
        translationEn: 'If there are among you twenty who are patient and steadfast, they will overcome two hundred',
        translationFr: 'S\'il y a parmi vous vingt endurants, ils vaincront deux cents',
        reference: 'Surah Al-Anfal 8:66',
        relevance: 'Mars hours empower righteous struggle (jihād an-nafs) with divine strength when paired with patience (ṣabr).',
        relevanceFr: 'Les heures de Mars renforcent la lutte juste (jihād an-nafs) avec la force divine couplée à la patience (ṣabr).'
      },
      reflectionPrompt: 'What challenge requires your courage today? Where must you take a stand?',
      reflectionPromptFr: 'Quel défi nécessite votre courage aujourd\'hui ? Où devez-vous prendre position ?'
    },
    classicalWisdom: {
      quote: 'Mars governs the spiritual warrior (mujāhid) who battles the ego, not others. True strength is self-mastery.',
      quoteFr: 'Mars gouverne le guerrier spirituel (mujāhid) qui combat l\'ego, pas les autres. La vraie force est la maîtrise de soi.',
      source: 'Traditional Islamic spiritual warfare teachings',
      scholar: 'Classical Sufi tradition'
    },
    spiritualGuidance: {
      focus: 'Overcoming obstacles, physical activity, assertiveness, protection, righteous action',
      focusFr: 'Surmonter les obstacles, activité physique, assertivité, protection, action juste',
      practice: 'Recite Al-Qawiyy (116x) for inner strength. Take decisive action on important matters.',
      practiceFr: 'Récitez Al-Qawiyy (116x) pour la force intérieure. Prenez des mesures décisives sur des questions importantes.',
      caution: 'Avoid aggression and anger (ghaḍab). Channel strength with wisdom and mercy.',
      cautionFr: 'Évitez l\'agression et la colère (ghaḍab). Canalisez la force avec sagesse et miséricorde.'
    }
  },

  Jupiter: {
    planet: 'Jupiter',
    planetArabic: 'المشتري',
    divineNames: {
      primary: {
        number: 59,
        arabic: 'الوَاسِع',
        transliteration: 'Al-Wāsiʿ',
        meaningEn: 'The All-Encompassing',
        meaningFr: 'Le Vaste',
        spiritualQuality: 'Divine Expansion, Generosity, Boundless Wisdom',
        spiritualQualityFr: 'Expansion Divine, Générosité, Sagesse Sans Limites',
        dhikrCount: 136,
        significance: 'Al-Wāsiʿ opens doors to divine abundance and expansive blessings. Jupiter hour brings growth.',
        significanceFr: 'Al-Wāsiʿ ouvre les portes à l\'abondance divine et aux bénédictions expansives. L\'heure de Jupiter apporte la croissance.'
      },
      secondary: [
        {
          number: 35,
          arabic: 'الكَرِيم',
          transliteration: 'Al-Karīm',
          meaningEn: 'The Generous',
          meaningFr: 'Le Généreux'
        },
        {
          number: 18,
          arabic: 'الفَتَّاح',
          transliteration: 'Al-Fattāḥ',
          meaningEn: 'The Opener',
          meaningFr: 'L\'Ouvreur'
        }
      ]
    },
    quranConnection: {
      primaryVerse: {
        surah: 2,
        ayah: 261,
        textArabic: 'مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ',
        translationEn: 'The example of those who spend in the way of Allah is like a seed which grows seven spikes',
        translationFr: 'Ceux qui dépensent dans le sentier d\'Allah ressemblent à une graine d\'où naissent sept épis',
        reference: 'Surah Al-Baqarah 2:261',
        relevance: 'Jupiter hours multiply blessings (barakah) when actions are done with generosity (karam) and pure intention.',
        relevanceFr: 'Les heures de Jupiter multiplient les bénédictions (barakah) quand les actions sont faites avec générosité (karam) et intention pure.'
      },
      reflectionPrompt: 'What can you expand with generosity? Where should growth occur?',
      reflectionPromptFr: 'Que pouvez-vous étendre avec générosité ? Où la croissance doit-elle se produire ?'
    },
    classicalWisdom: {
      quote: 'Jupiter represents divine generosity that knows no bounds. Give freely, for expansion comes through service.',
      quoteFr: 'Jupiter représente la générosité divine sans limites. Donnez librement, car l\'expansion vient par le service.',
      source: 'Classical Islamic wisdom on abundance',
      scholar: 'Traditional teaching'
    },
    spiritualGuidance: {
      focus: 'Growth, expansion, generosity, teaching, higher learning, travel, prosperity',
      focusFr: 'Croissance, expansion, générosité, enseignement, études supérieures, voyage, prospérité',
      practice: 'Recite Al-Wāsiʿ (136x) seeking expansion. Give generously in charity (ṣadaqah).',
      practiceFr: 'Récitez Al-Wāsiʿ (136x) en cherchant l\'expansion. Donnez généreusement en charité (ṣadaqah).',
      caution: 'Avoid overextension and false optimism. Growth must be grounded in reality.',
      cautionFr: 'Évitez la surextension et le faux optimisme. La croissance doit être ancrée dans la réalité.'
    }
  },

  Saturn: {
    planet: 'Saturn',
    planetArabic: 'زحل',
    divineNames: {
      primary: {
        number: 46,
        arabic: 'الحَكِيم',
        transliteration: 'Al-Ḥakīm',
        meaningEn: 'The Wise',
        meaningFr: 'Le Sage',
        spiritualQuality: 'Supreme Wisdom, Patience, Divine Order',
        spiritualQualityFr: 'Sagesse Suprême, Patience, Ordre Divin',
        dhikrCount: 78,
        significance: 'Al-Ḥakīm teaches divine wisdom through patience and structure. Saturn hour brings deep understanding.',
        significanceFr: 'Al-Ḥakīm enseigne la sagesse divine par la patience et la structure. L\'heure de Saturne apporte une compréhension profonde.'
      },
      secondary: [
        {
          number: 99,
          arabic: 'الصَّبُور',
          transliteration: 'Aṣ-Ṣabūr',
          meaningEn: 'The Patient',
          meaningFr: 'Le Patient'
        },
        {
          number: 38,
          arabic: 'الحَفِيظ',
          transliteration: 'Al-Ḥafīẓ',
          meaningEn: 'The Preserver',
          meaningFr: 'Le Gardien'
        }
      ]
    },
    quranConnection: {
      primaryVerse: {
        surah: 103,
        ayah: 3,
        textArabic: 'وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
        translationEn: 'And advised each other to truth and advised each other to patience',
        translationFr: 'Se recommandent mutuellement la vérité et se recommandent mutuellement l\'endurance',
        reference: 'Surah Al-Asr 103:3',
        relevance: 'Saturn hours teach that true wisdom (ḥikma) emerges through patience (ṣabr) and commitment to truth.',
        relevanceFr: 'Les heures de Saturne enseignent que la vraie sagesse (ḥikma) émerge par la patience (ṣabr) et l\'engagement envers la vérité.'
      },
      reflectionPrompt: 'What requires your patience and persistence? What wisdom is being revealed?',
      reflectionPromptFr: 'Qu\'est-ce qui nécessite votre patience et persistance ? Quelle sagesse est révélée ?'
    },
    classicalWisdom: {
      quote: 'Saturn is the teacher of time (zamān) and consequence. It shows that all actions ripen in their season.',
      quoteFr: 'Saturne est l\'enseignant du temps (zamān) et des conséquences. Il montre que toutes les actions mûrissent en leur saison.',
      source: 'Traditional Islamic understanding of time and wisdom',
      scholar: 'Classical tradition'
    },
    spiritualGuidance: {
      focus: 'Discipline, structure, long-term planning, ancestral wisdom, mastery',
      focusFr: 'Discipline, structure, planification à long terme, sagesse ancestrale, maîtrise',
      practice: 'Recite Al-Ḥakīm (78x) seeking wisdom. Embrace discipline and commitment to worthy goals.',
      practiceFr: 'Récitez Al-Ḥakīm (78x) en cherchant la sagesse. Embrassez la discipline et l\'engagement envers des objectifs dignes.',
      caution: 'Avoid rigidity and fear. Structure serves growth, not limitation.',
      cautionFr: 'Évitez la rigidité et la peur. La structure sert la croissance, pas la limitation.'
    }
  }
};

/**
 * Get spiritual information for a specific planet
 */
export function getPlanetarySpirituality(planetName: string): PlanetarySpiritualInfo | null {
  return PLANETARY_SPIRITUALITY[planetName] || null;
}

/**
 * Get primary Divine Name for a planet
 */
export function getPrimaryDivineName(planetName: string) {
  const info = getPlanetarySpirituality(planetName);
  return info?.divineNames.primary || null;
}

/**
 * Get Quranic connection for a planet
 */
export function getQuranConnection(planetName: string) {
  const info = getPlanetarySpirituality(planetName);
  return info?.quranConnection || null;
}
