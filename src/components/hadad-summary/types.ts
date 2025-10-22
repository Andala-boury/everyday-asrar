// types.ts - Shared types for Hadad Summary

export type ElementType = 'Fire' | 'Water' | 'Air' | 'Earth';
export type TaMarbutaMode = 'ه' | 'ة';

export interface AuditStep {
  ch: string;
  value: number;
  element: ElementType;
}

export interface AbjadAudit {
  original: string;      // raw Arabic text as displayed
  normalized: string;    // after normalization used for math
  steps: AuditStep[];    // per-letter values in order
  total: number;         // Kabīr (sum of steps)
}

export interface HadadSummaryProps {
  audit: AbjadAudit;
  motherAudit?: AbjadAudit;        // optional: mother's name audit
  taMarbutaMode?: TaMarbutaMode;   // default 'ه'
  showGrid?: boolean;              // default true (educational magic grid)
  showResonance?: boolean;         // default true (sacred numbers, Asmā' matches)
  onCopyJson?: (payload: any) => void; // optional callback for "Copy JSON"
}

export interface RuhHadad {
  value: number;
  root: number;
  element: ElementType;
}

export interface UmHadad {
  total: number;
  root: number;
  hadath: ElementType;
}

export interface SacredResonance {
  nearest: number;
  delta: number;
  isExact: boolean;
  factors: number[];
  divisibleBy7: boolean;
  div7: boolean;
  divisibleBy19: boolean;
  div19: boolean;
  divisibleBy99: boolean;
  div99: boolean;
}

export interface AsmaName {
  ar: string;
  transliteration: string;
  en: string;
  abjad: number;
  element: ElementType;
  counts: number[];
}

export interface ElementInfo {
  icon: string;
  color: string;
  bg: string;
  label: string;
  quality: string;
  planet: string;
  day: string;
  hours: string[];
}
