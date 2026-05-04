import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Mic, Square, MessageSquare,
  Plus, Trash2, Clock, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useChat } from '../hooks/useChat';
import MessageBubble from './MessageBubble';
import Modal from './Modal';

/* ── Streaming dots loader ─────────────────────────────────────────────── */
const StreamingDots = () => (
  <div className="flex items-center gap-3 px-5 py-4 animate-fade-in">
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
    >
      <div style={{ width: 14, height: 14, color: '#a78bfa' }}>✦</div>
    </div>
    <div
      className="px-4 py-3 flex items-center gap-1.5"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderLeft: '2px solid rgba(99,102,241,0.5)',
        borderRadius: '4px 18px 18px 18px',
      }}
    >
      <span className="streaming-dot" />
      <span className="streaming-dot" />
      <span className="streaming-dot" />
    </div>
  </div>
);

const ChatBox = () => {
  const [input,           setInput]           = useState('');
  const [isRecording,     setIsRecording]     = useState(false);
  const [showSidebar,     setShowSidebar]     = useState(true);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef   = useRef([]);
  const scrollRef        = useRef(null);
  const inputRef         = useRef(null);

  const {
    sessions, activeSessionId, messages, isLoading,
    sendMessage, createSession, switchSession, deleteSession,
  } = useChat();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => { inputRef.current?.focus(); }, [activeSessionId]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage(trimmed, 'text');
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
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

  const formatTimestamp = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div
      className="flex h-full overflow-hidden relative"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '18px',
      }}
    >
      {/* ── Session Sidebar ────────────────────────────────────────────── */}
      <div
        className={`${showSidebar ? 'w-56' : 'w-0'} flex flex-col transition-all duration-300 overflow-hidden shrink-0`}
        style={{ borderRight: showSidebar ? '1px solid rgba(255,255,255,0.06)' : 'none', background: 'rgba(0,0,0,0.15)' }}
      >
        {/* New Chat button */}
        <div className="p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={createSession}
            className="w-full py-2 px-3 rounded-xl text-xs font-dm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(99,102,241,0.35)',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(99,102,241,0.35)'; e.currentTarget.style.transform = ''; }}
          >
            <Plus style={{ width: 13, height: 13 }} /> New Chat
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {sessions.map(s => (
            <div
              key={s.id}
              onClick={() => switchSession(s.id)}
              className="group relative p-2.5 rounded-xl cursor-pointer transition-all duration-200"
              style={s.id === activeSessionId
                ? { background: 'rgba(99,102,241,0.15)', borderLeft: '2px solid #6366f1', paddingLeft: '10px' }
                : { background: 'transparent', borderLeft: '2px solid transparent', paddingLeft: '10px' }
              }
              onMouseEnter={e => { if (s.id !== activeSessionId) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (s.id !== activeSessionId) e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="flex flex-col gap-0.5 pr-6 min-w-0">
                <span
                  className="text-xs font-dm font-semibold truncate"
                  style={{ color: s.id === activeSessionId ? '#a5b4fc' : 'rgba(255,255,255,0.6)' }}
                >
                  {s.title}
                </span>
                <span className="text-[10px] font-dm flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  <Clock style={{ width: 9, height: 9 }} /> {formatTimestamp(s.timestamp)}
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setSessionToDelete(s.id); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
              >
                <Trash2 style={{ width: 11, height: 11 }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Chat Area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 relative">

        {/* Sidebar toggle pill */}
        <button
          onClick={() => setShowSidebar(v => !v)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3.5 z-10 w-7 h-12 flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(13,16,32,0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.4)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#818cf8'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          aria-label={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
        >
          {showSidebar
            ? <ChevronLeft  style={{ width: 13, height: 13 }} />
            : <ChevronRight style={{ width: 13, height: 13 }} />}
        </button>

        {/* Chat Header */}
        <div
          className="px-5 py-3.5 flex items-center justify-between shrink-0"
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <MessageSquare style={{ width: 15, height: 15, color: '#6366f1', flexShrink: 0 }} />
            <h2 className="text-sm font-syne font-bold truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {activeSession?.title || 'MultiModal Assistant'}
            </h2>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-[11px] font-dm" style={{ color: '#818cf8' }}>
              <div className="flex items-center gap-1">
                <span className="streaming-dot" style={{ width: 5, height: 5 }} />
                <span className="streaming-dot" style={{ width: 5, height: 5 }} />
                <span className="streaming-dot" style={{ width: 5, height: 5 }} />
              </div>
              Thinking
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-4"
          style={{ background: 'transparent' }}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 animate-fade-up">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  boxShadow: '0 0 32px rgba(99,102,241,0.15)',
                }}
              >
                <MessageSquare style={{ width: 28, height: 28, color: '#6366f1' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-dm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Ask anything about your documents</p>
                <p className="text-xs font-dm mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>Upload a file first, then start chatting</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onSuggestionClick={(s) => sendMessage(s, 'text')}
                />
              ))}
              {isLoading && <StreamingDots />}
            </>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="flex items-end gap-2 px-3 py-2 transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '14px',
            }}
            onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your documents… (Enter to send)"
              rows={1}
              className="flex-1 bg-transparent border-none outline-none text-sm font-dm resize-none min-h-[24px] max-h-[120px] py-1 leading-6 custom-scrollbar"
              style={{ color: 'rgba(255,255,255,0.85)', caretColor: '#6366f1' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
            />

            <div className="flex items-center gap-1 shrink-0 pb-0.5">
              {/* Voice button */}
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="p-2 rounded-xl transition-all duration-200 flex items-center gap-1.5"
                  style={{
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    animation: 'pulse-glow-red 1s ease-in-out infinite',
                    color: '#f87171',
                    cursor: 'pointer',
                  }}
                  title="Stop recording"
                >
                  {/* Mini waveform */}
                  <div className="flex items-end gap-0.5" style={{ height: 16 }}>
                    <div className="waveform-bar" />
                    <div className="waveform-bar" />
                    <div className="waveform-bar" />
                    <div className="waveform-bar" />
                    <div className="waveform-bar" />
                  </div>
                  <Square style={{ width: 12, height: 12 }} />
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  disabled={isLoading}
                  className="p-2 rounded-xl transition-all duration-200"
                  style={{ background: 'transparent', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', border: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f472b6'; e.currentTarget.style.background = 'rgba(244,114,182,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'transparent'; }}
                  title="Voice input"
                >
                  <Mic style={{ width: 16, height: 16 }} />
                </button>
              )}

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-xl transition-all duration-200"
                style={(!input.trim() || isLoading)
                  ? { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', cursor: 'not-allowed', border: 'none' }
                  : { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', cursor: 'pointer', border: 'none', boxShadow: '0 0 14px rgba(99,102,241,0.4)' }
                }
                onMouseEnter={e => { if (input.trim() && !isLoading) { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.6)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = input.trim() && !isLoading ? '0 0 14px rgba(99,102,241,0.4)' : ''; }}
                title="Send message"
              >
                <Send style={{ width: 15, height: 15 }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete session modal */}
      <Modal isOpen={!!sessionToDelete} onClose={() => setSessionToDelete(null)} title="Delete Conversation">
        <div className="space-y-4">
          <p className="text-sm font-dm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Are you sure you want to delete this conversation? This cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button
              onClick={() => setSessionToDelete(null)}
              className="px-4 py-2 text-sm font-dm font-medium rounded-xl transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >
              Cancel
            </button>
            <button
              onClick={() => { deleteSession(sessionToDelete); setSessionToDelete(null); }}
              className="px-4 py-2 text-sm font-dm font-medium rounded-xl flex items-center gap-2 transition-all duration-200"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.35)', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.35)'; e.currentTarget.style.color = '#fecaca'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#fca5a5'; }}
            >
              <Trash2 style={{ width: 14, height: 14 }} /> Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChatBox;
