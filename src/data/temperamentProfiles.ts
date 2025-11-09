/**
 * Enhanced Temperament Profiles - Complete Psychological & Career Data
 * Bilingual (EN/FR) - Modern, practical, non-deterministic
 */

import { TemperamentData } from '../types/temperament';

export const TEMPERAMENT_PROFILES: TemperamentData = {
  // ========================================================================
  // 🔥 FIRE TEMPERAMENT
  // ========================================================================
  fire: {
    element: 'fire',
    name: 'Fire',
    nameFr: 'Feu',
    nameAr: 'نار',
    icon: '🔥',
    quality: 'Hot & Dry',
    qualityFr: 'Chaud & Sec',
    
    psychology: {
      traits: [
        'Bold and energetic',
        'Fast-moving and decisive',
        'Confident and direct',
        'Natural initiator',
        'Action-oriented'
      ],
      traitsFr: [
        'Audacieux et énergique',
        'Rapide et décisif',
        'Confiant et direct',
        'Initiateur naturel',
        'Orienté vers l\'action'
      ],
      
      strengths: [
        'Gets things done quickly',
        'Natural leadership',
        'Courage to start new projects',
        'High energy and drive',
        'Good in crisis situations'
      ],
      strengthsFr: [
        'Fait avancer les choses rapidement',
        'Leadership naturel',
        'Courage de commencer de nouveaux projets',
        'Grande énergie et motivation',
        'Performant en situation de crise'
      ],
      
      watchOuts: [
        'Can become impatient with slower processes',
        'May react too quickly without reflection',
        'Risk of burnout from constant activity',
        'Can overlook details in rush to complete',
        'May struggle with repetitive tasks'
      ],
      watchOutsFr: [
        'Peut devenir impatient avec des processus lents',
        'Peut réagir trop vite sans réflexion',
        'Risque d\'épuisement dû à l\'activité constante',
        'Peut négliger les détails dans la précipitation',
        'Peut avoir du mal avec les tâches répétitives'
      ],
      
      balanceTips: [
        'Take short breaks to cool down',
        'Practice patience with slower processes',
        'Count to 10 before big decisions',
        'Schedule downtime for rest',
        'Try calming activities like walking'
      ],
      balanceTipsFr: [
        'Prendre de courtes pauses pour se calmer',
        'Pratiquer la patience avec les processus lents',
        'Compter jusqu\'à 10 avant les grandes décisions',
        'Planifier du temps de repos',
        'Essayer des activités apaisantes comme la marche'
      ]
    },
    
    career: {
      goodFits: [
        'Business leadership',
        'Entrepreneurship',
        'Sales and business development',
        'Security and emergency services',
        'Operations management',
        'Logistics coordination',
        'Project management',
        'Sports training and coaching',
        'Event management',
        'Crisis management roles'
      ],
      goodFitsFr: [
        'Direction d\'entreprise',
        'Entrepreneuriat',
        'Vente et développement commercial',
        'Sécurité et services d\'urgence',
        'Gestion des opérations',
        'Coordination logistique',
        'Gestion de projet',
        'Entraînement et coaching sportif',
        'Gestion d\'événements',
        'Rôles de gestion de crise'
      ],
      
      avoid: [
        'Highly repetitive office work',
        'Slow-paced environments with little variety',
        'Roles requiring extreme patience and detailed precision'
      ],
      avoidFr: [
        'Travail de bureau très répétitif',
        'Environnements lents avec peu de variété',
        'Rôles nécessitant une patience extrême et une précision détaillée'
      ],
      
      rationale: 'Fire types thrive in dynamic, fast-paced environments where they can lead, initiate, and see quick results.',
      rationaleFr: 'Les types Feu s\'épanouissent dans des environnements dynamiques et rapides où ils peuvent diriger, initier et voir des résultats rapides.'
    }
  },

  // ========================================================================
  // 💧 WATER TEMPERAMENT
  // ========================================================================
  water: {
    element: 'water',
    name: 'Water',
    nameFr: 'Eau',
    nameAr: 'ماء',
    icon: '💧',
    quality: 'Cold & Wet',
    qualityFr: 'Froid & Humide',
    
    psychology: {
      traits: [
        'Emotional and intuitive',
        'Patient and supportive',
        'Deep thinker',
        'Caring and empathetic',
        'Sensitive to surroundings'
      ],
      traitsFr: [
        'Émotionnel et intuitif',
        'Patient et solidaire',
        'Penseur profond',
        'Attentionné et empathique',
        'Sensible à son environnement'
      ],
      
      strengths: [
        'Strong emotional intelligence',
        'Natural at supporting others',
        'Patient and persistent',
        'Creative and imaginative',
        'Good listener and counselor'
      ],
      strengthsFr: [
        'Grande intelligence émotionnelle',
        'Naturellement doué pour soutenir les autres',
        'Patient et persévérant',
        'Créatif et imaginatif',
        'Bon auditeur et conseiller'
      ],
      
      watchOuts: [
        'Can absorb negativity from others',
        'May overthink and get stuck in emotions',
        'Risk of taking on too many others\' problems',
        'Can become drained in harsh environments',
        'May avoid confrontation when needed'
      ],
      watchOutsFr: [
        'Peut absorber la négativité des autres',
        'Peut trop réfléchir et rester coincé dans les émotions',
        'Risque de prendre trop de problèmes des autres',
        'Peut s\'épuiser dans des environnements difficiles',
        'Peut éviter la confrontation quand nécessaire'
      ],
      
      balanceTips: [
        'Set healthy boundaries with others',
        'Create calm, peaceful spaces',
        'Practice saying no when needed',
        'Take time alone to recharge',
        'Avoid absorbing others\' emotions'
      ],
      balanceTipsFr: [
        'Établir des limites saines avec les autres',
        'Créer des espaces calmes et paisibles',
        'S\'entraîner à dire non quand nécessaire',
        'Prendre du temps seul pour se ressourcer',
        'Éviter d\'absorber les émotions des autres'
      ]
    },
    
    career: {
      goodFits: [
        'Healthcare and nursing',
        'Teaching and education',
        'Counseling and therapy',
        'Social work and community development',
        'Customer care and support',
        'UX research and design',
        'Childcare and early education',
        'Hospitality and guest relations',
        'HR and employee wellbeing',
        'Creative arts and writing'
      ],
      goodFitsFr: [
        'Santé et soins infirmiers',
        'Enseignement et éducation',
        'Conseil et thérapie',
        'Travail social et développement communautaire',
        'Service et support client',
        'Recherche et conception UX',
        'Garde d\'enfants et éducation précoce',
        'Hôtellerie et relations avec les clients',
        'RH et bien-être des employés',
        'Arts créatifs et écriture'
      ],
      
      avoid: [
        'High-pressure sales environments',
        'Aggressive, cutthroat workplaces',
        'Roles with constant conflict and confrontation'
      ],
      avoidFr: [
        'Environnements de vente à haute pression',
        'Lieux de travail agressifs et impitoyables',
        'Rôles avec conflit et confrontation constants'
      ],
      
      rationale: 'Water types excel in nurturing, supportive roles where empathy and patience are valued.',
      rationaleFr: 'Les types Eau excellent dans les rôles nourriciers et de soutien où l\'empathie et la patience sont valorisées.'
    }
  },

  // ========================================================================
  // 🌬 AIR TEMPERAMENT
  // ========================================================================
  air: {
    element: 'air',
    name: 'Air',
    nameFr: 'Air',
    nameAr: 'هواء',
    icon: '🌬️',
    quality: 'Hot & Wet',
    qualityFr: 'Chaud & Humide',
    
    psychology: {
      traits: [
        'Curious and talkative',
        'Quick thinker',
        'Communicative and social',
        'Loves learning and ideas',
        'Adaptable and flexible'
      ],
      traitsFr: [
        'Curieux et bavard',
        'Penseur rapide',
        'Communicatif et social',
        'Aime apprendre et les idées',
        'Adaptable et flexible'
      ],
      
      strengths: [
        'Excellent communicator',
        'Fast learner and adapter',
        'Creative problem solver',
        'Good at connecting people and ideas',
        'Thrives in social settings'
      ],
      strengthsFr: [
        'Excellent communicateur',
        'Apprenant et adaptateur rapide',
        'Résolveur de problèmes créatif',
        'Doué pour connecter les gens et les idées',
        'S\'épanouit dans les contextes sociaux'
      ],
      
      watchOuts: [
        'Can become scattered or unfocused',
        'May start many things without finishing',
        'Risk of anxiety from overthinking',
        'Can talk more than act',
        'May struggle with routine and structure'
      ],
      watchOutsFr: [
        'Peut devenir dispersé ou déconcentré',
        'Peut commencer beaucoup de choses sans les finir',
        'Risque d\'anxiété due à la surréflexion',
        'Peut parler plus qu\'agir',
        'Peut avoir du mal avec la routine et la structure'
      ],
      
      balanceTips: [
        'Use lists and structure to stay focused',
        'Finish one thing before starting another',
        'Practice grounding activities',
        'Take breaks from screens and stimulation',
        'Set clear priorities for the day'
      ],
      balanceTipsFr: [
        'Utiliser des listes et de la structure pour rester concentré',
        'Finir une chose avant d\'en commencer une autre',
        'Pratiquer des activités d\'ancrage',
        'Prendre des pauses des écrans et de la stimulation',
        'Définir des priorités claires pour la journée'
      ]
    },
    
    career: {
      goodFits: [
        'IT and software development',
        'Digital marketing and social media',
        'Data and business analysis',
        'Writing and journalism',
        'Content creation and blogging',
        'Design and creative services',
        'Teaching and training',
        'Coordination and project support',
        'Public relations and communications',
        'Research and innovation roles'
      ],
      goodFitsFr: [
        'Informatique et développement logiciel',
        'Marketing digital et médias sociaux',
        'Analyse de données et d\'affaires',
        'Écriture et journalisme',
        'Création de contenu et blogging',
        'Design et services créatifs',
        'Enseignement et formation',
        'Coordination et support de projet',
        'Relations publiques et communications',
        'Rôles de recherche et d\'innovation'
      ],
      
      avoid: [
        'Isolated roles with minimal human contact',
        'Highly repetitive, non-creative tasks',
        'Environments with zero flexibility or variety'
      ],
      avoidFr: [
        'Rôles isolés avec peu de contact humain',
        'Tâches très répétitives et non créatives',
        'Environnements sans flexibilité ni variété'
      ],
      
      rationale: 'Air types thrive in dynamic, communicative roles that value ideas, learning, and connection.',
      rationaleFr: 'Les types Air s\'épanouissent dans des rôles dynamiques et communicatifs qui valorisent les idées, l\'apprentissage et la connexion.'
    }
  },

  // ========================================================================
  // 🌍 EARTH TEMPERAMENT
  // ========================================================================
  earth: {
    element: 'earth',
    name: 'Earth',
    nameFr: 'Terre',
    nameAr: 'تراب',
    icon: '🌍',
    quality: 'Cold & Dry',
    qualityFr: 'Froid & Sec',
    
    psychology: {
      traits: [
        'Grounded and stable',
        'Reliable and consistent',
        'Patient and methodical',
        'Practical and organized',
        'Strong memory and attention to detail'
      ],
      traitsFr: [
        'Ancré et stable',
        'Fiable et constant',
        'Patient et méthodique',
        'Pratique et organisé',
        'Bonne mémoire et souci du détail'
      ],
      
      strengths: [
        'Excellent follow-through',
        'Dependable and trustworthy',
        'Good with details and systems',
        'Calm under pressure',
        'Builds solid foundations'
      ],
      strengthsFr: [
        'Excellent dans le suivi',
        'Fiable et digne de confiance',
        'Bon avec les détails et les systèmes',
        'Calme sous pression',
        'Construit des fondations solides'
      ],
      
      watchOuts: [
        'Can be slow to adapt to change',
        'May get stuck in routine or comfort zone',
        'Risk of becoming too rigid',
        'Can resist new ideas or methods',
        'May need extra motivation to start'
      ],
      watchOutsFr: [
        'Peut être lent à s\'adapter au changement',
        'Peut rester coincé dans la routine ou la zone de confort',
        'Risque de devenir trop rigide',
        'Peut résister aux nouvelles idées ou méthodes',
        'Peut avoir besoin de motivation supplémentaire pour commencer'
      ],
      
      balanceTips: [
        'Try small changes regularly',
        'Welcome new perspectives gently',
        'Take walks in nature to refresh',
        'Mix routine with variety',
        'Set gentle goals for change'
      ],
      balanceTipsFr: [
        'Essayer de petits changements régulièrement',
        'Accueillir de nouvelles perspectives doucement',
        'Faire des promenades dans la nature pour se rafraîchir',
        'Mélanger routine et variété',
        'Fixer des objectifs doux pour le changement'
      ]
    },
    
    career: {
      goodFits: [
        'Accounting and finance operations',
        'Engineering and technical roles',
        'Supply chain and procurement',
        'Construction and project delivery',
        'HR operations and administration',
        'Real estate and property management',
        'Skilled trades (carpentry, plumbing, electrical)',
        'Quality assurance and compliance',
        'Archive management and documentation',
        'Manufacturing and production'
      ],
      goodFitsFr: [
        'Comptabilité et opérations financières',
        'Ingénierie et rôles techniques',
        'Chaîne d\'approvisionnement et achats',
        'Construction et livraison de projets',
        'Opérations RH et administration',
        'Immobilier et gestion de propriétés',
        'Métiers spécialisés (menuiserie, plomberie, électricité)',
        'Assurance qualité et conformité',
        'Gestion d\'archives et documentation',
        'Fabrication et production'
      ],
      
      avoid: [
        'Chaotic, unstructured early-stage startups',
        'Roles requiring constant rapid change',
        'Environments with zero processes or systems'
      ],
      avoidFr: [
        'Startups chaotiques et non structurées en phase initiale',
        'Rôles nécessitant des changements rapides constants',
        'Environnements sans processus ni systèmes'
      ],
      
      rationale: 'Earth types excel in structured, stable environments where reliability and thoroughness are valued.',
      rationaleFr: 'Les types Terre excellent dans des environnements structurés et stables où la fiabilité et la minutie sont valorisées.'
    }
  }
};

/**
 * Get temperament profile by element
 */
export function getTemperamentProfile(element: 'fire' | 'water' | 'air' | 'earth') {
  return TEMPERAMENT_PROFILES[element];
}

/**
 * Get all temperament profiles
 */
export function getAllTemperamentProfiles() {
  return TEMPERAMENT_PROFILES;
}
