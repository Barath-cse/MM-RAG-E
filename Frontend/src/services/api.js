import axios from 'axios';

// In development, Vite proxies /api to localhost:5000 (see vite.config.js).
// In production, set VITE_API_BASE_URL to your deployed backend URL.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // 180s — large files + embedding can take time
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. The server may be busy — try a smaller file or retry.'));
    }
    if (err.code === 'ERR_CANCELED') {
      return Promise.reject(new Error('Upload cancelled.'));
    }
    if (!err.response) {
      return Promise.reject(new Error('Cannot reach the server. Is the backend running on port 5000?'));
    }
    return Promise.reject(err);
  }
);

/**
 * Upload a file with progress tracking and optional abort support.
 * @param {File} file
 * @param {(pct: number) => void} [onProgress]
 * @param {AbortSignal} [signal]
 */
export const uploadFile = async (file, onProgress, signal) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload/file', formData, {
    // Do NOT set Content-Type manually — let axios/browser set the
    // multipart boundary automatically. Setting it manually is a common
    // cause of "Unexpected end of form" errors on the server.
    onUploadProgress: onProgress
      ? (e) => {
          // e.total can be 0 or undefined if the server doesn't send
          // Content-Length; fall back to 99 so the bar never gets stuck.
          const pct = e.total
            ? Math.round((e.loaded * 100) / e.total)
            : 99;
          onProgress(Math.min(pct, 99)); // cap at 99 until server confirms
        }
      : undefined,
    signal, // AbortController signal for cancellation
  });

  if (onProgress) onProgress(100); // server responded — mark complete
  return response.data;
};

export const queryText = async (query, filters = []) => {
  const response = await api.post('/query/text', { query, filters });
  return response.data;
};

export const queryVoice = async (audioBlob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice-query.webm');
  const response = await api.post('/query/voice', formData);
  return response.data;
};

export const clearKnowledgeBase = async () => {
  const response = await api.delete('/upload/clear');
  return response.data;
};

export const getSystemStats = async () => {
  const response = await api.get('/system/stats');
  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get('/system/documents');
  return response.data;
};

export const deleteDocument = async (filename) => {
  const response = await api.delete(`/system/documents/${encodeURIComponent(filename)}`);
  return response.data;
};

export default api;
