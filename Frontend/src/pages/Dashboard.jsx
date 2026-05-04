import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm';
import ChatBox from '../components/ChatBox';
import { LayoutDashboard, Activity, Database, RefreshCw, Cpu, HardDrive } from 'lucide-react';
import { getSystemStats } from '../services/api';

/* ── LED Stat Pill ─────────────────────────────────────────────────────── */
const StatPill = ({ label, value, ledClass = 'led-indigo' }) => (
  <div
    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
  >
    <div className="flex items-center gap-2.5">
      <div className={ledClass} />
      <span className="text-[11px] font-dm font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
    </div>
    <span className="text-[11px] font-mono font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>{value}</span>
  </div>
);

/* ── Dashboard ─────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const [stats, setStats] = useState(null);

  const fetchStats = () => {
    getSystemStats()
      .then(d => setStats(d.stats))
      .catch(() => {});
  };

  useEffect(() => {
    fetchStats();
    const handler = () => fetchStats();
    window.addEventListener('knowledge-updated', handler);
    return () => window.removeEventListener('knowledge-updated', handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'transparent', color: 'rgba(255,255,255,0.88)' }}>
      <Navbar />

      <main
        className="flex-1 container mx-auto pt-16 pb-4 px-4 flex flex-col lg:flex-row gap-4 overflow-hidden"
        style={{ height: '100vh' }}
      >

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside
          className="lg:w-[340px] flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-4 shrink-0 animate-slide-in-left pt-3"
        >

          {/* System Status Card */}
          <div className="glass p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <LayoutDashboard style={{ width: 13, height: 13, color: '#818cf8' }} />
                </div>
                <h2 className="text-xs font-syne font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>System Status</h2>
              </div>
              <button
                onClick={fetchStats}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#818cf8'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                title="Refresh stats"
              >
                <RefreshCw style={{ width: 12, height: 12 }} />
              </button>
            </div>

            <div className="flex flex-col gap-2 stagger">
              <StatPill label="Vector Store"       value="ONLINE"      ledClass="led-emerald" />
              <StatPill label="Vector Dimension"   value="768 (F32)"   ledClass="led-indigo"  />
              {stats !== null && (
                <>
                  <StatPill label="Indexed Chunks" value={stats.vectorCount.toLocaleString()} ledClass="led-violet" />
                  <StatPill label="Storage"        value={`${((stats.storageSizeBytes || 0) / 1024).toFixed(1)} KB`} ledClass="led-cyan" />
                </>
              )}
            </div>
          </div>

          {/* Upload Card */}
          <div className="shrink-0">
            <UploadForm onSuccess={fetchStats} />
          </div>

          {/* Pipeline Architecture */}
          <div className="glass p-5">
            <h3
              className="text-[10px] font-dm font-bold uppercase tracking-[0.25em] mb-4"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Pipeline
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'RAG',  sub: 'Retrieval',  color: '#6366f1', glow: 'rgba(99,102,241,0.25)'  },
                { label: 'M-AI', sub: 'Multimodal', color: '#8b5cf6', glow: 'rgba(139,92,246,0.25)' },
                { label: 'VDB',  sub: 'Vector DB',  color: '#22d3ee', glow: 'rgba(34,211,238,0.2)'   },
              ].map(({ label, sub, color, glow }) => (
                <div
                  key={label}
                  className="p-3 rounded-xl text-center transition-all duration-200 cursor-default"
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.07)` }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 16px ${glow}`; e.currentTarget.style.borderColor = `${color}44`; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                >
                  <p className="text-base font-syne font-extrabold" style={{ color }}>{label}</p>
                  <p className="text-[8px] font-dm font-bold uppercase tracking-tighter mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Chat Workspace ────────────────────────────────────────────── */}
        <section className="flex-1 flex flex-col min-w-0 min-h-0 animate-slide-up pt-3" style={{ animationDelay: '80ms' }}>
          {/* ChatBox fills available height */}
          <div className="flex-1 flex flex-col min-h-0">
            <ChatBox />
          </div>

          {/* Status Footer */}
          <div
            className="mt-3 px-4 py-2.5 flex items-center justify-between shrink-0"
            style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
            }}
          >
            <div className="flex items-center gap-4 flex-wrap">
              {[
                { ledClass: 'led-indigo', label: 'Document Analysis' },
                { ledClass: 'led-emerald',label: 'Voice Processing'  },
                { ledClass: 'led-pink',   label: 'Image Recognition' },
              ].map(({ ledClass, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={ledClass} style={{ width: 5, height: 5 }} />
                  <span className="text-[10px] font-dm font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono uppercase" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}>Local Only</span>
              <p className="text-[10px] font-mono font-bold gradient-text">v1.0.2</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
