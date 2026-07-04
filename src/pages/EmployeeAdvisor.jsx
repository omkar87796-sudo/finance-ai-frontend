import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactMarkdown from 'react-markdown';
import { User, Upload, Send, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import api from '../utils/api';
import EmployeeDashboard from '../components/EmployeeDashboard';

const sampleQuestions = [
  'What if I lose my job tomorrow?',
  'How can I save money from my salary?',
  'If I use 6 months of savings, what happens?',
  'Where should I invest my surplus money?',
  'How do I build an emergency fund?',
  'What is my monthly budget breakdown?',
];

export default function EmployeeAdvisor() {
  const [salaryData, setSalaryData]     = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [uploadError, setUploadError]   = useState('');
  const [question, setQuestion]         = useState('');
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState(null);
  const [error, setError]               = useState('');
  const [history, setHistory]           = useState([]);
  // Manual entry fallback
  const [manualMode, setManualMode]     = useState(false);
  const [manual, setManual]             = useState({ gross_salary: '', net_salary: '', tax: '', pf: '', other_deductions: '', monthly_expenses: '', current_savings: '' });

  // Drag-and-drop file upload
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/api/employee/upload-salary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSalaryData(res.data.salary_data);
    } catch (err) {
      setUploadError(err.response?.data?.detail || 'Upload failed. Please try manual entry.');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
  });

  const handleManualSubmit = async () => {
    const res = await api.postForm('/api/employee/manual-salary', manual);
    setSalaryData(res.data.salary_data);
    setManualMode(false);
  };

  const handleAsk = async () => {
    if (!salaryData || !question.trim()) {
      setError('Please upload your salary slip and type a question.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/api/employee/ask', {
        user_question: question,
        salary_data: salaryData,
        conversation_history: history,
      });
      setResult(res.data);
      setHistory(prev => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: res.data.answer || '' },
      ]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Advisory failed. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={22} color="var(--accent-green)" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>My Personal Finance Advisor</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Upload your salary slip · Ask anything about your finances</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Upload section */}
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 15 }}>
            {salaryData ? '✓ Salary Slip Loaded' : 'Upload Salary Slip'}
          </h3>

          {!salaryData && !manualMode && (
            <>
              <div
                {...getRootProps()}
                style={{
                  border: `2px dashed ${isDragActive ? 'var(--accent-blue)' : 'var(--border-light)'}`,
                  borderRadius: 10, padding: 32, textAlign: 'center', cursor: 'pointer',
                  background: isDragActive ? 'rgba(59,130,246,0.05)' : 'var(--bg-secondary)',
                  transition: 'all 0.2s', marginBottom: 12,
                }}>
                <input {...getInputProps()} />
                {uploading ? (
                  <><span className="spinner" style={{ marginBottom: 8 }} /><br /><span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Parsing your salary slip…</span></>
                ) : (
                  <>
                    <Upload size={32} color="var(--text-muted)" style={{ marginBottom: 10 }} />
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{isDragActive ? 'Drop it here!' : 'Drag & drop your salary slip'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>PDF, PNG, JPG supported</div>
                  </>
                )}
              </div>
              {uploadError && (
                <div style={{ fontSize: 12, color: 'var(--accent-red)', marginBottom: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <AlertCircle size={14} /> {uploadError}
                </div>
              )}
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', display: 'flex' }} onClick={() => setManualMode(true)}>
                <FileText size={14} /> Enter salary manually instead
              </button>
            </>
          )}

          {/* Manual entry */}
          {manualMode && !salaryData && (
            <div>
              {[
                { key: 'gross_salary', label: 'Gross Salary (₹)' },
                { key: 'net_salary',   label: 'Net Salary (₹)' },
                { key: 'tax',          label: 'TDS / Income Tax (₹)' },
                { key: 'pf',           label: 'PF / EPF (₹)' },
                { key: 'other_deductions', label: 'Other Deductions (₹)' },
                { key: 'monthly_expenses', label: 'Monthly Expenses (₹)' },
                { key: 'current_savings',  label: 'Current Savings (₹)' },
              ].map(({ key, label }) => (
                <div key={key} style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input className="input-field" type="number" placeholder="0" value={manual[key]} onChange={e => setManual(m => ({ ...m, [key]: e.target.value }))} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" onClick={handleManualSubmit} style={{ flex: 1, justifyContent: 'center' }}>Save</button>
                <button className="btn-secondary" onClick={() => setManualMode(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Salary summary */}
          {salaryData && (
            <div>
              {[
                ['Employee', salaryData.employee_name || 'You'],
                ['Company', salaryData.company_name || 'N/A'],
                ['Month', salaryData.month_year || 'N/A'],
                ['Gross Salary', `₹${(salaryData.gross_salary || 0).toLocaleString('en-IN')}`],
                ['Net Salary',   `₹${(salaryData.net_salary || 0).toLocaleString('en-IN')}`],
                ['Total Deductions', `₹${(salaryData.total_deductions || 0).toLocaleString('en-IN')}`],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontWeight: 500 }}>{val}</span>
                </div>
              ))}
              <button className="btn-secondary" style={{ width: '100%', marginTop: 14, justifyContent: 'center', display: 'flex' }} onClick={() => { setSalaryData(null); setResult(null); }}>
                Upload different slip
              </button>
            </div>
          )}
        </div>

        {/* Question section */}
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 15 }}>Ask Your Finance Question</h3>

          <div style={{ marginBottom: 16 }}>
            <textarea
              className="input-field"
              placeholder="e.g. What if I lose my job? How much should I save? Where to invest?"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              rows={4}
              disabled={!salaryData}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>POPULAR QUESTIONS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sampleQuestions.map(q => (
                <button
                  key={q}
                  className="btn-secondary"
                  style={{ fontSize: 11, padding: '5px 10px' }}
                  onClick={() => setQuestion(q)}
                  disabled={!salaryData}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 12, background: 'rgba(239,68,68,0.1)', borderRadius: 8, marginBottom: 12, color: 'var(--accent-red)', fontSize: 13 }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleAsk}
            disabled={loading || !salaryData || !question.trim()}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? <><span className="spinner" /> Analysing…</> : <><Send size={16} /> Get Financial Advice</>}
          </button>

          {!salaryData && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
              Upload your salary slip first to unlock questions
            </p>
          )}
        </div>
      </div>

      {/* Result */}
      {result && (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color="var(--accent-green)" /> AI Financial Advice
            </h3>
            <div className="markdown-body">
              <ReactMarkdown>{result.answer}</ReactMarkdown>
            </div>
          </div>
          {result.dashboard_data && <EmployeeDashboard data={result.dashboard_data} analysis={result} />}
        </>
      )}
    </div>
  );
}
