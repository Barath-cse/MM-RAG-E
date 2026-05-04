import React, { useState } from 'react';
import { User, Bot, FileText, Image as ImageIcon, Music, ChevronDown, ChevronUp, Plus, AlertTriangle, Clock, Layers, Sparkles } from 'lucide-react';

/* ── Source Badge ──────────────────────────────────────────────────────── */
const SourceBadge = ({ src }) => {
  const [expanded, setExpanded] = useState(false);
  const score    = src.score ? (src.score * 100).toFixed(0) : 0;
  const scoreNum = Number(score);
  const scoreClass = scoreNum > 80 ? 'score-high' : scoreNum > 60 ? 'score-medium' : 'score-low';

  const typeColor =
    src.metadata?.type === 'image' ? '#f472b6' :
    src.metadata?.type === 'audio' ? '#fbbf24' : '#22d3ee';

  const TypeIcon =
    src.metadata?.type === 'image' ? ImageIcon :
    src.metadata?.type === 'audio' ? Music      : FileText;

  return (
    <div
      className="flex flex-col overflow-hidden transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid rgba(255,255,255,0.08)`,
        borderRadius: '10px',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${typeColor}44`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between px-3 py-2 cursor-pointer transition-colors"
        style={{ gap: '10px' }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <TypeIcon style={{ width: 12, height: 12, color: typeColor, flexShrink: 0 }} />
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[11px] font-dm font-semibold truncate" style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 160 }}>
              {src.metadata?.originalName || 'Unknown Source'}
            </span>
            <div className="flex items-center gap-2">
              {/* Score bar */}
              <div className="w-14 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className={`h-full rounded-full ${scoreClass}`} style={{ width: `${score}%`, transition: 'width 0.7s ease' }} />
              </div>
              <span className="text-[9px] font-mono font-bold" style={{ color: scoreNum > 80 ? '#34d399' : scoreNum > 60 ? '#fbbf24' : 'rgba(255,255,255,0.35)' }}>
                {score}%
              </span>
            </div>
          </div>
        </div>
        {expanded
          ? <ChevronUp  style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
          : <ChevronDown style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />}
      </div>

      {expanded && src.metadata?.text && (
        <div
          className="px-3 pb-3 text-[10px] font-mono leading-relaxed italic overflow-y-auto custom-scrollbar max-h-[130px] whitespace-pre-wrap"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.2)',
            color: 'rgba(255,255,255,0.45)',
            paddingTop: '8px',
          }}
        >
          "{src.metadata.text}"
        </div>
      )}
    </div>
  );
};

/* ── Stats Bar ─────────────────────────────────────────────────────────── */
const StatsBar = ({ stats }) => (
  <div className="flex items-center gap-3 flex-wrap mt-1">
    {[
      { label: `${stats.searchLatencyMs}ms search`,     icon: Clock  },
      { label: `${stats.generationLatencyMs}ms gen`,    icon: Clock  },
      { label: `${stats.vectorCount} chunk${stats.vectorCount !== 1 ? 's' : ''}`, icon: Layers },
    ].map(({ label, icon: Icon }) => (
      <span
        key={label}
        className="flex items-center gap-1 text-[9px] font-mono"
        style={{
          color: 'rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '6px',
          padding: '2px 6px',
        }}
      >
        <Icon style={{ width: 9, height: 9 }} />
        {label}
      </span>
    ))}
  </div>
);

/* ── Message Bubble ────────────────────────────────────────────────────── */
const MessageBubble = ({ message, onSuggestionClick }) => {
  const isUser  = message.role === 'user';
  const isError = message.type === 'error';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-7 animate-fade-up`}>
      <div className={`flex gap-3 max-w-[88%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={isUser
            ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 14px rgba(99,102,241,0.45)' }
            : isError
            ? { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }
            : { background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 10px rgba(139,92,246,0.2)' }
          }
        >
          {isUser
            ? <User    style={{ width: 14, height: 14, color: 'white' }} />
            : isError
            ? <AlertTriangle style={{ width: 14, height: 14, color: '#f87171' }} />
            : <Sparkles style={{ width: 14, height: 14, color: '#a78bfa' }} />
          }
        </div>

        {/* Bubble */}
        <div
          className="relative px-4 py-3.5"
          style={isUser
            ? {
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                borderRadius: '18px 4px 18px 18px',
                boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
                color: 'rgba(255,255,255,0.95)',
              }
            : isError
            ? {
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '4px 18px 18px 18px',
                color: '#fca5a5',
              }
            : {
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderLeft: '2px solid rgba(99,102,241,0.5)',
                borderRadius: '4px 18px 18px 18px',
                color: 'rgba(255,255,255,0.88)',
              }
          }
        >
          {/* Voice transcription */}
          {message.transcription && (
            <div
              className="mb-3 pb-2 text-xs italic font-dm"
              style={{ borderBottom: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}
            >
              "{message.transcription}"
            </div>
          )}

          {/* Text */}
          <p className="text-sm font-dm leading-relaxed whitespace-pre-wrap">{message.content}</p>

          {/* Sources */}
          {!isUser && !isError && message.sources?.length > 0 && (
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[10px] font-dm font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Retrieved Context
                <span className="w-1.5 h-1.5 rounded-full bg-aurora-emerald inline-block animate-live-pulse" style={{ boxShadow: '0 0 6px #34d399' }} />
              </p>
              <div className="flex flex-col gap-1.5">
                {message.sources.map((src, idx) => (
                  <SourceBadge key={src.id || idx} src={src} />
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {!isUser && !isError && message.stats && (
            <StatsBar stats={message.stats} />
          )}
        </div>
      </div>

      {/* Follow-up suggestions */}
      {!isUser && !isError && message.suggestions?.length > 0 && (
        <div className="mt-2.5 ml-11 flex flex-wrap gap-2 animate-fade-in">
          {message.suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSuggestionClick(s)}
              className="flex items-center gap-1.5 text-[11px] font-dm font-medium transition-all duration-200 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '999px',
                padding: '4px 12px',
                color: 'rgba(255,255,255,0.6)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                e.currentTarget.style.color = '#a5b4fc';
                e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
            >
              <Plus style={{ width: 10, height: 10, color: '#6366f1' }} />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
