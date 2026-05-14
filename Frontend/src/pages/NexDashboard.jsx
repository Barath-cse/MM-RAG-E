import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Menu, X,
  MessageSquare, FileText, Send,
  Mic, Paperclip, 
  LayoutGrid, Settings, HelpCircle,
  Database, Sparkles,
  Layers, Activity, AlertTriangle, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../hooks/useChat';
import { getSystemStats, uploadFile, getDocuments, deleteDocument } from '../services/api';
import MessageBubble from '../components/MessageBubble';
import UploadForm from '../components/UploadForm';
import Modal from '../components/Modal';

/* ── Sidebar Component ─────────────────────────────────────────────────── */
const Sidebar = ({ isOpen, toggleSidebar, sessions, activeSessionId, switchSession, createSession, onOpenSettings, onOpenHelp, documents, onDeleteDocument, onDeleteSession, onUploadClick, onDocumentClick, isUploading }) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 260 : 0, opacity: isOpen ? 1 : 0 }}
      className="h-screen bg-[#0d0d1a]/95 backdrop-blur-xl border-r border-white/5 flex flex-col overflow-hidden shrink-0 z-40"
    >
      <div className="p-4 pt-20 flex flex-col h-full">
        {/* New Chat Button */}
        <button
          onClick={createSession}
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-dm font-semibold text-xs flex items-center justify-center gap-2 hover:bg-indigo-600/20 transition-all mb-6"
        >
          <Plus className="w-4 h-4" /> New Chat
        </button>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
          {/* Workspace Section */}
          <div className="space-y-1">
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-dm font-bold uppercase tracking-widest text-white/30">Workspace</span>
              <Plus 
                className={`w-3 h-3 transition-colors ${isUploading ? 'text-indigo-500 animate-pulse cursor-not-allowed' : 'text-white/30 cursor-pointer hover:text-white/60'}`} 
                onClick={isUploading ? null : onUploadClick}
              />
            </div>
            {documents.length === 0 ? (
              <div className="px-3 py-4 text-[10px] text-white/20 font-dm italic">No files indexed</div>
            ) : (
              documents.map((doc) => (
                <div 
                  key={doc.name} 
                  className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-500/10 cursor-pointer transition-all text-white/50 hover:text-indigo-300"
                  onClick={() => onDocumentClick(doc.name)}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-dm font-medium truncate">{doc.name}</span>
                  </div>
                  <X 
                    className="w-3 h-3 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity cursor-pointer" 
                    onClick={(e) => { e.stopPropagation(); onDeleteDocument(doc.name); }}
                  />
                </div>
              ))
            )}
          </div>

          {/* Chat History Section */}
          <div className="space-y-1">
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-dm font-bold uppercase tracking-widest text-white/30">History</span>
            </div>
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => switchSession(s.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${s.id === activeSessionId
                  ? 'bg-indigo-500/15 text-indigo-300 border-l-2 border-indigo-500 pl-2.5'
                  : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                  }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-dm font-medium truncate">{s.title}</span>
                </div>
                <X 
                  className="w-3 h-3 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity cursor-pointer" 
                  onClick={(e) => { e.stopPropagation(); onDeleteSession(s.id, s.title); }}
                />
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="pt-4 mt-auto border-t border-white/5 flex justify-around shrink-0">
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

/* ── TopBar Component ─────────────────────────────────────────────────── */
const TopBar = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#080b14]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
            <Database className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-syne font-bold text-xl text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">MM-RAG-E</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.05)] hover:border-indigo-500/30 transition-all duration-500 group/badge">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[10px] font-syne font-bold text-white tracking-widest uppercase opacity-70 group-hover/badge:opacity-100 transition-opacity">System Online</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-indigo-400 opacity-50 group-hover/badge:opacity-100 transition-opacity" />
          <span className="text-[11px] font-dm font-medium text-indigo-300/50 group-hover/badge:text-indigo-300 transition-colors">Neural Assistant v1.0.2</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
      </div>
    </header>
  );
};

/* ── Main NexDashboard Component ───────────────────────────────────────── */
const NexDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [citationsEnabled, setCitationsEnabled] = useState(true);
  const [stats, setStats] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [showConfig, setShowConfig] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, id: null, title: null });
  const [isUploading, setIsUploading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);
  const abortControllerRef = useRef(null);
  const {
    sessions, activeSessionId, messages, isLoading,
    sendMessage, createSession, switchSession, deleteSession
  } = useChat();

  const fetchSystemData = async () => {
    try {
      const statsData = await getSystemStats();
      const docsData = await getDocuments();
      setStats(statsData.stats);
      setDocuments(docsData.documents);
    } catch (err) {
      console.error('Failed to fetch system data:', err);
    }
  };

  useEffect(() => {
    fetchSystemData();
    window.addEventListener('knowledge-updated', fetchSystemData);
    return () => window.removeEventListener('knowledge-updated', fetchSystemData);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input, 'text');
    setInput('');
  };

  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        sendMessage(blob, 'voice');
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied: ' + err.message);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await uploadFile(file, undefined, controller.signal);
      // Dispatch event so other components (like knowledge stats) refresh
      window.dispatchEvent(new CustomEvent('knowledge-updated'));

      // Add a system message about the upload
      const systemMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Successfully uploaded and indexed **${file.name}**. You can now ask questions about its content.`,
        type: 'text'
      };
    } catch (err) {
      if (err.name === 'AbortError' || err.message === 'Upload cancelled.') {
        console.log('Upload aborted by user');
      } else {
        alert('Upload failed: ' + err.message);
      }
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="min-h-screen bg-[#080b14] flex text-white overflow-hidden selection:bg-indigo-500/30">
      {/* ── Background Effects ── */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <TopBar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar
        isOpen={sidebarOpen}
        sessions={sessions}
        activeSessionId={activeSessionId}
        switchSession={switchSession}
        createSession={createSession}
        onOpenSettings={() => setShowConfig(true)}
        onOpenHelp={() => setShowHelp(true)}
        documents={documents}
        onDeleteDocument={(name) => {
          setDeleteModal({ isOpen: true, type: 'document', id: name, title: name });
        }}
        onDeleteSession={(id, title) => {
          setDeleteModal({ isOpen: true, type: 'session', id: id, title: title });
        }}
        onUploadClick={() => fileInputRef.current?.click()}
        onDocumentClick={(name) => {
          setInput(`Tell me about ${name}`);
          // Focus input if possible
        }}
        isUploading={isUploading}
      />

      <main className="flex-1 flex flex-col h-screen pt-16 relative z-10">
        {/* Chat Title Bar */}
        <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
          <div>
            <h1 className="font-syne font-bold text-xl text-white">
              {sessions.find(s => s.id === activeSessionId)?.title || "Quarterly Performance & Insights"}
            </h1>
          </div>

        </div>

        {/* Message Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
              <Sparkles className="w-12 h-12 mb-4 text-indigo-400" />
              <p className="font-dm text-lg">Start a conversation with your documents</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <MessageBubble 
                key={msg.id || i} 
                message={msg} 
                onSuggestionClick={(suggestion) => sendMessage(suggestion, 'text')}
              />
            ))
          )}

          {isLoading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-[#080b14]/80 backdrop-blur-2xl border-t border-white/5">
          <div className="max-w-full mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.md,.csv,image/*,audio/*"
              />
              <button
                onClick={isUploading ? cancelUpload : () => fileInputRef.current?.click()}
                className={`p-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                  isUploading ? 'bg-red-500/10 text-red-400 animate-pulse hover:bg-red-500/20' : 'hover:bg-white/5 text-white/30 hover:text-white'
                }`}
                title={isUploading ? "Cancel upload" : "Upload file"}
              >
                {isUploading ? (
                  <>
                    <X className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cancel</span>
                  </>
                ) : (
                  <Paperclip className="w-5 h-5" />
                )}
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask MM-RAG-E about your documents..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm font-dm py-3 text-white/90 placeholder:text-white/20"
              />

              <div className="flex items-center gap-4 px-4 border-l border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-dm font-bold uppercase tracking-wider text-white/30 hidden sm:block">Citations</span>
                  <button
                    onClick={() => setCitationsEnabled(!citationsEnabled)}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center ${citationsEnabled ? 'bg-indigo-600' : 'bg-white/10'}`}
                  >
                    <motion.div
                      animate={{ x: citationsEnabled ? 18 : 2 }}
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2.5 rounded-xl transition-all ${isRecording ? 'bg-red-500/20 text-red-400 animate-pulse' : 'hover:bg-white/5 text-white/30 hover:text-white'
                      }`}
                    title={isRecording ? "Stop recording" : "Voice input"}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowStats(true)}
                    className="p-2.5 rounded-xl hover:bg-white/5 text-white/30 hover:text-white transition-colors"
                    title="System statistics"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`p-2.5 rounded-xl transition-all ${input.trim() && !isLoading
                    ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/40 hover:scale-105 active:scale-95'
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                    }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-full mx-auto mt-4 flex items-center justify-between text-[10px] font-dm font-bold uppercase tracking-[0.2em] text-white/20">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" /> System Online
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> Local Vector Search
              </span>
            </div>
            <span className="opacity-50">MultiModal RAG v1.0.2</span>
          </div>
        </div>
      </main>
      <Modal isOpen={showConfig} onClose={() => setShowConfig(false)} title="Pipeline Configuration">
        <div className="space-y-4">
          {[
            { label: 'Embedding Engine', value: 'gemini-embedding-001' },
            { label: 'Generation Model', value: 'gemini-1.5-flash' },
            { label: 'Vision Model', value: 'gemini-1.5-flash (multimodal)' },
            { label: 'Retrieval Strategy', value: 'Vector-first Semantic' },
            { label: 'Vector Store', value: 'Local Endee Cache' },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-1">
              <label className="text-[10px] font-dm font-bold uppercase tracking-wider text-white/30">{label}</label>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/70">
                {value}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="Getting Started">
        <div className="space-y-4 text-sm font-dm text-white/60 leading-relaxed">
          <p>MM-RAG-E is your private document assistant. Here's how to get the most out of it:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-white">Upload Documents</strong>: Use the sidebar to upload PDFs, Images, or Audio files.</li>
            <li><strong className="text-white">Ask Anything</strong>: Use natural language to query your knowledge base.</li>
            <li><strong className="text-white">Local-First</strong>: All processing is private and secure.</li>
          </ul>
        </div>
      </Modal>

      <Modal isOpen={showStats} onClose={() => setShowStats(false)} title="System Diagnostics">
        <div className="space-y-3">
          {[
            { icon: Database, color: '#6366f1', label: 'Total Vectors', value: stats?.vectorCount ?? 0 },
            { icon: Activity, color: '#10b981', label: 'Status', value: 'ONLINE' },
            { icon: Layers, color: '#8b5cf6', label: 'Storage', value: `${((stats?.storageSizeBytes || 0) / 1024).toFixed(1)} KB` },
          ].map(({ icon: Icon, color, label, value }) => (
            <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-[11px] font-dm uppercase tracking-wider text-white/30">{label}</p>
                <p className="text-xl font-syne font-bold text-white/90">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        title="Confirm Deletion"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-syne font-bold text-white">Delete this {deleteModal.type}?</h2>
            <p className="text-sm font-dm text-white/40 leading-relaxed">
              Are you sure you want to permanently delete <span className="text-white/80 font-semibold italic">"{deleteModal.title}"</span>? This action cannot be undone.
            </p>
          </div>

          <div className="flex w-full gap-3">
            <button
              onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
              className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/60 font-dm font-bold text-sm hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (deleteModal.type === 'session') {
                  deleteSession(deleteModal.id);
                } else {
                  await deleteDocument(deleteModal.id);
                  fetchSystemData();
                }
                setDeleteModal({ ...deleteModal, isOpen: false });
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-dm font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NexDashboard;
