const fs = require('fs');
const path = require('path');

class EmbeddedVectorService {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data/vectors.json');
    this.indexName = process.env.ENDEE_INDEX_NAME || 'multimodal-rag';
    this._saveTimer = null;

    if (!fs.existsSync(path.dirname(this.dataPath))) {
      fs.mkdirSync(path.dirname(this.dataPath), { recursive: true });
    }

    this.cache = this._load();
  }

  _load() {
    if (fs.existsSync(this.dataPath)) {
      try {
        return JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'));
      } catch (e) {
        console.warn('[VectorStore] Corrupt vectors.json, starting fresh.');
        return [];
      }
    }
    return [];
  }

  // Debounced save — avoids blocking on every upsert during bulk ingestion
  _scheduleSave() {
    if (this._saveTimer) clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => {
      try {
        fs.writeFileSync(this.dataPath, JSON.stringify(this.cache, null, 2));
      } catch (err) {
        console.error('[VectorStore] Failed to persist vectors:', err.message);
      }
    }, 300);
  }

  async ensureIndex(dimension = 768) {
    console.log(`[VectorStore] Index "${this.indexName}" ready (dim=${dimension})`);
  }

  async upsert(vectors) {
    for (const v of vectors) {
      const existing = this.cache.findIndex(x => x.id === v.id);
      if (existing >= 0) {
        this.cache[existing] = v;
      } else {
        this.cache.push(v);
      }
    }
    this._scheduleSave();
    return `${vectors.length} vector(s) upserted`;
  }

  _cosineSim(A, B) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < A.length; i++) {
      dot += A[i] * B[i];
      normA += A[i] * A[i];
      normB += B[i] * B[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async query(vector, topK = 5, filters = []) {
    let results = this.cache.map(item => ({
      id: item.id,
      score: this._cosineSim(vector, item.vector),
      meta: item.meta || item.metadata || {}
    }));

    // Apply metadata filters: [{ key, value }]
    if (filters.length > 0) {
      results = results.filter(r =>
        filters.every(f => r.meta[f.key] === f.value)
      );
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  async delete(ids) {
    this.cache = this.cache.filter(item => !ids.includes(item.id));
    this._scheduleSave();
    return true;
  }

  async clearAll() {
    this.cache = [];
    this._scheduleSave();
    return true;
  }

  async getStats() {
    return {
      vectorCount: this.cache.length,
      dimension: 768,
      storageSizeBytes: Buffer.byteLength(JSON.stringify(this.cache)),
      indexName: this.indexName
    };
  }
}

module.exports = new EmbeddedVectorService();
