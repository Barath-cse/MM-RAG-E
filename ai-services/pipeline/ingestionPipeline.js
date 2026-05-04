const documentParser = require('../document/pdfParser');
const audioService = require('../audio/speechToText');
const textChunker = require('../chunking/textChunker');
const embeddingService = require('../../Backend/services/embeddingService');
const endeeService = require('../../Backend/services/endeeService');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

class IngestionPipeline {
  async process(file) {
    const { path: filePath, mimetype, originalname } = file;

    let content = '';
    let type = '';

    if (mimetype.startsWith('image/')) {
      type = 'image';
      const buffer = await fs.readFile(filePath);
      const base64 = buffer.toString('base64');
      // Pass the actual MIME type through for correct API calls
      content = await embeddingService.generateImageDescription(base64, mimetype);
    } else if (mimetype.startsWith('audio/')) {
      type = 'audio';
      content = await audioService.transcribe(filePath, mimetype);
    } else {
      type = 'document';
      content = await documentParser.parse(filePath, mimetype);
    }

    if (!content || !content.trim()) {
      throw Object.assign(new Error(`Could not extract content from "${originalname}". The file may be empty or corrupted.`), { statusCode: 422 });
    }

    const chunks = textChunker.chunk(content);
    if (chunks.length === 0) {
      throw Object.assign(new Error(`No text chunks produced from "${originalname}".`), { statusCode: 422 });
    }

    await endeeService.ensureIndex();

    // Embed all chunks (sequential to avoid rate-limiting)
    const vectors = [];
    for (const chunk of chunks) {
      const embedding = await embeddingService.generateTextEmbedding(chunk);
      vectors.push({
        id: uuidv4(),
        vector: embedding,
        meta: {
          originalName: originalname,
          type,
          mimeType: mimetype,
          text: chunk,
          uploadDate: new Date().toISOString()
        }
      });
    }

    await endeeService.upsert(vectors);

    return {
      success: true,
      file: originalname,
      chunks: chunks.length,
      type
    };
  }
}

module.exports = new IngestionPipeline();
