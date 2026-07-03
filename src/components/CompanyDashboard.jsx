import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
} from 'recharts';



const priorityColor = { 1: '#ef4444', 2: '#f59e0b', 3: '#3b82f6' };

export default function CompanyDashboard({ data, decisions = [] }) {
  const {
    problem_severity_radar = [],
    revenue_prediction = [],
    key_metrics = {},
    root_causes = [],
    strengths = [],
    weaknesses = [],
  } = data;

  return (
    <div>
      {/* Key metrics */}
      {Object.keys(key_metrics).length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {Object.entries(key_metrics).slice(0, 4).map(([name, info]) => (
            <div key={name} className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {name}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: info.status === 'critical' ? 'var(--accent-red)' : info.status === 'warning' ? 'var(--accent-orange)' : 'var(--accent-green)' }}>
                {info.current}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Benchmark: {info.benchmark}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Problem severity radar */}
        {problem_severity_radar.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 20, color: 'var(--text-secondary)' }}>Problem Severity by Area</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={problem_severity_radar}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="area" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Radar name="Severity" dataKey="severity" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Revenue prediction */}
        {revenue_prediction.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 20, color: 'var(--text-secondary)' }}>Revenue Forecast: Action vs No Action</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenue_prediction}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="period" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
                  formatter={(v) => [`${v > 0 ? '+' : ''}${v}%`]}
                />
                <Legend />
                <Line type="monotone" dataKey="without_action" stroke="#ef4444" strokeWidth={2} name="No Action" dot={{ fill: '#ef4444' }} />
                <Line type="monotone" dataKey="with_action"    stroke="#10b981" strokeWidth={2} name="With Decisions" dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Decisions */}
      {decisions.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, marginBottom: 20, color: 'var(--text-secondary)' }}>
            Prioritised Action Plan ({decisions.length} decisions)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {decisions.slice(0, 6).map((d, i) => (
              <div key={i} style={{
                padding: 14,
                background: 'var(--bg-secondary)',
                borderRadius: 8,
                borderLeft: `3px solid ${priorityColor[d.priority] || '#3b82f6'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span className={`badge badge-${d.priority === 1 ? 'red' : d.priority === 2 ? 'orange' : 'blue'}`} style={{ fontSize: 10 }}>
                    #{d.priority} {d.area}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.timeline}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{d.decision}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{d.expected_impact}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths / Weaknesses / Root Causes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {strengths.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: 13, color: 'var(--accent-green)', marginBottom: 12 }}>✓ Strengths</h3>
            {strengths.map((s, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>{s}</div>
            ))}
          </div>
        )}
        {weaknesses.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: 13, color: 'var(--accent-red)', marginBottom: 12 }}>✗ Weaknesses</h3>
            {weaknesses.map((w, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>{w}</div>
            ))}
          </div>
        )}
        {root_causes.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: 13, color: 'var(--accent-orange)', marginBottom: 12 }}>⚠ Root Causes</h3>
            {root_causes.map((r, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>{r}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
