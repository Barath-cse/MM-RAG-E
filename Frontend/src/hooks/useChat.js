import { useState, useCallback, useEffect, useRef } from 'react';
import { queryText, queryVoice } from '../services/api';

const STORAGE_KEY = 'mm-rag-sessions';
const MAX_SESSIONS = 20; // prevent unbounded localStorage growth

const makeSession = () => ({
  id: crypto.randomUUID(),
  title: 'New Conversation',
  messages: [],
  timestamp: Date.now(),
});

const loadSessions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // corrupt data — start fresh
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
};

export const useChat = () => {
  const [sessions, setSessions] = useState(() => {
    const loaded = loadSessions() ?? [];
    if (loaded.length === 0) {
      const fresh = makeSession();
      return [fresh];
    }

    // Distinguish between 'Open' and 'Refresh'
    // sessionStorage persists across refreshes but not across tab closures.
    const SESSION_STARTED = 'mm-rag-session-started';
    const isSessionStarted = sessionStorage.getItem(SESSION_STARTED);

    if (!isSessionStarted) {
      sessionStorage.setItem(SESSION_STARTED, 'true');
      // Create a new session on fresh open if the most recent one isn't empty
      if (loaded[0].messages.length > 0) {
        const fresh = makeSession();
        return [fresh, ...loaded].slice(0, MAX_SESSIONS);
      }
    }
    return loaded;
  });
  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0]?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use a ref to always access the latest activeSessionId inside async callbacks
  const activeSessionIdRef = useRef(activeSessionId);
  useEffect(() => { activeSessionIdRef.current = activeSessionId; }, [activeSessionId]);

  // Persist sessions, but cap the count so localStorage never overflows
  useEffect(() => {
    try {
      const toSave = sessions.slice(0, MAX_SESSIONS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Storage quota exceeded — silently skip
    }
  }, [sessions]);

  // Global clear event (from Navbar "Clear DB" action)
  useEffect(() => {
    const handleClear = () => {
      const fresh = makeSession();
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
    };
    window.addEventListener('clear-chat', handleClear);
    return () => window.removeEventListener('clear-chat', handleClear);
  }, []);

  // Ensure activeSessionId always points to a valid session
  useEffect(() => {
    if (!sessions.find(s => s.id === activeSessionId)) {
      setActiveSessionId(sessions[0]?.id);
    }
  }, [sessions, activeSessionId]);

  const createSession = useCallback(() => {
    const fresh = makeSession();
    setSessions(prev => [fresh, ...prev].slice(0, MAX_SESSIONS));
    setActiveSessionId(fresh.id);
  }, []);

  const switchSession = useCallback((id) => {
    setActiveSessionId(id);
  }, []);

  const deleteSession = useCallback((id) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (filtered.length === 0) {
        const fresh = makeSession();
        // Switch to new session after this render
        setTimeout(() => setActiveSessionId(fresh.id), 0);
        return [fresh];
      }
      return filtered;
    });
    // If deleting the active session, switch to first remaining
    setActiveSessionId(prev => {
      if (prev !== id) return prev;
      const remaining = sessions.filter(s => s.id !== id);
      return remaining[0]?.id ?? null;
    });
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId) ?? sessions[0];
  const messages = activeSession?.messages ?? [];

  const sendMessage = useCallback(async (content, type = 'text') => {
    // Prevent double-sends while already loading
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    const sessionId = activeSessionIdRef.current;
    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      type,
    };

    // Optimistically add user message and auto-title the session
    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId) return s;
      const newTitle = s.messages.length === 0 && typeof content === 'string'
        ? content.slice(0, 40).trimEnd() + (content.length > 40 ? '…' : '')
        : s.title;
      return { ...s, messages: [...s.messages, userMsg], title: newTitle, timestamp: Date.now() };
    }));

    try {
      const response = type === 'text'
        ? await queryText(content)
        : await queryVoice(content);

      const assistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources ?? [],
        transcription: response.transcription ?? null,
        suggestions: response.suggestions ?? [],
        stats: response.stats ?? null,
        type: 'text',
      };

      setSessions(prev => prev.map(s =>
        s.id === sessionId
          ? { ...s, messages: [...s.messages, assistantMsg], timestamp: Date.now() }
          : s
      ));
    } catch (err) {
      const errorText = err.response?.data?.error ?? err.message ?? 'An unexpected error occurred.';
      setError(errorText);

      const errorMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `⚠ ${errorText}`,
        type: 'error',
      };

      setSessions(prev => prev.map(s =>
        s.id === sessionId
          ? { ...s, messages: [...s.messages, errorMsg] }
          : s
      ));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return {
    sessions,
    activeSessionId,
    messages,
    isLoading,
    error,
    sendMessage,
    createSession,
    switchSession,
    deleteSession,
  };
};
