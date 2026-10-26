import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  TrendingUp,
} from 'lucide-react';

export const BudgetPage: React.FC = () => {
  const { project, approveBudgetTranche } = useApp();

  const totalBudget = project.totalBudget; // 90,00,000
  const recordedExpenditure = project.recordedExpenditure; // 54,00,000
  const remainingBudget = totalBudget - recordedExpenditure; // 36,00,000

  const categories = [
    { name: 'Civil & Substructure', budgeted: 2600000, disbursed: 2600000, status: '100% Completed' },
    { name: 'RCC Superstructure', budgeted: 2800000, disbursed: 2800000, status: '100% Completed' },
    { name: 'AAC Blockwork & Plastering', budgeted: 1400000, disbursed: 0, status: 'Under Physical Audit (₹8L Claimed)' },
    { name: 'MEP Concealment & Services', budgeted: 1200000, disbursed: 0, status: 'Active Rough-Ins' },
    { name: 'Waterproofing & Finishes', budgeted: 1000000, disbursed: 0, status: 'Upcoming Tranches' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal">
            Financial Governance & Tranches
          </span>
          <span className="text-xs text-wensure-muted-text font-mono">
            {project.code}
          </span>
        </div>
        <h1 className="font-display text-3xl text-wensure-ink">
          Budget, Expenditures & Verifications
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Link contractor payments directly to physically verified civil milestones. Zero unverified advances.
        </p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-wensure-fine-divider space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text block">
            Total Sanctioned Budget
          </span>
          <div className="text-3xl sm:text-4xl font-display text-wensure-ink">
            ₹90,00,000
          </div>
          <p className="text-[11px] text-wensure-muted-text">
            Fixed-price civil construction contract baseline
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-wensure-fine-divider space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text block">
            Verified & Disbursed
          </span>
          <div className="text-3xl sm:text-4xl font-display text-wensure-forest">
            ₹{recordedExpenditure.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-wensure-success" />
            <span>60.0% of total budget released</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-wensure-fine-divider space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text block">
            Remaining In Escrow / Schedule
          </span>
          <div className="text-3xl sm:text-4xl font-display text-stone-600">
            ₹{remainingBudget.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-wensure-muted-text">
            40.0% reserved for remaining milestones 05–08
          </p>
        </div>
      </div>

      {/* Category Breakdown & Progress Chart Visual */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-semibold text-base text-wensure-ink">
            Category-wise Budget Allocation & Expenditure
          </h2>
          <p className="text-xs text-wensure-muted-text">
            Track disbursements by construction trade and physical sign-off status
          </p>
        </div>

        <div className="space-y-4">
          {categories.map((cat, idx) => {
            const percent = Math.round((cat.disbursed / cat.budgeted) * 100);
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-wensure-ink">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-wensure-muted-text">
                      ₹{cat.disbursed.toLocaleString('en-IN')} / ₹{cat.budgeted.toLocaleString('en-IN')}
                    </span>
                    <span className="font-mono font-bold text-wensure-forest">{percent}%</span>
                  </div>
                </div>
                <div className="w-full bg-wensure-soft-stone h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-wensure-forest h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="text-[10.5px] text-stone-400">
                  Status: {cat.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction Ledger Table (Distinguishing verified vs reported) */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-semibold text-base text-wensure-ink">
            Milestone Payment Transaction Ledger
          </h2>
          <p className="text-xs text-wensure-muted-text">
            Audit trail of contractor claims, independent engineering verification, and customer releases.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-wensure-fine-divider text-[10px] uppercase font-bold tracking-wider text-wensure-muted-text">
                <th className="py-3 px-2">TX Code</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Milestone & Scope</th>
                <th className="py-3 px-2 text-right">Contractor Claimed</th>
                <th className="py-3 px-2 text-right">Independently Verified</th>
                <th className="py-3 px-2 text-right">Customer Released</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wensure-fine-divider">
              {project.budgetTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3.5 px-2 font-mono font-bold text-wensure-ink">
                    {tx.code}
                  </td>
                  <td className="py-3.5 px-2 text-stone-600 whitespace-nowrap">
                    {tx.date}
                  </td>
                  <td className="py-3.5 px-2 max-w-xs">
                    <p className="font-semibold text-wensure-ink truncate">{tx.description}</p>
                    <span className="text-[10.5px] text-wensure-muted-text">{tx.milestoneReference}</span>
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono font-medium text-stone-700">
                    ₹{tx.contractorClaimedAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono font-semibold text-wensure-forest">
                    ₹{tx.independentlyVerifiedAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono font-bold text-wensure-ink">
                    ₹{tx.customerPaidAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${
                        tx.status === 'Verified & Disbursed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    {tx.status === 'Under Physical Audit' ? (
                      <button
                        onClick={() => approveBudgetTranche(tx.id)}
                        className="text-[11px] px-2.5 py-1 bg-wensure-ink text-white hover:bg-wensure-forest rounded font-medium transition-colors"
                      >
                        Simulate Approval
                      </button>
                    ) : (
                      <span className="text-[10px] text-stone-400 font-mono">Disbursed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
