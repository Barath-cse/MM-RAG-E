const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const MIME_TYPE_MAP = {
  '.mp3': 'audio/mp3',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.webm': 'audio/webm',
  '.m4a': 'audio/mp4',
  '.flac': 'audio/flac',
};

class AudioService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'no-key');
  }

  _getMimeType(filePath, fallbackMime) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPE_MAP[ext] || fallbackMime || 'audio/webm';
  }

  async transcribe(filePath, mimeType) {
    const audioBuffer = fs.readFileSync(filePath);
    const audioBase64 = audioBuffer.toString('base64');
    const resolvedMime = this._getMimeType(filePath, mimeType);

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([
      'Transcribe this audio strictly verbatim. Do not add any extra text, commentary, or formatting.',
      {
        inlineData: {
          data: audioBase64,
          mimeType: resolvedMime
        }
      }
    ]);
    return result.response.text();
  }
}

module.exports = new AudioService();
