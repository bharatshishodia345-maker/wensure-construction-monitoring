from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict
from datetime import datetime

# --- Auth & User Schemas ---
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    full_name: str
    email: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    full_name: str
    password: str
    role: str = "customer"
    phone: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Contractor Profile ---
class ContractorProfileResponse(BaseModel):
    id: str
    user_id: str
    company_name: str
    trust_score: int
    verified_milestones_count: int
    active_projects_count: int
    rating: float
    specialty: str
    location: str
    license_number: str
    bio: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# --- Evidence Asset Schemas ---
class EvidenceAssetCreate(BaseModel):
    milestone_id: str
    work_update_id: Optional[str] = None
    title: str
    file_url: str
    file_type: str = "image/jpeg"
    file_size_bytes: int = 1024000
    sha256_hash: Optional[str] = None

class EvidenceAssetResponse(BaseModel):
    id: str
    milestone_id: str
    work_update_id: Optional[str] = None
    title: str
    file_url: str
    file_type: str
    file_size_bytes: int
    sha256_hash: Optional[str] = None
    verification_status: str
    verified_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# --- Work Update Schemas ---
class WorkUpdateCreate(BaseModel):
    milestone_id: Optional[str] = None
    title: Optional[str] = "Work Progress Update"
    summary: Optional[str] = None
    work_performed: Optional[str] = None
    materials_used: Optional[str] = None
    contractor_notes: Optional[str] = None
    progress_percent: Optional[float] = None
    notes: Optional[str] = None
    photo_title: Optional[str] = None
    photo_url: Optional[str] = None

class WorkUpdateResponse(BaseModel):
    id: str
    milestone_id: str
    title: str
    summary: str
    work_performed: str
    materials_used: Optional[str] = None
    contractor_notes: Optional[str] = None
    progress_percent: Optional[float] = None
    timestamp: datetime
    created_by: str
    evidence_assets: List[EvidenceAssetResponse] = []

    model_config = ConfigDict(from_attributes=True)

# --- Inspection & Findings Schemas ---
class FindingCreate(BaseModel):
    category: str = "Structural Integrity"
    severity: str = "medium"  # low, medium, high, critical
    title: str
    description: str
    location_on_site: str = "Site Area"

class FindingRespondRequest(BaseModel):
    contractor_response: str
    rectification_plan: Optional[str] = None

class FindingResponse(BaseModel):
    id: str
    inspection_id: str
    milestone_id: str
    category: str
    severity: str
    title: str
    description: str
    location_on_site: str
    resolution_status: str
    contractor_response: Optional[str] = None
    rectification_plan: Optional[str] = None
    contractor_response_date: Optional[datetime] = None
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class InspectionCreate(BaseModel):
    project_id: str
    milestone_id: str
    inspector_name: str
    inspector_license: str = "INSP-RERA-4091"
    inspection_date: str
    overall_status: str = "passed"
    notes: Optional[str] = None
    report_pdf_url: Optional[str] = None
    findings: List[FindingCreate] = []

class InspectionResponse(BaseModel):
    id: str
    project_id: str
    milestone_id: str
    inspector_name: str
    inspector_license: str
    inspection_date: str
    overall_status: str
    notes: Optional[str] = None
    report_pdf_url: Optional[str] = None
    created_at: datetime
    findings: List[FindingResponse] = []

    model_config = ConfigDict(from_attributes=True)

# --- Milestone Schemas ---
class MilestoneResponse(BaseModel):
    id: str
    project_id: str
    title: str
    stage_number: int
    target_date: str
    completed_date: Optional[str] = None
    payment_percentage: int
    escrow_amount: float
    status: str
    verification_hash: Optional[str] = None
    verified_at: Optional[datetime] = None
    verified_by: Optional[str] = None
    order_index: int
    work_updates: List[WorkUpdateResponse] = []
    evidence_assets: List[EvidenceAssetResponse] = []
    inspections: List[InspectionResponse] = []

    model_config = ConfigDict(from_attributes=True)

class MilestoneVerificationRequest(BaseModel):
    verified_by: str = "WENSURE Third-Party Civil Engineer"
    verification_notes: Optional[str] = None
    notes: Optional[str] = None
    release_escrow: bool = True

# --- Budget & Financial Schemas ---
class BudgetTransactionCreate(BaseModel):
    project_id: str
    milestone_id: Optional[str] = None
    title: str
    category: str = "Structural"
    amount: float
    transaction_type: str = "contractor_disbursement"
    date: str
    status: str = "cleared"

class BudgetTransactionResponse(BaseModel):
    id: str
    project_id: str
    milestone_id: Optional[str] = None
    title: str
    category: str
    amount: float
    transaction_type: str
    date: str
    status: str
    invoice_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class BudgetSummaryResponse(BaseModel):
    total_budget: float
    spent_amount: float
    escrow_balance: float
    remaining_budget: float
    verified_released: float
    under_inspection: float
    retention_held: float
    recent_transactions: List[BudgetTransactionResponse]

# --- Dispute Schemas ---
class DisputeCreate(BaseModel):
    project_id: str
    milestone_id: Optional[str] = None
    title: str
    raised_by: str
    reason: str

class DisputeUpdate(BaseModel):
    status: str  # open, in_mediation, resolved, escalated
    resolution_summary: Optional[str] = None

class DisputeResponse(BaseModel):
    id: str
    project_id: str
    milestone_id: Optional[str] = None
    title: str
    raised_by: str
    reason: str
    status: str
    resolution_summary: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str
    read: bool
    link: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Project Schemas ---
class ProjectCreate(BaseModel):
    name: str
    slug: str
    address: str
    city: str = "Pune"
    state: str = "Maharashtra"
    postal_code: str = "411045"
    client_name: str
    contractor_name: str
    total_budget: float = 8500000.0

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    current_stage: Optional[str] = None
    camera_stage_index: Optional[int] = None
    status: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    slug: str
    address: str
    city: str
    state: str
    postal_code: str
    client_name: str
    contractor_name: str
    current_stage: str
    total_budget: float
    spent_amount: float
    escrow_balance: float
    verified_percentage: int
    health_score: int
    status: str
    start_date: str
    expected_completion: str
    camera_stage_index: int
    milestones: List[MilestoneResponse] = []

    model_config = ConfigDict(from_attributes=True)

# --- Analytics Summary ---
class AnalyticsSummaryResponse(BaseModel):
    total_projects: int
    active_projects: int
    verified_inspections: int
    total_escrow_secured: float
    total_disbursed: float
    open_disputes: int
    average_trust_score: float
    # NOTE: Not yet calculated from a dedicated compliance model — requires future implementation.
    safety_compliance_rate: Optional[float] = None
