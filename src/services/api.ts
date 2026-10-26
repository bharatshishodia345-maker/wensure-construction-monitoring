/**
 * WENSURE Centralized API Client
 * Provides typed, robust asynchronous communication with the FastAPI backend,
 * respecting environment configuration and handling errors consistently.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const HEALTH_URL = import.meta.env.VITE_API_HEALTH_URL || API_BASE_URL.replace(/\/api\/v1\/?$/, '') + '/health';

export interface HealthCheckResponse {
  status: string;
  ready?: boolean;
  service?: string;
  database?: string;
  database_engine?: string;
  version?: string;
  timestamp?: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  role: string;
  user_id: string;
  full_name: string;
  email: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('wensure_auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('wensure_auth_token', token);
    } else {
      localStorage.removeItem('wensure_auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async checkHealth(): Promise<HealthCheckResponse | null> {
    try {
      const response = await fetch(HEALTH_URL, {
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async login(email: string, password: string): Promise<AuthTokenResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Authentication failed');
    }

    const data: AuthTokenResponse = await response.json();
    if (data.access_token) {
      this.setToken(data.access_token);
    }
    return data;
  }

  async demoLogin(role: string): Promise<AuthTokenResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/demo-login?role=${encodeURIComponent(role)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) return null;

      const data: AuthTokenResponse = await response.json();
      if (data.access_token) {
        this.setToken(data.access_token);
      }
      return data;
    } catch (err) {
      console.warn('[WENSURE API] Demo login failed (backend offline or unavailable):', err);
      return null;
    }
  }

  async getCurrentUser() {
    if (!this.token) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: this.getHeaders(),
      });
      if (response.status === 401) {
        this.setToken(null);
        return null;
      }
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getActiveProject() {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/active`, {
        headers: this.getHeaders(),
      });
      if (response.status === 401) {
        this.setToken(null);
        return null;
      }
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.warn('[WENSURE API] Backend unreachable, using cached state:', err);
      return null;
    }
  }

  async submitWorkUpdate(payload: {
    milestoneId: string;
    progressPercent: number;
    notes: string;
    photoTitle?: string;
    photoUrl?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/milestones/${payload.milestoneId}/progress`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          progress_percent: payload.progressPercent,
          notes: payload.notes,
          photo_title: payload.photoTitle,
          photo_url: payload.photoUrl,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to submit work update: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.warn('[WENSURE API] Falling back to offline state update:', err);
      return null;
    }
  }

  async verifyMilestone(milestoneId: string, notes = 'Verified by independent audit lead') {
    try {
      const response = await fetch(`${API_BASE_URL}/milestones/${milestoneId}/verify`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          verified_by: 'WENSURE Licensed Civil Inspector',
          verification_notes: notes,
          release_escrow: true,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to verify milestone: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.warn('[WENSURE API] Verification offline fallback:', err);
      return null;
    }
  }

  async submitObservationResponse(findingId: string, responseText: string, plan?: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/inspections/findings/${findingId}/respond`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          contractor_response: responseText,
          rectification_plan: plan,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to submit response: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.warn('[WENSURE API] Finding response offline fallback:', err);
      return null;
    }
  }

  async resolveFinding(findingId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/inspections/findings/${findingId}/resolve`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to resolve finding: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.warn('[WENSURE API] Finding resolve offline fallback:', err);
      return null;
    }
  }

  async verifyAndDisburseTranche(trancheId: string) {
    // Explicit demo-only action: In live production, escrow release requires
    // certified independent civil engineer inspection and bank escrow integration.
    return {
      success: true,
      isDemo: true,
      trancheId,
      message: 'Demo tranche approved. Real escrow release requires bank integration.'
    };
  }

  async getFinancialSummary(projectId?: string) {
    try {
      const url = projectId
        ? `${API_BASE_URL}/financials/summary?project_id=${projectId}`
        : `${API_BASE_URL}/financials/summary`;
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async markNotificationRead(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async markAllNotificationsRead() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getContractors() {
    try {
      const response = await fetch(`${API_BASE_URL}/contractors`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getChartData() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/chart-data`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getProgressChartData() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/progress-chart`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getBudgetChartData() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/budget-chart`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getIssuesChartData() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/issues-chart`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getInspectionStatusData() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/inspection-status`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getAnalyticsSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/summary`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }
}

export const api = new ApiClient();
