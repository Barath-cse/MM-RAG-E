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
    const result = await ingestionPipeline.process(req.file);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  } finally {
    // Always clean up the uploaded file after processing
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
