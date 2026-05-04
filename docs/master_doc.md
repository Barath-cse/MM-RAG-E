# MultiModal RAG (MM-RAG-E) Master Documentation

## 1. Project Overview
The **MultiModal RAG System** is a full-stack, AI-powered application designed to ingest files of multiple formats (Text, Images, Audio, PDFs, DOCX), index their semantic meaning into a local Vector Database, and allow users to query this synthesized knowledge base using both text and voice.

### The Problem It Solves
### Traditional RAG (Retrieval-Augmented Generation) systems are often limited to text-only PDFs. This system breaks the barrier by processing multimodal data. If you upload an image, it "sees" it. If you upload an audio file, it transcribed it. All of this knowledge is then centralized so a Large Language Model (LLM) can answer complex questions about your documents while citing exactly where it found the information.

### Real-World Use Cases

#### 1. The Ultimate Student / Researcher Assistant
Instead of manually reading through dozens of heavy PDF textbooks, recorded university lectures, and scanned whiteboard diagrams, a student can upload all of them into this system. They can then ask, *"What was the formula for velocity that the professor wrote on the board in week 3?"* The system will instantly search the scanned images and audio transcripts, find the exact match, and synthesize an accurate answer with a citation to the original file.

#### 2. Enterprise Internal Knowledge Base
Companies deal with scattered formats: employee handbooks (PDFs), meeting recordings (Audio), and UI wireframes (Images). An HR or Engineering team could deploy this project so employees can instantly ask questions like:
- *"What is our corporate policy on remote work expenses?"* (Searches PDFs)
- *"Did we decide to use React or Vue in yesterday's sync meeting?"* (Searches transcribed Audio)
- *"How does the checkout flow diagram look?"* (Searches Image descriptions)

#### 3. Customer Support AI
You can upload your entire product catalog, instruction manuals, and photos of your products. Support agents can type queries like, *"A customer has a red blinking light on their router, what does the manual say?"* The system will retrieve the exact page of the instruction manual and give the agent the solution in seconds.

#### 4. Hands-Free Conversational AI
Because the system supports **voice queries**, workers in the field (e.g., mechanics or technicians) could speak into a microphone: *"What does the blueprint say about this engine valve?"* The system will listen, transcribe the voice, search the uploaded blueprint images, and provide the exact instructions.

---

## 2. Architecture & Working Flow

### A. The Data Ingestion Flow (Upload)
When a user drags and drops a file via the Frontend dashboard:
1. **Routing:** The file hits `Backend/routes/uploadRoutes.js`.
2. **Pipeline Processing:** The file is handed off to `ai-services/pipeline/ingestionPipeline.js`.
3. **Modality Parsing:**
   - **Documents (.pdf, .docx):** Parsed using libraries like `pdf-parse` and `mammoth` into raw text.
   - **Images:** Converted to base64 and sent to the LLM (Google Gemini / Gemma) to generate a detailed textual description of the image.
   - **Audio:** Processed through Speech-to-Text services (like Whisper) to generate text transcripts.
4. **Chunking & Embedding:** The extracted text is chopped down into smaller pieces (chunks) using `textChunker`. Each chunk is passed to `embeddingService.js`, which queries the `gemini-embedding-001` model to create a 768-dimension mathematical coordinate (vector) representing the semantic meaning of the text.
5. **Storage:** The chunks, metadata, and vectors are saved directly to the high-speed local database via `endeeService.js`.

### B. The Query Flow (Chatting)
When a user asks a question:
1. **Routing:** Hits `Backend/routes/queryRoutes.js`.
2. **Query Pipeline:** `ai-services/pipeline/queryPipeline.js` takes over.
3. **Question Embedding:** The user's question itself is converted into a vector coordinate.
4. **Context Retrieval:** The `endeeService.js` conducts a pure Cosine Similarity search matching the question's coordinates against all stored chunks in the vector DB. The top most relevant chunks are retrieved.
5. **Synthesis:** The retrieved chunks are given to the Generative LLM (`gemma-3-4b-it`) as context. The LLM reads the context and drafts a human-readable answer.
6. **Response Delivery:** The Frontend receives the synthesized answer alongside the cited source IDs and renders them beautifully.

---

## 3. Technology Stack & Components

### Frontend
- **React 19 + Vite:** The core framework structure rendering lightning-fast UI components.
- **Tailwind CSS:** For clean, atomic CSS styling and layouts.
- **Framer Motion:** Handles the buttery-smooth micro-animations across the user interface.
- **Lucide-React:** For crisp, modern SVG icons.
- **React Router:** Handles navigation across app views.
- **Axios:** Handles API calls payload delivery to the backend.

### Backend Infrastructure
- **Node.js + Express.js:** The core MVC backbone maintaining the REST API.
- **Cors, Express Router, Multer:** Core routing and file upload handling middlewares.

### AI & Pipeline Services Layer
- **Google Generative AI SDK (`@google/generative-ai`):** Powers the core intelligence of the application.
  - Generates embeddings (`gemini-embedding-001`).
  - Synthesizes answers and describes images (`gemma-3-4b-it` or `gemini-1.5-flash`).
- **Endee Engine (`endeeService.js`):** 
  - *Context:* Endee is a high speed vector database. To ensure cross-platform compatibility on Windows without needing external native C++ servers or Docker pipelines, the service was elegantly refactored to an **Embedded JSON Vector Service**. It holds vectors in local memory, calculates Cosine Similarity math on the fly, and snapshots data persistency to `data/vectors.json`.
- **Text & Doc Parsers (`pdf-parse`, `mammoth`):** Responsible for shredding proprietary document formats into readable string outputs.

---

## 4. Directory Structure Explanation

```
MM-RAG-E/
│
├── Frontend/                   # Contains all React UI logic
│   ├── src/components/         # Reusable UI parts (ChatBox, Uploader, etc)
│   ├── src/index.css           # Global Tailwind declarations
│   └── package.json            # Frontend dependencies
│
├── Backend/                    # The Express API Server layer
│   ├── server.js & app.js      # Main Express initialization and port listening
│   ├── controllers/            # Middlemen that execute logic based on API routes
│   ├── routes/                 # Endpoint declarations (/api/upload, /api/query)
│   ├── middleware/             # Error catching (errorHandler.js)
│   └── services/               # Core execution scripts
│       ├── embeddingService.js # Talks to Google Gemini to get coordinates
│       └── endeeService.js     # Embedded Vector DB engine
│
├── ai-services/                # Highly specialized RAG logical components
│   ├── pipeline/               # The "glue" tying extraction, embedding, and saving together
│   │   ├── ingestionPipeline.js# Upload workflow
│   │   └── queryPipeline.js    # Chatting workflow
│   ├── document/               # PDF / Word parser logic
│   ├── audio/                  # Speech to Text logic
│   └── chunking/               # Text shredder algorithms 
│
├── data/                       
│   ├── uploads/                # Temporarily stored raw files for previewing
│   └── vectors.json            # The permanent local cache of all vector intelligence
│
└── .env                        # Centralized file containing API keys and Ports
```

---

## 5. Summary / Quick Commands
- **Initialization:** `npm install` inside the root and `Frontend` directories.
- **Running:** The command `npm run dev` kicks off the `concurrently` package, launching both the Vite frontend and standard Node backend monitor (`nodemon`) natively within one terminal. 
- **Extending the Project:** If you ever outgrow the embedded `vectors.json` database or the `gemma-3-4b-it` LLM, simply modify the variables inside `Backend/services/endeeService.js` and `ai-services/pipeline/queryPipeline.js` to target a dedicated hosted environment.

---

## 6. Future Enhancements & Next-Level Features
To elevate this project from a powerful prototype to an Enterprise-Grade system, consider implementing the following "Next-Level" features:

### 1. Agentic Capabilities (Tool Use)
Currently, the LLM only reads the vector database. You could upgrade it to an **Agent** by giving it API tools. If a user asks *"What's the weather today?"* or *"Fetch the latest stock price for Apple"*, the LLM could proactively trigger a web-search tool instead of just searching the local files.

### 2. Semantic Chunking & Cross-Encoder Reranking
Instead of cutting documents arbitrarily by character count (which can split sentences in half), implement **Semantic Chunking** so documents are split along natural topic borders. Additionally, put a **Cohere Re-Ranker** between the Vector DB and the LLM. The Vector DB retrieves the top 20 chunks incredibly fast, and the Re-Ranker strictly orders them by exact contextual relevance, drastically reducing hallucinations.

### 3. Multi-Tenancy & Access Control (ACL)
In a real enterprise, the Marketing department shouldn't be able to query the HR department's confidential payroll PDFs. Implement **Namespaces or Multi-Tenancy** in the vector database alongside a Login system (Auth0/NextAuth) so users only chat with files *they* are authorized to access. 

### 4. Graph RAG (Knowledge Graphs)
Combine Vector Search with a Graph Database like Neo4j. When a document is uploaded, extract the entities (e.g., "Elon Musk", "Tesla") and draw relationships. When a user asks a complex multi-hop question (*"Who is the CEO of the company that made the car mentioned in document B?"*), Graph RAG traces the exact logical chain instead of relying on pure keyword/semantic proximity.

### 5. WebSocket Response Streaming
Right now, the user waits for the entire LLM answer to generate before it appears on the screen. By replacing standard HTTP POST with **Server-Sent Events (SSE)** or WebSockets, you can stream the words onto the frontend chat UI one token at a time (just like ChatGPT).

### 6. Local LLM Privacy Mode (Ollama)
For highly confidential law firms or hospitals, sending data to Google Gemini might violate data policies. You could integrate **Ollama** so the embedding generation and LLM text generation happen 100% offline on the user's local GPU, guaranteeing absolute data privacy.
