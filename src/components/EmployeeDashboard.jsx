import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const ALLOC_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function EmployeeDashboard({ data, analysis }) {
  const {
    income_breakdown = [],
    expense_allocation = [],
    savings_projection = [],
  } = data;

  const { emergency_fund_analysis = {}, savings_plan = {}, investment_suggestions = [] } = analysis;

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Monthly Savings Target', value: fmt(savings_plan.monthly_savings_target), color: 'var(--accent-green)' },
          { label: 'Months Can Survive (Job Loss)', value: emergency_fund_analysis.months_can_survive?.toFixed(1) + ' mo', color: emergency_fund_analysis.months_can_survive < 3 ? 'var(--accent-red)' : 'var(--accent-orange)' },
          { label: 'Emergency Fund Target', value: fmt(emergency_fund_analysis.target_emergency_fund), color: 'var(--accent-blue)' },
          { label: '12-Month Projection', value: fmt(savings_plan['12_month_projection']), color: 'var(--accent-purple)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color }}>{value || '—'}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {income_breakdown.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16, color: 'var(--text-secondary)' }}>Income Breakdown</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={income_breakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                  {income_breakdown.map((_, i) => <Cell key={i} fill={ALLOC_COLORS[i % ALLOC_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {expense_allocation.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16, color: 'var(--text-secondary)' }}>Budget Allocation</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={expense_allocation} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90}>
                  {expense_allocation.map((_, i) => <Cell key={i} fill={ALLOC_COLORS[i % ALLOC_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {savings_projection.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, marginBottom: 16, color: 'var(--text-secondary)' }}>Savings Growth Projection</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={savings_projection}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Area type="monotone" dataKey="savings" stroke="#3b82f6" fill="url(#savingsGrad)" strokeWidth={2} name="Total Savings" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {investment_suggestions.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 16, color: 'var(--text-secondary)' }}>Investment Suggestions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {investment_suggestions.slice(0, 6).map((inv, i) => (
              <div key={i} style={{ padding: 14, background: 'var(--bg-secondary)', borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{inv.type}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>{inv.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: 'var(--accent-green)' }}>{inv.expected_return}</span>
                  <span className={`badge badge-${inv.risk_level === 'low' ? 'green' : inv.risk_level === 'medium' ? 'orange' : 'red'}`} style={{ fontSize: 10 }}>
                    {inv.risk_level} risk
                  </span>
                </div>
                {inv.suggested_amount > 0 && (
                  <div style={{ fontSize: 11, color: 'var(--accent-blue)', marginTop: 4 }}>Suggest: {fmt(inv.suggested_amount)}/mo</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
