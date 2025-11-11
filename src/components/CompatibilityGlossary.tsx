import React, { useState } from 'react';
import { BookMarked, Search } from 'lucide-react';

interface CompatibilityGlossaryProps {
  language?: 'en' | 'fr' | 'ar';
}

export function CompatibilityGlossary({ language = 'en' }: CompatibilityGlossaryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const isFrench = language === 'fr';

  const content = {
    en: {
      title: "Compatibility Terms Made Simple",
      subtitle: "Plain-language explanations of numerology concepts",
      searchPlaceholder: "Search terms...",
      
      terms: [
        {
          term: "ʿIlm al-Ḥurūf",
          category: "Foundation",
          simple: "Science of Letters",
          explanation: "The ancient Islamic practice of studying the numerical values and spiritual meanings of Arabic letters. Each letter is believed to carry divine energy that influences names, words, and ultimately, people's destinies."
        },
        {
          term: "Abjad System",
          category: "Foundation",
          simple: "Letter-to-Number Code",
          explanation: "The traditional system where each Arabic letter has a number value (Alif=1, Ba=2, Jim=3, etc.). This lets us convert names into numbers to reveal hidden meanings."
        },
        {
          term: "Soul Connection",
          category: "Analysis Method",
          simple: "Spiritual Alignment",
          explanation: "How well your spiritual essences match. Do you share similar life purposes, values, and spiritual orientations? High soul connection means you 'get' each other on a deep level without trying."
        },
        {
          term: "Spiritual Destiny",
          category: "Analysis Method",
          simple: "Your Spiritual Life Path",
          explanation: "The divine purpose encoded in your name. It's not about religion only—it's about your deeper calling, what makes life meaningful to you, and how you grow spiritually."
        },
        {
          term: "Personality Balance",
          category: "Analysis Method",
          simple: "Temperament Harmony",
          explanation: "How your day-to-day personalities mesh. Are you both fiery and clashing, or does one person's calm earth energy ground the other's impulsive fire? This affects daily interactions more than grand compatibility."
        },
        {
          term: "Elemental Temperament",
          category: "Personality",
          simple: "Your Basic Nature (Fire/Water/Air/Earth)",
          explanation: "Your fundamental approach to life. Fire = passionate and spontaneous. Water = emotional and intuitive. Air = intellectual and communicative. Earth = practical and stable. Understanding these helps explain why you react differently to the same situations."
        },
        {
          term: "Fire Element",
          category: "Personality",
          simple: "The Passionate Go-Getter",
          explanation: "Fire people are energetic, spontaneous, and inspiring. They bring excitement and leadership but can be impulsive or dominating. Think: 'Let's do it NOW!' Fire needs to learn patience and listen to others."
        },
        {
          term: "Water Element",
          category: "Personality",
          simple: "The Deep Feeler",
          explanation: "Water people are emotionally intelligent, nurturing, and intuitive. They feel deeply and care profoundly but can be overly sensitive or moody. Think: 'How does everyone feel about this?' Water needs to balance emotions with logic."
        },
        {
          term: "Air Element",
          category: "Personality",
          simple: "The Thinker & Communicator",
          explanation: "Air people are intellectual, social, and adaptable. They love ideas and conversations but can overthink or avoid emotional depth. Think: 'Let me analyze this...' Air needs to ground in feelings and reality."
        },
        {
          term: "Earth Element",
          category: "Personality",
          simple: "The Stable Builder",
          explanation: "Earth people are practical, reliable, and patient. They build lasting foundations and value security but can resist change or seem boring. Think: 'Let's make a solid plan.' Earth needs to embrace spontaneity occasionally."
        },
        {
          term: "Cosmic Harmony",
          category: "Analysis Method",
          simple: "Planetary Compatibility",
          explanation: "How your ruling planets interact. Each person has a dominant planetary energy (Sun, Moon, Mars, Venus, etc.) that shapes their communication style, emotional patterns, and life approach. Some planets naturally harmonize; others create friction."
        },
        {
          term: "Planetary Compatibility",
          category: "Cosmic",
          simple: "How Your Celestial Energies Match",
          explanation: "Traditional Islamic mysticism teaches that celestial bodies influence human temperament. Your 'ruling planet' (determined by your number) affects how you love, communicate, act, and feel. Understanding this explains mysterious attractions and conflicts."
        },
        {
          term: "Sun Energy",
          category: "Cosmic",
          simple: "The Leader & Light",
          explanation: "People with Sun energy are confident, generous, and need to shine. They're natural leaders who inspire others but need appreciation and can dominate. In relationships: they bring warmth but need admiration."
        },
        {
          term: "Moon Energy",
          category: "Cosmic",
          simple: "The Nurturer & Intuitive",
          explanation: "Moon people are emotionally sensitive, caring, and intuitive. They create safe emotional spaces and understand feelings instinctively but can be moody. In relationships: they provide deep emotional support but need security."
        },
        {
          term: "Mercury Energy",
          category: "Cosmic",
          simple: "The Communicator & Thinker",
          explanation: "Mercury people need mental stimulation and conversation. They're witty, curious, and versatile but can be scattered. In relationships: they bring humor and interesting dialogue but need intellectual connection."
        },
        {
          term: "Venus Energy",
          category: "Cosmic",
          simple: "The Lover & Peacemaker",
          explanation: "Venus people are romantic, affectionate, and value harmony. They appreciate beauty and avoid conflict but can be people-pleasing. In relationships: they bring tenderness and romance but may avoid necessary confrontations."
        },
        {
          term: "Mars Energy",
          category: "Cosmic",
          simple: "The Warrior & Doer",
          explanation: "Mars people are action-oriented, passionate, and direct. They're protective and courageous but can be aggressive. In relationships: they bring excitement and protection but need to soften their approach."
        },
        {
          term: "Jupiter Energy",
          category: "Cosmic",
          simple: "The Philosopher & Optimist",
          explanation: "Jupiter people are generous, optimistic, and see big pictures. They seek meaning and freedom but can be excessive. In relationships: they bring joy and growth but need space and philosophical connection."
        },
        {
          term: "Saturn Energy",
          category: "Cosmic",
          simple: "The Builder & Disciplined",
          explanation: "Saturn people are responsible, patient, and build lasting structures. They're reliable and wise but can be emotionally reserved or pessimistic. In relationships: they provide stability but need to warm up emotionally."
        },
        {
          term: "Life Path Number",
          category: "Foundation",
          simple: "Your Core Number",
          explanation: "The single-digit number that represents your fundamental nature and life purpose. Calculated from your birth date or name, it reveals your natural strengths, challenges, and spiritual journey."
        },
        {
          term: "Master Number",
          category: "Foundation",
          simple: "Special Powerful Numbers (11, 22, 33)",
          explanation: "Numbers that aren't reduced to single digits because they carry special spiritual significance. They indicate higher potential but also greater challenges. People with master numbers often feel 'different' or called to something bigger."
        },
        {
          term: "Numerological Vibration",
          category: "Foundation",
          simple: "The Energy of Numbers",
          explanation: "Each number carries a specific energy or quality. 1 = leadership, 2 = harmony, 3 = creativity, etc. Your name's vibration attracts certain experiences and influences your personality."
        },
        {
          term: "Compatibility Score",
          category: "Results",
          simple: "How Well You Match (Percentage)",
          explanation: "A 0-100 rating of natural harmony. 85-100 = Excellent (rare natural flow), 75-84 = Very Good (strong with minor work), 65-74 = Good (solid foundation), 50-64 = Moderate (requires effort), Below 50 = Challenging (significant work needed)."
        },
        {
          term: "High Compatibility",
          category: "Results",
          simple: "Natural Harmony (85-100%)",
          explanation: "You're naturally in sync. Conversations flow easily, you understand each other's moods, conflicts resolve quickly. This doesn't mean no work is needed—all relationships need nurturing—but the foundation is strong."
        },
        {
          term: "Moderate Compatibility",
          category: "Results",
          simple: "Requires Conscious Effort (50-74%)",
          explanation: "You have potential but need to actively work on understanding, communication, and compromise. Success depends on both partners' commitment. Many happy marriages exist in this range—it just takes more intentional effort."
        },
        {
          term: "Low Compatibility",
          category: "Results",
          simple: "Challenging but Not Impossible (Below 50%)",
          explanation: "Significant natural differences that require deep work, maturity, and often professional guidance. Not a death sentence—some of the strongest relationships grow from here—but both partners must be exceptionally committed."
        },
        {
          term: "Complementary Elements",
          category: "Personality",
          simple: "Opposite Traits That Balance",
          explanation: "When your differences actually help each other. Fire's enthusiasm energizes Earth's caution. Water's depth grounds Air's scattered thoughts. These aren't conflicts—they're completing each other's weaknesses."
        },
        {
          term: "Conflicting Elements",
          category: "Personality",
          simple: "Opposing Traits That Clash",
          explanation: "When your natural approaches directly oppose. Fire's impulsiveness frustrates Earth's need for plans. Water's emotions overwhelm Air's logic. Understanding this helps: 'It's not them being difficult; it's our elemental clash.'"
        },
        {
          term: "Spiritual Resonance",
          category: "Spiritual",
          simple: "Soul-Level Recognition",
          explanation: "That feeling of 'I've known you forever' when you just met. High spiritual resonance means your souls recognize each other—you may share past connections or future destinies. It's beyond logic; it's a deep knowing."
        },
        {
          term: "Karmic Relationship",
          category: "Spiritual",
          simple: "A Connection Meant to Teach",
          explanation: "In Islamic mysticism, some relationships exist to help you grow, heal, or learn specific lessons. They may be difficult but transformative. High intensity doesn't always mean 'meant to be'—sometimes it means 'meant to teach.'"
        },
        {
          term: "Divine Timing",
          category: "Spiritual",
          simple: "The Right Time for Things to Happen",
          explanation: "The belief that relationships, opportunities, and life events happen when spiritually meant to. If compatibility is low now, perhaps you're not ready for each other yet. Or perhaps you're meant to grow separately first."
        },
        {
          term: "Free Will vs Destiny",
          category: "Philosophy",
          simple: "Choice Matters More Than Stars",
          explanation: "Islamic numerology shows TENDENCIES, not fixed fate. You always have free will. Low compatibility means more work, not impossibility. High compatibility can fail without effort. Your choices, character, and commitment matter most."
        },
        {
          term: "Conscious Relationship",
          category: "Philosophy",
          simple: "Intentional Partnership",
          explanation: "A relationship where both people actively work on growth, communication, and understanding rather than expecting it to 'just work naturally.' Even highly compatible couples benefit from being conscious partners."
        }
      ]
    },
    fr: {
      title: "Termes de Compatibilité Simplifiés",
      subtitle: "Explications en langage simple des concepts de numérologie",
      searchPlaceholder: "Rechercher des termes...",
      
      terms: [
        {
          term: "ʿIlm al-Ḥurūf",
          category: "Fondation",
          simple: "Science des Lettres",
          explanation: "La pratique islamique ancienne d'étudier les valeurs numériques et les significations spirituelles des lettres arabes. Chaque lettre porterait une énergie divine influençant les noms, les mots et les destins."
        },
        {
          term: "Système Abjad",
          category: "Fondation",
          simple: "Code Lettre-Nombre",
          explanation: "Le système traditionnel où chaque lettre arabe a une valeur numérique (Alif=1, Ba=2, Jim=3, etc.). Cela nous permet de convertir les noms en nombres pour révéler des significations cachées."
        },
        {
          term: "Connexion des Âmes",
          category: "Méthode d'Analyse",
          simple: "Alignement Spirituel",
          explanation: "À quel point vos essences spirituelles correspondent. Partagez-vous des buts de vie, des valeurs et des orientations spirituelles similaires? Une forte connexion des âmes signifie que vous vous 'comprenez' profondément sans effort."
        },
        {
          term: "Destinée Spirituelle",
          category: "Méthode d'Analyse",
          simple: "Votre Chemin de Vie Spirituel",
          explanation: "Le but divin encodé dans votre nom. Ce n'est pas seulement la religion—c'est votre appel plus profond, ce qui rend la vie significative pour vous, et comment vous grandissez spirituellement."
        },
        {
          term: "Équilibre de Personnalité",
          category: "Méthode d'Analyse",
          simple: "Harmonie de Tempérament",
          explanation: "Comment vos personnalités quotidiennes s'harmonisent. Êtes-vous tous deux fougueux et en conflit, ou l'énergie terrestre calme de l'un ancre-t-elle le feu impulsif de l'autre?"
        },
        {
          term: "Tempérament Élémental",
          category: "Personnalité",
          simple: "Votre Nature de Base (Feu/Eau/Air/Terre)",
          explanation: "Votre approche fondamentale de la vie. Feu = passionné et spontané. Eau = émotionnel et intuitif. Air = intellectuel et communicatif. Terre = pratique et stable."
        },
        {
          term: "Élément Feu",
          category: "Personnalité",
          simple: "Le Passionné Fonceur",
          explanation: "Les personnes Feu sont énergiques, spontanées et inspirantes. Elles apportent l'excitation et le leadership mais peuvent être impulsives ou dominantes."
        },
        {
          term: "Élément Eau",
          category: "Personnalité",
          simple: "Le Ressenti Profond",
          explanation: "Les personnes Eau sont émotionnellement intelligentes, nourrissantes et intuitives. Elles ressentent profondément mais peuvent être trop sensibles ou lunatiques."
        },
        {
          term: "Élément Air",
          category: "Personnalité",
          simple: "Le Penseur & Communicateur",
          explanation: "Les personnes Air sont intellectuelles, sociales et adaptables. Elles aiment les idées et conversations mais peuvent trop penser ou éviter la profondeur émotionnelle."
        },
        {
          term: "Élément Terre",
          category: "Personnalité",
          simple: "Le Bâtisseur Stable",
          explanation: "Les personnes Terre sont pratiques, fiables et patientes. Elles construisent des fondations durables mais peuvent résister au changement."
        },
        {
          term: "Harmonie Cosmique",
          category: "Méthode d'Analyse",
          simple: "Compatibilité Planétaire",
          explanation: "Comment vos planètes dirigeantes interagissent. Chaque personne a une énergie planétaire dominante qui façonne son style de communication, ses patterns émotionnels et son approche de vie."
        },
        {
          term: "Compatibilité Planétaire",
          category: "Cosmique",
          simple: "Comment Vos Énergies Célestes Correspondent",
          explanation: "Le mysticisme islamique traditionnel enseigne que les corps célestes influencent le tempérament humain."
        },
        {
          term: "Énergie Soleil",
          category: "Cosmique",
          simple: "Le Leader & Lumière",
          explanation: "Les personnes avec énergie Soleil sont confiantes, généreuses et ont besoin de briller. Leaders naturels qui inspirent mais ont besoin d'appréciation."
        },
        {
          term: "Énergie Lune",
          category: "Cosmique",
          simple: "Le Nourrisseur & Intuitif",
          explanation: "Les personnes Lune sont émotionnellement sensibles, bienveillantes et intuitives. Elles créent des espaces émotionnels sûrs mais peuvent être lunatiques."
        },
        {
          term: "Énergie Mercure",
          category: "Cosmique",
          simple: "Le Communicateur & Penseur",
          explanation: "Les personnes Mercure ont besoin de stimulation mentale et de conversation. Elles sont spirituelles, curieuses et polyvalentes."
        },
        {
          term: "Énergie Vénus",
          category: "Cosmique",
          simple: "L'Amoureux & Pacificateur",
          explanation: "Les personnes Vénus sont romantiques, affectueuses et valorisent l'harmonie. Elles apprécient la beauté et évitent les conflits."
        },
        {
          term: "Énergie Mars",
          category: "Cosmique",
          simple: "Le Guerrier & Acteur",
          explanation: "Les personnes Mars sont orientées action, passionnées et directes. Elles sont protectrices et courageuses mais peuvent être agressives."
        },
        {
          term: "Énergie Jupiter",
          category: "Cosmique",
          simple: "Le Philosophe & Optimiste",
          explanation: "Les personnes Jupiter sont généreuses, optimistes et voient grand. Elles cherchent la signification et la liberté."
        },
        {
          term: "Énergie Saturne",
          category: "Cosmique",
          simple: "Le Bâtisseur & Discipliné",
          explanation: "Les personnes Saturne sont responsables, patientes et construisent des structures durables. Elles sont fiables mais peuvent être émotionnellement réservées."
        },
        {
          term: "Numéro de Chemin de Vie",
          category: "Fondation",
          simple: "Votre Nombre Principal",
          explanation: "Le nombre à un chiffre qui représente votre nature fondamentale et votre but de vie."
        },
        {
          term: "Nombre Maître",
          category: "Fondation",
          simple: "Nombres Puissants Spéciaux (11, 22, 33)",
          explanation: "Nombres qui ne sont pas réduits à un seul chiffre car ils portent une signification spirituelle spéciale."
        },
        {
          term: "Vibration Numérologique",
          category: "Fondation",
          simple: "L'Énergie des Nombres",
          explanation: "Chaque nombre porte une énergie ou qualité spécifique. 1 = leadership, 2 = harmonie, 3 = créativité, etc."
        },
        {
          term: "Score de Compatibilité",
          category: "Résultats",
          simple: "À Quel Point Vous Correspondez (Pourcentage)",
          explanation: "Une notation de 0-100 de l'harmonie naturelle. 85-100 = Excellent, 75-84 = Très Bon, 65-74 = Bon, 50-64 = Modéré, Moins de 50 = Difficile."
        },
        {
          term: "Haute Compatibilité",
          category: "Résultats",
          simple: "Harmonie Naturelle (85-100%)",
          explanation: "Vous êtes naturellement en phase. Les conversations coulent facilement, vous comprenez les humeurs de l'autre, les conflits se résolvent rapidement."
        },
        {
          term: "Compatibilité Modérée",
          category: "Résultats",
          simple: "Nécessite un Effort Conscient (50-74%)",
          explanation: "Vous avez du potentiel mais devez activement travailler sur la compréhension, la communication et le compromis."
        },
        {
          term: "Faible Compatibilité",
          category: "Résultats",
          simple: "Difficile mais Pas Impossible (Moins de 50%)",
          explanation: "Différences naturelles significatives nécessitant un travail profond, de la maturité et souvent des conseils professionnels."
        },
        {
          term: "Éléments Complémentaires",
          category: "Personnalité",
          simple: "Traits Opposés Qui S'équilibrent",
          explanation: "Quand vos différences s'entraident réellement. L'enthousiasme du Feu dynamise la prudence de la Terre."
        },
        {
          term: "Éléments Conflictuels",
          category: "Personnalité",
          simple: "Traits Opposés Qui Clashent",
          explanation: "Quand vos approches naturelles s'opposent directement. L'impulsivité du Feu frustre le besoin de plans de la Terre."
        },
        {
          term: "Résonance Spirituelle",
          category: "Spirituel",
          simple: "Reconnaissance au Niveau de l'Âme",
          explanation: "Ce sentiment de 'Je te connais depuis toujours' quand vous venez de vous rencontrer."
        },
        {
          term: "Relation Karmique",
          category: "Spirituel",
          simple: "Une Connexion Destinée à Enseigner",
          explanation: "Dans le mysticisme islamique, certaines relations existent pour vous aider à grandir, guérir ou apprendre des leçons spécifiques."
        },
        {
          term: "Timing Divin",
          category: "Spirituel",
          simple: "Le Bon Moment pour que les Choses Arrivent",
          explanation: "La croyance que les relations, opportunités et événements de vie arrivent quand spirituellement destinés."
        },
        {
          term: "Libre Arbitre vs Destin",
          category: "Philosophie",
          simple: "Le Choix Compte Plus que les Étoiles",
          explanation: "La numérologie islamique montre des TENDANCES, pas un destin fixe. Vous avez toujours le libre arbitre."
        },
        {
          term: "Relation Consciente",
          category: "Philosophie",
          simple: "Partenariat Intentionnel",
          explanation: "Une relation où les deux personnes travaillent activement sur la croissance, la communication et la compréhension."
        }
      ]
    }
  };

  const data = isFrench ? content.fr : content.en;

  // Filter terms based on search
  const filteredTerms = data.terms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by category
  const categories = Array.from(new Set(data.terms.map(t => t.category)));

  return (
    <div className="space-y-6 p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <BookMarked className="w-10 h-10 text-indigo-500" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            {data.title}
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          {data.subtitle}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder={data.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Terms by Category */}
      <div className="space-y-8">
        {categories.map(category => {
          const categoryTerms = filteredTerms.filter(t => t.category === category);
          if (categoryTerms.length === 0) return null;

          return (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-200 dark:border-indigo-800 pb-2">
                {category}
              </h3>

              <div className="grid gap-4">
                {categoryTerms.map((term, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-slate-50">
                          {term.term}
                        </h4>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                          {term.simple}
                        </p>
                      </div>
                      <span className="text-xs px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full self-start">
                        {term.category}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {term.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* No results */}
      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            {isFrench ? 'Aucun terme trouvé.' : 'No terms found.'}
          </p>
        </div>
      )}

    </div>
  );
}
