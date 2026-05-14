const { GoogleGenerativeAI } = require('@google/generative-ai');

// Exponential backoff retry for rate-limited API calls.
// Retries up to `maxRetries` times on 429 errors, doubling the wait each time.
async function withRetry(fn, { maxRetries = 5, baseDelayMs = 2000 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      const is429 =
        err?.status === 429 ||
        err?.message?.includes('429') ||
        err?.message?.toLowerCase().includes('too many requests') ||
        err?.message?.toLowerCase().includes('quota');

      if (is429 && attempt < maxRetries) {
        // Check if the API returned a Retry-After header (in seconds)
        const retryAfter = err?.headers?.['retry-after'];
        const waitMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : baseDelayMs * Math.pow(2, attempt) + Math.random() * 500; // jitter

        console.warn(
          `[EmbeddingService] Rate limited (429). Retry ${attempt + 1}/${maxRetries} in ${Math.round(waitMs / 1000)}s…`
        );
        await new Promise(resolve => setTimeout(resolve, waitMs));
        attempt++;
      } else {
        throw err;
      }
    }
  }
}

class EmbeddingService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'no-key') {
      console.warn('[EmbeddingService] GEMINI_API_KEY not set — embeddings will fail at runtime.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || 'no-key');
  }

  async generateTextEmbedding(text) {
    return withRetry(async () => {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
      const result = await model.embedContent(text);
      return result.embedding.values;
    });
  }

  /**
   * Describes an image using Gemini Vision, then embeds the description as text.
   * @param {string} base64Image - Base64-encoded image data
   * @param {string} mimeType   - Image MIME type (e.g. 'image/jpeg')
   */
  async generateImageDescription(base64Image, mimeType = 'image/jpeg') {
    return withRetry(async () => {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent([
        'Describe this image in detail for indexing in a vector database. Focus on visual elements, setting, and subjects.',
        { inlineData: { data: base64Image, mimeType } },
      ]);
      return result.response.text();
    });
  }
}

module.exports = new EmbeddingService();
