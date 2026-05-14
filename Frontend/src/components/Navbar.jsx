import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, Zap, Settings, HelpCircle, Trash2, Loader2, HardDrive, Cpu, Activity, RefreshCw, LayoutGrid, MessageSquare } from 'lucide-react';
import { clearKnowledgeBase, getSystemStats } from '../services/api';
import Modal from './Modal';

/* ── Stats modal content ───────────────────────────────────────────────── */
const StatsContent = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await getSystemStats();
      setStats(data.stats);
    } catch {
      setError('Could not load stats. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) return (
    <div className="flex justify-center p-8">
      <Loader2 style={{ width: 32, height: 32, color: '#6366f1', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (error) return (
    <div className="p-4 rounded-xl text-sm text-center font-dm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
      {error}
    </div>
  );

  const sizeKb = ((stats?.storageSizeBytes || 0) / 1024).toFixed(1);

  return (
    <div className="space-y-3">
      {[
        { icon: Database, color: '#6366f1', glow: 'rgba(99,102,241,0.3)', label: 'Total Vectors', value: stats?.vectorCount ?? 0 },
        { icon: Cpu, color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)', label: 'Vector Dimensions', value: stats?.dimension ?? 768 },
        { icon: HardDrive, color: '#22d3ee', glow: 'rgba(34,211,238,0.25)', label: 'Storage Used', value: `${sizeKb} KB` },
      ].map(({ icon: Icon, color, glow, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-4 p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}18`, boxShadow: `0 0 12px ${glow}` }}>
            <Icon style={{ width: 18, height: 18, color }} />
          </div>
          <div>
            <p className="text-[11px] font-dm uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
            <p className="text-xl font-syne font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{value}</p>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 text-xs font-dm px-3 py-2 rounded-xl" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#6ee7b7' }}>
          <Activity style={{ width: 12, height: 12 }} /> System Operational
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-1.5 text-xs font-dm transition-colors"
          style={{ color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
        >
          <RefreshCw style={{ width: 12, height: 12 }} /> Refresh
        </button>
      </div>
    </div>
  );
};

/* ── Config modal content ──────────────────────────────────────────────── */
const ConfigContent = () => (
  <div className="space-y-3">
    {[
      { label: 'Embedding Engine', value: 'gemini-embedding-001' },
      { label: 'Generation Model', value: 'gemma-3-4b-it' },
      { label: 'Vision Model', value: 'gemma-3-4b-it (multimodal)' },
      { label: 'Audio Transcription', value: 'gemini-1.5-flash' },
      { label: 'Retrieval Strategy', value: 'Top-5 Cosine Similarity' },
      { label: 'Vector Storage', value: 'Local JSON (Endee-compatible)' },
      { label: 'Chunk Size', value: '1000 chars / 200 overlap' },
    ].map(({ label, value }) => (
      <div key={label} className="space-y-0.5">
        <label className="text-[10px] font-dm font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</label>
        <div className="p-2.5 rounded-xl text-xs font-mono" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)' }}>
          {value}
        </div>
      </div>
    ))}
  </div>
);

/* ── Navbar ────────────────────────────────────────────────────────────── */
const Navbar = () => {
  const [clearing, setClearing] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearError, setClearError] = useState(null);
  const location = useLocation();

  const performClear = async () => {
    setClearing(true); setClearError(null); setShowClearConfirm(false);
    try {
      await clearKnowledgeBase();
      window.dispatchEvent(new Event('clear-chat'));
    } catch {
      setClearError('Failed to clear knowledge base. Is the server running?');
    } finally {
      setClearing(false);
    }
  };

  const tabs = [
    { to: '/', label: 'Index', icon: LayoutGrid },
    { to: '/dashboard', label: 'Assistant', icon: MessageSquare },
  ];

  const iconBtns = [
    { label: 'System Stats', icon: Zap, onClick: () => setShowStats(true) },
    { label: 'Config', icon: Settings, onClick: () => setShowConfig(true) },
    { label: 'Clear DB', icon: clearing ? Loader2 : Trash2, onClick: () => setShowClearConfirm(true), danger: true, spin: clearing },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-5 flex items-center justify-between"
        style={{
          height: 58,
          background: 'rgba(8,11,20,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              boxShadow: '0 0 16px rgba(99,102,241,0.5), 0 0 4px rgba(99,102,241,0.8)',
            }}
          >
            <Database style={{ width: 16, height: 16, color: 'white' }} />
          </div>
          <div className="leading-none">
            <span className="font-syne font-extrabold text-base tracking-tight gradient-text">MultiModal</span>
            <span className="font-syne font-extrabold text-base tracking-tight" style={{ color: 'rgba(255,255,255,0.85)' }}>RAG</span>
            <p className="text-[8px] font-dm uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>Enterprise Edition</p>
          </div>
        </div>

        {/* Tab Switcher — center */}
        <div
          className="flex items-center gap-0.5 p-1 rounded-xl absolute left-1/2 -translate-x-1/2"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to || (to === '/' && location.pathname === '/');
            return (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-dm font-medium transition-all duration-200"
                style={active
                  ? { background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', borderBottom: '1.5px solid #6366f1', boxShadow: '0 0 12px rgba(99,102,241,0.2)' }
                  : { color: 'rgba(255,255,255,0.45)', borderBottom: '1.5px solid transparent' }
                }
              >
                <Icon style={{ width: 12, height: 12 }} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          {/* Live status pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-dm font-semibold mr-2"
            style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#6ee7b7' }}
          >
            <span className="led-emerald animate-live-pulse" style={{ width: 6, height: 6 }} />
            ONLINE
          </div>

          {iconBtns.map(({ label, icon: Icon, onClick, danger, spin }) => (
            <button
              key={label}
              onClick={onClick}
              disabled={clearing && danger}
              title={label}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: danger ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = danger ? '#f87171' : '#a5b4fc';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = danger ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.4)';
              }}
            >
              <Icon style={{ width: 14, height: 14, animation: spin ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          ))}

          <Link
            to="/"
            title="Guide"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#a5b4fc'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
          >
            <HelpCircle style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </nav>

      {/* Error Toast */}
      {clearError && (
        <div
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 text-xs px-4 py-2 rounded-xl animate-fade-in"
          style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', backdropFilter: 'blur(12px)' }}
        >
          {clearError}
        </div>
      )}

      <Modal isOpen={showStats} onClose={() => setShowStats(false)} title="System Diagnostics">       <StatsContent /> </Modal>
      <Modal isOpen={showConfig} onClose={() => setShowConfig(false)} title="Pipeline Configuration">   <ConfigContent /> </Modal>
      <Modal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="Clear Knowledge Base">
        <div className="space-y-4">
          <p className="text-sm font-dm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            This will permanently delete all stored vectors and clear the chat history.
            <span className="block mt-2 font-semibold" style={{ color: '#fca5a5' }}>This action cannot be undone.</span>
          </p>
          <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-4 py-2 text-sm font-dm font-medium rounded-xl transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >
              Cancel
            </button>
            <button
              onClick={performClear}
              className="px-4 py-2 text-sm font-dm font-medium rounded-xl flex items-center gap-2 transition-all duration-200"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.35)', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.35)'; e.currentTarget.style.color = '#fecaca'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#fca5a5'; }}
            >
              <Trash2 style={{ width: 14, height: 14 }} /> Erase Everything
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
