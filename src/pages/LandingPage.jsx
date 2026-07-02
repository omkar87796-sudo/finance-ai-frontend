import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Zap, Brain, TrendingUp, Shield, ChevronRight } from 'lucide-react';

const agents = [
  { name: 'Data Collector',   color: '#3b82f6', desc: 'Gathers your company data and requests more if needed' },
  { name: 'Market Researcher',color: '#8b5cf6', desc: 'Finds industry trends and competitor insights' },
  { name: 'Data Analyst',     color: '#10b981', desc: 'Diagnoses problems across all business areas' },
  { name: 'Decision Maker',   color: '#f59e0b', desc: 'Creates a prioritised action plan for your business' },
  { name: 'AI Predictor',     color: '#ef4444', desc: 'Forecasts your next 12 months with & without action' },
];

const features = [
  { icon: Brain,    title: '5-Agent AI Pipeline',  desc: 'LangGraph orchestrates specialised agents that work in sequence — from data collection to future prediction.' },
  { icon: Zap,      title: 'Groq-Powered Speed',   desc: 'llama3-70b running on Groq\'s LPU delivers full analysis in under 20 seconds.' },
  { icon: Shield,   title: 'Employee Finance Mode', desc: 'Upload your salary slip and get personal finance advice: job loss planning, savings, investments.' },
  { icon: TrendingUp, title: 'Live Dashboards',    desc: 'Interactive charts for revenue forecasts, budget breakdowns, and savings projections.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 72 }}>
        <div className="badge badge-blue" style={{ marginBottom: 20, display: 'inline-flex' }}>
          ⚡ Agentic AI for Finance Decisions
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-1px' }}>
          Your AI-Powered
          <span style={{ display: 'block', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Finance Advisor
          </span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
          Ask why your company is declining, what decisions to make, and what your growth will look like — powered by a pipeline of 5 specialised AI agents.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/company')} style={{ fontSize: 16, padding: '14px 28px' }}>
            <Building2 size={18} /> Analyse My Company
          </button>
          <button className="btn-secondary" onClick={() => navigate('/employee')} style={{ fontSize: 16, padding: '14px 28px' }}>
            <User size={16} /> My Personal Finance
          </button>
        </div>
      </div>

      {/* Agent pipeline */}
      <div style={{ marginBottom: 72 }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, marginBottom: 8 }}>5-Agent Analysis Pipeline</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 32, fontSize: 14 }}>
          Each agent specialises in one task. Together they deliver a complete financial diagnosis.
        </p>
        <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
          {agents.map((agent, i) => (
            <React.Fragment key={agent.name}>
              <div className="card" style={{ flex: 1, textAlign: 'center', padding: '20px 12px' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', margin: '0 auto 12px',
                  background: `${agent.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${agent.color}44`,
                  fontFamily: 'Space Grotesk', fontWeight: 700, color: agent.color, fontSize: 16,
                }}>
                  {i + 1}
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: 'var(--text-primary)' }}>
                  {agent.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {agent.desc}
                </div>
              </div>
              {i < agents.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div>
        <h2 style={{ textAlign: 'center', fontSize: 22, marginBottom: 32 }}>Platform Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card">
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(59,130,246,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color="var(--accent-blue)" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
