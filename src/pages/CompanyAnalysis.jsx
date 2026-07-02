import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Building2, Send, Plus, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';
import CompanyDashboard from '../components/CompanyDashboard';

const AGENT_STEPS = [
  { key: 'data_collection_complete', label: 'Data Collector',    done: false },
  { key: 'research_complete',        label: 'Market Researcher', done: false },
  { key: 'analysis_complete',        label: 'Data Analyst',      done: false },
  { key: 'decisions_complete',       label: 'Decision Maker',    done: false },
  { key: 'prediction_complete',      label: 'AI Predictor',      done: false },
];

const STEP_ORDER = AGENT_STEPS.map(s => s.key);

const sampleQuestions = [
  'Why is my company going down in revenue?',
  'What should I do for company growth?',
  'What problems are there in my product and marketing?',
  'How can I increase profit margin?',
];

export default function CompanyAnalysis() {
  const [companyName, setCompanyName] = useState('');
  const [question, setQuestion]       = useState('');
  const [companyData, setCompanyData] = useState('');
  const [loading, setLoading]         = useState(false);
  const [result, setResult]           = useState(null);
  const [error, setError]             = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [needsMoreData, setNeedsMoreData]   = useState(false);
  const [dataRequest, setDataRequest]       = useState('');
  const [additionalData, setAdditionalData] = useState('');
  const [history, setHistory] = useState([]);

  const parseData = (raw) => {
    try { return JSON.parse(raw); }
    catch { return { raw_input: raw }; }
  };

  const handleAnalyze = async (isAdditional = false) => {
    if (!companyName.trim() || !question.trim()) {
      setError('Please enter company name and your question.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    setCurrentStep('Starting pipeline…');

    // Simulate step progress
    const stepSimulator = STEP_ORDER.reduce((chain, step, i) => {
      return chain.then(() => new Promise(res => setTimeout(() => {
        setCurrentStep(step);
        res();
      }, i === 0 ? 800 : 3500)));
    }, Promise.resolve());

    try {
      let response;
      if (isAdditional) {
        response = await axios.post('/api/company/provide-data', {
          user_question: question,
          company_name: companyName,
          original_data: parseData(companyData),
          additional_data: parseData(additionalData),
          conversation_history: history,
        });
      } else {
        response = await axios.post('/api/company/analyze', {
          user_question: question,
          company_name: companyName,
          company_data: parseData(companyData),
          conversation_history: history,
        });
      }

      await stepSimulator;
      const data = response.data;

      if (data.status === 'needs_more_data') {
        setNeedsMoreData(true);
        setDataRequest(data.message);
        setHistory(prev => [
          ...prev,
          { role: 'user', content: question },
          { role: 'assistant', content: data.message },
        ]);
      } else {
        setResult(data);
        setNeedsMoreData(false);
        setHistory(prev => [
          ...prev,
          { role: 'user', content: question },
          { role: 'assistant', content: data.final_response || '' },
        ]);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Check that the backend is running.');
    } finally {
      setLoading(false);
      setCurrentStep('');
    }
  };

  const currentStepIdx = STEP_ORDER.indexOf(currentStep);

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'rgba(59,130,246,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Building2 size={22} color="var(--accent-blue)" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Company Financial Analysis</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            5-agent AI pipeline · Powered by Groq llama3-70b
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Input form */}
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: 15 }}>Company Details</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
              COMPANY NAME *
            </label>
            <input
              className="input-field"
              placeholder="e.g. Acme Technologies Pvt. Ltd."
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
              YOUR QUESTION *
            </label>
            <textarea
              className="input-field"
              placeholder="e.g. Why is my company's revenue declining? What should I do for growth?"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              rows={3}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
              COMPANY DATA (JSON or plain text)
            </label>
            <textarea
              className="input-field"
              placeholder={`{
  "monthly_revenue": "₹42L",
  "monthly_expenses": "₹38L",
  "employees": 45,
  "product_returns_rate": "18%"
}`}
              value={companyData}
              onChange={e => setCompanyData(e.target.value)}
              rows={5}
            />
          </div>

          {/* Sample questions */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>SAMPLE QUESTIONS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sampleQuestions.map(q => (
                <button
                  key={q}
                  className="btn-secondary"
                  style={{ fontSize: 11, padding: '5px 10px' }}
                  onClick={() => setQuestion(q)}
                >
                  {q.substring(0, 35)}…
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 12, background: 'rgba(239,68,68,0.1)', borderRadius: 8, marginBottom: 16, color: 'var(--accent-red)', fontSize: 13 }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={() => handleAnalyze(false)}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? <><span className="spinner" /> Agents working…</> : <><Send size={16} /> Run Analysis</>}
          </button>
        </div>

        {/* Agent pipeline status */}
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: 15 }}>Agent Pipeline</h3>
          {AGENT_STEPS.map((step, i) => {
            const isDone    = loading && i < currentStepIdx;
            const isRunning = loading && i === currentStepIdx;
            return (
              <div key={step.key} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                background: 'var(--bg-secondary)', borderRadius: 8, marginBottom: 8,
                borderLeft: `3px solid ${isDone ? 'var(--accent-green)' : isRunning ? 'var(--accent-blue)' : 'var(--border)'}`,
                transition: 'border-left-color 0.3s',
              }}>
                <div style={{ flexShrink: 0 }}>
                  {isDone ? (
                    <CheckCircle2 size={16} color="var(--accent-green)" />
                  ) : isRunning ? (
                    <Loader2 size={16} color="var(--accent-blue)" style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--border-light)' }} />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: isDone || isRunning ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {i + 1}. {step.label}
                  </div>
                  {isRunning && (
                    <div style={{ fontSize: 11, color: 'var(--accent-blue)' }}>Running…</div>
                  )}
                </div>
              </div>
            );
          })}

          {/* More data request */}
          {needsMoreData && (
            <div style={{ marginTop: 16, padding: 16, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                <Plus size={16} color="var(--accent-orange)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-orange)' }}>More data needed</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{dataRequest}</p>
              <textarea
                className="input-field"
                placeholder="Enter additional data (JSON or text)…"
                value={additionalData}
                onChange={e => setAdditionalData(e.target.value)}
                rows={4}
              />
              <button
                className="btn-primary"
                onClick={() => handleAnalyze(true)}
                disabled={loading || !additionalData.trim()}
                style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
              >
                <Send size={16} /> Submit Additional Data
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* AI narrative */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color="var(--accent-green)" />
              AI Analysis Report — {result.company_name}
            </h3>
            <div className="markdown-body">
              <ReactMarkdown>{result.final_response}</ReactMarkdown>
            </div>
          </div>

          {/* Dashboard charts */}
          {result.dashboard_data && <CompanyDashboard data={result.dashboard_data} decisions={result.decisions} />}
        </>
      )}
    </div>
  );
}
