const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;

class DocumentParser {
  async parsePdf(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  async parseDocx(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  async parseTxt(filePath) {
    return await fs.readFile(filePath, 'utf8');
  }

  async parse(filePath, mimeType) {
    if (mimeType === 'application/pdf') {
      return await this.parsePdf(filePath);
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await this.parseDocx(filePath);
    } else if (mimeType === 'text/plain') {
      return await this.parseTxt(filePath);
    } else {
      throw new Error(`Unsupported document type: ${mimeType}`);
    }
  }
}

module.exports = new DocumentParser();
