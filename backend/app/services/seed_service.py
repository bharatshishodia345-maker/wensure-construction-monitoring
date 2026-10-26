from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from backend.app.models.all_models import (
    User, ContractorProfile, Project, ProjectMembership,
    Milestone, WorkUpdate, EvidenceAsset, Inspection, Finding,
    BudgetTransaction, Dispute, Notification, AuditLog
)
from backend.app.services.auth_service import hash_password

async def seed_database_if_empty(session: AsyncSession):
    """Initializes the database with authentic Baner Villa baseline data matching WENSURE specification."""
    # Check if users already exist
    stmt = select(User).limit(1)
    result = await session.execute(stmt)
    if result.scalar_one_or_none():
        return  # Database already seeded

    default_pwd_hash = hash_password("password123")

    # 1. Create Core Users
    customer_user = User(
        id="usr-customer-01",
        email="bharat@wensure.com",
        full_name="Bharat Shishodia",
        role="customer",
        hashed_password=default_pwd_hash,
        phone="+91 98230 44102",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        is_active=True
    )

    contractor_user = User(
        id="usr-contractor-01",
        email="apex@wensure.com",
        full_name="Rajesh Sharma (Apex Builders)",
        role="contractor",
        hashed_password=default_pwd_hash,
        phone="+91 98901 22340",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        is_active=True
    )

    admin_user = User(
        id="usr-admin-01",
        email="admin@wensure.com",
        full_name="Anand Deshmukh (WENSURE QA Lead)",
        role="admin",
        hashed_password=default_pwd_hash,
        phone="+91 98111 55667",
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        is_active=True
    )

    inspector_user = User(
        id="usr-inspector-01",
        email="inspector@wensure.com",
        full_name="Dr. Kulkarni (Licensed Civil Inspector)",
        role="inspector",
        hashed_password=default_pwd_hash,
        phone="+91 98765 43210",
        avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        is_active=True
    )

    session.add_all([customer_user, contractor_user, admin_user, inspector_user])
    await session.flush()

    # 2. Create Contractor Profile
    contractor_profile = ContractorProfile(
        id="cp-apex-01",
        user_id=contractor_user.id,
        company_name="Apex Structural Builders",
        trust_score=96,
        verified_milestones_count=24,
        active_projects_count=3,
        rating=4.9,
        specialty="Reinforced Concrete & Contemporary Residential Framing",
        location="Baner, Pune, Maharashtra",
        license_number="MH-CREDAI-2024-8841",
        bio="Leading Pune residential builder with 14 years experience specializing in high-grade M25 concrete structures and independent audit compliance."
    )
    session.add(contractor_profile)

    # 3. Create Project: Baner Modern Villa
    project = Project(
        id="proj-baner-villa-01",
        # NOTE: This is a demonstration project used to showcase the WENSURE platform.
        # All data (budget, progress, transactions, inspections) is simulated for demo purposes.
        # No real financial transfers occur; escrow updates are recorded in this database only.
        # The SHA-256 verification_hash is an application-layer integrity marker; it is not
        # stored on an immutable external ledger.
        name="Baner Modern Villa",
        slug="baner-modern-villa-pune",
        address="Plot 42, Elite Green Meadows, Pancard Club Road, Baner",
        city="Pune",
        state="Maharashtra",
        postal_code="411045",
        client_name="Bharat Shishodia",
        contractor_name="Apex Structural Builders",
        current_stage="Structural Framing & RCC",
        total_budget=8500000.0,
        spent_amount=3200000.0,
        escrow_balance=5300000.0,
        verified_percentage=38,
        health_score=94,
        status="active",
        start_date="2025-01-15",
        expected_completion="2025-11-30",
        camera_stage_index=2
    )
    session.add(project)
    await session.flush()

    # 4. Project Memberships
    m1 = ProjectMembership(project_id=project.id, user_id=customer_user.id, role="customer")
    m2 = ProjectMembership(project_id=project.id, user_id=contractor_user.id, role="contractor")
    m3 = ProjectMembership(project_id=project.id, user_id=admin_user.id, role="admin")
    m4 = ProjectMembership(project_id=project.id, user_id=inspector_user.id, role="inspector")
    session.add_all([m1, m2, m3, m4])

    # 5. Milestones
    ms1 = Milestone(
        id="ms-01-site-prep",
        project_id=project.id,
        title="Site Preparation & Excavation",
        stage_number=1,
        target_date="2025-02-15",
        completed_date="2025-02-14",
        payment_percentage=15,
        escrow_amount=1275000.0,
        status="verified",
        verification_hash="a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
        verified_at=datetime(2025, 2, 14, 16, 30),
        verified_by="WENSURE Independent Auditor (Er. P. Joshi)",
        order_index=1
    )

    ms2 = Milestone(
        id="ms-02-foundation",
        project_id=project.id,
        title="Substructure & Raft Foundation",
        stage_number=2,
        target_date="2025-03-25",
        completed_date="2025-03-22",
        payment_percentage=20,
        escrow_amount=1700000.0,
        status="verified",
        verification_hash="b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890a1",
        verified_at=datetime(2025, 3, 23, 11, 15),
        verified_by="WENSURE Independent Civil Inspector",
        order_index=2
    )

    ms3 = Milestone(
        id="ms-03-structural-rcc",
        project_id=project.id,
        title="Structural Framing & RCC Superstructure",
        stage_number=3,
        target_date="2025-05-30",
        completed_date=None,
        payment_percentage=20,
        escrow_amount=1700000.0,
        status="evidence_submitted",
        verification_hash=None,
        order_index=3
    )

    ms4 = Milestone(
        id="ms-04-masonry",
        project_id=project.id,
        title="AAC Blockwork & External Plastering",
        stage_number=4,
        target_date="2025-07-20",
        completed_date=None,
        payment_percentage=15,
        escrow_amount=1275000.0,
        status="planned",
        order_index=4
    )

    ms5 = Milestone(
        id="ms-05-services",
        project_id=project.id,
        title="Electrical, Plumbing & HVAC Conduits",
        stage_number=5,
        target_date="2025-09-15",
        completed_date=None,
        payment_percentage=15,
        escrow_amount=1275000.0,
        status="planned",
        order_index=5
    )

    ms6 = Milestone(
        id="ms-06-finishing",
        project_id=project.id,
        title="Interior Finishes, Glazing & Handover",
        stage_number=6,
        target_date="2025-11-30",
        completed_date=None,
        payment_percentage=15,
        escrow_amount=1275000.0,
        status="planned",
        order_index=6
    )

    session.add_all([ms1, ms2, ms3, ms4, ms5, ms6])
    await session.flush()

    # 6. Work Updates for Milestone 3 (Active)
    wu1 = WorkUpdate(
        id="wu-03-01",
        milestone_id=ms3.id,
        title="First Floor Column Reinforcement Complete",
        summary="C20-C28 columns shuttered with marine-grade ply and bound with Fe550D TMT rebar.",
        work_performed="12 columns poured using Ready-Mix M25 concrete with mechanical vibration. 7-day water curing initiated.",
        materials_used="M25 RMC (UltraTech), Tata Tiscon 550D Rebar (16mm & 20mm), Waterproofing admixture",
        contractor_notes="Cube test samples taken at batching plant and on-site. Lab compression report pending for 7-day cure.",
        timestamp=datetime(2025, 4, 18, 14, 0),
        created_by="Rajesh Sharma (Apex Builders)"
    )
    session.add(wu1)
    await session.flush()

    # 7. Evidence Assets
    ea1 = EvidenceAsset(
        id="ea-01",
        milestone_id=ms3.id,
        work_update_id=wu1.id,
        title="Column Reinforcement Binding & Cover Blocks Photo",
        file_url="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
        file_type="image/jpeg",
        sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        verification_status="unverified"
    )
    ea2 = EvidenceAsset(
        id="ea-02",
        milestone_id=ms3.id,
        work_update_id=wu1.id,
        title="RMC Batching Slump Test Report",
        file_url="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
        file_type="image/jpeg",
        sha256_hash="4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
        verification_status="independently_verified"
    )
    session.add_all([ea1, ea2])

    # 8. Inspection & Findings
    insp1 = Inspection(
        id="insp-01-m2",
        project_id=project.id,
        milestone_id=ms2.id,
        inspector_name="Dr. Kulkarni (Licensed Civil Inspector)",
        inspector_license="INSP-RERA-4091",
        inspection_date="2025-03-22",
        overall_status="passed",
        notes="Raft foundation depth, anti-termite chemical barrier, and steel spacing comply with IS 456-2000 specifications.",
        report_pdf_url="/reports/INSP-RERA-4091-BanerVilla-Stage2.pdf"
    )
    session.add(insp1)
    await session.flush()

    f1 = Finding(
        id="find-01",
        inspection_id=insp1.id,
        milestone_id=ms2.id,
        category="Curing Protocol",
        severity="low",
        title="Minor dry patch observed on periphery footing",
        description="Recommend hessian cloth wrapping for continuous moisture retention during 40-degree daytime heat.",
        location_on_site="Grid A-1 Footing",
        resolution_status="verified_resolved"
    )
    session.add(f1)

    # 9. Budget Transactions
    bt1 = BudgetTransaction(
        id="bt-01",
        project_id=project.id,
        milestone_id=ms1.id,
        title="Stage 1 Verified Release — Site Preparation",
        category="Verified Milestone Disbursement",
        amount=1275000.0,
        transaction_type="contractor_disbursement",
        date="2025-02-14",
        status="cleared",
        invoice_url="/invoices/INV-2025-001.pdf"
    )
    bt2 = BudgetTransaction(
        id="bt-02",
        project_id=project.id,
        milestone_id=ms2.id,
        title="Stage 2 Verified Release — Raft Foundation",
        category="Verified Milestone Disbursement",
        amount=1700000.0,
        transaction_type="contractor_disbursement",
        date="2025-03-23",
        status="cleared",
        invoice_url="/invoices/INV-2025-002.pdf"
    )
    bt3 = BudgetTransaction(
        id="bt-03",
        project_id=project.id,
        milestone_id=ms3.id,
        title="Stage 3 Escrow Deposit Secured",
        category="Escrow Lock",
        amount=1700000.0,
        transaction_type="escrow_deposit",
        date="2025-04-01",
        status="escrow_locked"
    )
    session.add_all([bt1, bt2, bt3])

    # 10. Notifications
    n1 = Notification(
        id="notif-01",
        user_id=customer_user.id,
        title="Stage 2 Milestone Verified & Disbursed",
        message="Independent inspector Dr. Kulkarni approved the Substructure Raft Foundation. INR 17.0L disbursed from escrow.",
        type="payment",
        read=False,
        link="/customer/milestones"
    )
    n2 = Notification(
        id="notif-02",
        user_id=customer_user.id,
        title="Work Update Submitted for Stage 3",
        message="Apex Builders submitted photos & batching notes for First Floor Column Reinforcement.",
        type="milestone",
        read=False,
        link="/customer/updates"
    )
    session.add_all([n1, n2])

    await session.commit()
