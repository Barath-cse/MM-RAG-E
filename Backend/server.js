require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const validateEnv = require('./validateEnv');
validateEnv();

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\x1b[32m%s\x1b[0m`, `--------------------------------------------------`);
  console.log(`\x1b[32m%s\x1b[0m`, `🚀 MM-RAG-E Server running on port ${PORT}`);
  console.log(`\x1b[32m%s\x1b[0m`, `📂 Uploads: ${process.env.UPLOAD_DIR}`);
  console.log(`\x1b[32m%s\x1b[0m`, `🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`\x1b[32m%s\x1b[0m`, `--------------------------------------------------`);
});
