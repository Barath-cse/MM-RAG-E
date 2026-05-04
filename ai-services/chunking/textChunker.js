class TextChunker {
  /**
   * @param {number} chunkSize - Target chunk size in characters (not words)
   * @param {number} chunkOverlap - Overlap size in characters
   */
  constructor(chunkSize = 1000, chunkOverlap = 200) {
    if (chunkOverlap >= chunkSize) {
      throw new Error('chunkOverlap must be less than chunkSize');
    }
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
  }

  /**
   * Splits text into overlapping chunks, respecting word boundaries.
   * Uses character counts (not word counts) for consistent sizing.
   */
  chunk(text) {
    if (!text || !text.trim()) return [];

    const chunks = [];
    let start = 0;

    while (start < text.length) {
      let end = start + this.chunkSize;

      if (end < text.length) {
        // Walk back to the nearest whitespace to avoid splitting mid-word
        const boundary = text.lastIndexOf(' ', end);
        if (boundary > start) {
          end = boundary;
        }
      } else {
        end = text.length;
      }

      const chunk = text.slice(start, end).trim();
      if (chunk) chunks.push(chunk);

      // Advance by (chunkSize - chunkOverlap) for overlapping windows
      start = end - this.chunkOverlap;

      // Safety: if overlap is too large and we didn't advance, force forward
      if (start <= (chunks.length > 1 ? text.lastIndexOf(' ', start + this.chunkSize - this.chunkOverlap) : 0)) {
        start = end + 1;
      }
    }

    return chunks;
  }
}

module.exports = new TextChunker();
