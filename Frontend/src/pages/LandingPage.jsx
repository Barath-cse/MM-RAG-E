import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Database, ArrowRight, BrainCircuit, ShieldCheck, Zap,
  FileUp, Search, Brain, ChevronRight, CheckCircle2,
  Shield, Activity, Lock, Layers, Sparkles
} from 'lucide-react'

/* ── Reusable Glass Card ──────────────────────────────────────────────── */
const GlassCard = ({ children, className = '', style = {}, ...props }) => (
  <div
    className={`transition-all duration-300 hover-lift ${className}`}
    style={{
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '18px',
      ...style,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = ''; }}
    {...props}
  >
    {children}
  </div>
)

/* ── Step Card ────────────────────────────────────────────────────────── */
const StepCard = ({ number, title, description, items, color = '#6366f1' }) => (
  <GlassCard className="p-7 flex flex-col h-full">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-syne font-extrabold mb-5"
      style={{ background: `${color}22`, border: `1px solid ${color}44`, color, boxShadow: `0 0 16px ${color}33` }}
    >
      {number}
    </div>
    <h3 className="font-syne font-bold text-lg mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>{title}</h3>
    <p className="text-sm font-dm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>{description}</p>
    <ul className="space-y-2.5 mt-auto">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-xs font-dm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }} />
          {item}
        </li>
      ))}
    </ul>
  </GlassCard>
)

/* ── Feature Card ─────────────────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, description, color = '#6366f1' }) => (
  <GlassCard className="p-5 flex items-start gap-4">
    <div
      className="p-2.5 rounded-xl shrink-0"
      style={{ background: `${color}18`, border: `1px solid ${color}30`, boxShadow: `0 0 12px ${color}25` }}
    >
      <Icon style={{ width: 18, height: 18, color }} />
    </div>
    <div>
      <h4 className="text-sm font-syne font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.88)' }}>{title}</h4>
      <p className="text-xs font-dm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{description}</p>
    </div>
  </GlassCard>
)

/* ── Stat Pill ────────────────────────────────────────────────────────── */
const StatPill = ({ value, label, color }) => (
  <div className="flex flex-col items-center gap-1 p-5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
    <span className="text-3xl font-syne font-extrabold" style={{ color }}>{value}</span>
    <span className="text-[11px] font-dm uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
  </div>
)

/* ── Pipeline Node ────────────────────────────────────────────────────── */
const PipeNode = ({ icon: Icon, label, sub, color }) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center"
      style={{ background: `${color}18`, border: `1px solid ${color}35`, boxShadow: `0 0 20px ${color}25` }}
    >
      <Icon style={{ width: 28, height: 28, color }} />
    </div>
    <div className="text-center">
      <p className="text-xs font-syne font-bold uppercase tracking-tight mb-0.5" style={{ color: 'rgba(255,255,255,0.8)' }}>{label}</p>
      <p className="text-[10px] font-dm" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</p>
    </div>
  </div>
)

/* ── Landing Page ─────────────────────────────────────────────────────── */
const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative" style={{ color: 'rgba(255,255,255,0.88)' }}>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-8 flex items-center justify-between"
        style={{
          height: 60,
          background: 'rgba(8,11,20,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 16px rgba(99,102,241,0.5)' }}
          >
            <Database style={{ width: 16, height: 16, color: 'white' }} />
          </div>
          <span className="font-syne font-extrabold text-base tracking-tight">
            <span className="gradient-text">MultiModal</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>RAG</span>
          </span>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-dm font-semibold transition-all duration-200"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 0 16px rgba(99,102,241,0.35)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 16px rgba(99,102,241,0.35)'; }}
        >
          Open App <ArrowRight style={{ width: 14, height: 14 }} />
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-8 w-full pt-36 pb-24 relative z-10">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="text-center max-w-4xl mx-auto mb-28 animate-fade-up">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-dm font-bold uppercase tracking-widest mb-8"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block', boxShadow: '0 0 8px #6366f1', animation: 'live-pulse 2s ease-in-out infinite' }} />
            AI-Powered Document Intelligence
          </div>

          <h1 className="font-syne font-extrabold leading-tight mb-6" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
            Welcome to{' '}
            <span className="gradient-text">MultiModal RAG</span>
          </h1>

          <p className="text-lg font-dm font-light leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Transform your documents into an intelligent knowledge base. Ask questions in natural language
            and get accurate answers powered by local AI — all while keeping your data private and secure.
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-base font-dm font-semibold transition-all duration-300"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(99,102,241,0.45)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(99,102,241,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.45)'; }}
          >
            Get Started Free <ArrowRight style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* ── Stats Row ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-28 stagger animate-fade-up" style={{ animationDelay: '100ms' }}>
          <StatPill value="PDF"    label="Documents"    color="#6366f1" />
          <StatPill value="Audio"  label="Transcripts"  color="#8b5cf6" />
          <StatPill value="Images" label="Analysis"     color="#22d3ee" />
          <StatPill value="Local"  label="AI Processing" color="#f472b6" />
        </div>

        {/* ── Pipeline Flow ─────────────────────────────────────────── */}
        <section className="mb-28 animate-fade-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center gap-3 mb-10">
            <Activity style={{ width: 18, height: 18, color: '#6366f1' }} />
            <h2 className="font-syne font-bold text-xl" style={{ color: 'rgba(255,255,255,0.88)' }}>How It Works</h2>
          </div>
          <div
            className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24 }}
          >
            <PipeNode icon={FileUp}   label="Upload"    sub="Add your documents"     color="#6366f1" />
            <ChevronRight style={{ width: 22, height: 22, color: 'rgba(255,255,255,0.15)', flexShrink: 0, display: 'none' }} className="hidden md:block" />
            <div className="hidden md:block" style={{ height: 1, flex: 1, background: 'linear-gradient(90deg,rgba(99,102,241,0.4),rgba(139,92,246,0.4))' }} />
            <PipeNode icon={Database} label="Process"   sub="AI analyzes content"    color="#8b5cf6" />
            <div className="hidden md:block" style={{ height: 1, flex: 1, background: 'linear-gradient(90deg,rgba(139,92,246,0.4),rgba(34,211,238,0.4))' }} />
            <PipeNode icon={Search}   label="Search"    sub="Find relevant info"     color="#22d3ee" />
            <div className="hidden md:block" style={{ height: 1, flex: 1, background: 'linear-gradient(90deg,rgba(34,211,238,0.4),rgba(244,114,182,0.4))' }} />
            <PipeNode icon={Brain}    label="Answer"    sub="Get AI responses"       color="#f472b6" />
          </div>
        </section>

        {/* ── Quick Start ───────────────────────────────────────────── */}
        <section className="mb-28 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-10">
            <Zap style={{ width: 18, height: 18, color: '#fbbf24' }} />
            <h2 className="font-syne font-bold text-xl" style={{ color: 'rgba(255,255,255,0.88)' }}>Get Started in Minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            <StepCard number="1" title="Upload Documents" color="#6366f1"
              description="Add your PDFs, documents, images, and audio files to build your knowledge base."
              items={["Click 'Upload Files'", "Drag & drop your documents", "Wait for processing", "View indexed content"]}
            />
            <StepCard number="2" title="Ask Questions" color="#8b5cf6"
              description="Chat with your documents using natural language queries."
              items={["Go to 'Chat' tab", "Type your question", "Get AI-powered answers", "See source references"]}
            />
            <StepCard number="3" title="Verify Answers" color="#22d3ee"
              description="Check the sources and context behind every AI response."
              items={["Review source badges", "Click to see excerpts", "Verify accuracy", "Explore related content"]}
            />
          </div>
        </section>

        {/* ── Key Features ──────────────────────────────────────────── */}
        <section className="mb-28 animate-fade-up" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center gap-3 mb-10">
            <ShieldCheck style={{ width: 18, height: 18, color: '#6366f1' }} />
            <h2 className="font-syne font-bold text-xl" style={{ color: 'rgba(255,255,255,0.88)' }}>Why Choose MultiModal RAG?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            <FeatureCard icon={Lock}         color="#6366f1" title="100% Private"           description="All processing happens locally. Your documents never leave your computer." />
            <FeatureCard icon={CheckCircle2} color="#8b5cf6" title="Multiple Formats"       description="Supports PDFs, Word docs, images, audio files, and text documents." />
            <FeatureCard icon={Database}     color="#22d3ee" title="Smart Search"           description="AI understands context and meaning, not just keywords." />
            <FeatureCard icon={Brain}        color="#f472b6" title="Accurate Answers"       description="Responses are grounded in your actual documents with source citations." />
            <FeatureCard icon={Search}       color="#fbbf24" title="Fast & Local"           description="No internet required. Get instant answers from your knowledge base." />
            <FeatureCard icon={Shield}       color="#34d399" title="Enterprise Ready"       description="Professional-grade AI that maintains data security and privacy." />
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────────── */}
        <div
          className="text-center py-16 px-8 rounded-3xl animate-fade-up"
          style={{
            animationDelay: '300ms',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12), rgba(34,211,238,0.08))',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <Sparkles style={{ width: 32, height: 32, color: '#818cf8', margin: '0 auto 16px' }} />
          <h2 className="font-syne font-extrabold text-3xl mb-4 gradient-text">Ready to transform your documents?</h2>
          <p className="text-base font-dm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>Turn your files into an intelligent knowledge base with AI-powered search and answers.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-base font-dm font-semibold transition-all duration-300"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(99,102,241,0.45)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(99,102,241,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.45)'; }}
          >
            Get Started <ArrowRight style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer
        className="relative z-10 px-8 py-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-[10px] font-dm font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © 2026 MultiModal RAG · Private AI Document Intelligence
        </p>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>v1.0.2</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 8px #34d399', animation: 'live-pulse 2s ease-in-out infinite' }} />
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
