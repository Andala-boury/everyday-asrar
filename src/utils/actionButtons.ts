import { ActionButton, Element, ElementAlignment, TimeWindow } from '../types/planetary';

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateActionButtons(
  alignment: ElementAlignment,
  timeWindow: TimeWindow,
  userElement: Element
): ActionButton[] {
  
  // HIGH ALIGNMENT (Perfect or Strong)
  if (alignment.quality === 'perfect' || alignment.quality === 'strong') {
    const buttons: ActionButton[] = [
      {
        icon: '🚀',
        label: 'Start Important Task',
        action: 'start',
        priority: 'primary'
      }
    ];
    
    // Element-specific actions
    if (userElement === 'fire') {
      buttons.push(
        { icon: '📞', label: 'Make Difficult Call', action: 'start', priority: 'primary' },
        { icon: '⚡', label: 'Take Bold Action', action: 'start', priority: 'secondary' }
      );
    } else if (userElement === 'air') {
      buttons.push(
        { icon: '✍️', label: 'Write or Communicate', action: 'start', priority: 'primary' },
        { icon: '💡', label: 'Brainstorm Ideas', action: 'start', priority: 'secondary' }
      );
    } else if (userElement === 'water') {
      buttons.push(
        { icon: '🎨', label: 'Creative Work', action: 'start', priority: 'primary' },
        { icon: '💭', label: 'Deep Reflection', action: 'start', priority: 'secondary' }
      );
    } else if (userElement === 'earth') {
      buttons.push(
        { icon: '🏗️', label: 'Build or Organize', action: 'start', priority: 'primary' },
        { icon: '📋', label: 'Complete Tasks', action: 'start', priority: 'secondary' }
      );
    }
    
    buttons.push({
      icon: '📅',
      label: 'Schedule for Later',
      action: 'schedule',
      priority: 'tertiary'
    });
    
    return buttons;
  }
  
  // LOW ALIGNMENT (Opposing or Weak)
  if (alignment.quality === 'opposing' || alignment.quality === 'weak') {
    return [
      {
        icon: '⏸️',
        label: 'Rest & Reflect',
        action: 'rest',
        priority: 'primary'
      },
      {
        icon: '📖',
        label: 'Plan & Prepare',
        action: 'plan',
        priority: 'secondary'
      },
      {
        icon: '⏭️',
        label: `Wait for ${capitalizeFirst(userElement)} (${timeWindow.nextWindowIn})`,
        action: 'wait',
        priority: 'secondary'
      }
    ];
  }
  
  // MODERATE ALIGNMENT
  return [
    {
      icon: '📝',
      label: 'Handle Routine Tasks',
      action: 'start',
      priority: 'primary'
    },
    {
      icon: '🔄',
      label: 'Continue Ongoing Work',
      action: 'start',
      priority: 'secondary'
    },
    {
      icon: '⏭️',
      label: 'Wait for Better Timing',
      action: 'wait',
      priority: 'tertiary'
    }
  ];
}

export interface ElementGuidance {
  bestFor: string[];
  avoid: string[];
}

export const ELEMENT_GUIDANCE: Record<Element, ElementGuidance> = {
  fire: {
    bestFor: [
      'Launch new projects',
      'Make important decisions',
      'Have courage-requiring conversations',
      'Take bold action',
      'Lead and inspire others'
    ],
    avoid: [
      'Emotional processing',
      'Detailed planning',
      'Slow, methodical work'
    ]
  },
  
  air: {
    bestFor: [
      'Communicate and network',
      'Learn new concepts',
      'Brainstorm ideas',
      'Write and articulate',
      'Teach and share knowledge'
    ],
    avoid: [
      'Heavy physical work',
      'Emotional depth work',
      'Long-term commitments'
    ]
  },
  
  water: {
    bestFor: [
      'Emotional processing',
      'Deep reflection',
      'Healing conversations',
      'Intuitive work',
      'Creative flow'
    ],
    avoid: [
      'Quick decisions',
      'Confrontations',
      'Aggressive action'
    ]
  },
  
  earth: {
    bestFor: [
      'Build and organize',
      'Make commitments',
      'Complete projects',
      'Financial planning',
      'Physical work'
    ],
    avoid: [
      'Rapid changes',
      'Impulsive decisions',
      'Abstract theorizing'
    ]
  }
};

export function getGuidanceForAlignment(
  alignment: ElementAlignment,
  userElement: Element,
  hourElement: Element
): string[] {
  if (alignment.quality === 'perfect' || alignment.quality === 'strong') {
    return ELEMENT_GUIDANCE[userElement].bestFor;
  } else if (alignment.quality === 'opposing' || alignment.quality === 'weak') {
    return ELEMENT_GUIDANCE[hourElement].bestFor;
  } else {
    return [
      'Handle routine tasks',
      'Continue ongoing projects',
      'Low-stakes activities',
      'Preparation work'
    ];
  }
}
