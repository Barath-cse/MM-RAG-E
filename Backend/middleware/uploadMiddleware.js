const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ALLOWED_MIME_TYPES = new Set([
  // Documents
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  // Audio
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/webm',
  'audio/ogg',
  'audio/x-wav',
]);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = process.env.UPLOAD_DIR || './data/uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error(`Unsupported file type: ${file.mimetype}. Allowed: PDF, DOCX, TXT, Images, Audio.`);
    err.statusCode = 415;
    cb(err, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit (was 10MB — audio/images can be larger)
});

module.exports = upload;
