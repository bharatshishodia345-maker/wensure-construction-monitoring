import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON, Enum
)
from sqlalchemy.orm import relationship
from backend.app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="customer")  # customer, contractor, admin, inspector
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    contractor_profile = relationship("ContractorProfile", back_populates="user", uselist=False, lazy="selectin")
    memberships = relationship("ProjectMembership", back_populates="user", lazy="selectin")
    notifications = relationship("Notification", back_populates="user", lazy="selectin")

class ContractorProfile(Base):
    __tablename__ = "contractor_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    company_name = Column(String(255), nullable=False)
    trust_score = Column(Integer, default=95)
    verified_milestones_count = Column(Integer, default=0)
    active_projects_count = Column(Integer, default=1)
    rating = Column(Float, default=4.9)
    specialty = Column(String(255), default="Residential Structural & Premium Finishes")
    location = Column(String(255), default="Pune, Maharashtra")
    license_number = Column(String(100), default="MH-CREDAI-2024-8841")
    bio = Column(Text, nullable=True)

    user = relationship("User", back_populates="contractor_profile")

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    address = Column(String(500), nullable=False)
    city = Column(String(100), default="Pune")
    state = Column(String(100), default="Maharashtra")
    postal_code = Column(String(20), default="411045")
    client_name = Column(String(255), default="Bharat Shishodia")
    contractor_name = Column(String(255), default="Apex Structural Builders")
    current_stage = Column(String(100), default="Structural Framing & RCC")
    total_budget = Column(Float, default=8500000.0)
    spent_amount = Column(Float, default=3200000.0)
    escrow_balance = Column(Float, default=5300000.0)
    verified_percentage = Column(Integer, default=38)
    health_score = Column(Integer, default=94)
    status = Column(String(50), default="active")  # active, completed, paused, disputed
    start_date = Column(String(50), default="2025-01-15")
    expected_completion = Column(String(50), default="2025-11-30")
    camera_stage_index = Column(Integer, default=2)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    memberships = relationship("ProjectMembership", back_populates="project", cascade="all, delete-orphan", lazy="selectin")
    milestones = relationship("Milestone", back_populates="project", order_by="Milestone.order_index", cascade="all, delete-orphan", lazy="selectin")
    inspections = relationship("Inspection", back_populates="project", cascade="all, delete-orphan", lazy="selectin")
    transactions = relationship("BudgetTransaction", back_populates="project", cascade="all, delete-orphan", lazy="selectin")
    disputes = relationship("Dispute", back_populates="project", cascade="all, delete-orphan", lazy="selectin")
    audit_logs = relationship("AuditLog", back_populates="project", cascade="all, delete-orphan", lazy="selectin")

class ProjectMembership(Base):
    __tablename__ = "project_memberships"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    role = Column(String(50), default="customer")  # customer, contractor, admin, inspector
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="memberships")
    user = relationship("User", back_populates="memberships")

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    title = Column(String(255), nullable=False)
    stage_number = Column(Integer, nullable=False)
    target_date = Column(String(50), nullable=False)
    completed_date = Column(String(50), nullable=True)
    payment_percentage = Column(Integer, default=15)
    escrow_amount = Column(Float, default=1275000.0)
    # Status progression: planned -> in_progress -> reported -> evidence_submitted -> inspected -> verified -> disputed
    status = Column(String(50), default="planned")
    verification_hash = Column(String(128), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    verified_by = Column(String(255), nullable=True)
    order_index = Column(Integer, default=0)

    project = relationship("Project", back_populates="milestones")
    work_updates = relationship("WorkUpdate", back_populates="milestone", cascade="all, delete-orphan", lazy="selectin")
    evidence_assets = relationship("EvidenceAsset", back_populates="milestone", cascade="all, delete-orphan", lazy="selectin")
    inspections = relationship("Inspection", back_populates="milestone", cascade="all, delete-orphan", lazy="selectin")
    findings = relationship("Finding", back_populates="milestone", cascade="all, delete-orphan", lazy="selectin")

class WorkUpdate(Base):
    __tablename__ = "work_updates"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    milestone_id = Column(String(36), ForeignKey("milestones.id"), nullable=False)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    work_performed = Column(Text, nullable=False)
    materials_used = Column(Text, nullable=True)
    contractor_notes = Column(Text, nullable=True)
    progress_percent = Column(Float, nullable=True, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String(255), default="Apex Site Engineer")

    milestone = relationship("Milestone", back_populates="work_updates")
    evidence_assets = relationship("EvidenceAsset", back_populates="work_update", lazy="selectin")

class EvidenceAsset(Base):
    __tablename__ = "evidence_assets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    milestone_id = Column(String(36), ForeignKey("milestones.id"), nullable=False)
    work_update_id = Column(String(36), ForeignKey("work_updates.id"), nullable=True)
    title = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_type = Column(String(50), default="image/jpeg")
    file_size_bytes = Column(Integer, default=1024000)
    sha256_hash = Column(String(64), nullable=True)
    uploader_id = Column(String(36), nullable=True)
    # verification_status: unverified, flagged, independently_verified
    verification_status = Column(String(50), default="unverified")
    verified_at = Column(DateTime, nullable=True)
    metadata_json = Column(JSON, nullable=True)

    milestone = relationship("Milestone", back_populates="evidence_assets")
    work_update = relationship("WorkUpdate", back_populates="evidence_assets")

class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    milestone_id = Column(String(36), ForeignKey("milestones.id"), nullable=False)
    inspector_name = Column(String(255), nullable=False)
    inspector_license = Column(String(100), default="INSP-RERA-4091")
    inspection_date = Column(String(50), nullable=False)
    overall_status = Column(String(50), default="passed")  # passed, conditional, failed, under_review
    notes = Column(Text, nullable=True)
    report_pdf_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="inspections")
    milestone = relationship("Milestone", back_populates="inspections")
    findings = relationship("Finding", back_populates="inspection", cascade="all, delete-orphan", lazy="selectin")

class Finding(Base):
    __tablename__ = "findings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=False)
    milestone_id = Column(String(36), ForeignKey("milestones.id"), nullable=False)
    category = Column(String(100), default="Structural Integrity")
    severity = Column(String(50), default="medium")  # low, medium, high, critical
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location_on_site = Column(String(255), default="Grid B-4, First Floor Slab")
    resolution_status = Column(String(50), default="open")  # open, addressed, verified_resolved
    contractor_response = Column(Text, nullable=True)
    rectification_plan = Column(Text, nullable=True)
    contractor_response_date = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)

    inspection = relationship("Inspection", back_populates="findings")
    milestone = relationship("Milestone", back_populates="findings")

class BudgetTransaction(Base):
    __tablename__ = "budget_transactions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    milestone_id = Column(String(36), ForeignKey("milestones.id"), nullable=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), default="Structural")
    amount = Column(Float, nullable=False)
    transaction_type = Column(String(50), default="contractor_disbursement")  # escrow_deposit, contractor_disbursement, retention_hold
    date = Column(String(50), nullable=False)
    status = Column(String(50), default="cleared")  # pending, cleared, escrow_locked
    invoice_url = Column(String(500), nullable=True)

    project = relationship("Project", back_populates="transactions")

class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    milestone_id = Column(String(36), ForeignKey("milestones.id"), nullable=True)
    title = Column(String(255), nullable=False)
    raised_by = Column(String(255), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String(50), default="open")  # open, in_mediation, resolved, escalated
    resolution_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="disputes")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="milestone")  # inspection, milestone, payment, dispute, alert
    read = Column(Boolean, default=False)
    link = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    actor_id = Column(String(36), nullable=False)
    actor_name = Column(String(255), nullable=False)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(36), nullable=False)
    prev_state_json = Column(JSON, nullable=True)
    new_state_json = Column(JSON, nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="audit_logs")
