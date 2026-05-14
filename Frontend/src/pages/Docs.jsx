import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, ArrowLeft, ArrowRight } from 'lucide-react';

const Docs = () => {
  const navigate = useNavigate();

  const sections = [
    { title: "Architecture", desc: "Local-first RAG pipeline using Endee Vector DB and Google Gemini." },
    { title: "Processing", desc: "Automated extraction from PDF, Excel, PPT, Word, Images, and Audio." },
    { title: "Security", desc: "Enterprise-grade isolation with absolute data privacy and VPC support." },
    { title: "Intelligence", desc: "Context-aware synthesis with verified citations for every answer." }
  ];

  return (
    <div className="min-h-screen bg-[#080b14] flex flex-col text-white font-dm selection:bg-indigo-500/30">
      {/* ── Background ── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-10 px-8 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Database className="w-6 h-6 text-indigo-400" />
            <span className="text-lg font-syne font-bold tracking-tight">MM-RAG-E</span>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-sm font-bold text-white/60 hover:text-white transition-colors flex items-center gap-1 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-8 py-20">
        <div className="max-w-5xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-syne font-bold mb-8 tracking-tight">
              Knowledge <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Documentation.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/40 font-light leading-relaxed mb-20 max-w-2xl mx-auto">
              A comprehensive technical guide to the MultiModal RAG engine architecture and feature set.
            </p>

            {/* Feature List (Mirroring the format chips style but larger) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto mb-20">
              {sections.map((s, i) => (
                <div key={i} className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                  <h3 className="text-xl font-syne font-bold mb-3">{s.title}</h3>
                  <p className="text-sm md:text-base text-white/40 font-light leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-10 py-5 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-white/5 flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 p-8 border-t border-white/5 bg-black/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/20 text-xs font-bold uppercase tracking-widest">
          <span>© 2026 MM-RAG-E Technical Docs</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">v1.2</a>
            <a href="#" className="hover:text-white transition-colors">Stable</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Docs;
