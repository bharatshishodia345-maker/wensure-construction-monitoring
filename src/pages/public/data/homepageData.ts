/**
 * Static presentation data & configuration for WENSURE Public Homepage
 * Ensures consistent illustrative demonstration figures aligned with project demo data.
 */

export interface ContractMilestonePreview {
  stage: string;
  title: string;
  amount: string;
  status: 'Completed' | 'Active Stage' | 'Upcoming';
  pct: string;
}

export interface TeamMemberProfile {
  name: string;
  initials: string;
  focus: string;
}

// Consistent with INITIAL_PROJECT (Total Budget: ₹90L, Recorded Disbursed: ₹54L = 60%)
export const HOMEPAGE_BUDGET_METRICS = {
  totalBudgetFormatted: '₹90 Lakhs',
  totalBudgetNumeric: 9000000,
  disbursedAmountFormatted: '₹54,00,000',
  disbursedPercent: '60%',
  auditFrameworkLabel: 'Independent Civil Quality Audit Demonstration',
} as const;

export const DEMO_CONTRACT_MILESTONES: ContractMilestonePreview[] = [
  {
    stage: 'M1',
    title: 'Site Excavation & Anti-Termite Barrier',
    amount: '₹13.50L',
    status: 'Completed',
    pct: '15%',
  },
  {
    stage: 'M2',
    title: 'Substructure & Raft Foundation',
    amount: '₹18.00L',
    status: 'Completed',
    pct: '20%',
  },
  {
    stage: 'M3',
    title: 'RCC Superstructure & Column Framing',
    amount: '₹22.50L',
    status: 'Completed',
    pct: '25%',
  },
  {
    stage: 'M4',
    title: 'AAC Blockwork Masonry & External Plaster',
    amount: '₹18.00L',
    status: 'Active Stage',
    pct: '20%',
  },
  {
    stage: 'M5',
    title: 'MEP Services, Flooring & Handover',
    amount: '₹18.00L',
    status: 'Upcoming',
    pct: '20%',
  },
];

// Exact required order & names with neutral product team descriptions (no unverified personal bios or badges)
export const TEAM_ANANTEX_MEMBERS: TeamMemberProfile[] = [
  {
    name: 'Madan Mohan Misra',
    initials: 'MM',
    focus: 'Core Team • Engineering systems, verification workflows & platform architecture',
  },
  {
    name: 'Bharat Shishodia',
    initials: 'BS',
    focus: 'Core Team • Full-stack engineering, 3D construction modeling & application state',
  },
  {
    name: 'Prithvi Singh',
    initials: 'PS',
    focus: 'Core Team • Design systems, homeowner experience & technical audit reporting',
  },
  {
    name: 'Preetam Gupta',
    initials: 'PG',
    focus: 'Core Team • Backend integration, API contracts & contractor accountability registers',
  },
];

export const DEMO_CATEGORIES = [
  'Overview',
  'Progress',
  'Inspections',
  'Budget',
  'Contractor Records',
] as const;

export type DemoCategory = (typeof DEMO_CATEGORIES)[number];
