import React, { useState, useEffect } from 'react';
import { LayoutDashboard } from 'lucide-react';
import axios from 'axios';
import CompanyDashboard from '../components/CompanyDashboard';
import EmployeeDashboard from '../components/EmployeeDashboard';

export default function Dashboard() {
  const [demo, setDemo]       = useState(null);
  const [stats, setStats]     = useState(null);
  const [tab, setTab]         = useState('company');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/dashboard/demo').catch(() => ({ data: null })),
      axios.get('/api/dashboard/stats').catch(() => ({ data: null })),
    ]).then(([demoRes, statsRes]) => {
      setDemo(demoRes.data);
      setStats(statsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <span className="spinner" />
    </div>
  );

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LayoutDashboard size={22} color="var(--accent-purple)" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Finance AI Dashboard</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Demo data — run a real analysis to see your results</p>
        </div>
      </div>

      {/* Platform stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Analyses', value: stats.total_analyses?.toLocaleString() },
            { label: 'Companies Helped', value: stats.companies_helped?.toLocaleString() },
            { label: 'Employees Advised', value: stats.employees_advised?.toLocaleString() },
            { label: 'Avg Analysis Time', value: `${stats.avg_analysis_time_seconds}s` },
          ].map(({ label, value }) => (
            <div key={label} className="card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['company', 'employee'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: tab === t ? 'var(--accent-blue)' : 'var(--bg-card)',
              color: tab === t ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
          >
            {t === 'company' ? '🏢 Company Analysis' : '👤 Employee Finance'}
          </button>
        ))}
      </div>

      {/* Demo data */}
      {demo && tab === 'company' && demo.company_demo && (
        <>
          <div style={{ marginBottom: 16 }}>
            <div className="badge badge-orange" style={{ marginBottom: 8 }}>DEMO DATA — {demo.company_demo.company_name}</div>
          </div>
          <CompanyDashboard
            data={{
              problem_severity_radar: demo.company_demo.problem_severity_radar,
              revenue_prediction: demo.company_demo.revenue_prediction,
              key_metrics: demo.company_demo.key_metrics,
              strengths: ['Strong technical team', 'Loyal early customers', 'Good product-market fit in Tier-1 cities'],
              weaknesses: ['High CAC', 'Low brand awareness', 'Thin margins'],
              root_causes: ['Underinvestment in digital marketing', 'Product pricing mismatch', 'High operational overhead'],
            }}
            decisions={demo.company_demo.decision_timeline.map((d, i) => ({
              priority: i + 1, decision: d.decision, area: d.area,
              timeline: `${d.days === 0 ? 'Immediate' : d.days + ' days'}`,
              expected_impact: 'Projected 20-40% improvement in relevant KPIs',
            }))}
          />
        </>
      )}

      {demo && tab === 'employee' && demo.employee_demo && (
        <>
          <div style={{ marginBottom: 16 }}>
            <div className="badge badge-green" style={{ marginBottom: 8 }}>DEMO DATA — {demo.employee_demo.employee_name}</div>
          </div>
          <EmployeeDashboard
            data={{
              income_breakdown: demo.employee_demo.income_breakdown,
              expense_allocation: demo.employee_demo.expense_allocation,
              savings_projection: demo.employee_demo.savings_projection,
            }}
            analysis={{
              emergency_fund_analysis: {
                months_can_survive: demo.employee_demo.emergency_fund.months_can_survive,
                target_emergency_fund: demo.employee_demo.emergency_fund.target,
              },
              savings_plan: {
                monthly_savings_target: 13500,
                '12_month_projection': 162000,
              },
              investment_suggestions: [
                { type: 'SIP — Mutual Fund', description: 'Monthly systematic investment in diversified equity', expected_return: '12-15%/yr', risk_level: 'medium', suggested_amount: 5000 },
                { type: 'Fixed Deposit', description: '6-month FD as emergency fund base', expected_return: '6-7%/yr', risk_level: 'low', suggested_amount: 3000 },
                { type: 'PPF Account', description: 'Long-term tax-saving investment', expected_return: '7.1%/yr', risk_level: 'low', suggested_amount: 2000 },
              ],
            }}
          />
        </>
      )}
    </div>
  );
}
