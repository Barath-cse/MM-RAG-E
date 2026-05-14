const ingestionPipeline = require('../../ai-services/pipeline/ingestionPipeline');
const endeeService = require('../services/endeeService');
const fs = require('fs').promises;

exports.handleUpload = async (req, res, next) => {
  let filePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    filePath = req.file.path;
    console.log(`[Upload] Processing "${req.file.originalname}" (${(req.file.size / 1024).toFixed(1)} KB, ${req.file.mimetype})`);

    // Use a simple state object for cancellation to ensure maximum compatibility
    const abortState = { aborted: false };
    
    // Listen to both req and res for connection closure
    const onAbort = () => {
      if (!res.writableEnded && !abortState.aborted) {
        console.log(`[Upload] Client disconnected for "${req.file.originalname}", stopping ingestion...`);
        abortState.aborted = true;
      }
    };
    
    req.on('close', onAbort);
    res.on('close', onAbort);

    const result = await ingestionPipeline.process(req.file, abortState);

    console.log(`[Upload] Done — ${result.chunks} chunks indexed for "${result.file}"`);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  } finally {
    // Always clean up the temp file after processing (success or failure)
    if (filePath) {
      fs.unlink(filePath).catch(err =>
        console.warn(`[Upload] Could not delete temp file ${filePath}:`, err.message)
      );
    }
  }
};

exports.handleClear = async (req, res, next) => {
  try {
    await endeeService.clearAll();
    res.status(200).json({ success: true, message: 'Knowledge base cleared' });
  } catch (error) {
    next(error);
  }
};
