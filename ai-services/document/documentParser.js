const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const officeparser = require('officeparser');
const fs = require('fs').promises;
const path = require('path');

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

  async parseExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    let content = '';
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      content += `Sheet: ${sheetName}\n`;
      content += xlsx.utils.sheet_to_txt(worksheet);
      content += '\n\n';
    });
    return content;
  }

  async parsePpt(filePath) {
    return new Promise((resolve, reject) => {
      officeparser.parseOffice(filePath, (data, err) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }

  async parseTxt(filePath) {
    return await fs.readFile(filePath, 'utf8');
  }

  async parse(filePath, mimeType) {
    const ext = path.extname(filePath).toLowerCase();
    
    // Check by extension first for better reliability with some office types
    if (ext === '.pdf' || mimeType === 'application/pdf') {
      return await this.parsePdf(filePath);
    } 
    
    if (ext === '.docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await this.parseDocx(filePath);
    }

    if (['.xlsx', '.xls', '.csv'].includes(ext) || 
        ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'].includes(mimeType)) {
      return await this.parseExcel(filePath);
    }

    if (['.pptx', '.ppt'].includes(ext) || 
        ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint'].includes(mimeType)) {
      return await this.parsePpt(filePath);
    }

    if (['.txt', '.md', '.json', '.js', '.py', '.html', '.css'].includes(ext) || mimeType.startsWith('text/')) {
      return await this.parseTxt(filePath);
    }

    // Fallback to officeparser for any other office-like formats
    if (['.doc', '.dot', '.odt', '.rtf'].includes(ext)) {
      return await this.parsePpt(filePath); // officeparser handles these too
    }

    throw new Error(`Unsupported document type: ${mimeType} (${ext})`);
  }
}

module.exports = new DocumentParser();
