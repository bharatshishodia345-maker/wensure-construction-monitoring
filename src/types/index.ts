export type UserRole = 'public' | 'customer' | 'contractor' | 'admin';

export interface Milestone {
  id: string;
  name: string;
  stage: string;
  plannedDate: string;
  actualDate?: string;
  plannedProgress: number;
  actualProgress: number;
  status: 'completed' | 'in_progress' | 'upcoming' | 'delayed';
  description: string;
  inspectionStatus: 'verified' | 'pending_inspection' | 'not_started' | 'action_required';
  verifiedBy?: string;
  evidenceCount: number;
}

export interface ObservationIssue {
  id: string;
  code: string;
  title: string;
  category: 'Structural' | 'Masonry' | 'Plumbing' | 'Electrical' | 'Finishing' | 'Waterproofing';
  severity: 'Critical' | 'Warning' | 'Moderate' | 'Low';
  description: string;
  location: string;
  detectedDate: string;
  status: 'Open' | 'Rectification Submitted' | 'Under Re-inspection' | 'Resolved';
  inspectorName: string;
  evidenceImageUrl: string;
  rectificationPlan?: string;
  contractorResponse?: string;
  contractorResponseDate?: string;
  contractorEvidenceUrl?: string;
  targetResolutionDate: string;
}

export interface InspectionReport {
  id: string;
  reportCode: string;
  title: string;
  inspectionDate: string;
  inspectorName: string;
  inspectorLicense: string;
  milestoneChecked: string;
  scopeSummary: string;
  overallScore: number; // e.g. 91%
  verificationStatus: 'Verified with Observations' | 'Fully Verified' | 'Rectification Required' | 'Scheduled';
  keyFindings: string[];
  recommendations: string[];
  observationsCount: number;
  photos: {
    url: string;
    caption: string;
    timestamp: string;
    verified: boolean;
  }[];
  contractorResponseNote?: string;
  nextAuditDate: string;
}

export interface BudgetTransaction {
  id: string;
  code: string;
  date: string;
  category: 'Civil & Foundation' | 'Structure & Framing' | 'Brickwork & Plaster' | 'MEP & Plumbing' | 'Finishes & Joinery' | 'Site Supervision';
  description: string;
  contractorClaimedAmount: number;
  independentlyVerifiedAmount: number;
  customerPaidAmount: number;
  status: 'Verified & Disbursed' | 'Partially Approved' | 'Under Physical Audit' | 'Pending Verification';
  milestoneReference: string;
  invoiceNumber: string;
}

export interface ContractorProfile {
  id: string;
  companyName: string;
  founderName: string;
  avatarUrl: string;
  heroImageUrl: string;
  tagline: string;
  location: string;
  establishedYear: number;
  specializations: string[];
  rating: number;
  reviewCount: number;
  verifiedTier: 'Independent Platinum' | 'Independent Gold' | 'Under Audit' | 'Verified Partner';
  verifiedProjectsCount: number;
  ongoingProjectsCount: number;
  totalConstructedSqFt: string;
  disputeRate: string; // e.g. "0.0%"
  inspectionComplianceRate: string; // e.g. "98.4%"
  aboutText: string;
  recentProjects: {
    title: string;
    location: string;
    completedYear: string;
    sqFt: string;
    imageUrl: string;
  }[];
  reviews: {
    author: string;
    role: string;
    date: string;
    rating: number;
    comment: string;
    projectReference: string;
  }[];
}

export interface Opportunity {
  id: string;
  title: string;
  propertyType: string;
  location: string;
  budgetRange: string;
  areaSqFt: string;
  estimatedTimeline: string;
  requiredExperience: string;
  scopeSummary: string;
  postedDate: string;
  bidsCount: number;
  interested: boolean;
}

export interface SitePhoto {
  id: string;
  url: string;
  title: string;
  stage: string;
  date: string;
  locationTag: string;
  isVerified: boolean;
  verifiedBy?: string;
  notes: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: 'inspection' | 'progress' | 'observation' | 'budget' | 'opportunity';
  isRead: boolean;
  priority: 'high' | 'normal' | 'low';
  linkTo: string;
}

export interface ProjectData {
  id: string;
  name: string;
  code: string;
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalBudget: number; // ₹90,00,000
  recordedExpenditure: number; // ₹54,00,000
  recordedProgress: number; // 70%
  plannedProgress: number; // 72%
  scheduleVariance: number; // -2%
  openObservationsCount: number; // 3
  nextInspectionDate: string; // 16 October 2026
  startDate: string; // 1 April 2026
  targetCompletionDate: string; // 31 March 2027
  homeowner: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  contractor: {
    id: string;
    name: string;
    leadContact: string;
    phone: string;
    email: string;
    license: string;
  };
  leadInspector: {
    id: string;
    name: string;
    designation: string;
    accreditation: string;
    inspectionsCompleted: number;
  };
  milestones: Milestone[];
  observations: ObservationIssue[];
  budgetTransactions: BudgetTransaction[];
  sitePhotos: SitePhoto[];
  upcomingAudits: {
    id: string;
    title: string;
    scheduledDate: string;
    leadAuditor: string;
    scope: string;
  }[];
}
