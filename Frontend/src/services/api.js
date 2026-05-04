import axios from 'axios';

// In development, Vite proxies /api to localhost:5000 (see vite.config.js).
// In production, set VITE_API_BASE_URL to your deployed backend URL.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90s — LLM generation can take a while
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. The server may be busy.'));
    }
    if (!err.response) {
      return Promise.reject(new Error('Cannot reach the server. Is the backend running on port 5000?'));
    }
    return Promise.reject(err);
  }
);

export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
      ? (e) => onProgress(Math.round((e.loaded * 100) / e.total))
      : undefined,
  });
  return response.data;
};

export const queryText = async (query, filters = []) => {
  const response = await api.post('/query/text', { query, filters });
  return response.data;
};

export const queryVoice = async (audioBlob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice-query.webm');
  const response = await api.post('/query/voice', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
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

export default api;
