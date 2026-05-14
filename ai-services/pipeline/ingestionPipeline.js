const documentParser = require('../document/documentParser');
const audioService = require('../audio/speechToText');
const textChunker = require('../chunking/textChunker');
const embeddingService = require('../../Backend/services/embeddingService');
const endeeService = require('../../Backend/services/endeeService');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Embed chunks in small batches with a short pause between batches.
 * Concurrency=2 and a 500ms inter-batch gap keeps us well under
 * Gemini's free-tier rate limit (1,500 RPM for embedding-001).
 * The retry logic in embeddingService handles any residual 429s.
 */
async function embedInBatches(chunks, { concurrency = 2, batchPauseMs = 500, signal } = {}) {
  const results = new Array(chunks.length);

  for (let batchStart = 0; batchStart < chunks.length; batchStart += concurrency) {
    if (signal?.aborted) {
      throw Object.assign(new Error('Ingestion cancelled by user'), { name: 'AbortError' });
    }
    const batchEnd = Math.min(batchStart + concurrency, chunks.length);
    const batch = chunks.slice(batchStart, batchEnd);

    const batchResults = await Promise.all(
      batch.map((chunk) => embeddingService.generateTextEmbedding(chunk))
    );

    for (let j = 0; j < batchResults.length; j++) {
      results[batchStart + j] = batchResults[j];
    }

    // Brief pause between batches to smooth request rate
    if (batchEnd < chunks.length) {
      // Check signal even during/after the pause
      await sleep(batchPauseMs);
      if (signal?.aborted) {
        throw Object.assign(new Error('Ingestion cancelled by user'), { name: 'AbortError' });
      }
    }

    const pct = Math.round((batchEnd / chunks.length) * 100);
    console.log(`[Ingestion] Embedded ${batchEnd}/${chunks.length} chunks (${pct}%)`);
  }

  return results;
}

class IngestionPipeline {
  async process(file, signal) {
    const { path: filePath, mimetype, originalname } = file;

    let content = '';
    let type = '';

    if (mimetype.startsWith('image/')) {
      type = 'image';
      const buffer = await fs.readFile(filePath);
      const base64 = buffer.toString('base64');
      content = await embeddingService.generateImageDescription(base64, mimetype);
    } else if (mimetype.startsWith('audio/')) {
      type = 'audio';
      content = await audioService.transcribe(filePath, mimetype);
    } else {
      type = 'document';
      content = await documentParser.parse(filePath, mimetype);
    }

    if (signal?.aborted) throw Object.assign(new Error('Ingestion cancelled by user'), { name: 'AbortError' });

    if (!content || !content.trim()) {
      throw Object.assign(
        new Error(`Could not extract content from "${originalname}". The file may be empty or corrupted.`),
        { statusCode: 422 }
      );
    }

    const chunks = textChunker.chunk(content);
    if (chunks.length === 0) {
      throw Object.assign(
        new Error(`No text chunks produced from "${originalname}".`),
        { statusCode: 422 }
      );
    }

    console.log(`[Ingestion] "${originalname}" → ${chunks.length} chunks to embed`);
    await endeeService.ensureIndex();

    // Embed in batches of 2 with 500ms pauses — safe for free-tier Gemini quota
    const embeddings = await embedInBatches(chunks, { concurrency: 2, batchPauseMs: 500, signal });

    const vectors = chunks.map((chunk, i) => ({
      id: uuidv4(),
      vector: embeddings[i],
      meta: {
        originalName: originalname,
        type,
        mimeType: mimetype,
        text: chunk,
        uploadDate: new Date().toISOString(),
      },
    }));

    await endeeService.upsert(vectors);

    return {
      success: true,
      file: originalname,
      chunks: chunks.length,
      type,
    };
  }
}

module.exports = new IngestionPipeline();
