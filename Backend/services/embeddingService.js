const { GoogleGenerativeAI } = require('@google/generative-ai');

class EmbeddingService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'no-key') {
      console.warn('[EmbeddingService] GEMINI_API_KEY not set — embeddings will fail at runtime.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || 'no-key');
  }

  async generateTextEmbedding(text) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  }

  /**
   * Describes an image using Gemini Vision, then embeds the description as text.
   * @param {string} base64Image - Base64-encoded image data
   * @param {string} mimeType - Image MIME type (e.g. 'image/jpeg')
   */
  async generateImageDescription(base64Image, mimeType = 'image/jpeg') {
    const model = this.genAI.getGenerativeModel({ model: 'gemma-3-4b-it' });
    const result = await model.generateContent([
      'Describe this image in detail for indexing in a vector database. Focus on visual elements, setting, and subjects.',
      {
        inlineData: {
          data: base64Image,
          mimeType
        }
      }
    ]);
    return result.response.text();
  }
}

module.exports = new EmbeddingService();
