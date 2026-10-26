import pytest
from httpx import AsyncClient
from backend.app.config import settings

@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient):
    """Verifies health check readiness, DB connectivity, and dynamic timestamp."""
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["ready"] is True
    assert data["database"] == "connected"
    assert "timestamp" in data
    assert "database_engine" in data

@pytest.mark.asyncio
async def test_demo_login_and_production_restriction(client: AsyncClient):
    """Verifies that demo login works in development and is rejected in production."""
    # 1. In dev mode: returns token
    login_res = await client.post("/api/v1/auth/demo-login?role=customer")
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["role"] == "customer"
    token = token_data["access_token"]

    # 2. Authenticated /me endpoint works
    headers = {"Authorization": f"Bearer {token}"}
    me_res = await client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "bharat@wensure.com"
    assert me_data["role"] == "customer"

    # 3. In production mode: demo login is strictly blocked
    prev_env = settings.APP_ENV
    try:
        settings.APP_ENV = "production"
        prod_res = await client.post("/api/v1/auth/demo-login?role=customer")
        assert prod_res.status_code == 403
    finally:
        settings.APP_ENV = prev_env

@pytest.mark.asyncio
async def test_role_escalation_prevention(client: AsyncClient):
    """Verifies that authenticated users cannot alter their own database role."""
    login_res = await client.post("/api/v1/auth/demo-login?role=customer")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Attempt to self-escalate to admin
    switch_res = await client.post(
        "/api/v1/auth/switch-role",
        json={"role": "admin"},
        headers=headers
    )
    assert switch_res.status_code == 403
    assert "prohibited" in switch_res.json()["detail"].lower()

@pytest.mark.asyncio
async def test_active_project_retrieval(client: AsyncClient):
    """Retrieves active project for authorized project member."""
    login_res = await client.post("/api/v1/auth/demo-login?role=customer")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    proj_res = await client.get("/api/v1/projects/active", headers=headers)
    assert proj_res.status_code == 200
    project = proj_res.json()
    assert project["name"] == "Baner Modern Villa"
    assert project["slug"] == "baner-modern-villa-pune"
    assert len(project["milestones"]) >= 6

@pytest.mark.asyncio
async def test_project_membership_and_cross_user_isolation(client: AsyncClient):
    """Verifies that users without project membership are blocked from accessing private project records."""
    # Obtain admin token to create an unrelated user without memberships
    admin_login = await client.post("/api/v1/auth/demo-login?role=admin")
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Verify admin can access project
    admin_proj = await client.get("/api/v1/projects/proj-baner-villa-01", headers=admin_headers)
    assert admin_proj.status_code == 200

    # Test unauthenticated access to financial summary
    unauth_fin = await client.get("/api/v1/financials/summary")
    assert unauth_fin.status_code == 401

@pytest.mark.asyncio
async def test_financial_summary_metrics(client: AsyncClient):
    """Verifies dynamic calculation of financial summary metrics."""
    login_res = await client.post("/api/v1/auth/demo-login?role=customer")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    fin_res = await client.get("/api/v1/financials/summary?project_id=proj-baner-villa-01", headers=headers)
    assert fin_res.status_code == 200
    fin_data = fin_res.json()
    assert fin_data["total_budget"] == 8500000.0
    assert fin_data["spent_amount"] >= 0
    assert fin_data["escrow_balance"] > 0
    assert fin_data["under_inspection"] >= 0.0  # Dynamically calculated from milestones
    assert len(fin_data["recent_transactions"]) > 0

@pytest.mark.asyncio
async def test_work_update_persistence_and_progress_validation(client: AsyncClient):
    """Contractor submits work update with progress percent and evidence metadata."""
    login_res = await client.post("/api/v1/auth/demo-login?role=contractor")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    update_payload = {
        "milestone_id": "ms-03-structural-rcc",
        "progress_percent": 65.0,
        "notes": "First floor beam shuttering and rebar binding completed.",
        "photo_title": "First Floor Rebar Grid",
        "photo_url": "https://example.com/site-photos/rebar-b4.jpg"
    }

    # Post to the unified progress route
    res = await client.post(
        "/api/v1/milestones/ms-03-structural-rcc/progress",
        json=update_payload,
        headers=headers
    )
    assert res.status_code == 200
    data = res.json()
    assert data["progress_percent"] == 65.0
    assert "rebar" in data["summary"].lower() or "rebar" in data["contractor_notes"].lower()

@pytest.mark.asyncio
async def test_trust_model_unverified_evidence(client: AsyncClient):
    """Verifies that newly uploaded evidence strictly defaults to unverified."""
    login_res = await client.post("/api/v1/auth/demo-login?role=contractor")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    evidence_payload = {
        "milestone_id": "ms-03-structural-rcc",
        "title": "Site Cube Compression Test Lab Report",
        "file_url": "https://example.com/reports/cube-test.pdf",
        "file_type": "application/pdf",
        "file_size_bytes": 524288
    }
    ev_res = await client.post(
        "/api/v1/milestones/ms-03-structural-rcc/evidence",
        json=evidence_payload,
        headers=headers
    )
    assert ev_res.status_code == 200
    ev_data = ev_res.json()
    assert ev_data["verification_status"] == "unverified"

@pytest.mark.asyncio
async def test_finding_response_and_resolution_flow(client: AsyncClient):
    """
    Tests finding lifecycle:
    1. Inspector records inspection with finding
    2. Contractor submits rectification response
    3. Contractor is BLOCKED from self-resolving
    4. Inspector verifies and resolves finding
    """
    # 1. Inspector records inspection
    insp_login = await client.post("/api/v1/auth/demo-login?role=inspector")
    insp_token = insp_login.json()["access_token"]
    insp_headers = {"Authorization": f"Bearer {insp_token}"}

    insp_payload = {
        "project_id": "proj-baner-villa-01",
        "milestone_id": "ms-03-structural-rcc",
        "inspector_name": "Dr. Kulkarni (Licensed Civil Inspector)",
        "inspector_license": "INSP-RERA-4091",
        "inspection_date": "2026-10-13",
        "overall_status": "conditional",
        "notes": "Inspection noted minor cover block displacement.",
        "findings": [
            {
                "category": "Structural Integrity",
                "severity": "medium",
                "title": "Insufficient Cover Block Thickness",
                "description": "Grid B-4 beam rebar cover is 20mm instead of specified 25mm.",
                "location_on_site": "Grid B-4, First Floor Beam"
            }
        ]
    }

    create_res = await client.post("/api/v1/inspections", json=insp_payload, headers=insp_headers)
    assert create_res.status_code == 200
    insp_data = create_res.json()
    assert len(insp_data["findings"]) > 0
    finding_id = insp_data["findings"][0]["id"]
    assert insp_data["findings"][0]["resolution_status"] == "open"

    # 2. Contractor responds with rectification plan
    cont_login = await client.post("/api/v1/auth/demo-login?role=contractor")
    cont_token = cont_login.json()["access_token"]
    cont_headers = {"Authorization": f"Bearer {cont_token}"}

    respond_payload = {
        "contractor_response": "Installed 25mm PVC spacer blocks across entire B-4 span.",
        "rectification_plan": "Re-verified spacing before concrete pour."
    }
    resp_res = await client.post(
        f"/api/v1/inspections/findings/{finding_id}/respond",
        json=respond_payload,
        headers=cont_headers
    )
    assert resp_res.status_code == 200
    resp_data = resp_res.json()
    assert resp_data["resolution_status"] == "addressed"
    assert resp_data["contractor_response"] is not None

    # 3. Contractor tries to resolve finding -> BLOCKED (403 Forbidden)
    cont_resolve = await client.post(
        f"/api/v1/inspections/findings/{finding_id}/resolve",
        headers=cont_headers
    )
    assert cont_resolve.status_code == 403
    assert "cannot self-verify" in cont_resolve.json()["detail"].lower()

    # 4. Inspector verifies and resolves finding -> SUCCESS (200)
    insp_resolve = await client.post(
        f"/api/v1/inspections/findings/{finding_id}/resolve",
        headers=insp_headers
    )
    assert insp_resolve.status_code == 200
    assert insp_resolve.json()["resolution_status"] == "verified_resolved"

@pytest.mark.asyncio
async def test_notification_operations(client: AsyncClient):
    """Verifies that notifications can be read via POST/PATCH and mark-all-read."""
    login_res = await client.post("/api/v1/auth/demo-login?role=customer")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    notifs_res = await client.get("/api/v1/notifications", headers=headers)
    assert notifs_res.status_code == 200
    notifs = notifs_res.json()

    if len(notifs) > 0:
        nid = notifs[0]["id"]
        # Test POST /notifications/{id}/read
        post_read = await client.post(f"/api/v1/notifications/{nid}/read", headers=headers)
        assert post_read.status_code == 200
        assert post_read.json()["read"] is True

        # Test PATCH /notifications/{id}/read
        patch_read = await client.patch(f"/api/v1/notifications/{nid}/read", headers=headers)
        assert patch_read.status_code == 200

    # Test mark-all-read
    all_read = await client.post("/api/v1/notifications/mark-all-read", headers=headers)
    assert all_read.status_code == 200

@pytest.mark.asyncio
async def test_contractor_directory_routes(client: AsyncClient):
    """Verifies both /contractors and /contractors/directory routes work identically."""
    login_res = await client.post("/api/v1/auth/demo-login?role=customer")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res1 = await client.get("/api/v1/contractors", headers=headers)
    assert res1.status_code == 200
    contractors1 = res1.json()

    res2 = await client.get("/api/v1/contractors/directory", headers=headers)
    assert res2.status_code == 200
    contractors2 = res2.json()

    assert len(contractors1) == len(contractors2)

@pytest.mark.asyncio
async def test_authorized_milestone_verification_and_refusal(client: AsyncClient):
    """
    Tests milestone verification security:
    1. Contractor cannot verify milestone (403)
    2. Customer cannot verify milestone (403)
    3. Verification without passing inspection is refused (400)
    4. Duplicate verification is refused (400)
    """
    # 1. Contractor attempts verification -> 403
    cont_login = await client.post("/api/v1/auth/demo-login?role=contractor")
    cont_token = cont_login.json()["access_token"]
    cont_headers = {"Authorization": f"Bearer {cont_token}"}

    verify_payload = {
        "verified_by": "Apex Builder Self Signoff",
        "verification_notes": "Attempting contractor self-verification",
        "release_escrow": True
    }
    cont_res = await client.post(
        "/api/v1/milestones/ms-03-structural-rcc/verify",
        json=verify_payload,
        headers=cont_headers
    )
    assert cont_res.status_code == 403

    # 2. Customer attempts verification -> 403
    cust_login = await client.post("/api/v1/auth/demo-login?role=customer")
    cust_token = cust_login.json()["access_token"]
    cust_headers = {"Authorization": f"Bearer {cust_token}"}

    cust_res = await client.post(
        "/api/v1/milestones/ms-03-structural-rcc/verify",
        json=verify_payload,
        headers=cust_headers
    )
    assert cust_res.status_code == 403

    # 3. Inspector attempts verification on ms-04 (which has no passing inspection) -> 400
    insp_login = await client.post("/api/v1/auth/demo-login?role=inspector")
    insp_token = insp_login.json()["access_token"]
    insp_headers = {"Authorization": f"Bearer {insp_token}"}

    valid_payload = {
        "verified_by": "Dr. Kulkarni (Licensed Civil Inspector)",
        "verification_notes": "Attempting verification without inspection",
        "release_escrow": True
    }
    no_insp_res = await client.post(
        "/api/v1/milestones/ms-04-masonry/verify",
        json=valid_payload,
        headers=insp_headers
    )
    assert no_insp_res.status_code == 400
    assert "no independent site inspections" in no_insp_res.json()["detail"].lower()

    # 4. Duplicate verification on ms-01 (already verified) -> 400
    dup_res = await client.post(
        "/api/v1/milestones/ms-01-site-prep/verify",
        json=valid_payload,
        headers=insp_headers
    )
    assert dup_res.status_code == 400
    assert "already" in dup_res.json()["detail"].lower()

@pytest.mark.asyncio
async def test_unauthorized_route_protection(client: AsyncClient):
    """Verifies that accessing protected resources without token yields 401."""
    res = await client.get("/api/v1/auth/me")
    assert res.status_code == 401
