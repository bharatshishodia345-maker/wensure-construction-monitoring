/**
 * WENSURE Analytics Charts
 * 
 * All charts here use Recharts and display only data sourced from the backend.
 * When data is insufficient or unavailable, an explicit state is shown.
 * No fabricated historical records or ML predictions are used.
 */

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { api } from '../../services/api';
import { AlertTriangle, Info } from 'lucide-react';

// ─── Colour palette consistent with WENSURE design system ────────────────────
const WENSURE_TEAL = '#2DD4BF';
const WENSURE_FOREST = '#264E36';
const WENSURE_AMBER = '#D97706';
const WENSURE_STONE = '#78716C';
const WENSURE_ROSE = '#E11D48';
const WENSURE_BLUE = '#3B82F6';

const STATUS_COLORS: Record<string, string> = {
  verified: WENSURE_FOREST,
  inspected: WENSURE_TEAL,
  evidence_submitted: WENSURE_BLUE,
  reported: WENSURE_AMBER,
  in_progress: '#F59E0B',
  planned: WENSURE_STONE,
  disputed: WENSURE_ROSE,
  passed: WENSURE_FOREST,
  conditional: WENSURE_AMBER,
  failed: WENSURE_ROSE,
  under_review: WENSURE_BLUE,
  open: WENSURE_ROSE,
  verified_resolved: WENSURE_FOREST,
  addressed: WENSURE_TEAL,
  low: WENSURE_TEAL,
  medium: WENSURE_AMBER,
  high: '#F97316',
  critical: WENSURE_ROSE,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatINR(v: number): string {
  if (v >= 10_00_000) return `₹${(v / 10_00_000).toFixed(1)}L`;
  if (v >= 1_000) return `₹${(v / 1_000).toFixed(0)}K`;
  return `₹${v}`;
}

const INRTooltipFormatter = (value: any) => [formatINR(Number(value) || 0), ''];

// ─── Loading / Error / Empty states ──────────────────────────────────────────
export const ChartLoading: React.FC<{ label?: string }> = ({ label = 'Loading chart data…' }) => (
  <div className="flex flex-col items-center justify-center h-48 text-wensure-muted-text gap-2">
    <div className="w-6 h-6 border-2 border-wensure-teal border-t-transparent rounded-full animate-spin" />
    <span className="text-xs">{label}</span>
  </div>
);

export const InsufficientData: React.FC<{ message?: string }> = ({
  message = 'Insufficient data recorded to render this chart. More records are needed.',
}) => (
  <div className="flex flex-col items-center justify-center h-48 text-wensure-muted-text gap-2 border border-dashed border-wensure-fine-divider rounded-lg p-4">
    <Info className="w-5 h-5 text-wensure-teal" />
    <p className="text-xs text-center max-w-xs">{message}</p>
  </div>
);

export const ChartError: React.FC<{ message?: string }> = ({
  message = 'Could not load chart data. Ensure the backend is running.',
}) => (
  <div className="flex flex-col items-center justify-center h-48 text-amber-700 gap-2 bg-amber-50 rounded-lg p-4 border border-amber-200">
    <AlertTriangle className="w-5 h-5" />
    <p className="text-xs text-center">{message}</p>
  </div>
);

// ─── 1. Progress Comparison Chart ────────────────────────────────────────────
interface ProgressRow {
  stage_number: number;
  title: string;
  planned_pct: number;
  contractor_reported_pct: number;
  verified_pct: number;
  status: string;
}

interface ProgressChartData {
  data_available: boolean;
  message?: string;
  milestones: ProgressRow[];
}

const ProgressCustomTooltip = ({ active, payload, label, milestones }: any) => {
  if (!active || !payload?.length) return null;
  const milestone = milestones?.find((m: any) => `S${m.stage_number}` === label);
  return (
    <div className="bg-white border border-wensure-fine-divider rounded shadow-lg p-3 text-xs max-w-56">
      <p className="font-semibold text-wensure-ink mb-1.5">{milestone?.title ?? label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.fill }}>{p.dataKey}</span>
          <span className="font-mono font-bold">{p.value}%</span>
        </div>
      ))}
      {milestone && (
        <p className="text-wensure-muted-text mt-1.5 capitalize border-t border-stone-100 pt-1">
          Status: {milestone.status.replace(/_/g, ' ')}
        </p>
      )}
    </div>
  );
};

export const ProgressComparisonChart: React.FC = () => {
  const [data, setData] = useState<ProgressChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.getProgressChartData()
      .then((d) => {
        if (d) setData(d);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ChartLoading label="Loading progress data…" />;
  if (error) return <ChartError />;
  if (!data?.data_available || !data.milestones.length)
    return <InsufficientData message={data?.message} />;

  const chartRows = data.milestones.map((m) => ({
    name: `S${m.stage_number}`,
    fullTitle: m.title,
    Planned: m.planned_pct,
    'Contractor Reported': m.contractor_reported_pct,
    'Independently Verified': m.verified_pct,
  }));

  return (
    <div>
      <p className="text-[11px] text-wensure-muted-text mb-3">
        Three progress series: contractual plan, contractor self-report, and WENSURE independent verification.
      </p>
      <div aria-label="Progress comparison bar chart">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartRows} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EB" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716C' }} />
            <YAxis unit="%" tick={{ fontSize: 11, fill: '#78716C' }} domain={[0, 100]} />
            <Tooltip content={<ProgressCustomTooltip milestones={data.milestones} />} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Planned" fill={WENSURE_STONE} radius={[2, 2, 0, 0]} maxBarSize={24} />
            <Bar dataKey="Contractor Reported" fill={WENSURE_AMBER} radius={[2, 2, 0, 0]} maxBarSize={24} />
            <Bar dataKey="Independently Verified" fill={WENSURE_FOREST} radius={[2, 2, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─── 2. Budget Allocation Chart ───────────────────────────────────────────────
interface BudgetRow {
  title: string;
  escrow_amount: number;
  payment_percentage: number;
  status: string;
}

interface BudgetData {
  data_available: boolean;
  message?: string;
  total_budget: number;
  spent_amount: number;
  escrow_balance: number;
  milestone_allocation: BudgetRow[];
  burn_timeline: { date: string; amount: number; title: string }[];
}

export const BudgetAllocationChart: React.FC = () => {
  const [data, setData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.getBudgetChartData()
      .then((d) => {
        if (d) setData(d);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ChartLoading label="Loading budget data…" />;
  if (error) return <ChartError />;
  if (!data?.data_available) return <InsufficientData message={data?.message} />;

  const allocationData = data.milestone_allocation.map((m, i) => ({
    name: `S${i + 1}`,
    fullTitle: m.title,
    amount: m.escrow_amount,
    status: m.status,
    fill: STATUS_COLORS[m.status] ?? WENSURE_STONE,
  }));

  const pieData = [
    { name: 'Disbursed', value: data.spent_amount, fill: WENSURE_FOREST },
    { name: 'Escrow Held', value: data.escrow_balance, fill: WENSURE_TEAL },
    { name: 'Remaining', value: Math.max(0, data.total_budget - data.spent_amount - data.escrow_balance), fill: WENSURE_STONE },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie: Budget disposition */}
        <div>
          <h4 className="text-xs font-semibold text-wensure-muted-text uppercase tracking-wider mb-2">Budget Disposition</h4>
          <p className="text-[11px] text-wensure-muted-text mb-3">Cleared disbursements, current escrow, and uncommitted remainder. Source: database transactions.</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
                fontSize={10}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={INRTooltipFormatter} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-[11px] mt-1">
            {pieData.map((d) => (
              <span key={d.name} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: d.fill }} />
                {d.name}: {formatINR(d.value)}
              </span>
            ))}
          </div>
        </div>

        {/* Bar: Milestone allocation */}
        <div>
          <h4 className="text-xs font-semibold text-wensure-muted-text uppercase tracking-wider mb-2">Milestone Escrow Allocation</h4>
          <p className="text-[11px] text-wensure-muted-text mb-3">Per-stage escrow amounts. Colour indicates current milestone status.</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={allocationData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EB" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#78716C' }} />
              <YAxis tickFormatter={formatINR} tick={{ fontSize: 10, fill: '#78716C' }} />
              <Tooltip
                formatter={(v: any) => [formatINR(Number(v) || 0), 'Escrow Amount']}
                labelFormatter={(l) => {
                  const row = allocationData.find((r) => r.name === l);
                  return row?.fullTitle ?? l;
                }}
              />
              <Bar dataKey="amount" radius={[3, 3, 0, 0]} maxBarSize={32}>
                {allocationData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Burn timeline */}
      {data.burn_timeline.length >= 2 ? (
        <div>
          <h4 className="text-xs font-semibold text-wensure-muted-text uppercase tracking-wider mb-1">Cleared Disbursements Timeline</h4>
          <p className="text-[11px] text-wensure-muted-text mb-3">Chronological cleared transactions from the database. No projections included.</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={data.burn_timeline.map((t) => ({ ...t, label: t.date.slice(0, 7) }))}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EB" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#78716C' }} />
              <YAxis tickFormatter={formatINR} tick={{ fontSize: 10, fill: '#78716C' }} />
              <Tooltip formatter={INRTooltipFormatter} />
              <Bar dataKey="amount" fill={WENSURE_FOREST} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <InsufficientData message="Fewer than 2 cleared transactions recorded. Burn timeline chart requires at least 2 data points." />
      )}
    </div>
  );
};

// ─── 3. Issues & Findings Chart ───────────────────────────────────────────────
interface FindingsData {
  data_available: boolean;
  message?: string;
  total: number;
  severity_breakdown: { severity: string; count: number }[];
  status_breakdown: { status: string; count: number }[];
  category_breakdown: { category: string; count: number }[];
}

export const IssuesFindingsChart: React.FC = () => {
  const [data, setData] = useState<FindingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.getIssuesChartData()
      .then((d) => {
        if (d) setData(d);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ChartLoading label="Loading issues data…" />;
  if (error) return <ChartError />;
  if (!data?.data_available || !data.severity_breakdown.length)
    return <InsufficientData message={data?.message ?? 'No findings recorded from inspections yet.'} />;

  const severityData = data.severity_breakdown.map((d) => ({
    name: d.severity.charAt(0).toUpperCase() + d.severity.slice(1),
    count: d.count,
    fill: STATUS_COLORS[d.severity] ?? WENSURE_STONE,
  }));

  const statusData = data.status_breakdown.map((d) => ({
    name: d.status.replace(/_/g, ' '),
    count: d.count,
    fill: STATUS_COLORS[d.status] ?? WENSURE_STONE,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Severity breakdown */}
        <div>
          <h4 className="text-xs font-semibold text-wensure-muted-text uppercase tracking-wider mb-2">Findings by Severity</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={severityData} cx="50%" cy="50%" outerRadius={75} dataKey="count" label={({ name, count }: any) => `${name}: ${count}`} fontSize={10} labelLine>
                {severityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [v, 'Findings']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Resolution status */}
        <div>
          <h4 className="text-xs font-semibold text-wensure-muted-text uppercase tracking-wider mb-2">Resolution Status</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EB" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#78716C' }} width={90} />
              <Tooltip formatter={(v: any) => [v, 'Findings']} />
              <Bar dataKey="count" radius={[0, 3, 3, 0]} maxBarSize={28}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown */}
      {data.category_breakdown.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-wensure-muted-text uppercase tracking-wider mb-2">Findings by Category</h4>
          <div className="space-y-2">
            {data.category_breakdown.map((c) => (
              <div key={c.category} className="flex items-center gap-3 text-xs">
                <span className="w-32 text-wensure-ink truncate shrink-0">{c.category}</span>
                <div className="flex-1 bg-wensure-soft-stone h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-wensure-forest rounded-full"
                    style={{ width: `${(c.count / data.total) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-wensure-muted-text w-8 text-right">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── 4. Inspection Status Chart ───────────────────────────────────────────────
interface InspectionData {
  data_available: boolean;
  message?: string;
  total: number;
  status_breakdown: { status: string; count: number }[];
  inspections: { id: string; inspector_name: string; inspection_date: string; overall_status: string }[];
}

export const InspectionStatusChart: React.FC = () => {
  const [data, setData] = useState<InspectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.getInspectionStatusData()
      .then((d) => {
        if (d) setData(d);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ChartLoading label="Loading inspection data…" />;
  if (error) return <ChartError />;
  if (!data?.data_available || !data.inspections.length)
    return <InsufficientData message={data?.message ?? 'No inspections recorded yet.'} />;

  const statusData = data.status_breakdown.map((d) => ({
    name: d.status.charAt(0).toUpperCase() + d.status.slice(1),
    count: d.count,
    fill: STATUS_COLORS[d.status] ?? WENSURE_STONE,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs font-semibold text-wensure-muted-text uppercase tracking-wider mb-2">Inspection Outcomes</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={75} dataKey="count" label={({ name, count }: any) => `${name}: ${count}`} fontSize={10} labelLine>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [v, 'Inspections']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-wensure-muted-text uppercase tracking-wider mb-2">Inspection Log</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {data.inspections.map((insp) => (
              <div key={insp.id} className="flex items-center justify-between text-xs py-1.5 border-b border-wensure-fine-divider">
                <div>
                  <span className="font-medium text-wensure-ink">{insp.inspection_date}</span>
                  <span className="text-wensure-muted-text ml-2">{insp.inspector_name}</span>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{
                    background: STATUS_COLORS[insp.overall_status] + '20',
                    color: STATUS_COLORS[insp.overall_status],
                  }}
                >
                  {insp.overall_status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
