const embeddingService = require('../../Backend/services/embeddingService');
const endeeService = require('../../Backend/services/endeeService');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class QueryPipeline {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'no-key');
  }

  _buildPrompt(userInput, context) {
    const contextSection = context 
      ? `Use the provided Context to answer the user's question accurately. Cite your sources by referring to the [Source: filename] tags in the context.\n\nContext:\n${context}`
      : "You don't have any specific documents in your knowledge base that match this query. Answer the user's question using your general knowledge, but briefly mention that you are answering from general knowledge.";

    return `You are a helpful MultiModal AI assistant.

${contextSection}

Question: ${userInput}

After your answer, provide exactly 3 relevant follow-up questions the user might want to ask, each on a new line prefixed with "SUGGESTION: ".`;
  }

  async query(userInput, filters = []) {
    if (!userInput || !userInput.trim()) {
      throw Object.assign(new Error('Query cannot be empty'), { statusCode: 400 });
    }

    const startTime = Date.now();

    // 1. Embed the query
    const queryEmbedding = await embeddingService.generateTextEmbedding(userInput.trim());
    const searchLatency = Date.now() - startTime;

    // 2. Retrieve relevant chunks
    const searchResults = await endeeService.query(queryEmbedding, 5, filters);

    // 3. Build context string
    const context = searchResults.length > 0
      ? searchResults
        .map(res => {
          const meta = res.meta || {};
          return `[Source: ${meta.originalName} (${meta.type})] ${meta.text}`;
        })
        .join('\n\n')
      : null;

    // 4. Generate answer
    const genStart = Date.now();
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(this._buildPrompt(userInput, context));
    const rawText = result.response.text();
    const generationLatency = Date.now() - genStart;

    // 5. Parse suggestions out of the response
    const lines = rawText.split('\n');
    const suggestions = lines
      .filter(l => l.toUpperCase().startsWith('SUGGESTION:'))
      .map(l => l.replace(/^SUGGESTION:\s*/i, '').trim())
      .filter(Boolean)
      .slice(0, 3);

    const cleanAnswer = lines
      .filter(l => !l.toUpperCase().startsWith('SUGGESTION:'))
      .join('\n')
      .trim();

    return {
      answer: cleanAnswer,
      suggestions,
      stats: {
        searchLatencyMs: searchLatency,
        generationLatencyMs: generationLatency,
        totalLatencyMs: Date.now() - startTime,
        vectorCount: searchResults.length
      },
      sources: searchResults.map(res => ({
        id: res.id,
        score: res.score,
        metadata: res.meta
      }))
    };
  }
}

module.exports = new QueryPipeline();
