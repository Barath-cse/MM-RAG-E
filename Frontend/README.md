# MM-RAG-E Frontend

The React-based dashboard for MultiModal RAG Enterprise (MM-RAG-E).

## Features

- Modern React application built with Vite
- Tailwind CSS for styling
- Real-time chat interface for RAG queries
- File upload functionality for multimodal documents
- Responsive design for enterprise workstations

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **ESLint** - Code linting

## Project Structure

```
Frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and other assets
│   ├── components/     # Reusable UI components
│   │   ├── ChatBox.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   └── UploadForm.jsx
│   ├── hooks/          # Custom React hooks
│   │   └── useChat.js
│   ├── pages/          # Page components
│   │   ├── Dashboard.jsx
│   │   └── LandingPage.jsx
│   ├── services/       # API service functions
│   │   └── api.js
│   ├── App.jsx         # Main app component
│   ├── index.css       # Global styles
│   └── main.jsx        # App entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── eslint.config.js
```
