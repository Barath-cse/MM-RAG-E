import React, { useState, useCallback, useRef } from 'react';
import { Upload, File, FileText, Image as ImageIcon, Music, CheckCircle, AlertCircle, Loader2, Zap, X } from 'lucide-react';
import { uploadFile } from '../services/api';

/* ── File type chip badges ─────────────────────────────────────────────── */
const FILE_TYPES = [
  { label: 'PDF',   color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.3)' },
  { label: 'DOCX',  color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.3)' },
  { label: 'TXT',   color: '#22d3ee', bg: 'rgba(34,211,238,0.12)',  border: 'rgba(34,211,238,0.3)' },
  { label: 'IMG',   color: '#f472b6', bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.3)' },
  { label: 'Audio', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)' },
];

const UploadForm = ({ onSuccess }) => {
  const [file,       setFile]       = useState(null);
  const [status,     setStatus]     = useState('idle');
  const [message,    setMessage]    = useState('');
  const [progress,   setProgress]   = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const setFileFromInput = (f) => {
    if (!f) return;
    setFile(f);
    setStatus('idle');
    setMessage('');
    setProgress(0);
  };

  const handleFileChange = (e) => setFileFromInput(e.target.files[0]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFileFromInput(dropped);
  }, []);

  const handleDragOver  = useCallback((e) => { e.preventDefault(); setIsDragOver(true);  }, []);
  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null); setStatus('idle'); setMessage(''); setProgress(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const onUpload = async () => {
    if (!file || status === 'uploading') return;
    setStatus('uploading'); setProgress(0);
    try {
      const result = await uploadFile(file, setProgress);
      setStatus('success');
      setMessage(`Indexed "${result.file}" — ${result.chunks} chunk${result.chunks !== 1 ? 's' : ''} stored`);
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      window.dispatchEvent(new Event('knowledge-updated'));
      onSuccess?.();
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error ?? error.message ?? 'Upload failed.');
    }
  };

  const getFileIcon = () => {
    if (!file) return <Upload style={{ width: 28, height: 28 }} />;
    if (file.type.startsWith('image/')) return <ImageIcon style={{ width: 28, height: 28 }} />;
    if (file.type.startsWith('audio/')) return <Music     style={{ width: 28, height: 28 }} />;
    return <FileText style={{ width: 28, height: 28 }} />;
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const dropZoneClass = isDragOver ? 'drop-zone-hover' : file ? 'drop-zone-active' : 'drop-zone-idle';

  return (
    <div className="glass p-5 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center gap-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '14px' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 12px rgba(99,102,241,0.4)' }}>
          <Upload style={{ width: 14, height: 14, color: 'white' }} />
        </div>
        <h2 className="font-syne font-bold text-sm tracking-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>Ingest Knowledge</h2>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !file && inputRef.current?.click()}
        className={`${dropZoneClass} flex flex-col items-center justify-center gap-3 transition-all duration-250 cursor-pointer select-none`}
        style={{ padding: '28px 20px', minHeight: '130px' }}
      >
        {/* Icon */}
        <div
          className="p-3 rounded-full transition-all duration-300"
          style={{
            background: file
              ? 'rgba(99,102,241,0.2)'
              : isDragOver
              ? 'rgba(34,211,238,0.15)'
              : 'rgba(255,255,255,0.06)',
            color: file ? '#818cf8' : isDragOver ? '#22d3ee' : 'rgba(255,255,255,0.4)',
            boxShadow: file ? '0 0 16px rgba(99,102,241,0.3)' : isDragOver ? '0 0 16px rgba(34,211,238,0.3)' : 'none',
          }}
        >
          {getFileIcon()}
        </div>

        {file ? (
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <p className="text-sm font-dm font-semibold truncate max-w-[180px]" style={{ color: 'rgba(255,255,255,0.85)' }}>{file.name}</p>
              <button onClick={clearFile} className="transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                <X style={{ width: 15, height: 15 }} />
              </button>
            </div>
            <p className="text-xs font-dm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{formatSize(file.size)}</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-dm font-medium" style={{ color: isDragOver ? '#22d3ee' : 'rgba(255,255,255,0.6)' }}>
              {isDragOver ? '✦ Drop it right here' : 'Drag & drop or click to browse'}
            </p>
            <p className="text-xs font-dm mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>PDF · DOCX · TXT · Images · Audio · Max 25 MB</p>
          </div>
        )}

        <input ref={inputRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.txt,image/*,audio/*" />
      </div>

      {/* File Type Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {FILE_TYPES.map(({ label, color, bg, border }) => (
          <span
            key={label}
            className="text-[10px] font-dm font-semibold px-2 py-0.5 rounded-full"
            style={{ color, background: bg, border: `1px solid ${border}` }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Progress Bar */}
      {status === 'uploading' && (
        <div className="space-y-1.5">
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full progress-shimmer transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] font-mono text-right" style={{ color: 'rgba(255,255,255,0.35)' }}>{progress}%</p>
        </div>
      )}

      {/* Status Messages */}
      {status === 'success' && (
        <div className="flex items-start gap-2.5 text-xs font-dm p-3 rounded-xl" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#6ee7b7' }}>
          <CheckCircle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} />
          <span>{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-start gap-2.5 text-xs font-dm p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
          <AlertCircle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} />
          <span>{message}</span>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={onUpload}
        disabled={!file || status === 'uploading'}
        className="w-full py-2.5 rounded-xl font-dm font-semibold flex items-center justify-center gap-2 text-sm transition-all duration-200"
        style={(!file || status === 'uploading')
          ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.07)' }
          : { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', border: 'none', cursor: 'pointer' }
        }
        onMouseEnter={e => { if (file && status !== 'uploading') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.55)'; } }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = file && status !== 'uploading' ? '0 4px 20px rgba(99,102,241,0.4)' : ''; }}
      >
        {status === 'uploading'
          ? <><Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} /> Indexing{progress > 0 ? ` (${progress}%)` : '…'}</>
          : <><Zap style={{ width: 15, height: 15 }} /> Index Document</>
        }
      </button>
    </div>
  );
};

export default UploadForm;
