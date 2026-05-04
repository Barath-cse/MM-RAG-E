import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ── Inject fixed aurora blobs + grid overlay into <body> ──────────────────
// These persist across all React routes since they live outside #root
;['aurora-blob-1', 'aurora-blob-2', 'aurora-blob-3', 'grid-overlay'].forEach(id => {
  if (!document.getElementById(id)) {
    const el = document.createElement('div')
    el.id = id
    document.body.insertBefore(el, document.body.firstChild)
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
