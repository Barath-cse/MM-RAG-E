import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Database, ArrowRight } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()

  // Clear the session flag so that entering the dashboard counts as a 'fresh open'
  React.useEffect(() => {
    sessionStorage.removeItem('mm-rag-session-started');
  }, []);

  const formats = ['PDF', 'DOCX', 'XLSX', 'PPTX', 'TXT', 'CSV', 'Images', 'Audio']

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
            onClick={() => navigate('/dashboard')}
            className="text-sm font-bold text-white/60 hover:text-white transition-colors flex items-center gap-1 group"
          >
            Launch <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-8">
        <div className="max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-syne font-bold mb-8 tracking-tight">
              Multimodal Document <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Intelligence.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/40 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
              Unlock the knowledge hidden within your PDFs, images, and audio files. 
              Private, secure, and blazingly fast local-first RAG.
            </p>

            {/* Highlighted Supported Files */}
            <div className="flex flex-wrap justify-center gap-3 mb-12 opacity-60">
              {formats.map(f => (
                <span key={f} className="px-3 py-1 rounded-lg border border-white/10 text-[10px] font-bold tracking-widest uppercase bg-white/5">
                  {f}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-white/5"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate('/docs')}
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-lg hover:bg-white/10 hover:text-white transition-all"
              >
                Documentation
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 p-8 border-t border-white/5 bg-black/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/20 text-xs font-bold uppercase tracking-widest">
          <span>© 2026 MM-RAG-E</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
