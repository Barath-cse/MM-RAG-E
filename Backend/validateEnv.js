/**
 * Validates required environment variables at startup.
 * Call this before starting the server.
 */
const REQUIRED = ['GEMINI_API_KEY'];
const OPTIONAL = {
  PORT: '5000',
  NODE_ENV: 'development',
  ENDEE_INDEX_NAME: 'multimodal-rag',
  UPLOAD_DIR: './data/uploads',
};

module.exports = function validateEnv() {
  const missing = REQUIRED.filter(k => !process.env[k] || process.env[k] === 'your_google_ai_studio_key_here');

  if (missing.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Missing required environment variables:');
    missing.forEach(k => console.error(`   - ${k}`));
    console.error('\x1b[33m%s\x1b[0m', '\n💡 Copy .env.example to .env and fill in your values.\n');
    process.exit(1);
  }

  // Apply defaults for optional vars
  for (const [key, def] of Object.entries(OPTIONAL)) {
    if (!process.env[key]) {
      process.env[key] = def;
    }
  }

  console.log('\x1b[32m%s\x1b[0m', '✅ Environment validated');
};
